<template>
    <div class="notProCheckWorkCon">
        <h3 class="sche-title">未结算的排班</h3>
        <div class="table-box back-white">
            <!--<div class="infoCon">这些排班已结算后，可在待付批次汇总页面点击“生成待付批次”按钮生成待付批次</div>-->
            <el-form ref="formDetail" :model="formDetail" class="no-pro" label-width="90px" labelPosition="left">
                <div class="combine-zone">
                    <el-form-item label="日期范围：" class="formSearchMargin fixMark markFormItem">
                        <div class="no-date">
                            <el-radio-group class="radio-search" v-model="formDetail.date">
                                <el-radio label="">不限</el-radio>
                                <el-radio label="4">自定义</el-radio>
                            </el-radio-group>
                            <div class="no-date-cus" v-if="formDetail.date == '4'">
                                <el-date-picker class="no-date-picker" size="mini" v-model="formDetail.startDate"
                                                type="date" value-format="yyyy-MM-dd"
                                                :picker-options="pickerOptions"
                                                placeholder="选择开始时间">
                                </el-date-picker>
                                <span class="span-">-</span>
                                <el-date-picker class="no-date-picker" size="mini" v-model="formDetail.endDate"
                                                type="date" value-format="yyyy-MM-dd"
                                                :picker-options="pickerOptions"
                                                placeholder="选择结束时间">
                                </el-date-picker>
                                <el-button type="primary" size="small" class="no-pro-btn" @click="btn_true">确定
                                </el-button>
                            </div>
                        </div>
                    </el-form-item>
                    <el-form-item label="收入类型：" class="formSearchMargin fixMark marginTopSp">
                        <el-radio-group class="radio-search" v-model="formDetail.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">日结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="2">月结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细" style="width: 100%;">
                <el-table-column label="排班日期" prop="schedulingDate" align="center"></el-table-column>
                <el-table-column label="排班" prop="schedulingName" align="center"></el-table-column>
                <el-table-column label="班务经理" prop="classManagerName" align="center"></el-table-column>
                <el-table-column label="零工收入类型" prop="allNum" :formatter="allForNum" align="center">
                </el-table-column>
                <el-table-column label="排班状态" prop="" align="center">
                    <template v-slot="scope">
                        <span>{{scope.row | forType}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="单价是否需要审核" align="center">
                   <template v-slot="scope">
                        <span>{{scope.row | needCheckProcesser}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                    <template v-slot="scope">
                        <div class="operateCon">
                            <div v-if="scope.row.shouldPriceCheck == '1'" class="subItem" @click="toExamine(scope.row)">
                                <img class="operateIcon" :src="icon3">
                                <span>查看</span>
                            </div>
                            <div v-else>不可用</div>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"
                               :current-page="currentPage" :page-count="pageCount">
                </el-pagination>
            </div>
        </div>

        <el-dialog class="resetDialog" title="提示" :visible.sync="centerDialogVisible"  width="400px" center>
          <span>确认排班<span class="infoMark">{{checkObj.schedulingName}}</span>通过审核</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmPass">确 定</el-button>
          </span>
        </el-dialog>

    </div>
</template>
<script>
    import moment from 'moment';
    export default {
        data() {
            return {   
                centerDialogVisible:false,
                currentPage: 1,
                pageCount: 0,
                pageSize: 20,
                tableData: [],
                formDetail: {
                    date: '',
                    settlementType: '',
                    settlementStatus: '1',//代付
                    startDate: '',
                    endDate:'',
                    preDate:moment().subtract(1, 'days').format('YYYY-MM-DD'),
                },
                pickerOptions: {
                    // disabledDate(time) {
                    //     let preDate = (new Date()).getTime() - 24*60*60*1000;
                    //     return time.getTime() > preDate;
                    // },
                },
                iconSrc:require('@/assets/icons/pick.png'),
                icon3:require('@/assets/icons/icon_1543.png'),
                checkObj:{},
            }
        },
        filters: {
            forType(val) {
                // 待确认、待结算、已结束
                // 待确认（待客户结算确认，零工未结算） settleStatus=1，talentConfirmStatus=1
                // 待结算（客户已结算确认，零工未结算） settleStatus=2，talentConfirmStatus=1
                // 已结束（客户已结算确认，零工已结算） settleStatus=2，talentConfirmStatus=2
                if (val.settleStatus == 1 && val.talentConfirmStatus == 1) {
                    return '待确认'
                } else if (val.settleStatus == 2 && val.talentConfirmStatus == 1) {
                    return '待结算'
                } else if (val.settleStatus == 2 && val.talentConfirmStatus == 2) {
                    return '已结束'
                }else{
                    return '无'
                }
            },
            needCheckProcesser(val){
                if(val){
                    if( val.shouldPriceCheck == '1' ){
                        return '待审核';
                    }else if( val.shouldPriceCheck == '2' ){
                        return '无需审核';
                    }
                }
            }
        },
        watch: {
            'formDetail.settlementType': function (val) {
                this.currentPage = 1;
                this.getScheduingList()
            },
            'formDetail.date': function (val) {
                switch (val) {
                    case '4':
                        this.formDetail.endDate = '';
                        this.formDetail.startDate = '';
                        break;
                    default:
                        this.formDetail.endDate = '';
                        this.formDetail.startDate = '';
                        this.currentPage = 1;
                        this.getScheduingList()
                        break;
                }
            }
        },
        mounted() {
            this.getScheduingList()
            console.log(this.formDetail.preDate)
        },
        methods: {
            allForNum(val){
                let yue = 0,ri = 0,zhou = 0;
                let list = [];
                if(val.allNum){
                    if(val.allNum.includes(',')){
                        list = val.allNum.split(',');
                    }else{
                        list.push(val.allNum)
                    }
                    for(let item of list){
                        let arr = item.split('-');
                        if(arr[1] == '1'){//日结
                            ri = arr[0]
                        }else if(arr[1] == '2'){//月结
                            yue = arr[0]
                        }else if(arr[1] == '4'){//周结
                            zhou = arr[0]
                        }
                    }
                }
                return `月: ${yue} 周: ${zhou} 日 ${ri}`
            },
            toExamine(row){
                const { href } = this.$router.resolve({
                    name: "schedulingDetail",
                    query: {
                        id: row.schedulingId,
                        hasPhoto: row.hasPhoto || '',
                        name: row.schedulingName,
                        activeName:'third'
                    }
                });
                window.open(href, "_blank");
            },
            confirmPass(){
                let params = {
                    schedulingId: this.checkObj.schedulingId,
                }
                this.$api.schedulingCheckAction(params).then(res => {
                    let { data:layer1 } = res;
                    let { respCode } = layer1;
                    if( respCode === 0 ){
                        this.$message({
                          message: '审核成功',
                          type: 'success'
                        });
                        this.centerDialogVisible = false;
                        this.getScheduingList();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
            },
            btn_true() {
                console.log(this.formDetail.startDate)
                console.log(this.formDetail.endDate)
                if (!this.formDetail.startDate) {
                    return this.$message.error('开始日期不能为空!')
                }
                if (!this.formDetail.endDate) {
                    return this.$message.error('结束日期不能为空!')
                }
                if (this.formDetail.startDate > this.formDetail.endDate) {
                    return this.$message.error('结束日期要大于开始日期!')
                }
                this.currentPage = 1
                this.getScheduingList();
            },
            getScheduingList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    startDate: this.formDetail.startDate,
                    endDate: this.formDetail.endDate,
                    settlementType: this.formDetail.settlementType //结算类型1日2月4周
                }
                this.$api.SchedulingList(params).then(res => {
                    if (res.respCode == 0) {
                        if (res.data) {
                            this.tableData = res.data.list
                            this.pageCount = res.data.pages
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getScheduingList()
            }
        },
    }
</script>
<style lang="scss">
    
    .no-pro {
        padding: 22px 34px 0;
        
        .formSearchMargin {

            .el-form-item__label, .el-radio__label {
                font-size: 12px;
            }
        }
        
        .no-date {
            display: flex;
            align-items: center;

            .radio-search {

            }

            .no-date-cus {
                display: flex;
                justify-content: start;
                align-items: center;
                padding-left: 40px;

                .no-date-picker {
                    width: 135px;
                }

                .no-pro-btn {
                    padding: 0;
                    background-color: #FFEFEA;
                    color: #E84518;
                    height: 28px;
                    line-height: 28px;
                    width: 72px;
                    margin-left: 12px;
                    border-radius: 0;
                    border: 1px solid #F7BEB2;
                }

                .span- {
                    color: #ACACB5;
                    padding: 0 10px;
                }
            }
        }
    }

    .infoCon {
        height: 50px;
        width: 100%;
        color: #8C8C8C;
        font-size: 12px;
        padding-left: 30px;
        box-sizing: border-box;
        line-height: 50px;
        border-top: 1px solid #E6E7EB;
        border-bottom: 1px solid #E6E7EB;
    }
        .operateIcon {
            width: 13px;
            vertical-align: -5px;
            margin-right: 10px;
        } 
    .infoMark {
        color: #e84518;
    }
    .sche-title {
        text-align: center;
        font-size: 20px;
        font-stretch: normal;
        line-height: 2;
        letter-spacing: 1px;
        color: #262626;
        padding-top: 5px;
        font-weight: bold;
        margin-bottom: 20px;
    }
</style>
<style lang="scss">
    .notProCheckWorkCon {
        .resetDialog {
            .el-dialog {
                margin: auto !important;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                position: absolute;
                height: 190px;
            }
        }
    }    
</style>