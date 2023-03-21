import { useRouter } from 'next/router';

function ProductDetails() {
    const router = useRouter();
    const { productId } = router.query;

    console.log(router.query);

    return (
        <h2>Details About Product {productId}</h2>
    );
}

export default ProductDetails;