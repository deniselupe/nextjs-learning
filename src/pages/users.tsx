/*
More on getStaticProps()

Previously we learned about static generation with data fetching 
using the getStaticProps() function. We were able to fetch data from 
an API and provide it as props to the page by returning an object from 
the function. 

In this lesson we want to highlight a few important details 
about the getStaticProps() function. 

1. 
getStaticProps() runs only on the server side. And this is the reason 
that when we console.log() the data, we see the log in the terminal as 
opposed to seeing it in the browser console. Which also implies that 
the function will never run client-side. 

s a matter of fact, the 
code your write inside getStaticProps() won't event be included 
in the JS Bundle that is sent to the browser. This leads us to the 
second point.

2. 
You can write server-side code directly in getStaticProps(). So 
code that you would normally see in Node.js like accessing the 
file system using the fs() module, or querying the database can all
be done inside the getStaticProps() function. 

And if you were to import lets say, the fs() module to read the file system, the 
code for fs() module would also not be bundled as part of the code 
sent to the browser. Next.js is pretty smart when it comes to that. 

You also don't have to worry about including API keys in getStaticProps() 
as that wont make it to the browser either.

3.
The getStaticProps() function is allowed only in a page and 
cannot be run from a regular component file. It is used only 
for pre-rendering and not client-side data fetching. From our 
example, in the previous lesson, we can define getStaticProps() 
in any file inside the 'pages/' folder, but not in the 
'components/' folder.

4.
getStaticProps() should return an object and the object should 
contain a 'props' key which is also an object. Otherwise, Next.js will
throw an error. In our example, we returned an object, and the object 
contained a 'props' key which was an object as well. 

5.
getStaticProps() will run at build time, however during development, 
getStaticProps() runs on every request. You are changing the code almost 
every minute and it's only logical that Next.js has to run the function 
on every request. So there is a slight difference between dev and prod.
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

    return {
        props: {
            users: data,
        }
    };
}