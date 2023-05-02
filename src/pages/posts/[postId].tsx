/*
    getStaticPaths fallback false

    Let's now take a look at the fallback key 
    returned from getStaticPaths. 

    The first to note about the fallback key is that 
    it is mandatory. This is the reason why we had to include
    it in the previous lessons. 

    The fallback key accepts three possible values:
        - false
        - true
        - 'blocking'

    When it comes to performance and user experience, 
    understanding the behavior of static generation for each 
    of these values is really important. 

    Here are the points to keep in mind:
        - When 'fallback' is set to 'false', the first point is that 
          'paths' returned from getStaticPaths will be rendered to HTML 
          at build time by getStaticProps.
        - If 'fallback' is set to 'false', then any paths not returned by 
          getStaticPaths will result in a 404 page

    Now, when would you use 'fallback' set to 'false'? 

    The 'false' value is most suitable if you have an application 
    with a small number of parts to pre-render and new pages are 
    not added often. 

    A blog site with a few articles is a good example for 'fallback' to 
    be set to 'false'. Each blog post would be statically generated 
    at build time which helps with faster load times and SEO.
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