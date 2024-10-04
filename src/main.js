import Vue from 'vue';
import App from './App.vue';
import vuetify from './plugins/vuetify';
import router from '@/app/pkg/router';
import store from '@/app/pkg/store';
import SrComponents from '@/app/sr-vue-components';
import SrTextUpTransition from '@/app/pkg/transition/sr-text-up-transition.vue';
import SrTextDownTransition from '@/app/pkg/transition/sr-text-down-transition.vue';

Vue.config.productionTip = false;

Vue.prototype.bus = new Vue();
Vue.prototype.$appBarHeight = 60;
Vue.prototype.$globalOverlay = 0.5;

Vue.use(SrComponents);
Vue.component('sr-text-up-transition', SrTextUpTransition);
Vue.component('sr-text-down-transition', SrTextDownTransition);

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app');
