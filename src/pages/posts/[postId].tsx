import axios from 'axios';
import { GetStaticProps } from 'next';
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

// Extending the ParsedUrlQuery interface to resolve the following issue experienced
// https://wallis.dev/blog/nextjs-getstaticprops-and-getstaticpaths-with-typescript
interface Params extends ParsedUrlQuery {
    postId: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { params } = context as { params: Params };

    const response = await axios.get(`https://jsonplaceholder.typicode.com/posts/${params.postId}`);
    const data = response.data;
    console.log(data);

    return {
        props: {
            post: data,
        },
    };
};