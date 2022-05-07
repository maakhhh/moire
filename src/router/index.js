import Vue from 'vue';
import VueRouter from 'vue-router';
import MainPage from '@/pages/MainPage.vue';
import ProductPage from '@/pages/ProductPage.vue';
import CartPage from '@/pages/CartPage.vue';
import OrderPage from '@/pages/OrderPage.vue';
import OrderInfoPage from '@/pages/OrderInfoPage.vue';
import NotFoundPage from '@/pages/NotFoundPage.vue';

Vue.use(VueRouter);

const routes = [
  {
    name: 'main',
    component: MainPage,
    path: '/',
  },
  {
    name: 'main-category',
    component: MainPage,
    path: '/category/:category',
  },
  {
    name: 'product',
    component: ProductPage,
    path: '/product/:id',
  },
  {
    name: 'cart',
    component: CartPage,
    path: '/cart',
  },
  {
    name: 'order',
    component: OrderPage,
    path: '/order',
  },
  {
    name: 'order-info',
    component: OrderInfoPage,
    path: '/order-info/:id',
  },
  {
    name: 'not-found',
    component: NotFoundPage,
    path: '*',
  },
];

const router = new VueRouter({
  routes,
});

export default router;
