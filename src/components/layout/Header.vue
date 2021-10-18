<template>
    <header>
        <div class="logo_symbol"></div>
        <div class="header_wrap">
            <router-link to="/dashboard"><div class="logo_web"></div></router-link>
            <div class="info" v-if="!($route.path === '/') && !($route.path === '/check') && !($route.path === '/signup')">
                <span>(남은 시간: 00:00:00) {{ timer }}</span>
                <span>{{ user.company.name }},</span>
                <span>{{ user.userName }}</span>
                <div class="logout">
                    <div class="img"></div>
                    <span>접속종료</span>
                </div>
            </div>
        </div>
    </header>
</template>

<script>
import { SETTINGS, CODES, MENUS, UNAUTH_MENUS } from '~/config';
import { computed, onMounted, onUnmounted, ref } from '@vue/runtime-core';
import { useStore } from "vuex";
import Swal from 'sweetalert2';
import jwt_decode from "jwt-decode";

export default {
    setup() {
        const store = useStore();
        const inUser = computed(() => store.getters['account/signedInUser']);
        const isAuthenticated = computed(() => store.getters['account/isAuthenticated']);
        const signedToken = computed(() => store.getters['account/signedToken']);
        const user = computed(() => {
            if(inUser.value) {
                return JSON.parse(inUser.value);
            }
        });

        const restTime = ref(0);
        const selectedLocale = ref('en');
        const locales = ref(CODES.LOCALES);
        const timer = ref(null);
        const outCount = ref(60);

        // onUnmounted(() => {
        //     if (timer.value) {
        //        clearInterval(timer.value);
        //     }
        // })

        // onMounted(() => {
        //     console.log('This logged in user...', user.value);
        //     //selectedLocale.value = locales.value.filter(l => l.value === this.$i18n.locale)[0].value;
        //     //this.$moment.locale(this.selectedLocale);
        //     if (signedToken.value) {
        //         const { exp } = jwt_decode(signedToken.value);
        //         timer.value = setInterval(() => {
        //             const ms = exp * 1000 - Date.now();
        //             restTime.value = new Date(ms).toISOString().substr(11, 8);
        //             if (ms <= 0) {
        //                 reloadPage();
        //             }
        //         }, 1000);
        //     }
        //     // if (this.$route.name && this.$route.name.toLowerCase() === 'dashboard') {
        //     // this.mini = true;
        //     // }
        // })

        // function reloadPage() {
        //     if (timer.value) {
        //         clearInterval(timer.value);
        //         timer.value = null;
        //     }
        //     restTime.value = '';
        //     const zeroOut = Date.now() + outCount.value * 1000;
        //     timer.value = setInterval(() => {
        //         if (outCount.value-- === 0) {
        //             //signout();
        //         }
        //     }, 1000);
            
        // }
        
        return {
            user, timer
        }
    }    
}
</script>


<style scoped lang="scss">
    header{
        position: fixed;
        top: 0;
        width: 100%;
        height: 60px;
        padding: 0 43px 0 0;
        background-color: #131d57;
        border-bottom: 1px solid #0096ff;
        display: flex;
        
        z-index: 1;
        .logo_symbol {
            width: 60px;
            height: 60px;
            background-image: url("~/assets/icon/logo_symbol.d0d8c443.jpg");
            background-size: cover;
        }
        .header_wrap {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            .logo_web {
                width: 109px;
                height: 60px;
                background-image: url("~/assets/icon/logo_web.d9c060e5.png");
                background-size: cover;
            }
            .info {
                display: flex;
                color: #8495fe;
                font-size: 14px;
                line-height: 30px;
                span {
                    margin-left: 5px;
                }
                .logout {
                    height: 36px;
                    min-width: 64px;
                    padding: 0 16px;
                    display: flex;
                    align-items: center;
                    .img {
                        width: 30px;
                        height: 30px;
                        margin: 0 5px;
                        background-image: url("~/assets/icon/btn_logout.png");
                    }

                    &:hover {
                        background-color: royalblue;
                        transition: .5s;
                        cursor: pointer;
                    }
                }
            }
        }
    }
</style>