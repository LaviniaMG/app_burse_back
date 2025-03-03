import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// next
import NextLink from 'next/link';

// material-ui
import { useTheme } from '@mui/material/styles';
import { Box, Button, CardContent, CardMedia, Chip, Divider, Grid, Rating, Stack, Typography } from '@mui/material';

// project import
import MainCard from '../../../components/MainCard';
import IconButton from '../../../components/@extended/IconButton';
import SkeletonProductPlaceholder from '../../../components/cards/skeleton/ProductPlaceholder';
import { useGetCart, addToCart } from '../../../api/cart';
import { openSnackbar } from '../../../api/snackbar';

// assets
import { HeartOutlined, HeartFilled } from '@ant-design/icons';

// ==============================|| PRODUCT CARD ||============================== //

const ProductCard = ({ id, color, name, brand, offer, isStock, image, description, offerPrice, salePrice, rating }) => {
  const theme = useTheme();
  const { cart } = useGetCart();

  const prodProfile = image && `/assets/images/burse  /${image}`;
  const [wishlisted, setWishlisted] = useState(false);

  const addCart = () => {
    addToCart({ id, name, image, salePrice, offerPrice, color, size: 8, quantity: 1, description }, cart.products);
    openSnackbar({
      open: true,
      message: 'Add To Cart Success',
      variant: 'alert',
      alert: {
        color: 'success'
      }
    });
  };

  const addToFavourite = () => {
    setWishlisted(!wishlisted);
    openSnackbar({
      open: true,
      message: 'Added to favourites',
      variant: 'alert',
      alert: {
        color: 'success'
      }
    });
  };

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  return (
    <>
      {isLoading ? (
        <SkeletonProductPlaceholder />
      ) : (
        <MainCard
          content={false}
          boxShadow
          sx={{
            '&:hover': {
              transform: 'scale3d(1.02, 1.02, 1)',
              transition: 'all .4s ease-in-out'
            }
          }}
        >
          <NextLink href={`/apps/burse/product-details/${id}`} passHref legacyBehavior>
            <Box sx={{ width: 250, m: 'auto' }}>
              <CardMedia sx={{ cursor: 'pointer', height: 250, textDecoration: 'none', opacity: isStock ? 1 : 0.25 }} image={prodProfile} />
            </Box>
          </NextLink>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            sx={{ width: '100%', position: 'absolute', top: 0, pt: 1.75, pl: 2, pr: 1 }}
          >
            {!isStock && <Chip variant="light" color="error" size="small" label="Sold out" />}
            {offer && <Chip label={offer} variant="combined" color="success" size="small" />}
            <IconButton color="secondary" sx={{ ml: 'auto', '&:hover': { background: 'transparent' } }} onClick={addToFavourite}>
              {wishlisted ? (
                <HeartFilled style={{ fontSize: '1.15rem', color: theme.palette.error.main }} />
              ) : (
                <HeartOutlined style={{ fontSize: '1.15rem' }} />
              )}
            </IconButton>
          </Stack>
          <Divider />
          <CardContent sx={{ p: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Stack>
                  <NextLink href={`/apps/burse/product-details/${id}`} passHref legacyBehavior>
                    <Typography
                      color="textPrimary"
                      variant="h5"
                      sx={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', display: 'block', cursor: 'pointer' }}
                    >
                      {name}
                    </Typography>
                  </NextLink>
                  <Typography variant="h6" color="textSecondary">
                    {brand}
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-end" flexWrap="wrap" rowGap={1.75}>
                  <Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="h5">${offerPrice}</Typography>
                      {salePrice && (
                        <Typography variant="h6" color="textSecondary" sx={{ textDecoration: 'line-through' }}>
                          ${salePrice}
                        </Typography>
                      )}
                    </Stack>
                    <Stack direction="row" alignItems="flex-start">
                      <Rating precision={0.5} name="size-small" value={rating} size="small" readOnly />
                      <Typography variant="caption">({rating?.toFixed(1)})</Typography>
                    </Stack>
                  </Stack>

                  <Button variant="contained" onClick={addCart} disabled={!isStock}>
                    {!isStock ? 'Sold Out' : 'Add to Cart'}
                  </Button>
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </MainCard>
      )}
    </>
  );
};

ProductCard.propTypes = {
  id: PropTypes.number,
  color: PropTypes.string,
  name: PropTypes.string,
  brand: PropTypes.string,
  isStock: PropTypes.bool,
  image: PropTypes.string,
  description: PropTypes.string,
  offerPrice: PropTypes.number,
  salePrice: PropTypes.number,
  offer: PropTypes.string,
  rating: PropTypes.number
};

export default ProductCard;
