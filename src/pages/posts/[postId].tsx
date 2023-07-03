/*
    Incremental Static Generation

    Static Generation is a method of pre-rendering where the HTML pages 
    are generated at build time.

    The pre-rendered static pages can be pushed to a CDN, cached and served 
    to clients across the globe almost instantly. 

    Static content is fast and better for SEO as they are immediately 
    indexed by search engines. 

    Static Generation with getStaticProps for data fetching and getStaticPaths 
    for dynamic pages seems like a good approach to a wide variety of applications 
    in production.

    ---

    Issues

    1. The build time is proportional to the number of pages in the application.
    2. A page, once generated, can contain stale data till the time you rebuild the application.

    ---

    Issues with build time

    The build time is proportional to the number of pages in the application.

    
    Example Scenario
    A page takes 100ms to build
    E-commerce app with 100 products takes 10 seconds to build
    E-commerce app with 100,000 products takes > 2.5 hours to build
    
    It's not just the time, there are cost implications as well.
    
    The problem only gts worse with more products you add to the system as every new 
    page increases the overall build time.

    ---

    Issues with stale data

    What if we build the app only once in a while?

    Depending on the nature of your application, you might run into 
    issues of stale data.

    E-commerce app is not an application which you can build and deploy 
    once in a while. Product detauls, especially product prices can vary everyday.

    The entire app has to be re-built and the page with updated data 
    will be statically generated.

    ---

    What about getStaticPaths?

    Pre-render only few pages at build time and rest of the pages can be pre-rendered 
    on request. 

    Can we not use that to render, say, 1,000 of the most popular pages and the 
    rest of the 99,000 pages can be pre-rendered on request?

    If your application has 90% static pages and 10% dynamic pages, getStaticPaths 
    will not help much.

    An e-commerce site typically will have 90% dynamic pages and 10% static pages. 
    So we can reduce the total build time by using getStaticPaths. 

    It still does not fix the issue of stale data.

    If you render 1,000 pages at build time, and then the rest are generated based on 
    incoming request using `fallback: true` or `fallback: 'blocking'`, changes in 
    data will not update the already pre-rendered pages.

    And this is what we need to understand about the limitations to what 
    getStaticProps and getStaticPaths can solve.

    ---

    Incremental Static Regeneration

    There was a need to update only those pages which needed a change without 
    having to rebuild the entire app. 

    Incremental Static Regeneration (ISR) 

    With ISR, Next.js allows you to update the static pages after you've bult 
    your application.

    You can statically generate individual pages without needing to rebuild 
    the entire site, effectively solving the issue of dealing with stale data.

    How?

    In the getStaticProps function, apart from the props key, we can specify a 
    `revalidate` key.

    The value for `revalidate` is the number of seconds after which a page
    re-generation can occur.

    ---

    Re-generation

    A re-generation is initiated only if a user makes a request after the 
    revalidate time.

    If a user visits a product details page but there is no other user hitting that 
    page the entire day, the re-generation does not happen.

    Revalidate does not mean the page automatically re-generates every $SPECIFIED_NUM_SECONDS seconds.

    It simply denotes the time after which, if a user makes a request, a re-generation 
    has to be initiated.

    The re-generation can also fail and the previously 
    cached HTML could be served till the subsequent re-generations succeed. 

    ---

    When building your app `npm run build`, you will be able to 
    see if ISR is enabled, for example look at the output from 
    running a build on the current code below. It will say that 
    /posts/[postId] has ISR enabled, 10 second interval.


    Route (pages)                                    Size     First Load JS
    ┌ ○ /                                            326 B          75.7 kB
    ├   /_app                                        0 B            73.3 kB
    ├ ○ /404                                         182 B          73.4 kB
    ├ ● /posts (441 ms)                              388 B          75.8 kB
    ├ ● /posts/[postId] (ISR: 10 Seconds) (1526 ms)  394 B          73.7 kB
    ├   ├ /posts/3 (440 ms)
    ├   ├ /posts/1 (427 ms)
    ├   └ /posts/2 (367 ms)
    ├ ● /users (425 ms)                              339 B          75.7 kB
    └ ● /users/[userId] (1609 ms)                    323 B          73.6 kB
        ├ /users/2 (550 ms)
        ├ /users/3 (536 ms)
        └ /users/1 (523 ms)
    + First Load JS shared by all                    74 kB
    ├ chunks/framework-2c79e2a64abdb08b.js         45.2 kB
    ├ chunks/main-0ecb9ccfcb6c9b24.js              27 kB
    ├ chunks/pages/_app-5fbdfbcdfb555d2f.js        296 B
    ├ chunks/webpack-8fa1640cc84ba8fe.js           750 B
    └ css/876d048b5dab7c28.css                     706 B

    ○  (Static)  automatically rendered as static HTML (uses no initial props)
    ●  (SSG)     automatically generated as static HTML + JSON (uses getStaticProps)
    (ISR)     incremental static regeneration (uses revalidate in getStaticProps)

    ---

    Remember:

    Incremental Static Regeneration doesn't check/verify stale data, it's job is 
    to simply re-generate a pre-rendered page after a specified amount of time. 

    The purpose for this is to help developer build statically generated pages, 
    without having to worry about re-building the entire app when data on these
    pre-rendered pages become stale.

    ---

    Even though a stale page is served while the regeneration happens 
    in the background, ISR is a really good pre-rendering solution to have in 
    your tookit. 

    However, at some point when building your app, you might come across
    a situation where you simply cannot afford to serve stale data even for a 
    second. 

    That is your cue to learn about the second form of pre-rendering, which is 
    server side rendering. 

    Let's learn about that in the next lesson.
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

    // The revlaidate key tells Next.js to re-generate pre-rendered page after every 10 seconds
    // Well to be exact, if a subsequent request is made after 10 seconds, then the page will regenerate.
    return {
        props: {
            post: data,
        },
        revalidate: 10,
    };
};