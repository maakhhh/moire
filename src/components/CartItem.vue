<template>
<!-- eslint-disable max-len -->
  <li class="cart__item product">
    <div class="product__pic">
      <img :src="product.color.gallery[0].file.url" width="120" height="120" :alt="product.product.title">
    </div>
    <h3 class="product__title">
      {{ product.product.title }}
    </h3>
    <p class="product__info product__info--color">
      Цвет:
      <span>
        <i :style="{backgroundColor: product.color.color.code}"></i>
        {{ product.color.color.title }}
      </span>
    </p>
    <span class="product__code">
      Артикул: {{ product.product.id }}
    </span>

    <div class="product__counter form__counter">
      <button type="button" aria-label="Убрать один товар" @click.prevent="minusAmount()">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-minus"></use>
        </svg>
      </button>

      <input v-model.number="amount" type="number" name="count">

      <button type="button" aria-label="Добавить один товар" @click.prevent="plusAmount()">
        <svg width="10" height="10" fill="currentColor">
          <use xlink:href="#icon-plus"></use>
        </svg>
      </button>
    </div>

    <b class="product__price">
      {{ price | numberFormat }} ₽
    </b>

    <button class="product__del button-del" type="button" @click.prevent="deleteProduct(product.product.id)" aria-label="Удалить товар из корзины">
      <svg width="20" height="20" fill="currentColor">
        <use xlink:href="#icon-close"></use>
      </svg>
    </button>
  </li>
<!-- eslint-enable max-len -->
</template>

<script>
import { mapActions } from 'vuex';
import numberFormat from '@/helpers/numberFormat';

export default {
  props: ['product'],

  filters: { numberFormat },

  methods: {
    ...mapActions(['updateAmount', 'deleteProduct']),

    minusAmount() {
      if (this.amount > 1) {
        this.amount -= 1;
      }
    },

    plusAmount() {
      this.amount += 1;
    },
  },

  computed: {
    price() {
      return this.product.product.price * this.amount;
    },

    amount: {
      get() {
        return this.product.count;
      },

      set(value) {
        this.updateAmount({ id: this.product.product.id, amount: value });
      },
    },
  },
};
</script>
