import { useEffect, useState, ReactElement } from 'react';
import { useLoaderData } from 'react-router-dom';

// material-ui
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

// project-imports
import ProductCard from 'components/cards/e-commerce/ProductCard';
import FloatingCart from 'components/cards/e-commerce/FloatingCart';
import SkeletonProductPlaceholder from 'components/cards/skeleton/ProductPlaceholder';

import ProductFilterDrawer from 'sections/apps/e-commerce/products/ProductFilterDrawer';
import ProductsHeader from 'sections/apps/e-commerce/products/ProductsHeader';
import ProductEmpty from 'sections/apps/e-commerce/products/ProductEmpty';

import { resetCart, useGetCart } from 'api/cart';
import { filterProducts } from 'api/products';
import { GRID_COMMON_SPACING } from 'config';
import useConfig from 'hooks/useConfig';

// types
import { Products as ProductsTypo, ProductsFilter } from 'types/e-commerce';

const Main = styled('main', { shouldForwardProp: (prop: string) => prop !== 'open' && prop !== 'container' })<{
  open: boolean;
  container: any;
}>(({ theme }) => ({
  flexGrow: 1,
  transition: theme.transitions.create('margin', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.shorter
  }),
  marginLeft: -320,
  [theme.breakpoints.down('lg')]: {
    paddingLeft: 0,
    marginLeft: 0
  },
  variants: [
    {
      props: ({ container }) => container,
      style: {
        [theme.breakpoints.only('lg')]: { marginLeft: 0 }
      }
    },
    {
      props: ({ container, open }) => container && !open,
      style: {
        [theme.breakpoints.only('lg')]: { marginLeft: -240 }
      }
    },
    {
      props: ({ open }) => open,
      style: {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.shorter
        }),
        marginLeft: 0
      }
    }
  ]
}));

// ==============================|| ECOMMERCE - PRODUCTS ||============================== //

export default function ProductsPage() {
  const downLG = useMediaQuery((theme) => theme.breakpoints.down('lg'));

  const { cart } = useGetCart();
  const { container } = useConfig();

  const [isLoading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(false);
  }, []);

  // product data
  const initialProducts = useLoaderData() as ProductsTypo[];
  const [products, setProducts] = useState<ProductsTypo[]>(initialProducts);

  useEffect(() => {
    // clear cart if complete order
    if (cart && cart.step > 2) {
      resetCart();
    }
  }, [cart]);

  const [openFilterDrawer, setOpenFilterDrawer] = useState(!downLG);
  const handleDrawerOpen = () => {
    setOpenFilterDrawer((prevState) => !prevState);
  };

  // filter
  const initialState: ProductsFilter = {
    search: '',
    sort: 'low',
    gender: [],
    categories: ['all'],
    colors: [],
    price: '',
    rating: 0
  };
  const [filter, setFilter] = useState(initialState);

  const filterData = async () => {
    await filterProducts(filter).then((response) => {
      setProducts(response.data);
      setLoading(false);
    });
  };

  useEffect(() => {
    filterData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter]);

  let productResult: ReactElement | ReactElement[] = <></>;
  if (products && products.length > 0) {
    productResult = products.map((product: ProductsTypo, index: number) => (
      <Grid key={index} size={{ xs: 12, sm: 6, md: 4 }}>
        <ProductCard
          id={product.id}
          image={product.image}
          name={product.name}
          brand={product.brand}
          offer={product.offer}
          isStock={product.isStock}
          description={product.description}
          offerPrice={product.offerPrice}
          salePrice={product.salePrice}
          rating={product.rating}
          color={product.colors ? product.colors[0] : undefined}
          open={openFilterDrawer}
        />
      </Grid>
    ));
  } else {
    productResult = (
      <Grid sx={{ mt: 3 }} size={12}>
        <ProductEmpty handleFilter={() => setFilter(initialState)} />
      </Grid>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <ProductFilterDrawer
        filter={filter}
        setFilter={setFilter}
        openFilterDrawer={openFilterDrawer}
        handleDrawerOpen={handleDrawerOpen}
        setLoading={setLoading}
        initialState={initialState}
      />
      <Main open={openFilterDrawer} container={container}>
        <Grid container spacing={GRID_COMMON_SPACING}>
          <Grid size={12}>
            <ProductsHeader filter={filter} handleDrawerOpen={handleDrawerOpen} setFilter={setFilter} />
          </Grid>
          <Grid size={12}>
            <Grid container spacing={GRID_COMMON_SPACING}>
              {isLoading
                ? [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                    <Grid key={item} size={{ xs: 12, sm: 6, md: 4, lg: 4 }}>
                      <SkeletonProductPlaceholder />
                    </Grid>
                  ))
                : productResult}
            </Grid>
          </Grid>
        </Grid>
      </Main>
      <FloatingCart />
    </Box>
  );
}
