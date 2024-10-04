<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

const dialog = ref(false);
const goods = ref([]);
const userProfile = ref(null);
const comments = ref([]);
const newComment = ref('');
const newReply = ref({}); // 保存每条评论的回复
const token = localStorage.getItem('token'); // 从 localStorage 获取 token

// 获取商品信息
const fetchGoods = async () => {
  try {
    const response = await axios.get('http://192.168.10.4:8000/allgoods');
    goods.value = response.data;
  } catch (error) {
    console.error('Failed to fetch goods:', error);
  }
};

// 获取用户信息
const fetchUserProfile = async () => {
  try {
    const response = await axios.get('http://192.168.10.4:8000/myloginpart/getuserprofile/', {
      headers: {
        Authorization: `Token ${token}` // 通过 Token 认证
      }
    });
    userProfile.value = response.data;
  } catch (error) {
    console.error('获取用户资料失败:', error);
  }
};

// 获取指定商品的评论
const fetchComments = async (goodsId) => {
  try {
    const response = await axios.get(`http://192.168.10.4:8000/goods/${goodsId}/comments/`, {
      headers: {
        Authorization: `Bearer ${token}` // 发送带 token 的请求
      }
    });
    comments.value = response.data;
  } catch (error) {
    console.error('获取评论失败:', error);
  }
};

// 发表评论
const postComment = async (goodsId) => {
  try {
    if (!newComment.value) {
      console.error('评论内容为空');
      return;
    }

    const response = await axios.post(
      `http://192.168.10.4:8000/goods/${goodsId}/comments/`,
      { content: newComment.value },
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    newComment.value = '';  // 清空输入框
    await fetchComments(goodsId);  // 重新获取评论列表，更新页面
  } catch (error) {
    console.error('发表评论失败:', error.response?.data || error.message);
  }
};

// 发表回复
const postReply = async (commentId) => {
  try {
    if (!newReply.value[commentId]) {
      console.error('回复内容为空');
      return;
    }

    const response = await axios.post(
      `http://192.168.10.4:8000/comments/${commentId}/replies/`,
      { content: newReply.value[commentId] },
      {
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    newReply.value[commentId] = '';  // 清空回复框
    await fetchComments(props.item.id);  // 重新获取评论列表，更新页面
  } catch (error) {
    console.error('发表评论失败:', error.response?.data || error.message);
  }
};

// 格式化日期的函数
const formatDate = (dateString, format = 'datetime') => {
  const date = new Date(dateString);
  let options;

  if (format === 'date') {
    options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  } else if (format === 'time') {
    options = { hour: '2-digit', minute: '2-digit' };
  } else {
    options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  }

  return new Intl.DateTimeFormat('zh-CN', options).format(date);
};

onMounted(() => {
  fetchGoods();
  fetchComments(props.item.id); // 使用传入的 item 自动获取评论
  fetchUserProfile();  // 页面挂载时获取用户资料
});
</script>

<template>
  <v-row justify="center">
    <v-dialog v-model="dialog" fullscreen hide-overlay transition="scale-transition">
      <template v-slot:activator="{ on, attrs }">
        <v-img :src="item.good_image" height="150" alt="" v-bind="attrs" v-on="on" style="object-fit: cover;"></v-img>
      </template>

      <v-card>
        <v-toolbar dark color="rgba(149,36,58,0.97)" style="position: sticky;top: 0px;z-index: 3">
          <v-avatar size="40">
            <v-img :src="`http://192.168.10.4:8000${userProfile.avatar}`" alt="用户头像"></v-img>
          </v-avatar>
          <span class="font-size-20 ml-3" style="color: #E0E4E7">{{ userProfile.nickname }}</span>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn dark text @click="dialog = false"><v-icon>{{ mdiClose }}</v-icon></v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-sheet width="80%" color="rgb(244,244,244)" class="mx-auto">
          <h3>评论区</h3>

          <!-- 显示评论 -->
          <v-sheet v-for="comment in comments" :key="comment.id" class="my-3">
            <v-sheet color="rgba(255,255,255,0.3)" class="d-flex pt-3">
              <v-avatar size="46" class="mx-3">
                <v-img :src="`http://192.168.10.4:8000${comment.commenter_avatar}`" alt="用户头像"></v-img>
              </v-avatar>
              <v-sheet>
                <div class="font-size-18 ml-0 mt-1" style="color: rgb(127,0,25)">{{ comment.commenter_nickname }}</div>
                <div class="font-size-15 ml-0 my-5" style="color: black">{{ comment.content }}</div>
                <p style="color: rgb(64, 64, 64)">{{ formatDate(comment.created_at, 'date') }} {{ formatDate(comment.created_at, 'time') }}</p>

                <!-- 回复部分 -->
                <v-sheet>
                  <v-text-field v-model="newReply[comment.id]" placeholder="写回复..." color="rgb(127,0,25)" outlined dense></v-text-field>
                  <v-btn small @click="postReply(comment.id)" color="rgb(149,36,58)">回复</v-btn>

                  <!-- 显示回复 -->
                  <v-sheet v-for="reply in comment.replies" :key="reply.id" class="d-flex mt-3">
                    <v-avatar size="36" class="mx-2">
                      <v-img :src="`http://192.168.10.4:8000${reply.replier_avatar}`" alt="回复者头像"></v-img>
                    </v-avatar>
                    <v-sheet>
                      <p class="font-size-15">{{ reply.replier_nickname }}: {{ reply.content }}</p>
                      <p class="text--secondary">{{ formatDate(reply.created_at, 'datetime') }}</p>
                    </v-sheet>
                  </v-sheet>
                </v-sheet>
              </v-sheet>
            </v-sheet>
          </v-sheet>

          <!-- 评论输入框 -->
          <v-sheet class="d-flex align-center mx-5">
            <v-avatar size="40">
              <v-img :src="`http://192.168.10.4:8000${userProfile.avatar}`" alt="用户头像"></v-img>
            </v-avatar>
            <v-text-field v-model="newComment" placeholder="写评论..." color="rgb(127,0,25)"></v-text-field>
            <v-btn small @click="postComment(item.id)" color="rgb(149,36,58)">发送</v-btn>
          </v-sheet>
        </v-sheet>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<style scoped>
/* 自定义样式 */
</style>