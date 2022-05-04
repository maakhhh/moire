<template>
<!-- eslint-disable max-len -->
  <ul class="catalog__list">
    <ProductItem v-for="product in products" :key="product.id" :product="product"/>
  </ul>
<!-- eslint-enable max-len -->
</template>

<script>
import ProductItem from '@/components/ProductItem.vue';

export default {
  props: ['products'],

  components: { ProductItem },
};
</script>
