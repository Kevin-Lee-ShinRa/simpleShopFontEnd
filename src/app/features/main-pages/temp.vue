<script>
import { ref } from 'vue';

export default {
  setup() {
    const text = ref('');
    const image = ref(null);

    const handleFileChange = (event) => {
      image.value = event.target.files[0];
    };

    const handleSubmit = () => {
      const formData = new FormData();
      formData.append('text', text.value);
      formData.append('image', image.value);

      // 查看表单数据
      for (let pair of formData.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      // 在此发送请求或进一步处理数据
      // e.g., 使用 axios 发送 POST 请求
      // axios.post('/your-api-endpoint', formData)
      //   .then(response => console.log(response))
      //   .catch(error => console.error(error));
    };

    return {
      text,
      image,
      handleFileChange,
      handleSubmit,
    };
  },
};
</script>
<template>
  <form @submit.prevent="handleSubmit">
    <label for="text">Text:</label>
    <input type="text" v-model="text" id="text">

    <label for="image">Image:</label>
    <input type="file" @change="handleFileChange" id="image">

    <button type="submit">Submit</button>
  </form>
</template>


