<script setup>
import { ref } from 'vue';

import axios from 'axios';

axios.defaults.headers.common['Authorization'] = `Token ${ localStorage.getItem('token') }`;

const imageUrl = ref(null);  // 用于存储上传图片的预览链接

const imageFile = ref(null); // 用于存储上传的文件

const width = ref(300);

const fileInput = ref(null);

const text1 = ref('');

const text2 = ref('');

const text3 = ref('');

const image = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();  // 触发隐藏的文件输入框点击事件
};

// 处理图片上传
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    imageFile.value = file;
    imageUrl.value = URL.createObjectURL(file); // 生成图片的预览链接
  }
};

// 提交表单
const clear = () => {
  imageUrl.value = null;
  imageFile.value = null;
  text1.value = '';
  text2.value = '';
  text3.value = '';
  fileInput.value.value = '';  // 清空文件输入框
};

const handleSubmit = () => {
  const formData = new FormData();
  formData.append('good_name', text1.value);        // 商品名称
  formData.append('good_description', text2.value); // 商品描述
  formData.append('good_price', text3.value);       // 商品价格
  if (imageFile.value) {
    formData.append('good_image', imageFile.value);   // 商品图片
  }
  // 查看表单数据
  for (let pair of formData.entries()) {
    console.log(pair[0] + ': ' + pair[1]);
  }
  // 发送 POST 请求到后端
  axios.post('http://192.168.10.4:8000/allgoods/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
       .then(response => {
         console.log('Data submitted successfully:', response.data);
         clear();
       })
       .catch(error => {
         console.error('Error submitting data:', error);
       });
};
</script>
<template>
  <!--  整体-->
  <v-sheet
      height="calc(100vh - 60px)"
      color="rgb(150,100,12)"
      class="d-flex align-center"
      style="background-image: url('/default.jpg'); background-size: cover; background-position: center;">
    <!--    主体-->
    <v-sheet
        width="52%"
        height="80%"
        color="rgba(255,255,255,0.7)"
        class="mx-auto">
      <!--      主体的主体-->
      <form @submit.prevent="handleSubmit">
        <!--        上(图片)-->
        <v-sheet
            color="transparent"
            height="40%">
          <!--      标题-->
          <v-sheet
              color="transparent"
              class="d-flex justify-center pt-10 pb-3">
            <span
              class="font-size-30"
              style="color: rgb(149,36,58)">添加商品</span>
          </v-sheet>
          <!--  图片-->
          <div class="d-flex flex-column justify-space-between align-center">
            <v-img
                :aspect-ratio="16/9"
                :width="width"
                :src="imageUrl"
            ></v-img>
          </div>
          <!--  上传图片-->
          <v-sheet
              width="80%"
              color="transparent"
              class="d-flex align-center justify-space-between mt-3 mx-auto">
            <div
                class="font-size-22"
                style="color: rgb(149,36,58)">商品图片:(请上传适当比例照片)
            </div>
            <div>
              <!-- 自定义按钮 -->
              <button
                  class="custom-button"
                  @click="triggerFileInput">点击此处上传图片
              </button>
              <!-- 隐藏的文件输入框 -->
              <input
                  type="file"
                  id="image"
                  ref="fileInput"
                  @change="handleImageUpload"
                  accept="image/*"
                  class="img-input-hidden" />
            </div>
          </v-sheet>
        </v-sheet>
        <!--      下(文本及按钮)-->
        <v-sheet
            height="60%"
            color="transparent"
            class="align-center justify-space-between">
          <!--        输入框-->
          <v-sheet color="transparent">
            <v-sheet
                width="80%"
                color="transparent"
                class="d-flex align-center mx-auto mt-3 mb-n5">
              <v-text-field
                  id="text"
                  outlined
                  dense
                  color="rgb(127,0,25)"
                  v-model="text1"
                  label="商品名称"
                  placeholder="填写商品名称">
              </v-text-field>
            </v-sheet>
            <v-sheet
                width="80%"
                color="transparent"
                class="d-flex align-center mx-auto pt-3 mb-n3">
              <v-text-field
                  id="text"
                  outlined
                  dense
                  color="rgb(127,0,25)"
                  v-model="text2"
                  label="商品描述"
                  placeholder="填写商品描述">
              </v-text-field>
            </v-sheet>
            <v-sheet
                width="80%"
                color="transparent"
                class="d-flex align-center mx-auto">
              <v-text-field
                  id="text"
                  outlined
                  dense
                  color="rgb(127,0,25)"
                  v-model="text3"
                  label="商品价格"
                  placeholder="填写商品价格">
              </v-text-field>
            </v-sheet>
          </v-sheet>
          <!--        按钮-->
          <v-sheet
              width="80%"
              color="transparent"
              class="d-flex mx-auto"
              style="margin-top: 20px">
            <v-sheet
                color="transparent"
                class="ml-auto">
              <v-btn
                  outlined
                  color="rgb(127,1,26)"
                  type="submit">添加
              </v-btn>
            </v-sheet>
            <v-sheet
                color="transparent"
                class="ml-3">
              <v-btn
                  outlined
                  color="rgb(127,1,26)"
                  @click="clear">清除
              </v-btn>
            </v-sheet>
          </v-sheet>
        </v-sheet>
      </form>
    </v-sheet>
  </v-sheet>
</template>
<style lang="sass">
/* 完全隐藏原生的文件输入框 */
.img-input-hidden
  display: none

/* 自定义按钮样式 */
.custom-button
  padding: 5px 20px
  border: 2px solid #93403b
  border-radius: 5px
  background-color: transparent
  color: #93403b
  font-size: 16px
  cursor: pointer
  text-align: center
  outline: none
  transition: background-color 0.3s, border-color 0.3s

/* 悬停时的样式 */
.custom-button:hover
  background-color: #e4e4e4
  border-color: #812f2b

/* 点击时的样式 */
.custom-button:active
  background-color: #d4d4d4
</style>