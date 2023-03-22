/*
Custom 404 Page

If you try to a route that is not defined in the pages/ folder,
nextJS will render a 404 Error Page by default without us having to 
add additional file.

So if you navigate to 'localhost:3000/dashboard', we see the default
404 page. This page could not be found. 

You might want to customize the appearance of the 404 page. 

To create a custom 404 page, all you have to do is create a 
404.tsx file in the pages/ folder.

It is required to name the file 404.tsx/jsx and nothing else.
*/

function PageNotFound() {
    return <h1>404 Page with all the custom stying necessary.</h1>;
}

export default PageNotFound;