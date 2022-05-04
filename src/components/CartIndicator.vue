<template>
<!-- eslint-disable max-len -->
  <router-link class="header__cart" :to="{name: 'cart'}" aria-label="Корзина с товарами">
    <svg width="19" height="24">
      <use xlink:href="#icon-cart"></use>
    </svg>
    <MiniLoader v-if="$store.state.cartLoading" />
    <span v-else class="header__count" aria-label="Количество товаров">{{ $store.state.cartProducts.length }}</span>
  </router-link>
<!-- eslint-enable max-len -->
</template>

<script>
import MiniLoader from '@/components/MiniLoader.vue';

export default {
  components: { MiniLoader },
};
</script>
