import axios from 'axios'

// 创建axios实例
const axiosInstance = axios.create({
    baseURL: process.env.BASE_URL, // api的base_url
    timeout: 15000 // 请求超时时间2
})
// 对request请求拦截器
axiosInstance.interceptors.request.use(config => {
    // // 对来自客户端的请求，添加请求头Authorization标记，注入token
    // console.log("1.util->api request拦截器")
    // let token = localStorage.getItem('Authorization');
    // console.log('读取token,并加入请求头', token);
    // if (token) { // 有数据
    //     // 向请求头添加token
    //     config.headers.Authorization = token;
    // } else {
    //     this.$message.fail('读取token失败')
    // }
    return config;
}, error => {
    // Do something with request error
    console.error(error) // for debug
    Promise.reject(error)
})

export default axiosInstance