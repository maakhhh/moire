import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import API_BASE_URL from '@/config';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    cartProducts: [],
    cartProductsData: [],
    cartLoading: false,
    orderInfoLoading: false,

    userAccessKey: null,
    orderInfo: null,
    orderError: null,
  },

  getters: {
    getProducts(state) {
      return state.cartProducts.map((item) => ({
        color: item.color,
        product: item.product,
        count: item.quantity,
      }));
    },
  },

  actions: {
    loadCart(context) {
      context.commit('updateCartLoading', true);
      return axios
        .get(`${API_BASE_URL}api/baskets`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            console.log(response.data.user.userAccessKey);
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCart');
        })
        .finally(() => context.commit('updateCartLoading', false));
    },

    addToCart(context, {
      productId, sizeId, colorId, quantity,
    }) {
      return axios
        .post(`${API_BASE_URL}api/baskets/products`, {
          productId,
          sizeId,
          colorId,
          quantity,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          if (!context.state.userAccessKey) {
            localStorage.setItem('userAccessKey', response.data.user.accessKey);
            context.commit('updateUserAccessKey', response.data.user.accessKey);
          }
          context.commit('updateCartProductsData', response.data.items);
          context.commit('syncCart');
        });
    },

    updateAmount(context, params) {
      context.commit('updateCartAmount', params);

      if (params.amount < 1) {
        return 0;
      }

      return axios
        .put(`${API_BASE_URL}api/baskets/products`, {
          basketItemId: context.state.cartProducts.find((item) => item.product.id === params.id).id,
          quantity: params.amount,
        },
        {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCart');
        });
    },

    deleteProduct(context, id) {
      const basketId = context.state.cartProducts.find((item) => item.product.id === id).id;
      context.commit('deleteProduct', id);
      return axios
        .delete(`${API_BASE_URL}api/baskets/products`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },

          data: {
            basketItemId: basketId,
          },
        })
        .then((response) => {
          context.commit('updateCartProductsData', response.data.items);
        })
        .catch(() => {
          context.commit('syncCart');
        });
    },

    loadOrderInfo(context, id) {
      context.commit('updateOrderError', '');
      context.commit('updateOrderInfoLoading', true);
      return axios
        .get(`${API_BASE_URL}api/orders/${id}`, {
          params: {
            userAccessKey: context.state.userAccessKey,
          },
        })
        .then((response) => {
          context.commit('updateOrderInfo', response.data);
        })
        .catch((error) => {
          context.commit('updateOrderError', error.response.data.error.message);
        })
        .finally(() => { context.commit('updateOrderInfoLoading', false); });
    },
  },

  mutations: {
    updateOrderInfoLoading(state, value) {
      state.orderInfoLoading = value;
    },

    updateOrderError(state, message) {
      state.orderError = message;
    },

    updateOrderInfo(state, orderInfo) {
      state.orderInfo = orderInfo;
    },

    resetCarts(state) {
      state.cartProducts = [];
      state.cartProductsData = [];
    },

    updateUserAccessKey(state, userAccessKey) {
      state.userAccessKey = userAccessKey;
    },

    deleteProduct(state, id) {
      state.cartProducts = state.cartProducts.filter((item) => item.product.id !== id);
    },

    updateCartProductsData(state, cart) {
      state.cartProductsData = cart;
    },

    syncCart(state) {
      state.cartProducts = state.cartProductsData;
    },

    updateCartLoading(state, loading) {
      state.cartLoading = loading;
    },

    updateCartAmount(state, params) {
      const product = state.cartProducts.find((item) => item.product.id === params.id);

      if (product) {
        product.quantity = params.amount;
      }
    },
  },
});
