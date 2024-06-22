import Vue from 'vue';
import store from '../store/index';
import VueRouter from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import RegistryView from '../views/RegistryView.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    meta: {
      show: false,
      title: '首页',
      icon: '',
    },
    component: HomeView,
    children: [
      {
        path: '/user',
        name: 'user',
        meta: {
            premission: "admin",
          show: true,
          title: '用户管理',
          icon: 'el-icon-user',
        },
        component: () => import(/* webpackChunkName: "user" */ '../views/UserView.vue'),
      },
      {
        path: '/inoSite',
        name: 'inoSite',
        meta: {
            premission: "admin",
            show: true,
          title: '接种点管理',
          icon: '',
        },
        component: () => import(/* webpackChunkName: "inoSite" */ '../views/InoSiteView.vue'),
      },
      {
        path: '/vaccine',
        name: 'vaccine',
        meta: {
            premission: "admin",
            show: true,
          title: '疫苗管理',
          icon: '',
        },
        component: () => import(/* webpackChunkName: "vaccine" */ '../views/VaccineView.vue'),
      },
      {
        path: '/vacType',
        name: 'vacType',
        meta: {
            premission: "admin",
            show: true,
          title: '疫苗类型管理',
          icon: '',
        },
        component: () => import(/* webpackChunkName: "hospital" */ '../views/VacTypeView.vue'),
      },
      {
        path: '/order',
        name: 'order',
        meta: {
            premission: "user",
          show: true,
          title: '预约接种',
          icon: '',
        },
        component: () => import(/* webpackChunkName: "order" */ '../views/OrderView.vue'),
      },
      {
        path: '/personal',
        name: 'personal',
        meta: {
            premission: "user",
          show: true,
          title: '我的预约',
          icon: '',
        },
        component: () => import(/* webpackChunkName: "order" */ '../views/PersonalView.vue'),
      },
      {
        path: '/about',
        name: 'about',
        meta: {
          show: true,
          title: '关于',
          icon: '',
        },
        component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue'),
      },
      {
        path: '/',
        redirect: '/user',
        meta: {
          show: false,
          title: '主页',
          icon: '',
        },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    meta: {
      show: false,
      title: '',
      icon: '',
    },
    component: LoginView,
  },
  {
    path: '/registry',
    name: 'registry',
    meta: {
      show: false,
      title: '',
      icon: '',
    },
    component: RegistryView,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.path === '/login') {
    next(); // 正常放行
  } else {
    let token = localStorage.getItem('Authorization');
    if (!token || token === 'null') {
      if (to.path !== '/registry') next('/login');
      else next();
    } else {
      try {
        const res = await store.dispatch('getUserInfo');
        localStorage.setItem('SET_USER', JSON.stringify(res));
        const type = localStorage.getItem("userType");
        // const userType = res.data.data.userType;
        // localStorage.setItem('userType', userType);
        if(!to.meta.premission || (to.meta.premission === type)) next(); // 放行
        else {
            alert('无权限！')
            next('/personal')
        }
      } catch {
        next('/login');
      }
    }
  }
});

export default router;
