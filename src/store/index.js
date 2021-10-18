// import { createApp } from 'vue';
import { createStore } from 'vuex';
import accountStore from './modules/account';

// createApp().use(Vuex);

export const store = createStore({
    modules: {
        // 키: 값 형태로 저장됩니다.
        account: accountStore,
      },
})