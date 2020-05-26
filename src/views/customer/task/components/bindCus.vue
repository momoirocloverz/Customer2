<template>
    <div class="unbind-cus-list">
        <el-form ref="searchForm" :model="searchForm" label-width="100px" labelPosition="left" class="searchThisForm">
            <div class="search-zone">
                <el-input class="searchMaster" clearable placeholder="输入经理人姓名搜索" prefix-icon="el-icon-search"
                          v-model="searchForm.taskName"></el-input>
                <div class="charge-btn" @click="searchNow">搜索</div>
            </div>
        </el-form>
        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="经理人简称" align="center" prop="partnerShortName" show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="经理人全称" align="center" prop="partnerName" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="联系人号码" align="center" prop="partnerPhone" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="最近绑定时间" align="center" prop="bindingTime" :formatter="timeFormatter" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="解绑时间" align="center" prop="unBindingTime" :formatter="timeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" show-overflow-tooltip min-width="160">
                    <template v-slot="scope">
                        <el-button @click="routeToDetail(scope.row)" type="text">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination-container" v-if="total">
            <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total"
                           @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                searchForm: {
                    taskName: '',
                },
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 20,
                viewIcon: require('@/assets/icons/view.png'),
            }
        },
        watch: {},
        mounted() {
            this.fetchList();
        },
        methods: {
            fetchList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    partnerShortName: this.searchForm.taskName,
                };
                this.$api.unBindingList(params).then(res => {
                    let {data: result} = res;
                    let {data, respCode} = result;
                    if (respCode === 0) {
                        this.total = data.total;
                        if (data.list) {
                            this.tableData = data.list;
                        } else {
                            this.tableData = [];
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            unitRequest() {
                this.currentPage = 1;
                this.fetchList();
            },
            searchNow() {
                this.unitRequest();
            },
            timeFormatter(row, column, cellValue, index) {
                let res = '永久';
                if (cellValue) {
                    res = moment(cellValue).format('YYYY-MM-DD HH:mm');
                } else {
                    res = '永久';
                }
                return res;
            },
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = ''
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '绑定中'
                        break
                    case 2:
                        status = '待对方同意解绑'
                        break
                    case 3:
                        status = '待我同意解绑'
                        break
                    case 4:
                        status = '已解绑'
                        break
                    default:
                        status = '无'
                        break
                }
                return status
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchList();
            },
            routeToDetail(row) {
                const {href} = this.$router.resolve({
                    name: "customerDetail",
                    query: {
                        id: row.partnerId,
                    }
                });
                window.open(href, "_blank");
            },
        },
    }
</script>
<style lang="scss">
    .unbind-cus-list {
        background-color: #fff;

        .middleText {
            text-align: center;
            color: #C0C1C2;
            line-height: 22px;
        }

        .formSearchMargin {
            margin-bottom: 0;
        }

        .combine-zone {
            border-top: 1px solid #EAEDF4;
            padding-bottom: 11px;
        }

        .comb-btn {
            margin-bottom: 20px;
        }

        .searchThisForm {
            padding-left: 20px;
        }

        .charge-btn {
            font-size: 12px;
            background-color: #ffefea !important;
            border: 1px solid #f7beb2;
            border-radius: 4px;
            text-align: center;
            line-height: 34px;
            width: 100px;
            height: 34px;
            box-sizing: border-box;
            color: #e9481c;
            cursor: pointer;
            margin-bottom: 20px;
        }

        .search-zone {
            display: flex;
            align-items: center;
            justify-content: flex-start;
            flex-wrap: wrap;
            align-content: center;
            align-items: center;
            padding-top: 20px;
        }

        .searchMaster {
            font-size: 12px;
            width: 520px;
            margin-right: 20px;
            margin-bottom: 20px;

            .el-input__inner {
                height: 34px;
                line-height: 34px;
            }
        }

        .middleTextHead {
            color: #4D4D4D;
            font-size: 16px;
            margin-bottom: 5px;
        }

        .operateCon {
            display: flex;
            flex-direction: row;
            justify-content: space-around;
            align-content: center;
            align-items: center;

            img {
                width: 12px;
                vertical-align: -3px;
                margin-right: 6px;
            }

            .viewCon {
                cursor: pointer;
            }

            .pickCon {
                cursor: pointer;
            }
        }
    }
</style>
<style lang="scss">
    .taketaskCon {
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }

        .el-radio-group {
            height: 16px;
        }

        .el-form-item__label {
            line-height: 16px;
        }

        .el-form-item {
        }

        .searchMaster {
            .el-input__inner {
                height: 34px;
            }

            .el-icon-search {
                line-height: 28px;
            }
        }

        .resetFormItem {
            margin-top: 10px;
            margin-bottom: 0;
        }

        .resetDialog {
            .el-dialog {
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
                height: 220px;
            }

            .el-dialog__header {
                border-bottom: none;
            }

            .resetBtn {
                width: 90px;
            }

            .resetBtnSp {
                width: 90px;
                color: #E9481C;
                background-color: #FFEFEA;
                border-color: #F7BEB2;
            }

            .el-button:active {
                color: #d13e16;
                border-color: #d13e16;
            }
        }

        .combine-zone {
            .el-radio__label {
                font-size: 12px;
                padding-left: 0;
                vertical-align: -1px;
            }

            .el-form-item__label {
                line-height: 18px;
                font-size: 12px;
            }

            .el-form-item__content {
                line-height: 18px;
            }

            .el-radio-group {
                min-height: inherit;
            }
        }

        .wrapFlex {
            .setMinHeight {
                min-height: 16px;
            }

            .el-radio-group {
                flex-wrap: wrap;
                height: auto;
            }

            .el-radio {
                margin-bottom: 6px;
                line-height: 16px;
            }
        }
    }
</style>