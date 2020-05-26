<template>
  <div id="app">
    <meta name="viewport" content="width=device-width,height=device-height">
    <router-view v-wechat-title="`${$route.meta && ($route.meta.breadName ? $route.meta.breadName + '-': '')}经理人后台`"></router-view>
  </div>
</template>
<script>
import Footer from "./components/Footer";
export default {
  name: "App",
  components: {
    Footer
  },
  data() {
    return {
      activeIndex2: "/login",
    };
  }, 
  mounted() {
    this.getwatermark();
  },
  methods: {
    getwatermark() {
      const params = {
        paramName: 'watermark_param',
      };
      this.$api.ParamsInfoString(params)
        .then(response => {
          if (response.respCode == 0) {
            localStorage.setItem('watermark', response.data)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
};
</script>
<style lang="scss" >
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  width: 100%;
  height: 100%;
}
body,
html {
  height: 100%;
  width: 100%;
  overflow-x: hidden;
}
* {
  margin: 0;
  padding: 0;
}
::-webkit-scrollbar-track-piece {
	background-color: rgba(1,1,1,0); 
}
 ::-webkit-scrollbar {
	width: 8px;
	height: 8px;
	background-color: rgba(1,1,1,0); 
}
::-webkit-scrollbar-thumb { 
	border-radius: 7px;
	background-color: rgba(233,72,28,0.2);
}
</style>
