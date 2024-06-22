<template>
    <div id="login">
      <!-- 新冠疫苗预约接种平台 -->
      <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px" class="demo-login-form">
        <h1 id="title">新冠疫苗预约接种平台</h1>
        <el-form-item label="用户类型" prop="userType">
          <el-radio-group v-model="userForm.userType">
            <el-radio label="user">用户</el-radio>
            <el-radio label="admin">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号" prop="idCard">
          <el-input type="text" v-model="userForm.idCard" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
        </el-form-item>
        <!-- 按键和超链接 -->
        <el-form-item>
          <el-button type="primary" @click="login()">提交</el-button>
          <el-link :underline="false" type="primary" @click="toReg()" style="margin-left:50px;">注册新用户</el-link>
        </el-form-item>
      </el-form>
    </div>
  </template>
  
  <script>
  //import axios from 'axios'; // 导入组件axios
  export default {
    name: 'LoginView', // 默认导出组件的名称
    data() { // 双向绑定数据模型，在这里定义页面实时更新的数据
      return {
        userForm: {
          userType: 'user', // 默认选择用户
          idCard: '001',
          password: '123'
        },
        rules: {
          userType: [
            { required: true, message: '请选择用户类型', trigger: 'change' }
          ],
          idCard: [
            { required: true, message: '请输入身份证号', trigger: 'blur' },
            { min: 2, max: 18, message: '长度在 2 到 18 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入登录密码', trigger: 'blur' },
            { min: 3, max: 64, message: '长度在 3 到 64 个字符', trigger: 'blur' }
          ]
        } // rules
      } // return
    },
    created() { // 生命周期钩子函数
    },
    methods: {
      login() {
        // 判断表单验证结果
        this.$refs.userForm.validate((valid) => {
          if (valid) {
            // 发送登录请求
            this.axios({
              method: 'post',
              url: "/api/login",
              // 后端使用RequestBody获取数据
              // data表示将对象转换成json进行传递到接口里面
              data: this.userForm // 默认按json格式提交数据
            }).then(res => {
              console.log(res);
              if (200 == res.data.code) {
                // 保存合法的用户token令牌
                localStorage.setItem("Authorization", res.data.data);
                // 保存用户类型
                localStorage.setItem("userType", this.userForm.userType);
                this.$message.success("登录成功!");
                 this.$router.push( this.userForm.userType === 'admin' ? "/" : '/personal'); // 路由跳转至首页面
              } else {
                this.$message.error("登录失败!")
              }
            }).catch(res => {
              console.log(res);
              this.$message.error("登录时异常!");
            })
          } else {
            return false;
          }
        });
      },
      // 跳转到注册页面
      toReg() {
        this.$router.replace("/registry"); // 路由至注册页面
      }
    }
  }
  </script>
  
  <style>
  /* 整个登录页面窗口样式 */
  #login {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: url(../assets/img/login_background.png);
    background-size: 100%;
  }
  /* 登录表单样式 */
  .demo-login-form {
    width: 450px;
    height: 400px; /* 增加高度以适应新元素 */
    padding: 20px 40px;
    margin: 200px auto;
    border-radius: 8px; /* 设置边框圆角 */
    background: #eee;
    box-shadow: 10px 10px 5px #333;
  }
  #title {
    text-align: center;
  }
  </style>
  