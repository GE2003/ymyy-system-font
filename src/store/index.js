import Vue from 'vue'
import Vuex from 'vuex'
import { default as axios } from '../util/index'

Vue.use(Vuex)

const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {
        // 异步获取用户信息
        getUserInfo() {
            let token = localStorage.getItem('Authorization');
            return new Promise((resolve, reject) => {
                console.log("...store获取用户信息，token: ", token)
                axios({
                    url: '/api/login/info',
                    method: 'post',
                    data: token
                }).then(res => {
                    console.log("2.store->user获取用户信息，进行权限处理", res)
                    // 保存用户权限列表信息
                    localStorage.setItem('SET_USER', JSON.stringify(res.data.data));
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    },
    modules: {}
})
export default store;
