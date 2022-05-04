<template>
<!-- eslint-disable max-len -->
  <div v-if="productLoading" class="container"><BaseLoader class="loading"/></div>
  <div v-else-if="!productData">Ошибка</div>
  <main v-else class="content container">
    <div class="content__top">
      <ul class="breadcrumbs">
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link">
            Каталог
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <router-link :to="{name: 'main'}" class="breadcrumbs__link">
            {{ product.category.title }}
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            {{ product.title }}
          </a>
        </li>
      </ul>
    </div>

    <section class="item">
      <div class="item__pics pics">
        <div class="pics__wrapper">
          <img width="570" height="570" :src="gallery[0].file.url" :alt="product.title" v-if="gallery">
          <NotPhoto v-else class="not-photo"/>
        </div>
        <ul class="pics__list">
          <li class="pics__item" v-for="photo in gallery" :key="photo.file.name">
            <a href="#" class="pics__link pics__link--current">
              <img width="98" height="98" :src="photo.file.url" :alt="product.title">
            </a>
          </li>
        </ul>
      </div>

      <div class="item__info">
        <span class="item__code">Артикул: {{ product.id }}</span>
        <h2 class="item__title">
          {{ product.title }}
        </h2>
        <div class="item__form">
          <form class="form" @submit.prevent="addProduct({sizeId, colorId: currColor, quantity: count, productId: product.id})">
            <div class="item__row item__row--center">
              <div class="form__counter">
                <button type="button" aria-label="Убрать один товар" @click.prevent="minusCount()" :disabled="count === 1">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-minus"></use>
                  </svg>
                </button>

                <input type="text" v-model="count" name="count" disabled>

                <button type="button" aria-label="Добавить один товар" @click.prevent="count++">
                  <svg width="12" height="12" fill="currentColor">
                    <use xlink:href="#icon-plus"></use>
                  </svg>
                </button>
              </div>

              <b class="item__price">
                {{ product.price | numberFormat }} ₽
              </b>
            </div>

            <div class="item__row">
              <fieldset class="form__block">
                <legend class="form__legend">Цвет</legend>
                <ul class="colors colors--black">
                  <li class="colors__item" v-for="color in product.colors" :key="String(product.id) + String(color.color.id)">
                    <label class="colors__label">
                      <input class="colors__radio sr-only" type="radio" name="color-item" :value="color.color.id" v-model="currColor">
                      <span class="colors__value" :style="{backgroundColor: color.color.code}" v-if="color.color.code !== '#ffffff'"></span>
                      <span class="colors__value" style="background-color: #f0f0f0;" v-else></span>
                    </label>
                  </li>
                </ul>
              </fieldset>

              <fieldset class="form__block">
                <legend class="form__legend">Размер</legend>
                <label class="form__label form__label--small form__label--select">
                  <select class="form__select" type="text" name="category" v-model="sizeId">
                    <option v-for="size in product.sizes" :key="size.id" :value="size.id">{{ size.title }}</option>
                  </select>
                </label>
              </fieldset>
            </div>
            <div v-show="productAddedText">{{ productAddedText }}</div>
            <BaseLoader v-if="productAddedLoading" class="added-loading" />
            <button v-else class="item__button button button--primery" type="submit" :disabled="productLoading">
              В корзину
            </button>
          </form>
        </div>
      </div>

      <div class="item__desc">
        <ul class="tabs">
          <li class="tabs__item">
            <a class="tabs__link" href="#" :class="{'tabs__link--current': infoId === 0}" @click.prevent="infoId = 0">
              Информация о товаре
            </a>
          </li>
          <li class="tabs__item" >
            <a class="tabs__link" href="#" @click.prevent="infoId = 1" :class="{'tabs__link--current': infoId === 1}">
              Доставка и возврат
            </a>
          </li>
        </ul>

        <component :is="currInfoPage" :product="product"></component>
      </div>
    </section>
  </main>
<!-- eslint-enable max-len -->
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';
import numberFormat from '@/helpers/numberFormat';
import ProductInfo from '@/components/ProductInfo.vue';
import ProductDelivery from '@/components/ProductDelivery.vue';
import NotPhoto from '@/components/NotPhoto.vue';
import { mapActions } from 'vuex';
import BaseLoader from '@/components/BaseLoader.vue';

export default {
  data() {
    return {
      productData: null,
      productLoading: false,
      productAddedLoading: false,
      productAddedText: false,

      currColor: 0,
      count: 1,
      infoId: 0,
      sizeId: 0,

    };
  },

  components: { NotPhoto, BaseLoader },

  filters: { numberFormat },

  computed: {
    product() {
      return this.productData ? this.productData : [];
    },

    gallery() {
      return this.productData
        ? this.product.colors.find((color) => color.color.id === this.currColor).gallery
        : [];
    },

    currInfoPage() {
      if (this.infoId === 0) {
        return ProductInfo;
      }
      return ProductDelivery;
    },
  },

  methods: {
    ...mapActions(['addToCart']),
    addProduct({
      productId, sizeId, colorId, quantity,
    }) {
      this.productAddedLoading = true;
      this.addToCart({
        productId, sizeId, colorId, quantity,
      })
        .then(() => { this.productAddedText = 'Товар добавлен в корзину'; })
        .catch(() => { this.productAddedText = 'Произошла ошибка'; })
        .finally(() => { this.productAddedLoading = false; });
    },

    loadProduct() {
      this.productLoading = true;
      return axios
        .get(`${API_BASE_URL}api/products/${this.$route.params.id}`)
        .then((response) => {
          this.productData = response.data;
          this.currColor = response.data.colors[0].color.id;
          this.sizeId = response.data.sizes[0].id;
        })
        .finally(() => { this.productLoading = false; });
    },

    minusCount() {
      if (this.count !== 1) {
        this.count -= 1;
      }
    },
  },

  watch: {
    '$route.params.id': {
      handler() {
        this.loadProduct();
      },

      immediate: true,
    },
  },
};
</script>

<style scoped>
  .not-photo {
    width: 570px;
    height: 570px;
  }

  .loading {
    margin: 300px;
  }

  .added-loading {
    margin: 0 50px;
    width: 20px;
    height: 20px;
  }
</style>
