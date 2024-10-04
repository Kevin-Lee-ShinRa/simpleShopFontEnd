<script setup>
import { ref, onMounted, watch } from 'vue';

import axios from 'axios';

import { mdiPlus, mdiMagnify, mdiArrowUp, mdiArrowDown } from '@mdi/js';

import GoodsDetail from '@/app/features/main-pages/goods-detail';

const goods = ref([]);

const page = ref(1);

const totalItems = ref(0);  // 存储总条目数

const itemsPerPage = 10;    // 每页显示的条目数，与后端设置保持一致

// 搜索关键字
const searchQuery = ref('');

const sortOption = ref('');  // 存储当前排序选项

// 获取商品的函数
const fetchGoods = async () => {
  try {
    const response = await axios.get(`http://192.168.10.4:8000/allgoods/?page=${page.value}&search=${searchQuery.value}&sort=${sortOption.value}`);
    goods.value = response.data.results;  // 检查这里是否正确更新了商品数据
    totalItems.value = response.data.count;
    console.log(goods.value);  // 打印商品数据，确认是否按照期望的顺序
  } catch (error) {
    console.error('Failed to fetch goods:', error);
  }
};

// 点击排序时更新排序方式
const updateSort = (newSort) => {
  sortOption.value = newSort;
  page.value = 1;  // 每次排序时从第一页开始
  fetchGoods();
};

const searchGoods = () => {
  page.value = 1;  // 搜索时从第一页开始
  fetchGoods();
};

const onPageChange = (newPage) => {
  page.value = newPage;
  fetchGoods();  // 当页码改变时，重新获取数据
};

watch(page, () => {
  fetchGoods();  // 每次分页器变化时重新请求数据
});

const addToCart = (id) => {
  axios.post('http://192.168.10.4:8000/myloginpart/ucarts/', {
    goods_id: id,  // 商品ID
    quantity: 1    // 数量，您可以根据需要动态传递数量
  }, {
    headers: {
      Authorization: `Token ${ localStorage.getItem('token') }`  // 如果需要认证的话，使用Token
    }
  })
       .then(response => {
         console.log('商品已成功加入购物车', response.data);
       })
       .catch(error => {
         console.error('加入购物车时发生错误', error);
       });
};

onMounted(() => {
  fetchGoods();
});
</script>

<template>
  <v-sheet>
    <v-container class="d-flex flex-column" style="height: calc(100vh - 60px);">
      <!-- 顶部 -->
      <v-sheet
          height="60"
          class="d-flex align-center justify-space-between">
        <!--        排序-->
        <v-sheet
            width="7%"
            color="transparent">
          <v-menu offset-y style="z-index: 1 !important;">
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                  color="rgb(127,0,25)"
                  outlined
                  v-bind="attrs"
                  v-on="on">
                排序
              </v-btn>
            </template>
            <v-list>
              <v-list-item  @click="updateSort('price_asc')">
                <v-list-item-icon>
                  <v-icon color="rgb(127,0,25)">{{ mdiArrowUp }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title  style="color: rgb(127,0,25); font-size: 20px">价格升序</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item  @click="updateSort('price_desc')">
                <v-list-item-icon>
                  <v-icon color="rgb(127,0,25)">{{ mdiArrowDown }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title style="color: rgb(127,0,25); font-size: 20px">价格降序</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="updateSort('date_asc')">
                <v-list-item-icon>
                  <v-icon color="rgb(127,0,25)">{{ mdiArrowUp }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title style="color: rgb(127,0,25); font-size: 20px">日期升序</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click="updateSort('date_desc')">
                <v-list-item-icon>
                  <v-icon color="rgb(127,0,25)">{{ mdiArrowDown }}</v-icon>
                </v-list-item-icon>
                <v-list-item-content>
                  <v-list-item-title style="color: rgb(127,0,25); font-size: 20px">日期降序</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-sheet>
        <!--        搜索输入框和按钮-->
        <v-sheet
            color="transparent"
            width="92%"
            class="d-flex align-center">
            <v-text-field
                color="rgb(127,0,25)"
                v-model="searchQuery"
                label="搜索商品"
                class="mr-4"></v-text-field>
            <v-btn
                fab
                small
                dark
                color="rgb(127,0,25)"
                @click="searchGoods">
              <v-icon>
                {{ mdiMagnify }}
              </v-icon>
            </v-btn>
        </v-sheet>
      </v-sheet>
      <!--      商品-->
      <v-row>
        <v-col
            v-for="item in goods"
            :key="item.id"
            cols="3">
          <v-card
              height="270"
              style="overflow: hidden;">
            <!--            组件-->
            <GoodsDetail :item="item" />
            <v-list-item-title class="text-h5 my-2 ml-4 mt-7">
              {{ item.good_name }}{{ item.id }}
            </v-list-item-title>
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
                  justify="end">
                <v-btn
                    fab
                    small
                    class="mx-2"
                    color="rgb(127,1,26)"
                    @click="addToCart(item.id)">
                  <v-icon
                      size="30"
                      color="#F4F4F4">
                    {{ mdiPlus }}
                  </v-icon>
                </v-btn>
              </v-row>
            </v-list-item>
          </v-card>
        </v-col>
      </v-row>
      <!--      分页器-->
      <template>
        <div class="text-center">
          <v-container>
            <v-row justify="center">
              <v-col cols="8">
                <v-container class="max-width">
                  <v-pagination
                      v-model="page"
                      class="my-4"
                      :length="Math.ceil(totalItems / itemsPerPage)"
                      color="rgb(149,36,58)"
                      @input="onPageChange"
                      :total-visible="7"
                  ></v-pagination>
                </v-container>
              </v-col>
            </v-row>
          </v-container>
        </div>
      </template>
    </v-container>
  </v-sheet>
</template>

<style lang="sass">

</style>
