/*
    Fetching Paths for getStaticPaths

    In our previous example, we learned about the 
    getStaticPaths function which is used to inform Next.js 
    about the different values to support when statically
    generating a page. 

    However for our understanding of getStaticPaths, we
    have restricted the total number of posts to 3 in 
    <PostsList />. 

    This also helped us with hard coding a list of three 
    objects in the paths array inside getStaticPaths in 
    [postId].tsx.

    Now we can all agree this is not going to work 
    in a practical real world application. For starters,
    we don't want just the tree posts to be shown in 
    <PostsList />.

    The API sends 100 posts and we want all 100 posts 
    to be displayed in our <PostsList /> component.

    And as far as getStaticPaths is concerned, the 
    paths should be fetched dynamically and not hard-coded. 

    Let's fix that. 

    Step 1:
    In /posts/index.tsx we're going to remove the slice method. 
    This will load all the 100 posts in the /posts route. But now 
    that we are loading 100 posts, we also need to inform 
    Next.js that 100 pages need to be statically generated. And 
    as in the previous example, we do this using the getStaticPaths.

    At the moment in [postId].tsx's getStaticPaths function, we 
    have 3 postIds hard-coded which will generate three pages.

    We could add 97 more objects here, and that would work... 
    but that is not a feasible solution.

    What we need is an array of 100 objects, where each object contains
    a 'params' key which in turn contains the 'postId'. Now, 
    the method to fetch all Ids of posts might vary depending 
    on your backend.

    If you have an API that provides the total count of posts, 
    you can use that to create an array of postIds. However for our
    scenario, we don't have such an API. 

    What we can do for our example, is reuse the /posts API which 
    will fetch all of the 100 posts with their postIds. We can then 
    extract just the postId to create the paths array.

    So from getStaticProps in /posts/index.tsx we are 
    going to copy two lines which the lists of posts. 

        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const data = response.data;

    Back in [postId].tsx, we are going to paste that code 
    within the getStaticPaths function.

    Once we have the data which is the list of 100 posts, 
    we map over it, and return an object with 'params' object and 
    the 'postId' property.

        const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
        const data = response.data;

        const paths = data.map((post) => {
            return {
                params: {
                    postId: `${post.id}`
                }
            };
        });

    Now if you observe closely, the object returned here 
    is similar to the hard-coded object from before. 

    The API returns a numeric ID but we need a string, which is 
    why we used template literals for the 'params.postId' value.

    So we have basically created an array of 100 objects, with 
    each object contains a 'params' key and the 'postId' 
    ranges from 1 to 100. 

    Now in our return statement, we can comment out the 
    hard-coded paths array and instead make use of the paths 
    constant we just created. 

    So { paths: paths } or we can use the ES6 shorthand and 
    specify just { paths }.

    Now let's save both files and head back to the browser, we should 
    see a list of 100 posts when we navigate to the /posts 
    route. If we click on the first post, we see the corresponding 
    details. If we have navigate to the 4th post as well now, the 
    details are displayed as expect. 

    So we have successfully informed Next.js to pre-render 
    the 100 by dynamically fetching the postIds. 

    Like mentioned earlier, the only way we could fetch the 
    postIds, is by querying the /posts API. In the application
    you are building, the logic might be different, but 
    the end goal is the same. We created an array of paths, and 
    returned it from getStaticPaths. 

    Also, if we run the `npm run build` command, you can 
    see that it is generating 105 pages. 

    And if we inspect the `.next/server/pages/posts` folder, 
    we should have 100 HTML and JSON files.

    The static generation is successful. 
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
    const response = await axios.get('https://jsonplaceholder.typicode.com/posts');
    const data: PostType[] = response.data;

    const paths = data.map((post: PostType) => {
        return {
            params: {
                postId: `${post.id}`
            }
        };
    });

    // return {
    //     paths: [
    //         {
    //             params: { postId: '1' },
    //         },
    //         {
    //             params: { postId: '2' },
    //         },
    //         {
    //             params: { postId: '3' },
    //         }
    //     ],
    //     fallback: false
    // };

    return {
        paths: paths,
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