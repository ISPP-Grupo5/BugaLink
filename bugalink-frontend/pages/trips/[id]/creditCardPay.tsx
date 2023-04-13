import CheckoutForm from '@/components/forms/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useSession } from 'next-auth/react';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripePromise = loadStripe('pk_test_51MwNI4BODAMiVg7vRuL6ewwXzKQkK3GElAPyoJPzC7tp6cRmb7xSf7s5dCXyspdLZ8qhWCDLxyGWX8mnsTmVGIkx00p6QInCUa');


export default function App() {
    const options = {
        // passing the client secret obtained from the server
        //clientSecret: data,
    };

    return (
        <Elements stripe={stripePromise} options={options}>
            <CheckoutForm />
        </Elements>
    );
};