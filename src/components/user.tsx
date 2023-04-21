import { UserType } from '../types/user';

interface UserProps {
    user: UserType;
}

function User({ user }: UserProps) {
    return (
        <>
            <p>{user.name}</p>
            <p>{user.email}</p>
        </>
    );
}

export default User;