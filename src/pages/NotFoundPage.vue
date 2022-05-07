<template>
  <div class="container">
    <div class="not-found">
      <h1 class="error-code">404</h1>
      <p class="not-text">Page not found</p>
      <router-link :to="{name: 'main'}">go to main</router-link>
    </div>
  </div>
</template>

<script>
export default {

};
</script>

<style scoped>
  .not-found {
    margin-top: 108px;
    margin-bottom: 108px;
    text-align: center;
  }

  .error-code {
    font-size: 200px;
    margin: 0px;
  }

  .not-text {
    margin: 0;
    font-size: 40px;
  }
</style>
