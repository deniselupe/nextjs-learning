/*
    <Link /> pre-fetching and fallback: false

    In this example I set fallback back to false, removed 
    the router.isFallback check in the <Post /> component, 
    and removed the condition in getStaticProps that returns an 
    object with `notFound` key.

    Previously, while learning fallback: true, I learned that 
    fallback: true can be used for situations where you want to 
    pre-render certain pages (the most popular pages for example) at 
    build time, and generate pre-rendered pages at request time for the 
    rest of your application. fallback: true is a good solution for this 
    when your application is heavy, when you have a long build time due 
    to the size of pages, and don't expect most of your application to 
    have stale data.

    When using fallback: true for this [postId].tsx page, I was able to 
    pre-render pages for posts 1-3, and if a user requested other postIds like 
    4-100, then instead of returning a 404, we display a fallback UI, generate 
    the pre-rendered pages at request time for the requested postId, and then 
    replace the fallback UI with the generated page.

    And we learned that when I on the posts/ route scrolling through the list of 100 
    posts options, the <Link /> component was pre-fetching the routes that crossed 
    my viewport, and so in the background <Link /> was able to pre-fetch the data needed 
    to render the pages for postIds 4-100. 

    This way, when I finally decide to click on postId 4 in the post/ page, I was immediately 
    routed to the generated page, no fallback UI because the generation had completed.

    In this example, I am using JSONPlaceholder to display the list of 
    100 posts in the localhost:3000/post/ route. 

    But within this file here, the [postId].tsx file, I specified in 
    getStaticPaths that only posts 1-3 can be pre-rendered at build time, 
    and I set fallback: false to say that requests to postIds that are not 
    1, 2, 3 should return a 404.

    After building my app and starting the server, I went back to the posts/ page.

    The posts/ page listed 100 posts. If I look at the Network tab, I see 
    that postIds 1-3 were able to pre-fetch (their <Link /> components were in the viewport), 
    but that any other postIds that scrolled into my viewport had an attempt for pre-fetch but returned 
    a 404. 

    Which means if I were to have clicked the <Link /> for postId 4, I would have 
    been routed to a 404 page.

    So this is what I was wanting to understand.
*/

import axios from 'axios';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import { PostType } from '../../types/post';

interface PostProps {
    post: PostType;
}

export default function Post({ post }: PostProps) {
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
        fallback: false
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

    console.log(`Generating page for /posts/${params.postId}`);

    return {
        props: {
            post: data,
        },
    };
};