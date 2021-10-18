<template>
  <div class="main">
    <div class="bg">
      <div class="loginform">
        <div @click="doLogin" class="mark"></div>
        <form @submit="doLogin" class="login">
          <div class="text_box id">
            <div class="personicon">
              <span class="material-icons per">person</span>
            </div>
            <div>
              <input
                v-model="username"
                class="inputtext"
                type="text"
                placeholder="ID"
              />
            </div>
          </div>
          <div class="text_box pas">
            <div class="lockicon">
              <span class="material-icons lock">lock</span>
            </div>
            <div>
              <input
                v-model="password"
                class="inputtext"
                :type="view_pass"
                placeholder="Passward"
              />
            </div>
            <div class="visibility">
              <input
                value="text"
                @click="viewPass"
                v-model="view_pass_checked"
                type="checkbox"
                id="viewck"
              />
              <label for="viewck">
                <span class="material-icons vis"></span>
              </label>
            </div>
          </div>
          <div class="info">
            <div class="Remember">
              <input
                v-model="rememberMe"
                type="checkbox"
                id="remembercheck"
              /><label for="remembercheck"
                ><span class="material-icons"></span>Remember me</label
              >
            </div>
            <div class="helpbox">
              <span class="material-icons help"> help_outline </span>
              <a class="forgot" href="javascript:void(0)"> Forgot Passward? </a>
            </div>
          </div>
          <div class="loginsubmit">
            <button
              class="loginbtn"
              :disabled="!(username.length > 0 && password.length > 0)"
              type="submit"
            >
              <div class="log">LOGIN</div>
            </button>
          </div>
        </form>
      </div>

      <div class="signup">
        <span>Not a member? <a href="#/check">Sign up</a></span>
      </div>
    </div>
  </div>
</template>

<script>
import AES from "crypto-js/aes";

//import { SETTINGS } from '~/config/index.js';
import { useStore } from "vuex";
import { computed, reactive, ref, toRefs } from "@vue/reactivity";
import Swal from 'sweetalert2'
import Auth from '~/apis/auth';

export default {
  name: "Login",
  setup(props) {
    const store = useStore();

    const view_pass_checked = ref(true);
    const view_pass = ref("password");
    const username = ref("");
    const password = ref("");
    const rememberMe = ref(false);
    const actionStore = reactive({
      lg: computed(() => store.getters.isLG ), 
    });

    try {
      const tmp = localStorage.getItem('FORM_USER');
      if (tmp) {
        const formUser = AES.decrypt(tmp, process.env.VUE_APP_FB_AK).toString(CryptoJS.enc.Utf8);
        if (formUser) {
          const formData = JSON.parse(formUser);
          username.value = formData.username;
          password.value = formData.password;
          rememberMe.value = formData.rememberMe;
        }
      }
    } catch (e) {
      //
    }

    const doLogin = () => {
      const userData = {
        username: username.value,
        password: password.value,
        rememberMe: true,
      };
      
      store.dispatch('account/login', userData).then((r) => {
        if (r.user.userState === 'R' && !r.user.updatedAt) {
          Swal.fire({
            icon: 'warning',
            html: '가입 후, 첫 로그인이십니다.<p>비밀번호 초기화 화면으로 이동합니다.</p>',
          }).then(() => this.$router.push({ name: 'reset.pswd' }));
        } else if (r.user.userState === 'T') {
          Swal.fire({
            icon: 'warning',
            html: '임시저장 상태입니다.<p>입력 작업을 계속 진행해 주세요.</p>',
          }).then(() => this.$router.push({ name: 'signup' }));
        } else {
          location.href = '#/dashboard';
          console.log("이동")
        }
      });

    }

    return {
      view_pass_checked, view_pass, username, password ,rememberMe,
      doLogin
    }
  }
};
</script>



<style scoped lang="scss" >
@import "~/scss/main";
@import "~/scss/login";
</style>