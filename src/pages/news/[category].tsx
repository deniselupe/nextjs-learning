/*
    getServerSideProps and returning { notFound: true }

    Just like with getStaticProps, you can return an object 
    with a notFound property.

    A good use case is if you want to display a 404 
    page whenever a user attempts to request a route that does 
    not exist. 

    In the example below, the user would only be able to make 
    requests to `localhost:3000/news/politics` and 
    `localhost:3000/news/sports`.

    When the user visits `localhost:3000/news/politics, they 
    will see article 2 listed.

    When the user visits `localhost:3000/news/sports`, they 
    will see articles 1 and 3 listed.

    Now, if the user visits `localhost:3000/news/entertainment`, 
    they will be directed to a 404 page. 
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

    if (!data.length) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            articles: data,
            category,
        }
    };
};