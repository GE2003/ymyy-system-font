<template>
    <div class="home">
        <el-container>
            <el-header style="height:120px;">
                <el-row>
                    <el-col :span="4">
                        <img src="../assets/logo.png" style="height:80px;margin-top:20px;magin-right:40px;" />
                    </el-col>
                    <el-col :span="16">
                        <h1 class="header-title">疫苗预约接种后台</h1>
                    </el-col>
                    <el-col :span="4">
                        <div style="margin-top:40px;">
                            <el-avatar style="vertical-align: middle;margin-right: 10px;" size="medium"
                                src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png">
                            </el-avatar>
                            <el-dropdown @command="handleCommand">
                                <!-- {{userInfo.name}} -->
                                <span class="el-dropdown-link">
                                    {{userInfo.name}}<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item command="myOrder">用户中心</el-dropdown-item>
                                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                            <!-- <el-button type="success" @click="toLogin()" style="margin-left:20px;">
                                登录/注册
                            </el-button> -->
                        </div>
                    </el-col>
                </el-row>
            </el-header>
            <el-container>
                <!-- 侧边栏 -->
                <el-aside width="200px">
                    <el-menu router default-active="/user" class="el-menu-vertical-demo" background-color="#545c64"
                        text-color="#fff" active-text-color="#ffd04b">
                        <el-menu-item v-for="menu in menuList" :key="menu.path" :index="menu.path">
                            <i class="el-icon-menu"></i>
                            <span slot="title">{{menu.meta.title}}</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <!-- 主要区域 -->
                <el-main>
                    <router-view />
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script>
    import router from '../router/index'; // 导入路由组件
    export default {
        name: 'HomeView',
        components: {
            //HelloWorld
        },
        data() {
            return {
                menuList: [], // 保存菜单列表信息
            }
        },
        computed: { // 计算属性，属性值按函数方式来获取
            userInfo() { // 获取登录用户账号名称
                let user = JSON.parse(localStorage.getItem("SET_USER"));
                console.log("计算属性: ", user);
                let name = user.name;
                console.log(name);
                return user;
            }
        },
        created() {
            this.getMenuList(); // 在页面生成后，调用菜单获取方法
        },
        methods: {
            getMenuList() {
                let list = router.options.routes[0].children; // 读取路由列表
                //console.log(list);
                const type = localStorage.getItem("userType");
                // 过滤路由中meta.show属性为true的项，加入菜单列表
                this.menuList = list
                    .filter(i => i.meta.show)
                    .filter((i) => 
                        !i.meta.premission || (i.meta.premission === type)
                    );
                //console.log(this.menuList);
            },
            // 跳转到登录页面
            toLogin() {
                this.$router.replace("/login");
            },
            // 处理下拉菜单command事件
            handleCommand(command) {
                if (command === "myOrder") {
                    this.myOrder();
                } else if (command === "logout") {
                    this.logout();
                }  
            },
            // 跳转到个人中心页面
            myOrder() {
                this.$router.push("/personal");
            },
            // 退出登录
            logout() {
                console.log("用户退出，清除登录状态");
                localStorage.setItem("Authorization", null);
                localStorage.setItem("SET_USER", null);
                this.$message.info("退出登录!");
                this.$router.push("/login"); // 路由跳转至登录页面
            },
        }
    };
</script>

<style>
    .home {
        left: 0;
        right: 0;
        height: 100%;
        width: 100%;
    }

    .el-header {
        background-color: lightblue;
    }

    .el-aside {
        height: calc(100vh - 120px);
        background: #8896B3;
    }

    .el-main {
        height: calc(100vh - 120px);
        background: #F2F6FC;
        overflow-y: auto;
    }

    .header-title {
        line-height: 120px;
    }

    #header-login-name {
        height: 120px;
        line-height: 120px;
        text-align: center;
        margin-left: 10px;
    }
</style>
