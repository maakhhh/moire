<template>
<!-- eslint-disable max-len -->
    <li class="catalog__item">
      <router-link class="catalog__pic" href="#" :to="{name: 'product', params: {id: product.id}}">
        <img :src="image" :alt="product.title" v-if="image">
        <NotPhoto v-else />
      </router-link>

      <h3 class="catalog__title">
        <router-link :to="{name: 'product', params: {id: product.id}}" href="#">
          {{ product.title }}
        </router-link>
      </h3>

      <span class="catalog__price">
        {{ product.price | numberFormat }} ₽
      </span>
      <form>
        <ul class="colors colors--black">
          <li class="colors__item" v-for="(color) in product.colors" :key="String(product.id) + String(color.id)">
            <label class="colors__label" >
              <input v-model="currColor" class="colors__radio sr-only" type="radio" name="color-1" :value="color.color.id">
              <span v-if="color.color.code === '#ffffff'" class="colors__value" style="background-color: #f0f0f0;"></span>
              <span v-else class="colors__value" :style="{backgroundColor: color.color.code}"></span>
            </label>
          </li>
        </ul>
      </form>
    </li>
<!-- eslint-enable max-len -->
</template>

<script>
import numberFormat from '@/helpers/numberFormat';
import NotPhoto from '@/components/NotPhoto.vue';

export default {
  data() {
    return {
      currColor: this.product.colors[0].color.id,
    };
  },

  components: { NotPhoto },

  props: ['product'],

  filters: { numberFormat },

  computed: {
    image() {
      const { gallery } = this.product.colors
        .find((color) => color.color.id === this.currColor);
      return gallery ? gallery[0].file.url : null;
    },
  },
};
</script>
