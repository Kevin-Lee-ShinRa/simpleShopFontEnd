import Vue from 'vue';
import Vuetify from 'vuetify/lib/framework';
import lightTheme from '@/plugins/theme/light-theme';
import 'material-design-icons-iconfont/dist/material-design-icons.css';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'mdiSvg'
  },
  theme: {
    themes: {
      light: lightTheme
    }
  }
});
