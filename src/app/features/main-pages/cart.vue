<script setup>
import { ref, onMounted } from 'vue';

import axios from 'axios';

import { mdiTrashCanOutline, mdiCheck, mdiFileEditOutline, mdiPlus, mdiClose, mdiRefresh } from '@mdi/js';

const goods = ref([]);

const showEditBtns = ref(false);

const showRightBtns = () => {
  showEditBtns.value = !showEditBtns.value;
};

const selectedItems = ref([]);

const toggleSelectItem = (id) => {
  if (selectedItems.value.includes(id)) {
    selectedItems.value = selectedItems.value.filter(itemId => itemId !== id);
  } else {
    selectedItems.value.push(id);
  }
};

const clearSelected = () => {
  selectedItems.value = [];
};

const isSelected = (id) => {
  return selectedItems.value.includes(id);
};

const deleteItem = async (id) => {
  try {
    const response = await fetch(`http://192.168.10.4:8000/cart/${ id }/`, {
      method: 'DELETE'
    });

    if (response.ok) {
      // 删除成功，更新本地 goods 列表
      goods.value = goods.value.filter(item => item.id !== id);
      console.log(`Item ${ id } deleted successfully.`);
    } else {
      console.error('Failed to delete the item.');
    }
  } catch (error) {
    console.error('Error:', error);
  }
};

const deleteSelected = async () => {
  try {
    for (const id of selectedItems.value) {
      await deleteUserCartItem(id);
    }
    clearSelected();  // Clear the selected items after deletion
    console.log('Selected items deleted successfully.');
  } catch (error) {
    console.error('Error deleting selected items:', error);
  }
};

const cartItems = ref([]);

const fetchCartItems = async () => {
  try {
    const token = localStorage.getItem('token'); // 假设你的 token 是存储在 localStorage 中的
    if (!token) {
      console.error('Token not found');
      return;
    }
    const response = await axios.get('http://192.168.10.4:8000/myloginpart/ucarts/', {
      headers: {
        'Authorization': `Token ${ token }`  // 添加认证信息
      }
    });
    cartItems.value = response.data;
  } catch (error) {
    console.error('Failed to fetch cart items:', error);
  }
};

// 删除购物车条目的方法
const deleteUserCartItem = async (cartId) => {
  try {
    // 发送 DELETE 请求到后端 API
    await axios.delete('http://192.168.10.4:8000/myloginpart/ucarts/', {
      data:    { id: cartId },
      headers: {
        Authorization: `Token ${ localStorage.getItem('token') }`
      }
    });
    // 从购物车列表中移除已删除的条目
    cartItems.value = cartItems.value.filter(item => item.id !== cartId);
    console.log('购物车条目已成功删除');
  } catch (error) {
    console.error('删除购物车条目时发生错误', error);
  }
};

onMounted(() => {
  fetchCartItems();
});
</script>

<template>
  <v-sheet>
    <v-container>
      <!--控制栏-->
      <v-sheet
          color="rgba(255,255,255,0.8)"
          class="d-flex justify-space-between py-3 mb-3"
          style="position: sticky;top: 60px;z-index: 3">
        <!--        左按钮-->
        <v-btn
            fab
            color="rgb(127,1,26)"
            @click="showRightBtns"
            class="mx-2 pos-relative">
          <transition name="expand-fade">
            <v-icon
                v-if="!showEditBtns"
                size="30"
                color="#F4F4F4"
                class="pos-absolute">
              {{ mdiFileEditOutline }}
            </v-icon>
          </transition>
          <transition name="expand-fade">
            <v-icon
                v-if="showEditBtns"
                size="30"
                color="#F4F4F4"
                class="pos-absolute">
              {{ mdiClose }}
            </v-icon>
          </transition>
        </v-btn>
        <!--        右按钮-->
        <v-sheet
            color="transparent"
            class="d-flex justify-space-between align-center">
          <transition name="expand-fade">
            <v-btn
                v-if="showEditBtns"
                fab
                class="mx-2"
                small
                color="rgb(127,1,26)"
                @click="clearSelected">
              <v-icon
                  size="26"
                  color="#F4F4F4">
                {{ mdiRefresh }}
              </v-icon>
            </v-btn>
          </transition>
          <transition name="expand-fade">
            <v-btn
                v-if="showEditBtns"
                fab
                class="mx-2"
                small
                color="rgb(127,1,26)"
                @click="deleteSelected">
              <v-icon
                  size="26"
                  color="#F4F4F4">
                {{ mdiTrashCanOutline }}
              </v-icon>
            </v-btn>
          </transition>
          <transition name="expand-fade">
            <v-btn
                v-if="showEditBtns"
                fab
                class="mx-2"
                small
                color="rgb(127,1,26)"
                @click="addGoodsToOrders">
              <v-icon
                  size="26"
                  color="#F4F4F4">
                {{ mdiPlus }}
              </v-icon>
            </v-btn>
          </transition>
        </v-sheet>
      </v-sheet>
      <!--      购物车-->
      <div>
        <v-row>
          <v-col
              v-for="item in cartItems"
              :key="item.id"
              cols="6">
            <v-card height="270">
              <!-- 图片 -->
              <v-img
                  :src="`http://192.168.10.4:8000${item.good_image}`"
                  height="150"
                  alt="商品图片"></v-img>
              <!-- 商品名称 -->
              <v-list-item-title class="text-h5 my-2 ml-4">{{ item.good_name }}</v-list-item-title>
              <!-- 商品描述 -->
              <v-list-item-subtitle class="subtitle-2 ml-4">{{ item.good_description }}</v-list-item-subtitle>
              <!-- 价格 -->
              <v-list-item class="grow">
                <v-list-item-content>
                  <div
                      class="text-h5 ml-n2"
                      style="color: rgb(127,0,25)">
                    ￥{{ item.good_price }}
                  </div>
                </v-list-item-content>
                <v-row
                    align="center"
                    justify="end"
                    class="pos-relative">
                  <transition name="expand-fade">
                    <v-btn
                        v-if="!showEditBtns"
                        fab
                        small
                        class="mx-2 pos-absolute"
                        color="rgb(127,1,26)"
                        @click="deleteUserCartItem(item.id)">
                      <v-icon
                          size="30"
                          color="#F4F4F4">
                        {{ mdiTrashCanOutline }}
                      </v-icon>
                    </v-btn>
                  </transition>
                  <transition name="expand-fade">
                    <v-btn
                        v-if="showEditBtns"
                        fab
                        small
                        class="mx-2 pos-absolute"
                        outlined
                        @click="toggleSelectItem(item.id)"
                        :style="{
                        backgroundColor: isSelected(item.id) ? 'rgb(127,0,25)' : '#F4F4F4',
                        borderColor: 'grey'}">
                      <v-icon
                          color="rgb(244,244,244)"
                          size="30">
                        {{ mdiCheck }}
                      </v-icon>
                    </v-btn>
                  </transition>
                </v-row>
              </v-list-item>
            </v-card>
          </v-col>
        </v-row>
      </div>
    </v-container>
  </v-sheet>
</template>

<style scoped>
.expand-fade-enter-active, .expand-fade-leave-active {
    transition: all 0.7s ease;
}

.expand-fade-enter, .expand-fade-leave-to {
    opacity: 0;
    height: 0;
    width: 0;
}
</style>
