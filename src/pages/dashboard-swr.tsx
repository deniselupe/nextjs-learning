/*
    SWR for Client-side Data Fetching
    
    In this lesson let's quickly look at an example of 
    client-side data fetching in Next.js with SWR.
    
    The name SWR is derived from the stale-while-revalidate 
    cache invalidation strategy and is basically a React Hooks 
    library for data fetching.
    
    It handles caching, revalidation, focus tracking, 
    refetching on interval, and alot more.
    
    For this lesson though, we are not going to go through 
    the different features this library has to offer, 
    we'll just look at implementing basic client-side 
    data fetching.
    
    For our example, we are going to achieve the same result that 
    we did in the previous lesson, fetching the Dashboard data.
    
    What we will change though is how we fetch the data.
    
    Back in the pages/ folder, we are going to create a new file 
    called 'dashboard-swr.tsx'.
    
    In the 'dashboard-swr.tsx' file, we are going to define a 
    component called <DashboardSWR />.

        export default function DashboardSWR() {
        
        }

    Within the component, we need to fetch and store the data for 
    rendering. And this is where we need the SWR library.

    In the terminal run the command `npm install swr`.

    Once the installation is complete, import it.

        import useSWR from 'swr';

        export default function DashboardSWR() {

        }

    ---

    Since useSWR is a hook, we call it within our component.

    The first argument to this hook is the unique key, and just 
    call it "dashboard".

        import useSWR from 'swr';

        export default function DashboardSWR() {
            useSWR('dashboard');
        }

    ---

    The second argument is a function where we fetch the data.

    We will use the fetching logic from "dashboard.tsx".

        import useSWR from 'swr';

        export default function DashboardSWR() {
            useSWR('dashboard', async () => {
                const response = await fetch('http://localhost:4000/dashboard');
                const data = await response.json();
                return data;
            });
        }
    
    ---

    Now this, data fetching function can be defined here inline, but the common
    practice is to extract this into a function called 'fetcher'.

    Let's do the same by defining the function above the component.

        import useSWR, { Fetcher } from 'swr';
        import { DashboardDataType } from '../types/dashboard';

        const fetcher: Fetcher<DashboardDataType> = async () => {
            const response = await fetch('http://localhost:4000/dashboard');
            const data = await response.json();
            return data;
        };

        export default function DashboardSWR() {
            useSWR('dashboard', fetcher);
        }

    ---

    This hook returns a couple of things from which we can 
    destructure: data and error.

    Data is is our API data and error is any error encountered while 
    fetching the data.

        import useSWR, { Fetcher } from 'swr';
        import { DashboardDataType } from '../types/dashboard';

        const fetcher: Fetcher<DashboardDataType> = async () => {
            const response = await fetch('http://localhost:4000/dashboard');
            const data = await response.json();
            return data;
        };

        export default function DashboardSWR() {
            const { data, error } = useSWR('dashboard', fetcher);
        }

    ---

    Now for the JSX we can use these two values.

    So if there is an error, we are going to return a message letting the user
    know a error has occured. 

    If there is no data, we're going to return 'Loading...'.

    If we do have data, let's render the JSX which we will copy 
    from the "dashboard.tsx" component.

        import useSWR, { Fetcher } from 'swr';
        import { DashboardDataType } from '../types/dashboard';

        const fetcher: Fetcher<DashboardDataType> = async () => {
            const response = await fetch('http://localhost:4000/dashboard');
            const data = await response.json();
            return data;
        };

        export default function DashboardSWR() {
            const { data, error } = useSWR('dashboard', fetcher);

            if (error) {
                return 'An error has occured';
            }
            
            if (!data) {
                return 'Loading...';
            }

            return (
                <div>
                    <h2>Dashboard</h2>
                    <h2>Posts - {data.posts}</h2>
                    <h2>Likes - {data.likes}</h2>
                    <h2>Followers - {data.followers}</h2>
                    <h2>Following - {data.following}</h2>
                </div>
            );
        }

    And that is pretty much it.

    ---

    If we now head to the browser, and navigate to localhost:3000/dashboard,
    we have the content from the previous lesson.

    If we navigate to localhost:3000/dashboard-swr, we will see the output 
    from the component we defined in this lesson.

    Compared to the method used (useState, useEffect) to fetch client-side in 
    "dashboard.tsx", this method with SWR is much simpler.

    And not just that, in "db.json", if we change the number of likes to 
    150, and go back to the browser, on the localhost:3000/dashboard page, 
    we have to refresh to see the latest data.
    
    However, if we simply navigate to localhost:3000/dashboard-swr page, 
    the SWR hook will automatically fetch the latest data and the UI is updated.

    ---

    Let me break that example down:
        - Ensure in "db.json" that "likes" is set to 100.
        - Directly route to localhost:3000/dashboard, and you will see
          that likes is 100.
        - Directly route to localhost:3000/dashboard-swr, and you will see 
          that likes is 100.
        - Go in "db.json" and change value of "likes" to 150.
        - In the browser, click the back button to navigate back to 
          localhost:3000/dashboard, and localhost:3000/dashboard will 
          still show that "likes" is set to 100. 
        - In the browser, click the forward button to navigate back to 
          localhost:3000/dashboard-swr, you will see that in localhost:3000/dashboard-swr 
          the "likes" value is now 150.
        - In the browser, click the back button to navigate back to 
          localhost:3000/dashboard, and you will see that localhost:3000/dashboard 
          still shows the value of "likes" as 100.

    ---

    This is just one of the many features that SWR offers for 
    data fetching.

    Highly recommend using this for your Next.js 12 project, and we 
    guarantee you'll prefer this over writing your own code 
    for data fetching.
*/

import useSWR, { Fetcher } from 'swr';
import { DashboardDataType } from '../types/dashboard';

const fetcher: Fetcher<DashboardDataType> = async () => {
    const response = await fetch('http://localhost:4000/dashboard');
    const data = await response.json();
    return data;
};

export default function DashboardSWR() {
    const { data, error } = useSWR('dashboard', fetcher);

    if (error) {
        return 'An error has occured';
    }
    
    if (!data) {
        return 'Loading...';
    }

    return (
        <div>
            <h2>Dashboard</h2>
            <h2>Posts - {data.posts}</h2>
            <h2>Likes - {data.likes}</h2>
            <h2>Followers - {data.followers}</h2>
            <h2>Following - {data.following}</h2>
        </div>
    );
}