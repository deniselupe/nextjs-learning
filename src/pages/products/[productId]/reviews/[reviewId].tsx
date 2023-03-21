import { useRouter } from 'next/router';

function ReviewDetails() {
    const router = useRouter();
    const { productId, reviewId } = router.query;

    return <h2>Review {reviewId} for Product ID {productId}</h2>;
}

export default ReviewDetails;