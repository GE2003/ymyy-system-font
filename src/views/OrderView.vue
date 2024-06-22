<template>
    <!-- 预约管理界面 -->
    <div id="order">
        <!-- 新冠疫苗接种预约 -->
        <div>
        
            <h3>预约接种时间段</h3>
            <el-time-select placeholder="起始时间" v-model="startTimeAM" :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30'
                }">
            </el-time-select>
            <el-time-select placeholder="结束时间" v-model="endTimeAM" :picker-options="{
                  start: '08:30',
                  step: '00:15',
                  end: '18:30',
                  minTime: startTimeAM
                }">
            </el-time-select>
            <!-- 时间选择器：下午工作时间段 -->
            <!-- <h3>下午工作时间段</h3> 
            <el-time-select placeholder="起始时间" v-model="startTimePM" :picker-options="{
                  start: '14:30',
                  step: '00:15',
                  end: '18:30'
                }">
            </el-time-select> 
            <el-time-select placeholder="结束时间" v-model="endTimePM" :picker-options="{
                  start: '14:30',
                  step: '00:15',
                  end: '18:30',
                  minTime: startTimePM
                }">
            </el-time-select> -->
        </div>
        <div>
            <!-- 接种点列表 -->
            <el-table :data="inoSitePage.records" stripe style="width: 100%">
                <el-table-column prop="id" label="序号" width="60">
                </el-table-column>
                <el-table-column prop="name" label="名称" width="220">
                </el-table-column>
                <el-table-column prop="address" label="地址" width="240">
                </el-table-column>
                <el-table-column prop="startDate" label="开始日期" width="100">
                </el-table-column>
                <el-table-column prop="endDate" label="结束日期" width="100">
                </el-table-column>
                <el-table-column prop="vaccineBean.name" label="可接种疫苗">
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="primary" @click="onOrderCreate(scope.$index,scope.row)">预约</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <!-- Element-UI 分页器 -->
            <el-pagination @current-change="inoSitePageCurrentChange" background layout="prev,pager,next"
                :total="inoSitePage.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    //import axios from 'axios';
    export default {
        name: 'OrderView',
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
                orderForm: { // 修改、添加表单数据
                    times: '上午',
                },
                startTimeAM: '', // 时间选择器--上午开始时间
                endTimeAM: '', // 时间选择器--上午结束时间
                startTimePM: '', // 时间选择器--下午开始时间
                endTimePM: '' // 时间选择器--下午结束时间
            }
        },
        created() {
            this.getInoSiteList(1); // 调用接种点列表分页函数
        },
        methods: {
            // 列表分页
            getInoSiteList(pageNo) {
                //this.inoSitePage.current = pageNo; // 更新页码
                this.axios({
                    method: 'get',
                    url: "/api/inosite/page",
                    params: {
                        pageNo: pageNo,
                        size: this.inoSitePage.size
                    }
                }).then(res => {
                    this.inoSitePage.records = res.data.data.records; // 更新数据
                    this.pager = res.data.data.pages; // 把总页码赋值给分页器pager对象
                    this.inoSitePage.total = res.data.data.total; // 把总记录数赋值给分布器total
                })
            },
            // 接种点列表页码改变事件
            inoSitePageCurrentChange(page) {
                this.getInoSiteList(page);
            },
            // 预约
            
            onOrderCreate(index, row) {
                console.log("预约业务: ", index, row);
                let inoSiteId = row.id; // 获取接种点id
                let user = {}; // 获取用户id
                let times = `${this.startTimeAM}-${this.endTimeAM}`;// 获取预约时间段
                if (!this.startTimeAM || !this.endTimeAM || this.startTimeAM.trim() === "" || this.endTimeAM.trim() === "") {
                     alert("请选择预约时间");
                } else {
                    let token = localStorage.getItem("Authorization");
                this.axios({
                    url: '/api/login/info',
                    method: 'post',
                    data: token
                }).then(res => {
                    user = res.data.data;
                    console.log("预约用户: ", user);
                })
                //let userId = user.id;
                console.log("userId: ", user.id);
                // 发起请求，生成预约记录
                this.axios({
                    url: '/api/order',
                    method: 'post',
                    data: {
                        userId: 1, //userId: user.id,
                        inoSiteId: inoSiteId,
                        times: times,
                    },
                }).then(res => {
                    let code = res.data.code;
                    if (200 === code) {
                        this.$message.success("预约成功，预约当天有效");
                    }
                })
                   }
               
            },
        }
    }
</script>

<style>
</style>
