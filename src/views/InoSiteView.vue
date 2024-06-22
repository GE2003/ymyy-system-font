<template>
    <!-- 接种点管理界面 -->
    <div id="inoSite">
        <!-- 搜索表单 -->
        <el-form :inline="true" :model="formSearch" class="demo-formSearch">
            <el-form-item label="名称">
                <el-input v-model="formSearch.name" placeholder="搜索名称"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSearch">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-button type="success" @click="onAdd">添加</el-button>
        <!-- 接种点列表 -->
        <el-table :data="inoSitePage.records" stripe style="width: 100%">
            <el-table-column prop="id" label="序号" width="60">
            </el-table-column>
            <el-table-column prop="name" label="名称" width="180">
            </el-table-column>
            <el-table-column prop="address" label="地址" width="180">
            </el-table-column>
            <el-table-column prop="startDate" label="开始日期" width="90">
            </el-table-column>
            <el-table-column prop="endDate" label="结束日期" width="90">
            </el-table-column>
            <el-table-column prop="vaccineBean.name" label="可接种疫苗">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <!-- 设置点击事件 -->
                    <el-button type="primary" @click="onEdit(scope.$index,scope.row)">修改</el-button>
                    <el-button type="danger" @click="onDel(scope.$index,scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- Element-UI 分页器 -->
        <el-pagination @current-change="currentChange" :page-size="inoSitePage.size" background layout="prev,pager,next"
            :total="inoSitePage.total">
        </el-pagination>
        <div>
            <!-- 添加接种点数据 -->
            <el-dialog title="添加接种点数据" :visible.sync="dialogVisible" width="50%">
                <el-form :model="inoSiteForm" status-icon :rules="rules" ref="inoSiteForm" label-width="100px"
                    class="demo-inoSiteForm">
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="inoSiteForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input type="textarea" :rows="2" v-model="inoSiteForm.address" auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开始日期">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="inoSiteForm.startDate" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="结束日期">
                        <el-col :span="11">
                            <el-date-picker type="date" placeholder="选择日期" v-model="inoSiteForm.endDate" style="width: 100%;">
                            </el-date-picker>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="可接种疫苗" prop="vacId">
                        <el-select v-model="inoSiteForm.vacId" placeholder="请选择">
                            <el-option v-for="item in vaccineList" :key="item.id" :label="item.name" :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSave()">确 定</el-button>
                </span>
            </el-dialog>
            <!-- 修改接种点数据 -->
            <el-dialog title="修改接种点数据" :visible.sync="editDialogVisible" width="50%">
                <el-form :model="inoSiteForm" status-icon :rules="rules" ref="inoSiteForm" label-width="100px"
                    class="demo-inoSiteForm">
                    <el-form-item label="名称" prop="name">
                        <el-input type="text" v-model="inoSiteForm.name" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="地址" prop="address">
                        <el-input type="textarea" :rows="2" v-model="inoSiteForm.address" auto-complete="off">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="开始日期" prop="startDate">
                        <el-input type="text" v-model="inoSiteForm.startDate" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="结束日期" prop="endDate">
                        <el-input type="text" v-model="inoSiteForm.endDate" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="可接种疫苗" prop="vacId">
                        <el-select v-model="inoSiteForm.vacId" placeholder="请选择">
                            <el-option v-for="item in vaccineList" :key="item.id" :label="item.name" :value="item.id">
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
        name: 'InoSiteView',
        data() {
            return {
                pager: 0, // 总页码数
                // 分页数据定义
                inoSitePage: {
                    records: [], // 分页列表
                    total: 0, // 总记录数
                    size: 10, // 分页大小（每页显示多少条）
                    pages: 0, // 总页码
                    current: 1, // 当前页码（默认显示第1页）
                },
                formSearch: { // 搜索表单绑定数据
                    name: ''
                },
                inoSiteForm: { // 修改、添加表单数据
                    name: '',
                    address: '',
                    startDate: '',
                    endDate: '',
                    vacId: ''
                },
                vaccineList: [], // 疫苗列表
                dialogVisible: false, // 添加对话框显示控制
                editDialogVisible: false, // 修改对话框显示控制
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
                    address: [{
                            required: true,
                            message: '请输入地址',
                            trigger: 'blur'
                        },
                        {
                            min: 3,
                            max: 250,
                            message: '长度在 3 到 250 个字符',
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
                this.axios({
                    method: 'get',
                    url: "/api/inosite/page",
                    params: {
                        pageNo: pageNo,
                        size: this.inoSitePage.size,
                    }
                }).then(res => {
                    console.log("分页列表:", res);
                    this.inoSitePage.records = res.data.data.records; // 更新数据
                    this.pager = res.data.data.pages; // 把总页码赋值给分页器pager对象
                    this.inoSitePage.total = res.data.data.total; // 把总记录数赋值给分布器total
                })
            },
            // 页码改变事件
            currentChange(page) {
                this.getList(page);
            },
            // 搜索功能
            onSearch() {
                this.axios({
                    method: 'post', // 传递json格式数据，用post请求
                    url: '/api/inosite/page',
                    data: {
                        page: this.inoSitePage,
                        inoSite: {
                            name: this.formSearch.name
                        }
                    }
                }).then(res => {
                    //console.log("搜索:", res);
                    this.inoSitePage.records = res.data.data.records; // 查询到的记录列表
                    this.pager = res.data.data.pages;
                })
            },
            // 添加 对话框
            onAdd() {
                this.dialogVisible = true; // 显示对话框
                this.inoSiteForm = {}; // 清空绑定的数据
                this.getVaccineList(); // 获取疫苗列表
            },
            // 修改 对话框
            onEdit(index, row) {
                console.log("修改", index, row);
                this.editDialogVisible = true; // 显示对话框
                this.inoSiteForm = row; // 把被修改的数据更新到对话框绑定的模型数据上
                this.getVaccineList(); // 获取疫苗列表
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
                        url: '/api/inosite/' + row.id
                    }).then(res => {
                        console.log("删除接种点: ", res);
                        if (200 == res.data.code) {
                            this.$message.success("数据删除成功!");
                            // 列表数据改变，引起页面刷新
                            this.inoSitePage.records.splice(index, 1); // 从显示列表中删除当前记录
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
                this.$refs.inoSiteForm.validate((valid) => {
                    if (valid) {
                        console.log("表单提交:", this.inoSiteForm);
                        // 发送添加请求
                        this.axios({
                            method: 'post',
                            url: "/api/inosite",
                            data: this.inoSiteForm
                        }).then(res => {
                            console.log("添加:", res);
                            if (200 == res.data.code) {
                                this.$message.success("添加数据成功！");
                                this.dialogVisible = false; // 关闭对话框
                                // 把数据显示在列表的首行
                                this.getList(this.inoSitePage.current);
                            } else {
                                this.$message.error("添加数据失败！");
                            }
                        }).catch(() => {
                            this.$message.error("添加数据异常！");
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            // 此函数在修改对话框中被使用。调用时刻：点击“确 定”按钮时
            // 更新被修改的数据
            onUpdate() {
                console.log("更新:", this.inoSiteForm);
                // 验证表单数据
                this.$refs.inoSiteForm.validate((valid) => {
                    if (valid) {
                        // 发送更新请求
                        this.axios({
                            method: 'put',
                            url: "/api/inosite",
                            data: this.inoSiteForm
                        }).then(res => {
                            console.log("更新", res);
                            if (200 == res.data.code) {
                                this.$message.success("更新数据成功！");
                                this.editDialogVisible = false; // 关闭修改对话框
                                this.getList(1);
                            } else {
                                this.$message.error("更新数据失败！");
                            }
                        }).catch(() => {
                            this.$message.error("更新数据异常！");
                        })
                    } else {
                        //console.log('error submit!!');
                        return false;
                    }
                });
            },
            getVaccineList() { // 获取疫苗列表
                this.axios({
                    method: 'get',
                    url: '/api/vaccine/list'
                }).then(res => {
                    console.log("疫苗列表: ", res);
                    this.vaccineList = res.data.data; // 更新列表数据
                });
            }
        }
    }
</script>

<style>
</style>
