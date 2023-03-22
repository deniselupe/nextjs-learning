/*
Navigating Programmatically 

Previously we learned how to navigate to different routes using the 
<Link /> component. For the most part, it's pretty much all you need.

However at times you might need to programmatically navigate to a 
particular route. 

For example, let's say you place an order on Amazon. If the form 
submission is successful, you will be navigated to the Order Confirmation 
page. 

Now the scenario may be good for any type of form submission as well
and is definitely need in one or the other production applications.

Let's learn how to do that with Next.js.

We don't have an ecommerce website or a form to submit. So let's assume that 
is the scenario and implement a button click handler from where we programmatically 
navigate to a different route in our application.

For out example, on click of a place order button in the home page, let's navigate to 
the products page.

Back in VSCode in the home page, were are going to add a button with text 'Place Order'.

Next let's add a click handler, onClick={handleClick}, and let's define handleClick.
In the function body of handleClick, let's assume that the order was placed successfully.

In the function body, we will log the string 'Placing your order.' and after the console.log()
we want to navigate the user to '/products'.

Since you can't use <Link> to help you navigate within the handlerClick function body, you 
will need the help of useRouter() instead to help navigate the user to a different route.

	const router = useRouter();
	
Within this useRouter() object we can access the push method, passing in 
the required route as the argument. 

For our example, we want to navigate to '/products'.
*/

import { useRouter } from 'next/router';

function Home() {
    const router = useRouter();

    // Let's assume the order was placed successfully
    const handleClick = () => {
        console.log("Placing your order.");

        // After log, navigate user to products page
        // To navigate user (since you can't use <Link />) you will use useRouter()
        router.push("/products");

        // You can replace history instead of pushing route to history stack by calling router.replace("/products")
    };

    return (
        <div>
            <h1>Home Page</h1>
            <button onClick={handleClick}>Place Order</button>
        </div>
    );
}

export default Home;