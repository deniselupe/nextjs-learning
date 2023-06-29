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