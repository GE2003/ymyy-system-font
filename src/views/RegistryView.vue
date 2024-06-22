<template>
    <div id="login">
        <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px" class="demo-registry-form">
            <h1 id="title">注册用户</h1>
            <el-form-item label="身份证号" prop="idCard">
                <el-input type="text" v-model="userForm.idCard" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="真实姓名" prop="name">
                <el-input type="text" v-model="userForm.name" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input type="password" v-model="userForm.password" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="check">
                <el-input type="password" v-model="userForm.check" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item label="电话号码" prop="phone">
                <el-input type="text" v-model="userForm.phone" auto-complete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="registry()">注册新用户</el-button>
                <el-button @click="reset()">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
    //import axios from 'axios'; // 导入组件axios
    export default {
        name: 'RegistryView', // 默认导出组件的名称
        data() { // 双向绑定数据模型，在这里定义页面实时更新的数据
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userForm.password) {
                    callback(new Error('两次输入密码不一致！'));
                } else {
                    callback();
                }
            };
            return {
                userForm: {
                    idCard: '',
                    name: '',
                    password: '',
                    check: '',
                    phone: ''
                },
                rules: {
                    idCard: [{
                            required: true,
                            message: '请输入账号',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 12,
                            message: '长度在 2 到 12 个字符',
                            trigger: 'blur',
                        },
                    ],
                    name: [{
                            required: true,
                            message: '请输入真实姓名',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 12,
                            message: '长度在 2 到 12 个字符',
                            trigger: 'blur'
                        }
                    ],
                    password: [{
                            required: true,
                            message: '请输入登录密码',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 64,
                            message: '长度在 3 到 64 个字符',
                            trigger: 'blur'
                        }
                    ],
                    check: [{
                        validator: validatePass2,
                        trigger: 'blur'
                    }]
                } // rules
            } // return
        },
        created() { // 生命周期构造函数
        },
        methods: {
            registry() {
                // 判断表单验证结果
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        // 发送注册请求
                        this.axios({
                            method: 'post',
                            url: "/api/user",
                            data: this.userForm
                        }).then(res => {
                            console.log(res);
                            //this.localStorage.setItem("USER_INFO",res.data.idCard); // 保存合法的用户登录名称
                                this.$message.success("注册成功!");
                                this.$router.push("/login"); // 路由跳转至登录页面
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 重置注册表单，清空控件数据
            reset() {
                this.$refs.userForm.resetFields();
            }
        }
    }
</script>

<style>
    #login {
        
    }
    .demo-registry-form {
        width: 400px;
        height: 400px;
        padding-top: 20px 10px;
        padding-right: 20px;
        margin: 150px auto;
        border-radius: 8px;
        /* top/bottom:200px, lef/right:自动调整居中 */
        background: #eee;
        box-shadow: 10px 10px 5px #333;
    }
    #title {
        text-align: center;
    }
</style>