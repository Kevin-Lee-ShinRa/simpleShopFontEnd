<script setup>
import axios from 'axios';

import { mdiTrashCanOutline, mdiCheck, mdiFileEditOutline, mdiPlus, mdiClose, mdiRefresh } from '@mdi/js';

import { onMounted, ref } from 'vue';

const goods = ref([]);

const historyItems = ref([]);

const fetchHistoryItems = async () => {
  try {
    const token = localStorage.getItem('token'); // 假设你的 token 是存储在 localStorage 中的
    if (!token) {
      console.error('Token not found');
      return;
    }
    const response = await axios.get('http://192.168.10.4:8000/myloginpart/uhistory/', {
      headers: {
        'Authorization': `Token ${token}`  // 添加认证信息
      }
    });
    historyItems.value = response.data;
  } catch (error) {
    console.error('Failed to fetch history items:', error);
  }
};

const deleteUserHistoryItem = async (historyId) => {
  try {
    // 发送 DELETE 请求到后端 API
    await axios.delete('http://192.168.10.4:8000/myloginpart/uhistory/', {
      data: { id: historyId },
      headers: {
        Authorization: `Token ${localStorage.getItem('token')}`
      }
    });
    // 从购物车列表中移除已删除的条目
    historyItems.value = historyItems.value.filter(item => item.id !== historyId);
    console.log('购物车条目已成功删除');
  } catch (error) {
    console.error('删除购物车条目时发生错误', error);
  }
};

onMounted(() => {
  // fetchGoods();
  fetchHistoryItems();
});
</script>

<template>
  <v-sheet>
    <v-container>
      <!--控制栏-->
      <v-row>
        <v-col
            v-for="item in historyItems"
            :key="item.id"
            cols="6">
          <v-card height="270">
            <!-- 图片 -->
            <v-img
                :src="`http://192.168.10.4:8000${item.good_image}`"
                height="150"
                alt=""
                v-on="on"></v-img>
            <v-list-item-title class="text-h5 my-2 ml-4">{{ item.good_name }}</v-list-item-title>
            <v-list-item-subtitle class="subtitle-2 ml-4">{{ item.good_description }}</v-list-item-subtitle>
            <!-- 价格 -->
            <v-list-item class="grow">
              <v-list-item-content>
                <div
                    class="text-h5 ml-n2"
                    style="color: rgb(127,0,25)">￥{{ item.good_price }}
                </div>
              </v-list-item-content>
              <v-row
                  align="center"
                  justify="end">
                <v-btn
                    v-if="!showEditBtns"
                    fab
                    small
                    class="mx-2"
                    color="rgb(127,1,26)"
                    @click="deleteUserHistoryItem(item.id)">
                  <v-icon
                      size="30"
                      color="#F4F4F4">
                    {{ mdiTrashCanOutline }}
                  </v-icon>
                </v-btn>
                <v-btn
                    v-if="showEditBtns"
                    fab
                    small
                    class="mx-2"
                    outlined
                    @click="toggleSelectItem(item.id)"
                    :color="isSelected(item.id) ? 'green' : '#F4F4F4'">
                  <v-icon
                      size="30">
                    {{ mdiCheck }}
                  </v-icon>
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-sheet>
</template>
<style scoped>

</style>