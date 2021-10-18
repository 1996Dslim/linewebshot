import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'
import {store} from './store'
import money from 'v-money3'


createApp(App)
    .use(router)
    .use(store)
    //.use(money)
    .mount('#app')