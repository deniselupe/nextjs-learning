/*
    Client-side Data Fetching
    
    Previously, we learned about pre-rendering, and the 2 forms 
    of pre-rendering that Next.js offers. 
    
        1. Static-site Generation
        2. Server-side Generation
        
    We also learned how to fetch data in both forms:
        1. getStaticProps (SSG)
        2. getServerSideProps (SSR)
        
    When building applications though, you might not always 
    need to pre-render data. 
    
    For example, consider a Dashboard page. 
    
    If you are a user on a blogging page, you probably need analytics, like 
    how many posts you have published, how many likes your posts have, how many 
    followers, etc.
    
    Because such a Dashboard is private, and is behind a login screen, 
    it is highly user specific and SEO is not relevant, so there is 
    no need to pre-render data.
    
    Instead you can rely on client-side fetching.
    
    In this lesson, let's go over a simple example of client-side fetching.
    
    -----
        
    Now to help us with mock data, another entry has been added in db.json 
    for our JSON Server.
    
    We have an entry called "dashboard", which has properties like "posts", 
    "likes", "followers", and "following".
    
        # db.json
        {
            "dashboard": {
                "posts": 5,
                "likes": 100,
                "followers": 20,
                "following": 50
            },
            "news": [
                {
                    "id": 1,
                    "title": "News Article 1",
                    "description": "Description 1",
                    "category": "sports"
                },
                {
                    "id": 2,
                    "title": "News Article 2",
                    "description": "Description 2",
                    "category": "politics"
                },
                {
                    "id": 3,
                    "title": "News Article 3",
                    "description": "Description 3",
                    "category": "sports"
                }
            ],
            "products": [
                {
                    "id": 1,
                    "title": "Product 1",
                    "price": 500,
                    "description": "Description 1"
                },
                {
                    "id": 2,
                    "title": "Product 2",
                    "price": 1050,
                    "description": "Description 2"
                },
                {
                    "id": 3,
                    "title": "Product 3",
                    "price": 2500,
                    "description": "Description 3"
                }
            ]
        }
        
    If you start the JSON Server with `npm run serve-json` and open the URL 
    localhost:4000/dashboard, you should see an API respond with the data we have 
    just seen:
    
        {
            "posts": 5,
            "likes": 100,
            "followers": 20,
            "following": 50
        }
        
    Let us now make a request to this API, and fetch data client-side. 
    
    -----
    
    Now if you have fetched data from a React app before, 
    it is exactly the same.
    
    In the pages folder, we will create a new file called "dashboard.tsx".
    
    Within the file, we define a component called <Dashboard />.
    
        function Dashboard() {}
        
    ---
        
    Within the component, we need to fetch and store the data for rendering.
    
    So we'll make use of the useState and useEffect hooks.
    
    So at the top of your file, import { useState, useEffect } from 'react';
    
    ---
    
    In the component, let's maintain two state variables, one to store the loading 
    indicator, and one to store the fetched data.
    
        import { useState, useEffect } from 'react';
        
        export default function Dashboard() {
            const [isLoading, setIsLoading] = useState(true);
            const [dashboardData, setDashboardData] = useState(null);
        }
        
    ---
    
        We will make use of the useEffect() hook to fetch data on initial render only.
        
            import { useState, useEffect } from 'react';
            
            export default function Dashboard() {
                const [isLoading, setIsLoading] = useState(true);
                const [dashboardData, setDashboardData] = useState(null);
                
                useEffect(() => {
                    async function fetchDashboardData() {
                        const response = await fetch('http://localhost:4000/dashboard');
                        const data = await response.json();
                        setDashboardData(data);
                        setIsLoading(false);
                    }
                    
                    fetchDashboardData();
                }, []);
            }
        
    ---
    
    Finally for the JSX, if the data is currently loading, we are going 
    to return an <h2> tag that says 'Loading', if the data has 
    loaded, we render the data.
    
        import { useState, useEffect } from 'react';
    
        export default function Dashboard() {
            const [isLoading, setIsLoading] = useState(true);
            const [dashboardData, setDashboardData] = useState(null);
            
            useEffect(() => {
                async function fetchDashboardData() {
                    const response = await fetch('http://localhost:4000/dashboard');
                    const data = await response.json();
                    setDashboardData(data);
                    setIsLoading(false);
                }
                
                fetchDashboardData();
            }, []);
            
            if (isLoading) {
                return <h2>Loading...</h2>;
            }
            
            return (
                <div>
                    <h2>Dashboard</h2>
                    <h2>Posts - {dashboardData.posts}</h2>
                    <h2>Likes - {dashboardData.likes}</h2>
                    <h2>Followers - {dashboardData.followers}</h2>
                    <h2>Following - {dashboardData.following}</h2>
                </div>
            );
        }
        
    ---
    
    If we now save the file and start our app, so `npm start`, and 
    navigate to localhost:3000/dashboard in the browser, you should be able 
    to see the Dashboard data as expected.

    If you preview the document within the Network tab though, you will see 
    the 'Loading...' text. 

    So Next.js did pre-render the page, since that is the default behavior.

    However, the pre-rendered page is based on the initial state of that 
    component. 

    In our Dashboard page, "isLoading" is set to true to begin with. 

    Which implies that "Loading..." text is what is visible. 

    Next.js doesn't wait for the API call and update the state of the 
    component. 

    So the page source will always contain the "Loading..." text, and the 
    data is never pre-rendered.

    -----

    So if you are creating a page that is private, does not need SEO, and is 
    user-specific, client-side data fetching is the way to go.

    This is especially handy when your page is split into components 
    and you want to fetch data from the individual components and render 
    them as in when the data is fetched rather than wait for the entire page 
    data to be loaded.

    Components, unlike pages, cannot execute getStaticProps or 
    getServerSideProps and hence, client-side data fetching is the only 
    possibility. 

    Now one last thing we'd like to mention here is that, we have shown you 
    an example using the Fetch API, however, you are not restricted to 
    using this.

    You can also make use of Axios or any data fetching library 
    that you are comfortable with.

    The cool thing is that the team behind Next.js 12 created a React Hooks library 
    for data fetching called SWR.

    It is what the Next.js team recommends if you are fetching data 
    on the client-side. 

    So let's give it a try in the next lesson.
*/

import { useState, useEffect } from 'react';
import { DashboardDataType } from '../types/dashboard';

export default function Dashboard() {
    const [isLoading, setIsLoading] = useState(true);
    const [dashboardData, setDashboardData] = useState<DashboardDataType>({} as DashboardDataType);

    useEffect(() => {
        async function fetchDashboardData() {
            const response = await fetch('http://localhost:4000/dashboard');
            const data = await response.json();

            setDashboardData(data);
            setIsLoading(false);
        }

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <h2>Loading...</h2>;
    }
      
    return (
        <div>
            <h2>Dashboard</h2>
            <h2>Posts - {dashboardData.posts}</h2>
            <h2>Likes - {dashboardData.likes}</h2>
            <h2>Followers - {dashboardData.followers}</h2>
            <h2>Following - {dashboardData.following}</h2>
        </div>
    );
}