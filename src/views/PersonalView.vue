<template>
    <div id="personer">
        <h2>个人中心</h2><br>
        <h3>预约接种列表</h3>
        <el-table :data="orderPage.records" stripe style="width: 90%">
            <el-table-column prop="id" label="编号" width="180">
            </el-table-column>
            <el-table-column prop="userBean.name" label="身份证号" width="180">
            </el-table-column>
            <el-table-column prop="inoSiteBean.name" label="接种点" width="180">
            </el-table-column>
            <el-table-column prop="date" label="日期">
            </el-table-column>
            <el-table-column prop="times" label="具体时间">
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="primary" @click="onCancelOrder(scope.$index,scope.row)">取消</el-button>

                </template>
            </el-table-column>
        </el-table>
    </div>
</template>

<script>
    import axios from 'axios';
    export default {
        name: "PersonalView",
        data() {
            return {
                pager: 0,
                orderPage: { // 分页数据定义
                    records: [], // 分页列表
                    total: 0, // 总记录数
                    size: 10, // 分页大小
                    pages: 0, // 总页码
                    current: 1, // 当前页码
                },
            }
        },
        created() {
            this.getList(1);
        },
        methods: {
            getList(pageNo) {
                //this.orderPage.current = pageNo; // 更新页码
                // 获取用户信息，转换成json对象
                let userInfo = JSON.parse(localStorage.getItem("SET_USER"));
                console.log("个人中心分页列表：", userInfo)
                axios({
                    method: 'get',
                    url: "/api/order/list",
                    params: {
                        pageNo: pageNo,
                        size: this.orderPage.size,
                        //userId: userInfo.id
                    }
                }).then(res => {
                    console.log("个人中心分页列表:", res);
                    this.orderPage.records = res.data.data; // 更新数据
                    // this.pager = res.data.data.pages; // 把总页码赋值给分页器pager对象
                    // this.orderPage.total = res.data.data.total; // 把总记录数赋值给分布器total
                })
            },
            // 页码改变事件
            currentChange(page) {
                this.getList(page);
            },
            // 取消预约
            onCancelOrder(index, order) {
                axios({
                    method: 'delete',
                    url: '/api/order/' + order.id
                }).then(res => {
                    console.log("取消预约", res);
                    if(200 === res.data.code) {
                        this.orderPage.records.splice(index, 1); //从数据中删除
                        this.$message.success("预约成功取消");
                    }
                })
            }
        }
    }
</script>

<style>
</style>