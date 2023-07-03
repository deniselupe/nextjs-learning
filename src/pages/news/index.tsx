/*
    Two forms of pre-rendering

    1. Static Generation
    2 Server-side Rendering


    Static Generation
    The HTML is statically generated at build time. The built page is then 
    cached and reused for each request. 


    Of course we do have exceptions:
    - For a dynamic page with getStaticPaths and fallback: true, the page is not 
    generated at build time but is generated on the initial request.
    - with Incremental Static Regeneration, a page can be regenerated for a request 
    after the revalidation time has elapsed.

    But in both these cases, we do serve statically generated HTML pages, even if it is 
    for a small duration of time as is the case of ISR.

    So with the first form of pre-rendering, for the most part, pages are generated 
    using getStaticProps when you build the project. But in doing this, you come across 2 problems.

    ---

    Problems with Static Generation

    First problem:
    We cannot fetch data at request time

    Why is this a problem?
    With not being able to fetch data per request, we run into the problem of stale data.

    Let's say we are building a news website, the content is very dynamic in the sense 
    that news articles can be published almost every second. 

    Given the nature of such a website, you simply cannot afford to have stasle data. 

    getStaticProps will fetch the news at build time, which is not at all suitable.

    getStaticPaths will help fetch the data on the initial request, but it is then cached 
    for subsequent requests. And that is no good either. 

    ISR can help, but if revalidate is 1 second, we still might not always see the most 
    up-to-date news when the generation is happening in the background. 

    And if your intention is to revalidate less than every second for a website where a user
    is visiting almost every second, there simply is not point in having ISR.

    You would much rather fetch data on the client side by making a request from the component.

    However, in doing so, you have lost the benefits of SEO, and for a News Publishing website, 
    SEO is of the utmost importance, and simply cannot be neglected.

    So the first problem with static generation is that we cannot fetch data per request and 
    pre-render.

    ---

    Problems with Static Generation

    Second problem:
    We don't get access to the incoming request if the page is pre-rendered in build time. 

    This becomes a problem when the data that needs to be fetched is specific to a user.

    Let's say we are building a website similar to Twitter.

    As a user I should be able to see tweets that are personalized based on my interests. 

    The tweets that I see also need to be SEO friendly as it is public content that anyone 
    in the world can see by searching in Google and other search engines.

    To fetch tweets specific tot he user, we need the userId. And that can be obtained only 
    if we have access to the incoming request.

    For example, the userId can be part of request cookies, which we can extract and use to 
    fetch data specific to that user. 

    Without access to the incoming request, it becomes difficult to build a page similar to a 
    Twitter feed.

    We could do it client-side, with useEffect for example, but again that means that you miss 
    out with SEO.

    So the second problem with static generation is that we cannot fetch data that 
    is user specific and pre-render a page.

    ---

    Solution: Server-side Rendering

    To overcome these problems, Next.js offers the second form of pre-rendering, which 
    is Server-Side Rendering. 

    With SSR, Next.js allows you to pre-render a page not at build time, but at request time.

    So the HTML is generated for every incoming request. 

    A user makes a request to a page
    Next.js catches the external data for that specific request
    Next.js generates the HTML
    Next.js then sends HTML to the browser.

    ---

    Summary

    Server-Side Rendering is a form of pre-rendering where the HTML is generated at request time.

    We also learned that SSR is required when you need to fetch data per request, and also 
    when you need to fetch personalized data, while also keeping in mind SEO.

    So now we know what is SSR and it is required.

    The next question is how?

    How does Next.js make it possible to fetch data at request time? Or, how does Next.js make 
    it possible to get access to the incoming request which will facilitate fetching 
    data personalized for a user?
*/

/*
    SSR with getServerSideProps

    As mentioned before, with SSR, the HTML is generated at request time.

    We also learned that SSR is required when you need to fetch data per request.

    Let's learn how to fetch data which is needed to render HTML.

    For our example let's assume that we are building a news website.

    As part of this site, we need to display a list of articles, whose data 
    is fetched from an API endpoint.

    For the API we are going to make use of JSON server to build mock endpoints.

    --- 

    Preparing the JSON Server

    JSON Server lets you create a fake REST API with zero coding. 

    Step 1:
    Install JSON Server by running npm install -g json-server

    Step 2:
    Create a file called db.json in the root folder of your project with the API contents

    Step 3:
    Create a script command in your package.json to start the JSON Server. `"serve-json": "json-server --watch db.json --port 4000"`

    Step 4:
    Run `npm run server-json` to start the JSON server.

    ---

    Now that we have the API up and running, let's create the NewsList page 
    that will use SSR form of pre-rendering.

    Create a new route in pages called `news`, so you will not have the following:
    /pages/news/index.tsx

    Within /news/index.tsx, create a simple component called <NewsArticleList /> that 
    for now returns an <h1> tag that says 'List of News Articles'. Make sure to export 
    default the component.

    If you now run the application, head to the browser, and navigate to 
    localhost:3000/news, we should see our NewsArticleList component.

    What we are now missing though is the list of articles. The lists will 
    need to be pre-rendered using server-side rendering.

    ---

    Now in Next.js to use server-side rendering for a page, you need to export 
    an async function called getServerSideProps.

    When you export that function, it will be called by the server on every 
    request.

    Inside that function you can fetch external data and send it as props 
    to the page. This is very similar to getStaticProps.

    Let's understand by implementing the function.


    In our /news/index.tsx file, we're going to export an async function called 
    getServerSideProps. Within the function we can make an API request to our 
    JSON server. And for that we can make use of the Fetch API.

        import { GetServerSideProps } from 'next';

        export const getServerSideProps: GetServerSideProps = async () => {
            const response = await fetch('http://localhost:4000/news');
            const data = await response.json();
            
            return {
                props: {
                    articles: data,
                },
            };
        };

    Now our <NewsArticleList /> components will receive the props at request time.
    Just like when working with getStaticProps, we can pass in `props` as the 
    comonent's argument, or, we can destructure `articles` from `props` in the argument.

    Now that we have the list of articles, rendering the data is simple React code.

        export default function NewsArticleList({ articles }: NewsArticleListProps) {
            return (
                <>
                    <h2>List of News Articles</h2>
                    {
                        articles.map((article) => {
                            return (
                                <div key={article.id}>
                                    <h2>{article.id} {article.title} | {article.category}</h2>
                                </div>
                            )
                        })
                    }
                </>
            );
        }

    If we now save the file and take a look at the browser, 
    we should see the list of 3 news articles being displayed.

    What is happening here, is when we navigate to /news, the 
    Next.js receives the request. 

    Upon receiving the incoming request, Next.js runs the getServerSideProps 
    function exported from the page.

    The data is fetched and provided as props to the component. 

    The HTML for the component is generated on the server and then 
    sent back to the browser.

    So if we inspect the `news` document in the Network Tab, 
    you can see that the HTML is already generated and then sent to the 
    browser.

    So we were able to successfully pre-render the news page.

    ---

    Now one point you have to keep in mind, is that this form 
    of pre-rendering is slower compared to static generation 
    as the server must compute the result on every request.

    Because of this slower performance, use server-side rendering 
    only when absolutely necessary. 

    ---

    Let's highlight a few points about getServerSideProps.

    A lot of it will seem familiar since we've already been through 
    getStaticProps, but let's still go ahead and repeat the steps for completeness.


    1st Point:
    getServerSideProps only runs on the server side. The function will never run client side.
    As a matter of fact, the code you write inside getServerSideProps will never be 
    included in the JS Bundle that is sent to the browser.


    2nd Point:
    You can write server-side code directly in getServerSideProps.

    So code that you would typically see in Node.js (like accessing the system with the fs module, 
    or querying the database) can all be done inside getServerSideProps.

    And if you were to import a module, like for example, the fs module, to 
    read from the file system, the code for the fs module will also not 
    be bundled as part of the code sent to the browser.

    Next.js is pretty smart when it comes to this.

    You also don't have to worry about including API keys in getServerSideProps, 
    as that wont make it to the browser either.


    3rd Point:
    getServerSideProps function is only allowed in a page, and cannot be run from 
    a regular component file. 

    It is used only for pre-rendering and not client-side data fetching.


    4th Point:
    getServerSideProps should return an object, and the object should contain a 
    `props` key which is an object. Otherwise, Next.js will throw an error. 

    The exception of course is when you return an object with just the `notFound` 
    property.


    5th Point:
    getServerSideProps will run at request time.

    ---

    In the next lesson, we will learn to serve a 
    server-side rendering page with dynamic parameters.
*/

import { GetServerSideProps } from 'next';
import { ArticlesType } from '../../types/article';

type NewsArticleListProps = {
    articles: ArticlesType;
};

export default function NewsArticleList({ articles }: NewsArticleListProps) {
    return (
        <>
            <h2>List of News Articles</h2>
            {
                articles.map((article) => {
                    return (
                        <div key={article.id}>
                            <h2>{article.id} {article.title} | {article.category}</h2>
                        </div>
                    )
                })
            }
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async () => {
    const response = await fetch('http://localhost:4000/news');
    const data = await response.json();

    return {
        props: {
            articles: data,
        },
    };
};