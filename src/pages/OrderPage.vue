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
          <router-link :to="{name: 'cart'}" class="breadcrumbs__link" href="#">
            Корзина
          </router-link>
        </li>
        <li class="breadcrumbs__item">
          <a class="breadcrumbs__link">
            Оформление заказа
          </a>
        </li>
      </ul>

      <div class="content__row">
        <h1 class="content__title">
          Оформление заказа
        </h1>
      </div>
    </div>

    <section class="cart">
      <form class="cart__form form" @submit.prevent="submit()">
        <div class="cart__field">
          <div class="cart__data">
            <BaseFormInput type="text" v-model="form.name" title="ФИО" :error="errors.name" placeholder="Введите ваше полное имя"/>
            <BaseFormInput type="text" v-model="form.address" title="Адрес доставки" :error="errors.address" placeholder="Введите ваш адрес"/>
            <BaseFormInput type="tel" v-model="form.phone" title="Телефон" :error="errors.phone" placeholder="Введите ваш телефон"/>
            <BaseFormInput type="email" v-model="form.email" title="Email" :error="errors.email" placeholder="Введи ваш Email"/>
            <BaseFormInput type="textarea" v-model="form.comment" title="Комментарий к заказу" :error="errors.comment" placeholder="Ваши пожелания"/>
          </div>
          <div class="cart__options">
            <h3 class="cart__title">Доставка</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="delivery in deliveries" :key="`delivery-type${delivery.id}`">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" :value="delivery.id" v-model.number="form.deliveryTypeId">
                  <span class="options__value">
                    {{ delivery.title }}
                    <b v-if="delivery.price == 0">бесплатно</b>
                    <b v-else>{{ delivery.price | numberFormat }} ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item" v-for="payment in payments" :key="`payments${payment.id}`">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="payment.id" v-model.number="form.paymentTypeId">
                  <span class="options__value">
                    {{ payment.title }}
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <OrderList :products="products"/>
          <div class="cart__total">
            <p>Доставка: <b v-if="deliveryPrice == 0">бесплатно</b><b v-else>{{ deliveryPrice | numberFormat }} ₽</b></p>
            <p>Итого: <b>{{ count | counterProductFormat }}</b> на сумму <b>{{ price | numberFormat }} ₽</b></p>
          </div>
          <div v-if="loading" class="loading"><BaseLoader /></div>
          <button v-else class="cart__button button button--primery" type="submit">
            Оформить заказ
          </button>
        </div>
        <div class="cart__error form__error-block" v-show="errorMessage">
          <h4>Заявка не отправлена!</h4>
          <p>
            {{ errorMessage }}
          </p>
        </div>
      </form>
    </section>
  </main>
<!-- eslint-enable max-len -->
</template>

<script>
import OrderList from '@/components/OrderList.vue';
import numberFormat from '@/helpers/numberFormat';
import counterProductFormat from '@/helpers/counterProductFormat';
import BaseFormInput from '@/components/BaseFormInput.vue';
import BaseLoader from '@/components/BaseLoader.vue';
import axios from 'axios';
import API_BASE_URL from '@/config';
import { mapMutations } from 'vuex';

export default {
  data() {
    return {
      form: {
        deliveryTypeId: 1,
        paymentTypeId: 1,
      },
      errors: {},
      errorMessage: '',
      loading: false,

      deliveryData: null,
      paymentsData: null,
    };
  },

  filters: { numberFormat, counterProductFormat },

  components: { OrderList, BaseFormInput, BaseLoader },

  computed: {
    products() {
      return this.$store.state.cartProducts.map((product) => ({
        key: product.id,
        id: product.product.id,
        title: product.product.title,
        price: product.price * product.quantity,
      }));
    },

    deliveryPrice() {
      return this.deliveryData
        ? this.deliveries.find((delivery) => delivery.id === this.form.deliveryTypeId).price
        : [];
    },

    price() {
      const price = this.products.reduce((pr, product) => (
        pr + product.price
      ), 0);
      return price + +this.deliveryPrice;
    },

    count() {
      return this.products.length;
    },

    deliveries() {
      return this.deliveryData ? this.deliveryData : [];
    },

    payments() {
      return this.paymentsData ? this.paymentsData : [];
    },
  },

  watch: {
    'form.deliveryTypeId': {
      handler() {
        this.loadPayments();
      },
    },
  },

  methods: {
    ...mapMutations(['resetCarts', 'updateOrderInfo']),
    submit() {
      this.loading = true;
      this.errors = [];
      return axios
        .post(`${API_BASE_URL}api/orders`, { ...this.form }, {
          params: {
            userAccessKey: this.$store.state.userAccessKey,
          },
        })
        .then((response) => {
          this.updateOrderInfo(response.data);
          this.resetCarts();
          this.$router.push({ name: 'order-info', params: { id: response.data.id } });
        })
        .catch((error) => {
          this.errors = error.response.data.error.request || {};
          this.errorMessage = error.response.data.error.message
            || error.response.data.error.request.deliveryTypeId
            || error.response.data.error.request.paymentTypeId;
        })
        .finally(() => { this.loading = false; });
    },

    loadDelivery() {
      return axios
        .get(`${API_BASE_URL}api/deliveries`)
        .then((response) => { this.deliveryData = response.data; });
    },

    loadPayments() {
      return axios
        .get(`${API_BASE_URL}api/payments?deliveryTypeId=${this.form.deliveryTypeId}`)
        .then((response) => {
          this.paymentsData = response.data;
          this.form.paymentTypeId = response.data[0].id;
        });
    },
  },

  created() {
    this.loadDelivery();
    this.loadPayments();
  },
};
</script>

<style>
  .loading {
    margin-top: 30px;
    text-align: center;
  }
</style>
