import axios from 'axios';
import router from '../router';

const LOCAL_URL = 'http://127.0.0.1:9098';
// const TEST_URL = 'http://110.40.151.112:9098';
const TEST_URL = 'http://101.34.248.177:9098';

export function http(config) {
  const requests = axios.create({
    baseURL: TEST_URL,
    timeout: 8000
  });

  //请求拦截
  requests.interceptors.request.use(
    config => {
      if (localStorage.token) config.headers.Authorization = 'Bearer ' + localStorage.token;
      return config;
    },
    error => {
      return error;
    }
  );

  //响应拦截
  requests.interceptors.response.use(
    response => {
      switch (response.data.code) {
        case 'CLIENT_TOKEN_ERROR':
          localStorage.clear();
          router.replace({ path: '/login' }).then(r => {});
          break;
        default:
          break;
      }
      return response;
    },
    error => {
      if (error.message === 'timeout of 8000ms exceeded') {
        window.alert('网络有问题');
      } else {
      }
      return Promise.reject(error);
    }
  );

  //返回实例
  return requests(config);
}