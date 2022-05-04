<template>
<!-- eslint-disable max-len -->
  <ul class="catalog__pagination pagination">
    <li class="pagination__item">
      <a href="#" class="pagination__link pagination__link--arrow" :class="{'pagination__link--disabled': page === 1}" aria-label="Предыдущая страница" @click.prevent="pageMinus()">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-left"></use>
        </svg>
      </a>
    </li>
    <li class="pagination__item" v-for="page_count in count" :key="`page${page_count}`">
      <a href="#" class="pagination__link" @click.prevent="changePage(page_count)" :class="{'pagination__link--current': page_count === page}">
        {{ page_count }}
      </a>
    </li>
    <li class="pagination__item">
      <a href="#" class="pagination__link pagination__link--arrow" aria-label="Следующая страница" @click.prevent="pagePlus()" :class="{'pagination__link--disabled': page === count}">
        <svg width="8" height="14" fill="currentColor">
          <use xlink:href="#icon-arrow-right"></use>
        </svg>
      </a>
    </li>
  </ul>
<!-- eslint-enable max-len -->
</template>

<script>
export default {
  props: ['count', 'page'],

  model: {
    prop: 'page',
    event: 'change',
  },

  methods: {
    changePage(page) {
      this.$emit('change', page);
    },

    pagePlus() {
      if (this.page !== this.count) {
        this.changePage(this.page + 1);
      }
    },

    pageMinus() {
      if (this.page !== 1) {
        this.changePage(this.page - 1);
      }
    },
  },
};
</script>
