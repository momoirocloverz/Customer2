<template>
    <div class="workerUnableCon back-white" v-loading="loading" element-loading-text="正在导出excel表...">
        <div class="filter-condition">
            <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
                <div class="search-zone">
                    <el-form-item class="formSearchMargin ">
                        <el-input placeholder="根据下拉框选项输入关键字搜索" v-model="form.keyWords" size="mini"
                                  class="input-with-select select-input">
                            <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                                <el-option label="零工姓名" value="1"></el-option>
                                <el-option label="手机号码" value="2"></el-option>
                                <el-option label="身份证号" value="3"></el-option>
                            </el-select>
                        </el-input>
                        <el-button type="primary" class="searchBtn" @click="handleSearch()">搜索</el-button>
                        <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i
                                class="el-icon-right el-icon-d-arrow-right"
                                :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                        </el-button>
                    </el-form-item>
                </div>
                <!--选择条件的单选按钮-->
                <div v-show="isShowComb" class="combine-zone">
                    <!--选择条件的单选按钮-->
                    <el-form-item label="性别：" class="formSearchMargin formSearchMarginTop">
                        <el-radio-group class="radio-search" v-model="form.sex">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
        </div>
        <div class="back-white btn-div flexable">
            <el-button class="primary-btn" size="mini" :disabled="isDisabled" @click="expoetExcel">导出名单</el-button>
        </div>
        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关零工信息">
                <el-table-column label="姓名" prop="realNameAlias" show-overflow-tooltip align="center"
                                 min-width="100"></el-table-column>
                <el-table-column label="性別" prop="sex" :formatter="sexFormatter" show-overflow-tooltip align="center"
                                 min-width="100"></el-table-column>
                <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip align="center"
                                 min-width="120"></el-table-column>
                <el-table-column label="手机号" prop="mobile" show-overflow-tooltip align="center"
                                 min-width="100"></el-table-column>
                <el-table-column label="最近添加时间" prop="updatedAt" :formatter="dateFormatter"  show-overflow-tooltip
                                 align="center" min-width="100"></el-table-column>
                <el-table-column label="操作" align="center" min-width="150">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                   @click="routeToDetail(scope.row)">查看
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div class="pagination-container" v-if="pageCount">
                <el-pagination class="mypagination" @current-change="handleCurrentChange" :current-page="currentPage"
                               :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "workersDays",
        data() {
            return {
                isDisabled: false,
                loading: false, //正在导出中的状态
                tableData: [],
                total: 0,
                currentPage: 1,
                pageCount: 1,
                pageSize: 20,
                isShowComb: false,//筛选
                form: {
                    selectType: '1',
                    sex: "",
                    idCard: '',//身份证号
                    mobile: '',//手机号
                    realNameAlias: '',//姓名防重名
                    keyWords: "",
                },
            };
        },
        mounted() {
            this.getList();
        },
        methods: {
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            dateFormatter(row, column, cellValue, index) {
                return cellValue.substring(0,16)
            },
            sexFormatter(row, column, cellValue, index) {
                let status = "男";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "男";
                        break;
                    case 2:
                        status = "女";
                        break;
                    default:
                        status = "男";
                        break;
                }
                return status;
            },
            handleSearch() {
                this.currentPage = 1;
                this.getList()
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            expoetExcel() {
                const params = {
                    // pageNum: this.currentPage,
                    // pageSize: 20,
                    sex: this.form.sex,
                    idCard: '',//身份证号
                    mobile: '',//手机号
                    realNameAlias: '',//姓名防重名
                }
                if (this.loading) {
                    return
                }
                this.loading = true;
                //根据选择的条件，把对应的字段值传给后台
                if (this.form.selectType && this.form.keyWords) {
                    switch (this.form.selectType) {
                        case "1":
                            params['realNameAlias'] = this.form.keyWords;
                            break;
                        case "2":
                            params['mobile'] = this.form.keyWords;
                            break;
                        case "3":
                            params['idCard'] = this.form.keyWords;
                            break;
                        default:
                            params['realNameAlias'] = this.form.keyWords;
                    }
                }
                this.$api.exprotWorkeysDays(params).then(res => {
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            window.open(res.data.data)
                        }
                    }
                }).catch(err => {
                    this.$message.error(err)
                }).finally( () => {
                    this.loading = false
                })
            },
            getList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: 20,
                    sex: this.form.sex,
                    idCard: '',//身份证号
                    mobile: '',//手机号
                    realNameAlias: '',//姓名防重名
                };
                if (this.form.selectType && this.form.keyWords) {
                    switch (this.form.selectType) {
                        case "1":
                            params['realNameAlias'] = this.form.keyWords;
                            break;
                        case "2":
                            params['mobile'] = this.form.keyWords;
                            break;
                        case "3":
                            params['idCard'] = this.form.keyWords;
                            break;
                        default:
                            params['realNameAlias'] = this.form.keyWords;
                    }
                }
                this.$api.workeysDays(params)
                    .then(res => {
                        if (res.data.list && res.data.list.length > 0) {
                            this.tableData = Array.from(res.data.list);
                            this.total = res.data.total;
                            this.isDisabled = false;
                        } else {
                            this.tableData = [];
                            this.total = 0;
                            this.isDisabled = true;
                        }
                    })
                    .catch(error => {
                        this.$message.error(error)
                    });
            },
            routeToDetail(row) {
                const {href} = this.$router.resolve({
                    name: "workerDetailDaily",
                    params: {
                        id: row.id,
                        talentId:row.id,
                    },
                    query:{
                        payWayType: '日结'
                    }
                });
                window.open(href, "_blank");
            },
        },
        watch: {
            "form.sex": function (val, oldval) {
                this.currentPage = 1;
                this.getList();
            },
        }
    };
</script>
<style lang="scss" scoped>
    .workerUnableCon {
        .searchBtn {
            vertical-align: 2px;
        }
    }
</style>