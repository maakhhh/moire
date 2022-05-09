<template>
<!-- eslint-disable max-len -->
  <aside class="filter">
    <form class="filter__form form" @submit.prevent="filter">
      <fieldset class="form__block">
        <legend class="form__legend">Цена</legend>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="min-price" v-model.number="currPriceFrom">
          <span class="form__value">От</span>
        </label>
        <label class="form__label form__label--price">
          <input class="form__input" type="text" name="max-price" v-model.number="currPriceTo">
          <span class="form__value">До</span>
        </label>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Категория</legend>
        <label class="form__label form__label--select" v-if="categories">
          <select class="form__select" type="text" name="category" v-model="currCategoryId">
            <option value="0">Все категории</option>
            <option v-for="category in categories" :key="category.id" :value="category.id">{{ category.title }}</option>
          </select>
        </label>
        <BaseLoader class="loader" v-else/>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Цвет</legend>
        <ul class="colors" v-if="colors">
          <li class="colors__item" v-for="color in colors" :key="color.id">
            <label class="colors__label">
              <input class="colors__radio sr-only" type="checkbox" name="color" :value="color.id" v-model="currColorIds" checked="">
              <span v-if="color.code === '#ffffff'" class="colors__value" style="background-color: #f0f0f0"></span>
              <span v-else class="colors__value" :style="{backgroundColor: color.code}"></span>
            </label>
          </li>
        </ul>
        <BaseLoader class="loader" v-else/>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Материал</legend>
        <ul class="check-list" v-if="materials">
          <li class="check-list__item" v-for="material in materials" :key="material.id">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="material" :value="material.id" v-model="currMaterialsIds">
              <span class="check-list__desc">
                {{ material.title }}
                <span>({{ material.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
        <BaseLoader class="loader" v-else/>
      </fieldset>

      <fieldset class="form__block">
        <legend class="form__legend">Коллекция</legend>
        <ul class="check-list" v-if="seasons">
          <li class="check-list__item" v-for="season in seasons" :key="season.id">
            <label class="check-list__label">
              <input class="check-list__check sr-only" type="checkbox" name="collection" :value="season.id" v-model="currSeasonsIds">
              <span class="check-list__desc">
                {{ season.title }}
                <span>({{ season.productsCount }})</span>
              </span>
            </label>
          </li>
        </ul>
        <BaseLoader class="loader" v-else/>
      </fieldset>

      <button class="filter__submit button button--primery" type="submit">
        Применить
      </button>
      <button v-if="resetEnable" class="filter__reset button button--second" type="button" @click.prevent="reset()">
        Сбросить
      </button>
    </form>
  </aside>
<!-- eslint-enable max-len -->
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';
import BaseLoader from '@/components/BaseLoader.vue';

export default {
  props: ['priceFrom', 'priceTo', 'categoryId', 'materialsIds', 'seasonsIds', 'colorIds', 'categories'],

  data() {
    return {
      categoriesData: [],
      seasonsData: [],
      materialsData: [],
      colorsData: [],

      currPriceFrom: 0,
      currPriceTo: 0,
      currCategoryId: 0,
      currMaterialsIds: [],
      currSeasonsIds: [],
      currColorIds: [],
    };
  },

  components: {
    BaseLoader,
  },

  computed: {
    seasons() {
      return this.seasonsData ? this.seasonsData.items : [];
    },

    materials() {
      return this.materialsData ? this.materialsData.items : [];
    },

    colors() {
      return this.colorsData ? this.colorsData.items : [];
    },

    resetEnable() {
      if (this.priceFrom !== 0) {
        return true;
      }
      if (this.priceTo !== 0) {
        return true;
      }
      if (this.categoryId !== 0) {
        return true;
      }
      if (this.materialsIds.length !== 0) {
        return true;
      }
      if (this.seasonsIds.length !== 0) {
        return true;
      }
      if (this.colorIds.length !== 0) {
        return true;
      }
      return false;
    },
  },

  methods: {
    loadSeasons() {
      return axios
        .get(`${API_BASE_URL}api/seasons`)
        .then((response) => { this.seasonsData = response.data; });
    },

    loadMaterials() {
      return axios
        .get(`${API_BASE_URL}api/materials`)
        .then((response) => { this.materialsData = response.data; });
    },

    loadColors() {
      return axios
        .get(`${API_BASE_URL}api/colors`)
        .then((response) => { this.colorsData = response.data; });
    },

    filter() {
      if (this.$route.params.category !== this.currCategoryId) {
        this.$router.push({ name: 'main' });
      }

      this.$emit('update:priceFrom', this.currPriceFrom);
      this.$emit('update:priceTo', this.currPriceTo);
      this.$emit('update:categoryId', this.currCategoryId);
      this.$emit('update:materialsIds', this.currMaterialsIds);
      this.$emit('update:seasonsIds', this.currSeasonsIds);
      this.$emit('update:colorIds', this.currColorIds);
    },

    reset() {
      if (this.$route.params.category !== 0) {
        this.$router.push({ name: 'main' });
      }

      this.$emit('update:priceFrom', 0);
      this.$emit('update:priceTo', 0);
      this.$emit('update:categoryId', 0);
      this.$emit('update:materialsIds', []);
      this.$emit('update:seasonsIds', []);
      this.$emit('update:colorIds', []);
    },
  },

  watch: {
    priceFrom(value) {
      this.currPriceFrom = value;
    },
    priceTo(value) {
      this.currPriceTo = value;
    },
    categoryId(value) {
      this.currCategoryId = value;
    },
    materialsIds(value) {
      this.currMaterialsIds = value;
    },
    seasonsIds(value) {
      this.currSeasonsIds = value;
    },
    colorIds(value) {
      this.currColorIds = value;
    },
  },

  created() {
    this.loadSeasons();
    this.loadMaterials();
    this.loadColors();

    if (this.categoryId) {
      this.currCategoryId = this.categoryId;
    }
  },
};
</script>

<style scoped>
 .loader {
   display: block;
   width: 30px;
   height: 30px;
   margin-bottom: 130px;
 }
</style>
