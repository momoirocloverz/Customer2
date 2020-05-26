import Vue from "vue";
import App from "./App.vue";
import router from "./router/index";
import store from "./store";
import ElementUI from 'element-ui';
import VueWechatTitle from 'vue-wechat-title';
import './element-variables.scss'
import api from './api/api'
import BaiduMap from 'vue-baidu-map'
import 'babel-polyfill'
import echarts from 'echarts'
import GlobalPriceFilter from '@/common/priceFilter.js';
import Moment from '@/common/momentPlugin.js';
import lodash from 'lodash';
import './quill.core.css';
import './quill.snow.css';
import './quill.bubble.css';
Vue.use(GlobalPriceFilter);
Vue.use(Moment);

Vue.config.productionTip = false;
Vue.use(ElementUI);
Vue.use(VueWechatTitle);
Vue.prototype.$api = api;
Vue.prototype.bucketHost = 'img.10000rc.com';
Vue.prototype.$echarts = echarts;
Vue.prototype.Lodash = lodash;

if (process.env.NODE_ENV == 'production') {
  if (process.env.VUE_APP_TITLE == 'pre') {
    Vue.prototype.$emptyImport = 'http://pre.api.10000rc.com/2.0/biz/talent/customer/import'
    Vue.prototype.$importBaseURL = 'http://pre.api.10000rc.com/2.0/finance/'
  } else if (process.env.VUE_APP_TITLE == 'test') {
    Vue.prototype.$emptyImport = 'http://test.api.10000rc.com/biz/talent/customer/import'
    Vue.prototype.$importBaseURL = 'http://test.api.10000rc.com/finance/'
  } else {
    Vue.prototype.$emptyImport = 'http://www.10000rc.com/2.0/biz/talent/customer/import'
    Vue.prototype.$importBaseURL = 'http://www.10000rc.com/2.0/finance/'
  }
} else {
  Vue.prototype.$emptyImport = 'http://test.api.10000rc.com/biz/talent/customer/import'
  Vue.prototype.$importBaseURL = 'http://test.api.10000rc.com/finance/'
}

Vue.use(BaiduMap, {
  ak: '1aRvIjGru2XOCTen2f9Sle5g8AjH9c31'
})
router.beforeEach(
    (to,from,next)=>{
      let checkpath = to.name;
      let path = to.path;
      let temp = to.path.split("/");
//      console.log(checkpath)
      if(temp.length >= 2){
        if(checkpath.includes("noaccess") || checkpath.includes("login") || checkpath.includes("FindPwd")){
          next()
        }else{
          api.menuAuth(path).then(
              res=>{
                let respCode = res.respCode
                if(respCode==-1){
                    console.log('/'+temp[1]+"/noaccess")
                    next({path:"/"+temp[1]+"/noaccess"})
                }else if(respCode==-2){
                    next({path:"/login"})
                }else{
                  next()
                }
              }
          ).catch(
              error=>{
                alert(error)
              }
          )
        }
    }else{
        next()
      }
    }
)
router.afterEach((to,from)=>{
//    console.log(to.name)
})
new Vue({
  api,
  router,
  store,
  render: h => h(App)
}).$mount("#app");