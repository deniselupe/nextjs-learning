/*
    Next.js <Link /> Component

    Keep in mind that <Link /> is only used for client-side routing.

    If you need to route user to an external resource, use HTML <a> 
    tag instead.

    Also keep in mind that you shouldn't be using HTML <a> tag 
    for client-side routing as it would make a new server request and any
    client state you are maintaining will be erased.
*/

import Link from 'next/link';

function ProductsPage({ productId = 100}) {
    return (
        <div>
            <h2>Welcome To Products Page</h2>
            <br />
            <br />
            <p>Product List:</p>
            <ul>
                <li>
                    <Link href="/products/1">
                        Product 1
                    </Link>
                </li>
                <li>
                    <Link href="/products/2">
                        Product 2
                    </Link>
                </li>                
                <li>
                    <Link href="/products/3" replace>
                        Product 3
                    </Link>
                </li>
                <li>
                    <Link href={`/products/${productId}`}>
                        Product {productId}
                    </Link>
                </li>
            </ul>
        </div>
    );
}

export default ProductsPage;