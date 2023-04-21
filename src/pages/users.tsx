/*
    Static Generation with getStaticProps

    Let's learn about Static Generation w/Data.

    That is, learning how to fetch data ahead of time when statically 
    generating html.

    For our example, let's assume we need to display a list of users
    whose data is fetched from an API endpoint. 

    For the API we're going to be using JSONPlaceholder and render
    the users/ data.

    Endpoint:
    https://jsonplaceholder.typicode.com/users

    In NextJS when you export a page component, you can also 
    export an async function called getStaticProps. 

    If you do export that async function, it will run at build time 
    in production and inside the function, you can fetch external data
    and send it as props to the page.

    Now if that's a bit confusing, let's understand better by implementing
    the function. 

    In our users.tsx file, we are going to export an async function
    called getStaticProps. In the function body, we can make an API
    request to the JSONPlaceholder API. And for that we make use of 
    axios. We capture and then console.log() the response.data. When we
    save the file and head back to the browser and refresh, we see that the 
    terminal lists the users logged. Why is the terminal logging the 
    response.data and NOT in the browser console? We will get back to that.


        export async function getStaticProps() {
            const response = await axios.get('https://jsonplaceholder.typicode.com/users');
            const data = response.data;
            console.log(data);
        }


    For now though we see that the fetching has worked and we have 
    our data now. Next step is to see how we can pass that data 
    to the component defined above <UserList />. NextJS has a convention 
    for that. In the function's current state, NextJS will
    throw an error saying that getStaticProps has not returned an object.

    So as you can see, the convention is to return an object. Let's go 
    ahead and update getStaticProps so that it returns an object.

    The returned object will contain a property called 'props', 
    which again must be an object. The 'props' object can contain any
    number of key/value pairs, which will automatically be injected as 
    props into the component.

        
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


    We are creating a property inside the 'props' object named 'users', 
    which has a value of 'data' (the response.data from axios).

    When we return the props from getStaticProps, our <UserList /> component
    will receive props at build time. So we can pass in props as an argument.
    We can also simply destructure the 'user' property that is inside the 
    return statement in getStaticProps.

    Now that we have a list of users, rendering is simple React code.
    With the finished component below, if you visit the users page and 
    take a look at the page source, you will see that the HTML corresponding
    to the content you see on the page is present. We have successfully 
    pre-rendered the users page after fetching external data.

    And to re-iterate when you want to use this type of rendering, a common
    example is displaying a list of articles on your blog page, or a list of 
    products on your ecommerce page, or even displaying a list of topics on
    your documentation page. 

    All you have to do is define the async function getStaticProps(), fetch
    your data within the function, and return an object with the necessary props.
    The props will be available for use in your component.
*/

import axios from 'axios';
import { z } from 'zod';

const UsersSchema = z.object({
    id: z.number(),
    name: z.string(),
    username: z.string(),
    email: z.string().email(),
    address: z.object({
        street: z.string(),
        suite: z.string(),
        city: z.string(),
        zipcode: z.string(),
        geo: z.object({
            lat: z.string(),
            lng: z.string()
        })
    }),
    phone: z.string(),
    website: z.string().url(),
    company: z.object({
        name: z.string(),
        catchPhrase: z.string(),
        bs: z.string()
    })
}).array();

interface Users extends z.infer<typeof UsersSchema> {};

interface UserListProps {
    users: Users
}

function UserList({ users }: UserListProps) {
    return (
        <>
            <h1>List of users</h1>
            {
                users.map((user) => {
                    return (
                        <div key={user.id}>
                            <p>{user.name}</p>
                            <p>{user.email}</p>
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