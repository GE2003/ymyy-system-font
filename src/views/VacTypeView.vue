<template>
    <!-- 疫苗类型管理界面 -->
    <div id="vacType">
        <el-button type="success" @click="onAdd">添加</el-button>
        <!-- 疫苗类型列表 -->
        <el-table :data="vacTypePage.records" stripe style="width: 100%">
            <el-table-column prop="id" label="编号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="number" label="接种次数">
            </el-table-column>
            <el-table-column prop="intervalDay" label="间隔天数">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onEdit(scope.$index,scope.row)">修改</el-button>
                    <el-button type="danger" @click="onDel(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Element-UI 分页器 -->
        <el-pagination @current-change="currentChange" background layout="prev,pager,next" :total="vacTypePage.total">
        </el-pagination>
        <div>
            <!-- 添加疫苗类型数据 -->
            <el-dialog title="添加疫苗类型数据" :visible.sync="dialogVisible" width="50%">
                <el-form :model="vacTypeForm" status-icon :rules="rules" ref="vacTypeForm" label-width="100px"
                    class="demo-vacTypeForm">
                    <el-form-item label="编号" prop="id">
                        <el-input type="number" v-model="vacTypeForm.id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="vacTypeForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="接种次数" prop="number">
                        <el-input type="number" v-model="vacTypeForm.number" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="间隔天数" prop="intervalDay">
                        <el-input type="number" v-model="vacTypeForm.intervalDay" auto-complete="off"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSave()">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改疫苗类型数据 -->
            <el-dialog title="修改疫苗类型数据" :visible.sync="editDialogVisible" width="50%">
                <el-form :model="vacTypeForm" status-icon :rules="rules" ref="vacTypeForm" label-width="100px"
                    class="demo-vacTypeForm">
                    <el-form-item label="编号" prop="id">
                        <el-input type="number" v-model="vacTypeForm.id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="vacTypeForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="接种次数" prop="number">
                        <el-input type="number" v-model="vacTypeForm.number" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="间隔天数" prop="intervalDay">
                        <el-input type="number" v-model="vacTypeForm.intervalDay" auto-complete="off"></el-input>
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
        name: 'VacTypeView',
        data() {
            return {
                pager: 0, // 总页码数
                vacTypePage: { // 分页数据定义
                    records: [],    // 分页列表
                    total: 0,       // 总记录数
                    size: 10,       // 分页大小（每页显示多少条）
                    pages: 0,       // 总页码
                    current: 1,     // 当前页码（默认显示第1页）
                },
                vacTypeForm: { // 修改、添加表单数据
                    id: 0,
                    name: '',
                    number: 0,
                    intervalDay: 0
                },
                dialogVisible: false, // 添加对话框显示控制
                editDialogVisible: false, // 修改对话框显示控制
                rules: {
                    name: [{
                            required: true,
                            message: '请输入疫苗类型名称',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 15,
                            message: '长度在 2 到 15 个字符',
                            trigger: 'blur'
                        }
                    ]
                } //rules
            }
        },
        created() {
            this.getList(1); // 调用列表分页函数
        },
        methods: {
            // 列表分页
            getList(pageNo) {
                this.vacTypePage.current = pageNo; // 更新页码
                this.axios({
                    method: 'get',
                    url: "/api/vactype/page",
                    params: {
                        pageNo: this.vacTypePage.current,
                        size: this.vacTypePage.size
                    }
                }).then(res => {
                    console.log("疫苗类型分页列表:", res);
                    this.vacTypePage.records = res.data.data.records; // 更新数据
                    this.pager = res.data.data.pages; // 把总页码赋值给分页器pager对象
                    this.vacTypePage.total = res.data.data.total; // 把总记录数赋值给分布器total
                })
            },
            // 页码改变事件
            currentChange(page) {
                this.getList(page);
            },
            // 添加 对话框
            onAdd() {
                this.dialogVisible = true;  // 显示对话框
                this.vacTypeForm = {};       // 清空绑定的数据
            },
            // 修改 对话框
            onEdit(index, row) {
                console.log("修改", index, row);
                this.editDialogVisible = true; // 显示对话框
                this.vacTypeForm = row; // 把被修改的数据更新到对话框绑定的模型数据上
            },
            // 删除 对话框
            // 形参：数据在列表中的索引index、记录对象row
            onDel(index, row) {
                console.log(index, row);
                this.$confirm('确认要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => { // 确认后，执行删除操作
                    this.axios({
                        method: 'delete',
                        url: '/api/vactype/' + row.id
                    }).then(res => {
                        console.log("删除疫苗类型: ", res);
                        if (200 == res.data.code) {
                            this.$message.success("数据删除成功!");
                            // 列表数据改变，引起页面刷新
                            this.vacTypePage.records.splice(index, 1); // 从显示列表中删除当前记录
                        }
                    }).catch(() => {
                        this.$message.error("数据删除失败!");
                    })
                }) // confrim.then
            },
            // 此函数在添加对话框中被使用。调用时刻：点击“确 定”按钮时
            // 保存添加的表单数据
            onSave() {
                // 判断表单验证结果
                this.$refs.vacTypeForm.validate((valid) => {
                    if (valid) {
                        console.log("表单提交:", this.vacTypeForm);
                        // 发送添加请求
                        this.axios({
                            method: 'post',
                            url: "/api/vactype", // 传递json格式数据
                            data: this.vacTypeForm
                        }).then(res => {
                            console.log("添加:", res);
                            if (200 == res.data.code) {
                                this.$message.success("添加数据成功！");
                                this.dialogVisible = false; // 关闭对话框
                                // 把数据显示在列表的首行
                                this.getList(this.vacTypePage.current);
                            } else {
                                this.$message.error("添加数据失败！");
                            }
                        }).catch(() => {
                            this.$message.error("添加数据异常！");
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 此函数在修改对话框中被使用。调用时刻：点击“确 定”按钮时
            // 更新被修改的数据
            onUpdate() {
                console.log("更新:", this.vacTypeForm);
                // 验证表单数据
                this.$refs.vacTypeForm.validate((valid) => {
                    if (valid) {
                        // 发送更新请求
                        this.axios({
                            method: 'put',
                            url: "/api/vactype",
                            data: this.vacTypeForm
                        }).then(res => {
                            console.log("更新", res);
                            if (200 == res.data.code) {
                                this.$message.success("更新数据成功！");
                                this.editDialogVisible = false; // 关闭修改对话框
                                // 把数据显示在列表中，请求列表分页
                                this.getList(1);
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
            },
        } // methods
    }
</script>

<style>
</style>