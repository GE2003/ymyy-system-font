import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui';import 'element-ui/lib/theme-chalk/index.css';
/* 使用自定义的axios，其对拦截器也起作用（对应文件：shequ-cli-front/src/util下的axios.js）
 * 若要在某一页面（以UserView.vue为例）中使用该组件，应当：
 * 1.注释掉UserView.vue中，<script>标签对中的 import axios from 'axios'; 语句
 * 2.注释掉UserView.vue中，methods中的interceptor()方法
 * 3.把UserView.vue中，methods中定义的所有方法中的axios改为this.axios
 */
import {default as axios} from './util/index'; // 导入自定义包装后的axios组件

Vue.config.productionTip = false
// js原型法，给Vue对象动态地添加属性，使用方式this.axios
Vue.prototype.axios = axios;

Vue.use(ElementUI); // 注册element-ui组件

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')