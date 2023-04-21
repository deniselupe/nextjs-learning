/*
In the previous lesson we learned about Static Generation 
w/ data fetching. We learned about the getStaticProps() function
which we can use to inject props to our component. 

Now although this works well, it is typically now how you would
write production application. For example, the JSX for a User component 
would be written in its own file and invoked inside the UserList 
component, passing in the necessary props.

In this lesson, let's discuss about that. 

Now what we need is a seperate component called User, which will accept
a user's details as props and render the username and email. 

For that, we need to create a file. 

But the question is, where do we place that file? Should we 
create it inside the pages folder? 

No. 

When building a Next.js application, pages are very special. They
give you added benefits like automatic routing, and access to 
special functions like getStaticProps. However, these 
benefits shouldn't be available for presentation components
that we write in our application. Hence, they shouldn't be
created inside the pages folder. 

Instead, we can create them in a separate 'components' folder.
So within the project root, create a new folder called 'components'. 
Or, if you are using 'src/' folder, you can create the 
'components' folder inside the 'src/' folder.

Now, the the folder name is not a strict convention, but it is 
something that makes sense. 

Within the './src/components/' folder, create a new file called 'user.tsx'.

In React, the naming convention for file names is Pascal Case, but 
from what was observed for Next.js, the file names are named in Kebab 
Case, so we are following the same.

Within the 'user.tsx' file, we define the <User /> component. 

    function User({ user }) {
        return (
            <>
                <p>{user.name}</p>
                <p>{user.email}</p>
            </>
        );
    }

    export default User;

Now back in '.src/pages/users.tsx' we can replace part of the 
JSX with the <User /> component. 

If you now save the file and look at the browser, the UI remains
unaffected, but this time our code is organized better.

So what you should take away from this lesson is the difference 
between a page and a component. If you want to expose some 
UI as a route in your application create it as a page. If you are 
simply looking to adhere to the component based architecture 
and organize your JSX, go with components. 

Components don't need the special features that Next.js provides 
for pages in an application.
*/

import User from '../components/user';
import { UserType } from '../types/user';
import axios from 'axios';

interface UserListProps {
    users: UserType[];
}

function UserList({ users }: UserListProps) {
    return (
        <>
            <h1>List of users</h1>
            {
                users.map((user) => {
                    return (
                        <div key={user.id}>
                            <User user={user} />
                        </div>
                    )
                })
            }
        </>
    );
}

export default UserList;

export async function getStaticProps() {
    const response = await axios.get('https://jsonplaceholder.typicode.com/users');
    const data = response.data;
    console.log(data);

    return {
        props: {
            users: data,
        }
    };
}