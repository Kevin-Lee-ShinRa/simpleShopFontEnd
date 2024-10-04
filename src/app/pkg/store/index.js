import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    communityStore: {
      state:     {
        feedbackDot: 0
      },
      mutations: {
        updateFeedbackDot(state, { data }) {
          state.feedbackDot = data;
        }
      }
    }
  }
});