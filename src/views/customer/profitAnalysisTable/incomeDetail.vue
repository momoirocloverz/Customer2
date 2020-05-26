<template>
    <div class="pb20">
        <div class="pt20 tc f18 pb30">
            <span>收入明细   {{$route.query.classTaskDate}} {{$route.query.nameAlias? $route.query.nameAlias : ''}}</span>
        </div>
        <el-table :data="tableData" empty-text="暂无相关信息">
            <el-table-column label="班务" prop="classTaskName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="工时" prop="cusSettlementHours" :formatter="_number1" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="产量" align="center">
                <el-table-column label="件" prop="jian" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.jian | toFixeFortter}}
                    </template>
                </el-table-column>
                <el-table-column label="袋" prop="dai" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.dai | toFixeFortter}}
                    </template>
                </el-table-column>
                <el-table-column label="车" prop="che" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.che | toFixeFortter}}
                    </template>
                </el-table-column>
                <el-table-column label="吨" prop="dun" show-overflow-tooltip align="center" min-width="50">
                    <template slot-scope="scope">
                        {{scope.row.dun | toFixeFortter2}}
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="单价" min-width="200" prop="price" :formatter="forPrice" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="收入金额(元)" :formatter="_number" prop="inCome" show-overflow-tooltip align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>

    export default {
        data() {
            return {
                tableData: [],
                info:{},
            }
        },
        filters:{
            toFixeFortter(val) {
                if (val) {
                    return Number(val).toFixed(0)
                } else {
                    return 0
                }
            },toFixeFortter2(val) {
                if (val) {
                    return Number(val).toFixed(2)
                } else {
                    return 0
                }
            },
        },
        watch: {},
        mounted() {
            this.info = Object.assign({},this.$route.query)
            console.log(this.info)
            this.getData()
        },
        methods: {
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },_number1(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(1)
                } else {
                    return 0
                }
            },
            getData() {
                this.$api.classTaskProfitInComeDetail(this.info).then(res => {
                    if (res.data.respCode == 0) {
                        this.tableData = Array.from(res.data.data);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            forPrice(val) {
                if(val.price){
                    let salary = JSON.parse(val.price)
                    console.log(salary)
                    for (let item of salary.price) {
                        let content = ''
                        if (salary.valuationType == 1) {
                            content = `${item.countTime}元/小时`
                        } else if (salary.valuationType == 8) {
                            content = `${item.countFixed}元/天`
                        } else if (salary.valuationType == 2) {
                            if (salary.unit == 1) {
                                content = `${item.countSettle}元/件`
                            } else if (salary.unit == 2) {
                                content = `${item.countDai}元/袋`
                            } else if (salary.unit == 3) {
                                content = `${item.countChe}元/车`
                            } else {
                                content = `${item.countDun}元/吨`
                            }
                        } else if (salary.valuationType == 3) {
                            let varUnit
                            if (salary.unit == 1) {
                                varUnit = '件'
                            } else if (salary.unit == 2) {
                                varUnit = '袋'
                            } else if (salary.unit == 3) {
                                varUnit = '车'
                            } else {
                                varUnit = '吨'
                            }
                            content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                            for (let z in item.ladderObj) {
                                if (z > 0 && z != (item.ladderObj.length - 1)) {
                                    content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`
                                }
                            }
                            content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                        } else if (salary.valuationType == 4) {
                            if (item.countSettle) {
                                content += `${item.countSettle}元/件,`
                            }
                            if (item.countDai) {
                                content += `${item.countDai}元/袋,`
                            }
                            if (item.countChe) {
                                content += `${item.countChe}元/车,`
                            }
                            if (item.countDun) {
                                content += `${item.countDun}元/吨`
                            }
                        } else if (salary.valuationType == 5) {

                            if (salary.unit == 1) {
                                content += `${item.countSettle}元/件，`
                            } else if (salary.unit == 2) {
                                content += `${item.countDai}元/袋，`
                            } else if (salary.unit == 3) {
                                content += `${item.countChe}元/车，`
                            } else {
                                content += `${item.countDun}元/吨，`
                            }
                            content += `${item.countTime}元/小时`
                        } else if (salary.valuationType == 6) {
                            content += `${item.countTime}元/小时,`
                            let varUnit
                            if (salary.unit == 1) {
                                varUnit = '件'
                            } else if (salary.unit == 2) {
                                varUnit = '袋'
                            } else if (salary.unit == 3) {
                                varUnit = '车'
                            } else {
                                varUnit = '吨'
                            }
                            content += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
                            for (let z in item.ladderObj) {
                                if (z > 0 && z != (item.ladderObj.length - 1)) {
                                    content += `；${(Number((item.ladderObj)[z - 1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`

                                }
                            }
                            content += `；${(item.ladderObj)[item.ladderObj.length - 2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length - 1].overUnit}元/${varUnit}`
                        } else {

                            if (item.countSettle) {
                                content += `${item.countSettle}元/件,`
                            }
                            if (item.countDai) {
                                content += `${item.countDai}元/袋,`
                            }
                            if (item.countChe) {
                                content += `${item.countChe}元/车,`
                            }
                            if (item.countDun) {
                                content += `${item.countDun}元/吨,`
                            }
                            content += `${item.countTime}元/小时`
                        }
                        return content
                    }
            }else{
                    return '';
                }
            },
        }
    }
</script>

<style scoped lang="scss">
</style>
