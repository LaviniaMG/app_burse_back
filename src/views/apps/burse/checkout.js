'use client';

// material-ui
import { Box } from '@mui/material';

// project imports
import MainCard from '../../../components/MainCard';
import CircularLoader from '../../../components/CircularLoader';
import CheckoutTab from '../../../sections/apps/burse/checkout/CheckoutTab';
import { useGetCart } from '../../../api/cart';

// ==============================|| PRODUCT - CHECKOUT MAIN ||============================== //

const Checkout = () => {
  const { cartLoading, cart } = useGetCart();

  const loader = (
    <MainCard>
      <Box sx={{ height: 'calc(100vh - 310px)' }}>
        <CircularLoader />
      </Box>
    </MainCard>
  );

  return cartLoading ? loader : <CheckoutTab cart={cart} />;
};

export default Checkout;
