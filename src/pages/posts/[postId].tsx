/*
    getStaticPaths fallback: true

    Previously, we covered what happens when fallback is set to false.
    - The paths returned from getStaticPaths will be rendered to HTML at build time by 
      getStaticProps.
    - If fallback is set to false, then any paths not returned by getStaticPaths will result 
      in a 404 page.

    Let's understand with an example what happens when fallback is set to true.


    Step 1:
    The paths returned from getStaticPaths will be rendered to HTML at build time 
    by getStaticProps. This is the same as fallback: false, so this is nothing new.
    
    So back in our code, we are going to reduce the number of posts 
    back down to 3 posts. Afterwards, the next step (important step) is to set our fallback value to true. We will also 
    going to include a console.log() statement in getStaticProps which will help us better understand the 
    fallback: true behavior. 

    Afterwards, in the terminal, run the command `npm run build`. 

    You will see the build throws an error. The error says:
    "[    ] info  - Generating static pages (0/12)TypeError: Cannot read properties of undefined (reading 'id')
    at Post (/home/ptilol/workspace/nextjs-learning/.next/server/pages/posts/[postId].js:61:26)"

    Now we will understand why this happens in the next few points, but for now, we can fix 
    this by using a flag that the Next Router package provides. 

    import { useRouter } from 'next/router';

    After importing useRouter, call the hook and assign the return value to a `router` 
    variable inside the <Post /> component.

    Next, just after creating your `router` variable, create an if statement that checks 
    `router.isFallback` and returns a <h1>Loading...</h1> header if `router.isFallback` 
    is true.

        export default function Post({ post }: PostProps) {
            const router = useRouter();

            if (router.isFallback) {
                return <h1>Loading...</h1>
            }

            return (
                <>
                    <h2>{post.id} {post.title}</h2>
                    <p>{post.body}</p>
                </>
            );
        }

    Now run the `npm run build` command once more. 

    You can see that the build succeeds, and in the build logs we can see the log 
    statements from getStaticProps.

        Generating page for /posts/1
        Generating page for /posts/2
        Generating page for /posts/3

    If we inspect the build folder which is the .next folder, go to server/pages/posts/, we see 
    the HTML and JSON generated for postId 1, 2, and 3. These are the postIds returned from 
    getStaticPaths. This covers our first point.


    Step 2:
    The paths that have not been generated at build time will not result in a 404 page. Instead, 
    Next.js will serve a "fallback" version of the page on the first request to such a path.

    Back in the terminal, run `npm run start` to start serving the application.

    Now closely observe what is rendering on the screen, when we navigate to different pages 
    via URL. 

    First, manually navigate to localhost:3000/posts/1 via URL address. When navigating, the post 
    details are present. You will not see any 'Loading...' text in the UI. This behavior will be the same 
    if you visit localhost:3000/posts/2 and localhost:3000/posts/3 directly via URL address.

    However, it is not the same behavior if you were to navigate directly to localhost:3000/posts/4. 
    Visiting localhost:3000/posts/4 directly, we observe a 'Loading...' fallback for a fraction of a 
    second before the post details are rendered. If we request this path directly again, you will 
    not longer see the Loading UI. 

    But as you can see, the paths that have not been generated at build time will not 
    result in a 404 page.

    So /posts/4 was not generated at build time. However when we navigated to this route, the 
    404 page was not shown. Instead, what we saw was a fallback version of the page. In our example, 
    the fallback version of the page is the Loading... text which is why we see the Loading... text 
    in the initial request for /posts/4.


    Step 3:
    In the background, Next.js will statically generate the requested path HTML and JSON. This 
    includes running getStaticProps. 

    So if you take a look at the terminal, you can see the console.log() statement from 
    getStaticProps "Generating page for /posts/4". And if you take a look at `.next/server/pages/posts/`, 
    you will see that we now have `4.html` and `4.json` files present.

    So when you make an initial request to a path not returned by getStaticPaths, which is 
    postId === 4 in this case, the getStaticProps is run and the HTML as well as JSON 
    are statically generated in the background.

    
    Step 4:
    When background static generation is done, browser receives JSON for generated path.

    To see what we mean by this, open the Network tab on your browser's Developer Tools.
    After, directly visit localhost:3000/posts/5. 

    You can see that `5.json` is fetched in the browser. This JSON will be used to automatically 
    render the page with the required props. 

    From the user's perspective, the page will be swapped from the fallback page to the full page.
    So as soon as the JSON is downloaded, Next.js automatically uses it provide the necessary 
    props for the page component. `router.isFallback` will also be set to false and the full 
    page .jsx is rendered in the browser. 
    
    And it is because of this switch from a fallback to the full page that we need to handle 
    the condition where props are not yet available in the component, so if fallback
    is set to true it means that Next.js is generating the HTML and JSON in the background and 
    the props or the post in our case is not yet available, which means we cannot access 
    id, title, or body. 

    If fallback is false however, the props are available and can be used in the JSX. 

    This is what point number four states. Once the JSON is received in the browser, Next.js 
    will swap from thne fallback page to the full page.


    Step 5:
    The final point says that Next.js keeps track of the new list of pre-rendered pages. 
    Subsequent requests to the same path will serve the generated page, just like other 
    pages pre-rendered at build time.

    And this is a really important point to keep in mind. 

    If you go to the Network tab, and inspect the document served when we navigate to 
    /posts/5, you can see it is an HTML document. 

    But, if you preview it, it is actually the loading text that you see, so the very 
    first request to a path not returned by getStaticPaths will always return the fallback page. 

    However, the full page is pre-rendered in the background which will be used for any
    subsequent requests. So if we just refresh the page without emptying cache, you can see the 
    HTML returned from the server.

    Now, contains the full page content. This is the gist of point number five. 

    Hopefully you now have a decent idea of what happens when you set `fallback: true`. 


    Summary:
    Let me repeat the points by navigating to one more page to help you cement the `fallback:true`
    behavior.

    With `fallback: true` only the paths retujrned from getStaticPaths are pre-rendered at build time.
    So HTML and JSON for postId 1, 2, and 3 are generated.

    If we navigate to a path not generated from getStaticPaths like /posts/6, a 404 page is NOT
    returned, instead a fallback UI is presented, and in teh background, the page is statically generated.

    At the moment, we are using the Loading... text as the fallback UI, but we can include a well
    designed loading indicator.

    While this fallback UI is being displayed, in the background, getStaticProps is called with the 
    appropriate postId, and the HTML and JSON files are generated in the build folder.

    So `6.html` and `6.json`. The first request to this new path will load the fallback page. 

    Subsequent requests though, will load the full page. 


    Additional Key Points:
    This is the behavior when `fallback: true`. Now you might have a question of "What happens if the 
    user makes a request to /posts/101? Our postIds range from 1 to 100, there is nothing returned for 
    postId 101". 

    Well a possible solution is to return a 404 page. And Next.js makes it really simple to do that.

    In getStaticProps, if you are not happy with the response, we can return an object with a `notFound` 
    property set to `true`. 

    So if this is the case, Next.js will automatically render the 404 page. 

    For our {postId} page, the API is supposed to respond with an object that contains a post id, title, and body.
    So we can make a check to see if the data object contains an `id` and if it doesn't, return an object with `notFound: true`. 

    So update the code so it now has:

        export const getStaticProps: GetStaticProps = async (context) => {
            const { params } = context as  { params: Params };

            const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${params.postId}`);
            const data = response.data;

            if (!data.id) {
                return {
                    notFound: true,
                };
            }

            console.log(`Generating page for /posts/${params.postId}`);

            return {
                props: {
                    post: data,
                },
            };
        };

    So now let's delete the .next folder and rebuild the the application (npm run build) and 
    then start the application by running `npm run start`.

    In the browser, if we navigate to /posts/1, it works fine. If we directly visit /posts/100, 
    we see the loading text (fallback UI), and then the post details (full page JSX).
    
    If we naviagate to /posts/101 though, we see the Loading... text (fallback UI), but now 
    the 404 page is rendered in the browser.

    So with a `notFound: true` property, the page will return a 404 page. 

    Now another point we would like to highlight is the <Link /> component pre-fetching. 

    If we load all the 100 posts, and navigate to the post detail page, the Loading... fallback UI
    is not shown since the HTML and JSON for a link component is pre-fetched. Let us show what we mean by 
    that. 

    In the <PostList /> component, which is located in `/posts/index.tsx`, we are going to return all 
    the 100 posts instead of just the first 3. 

    In getStaticPaths though, we will still return only 3 pages to be pre-rendered. 

    When we rebuild the application, the three pages are generated in the server/pages/posts/ folder.

    If we start the app, and navigate directly to /posts/, which renders the <PostList /> component, 
    you can see in the Network tab, the JSON data for postIds 1, 2, 3 have been pre-fetched, any <Link /> 
    component that's in the viewport, initially or through scroll, will be pre-fetched.

    And the same are available in the server/pages folder. You will see that pre-fetched links will have 
    their HTML and JSON files generated in the server/pages folder.

    Because of this, even when we navigate to /posts/4 (clicking on the <Link />, not visiting route directly), we 
    don't see the Loading... text fallback, since there is no new data to be fetched. This is also the reason 
    we have been directly to the page instead of navigating through the <Link /> component. 

    When you're testing this `fallback: true` make sure you make note of all these situations 
    to avoid any confusion.

    ---

    Now when do you use fallback: true?

    The true value is most suitable if your app has a very large number of static pages that depend 
    on data. 
    
    For example, large e-commerce site. You want all the pages to be pre-rendered, but if you 
    have a few thousand products, build can take a really long time. Instead, you may statically 
    generate a small subset of products that are popular, and use fallback: true for the rest. 

    When someone makes a request to a page that is not generated yet, the user will see the page with 
    the fallback UI. Shortly after, getStaticProps finishes and the page will be rendered with the requested data. 

    From then onwards, everyone who requests the same page will get the statically pre-rendered page.
    
    This ensures that users will always have a fast experience while preserving fast builds and the benefits 
    of Static Generation.
*/

import axios from 'axios';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PostType } from '../../types/post';
import { useRouter } from 'next/router';

interface PostProps {
    post: PostType;
}

export default function Post({ post }: PostProps) {
    const router = useRouter();

    // Use useRouter().isFallback to track if a path's fallback UI should be rendered or not
    // When it's true, return the fallback UI, when it's false, display the other return JSX
    // We are using it in this example because getStaticPaths returns `fallback: true` (no 404 on paths not generated in build time, show fallback UI instead).
    if (router.isFallback) {
        return <h1>Loading...</h1>
    }

    return (
        <>
            <h2>{post.id} {post.title}</h2>
            <p>{post.body}</p>
        </>
    );
}

// getStaticPaths tells you which dynamic paths to initially pre-render at build time
export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { postId: '1' },
            },
            {
                params: { postId: '2' },
            },
            {
                params: { postId: '3' },
            }
        ],
        fallback: true
    };
};

// Extending the ParsedUrlQuery interface to resolve the following issue experienced
// https://wallis.dev/blog/nextjs-getstaticprops-and-getstaticpaths-with-typescript
interface Params extends ParsedUrlQuery {
    postId: string;
}

// getStaticProps tells you what content to pre-render for a path at build time
export const getStaticProps: GetStaticProps = async (context) => {
    const { params } = context as { params: Params };

    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${params.postId}`);
    const data = response.data;

    // In this example, the API only returns data for posts 1-100, if user requests postId 101, we need to let Next.js know that it doesn't exist, to return a 404 page
    // The returned object with notFound: true lets Next.js know to return a 404 page.
    if (!data.id) {
        return {
            notFound: true,
        };
    }

    console.log(`Generating page for /posts/${params.postId}`);

    // Whenever there is post data to return for a postId, return an object with a props attribute that is actually an object itself.
    // The attributes inside the props object is the props you can then use in the <Post /> component.
    return {
        props: {
            post: data,
        },
    };
};