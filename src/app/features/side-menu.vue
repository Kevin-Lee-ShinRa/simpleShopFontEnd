<script setup>
import { ref, onMounted } from 'vue';

import login from '../login/login';

import {
  mdiShopping, mdiPlusThick, mdiCart, mdiBasket, mdiHistory, mdiClose
} from '@mdi/js';

import UserCenter from '@/app/features/main-pages/user-center';

import axios from 'axios';

const drawer = ref(null);

const routerNum = ref(1);

function ToAllGoods() {
  routerNum.value = 1;
}

function ToAddGoods() {
  routerNum.value = 2;
}

function ToCart() {
  routerNum.value = 3;
}

function ToOrders() {
  routerNum.value = 4;
}

function ToHistory() {
  routerNum.value = 5;
}

const username = ref('');

// 获取用户信息
const userProfile = ref(null);
const fetchUserProfile = async () => {
  try {
    const response = await axios.get('http://192.168.10.4:8000/myloginpart/getuserprofile/', {
      headers: {
        Authorization: `Token ${ localStorage.getItem('token') }`  // 通过 Token 认证
      }
    });
    userProfile.value = response.data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
  }
};

onMounted(() => {
  const storedUsername = localStorage.getItem('username');
  if (storedUsername) {
    username.value = storedUsername;
  }
  fetchUserProfile();  // 页面挂载时获取用户资料
});
</script>
<template>
  <v-sheet color="transparent">
    <!--    头像部分-->
    <v-list class="py-12">
      <v-sheet
          color="transparent"
          class="d-flex pl-7">
        <user-center></user-center>
        <v-list-item link>
          <v-list-item-content>
            <v-list-item-title class="text-h6">
              <h2 v-if="username">
                <span
                    class="font-size-24"
                    style="color: rgb(0,0,0)">
                {{ userProfile.nickname }}
              </span>
              </h2>
              <h2 v-else>请登录</h2>
            </v-list-item-title>
            <v-list-item-subtitle>余额：0</v-list-item-subtitle>
          </v-list-item-content>
          <v-list-item-action>
            <v-icon>mdi-menu-down</v-icon>
          </v-list-item-action>
        </v-list-item>
      </v-sheet>
    </v-list>
    <!--    路由-->
    <router-link
        to="/AllGoods"
        style="text-decoration: none;">
      <v-sheet
          width="85%"
          height="60px"
          color="transparent"
          class="cur-pointer d-flex mx-auto align-center px-12 br-1 rounded-lg"
          :class="{ 'active-class': routerNum === 1, 'hover-color': routerNum !== 1 }"
          @click="ToAllGoods">
        <v-icon
            size="30"
            color="rgb(149,36,58)">{{ mdiShopping }}
        </v-icon>
        <div
            class="ml-6 font-size-20"
            style="color:rgb(149,36,58);text-decoration: none;">所有商品
        </div>
      </v-sheet>
    </router-link>
    <router-link
        to="/AddGoods"
        style="text-decoration: none;">
      <v-sheet
          width="85%"
          height="60px"
          color="transparent"
          class="cur-pointer d-flex mx-auto align-center px-12 br-1 rounded-lg"
          :class="{ 'active-class': routerNum === 2, 'hover-color': routerNum !== 2 }"
          @click="ToAddGoods">
        <v-icon
            size="30"
            color="rgb(127,1,26)">{{ mdiPlusThick }}
        </v-icon>
        <div
            class="ml-6 font-size-20"
            style="color:rgb(127,1,26)">添加商品
        </div>
      </v-sheet>
    </router-link>
    <router-link
        to="/Cart"
        style="text-decoration: none;">
      <v-sheet
          width="85%"
          height="60px"
          color="transparent"
          class="cur-pointer d-flex mx-auto align-center px-12 br-1 rounded-lg"
          :class="{ 'active-class': routerNum === 3, 'hover-color': routerNum !== 3 }"
          @click="ToCart">
        <v-icon
            size="30"
            color="rgb(127,1,26)">{{ mdiCart }}
        </v-icon>
        <div
            class="ml-6 font-size-20"
            style="color:rgb(127,1,26)">购物车
        </div>
      </v-sheet>
    </router-link>
    <router-link
        to="/Orders"
        style="text-decoration: none;">
      <v-sheet
          width="85%"
          height="60px"
          color="transparent"
          class="cur-pointer d-flex mx-auto align-center px-12 br-1 rounded-lg"
          :class="{ 'active-class': routerNum === 4, 'hover-color': routerNum !== 4 }"
          @click="ToOrders">
        <v-icon
            size="30"
            color="rgb(127,1,26)">{{ mdiBasket }}
        </v-icon>
        <div
            class="ml-6 font-size-20"
            style="color:rgb(127,1,26)">我的订单
        </div>
      </v-sheet>
    </router-link>
    <router-link
        to="/History"
        style="text-decoration: none;">
      <v-sheet
          width="85%"
          height="60px"
          color="transparent"
          class="cur-pointer d-flex mx-auto align-center px-12 br-1 rounded-lg"
          :class="{ 'active-class': routerNum === 5, 'hover-color': routerNum !== 5 }"
          @click="ToHistory">
        <v-icon
            size="30"
            color="rgb(127,1,26)">{{ mdiHistory }}
        </v-icon>
        <div
            class="ml-6 font-size-20"
            style="color:rgb(127,1,26)">浏览记录
        </div>
      </v-sheet>
    </router-link>
  </v-sheet>
</template>
<style
    scoped
    lang="sass">
.hover-color:hover
  background-color: rgb(235, 235, 235) !important

.active-class
  background-color: #fff !important

</style>