<script setup>
import { onMounted, ref } from 'vue';

const dialog = ref(false);

import axios from 'axios';

const goods = ref([]);

import { mdiClose, mdiSendVariant } from '@mdi/js';
import DetialCard from '@/app/features/main-pages/detial-card';

const fetchGoods = async () => {
  try {
    const response = await axios.get('http://192.168.10.4:8000/allgoods');
    goods.value = response.data;
  } catch (error) {
    console.error('Failed to fetch goods:', error);
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
  } catch (error) {
    console.error('获取用户资料失败:', error);
  }
};

// 接收从父组件传递的商品 item
const props = defineProps({
  item: Object
});

console.log(props.item);
// 定义评论相关的状态
const comments = ref([]);
const newComment = ref('');
const token = localStorage.getItem('token'); // 从 localStorage 获取 token

if (!token) {
  console.error('Token 不存在，请确认用户是否已登录。');
} else {
  console.log('Token:', token);
}
// 获取指定商品的评论
const fetchComments = async (goodsId) => {
  try {
    const response = await axios.get(`http://192.168.10.4:8000/goods/${ goodsId }/comments/`, {
      headers: {
        Authorization: `Bearer ${ token }` // 发送带 token 的请求
      }
    });
    comments.value = response.data;
  } catch (error) {
    console.error('获取评论失败:', error);
  }
};

// const postComment = async (goodsId) => {
//   try {
//     if (!newComment.value) {
//       console.error('评论内容为空');
//       return;  // 如果没有输入评论内容，则返回
//     }
//
//     console.log('Token:', token);  // 打印 token 以确认是否正确传递
//     console.log('评论内容:', newComment.value);  // 打印评论内容以确认
//
//     const response = await axios.post(
//       `http://192.168.10.4:8000/goods/${ goodsId }/comments/`,
//       { content: newComment.value },  // 传递评论内容
//       {
//         headers: {
//           Authorization:  `Token ${ localStorage.getItem('token') }`,  // 确保 token 格式正确
//           'Content-Type': 'application/json'
//         }
//       }
//     );
//
//     console.log('评论成功:', response.data);
//     newComment.value = '';  // 清空输入框
//     await fetchComments(goodsId);  // 重新获取评论列表，更新页面
//   } catch (error) {
//     if (error.response) {
//       console.error('发表评论失败:', error.response.data);  // 打印详细的错误信息
//     } else {
//       console.error('发表评论失败:', error.message);  // 打印通用的错误信息
//     }
//   }
// };

// 格式化日期的函数
const formatDate = (dateString, format = 'datetime') => {
  const date = new Date(dateString);
  let dateStr = '';
  let timeStr = '';

  if (format === 'date' || format === 'datetime') {
    const month = date.getMonth() + 1; // 获取月份（从0开始，所以加1）
    const day = date.getDate(); // 获取日期

    dateStr = `${month.toString().padStart(2, '0')}月${day.toString().padStart(2, '0')}日`;
  }

  if (format === 'time' || format === 'datetime') {
    const hours = date.getHours(); // 获取小时
    const minutes = date.getMinutes(); // 获取分钟

    timeStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }

  if (format === 'date') {
    return dateStr;
  } else if (format === 'time') {
    return timeStr;
  } else {
    return `${dateStr} ${timeStr}`;
  }
};

// 回复相关
const newReply = ref({}); // 保存每条评论的回复
const postComment = async (goodsId) => {
  try {
    if (!newComment.value) {
      console.error('评论内容为空');
      return;
    }

    const response = await axios.post(
      `http://192.168.10.4:8000/goods/${ goodsId }/comments/`,
      { content: newComment.value },
      {
        headers: {
          Authorization:  `Token ${ token }`,
          'Content-Type': 'application/json'
        }
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
      `http://192.168.10.4:8000/comments/${ commentId }/replies/`,
      { content: newReply.value[commentId] },  // 使用正确的字段名 content
      {
        headers: {
          Authorization:  `Token ${ token }`,
          'Content-Type': 'application/json'
        }
      }
    );

    newReply.value[commentId] = '';  // 清空回复框
    await fetchComments(props.item.id);  // 重新获取评论列表，更新页面
  } catch (error) {
    console.error('发表评论失败:', error.response?.data || error.message);
  }
};
onMounted(() => {
  fetchGoods();
  fetchComments(props.item.id); // 使用传入的 item 自动获取评论
  fetchUserProfile();  // 页面挂载时获取用户资料
});
</script>
<template v-slot:default="dialog">
  <v-row justify="center">
    <v-dialog
        v-model="dialog"
        fullscreen
        hide-overlay
        transition="scale-transition"
    >
      <!--      按钮-->
      <template v-slot:activator="{ on, attrs }">
        <v-img
            :src="item.good_image"
            height="150"
            alt=""
            v-bind="attrs"
            v-on="on"
            style="object-fit: cover;"
        ></v-img>
      </template>
      <!--      显示区域主体-->






      <v-card>
        <v-toolbar
            dark
            color="rgba(149,36,58,0.97)"
            style="position: sticky;top: 0px;z-index: 3"
        >
          <v-sheet
              color="transparent"
              class="d-flex align-center ml-5">
            <!--            当前用户头像及名称-->
            <v-avatar size="40">
              <v-img
                  :src="`http://192.168.10.4:8000${userProfile.avatar}`"
                  alt="用户头像" />
            </v-avatar>
            <!-- 显示用户昵称 -->
            <span
                class="font-size-20 ml-3"
                style="color: #E0E4E7">
            {{ userProfile.nickname }}
          </span>
          </v-sheet>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
                dark
                text
                @click="dialog = false"
            >
              <v-icon>{{ mdiClose }}</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <!--        整体容器-->

        <v-sheet
            width="80%"
            color="rgb(244,244,244)"
            class="mx-auto">
          <v-sheet
              width="100%"
              height="3"
              class="my-3"
              color="rgb(127,0,25)"></v-sheet>
          <!--          图片及商品信息容器，左右分布-->
          <v-sheet
              color="rgb(244,244,244)"
              class="d-flex justify-space-between">
            <!--        图片-->
            <v-sheet
                color="transparent"
                width="50%">
              <v-img
                  :src="item.good_image"
                  height="300"
                  alt=""
                  class="mx-auto"
                  style="max-width: 100%; aspect-ratio: 16/9;"
              ></v-img>
            </v-sheet>
            <!--              上传者信息-->
            <v-sheet
                width="40%"
                color="rgb(244,244,244)"
                class="d-flex flex-column">
              <!-- 商品名称和价格 -->
              <p class="text-h3 text--primary mx-auto mt-10">{{ item.good_name }}</p>
              <p class="text-h4 text--primary mx-auto mt-5">￥{{ item.good_price }}</p>
              <p class="text-h6 text--primary mx-auto mt-0">{{ item.good_description }}</p>

              <!-- 上传者的头像和昵称发布时间 -->
              <v-sheet
                  color="rgb(244,244,244)"
                  class="d-flex align-center ml-auto mt-auto">
                <v-sheet
                    color="rgb(244,244,244)"
                    class="d-flex flex-column mr-5">
                  <p class="text-h6 text--primary ml-auto mt-0">
                    发布于
                    {{ formatDate(item.created_at, 'date') }} {{ formatDate(item.created_at, 'time') }}
                  </p>
                  <span class="ml-auto">{{ item.uploader_nickname }}</span>
                </v-sheet>
                <v-avatar size="80">
                  <v-img
                      :src="item.uploader_avatar"
                      alt="上传者头像"></v-img>
                </v-avatar>
              </v-sheet>
            </v-sheet>
          </v-sheet>
          <v-sheet
              width="100%"
              height="3"
              class="my-3"
              color="rgb(127,0,25)"></v-sheet>
          <!--        评论-->
          <!-- 评论区 -->
          <v-sheet color="rgba(244,244,244)">
            <h3>评论区</h3>

            <v-sheet
                v-for="comment in comments"
                :key="comment.id"
                color="transparent"
                class="my-3">
              <v-sheet color="transparent">
                <v-sheet
                    color="rgba(255,255,255,0.3)"
                    class="d-flex pt-3">
                  <!--                左-->
                  <v-sheet
                      color="rgba(255,255,255,0.3)"
                      class="mx-5">
                    <v-avatar size="46">
                      <v-img
                          :src="`http://192.168.10.4:8000${comment.commenter_avatar}`"
                          alt="用户头像" />
                    </v-avatar>
                  </v-sheet>
                  <!--                右-->
                  <v-sheet color="rgba(255,255,255,0.3)">
                    <v-sheet color="rgba(255,255,255,0.3)">
                      <div
                          class="font-size-18 ml-0 mt-1"
                          style="color: rgb(127,0,25)">{{ comment.commenter_nickname }}
                      </div>
                      <p class="text--secondary mt-2" style="font-size: 12px"> {{ formatDate(comment.created_at, 'date') }} {{ formatDate(comment.created_at, 'time') }}</p>
                    </v-sheet>
                    <div
                        class="font-size-15 ml-0 my-5"
                        style="color: black">{{ comment.content }}
                    </div>
                  </v-sheet>



                </v-sheet>
                <!-- 回复部分 -->
                <v-sheet color="transparent" width="90%" class="mx-auto">


                  <!-- 显示回复 -->
                  <v-sheet
                      v-for="reply in comment.replies"
                      :key="reply.id"
                      color="rgba(255,255,255,0.3)"
                      class="mt-2">
                    <v-sheet color="transparent" class="d-flex align-center">
                      <v-avatar
                          size="30"
                          class="mr-3">
                        <v-img
                            :src="`http://192.168.10.4:8000${reply.replier_avatar}`"
                            alt="回复者头像"></v-img>
                      </v-avatar>
                      <v-sheet color="rgba(255,255,255,0.3)" class="d-flex mt-3">
                        <p style="color: rgb(149,36,58)" class="font-size-15 mr-3">{{ reply.replier_name }}</p>
                        <p class="text--secondary" style="font-size: 12px">{{ formatDate(reply.created_at, 'datetime') }}</p>
                      </v-sheet>
                    </v-sheet>
                    <v-sheet color="transparent" class="font-size-15 ml-13 pb-3 pt-2">{{ reply.content }}</v-sheet>
                  </v-sheet>

                  <v-text-field
                      color="rgb(127,0,25)"
                      v-model="newReply[comment.id]"
                      :placeholder="`回复 ${comment.commenter_nickname}`">
                    <template v-slot:append>
                      <v-icon
                          @click="postReply(comment.id)"
                          color="rgb(149,36,58)">
                        {{ mdiSendVariant }}
                      </v-icon>
                    </template>
                  </v-text-field>

                </v-sheet>


              </v-sheet>
            </v-sheet>
          </v-sheet>
          <!-- 评论输入框 -->
          <v-sheet
              color="transparent"
              class="d-flex align-center mx-5">
            <v-sheet
                color="transparent"
                class="mr-5">
              <v-avatar size="40">
                <v-img
                    :src="`http://192.168.10.4:8000${userProfile.avatar}`"
                    alt="用户头像" />
              </v-avatar>
            </v-sheet>
            <v-text-field
                color="rgb(127,0,25)"
                v-model="newComment"
                placeholder="写评论...">
              <!--              <template v-slot:append>-->
              <!--                <v-icon-->
              <!--                    @click="postComment(item.id)"-->
              <!--                    color="rgb(149,36,58)">-->
              <!--                  {{ mdiSendVariant }}-->
              <!--                </v-icon>-->
              <!--              </template>-->
            </v-text-field>
            <v-btn
                color="rgb(244,244,244)"
                small
                class="ml-3"
                @click="postComment(item.id)">发送
            </v-btn>
          </v-sheet>
        </v-sheet>
      </v-card>





    </v-dialog>
  </v-row>
</template>

<style
    scoped
    lang="sass">

</style>