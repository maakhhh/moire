<template>
<!-- eslint-disable max-len -->
  <BaseFormField :title="title" :error="error">
    <textarea v-if="type === 'textarea'" class="form__input form__input--area" :placeholder="placeholder" v-model="dataValue"></textarea>
    <input v-else v-model="dataValue" class="form__input" :type="type" :placeholder="placeholder">
  </BaseFormField>
<!-- eslint-enable max-len -->
</template>

<script>
import BaseFormField from '@/components/BaseFormField.vue';

export default {
  components: { BaseFormField },

  props: ['title', 'type', 'error', 'placeholder', 'value'],

  computed: {
    dataValue: {
      get() {
        return this.value;
      },

      set(value) {
        this.$emit('input', value);
      },
    },
  },
};
</script>
