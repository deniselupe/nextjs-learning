/*
	SSR with Dynamic Parameters 
	
	In the previous lesson we learned how to use the 
	getServerSideProps function to server-side render the 
	<NewsArticleList /> component. 
	
	In this lesson let's learn how to server-side render with 
	dynamic parameters.
	
	-----
	
	For our example, what we want is a page that filters the news 
	articles by category.
	
	In our list of articles, we can see that we have 2 articles with 
	category 'sports', and one article with category 'politics'.
	
	What we need to do is create a route `/news/category` which will 
	display the list of articles that match the category in the URL. 
	
	So if we navigate to `/news/sports/`, we should see articles 1 and 3.
	
	If we navigate to `/news/politics/`, we should see article 2.
	
	Let's go back to the code and understand how to achieve this.
	
	---
	
	Within the /news folder, we are going to create a new file called 
	[category].tsx. Remember, dynamic routes will be named within square brackets.
	
	We need a dynamic route, and this [category].tsx is going to be our parameter.
	
	Within the file, let's define an <ArticleListByCategory /> component.
	
		export default function ArticleListByCategory() {
			
		}
		
	To implement this component though, we first need the data which is filtered by 
	category. 
	
	And to fetch the filtered data, we again rely on getServerSideProps().
	Go ahead and define the getServerSideProps() function, and within the function, 
	we will make our API call to json-server.
	
		JSON Server:
		{
			"news": [
				{
					"id": 1,
					"title": "News Article 1",
					"description": "Description 1",
					"category": "sports"
				},
				{
					"id": 2,
					"title": "News Article 2",
					"description": "Description 2",
					"category": "politics"
				},
				{
					"id": 3,
					"title": "News Article 3",
					"description": "Description 3",
					"category": "sports"
				}
			]
		}

		export default function ArticleListByCategory() {
		
		}

        export const getServerSideProps: GetServerSideProps = async () => {
            const response = await fetch("http://localhost:4000/news?category=sports");
        };
		
	Now this right here is a handy feature of json-server, which lets us filter the data by 
	passing in query parameters. Category of course is a property in each object in the 
	'news' array. Right now, we have hardcoded category=sports, but this needs to 
	be extracted from the URL.
	
	Now how do we get hold of the route parameter within getServerSideProps.
	
	Well as it turns out, it's the exact same way you would do it with 
	getStaticProps. 
	
	The function receives an argument which can be called as 'context'. 
	
	This 'context' parameter is an object that contains a key called 'params'.

    We obtain the value of [category] parameter from the params key and then use 
    string interpolation to fetch with the correct URL parameters:

        export const getServerSideProps: GetServerSideProps = async (context) => {
            const { params } = context;
            const category = params?.["category"];
            const response = await fetch(`http://localhost:4000/news?category=${category}`)
        };
	
    Note:
	The Type definition of params is { [key: string]: string | string[] | undefined }.
    For this reason you'll need to use optional chaining to check for the existence of a value 
    for 'category' parameter.

    From the getServerSideProps() function, we must return a object which must 
    contain a 'props' key. 

    The 'props' key is an object where we return the filtered data as well as the 
    category.

        export const getServerSideProps: GetServerSideProps = async (context) => {
            const { params } = context;

            // The Type definition of params is { [key: string]: string | string[] | undefined }
            const category = params?.["category"];
            const response = await fetch(`http://localhost:4000/news?category=${category}`)
            const data = await response.json();

            return {
                props: {
                    articles: data,
                    category, // modern JS syntax for category: category
                }
            };
        };

    Now that we have the props, let's destructure it from the component props 
    and render the JSX for the <ArticleListByCategory /> component.

        type ArticleType = {
            "id": number;
            "title": string;
            "description": string;
            "category": string;
        };

        type ArticleListByCategoryProps = {
            articles: ArticleType[];
            category: string | string | undefined;
        };

        export default function ArticleListByCategory({ articles, category }: ArticleListByCategoryProps) {
            return (
                <>
                    <h1>Showing news for category: <i>{category}</i></h1>
                    {
                        articles.map((article) => {
                            return (
                                <div key={article.id}>
                                    <h2>{article.id} {article.title}</h2>
                                    <p>{article.description}</p>
                                    <hr />
                                </div>
                            );
                        })
                    }
                </>
            );
        }
    
    If we test this out in the browser, and navigate to `http://localhost:3000/news/sports`, 
    we see articles 1 and 3. 

    If we navigate to `http://localhost:3000/news/politics`, we see article 2. 

    If you inspect the Network tab, the pre-rendered page is what is served to the 
    browser. So we have successfully server-side rendered a page with Dynamic Parameters. 

    If you're server-side rendering a list of items, it is also quite common to render a filtered 
    list of items or even an individual item by it's id. 

    Hopefully you now have an idea on how to do that.

    In the next lesson, let's talk more about this 'context' parameter, which the getServerSideProps()
    function receives.
*/

import { GetServerSideProps } from 'next';

type ArticleType = {
    "id": number;
    "title": string;
    "description": string;
    "category": string;
};

type ArticleListByCategoryProps = {
    articles: ArticleType[];
    category: string | string | undefined;
};

export default function ArticleListByCategory({ articles, category }: ArticleListByCategoryProps) {
    return (
        <>
            <h1>Showing news for category: <i>{category}</i></h1>
            {
                articles.map((article) => {
                    return (
                        <div key={article.id}>
                            <h2>{article.id} {article.title}</h2>
                            <p>{article.description}</p>
                            <hr />
                        </div>
                    );
                })
            }
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { params } = context;

    // The Type definition of params is { [key: string]: string | string[] | undefined }
    const category = params?.["category"];
    const response = await fetch(`http://localhost:4000/news?category=${category}`)
    const data = await response.json();

    return {
        props: {
            articles: data,
            category, // modern JS syntax for category: category
        }
    };
};
