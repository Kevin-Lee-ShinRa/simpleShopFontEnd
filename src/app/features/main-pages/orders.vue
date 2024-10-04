<script setup>
import { ref, onMounted } from 'vue';

import axios from 'axios';

import { mdiTrashCanOutline, mdiCheck, mdiFileEditOutline, mdiPlus, mdiClose, mdiRefresh } from '@mdi/js';

const goods = ref([]);

const fetchGoods = async () => {
  try {
    const response = await axios.get('http://192.168.10.7:8000/orders');
    goods.value = response.data;
  } catch (error) {
    console.error('Failed to fetch goods:', error);
  }
};

onMounted(() => {
  fetchGoods();
});
</script>
<template>
  <v-sheet>

  </v-sheet>
</template>
<style scoped>

</style>