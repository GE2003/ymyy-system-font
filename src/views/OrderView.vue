<template>
    <!-- 预约管理界面 -->
    <div id="order">
        <!-- 新冠疫苗接种预约 -->
        <div>
            <h3>选择预约日期和时间段</h3>
            <!-- 日期选择器 -->
            <el-date-picker
                v-model="selectedDate"
                type="date"
                placeholder="选择日期"
                :picker-options="{ 
                    firstDayOfWeek: 1, 
                    disabledDate: time => time.getTime() < Date.now() - 86400000
                }"
                style="width: 180px; margin-right: 20px;"
            >
            </el-date-picker>
            <!-- 上午工作时间段 -->
            <el-time-select 
                v-model="selectedStartTimeAM" 
                placeholder="上午开始时间"
                :picker-options="{
                    start: '08:30',
                    step: '00:15',
                    end: '11:30'
                }"
                style="margin-right: 20px;"
            >
            </el-time-select>
            <el-time-select 
                v-model="selectedEndTimeAM" 
                placeholder="上午结束时间"
                :picker-options="{
                    start: selectedStartTimeAM,
                    step: '00:15',
                    end: '11:30'
                }"
                style="margin-right: 20px;"
            >
            </el-time-select>
            <!-- 下午工作时间段 -->
            <el-time-select 
                v-model="selectedStartTimePM" 
                placeholder="下午开始时间"
                :picker-options="{
                    start: '14:30',
                    step: '00:15',
                    end: '17:30'
                }"
                style="margin-right: 20px;"
            >
            </el-time-select>
            <el-time-select 
                v-model="selectedEndTimePM" 
                placeholder="下午结束时间"
                :picker-options="{
                    start: selectedStartTimePM,
                    step: '00:15',
                    end: '17:30'
                }"
                style="margin-right: 20px;"
            >
            </el-time-select>
           
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
                        <el-button type="primary" @click="onOrderCreate(scope.$index, scope.row)">预约</el-button>
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
    export default {
        name: 'OrderView',
        data() {
            return {
                pager: 0,
                inoSitePage: {
                    records: [],
                    total: 0,
                    size: 10,
                    pages: 0,
                    current: 1,
                },
                selectedDate: '', // 选择的日期
                selectedStartTimeAM: '', // 上午开始时间
                selectedEndTimeAM: '', // 上午结束时间
                selectedStartTimePM: '', // 下午开始时间
                selectedEndTimePM: '' // 下午结束时间
            }
        },
        created() {
            this.getInoSiteList(1);
        },
        methods: {
            getInoSiteList(pageNo) {
                this.axios({
                    method: 'get',
                    url: "/api/inosite/page",
                    params: {
                        pageNo: pageNo,
                        size: this.inoSitePage.size
                    }
                }).then(res => {
                    this.inoSitePage.records = res.data.data.records;
                    this.pager = res.data.data.pages;
                    this.inoSitePage.total = res.data.data.total;
                })
            },
            inoSitePageCurrentChange(page) {
                this.getInoSiteList(page);
            },
            onOrderCreate(index, row) {
                console.log("预约业务: ", index, row);
                let inoSiteId = row.id;
                let user = {};
                let selectedDate = this.selectedDate;
                let times = '';

                if (!selectedDate || !this.selectedStartTimeAM || !this.selectedEndTimeAM ||
                    !this.selectedStartTimePM || !this.selectedEndTimePM) {
                    this.$message.error('请选择预约日期和时间段');
                    return;
                }

                times = `${selectedDate} ${this.selectedStartTimeAM}-${this.selectedEndTimeAM}, ${this.selectedStartTimePM}-${this.selectedEndTimePM}`;

                // Example of API call to create an order
                this.axios({
                    url: '/api/order',
                    method: 'post',
                    data: {
                        userId: user.id,
                        inoSiteId: inoSiteId,
                        times: times,
                    },
                }).then(res => {
                    let code = res.data.code;
                    if (code === 200) {
                        this.$message.success("预约成功，预约当天有效");
                    }
                }).catch(err => {
                    console.error('Error:', err); // Utilizing 'err' to log the error
                    this.$message.error("预约失败，请稍后重试");
                });
            },
        }
    }
</script>

<style>
</style>
