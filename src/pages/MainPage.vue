<template>
<!-- eslint-disable max-len -->
  <main class="content container">
    <div class="content__top">

      <div class="content__row">
        <h1 class="content__title">
          Каталог
        </h1>
        <span class="content__info">
          {{ countProducts | counterProductFormat }}
        </span>
      </div>
    </div>

    <div class="content__catalog">
      <ProductFilter :priceFrom.sync="priceFrom" :priceTo.sync="priceTo" :categoryId.sync="categoryId" :materialsIds.sync="materialsIds" :seasonsIds.sync="seasonsIds" :colorIds.sync="colorIds" />
      <section class="catalog">
        <BaseLoader v-if="productsLoader"/>
        <ProductList :products="products"/>
        <BasePagination v-model="page" :count="countPages" :page="page"/>
      </section>
    </div>
  </main>
<!-- eslint-enable max-len -->
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';
import ProductList from '@/components/ProductList.vue';
import BasePagination from '@/components/BasePagination.vue';
import ProductFilter from '@/components/ProductFilter.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import counterProductFormat from '@/helpers/counterProductFormat';

export default {
  data() {
    return {
      productsData: [],

      perPage: 12,
      page: 1,

      categoryId: 0,
      priceFrom: 0,
      priceTo: 0,
      materialsIds: [],
      seasonsIds: [],
      colorIds: [],

      productsLoader: false,
    };
  },

  filters: {
    counterProductFormat,
  },

  components: {
    ProductList,
    BasePagination,
    ProductFilter,
    BaseLoader,
  },

  computed: {
    products() {
      return this.productsData ? this.productsData.items : [];
    },

    countPages() {
      return this.productsData.pagination ? this.productsData.pagination.pages : 0;
    },

    countProducts() {
      return this.productsData.pagination ? this.productsData.pagination.total : 0;
    },
  },

  methods: {
    loadProducts() {
      this.productsLoader = true;
      clearTimeout(this.loadTimer);
      this.loadTimer = setTimeout(() => {
        axios
          .get(`${API_BASE_URL}api/products`, {
            params: {
              page: this.page,
              limit: this.perPage,
              minPrice: this.priceFrom,
              maxPrice: this.priceTo,
              categoryId: this.categoryId,
              materialIds: this.materialsIds,
              seasonIds: this.seasonsIds,
              colorIds: this.colorIds,
            },
          })
          .then((response) => { this.productsData = response.data; })
          .finally(() => { this.productsLoader = false; });
      }, 0);
    },
  },

  watch: {
    page() {
      this.loadProducts();
    },

    priceFrom() {
      this.loadProducts();
    },

    priceTo() {
      this.loadProducts();
    },

    categoryId() {
      this.loadProducts();
    },

    materialsIds() {
      this.loadProducts();
    },

    seasonsIds() {
      this.loadProducts();
    },
  },

  created() {
    this.loadProducts();
  },
};
</script>
