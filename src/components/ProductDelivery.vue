<template>
<!-- eslint-disable max-len -->
  <div class="item__content">
    <h3>Доставка:</h3>

    <p>
      <span style="display: block;" v-for="(del, index) in delivery" :key="del.id">{{ index + 1 }}. {{ del.title }} – {{ del.price }} ₽ </span>
      <br>
    </p>

    <h3>Возврат:</h3>

    <p>
      Любой возврат должен быть осуществлен в течение Возвраты в магазине БЕСПЛАТНО.<br>
      Вы можете вернуть товары в любой магазин. Магазин должен быть расположен в стране, в которой Вы осуществили покупку.
      БЕСПЛАТНЫЙ возврат в Пункт выдачи заказов.<br>
      Для того чтобы вернуть товар в одном из наших Пунктов выдачи заказов, позвоните по телефону 8 800 600 90 09<br>
    </p>

  </div>
<!-- eslint-enable max-len -->
</template>

<script>
import axios from 'axios';
import API_BASE_URL from '@/config';

export default {
  data() {
    return {
      deliveryData: [],
    };
  },

  computed: {
    delivery() {
      return this.deliveryData ? this.deliveryData : [];
    },
  },

  methods: {
    loadDelivery() {
      return axios
        .get(`${API_BASE_URL}api/deliveries`)
        .then((response) => { this.deliveryData = response.data; });
    },
  },

  created() {
    this.loadDelivery();
  },
};
</script>
