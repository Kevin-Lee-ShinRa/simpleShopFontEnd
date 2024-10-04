<script setup>
import { onMounted, ref } from 'vue';

import axios from 'axios';

const dialog = ref(false);

// 定义响应式变量
const nickname = ref('');

const avatar = ref(null);

// 存储图片的URL
const avatarUrl = ref(null);

// 处理文件上传
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    avatar.value = file;
    // 使用 FileReader 读取文件
    const reader = new FileReader();
    reader.onload = (e) => {
      avatarUrl.value = e.target.result; // 生成图片的URL
    };
    reader.readAsDataURL(file);
  }
};

const fileInput = ref(null);

const triggerFileInput = () => {
  fileInput.value.click();  // 触发隐藏的文件输入框点击事件
};

// 提交资料更新
const updateProfile = async () => {
  const formData = new FormData();
  formData.append('nickname', nickname.value);
  if (avatar.value) {
    formData.append('avatar', avatar.value);
  }

  try {
    const response = await axios.post('http://192.168.10.4:8000/myloginpart/profileupdate/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization:  `Token ${ localStorage.getItem('token') }`  // 如果需要身份验证
      }
    });
    console.log('Profile updated:', response.data);
    window.location.reload();
  } catch (error) {
    console.error('Error updating profile:', error);
  }
};

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
    console.error('获取用户资料完成:');
  } catch (error) {
    console.error('获取用户资料失败:', error);
  }
};

onMounted(() => {
  fetchUserProfile();  // 页面挂载时获取用户资料
});
</script>

<template>
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="dialog-bottom-transition">
      <!--      按钮-->
      <template v-slot:activator="{ on, attrs }">
        <v-list-item-avatar
            v-bind="attrs"
            v-on="on">
          <v-img
              :src="`http://192.168.10.4:8000${userProfile.avatar}`"
              alt="用户头像" />
        </v-list-item-avatar>
      </template>
      <v-card>
        <!--        toolbar-->
        <v-toolbar
            height="70"
            color="rgb(244,244,244)">
          <v-toolbar-title
              class="ml-7"
              style="color:rgb(127,1,26)">用户中心
          </v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
                text
                color="rgb(127,1,26)"
                @click="dialog = false">
              返回
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!--        整体-->
        <v-sheet
            height="calc(100vh - 70px)"
            color="#fff"
            class="d-flex align-center">
          <v-sheet
              width="30%"
              style="background-image: url('/default.jpg'); background-size: cover; background-position: center;"
              class="mx-auto">
            <!--          展示-->
            <v-sheet
                color="rgba(255,255,255,0.30)"
                class="d-flex">
              <!--            旧-->
              <v-sheet
                  width="50%"
                  color="transparent"
                  class="d-flex align-center">
                <v-list-item-avatar>
                  <v-img
                      :src="`http://192.168.10.4:8000${userProfile.avatar}`"
                      alt="用户头像" />
                </v-list-item-avatar>
                <span
                    class="font-size-24"
                    style="color: rgb(0,0,0)">{{ userProfile.nickname }}</span>
              </v-sheet>
              <!--              新-->
              <v-sheet
                  width="50%"
                  color="transparent"
                  class="d-flex align-center">
                <v-list-item-avatar>
                  <img
                      v-if="avatarUrl"
                      :src="avatarUrl"
                      alt="Avatar Preview"
                      width="200" />
                </v-list-item-avatar>
                <span
                    class="font-size-24"
                    style="color: rgb(0,0,0)">{{ nickname }}</span>
              </v-sheet>
            </v-sheet>
            <!--            表单-->
            <form @submit.prevent="updateProfile">
              <v-sheet
                  color="rgba(255,255,255,0.50)"
                  class="d-flex flex-column align-center">
                <!--              输入框-->
                <v-sheet
                    color="transparent"
                    width="70%">
                  <v-sheet
                      color="transparent"
                      class="d-flex align-center mx-auto mt-6">
                    <v-text-field
                        id="nickname"
                        outlined
                        dense
                        color="rgb(127,0,25)"
                        v-model="nickname"
                        label="昵称"
                        placeholder="填写商品昵称">
                    </v-text-field>
                  </v-sheet>
                </v-sheet>
                <!--头像-->
                <v-sheet
                    width="70%"
                    color="transparent">
                  <button
                      class="custom-button"
                      @click="triggerFileInput">点击此处上传头像
                  </button>
                  <!-- 隐藏的文件输入框 -->
                  <input
                      type="file"
                      id="avatar"
                      ref="fileInput"
                      @change="handleFileUpload"
                      accept="image/*"
                      class="img-input-hidden" />
                </v-sheet>
              </v-sheet>
              <!--              按钮-->
              <v-sheet color="rgba(255,255,255,0.50)">
                <v-sheet
                    color="transparent"
                    width="70%"
                    class="mx-auto d-flex py-5">
                  <v-btn
                      outlined
                      color="rgb(127,1,26)"
                      type="submit"
                      class="ml-auto">更改
                  </v-btn>
                </v-sheet>
              </v-sheet>
            </form>
          </v-sheet>
        </v-sheet>
      </v-card>
    </v-dialog>
  </v-row>
</template>
<style lang="sass">
/* 完全隐藏原生的文件输入框 */
.img-input-hidden
  display: none

/* 自定义按钮样式 */
.custom-button
  width: 100%
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