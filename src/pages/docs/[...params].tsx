/*
Catch-All Routes

To understand this, let's consider the following scenario:

Let's assume we are building a documentation site for a project 
we created.

We have a couple of features, and each feature has a few concepts 
that we explain to the audience. So let's assume that our site nav looks like this.

	localhost:3000/docs/feature1/concept1

	Feature 1
		Concept 1
		Concept 2
		Concept 3
		Concept 4
		Concept 5
	Feature 2
	Feature 3
	Feature 4
	Feature 5

We have 5 features, and the first feature is expanded to show 5 concepts. 
What we want to achieve is a unique route for each concept in a feature.

So routes like these:
localhost:3000/docs/feature1/concept1
localhost:3000/docs/feature1/concept2
localhost:3000/docs/feature2/concept1
localhost:3000/docs/feature2/concept2

You get the idea.

The documentation site might have 20 features, and each feature 
might have 20 concepts.

This leads to a massive 400 routes for our application.

And now that you know that NextJS has a file system based routing mechanism, 
400 routes corresponds to 400 files in our project. 

	20 feature folders x 20 concept files = 400 files

But of course we can make use of dynamic routing. If you replace the concept file
with a concept id dynamic routing file feature folder, we would be down to 20 files.

	20 feature folders x 1 [conceptId].tsx = 20 files

This looks much better.

And if you replace the feature folder with a dynamic featureId folder name, we
would be down to 1 folder and 1 file.

	1 [featureId]/ folder x 1 [conceptId] file = 1 file
	
But we have to keep in mind that for every additional path in the URL, we would need
to have another level of nesting in our pages folder. So for example concept1/example1 
perhaps would lead to another level of nesting. And if you think about it, every pages
in our documentation website would have the same page layout.

So can we not define one file that can catch all the route segments in the URL?
We most definitely can and this is where the Catch-All Routes feature of 'next/router' 
comes into picture.

In the pages/ folder create another folder called docs/. Inside docs/ we will create a new
file. The file name is special to NextJS. Within square brackets we specify three dots 
similar to the spread operator, and then provide the name of your choice. 

We will be naming our file [...params].tsx which is sort of the convention. It refers
to parameters passed in. Within the file we can define a simple component. 

Now what is special about this page though is that it will match any URL that contains the 
'docs/' segment in the path. 

In the browser's URL Address Bar, if we type in 'localhost:3000/docs/feature1', we see the 
Docs home page. If we visit 'localhost:3000/docs/feature1/concept1', we still see the 
Docs home page. If we navigate to 'localhost:3000/docs/feature1/concept1/example1', we 
still see the same page. 

So our catch-all route as the name indicates catches all the URL segments and maps it to 
one single file in our project. This is useful for something like a documentation site 
because we want the different segments in the URL for better organization and SEO, but 
at the end of the day, the layout for the document will remain the same. 

So we define it once, but render it for multiple variables of the URL. 

Of course this isn't as useful if we can't capture the different segments in the URL.
Let us cover how to get a hold of those different segments. 

To capture the segments you will import { useRouter } from 'next/router' and within
the function body, you assign useRouter() to a variable called 'router', and then destructure
{ params } from 'router.query'.

Next we are going to console.log(params). Now 'params' here refers to the file name. 

After saving the code and visiting the browser. If we visit 'localhost:3000/docs/feature1/concept1/example1', 
we will see that the console logged the params array. The params array has three items: [feature1, concept1, example1].

So unlike dynamic routes where the id is a string, params is an array. 
Also you can see that initially params is undefined, and this is because of the pre-rendering 
feature in NextJS which will be discussed later.

TypeScript will infer that 'params' is of type string | string[] | undefined. To avoid
issues with our if statement that will check for 'params.length', we will destructure { params }
from 'router.query' and give it a default value of an empty array [] in the case that 
'router.query' has no value to return for 'params'. 

    const router = useRouter();
    const { params = [] } = router.query;

After setting initial value of 'params' to an empty array, TypeScript now infers that
the type for 'params' is string | string[] and you will no longer see errors in your 
if statment when checking for 'params.length'.

Let's use the 'params' array and update our JSX to render the difference 
elements within the array.



Additional Use Cases:

Now another possible usecase for the Catch-All Route is to pass
filter parameters for a page.

Let's assume we are building a real estate website. As a user, 
we want to view a list of all the houses listed for sale.

But we should be able to filter the houses based on our budget.

To cater to that, we can create a catcha-all router where we 
have a router for /houses and this would list all the houses, but 
we can also enter /houses/100000/1000000 as min and max budget. 

The catch-all route can extract these values and filter the 
list of houses when can then be displayed to the user. 



Optional Catch-All Routes:

One last thing to discuss is the optional catch-all router as well.
At the moment, if we navigate to just 'localhost:3000/docs', we will get a 
404 Error Page. 

This is taken care of by NextJS and we will talk about it more later. 

But what you should know for now is that NextJS provides optional 
Catch-All Routes to help with this scenario. All you have to do is
go back to your IDE, wrap the file name [...params].tsx with another 
pair of square brackets, changing the file name to [[...params]].tsx.

You can now go back to the browser, and if you visit 'localhost:3000/docs' 
once more, you will see that the the 404 Error Page is no longer showing and 
in its place the fall back <h1>Docs Home Page</h1> JSX gets rendered instead.

This is really helpful for our documentation site to render the home page
for just /docs, and then the individual pages for /feature1 and /concept1.
*/

import { useRouter } from 'next/router';

function Doc() {
    const router = useRouter();
    const { params = [] } = router.query;

    if (params.length === 2) {
        return <h1>Viewing docs for feature {params[0]} and concept {params[1]}</h1>
    } else if (params.length === 1) {
        return <h1>Viewing docs for feature {params[0]}</h1>
    }

    // And if the user tries to enter more than two segments in the path, you can render the Docs Homepage text
    return <h1>Docs Home Page</h1>;
}

export default Doc;