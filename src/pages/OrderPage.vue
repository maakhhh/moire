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
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="1" v-model.number="form.deliveryTypeId">
                  <span class="options__value">
                    Самовывоз <b>бесплатно</b>
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="delivery" value="2" v-model.number="form.deliveryTypeId">
                  <span class="options__value">
                    Курьером <b>1 200 ₽</b>
                  </span>
                </label>
              </li>
            </ul>

            <h3 class="cart__title">Оплата</h3>
            <ul class="cart__options options">
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="1" v-model.number="form.paymentTypeId">
                  <span class="options__value">
                    Картой при получении
                  </span>
                </label>
              </li>
              <li class="options__item">
                <label class="options__label">
                  <input class="options__radio sr-only" type="radio" name="pay" :value="2" v-model="form.paymentTypeId">
                  <span class="options__value">
                    Наличными при получении
                  </span>
                </label>
              </li>
            </ul>
          </div>
        </div>

        <div class="cart__block">
          <OrderList :products="products"/>
          <div class="cart__total">
            <p>Доставка: <b v-if="form.deliveryTypeId === 1">бесплатно</b><b v-else>1 200 ₽</b></p>
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

    price() {
      const price = this.products.reduce((pr, product) => (
        pr + product.price
      ), 0);
      if (this.form.deliveryTypeId === 2) {
        return price + 1200;
      }
      return price;
    },

    count() {
      return this.products.length;
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
  },
};
</script>

<style>
  .loading {
    margin-top: 30px;
    text-align: center;
  }
</style>
