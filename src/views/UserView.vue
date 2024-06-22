<template>
    <!-- 用户管理界面 -->
    <div id="user">
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="formSearch" class="demo-formSearch">
            <el-form-item label="身份证号">
                <el-input v-model="formSearch.idCard" placeholder="搜索身份证号"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-button type="success" @click="onAdd">添加</el-button>
        <!-- 用户列表 -->
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="id" label="序号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="姓名" width="180">
            </el-table-column>
            <el-table-column prop="idCard" label="身份证号">
            </el-table-column>
            <el-table-column prop="password" label="密码">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onEdit(scope.$index,scope.row)">修改</el-button>
                    <el-button type="danger" @click="onDel(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Element-UI 分页器 -->
        <el-pagination @current-change="currentChange" background layout="prev,pager,next" :total="total">
        </el-pagination>
        <div>
            <el-dialog title="添加用户" :visible.sync="dialogVisible" width="50%">
                <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px"
                    class="demo-userForm">
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
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSave()">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改用户 -->
            <el-dialog title="修改用户" :visible.sync="editDialogVisible" width="50%">
                <el-form :model="userForm" status-icon :rules="rules" ref="userForm" label-width="100px"
                    class="demo-userForm">
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
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="editDialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onUpdate()">确 定</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    //import axios from 'axios';
    export default {
        name: 'UserView',
        data() {
            // 定义校验规则，比对两次输入密码
            var validatePass2 = (rule, value, callback) => {
                if (value === '') { // 值相等并且类型相等
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.userForm.password) { // 值不相等或者类型不相等
                    callback(new Error('两次输入密码不一致！'));
                } else {
                    callback();
                }
            };
            return {
                tableData: [],
                pager: 0, // 总页码数
                total: 0, // 总记录数
                formSearch: { // 搜索表单绑定数据
                    idCard: ''
                },
                searchPage: { // 搜索页数据定义
                    records: [], // 分页列表
                    total: 0, // 总记录数
                    size: 10, // 分页大小
                    pages: 0, // 总页码
                    current: 1, // 当前页码
                },
                userForm: { // 修改、添加表单数据
                    name: '',
                    idCard: '',
                    password: '',
                    check: ''
                },
                dialogVisible: false, // 添加对话框显示控制
                editDialogVisible: false, // 修改对话框显示控制
                rules: {
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
                    idCard: [{
                            required: true,
                            message: '请输入身份证号',
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
                    }],
                } //rules
            }
        },
        created() { // 生命周期钩子函数
            //this.interceptor(); // 加载拦截器
            this.getUserList(1); // 调用用户列表分页函数
        },
        methods: {
            // 列表分页
            getUserList(pageNo) {
                this.axios({
                    method: 'get',
                    url: "/api/user",
                    params: { // 传递请求参数
                        page: pageNo
                    }
                }).then(res => {
                    console.log("分页列表: ", res);
                    this.tableData = res.data.data.list; // 更新数据
                    this.pager = res.data.data.pager;
                    this.total = res.data.data.total;
                }).catch(() => {
                    this.$message.error("获取用户数据失败！");
                })
            },
            // 页码改变事件
            currentChange(page) {
                this.getUserList(page);
            },
            // 搜索功能
            onSearch() {
                this.axios({
                    method: 'post',
                    url: '/api/user/page',
                    data: {
                        page: this.searchPage,
                        user: {
                            idCard: this.formSearch.idCard
                        }
                    }
                }).then(res => {
                    //console.log("搜索:", res);
                    this.tableData = res.data.data.records; // 查询到的记录列表
                    this.pager = res.data.data.pages;
                })
            },
            // 添加用户 对话框
            onAdd() {
                this.dialogVisible = true; // 显示对话框
                this.userForm = {}; // 清空绑定的数据
            },
            // 修改用户 对话框
            onEdit(index, row) {
                console.log("修改", index, row);
                this.editDialogVisible = true; // 显示对话框
                this.userForm = row; // 把被修改的数据更新到对话框绑定的模型数据上
            },
            // 删除用户 对话框
            // 形参：数据在列表中的索引index、记录对象row
            onDel(index, row) {
                console.log("删除：", index, row);
                this.$confirm('确认要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => { // 确认后，执行删除操作
                    this.axios({
                        method: 'delete',
                        url: '/api/user/' + row.id
                    }).then(res => {
                        console.log("delete", res);
                        console.log("res.data.code: ", res.data.code);
                        if (200 == res.data.code) {
                            this.$message.success("数据删除成功!");
                            // 列表数据改变，引起页面刷新
                            this.tableData.splice(index, 1); // 从显示列表中删除当前记录
                        } else {
                            this.$message.error("数据删除失败！");
                        }
                    }).catch(() => {
                        this.$message.error("数据删除异常!");
                    })
                }) // confrim.then
            },
            // 此函数在添加用户对话框中被使用。调用时刻：点击“确 定”按钮时
            // 保存添加的表单数据
            onSave() {
                // 判断表单验证结果
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        // 发送添加用户请求
                        this.axios({
                            method: 'post',
                            url: "/api/user",
                            data: this.userForm // 传递json格式数据
                        }).then(res => {
                            console.log("添加: ", res);
                            if (200 == res.data.code) {
                                this.$message.success("添加数据成功！");
                                this.dialogVisible = false; // 关闭对话框
                                this.tableData.unshift(this.userForm); // 把数据显示在列表的首行
                            } else {
                                this.$message.error("添加数据失败！");
                            }
                        }).catch(() => {
                            this.$message.error("添加数据异常！");
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 此函数在修改用户对话框中被使用。调用时刻：点击“确 定”按钮时
            // 更新被修改的数据
            onUpdate() {
                console.log("更新:", this.userForm);
                // 验证表单数据
                this.$refs.userForm.validate((valid) => {
                    if (valid) {
                        // 发送更新用户请求
                        this.axios({
                            method: 'put',
                            url: "/api/user",
                            data: this.userForm
                        }).then(res => {
                            //console.log("更新", res);
                            if (200 == res.data.code) {
                                this.$message.success("更新数据成功！");
                                this.editDialogVisible = false; // 关闭修改对话框
                                // 把数据显示在列表中，请求列表分页
                                this.getUserList(1);
                            } else {
                                this.$message.error("更新数据失败！");
                            }
                        }).catch(() => {
                            this.$message.error("更新数据异常！");
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
    }
</script>

<style>
</style>