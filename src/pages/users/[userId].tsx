import axios from 'axios';
import { UserType } from '../../types/user';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';

interface UserProps {
    user: UserType;
}

function User({ user }: UserProps) {
    return (
        <div>
            <p>ID: {user.id}</p>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
        </div>
    );
}

export default User;

export const getStaticPaths: GetStaticPaths = async () => {
    return {
        paths: [
            {
                params: { userId: '1' }
            },
            {
                params: { userId: '2' }
            },
            {
                params: { userId: '3' }
            }
        ],
        fallback: false
    };
};

interface Params extends ParsedUrlQuery {
    userId: string;
}

export const getStaticProps: GetStaticProps = async (context) => {
    const { params } = context as { params: Params };
    const response = await axios.get(`https://jsonplaceholder.typicode.com/users/${params.userId}`);

    return {
        props: {
            user: response.data
        }
    };
};