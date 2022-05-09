<template>
<!-- eslint-disable max-len -->
  <main class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link" href="#">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <div class="breadcrumbs__link">
            Корзина
          </div>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Корзина
        </h1>
        <span class="content__info">
          {{ count }} товара
        </span>
      </div>
    </div>
    <BaseLoader v-if="$store.state.cartLoading" />
    <section v-else class="cart">
      <form class="cart__form form">
        <div class="cart__field">
          <ul class="cart__list">
            <CartItem v-for="product in products" :key="`cart${product.product.id}`" :product="product" />
          </ul>
        </div>

        <div class="cart__block">
          <p class="cart__desc">
            Мы&nbsp;посчитаем стоимость доставки на&nbsp;следующем этапе
          </p>
          <p class="cart__price">
            Итого: <span>{{ price | numberFormat }} ₽</span>
          </p>

          <router-link tag="button" :to="{name: 'order'}" v-if="products.length !== 0" class="cart__button button button--primery" type="submit">
            Оформить заказ
          </router-link>
        </div>
      </form>
    </section>
  </main>
<!-- eslint-enable max-len -->
</template>

<script>
import { mapGetters } from 'vuex';
import CartItem from '@/components/CartItem.vue';
import numberFormat from '@/helpers/numberFormat';
import BaseLoader from '@/components/BaseLoader.vue';

export default {
  components: { CartItem, BaseLoader },

  filters: { numberFormat },

  computed: {
    ...mapGetters({ products: 'getProducts' }),

    count() {
      return this.products.length;
    },

    price() {
      return this.products.reduce((pr, product) => (
        pr + product.product.price * product.count
      ), 0);
    },
  },
};
</script>
