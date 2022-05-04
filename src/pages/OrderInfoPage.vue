<template>
<!-- eslint-disable max-len -->
  <div class="container loader" v-if="$store.state.orderInfoLoading"><BaseLoader/></div>
  <div style="text-align: center;" v-else-if="$store.state.orderError">{{ $store.state.orderError }}</div>
  <main class="content container" v-else>
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

      <h1 class="content__title">
        Заказ оформлен <span>№ {{ orderId }}</span>
      </h1>
    </div>

    <section class="cart">
      <form class="cart__form form" action="#" method="POST">
        <div class="cart__field">
          <p class="cart__message">
            Благодарим за&nbsp;выбор нашего магазина. На&nbsp;Вашу почту придет письмо с&nbsp;деталями заказа.
            Наши менеджеры свяжутся с&nbsp;Вами в&nbsp;течение часа для уточнения деталей доставки.
          </p>

          <ul class="dictionary">
            <li class="dictionary__item">
              <span class="dictionary__key">
                Получатель
              </span>
              <span class="dictionary__value">
                {{ order.name }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Адрес доставки
              </span>
              <span class="dictionary__value">
                {{ order.address }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Телефон
              </span>
              <span class="dictionary__value">
                {{ order.phone }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Email
              </span>
              <span class="dictionary__value">
                {{ order.email }}
              </span>
            </li>
            <li class="dictionary__item">
              <span class="dictionary__key">
                Способ оплаты
              </span>
              <span class="dictionary__value">
                {{ order.paymentType }}
              </span>
            </li>
          </ul>
        </div>

        <div class="cart__block">
          <OrderList :products="products" />

          <div class="cart__total">
            <p>Доставка: <b>{{ delivery }}</b></p>
            <p>Итого: <b>{{ products.length | counterProductFormat }}</b> на сумму <b>{{ order.totalPrice | numberFormat }} ₽</b></p>
          </div>
        </div>
      </form>
    </section>
  </main>
<!-- eslint-enable max-len -->
</template>

<script>
import { mapActions } from 'vuex';
import OrderList from '@/components/OrderList.vue';
import numberFormat from '@/helpers/numberFormat';
import counterProductFormat from '@/helpers/counterProductFormat';
import BaseLoader from '@/components/BaseLoader.vue';

export default {
  computed: {
    orderId() {
      return this.$route.params.id;
    },

    order() {
      return this.$store.state.orderInfo
        ? this.$store.state.orderInfo
        : {};
    },

    products() {
      return this.$store.state.orderInfo
        ? this.$store.state.orderInfo.basket.items.map((product) => ({
          title: product.product.title,
          price: product.price * product.quantity,
          id: product.product.id,
          key: product.id,
        }))
        : [];
    },

    delivery() {
      if (this.$store.state.orderInfo) {
        if (this.order.deliveryType.price === '0') {
          return 'бесплатно';
        }
        return this.order.deliveryType.price;
      }
      return 0;
    },
  },

  components: { OrderList, BaseLoader },

  filters: { numberFormat, counterProductFormat },

  methods: {
    ...mapActions(['loadOrderInfo']),
  },

  watch: {
    orderId() {
      this.loadOrderInfo(this.orderId);
    },
  },

  created() {
    if (this.$store.state.orderInfo && this.$store.state.orderInfo.id === this.orderId) {
      return;
    }
    this.loadOrderInfo(this.orderId);
  },
};
</script>

<style>
  .loader {
    text-align: center;
  }
</style>
