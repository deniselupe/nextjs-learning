/*
    Static Site Generation w/ Dynamic Parameters

    So far we've had a look at Static Site Generation 
    with and without having to fetch external data.

    We have our `index` page, which doesn't need 
    external data, and we also have the `users` page
    which fetches a list of users from JSONPlaceholder 
    API and renders it in the browser. 

    Displaying a list of data is very common in web apps
    and you now know how to render such pages with 
    getStaticProps(). 

    Now what is common is the Master-
    Detail UI pattern (AKA list detail pattern).

    In this pattern you have a master page, which displays 
    a list of items and a details page which shows the 
    relevant information of a selected item in the master 
    page. For example, you can consider a blogging site.

    When a user lands on your homepage, they are presented with 
    a list of all your blog articles. When they click on 
    one of the articles, they are navigated to a page where 
    the actual article content is present. This scenario 
    with Next.js routing is very simple to implement. 
    We can add a `/blog` route which renders a list of 
    articles, and we can add a `/blog/blogId` route which
    renders the individual article details.

    But staying in line with our topic of discussion, 
    we want both these routes to be pre-rendered. We already
    learned the benefits of pre-rendering pages, so it is 
    quite natural we want the feature in our blogging
    site as well. 

    But we do have something different from what we 
    have seen earlier, which is the dynamic blogId 
    parameter for each blog post. So let's now learn 
    how to statically generate pages with dynamic 
    parameters. 

    Now for our external data, we are going to rely on 
    JSONPlaceholder, and use the https://jsonplaceholder.typicode.com/posts 
    endpoint which returns an array of 100 posts (each post 
    is an object). We also have endpoints like 
    https://jsonplaceholder.typicode.com/posts/1 which returns the 
    data corresponding to one single post. 

    We can use the `/posts` for the master page, and 
    `/posts/postId` for the details page. The data is 
    not exactly blog data, but this data helps 
    serve the purpose for this lesson.

    This lesson is going to be broken down into 2 parts:
    - Implement the `/posts` data to build the master page
        using getStaticProps(). 
    - Implement the `/posts/postId` detail route with 
        the dynamic parameter.
        
    In the /pages folder of our project, we create a new
    folder called /posts. Within the /posts folder create a 
    new file called index.tsx. Within the index.tsx file,
    we will create our <PostList /> component.

    To implement this component, we first need the `/posts` 
    external data. We could of course make use of the useEffect()
    hook to fetch the data, but that would not help pre-render 
    the list of posts. What we need is the getStaticProps() 
    function instead. Because fetching from 
    'https://jsonplaceholder.typicode.com/posts' returns 
    data on 100 posts, we are going to slice the data so that 
    getStaticProps() only returns a list of 3 posts. 

    In the <PostList /> component, we will destructure the 
    posts prop, and for its JSX we will render the 
    post id, and the post title for each post.

    As a result, the when you visit the `/posts` master 
    page, you should see 3 posts listed on the page.

    Next, we will build the postId details page.

    Within the /pages/posts/ folder, create a new file called
    [postId].tsx. We need a dynamic route, and this [postId].tsx 
    is going to be our parameter. Within the [postId].tsx file, 
    we define a <Post /> component. 

    To implement this <Post /> component, we first need the post 
    data corresponding to the post id. 

    As mentioned previously, using useEffect is not what 
    we want to do. We want to pre-render the post id 
    detail page, so we will need to use getStaticProps() 
    instead.

    We will define a asynchronous function called getStaticProps(),
    and within the function body we will make our API call 
    to 'https://jsonplaceholder.typicode.com/posts/1', but we 
    want to replace the `/posts/1` with the postId that we 
    extract from the URL.

    Now the question is, how do we get hold of the route 
    parameter within getStaticProps()? Well, as it turns out,
    getStaticProps() can receive an argument. The convention 
    is to call the argument 'context', but you can call it 
    anything you want. This 'context' parameter is an object 
    which contains a key called 'params'. Let's go ahead and 
    destructure 'params'.

    The 'params' object will contain the 'postId' route 
    parameter. So in our API endpoint, we can now use string 
    interpolation to add the postId at the end. 

    So the endpoint for the API call is now:
    `https://jsonplaceholder.typicode.com/posts/${params.postId}`

    Once we have the response, we return an object that must
    contain a `props` key, `props` is also an object that contains
    a `post` key. The `post` key returns the response.data from 
    our API call. 

    Now that we have the data, let's destructure it from the 
    <Post /> componenet props, and in the JSX let's render the 
    post id, title, and body. 

    As the final step, let's add links to navigate to the 
    details page, all the way from the home page. 

    So within the /pages/index.tsx file, within the <Home /> 
    component, add:

        <Link href=''>Posts</Link>
    
    And within the /posts/index.tsx file, within the <PostList /> 
    component, we will also add <Link /> components for each post listed.

    {
        posts.map((post) => {
            return (
                <div key={post.id}>
                    <Link href={`posts/${post.id}`}>
                        <h2>{post.id}{post.title}</h2>
                    </Link>
                </div>
            )
        })
    }

    Now if we visit the home page in the browser, and click on 
    the Posts link, it successfully takes you to the Posts page.

    The Posts page will list the 3 posts that we fetched. If we click
    any of those links though, we get routed to a page that gives 
    us an error that says:

        Error: getStaticPaths is required for dynamic SSG pages and is missing for '/posts/[postId]'.
        Read more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value

    We did successfully navigate to /posts followed by postId, but 
    the page does not render and instead throws an error. 

    Now what is this getStaticPaths? What role does getStaticPaths play?
    And how do we fix this error? 

    Let's take a look at all of that in the next lesson.
*/

import axios from 'axios';
import Link from 'next/link';
import { PostType } from '../../types/post';

interface PostListProps {
    posts: PostType[];
}

function PostList({ posts }: PostListProps) {
    return (
        <>
            <h1>List of Posts:</h1>
            {
                posts.map((post) => {
                    return (
                        <div key={post.id}>
                            <Link href={`/posts/${post.id}`}>
                                <h2>{post.id} {post.title}</h2>
                            </Link>
                            <hr />
                        </div>
                    )
                })
            }
        </>
    );
}

export default PostList;

export async function getStaticProps() {
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const data = response.data;

    return {
        props: {
            posts: data
        },
    };
}