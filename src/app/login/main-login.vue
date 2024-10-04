<script setup>
import { ref } from 'vue';
import axios from 'axios';

const Choise = ref(1);

const ToLogin = () => (
  Choise.value = 1
);

const ToRegister = () => (
  Choise.value = 2
);

const rules = [
  value => !!value || '注册密码不可为空',             // 检查是否填写
  value => (value && value.length >= 3) || '长度不得少于三位'  // 检查最少3个字符
];

const emailrules = [
  value => !!value || '注册邮箱不可为空',            // 检查是否填写
  value => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) || '请输入有效的邮箱地址'  // 验证邮箱格式
];

// 示例字段的值
const inputValue = ref('');

const registerData = ref({
  username: '',
  email:    '',
  password: ''
});

const loginData = ref({
  username: '',
  password: ''
});

const handleRegister = async () => {
  try {
    const response = await axios.post('http://192.168.10.4:8000/myloginpart/register/', registerData.value);
    console.log('注册成功，Token:', response.data.token);
    alert('注册成功，请登录');
  } catch (error) {
    console.error('注册失败:', error.response.data);
  }
};

const handleLogin = async () => {
  try {
    const response = await axios.post('http://192.168.10.4:8000/myloginpart/login/', loginData.value);

    // 打印整个响应对象，以确保你获取了正确的数据
    console.log('登录响应:', response.data);

    // 假设后端返回的数据结构中有一个 'username' 字段
    if (response.data.username) {
      localStorage.setItem('username', response.data.username);
      console.log('登录成功，username:', response.data.username);
      window.location.href = 'http://192.168.10.4:8080/#/AllGoods';
    } else {
      console.warn('登录成功，但未接收到用户名');
    }

    // 存储Token
    localStorage.setItem('token', response.data.token);
    console.log('登录成功，Token:', response.data.token);

    // 登录成功后刷新页面
    window.location.reload();

  } catch (error) {
    // 打印错误信息以便调试
    if (error.response && error.response.data) {
      console.error('登录失败:', error.response.data);

      // 登录失败时弹出提示
      alert('登录失败：' + (error.response.data.message || '请检查你的用户名和密码'));
    } else {
      console.error('登录失败，未知错误:', error);

      // 未知错误时弹出提示
      alert('登录失败，未知错误');
    }
  }
};

const logout = async () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    // 发送登出请求
    await axios.post('http://192.168.10.4:8000/logout/', null, {
      headers: {
        'Authorization': `Token ${ token }`
      }
    });

    // 请求成功后，移除本地存储的 token
    localStorage.removeItem('token');
    localStorage.removeItem('username');  // 也可以考虑清除用户名
    // 重定向到登录页面（可根据需要修改）
    window.location.href = '/login';  // 根据你的路由设置修改路径
  } catch (error) {
    // 输出详细错误信息
    console.error('Failed to log out:', error.response ? error.response.data : error.message);
  }
};
</script>
<template>
  <v-sheet
      color="transparent"
      height="calc(100vh - 70px)"
      style="background-image: url('/default.jpg'); background-size: cover; background-position: center;">
    <v-sheet
        height="20%"
        color="transparent"></v-sheet>
    <!--      选择栏-->
    <v-sheet
        color="transparent"
        height="80"
        width="50%"
        class="d-flex mx-auto">
      <!--      登录选项-->
      <v-sheet
          width="50%"
          color="rgba(244,244,244,0.5)"
          class="d-flex flex-column justify-center"
          @click="ToLogin">
          <span
              class="font-size-26 mx-auto"
              style="color: rgb(127,0,25)">登录</span>
        <v-sheet
            height="2"
            width="100%"
            color="transparent">
          <v-expand-x-transition>
            <v-sheet
                v-show="Choise === 1"
                height="2"
                width="50%"
                class="mx-auto mt-1"
                color="rgb(149,36,58)"></v-sheet>
          </v-expand-x-transition>
        </v-sheet>
      </v-sheet>
      <!--      注册选项-->
      <v-sheet
          width="50%"
          color="rgba(244,244,244,0.5)"
          class="d-flex flex-column justify-center"
          @click="ToRegister">
           <span
               class="font-size-26 mx-auto"
               style="color: rgb(127,0,25)">注册</span>
        <v-sheet
            height="2"
            width="100%"
            color="transparent">
          <v-expand-x-transition>
            <v-sheet
                v-show="Choise === 2"
                height="2"
                width="50%"
                class="mx-auto mt-1"
                color="rgb(149,36,58)"></v-sheet>
          </v-expand-x-transition>
        </v-sheet>
      </v-sheet>
    </v-sheet>
    <!--      登录-->
    <v-sheet
        v-if="Choise===1"
        height="300"
        width="50%"
        color="rgba(244,244,244,0.7)"
        class="mx-auto">
      <form @submit.prevent="handleLogin">
        <v-sheet
            width="70%"
            color="transparent"
            class="mx-auto">
          <v-sheet
              color="transparent"
              class="pt-12">
            <v-text-field
                v-model="loginData.username"
                color="rgb(127,0,25)"
                type="text"
                id="login-username"
                label="请输入账号"
                class="pt-5"></v-text-field>
          </v-sheet>
          <v-text-field
              v-model="loginData.password"
              color="rgb(127,0,25)"
              type="password"
              id="login-password"
              label="请输入密码"
              :rules="rules"
              hide-details="auto"
          ></v-text-field>
          <v-sheet
              color="transparent"
              class="d-flex">
            <v-btn
                elevation="0"
                type="submit"
                class="ml-auto mt-5"
                outlined
                color="rgb(127,1,26)">登录
            </v-btn>
          </v-sheet>
        </v-sheet>
      </form>
    </v-sheet>
    <!--      注册-->
    <v-sheet
        v-if="Choise===2"
        height="300"
        width="50%"
        color="rgba(244,244,244,0.7)"
        class="mx-auto">
      <form @submit.prevent="handleRegister">
        <v-sheet
            width="70%"
            color="transparent"
            class="mx-auto">
          <!--        账号-->
          <v-sheet
              color="transparent"
              class="pt-12 mb-n7">
            <v-text-field
                v-model="registerData.username"
                color="rgb(127,0,25)"
                type="text"
                id="username"
                label="注册账号"
                class="pt-5"></v-text-field>
          </v-sheet>
          <!--        邮箱-->
          <v-text-field
              v-model="registerData.email"
              color="rgb(127,0,25)"
              type="email"
              id="email"
              label="注册邮箱"
              :rules="emailrules"
              hide-details="auto"></v-text-field>
          <!--        密码-->
          <v-text-field
              v-model="registerData.password"
              color="rgb(127,0,25)"
              type="password"
              id="password"
              label="注册密码"
              :rules="rules"
              hide-details="auto"></v-text-field>
          <!--        按钮-->
          <v-sheet
              color="transparent"
              class="d-flex">
            <v-btn
                elevation="0"
                type="submit"
                class="ml-auto mt-5"
                outlined
                color="rgb(127,1,26)">注册
            </v-btn>
          </v-sheet>
        </v-sheet>
      </form>
    </v-sheet>
  </v-sheet>
</template>
<style lang="sass">
</style>