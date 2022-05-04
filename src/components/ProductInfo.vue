<template>
  <div class="item__content">
    <h3>Состав:</h3>

    <p>
      <span v-for="material in product.materials" :key="material.code">{{ material.title }}, </span>
    </p>

    <h3>Коллекции:</h3>

    <p>
      <span v-for="season in product.seasons" :key="season.code">{{ season.title }}, </span>
    </p>

    <h3>Уход:</h3>

    <p>
      Машинная стирка при макс. 30ºC короткий отжим<br>
      Гладить при макс. 110ºC<br>
      Не использовать машинную сушку<br>
      Отбеливать запрещено<br>
      Не подвергать химчистке<br>
    </p>

  </div>
</template>

<script>
export default {
  props: ['product'],
};
</script>
