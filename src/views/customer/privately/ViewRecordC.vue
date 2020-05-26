<template>
    <div>
        <el-form ref="form" :model="form" label-width="110px">
            <!--选择条件的单选按钮-->
            <el-form-item label="字号名称：" class="formSearchMargin">
                {{$route.params.name}}
            </el-form-item>
            <el-form-item label="经营者姓名：" class="formSearchMargin">
                {{$route.params.legalPerson}}
            </el-form-item>
        </el-form>
        <div class="splitLine"></div>
        <el-table class="table-outline" :data="tableData">
            <el-table-column prop="charge" label="交费金额（元）" align="center" min-width="140">
            </el-table-column>
            <el-table-column prop="payDate" label="交费日期" align="center" min-width="140">
            </el-table-column>
            <el-table-column prop="payments" label="交费渠道" align="center" min-width="140">
            </el-table-column>
            <el-table-column prop="endTime" label="服务截止日期" align="center" min-width="160">
            </el-table-column>
        </el-table>
        <div class="page-container">
            <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPage" :page-count="pageCount" background layout="prev, pager, next">
            </el-pagination>
        </div>
    </div>
</template>
<script>
export default {
    name: "viewRecordC",
    data() {
        return {
            form: {
                name: "不限",
                boss: "不限",
                manager: "不限"
            },
            tableData: [],
            currentPage: 1,
            pageCount: 1
        };
    },
    methods: {
        getList() {
            const params = {
                financeCustomerId: this.$route.params.id,
                pageSize: 20,
                pageNum: this.currentPage
            };
            this.$api
                .PrivatelyViewRecord(params)
                .then(response => {
                    if (response.data.respCode == 0) {
                        this.tableData = response.data.data.list;
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        },
        changePage(val) {
            this.currentPage = val;
            this.getList();
        }
    },
    mounted() {
        // console.log(this.$router.params)
        this.getList();
    }
};
</script>
<style scoped>
</style>

