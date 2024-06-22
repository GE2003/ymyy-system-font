<template>
    <!-- 疫苗管理界面 -->
    <div id="vaccine">
        <el-button type="success" @click="onAdd">添加</el-button>
        <!-- 疫苗列表 -->
        <el-table :data="vaccinePage.records" stripe style="width: 100%">
            <el-table-column prop="id" label="编号" width="180">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="company" label="生产厂商" width="180">
            </el-table-column>
            <el-table-column prop="vacTypeBean.name" label="疫苗类型">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onEdit(scope.$index,scope.row)">修改</el-button>
                    <el-button type="danger" @click="onDel(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Element-UI 分页器 -->
        <el-pagination @current-change="currentChange" background layout="prev,pager,next" :total="vaccinePage.total">
        </el-pagination>
        <div>
            <!-- 添加疫苗数据 -->
            <el-dialog title="添加疫苗数据" :visible.sync="dialogVisible" width="50%">
                <el-form :model="vaccineForm" status-icon :rules="rules" ref="vaccineForm" label-width="100px" class="demo-vaccineForm">
                    <el-form-item label="编号" prop="id">
                        <el-input type="number" v-model="vaccineForm.id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="vaccineForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂商" prop="company">
                        <el-input type="text" v-model="vaccineForm.company" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="疫苗类型" prop="vacTypeId">
                        <el-select v-model="vaccineForm.vacTypeId" placeholder="请选择">
                            <el-option v-for="item in vacTypeList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSave()">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改疫苗数据 -->
            <el-dialog title="修改疫苗数据" :visible.sync="editDialogVisible" width="50%">
                <el-form :model="vaccineForm" status-icon :rules="rules" ref="vaccineForm" label-width="100px" class="demo-vaccineForm">
                    <el-form-item label="编号" prop="id">
                        <el-input type="number" v-model="vaccineForm.id" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="vaccineForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="生产厂商" prop="company">
                        <el-input type="text" v-model="vaccineForm.company" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="疫苗类型" prop="vacTypeId">
                        <el-select v-model="vaccineForm.vacTypeId" placeholder="请选择">
                            <el-option v-for="item in vacTypeList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
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
        name: 'VaccineView',
        data() {
            return {
                pager: 0,
                vaccinePage: { // 分页数据定义
                    records: [],    // 分页列表
                    total: 0,       // 总记录数
                    size: 10,       // 分页大小
                    pages: 0,       // 总页码
                    current: 1,     // 当前页码
                },
                vaccineForm: { // 修改、添加表单数据
                    id: 0,
                    name: '',
                    company: '',
                    vacTypeId: 0,
                },
                vacTypeList: [], // 疫苗类型列表数据
                dialogVisible: false,       // 添加对话框显示控制
                editDialogVisible: false,   // 修改对话框显示控制
                rules: {
                    name: [{
                            required: true,
                            message: '请输入名称',
                            trigger: 'blur'
                        },
                        {
                            min: 2,
                            max: 12,
                            message: '长度在 2 到 12 个字符',
                            trigger: 'blur'
                        }
                    ],
                    company: [{
                            required: true,
                            message: '请输入生产厂商',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 250,
                            message: '长度在 3 到 250 个字符',
                            trigger: 'blur'
                        }
                    ]
                } // rules
            }
        },
        created() {
            this.getList(1);
        },
        methods: {
            // 列表分页
            getList(pageNo) {
                this.axios({
                    method: 'get',
                    url: "/api/vaccine/page",
                    params: {
                        pageNo: pageNo,
                        size: this.vaccinePage.size,
                    }
                }).then(res => {
                    console.log("分页列表:", res);
                    this.vaccinePage.records = res.data.data.records; // 更新数据
                    this.pager = res.data.data.pages; // 把总页码赋值给分页器pager对象
                    this.vaccinePage.total = res.data.data.total; // 把总记录数赋值给分布器total
                })
            },
            // 页码改变事件
            currentChange(page) {
                this.getList(page);
            },
            // 添加 对话框
            onAdd() {
                this.dialogVisible = true;  // 显示对话框
                this.vaccineForm = {};         // 清空绑定的数据
                this.getVacTypeList();     // 获取医院列表
            },
            // 修改 对话框
            onEdit(index, row) {
                console.log("修改: ", index, row);
                this.editDialogVisible = true; // 显示对话框
                this.vaccineForm = row; // 把被修改的数据更新到对话框绑定的模型数据上
                this.getVacTypeList();   // 获取疫苗类型列表
            },
            // 删除 对话框
            // 形参：数据在列表中的索引index、记录对象row
            onDel(index, row) {
                console.log("删除: ", index, row);
                this.$confirm('确认要删除吗？', '提示', {
                    type: 'warning'
                }).then(() => { // 确认后，执行删除操作
                    this.axios({
                        method: 'delete',
                        url: '/api/vaccine/' + row.id
                    }).then(res => {
                        console.log("删除: ", res);
                        if (200 == res.data.code) {
                            this.$message.success("数据删除成功!");
                            // 列表数据改变，引起页面刷新
                            this.vaccinePage.records.splice(index, 1); // 从显示列表中删除当前记录
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
                this.$refs.vaccineForm.validate((valid) => {
                    if (valid) {
                        console.log("表单提交: ", this.vaccineForm);
                        // 发送添加请求
                        this.axios({
                            method: 'post',
                            url: "/api/vaccine",
                            data: this.vaccineForm
                        }).then(res => {
                            console.log("添加:", res);
                            if (200 == res.data.code) {
                                this.$message.success("添加数据成功！");
                                this.dialogVisible = false; // 关闭对话框
                                // 把数据显示在列表的首行
                                this.getList(this.vaccinePage.current);
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
                console.log("更新: ", this.vaccineForm);
                // 验证表单数据
                this.$refs.vaccineForm.validate((valid) => {
                    if (valid) {
                        // 发送更新请求
                        this.axios({
                            method: 'put',
                            url: "/api/vaccine",
                            data: this.vaccineForm
                        }).then(res => {
                            //console.log("更新", res);
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
            getVacTypeList() { // 获取疫苗类型列表
                this.axios({
                    method: 'get',
                    url: '/api/vactype/list'
                }).then(res => {
                    console.log("疫苗类型列表:", res);
                    this.vacTypeList = res.data.data; // 更新疫苗类型列表数据
                });
            }
        }
    }
</script>

<style>
</style>