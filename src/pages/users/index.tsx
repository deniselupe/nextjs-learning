import axios from 'axios';
import Link from 'next/link';
import { UserType } from '../../types/user';

interface UsersListProps {
    users: UserType[];
}

function UsersList({ users }: UsersListProps) {
    return (
        users.map((user) => {
            return (
                <div key={user.id}>
                    <Link href={`/users/${user.id}`}>{user.id}. {user.name}</Link>
                </div>
            );
        })
    );
}

export async function getStaticProps() {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const data = response.data.slice(0, 3);

    return {
        props: {
            users: data
        }
    };
}

export default UsersList;