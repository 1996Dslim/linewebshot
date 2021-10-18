<template>
    <Header v-if="$route.path != '/'"/>
    <div :class="`wrap ${$route.path === '/' ? 'no' : ''}`">
      <Sidenav v-if="(!($route.path === '/') && !($route.path === '/check') && !($route.path === '/signup'))" />
      <div class="dash">
        <div class="frame">
          <RouterView/>
        </div>
      </div>
    </div>
  <Footer v-if="$route.path != '/'"/>
</template>

<script>
import Header from"~/components/layout/Header.vue";
import Footer from"~/components/layout/Footer.vue";
import Sidenav from "~/components/layout/Sidenav.vue";
import { ref } from '@vue/reactivity';
import { computed, onBeforeUnmount, onMounted, onUnmounted, onUpdated } from '@vue/runtime-core';

export default {
  components: {
    Header,
    Footer,
    Sidenav
  },
  setup() {
    const width = ref(window.innerWidth);

    onMounted(() => {
      window.addEventListener('resize', handleResize);
      //localStorage.removeItem('CURR_SIDE_NUM');
    })

    onBeforeUnmount(() => {
      window.removeEventListener('resize', handleResize);
      //localStorage.removeItem('CURR_SIDE_NUM');
    })


    onUnmounted(() => {
        //localStorage.removeItem('CURR_SIDE_NUM');
        console.log("사라저");
    })

    const handleResize = (event) => {
      width.value = window.innerWidth;
    }

    return {
      width
    }
  }
}

</script>

<style lang="scss">
body {
    background-image: url("~/assets/login/login_bg.decedebe.jpg");
    background-size: cover;
    background-attachment: fixed;
    background-repeat: no-repeat;
}

#app {
  display: flex;
  margin-top: 60px;
}

.wrap {
    width: 100%;
    background-color: #081736;
    display: flex;
    flex: 1 1 auto;x
    &.no {
       background-color: transparent;
    }
    .dash {
    //width: 1842px;
    width: 100%;
    min-height: 869px;
    padding: 55px 60px 40px 60px;
    box-sizing: border-box;
    .frame {
        width: 100%;
        max-width: 1773px;
        height: 100%;
        margin-bottom: 50px;
    }
  }
}

</style>
