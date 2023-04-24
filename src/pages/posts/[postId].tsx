/*
    Static-Site Generation w/ getStaticProps

    In the previous lesson we tried to implement
    static generation using getStaticProps for a page
    with dynamic route parameter.

    When we navigated to the page though, we were 
    presented with the following error:

    Error: getStaticPaths is required for dynamic SSG pages and is missing for '/posts/[postId]'.
    Read more: https://nextjs.org/docs/messages/invalid-getstaticpaths-value
    
    So Next.js is basically telling us that we need to implement
    getStaticPaths, whatever that may be, to get rid of the error.

    But what is exactly getStaticPaths? And why do we need it 
    to fix this error?

    For our example, we are asking Next.js to pre-render the HTML
    for a route which contains a dynamic parameter `postId`. 

    However, we also need to consider the fact that a dynamic 
    parameter means that we won't be having one single page. 
    We would be having multiple pages, for different
    values of `postId`. The HTML of the page would remain 
    the same, but the data would differ for every `postId`.

    So Next.js is telling us, hey the `postId` can be 
    either 1, 2, 3, or even 1 million. I have no clue what
    possible values `postId` can accept. So I need you to 
    tell me what `postId`s I need to consider when 
    generating the pages at build time. If you don't, I'm 
    going to throw an error that you have not specified
    the path parameter for pre-rendering this page. 

    Which is exactly what happened in our case. 

    We have asked Next.js to pre-render this page, but 
    we haven't informed what the possible values of `postId` are.

    And the way we inform that is by using the getStaticPaths() 
    function. Let's see how to implement it for our [postId] page.

    In the same page file where we specify getStaticProps(), 
    that is [postId].tsx, we also specify getStaticPaths() which 
    is again, an async function.

    And from this getStaticPaths() function, we need to return
    an object. This object must contain a 'paths' key. This 
    'paths' key determines which paths will be statically 
    generateed at build time. The 'paths' key is an array of 
    objects. Each object contains a 'params' key, which in turn 
    is an object that contains the route parameter with its value.

    In our example we will make 'params' equal to `{ postId: '1' }`.
    We specified the value of 'postId' to be '1'. What we have done here 
    is inform Next.js to generate the 'postId' with'postId' parameter 
    is equal to '1'.

    export async function getStaticPaths() {
    return {
        paths: [
        {
            params: { postId: '1' },
        }
        ]
    };
    }

    If we go back to our /posts/index.tsx page though, we see that
    we are passing in a total of 3 posts to <PostList />. So 
    let's make sure we generate three pages.

    So the 'params' array is updated so that it holds three objects.

        export const getStaticPaths: GetStaticPaths = async () => {
            return {
                paths: [
                    {
                        params: { postId: '1' },
                    },
                ],
                fallback: false
            };
        };

    Make sure that the 'postId' parameter value is a string.

    There is one last though though. The returned 
    object must contain another key called 'fallback'. 

    We will talk about what role this 'fallback' plays 
    in future lessons, but for now, set it's value to 'false'.

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
                fallback: false
            };
        };

    Let's save the file and head back to the browser and test
    this out. 

    So localhost:3000 which is our homepage, navigate to /posts/, and 
    click on individual posts. 

    You can now see that the UI is now displaying the 
    post id, title, and body. We have fixed the getStaticPaths 
    error from before.

    We have successfully pre-rendered a page with 
    dynamic parameters.

    So to summarize what we have done, in the getStaticProps 
    function, we have extracted 'params' from the 'context'
    object that getStaticProps() automatically receives, 
    and from this 'params' object we get hold of the 'postId'
    route parameter. We make the API call, fetch the data, 
    and pass it into the page component as props. 

    We also made use of the getStaticPaths() function to 
    inform Next.js of the possible values that [postId].tsx 
    page should be statically generated for: 1, 2, and 3. 

    Now that we have an idea of static-site generation with 
    dynamic parameters, in the next lesson, let's understand 
    what happens when we build and serve the application.
*/

import axios from 'axios';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PostType } from '../../types/post';

interface PostProps {
    post: PostType;
}

function Post({ post }: PostProps) {
    return (
        <>
            <h2>{post.id} {post.title}</h2>
            <p>{post.body}</p>
        </>
    );
}

export default Post;

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
        fallback: false
    };
};

// Extending the ParsedUrlQuery interface to resolve the following issue experienced
// https://wallis.dev/blog/nextjs-getstaticprops-and-getstaticpaths-with-typescript
interface Params extends ParsedUrlQuery {
    postId: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { params } = context as { params: Params };

    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${params.postId}`);
    const data = response.data;

    return {
        props: {
            post: data,
        },
    };
};