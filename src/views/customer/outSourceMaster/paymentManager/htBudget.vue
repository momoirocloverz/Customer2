<template>
    <div class="xfd-budget" v-loading="request" element-loading-text="正在生成订单中...">
        <div class="table-box back-white">
            <div class="exportContainer pt20 pb10">
                <div class="exportLeftCon">
                    <span class="pr30">
                        薪企云服账户余额
                        <span class="co-orange-new">{{fromParams.htMoney | toFixeFortter2}}</span>元</span>
                    <span class="pl30">管理费可用余额：<span class="co-orange-new">{{accountAmount | toFixeFortter2}}</span>元（用于支付信息服务费）</span>
                </div>
            </div>
            <div class="exportContainer pt10 pb20">
                <div class="exportLeftCon pr30">
                    <el-button class="f14" type="primary" :disabled="disabled" plain @click="refresh()">生成订单</el-button>
                    <span class="pl20 f14 pr30">如零工实际到账金额为负，生成订单时将自动排除</span>
                </div>
                <div class="pl30 exportLeftCon f14">
                    <span class="pr20 pl30">付款手续费是否从零工收入中扣除:</span>
                    <span class="pt5 block-inline">
                        <el-radio v-model="radio" label="0">是</el-radio>
                        <el-radio v-model="radio" label="1">否</el-radio>
                    </span>
                </div>
            </div>
            <div class="pl30 pr25 pb10 f14">
                <div class="lh25 co-333">
                    可发放合计：{{fromParams.talentPay}}人，付款手续费{{fromParams.allPayFee | toFixeFortter2}}元，信息服务费{{fromParams.serviceFee | toFixeFortter2}}元；实发金额{{fromParams.allShouldPay | toFixeFortter2}}元
                </div>
            </div>
            <el-table class="table-outline" :data="tableData"
                      emptyText="暂无相关信息"
                      :row-class-name="getRowClassName"
                      style="width: 100%;">
                <el-table-column label="序号" prop="">
                    <template v-slot="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="姓名" prop="talentName"></el-table-column>
                <el-table-column label="付款手续费(元)" :formatter="_number" prop="payFee"></el-table-column>
                <el-table-column label="信息服务费(元)" :formatter="_number" prop="serviceFee"></el-table-column>
                <el-table-column label="实发金额(元)" :formatter="_number" prop="shouldPay"></el-table-column>
                <el-table-column label="状态" prop="note"></el-table-column>
            </el-table>
            <!--<div class="pagination-container">-->
            <!--<el-pagination class="pagebox" layout="prev, pager, next" @current-change="handleCurrentChange"-->
            <!--:current-page="currentPage" :page-count="pageCount">-->
            <!--</el-pagination>-->
            <!--</div>-->
        </div>
    </div>
</template>
<script>
    import {mapState, mapGetters, mapMutations} from 'vuex';
    import moment from 'moment';

    export default {
        components: {},
        data() {
            return {
                currentPage:1,
                pageSize:20,
                pageCount:1,
                charge: 0,
                payTime: '',
                tableData: [],
                fromParams: {},
                currentTime: 0,
                payAmount: 0,
                accountAmount: 0,
                radio: '0',
                request: false,
            }
        },
        computed: {
            ...mapGetters(['xfdManagerParams']),
            disabled(){
                if(this.tableData.every(i=> i.noteStatus == 1)){
                    return true
                }else{
                    return false
                }
            }
        },
        watch:{
            'radio':function (val,oldVal) {
                if(val == '0'){
                    this.tableData = JSON.parse(this.fromParams.htPreGenerateVOS);
                }else{
                    this.tableData = this.tableData.map((i)=>{
                        i.shouldPay = i.shouldPay + i.payFee;
                        // if(i.shouldPay <= 0 && i.noteStatus == 0){
                        //     i.noteStatus = 1;
                        //     i.note = '不可发放(实发金额≤0元)'
                        // }
                        return i = Object.assign({},i)
                    })
                }
            }  
        },
        filters: {
            toFixeFortter(val) {
                if (val) {
                    return Number(val).toFixed(0)
                } else {
                    return 0
                }
            },
            toFixeFortter2(val) {
                if (val) {
                    return Number(val).toFixed(2)
                } else {
                    return 0
                }
            }
        },
        mounted() {
            this.fromParams = this.$route.query;
            this.tableData = JSON.parse(this.fromParams.htPreGenerateVOS) || [];
            console.log(this.tableData)
            this.accountDetail()
        },
        methods: {
            ...mapMutations(['XFD_MANAGER_PARAMS']),
            _number(row, column, cellValue) {
                if (cellValue) {
                    return cellValue.toFixed(2)
                } else {
                    return 0
                }
            },
            getRowClassName({row, column, rowIndex, columnIndex}) {
                if (row.noteStatus == 1 || row.shouldPay <= 0) {
                    return 'cg-disable-select'
                } else {
                    return ' '
                }
            },
            refresh() {
                let _this = this;
                if (_this.request) {
                    return
                }
                _this.request = true;
                _this.xfdManagerParams.ifTalentPay = _this.radio;
                _this.$api.generateOrder(_this.xfdManagerParams).then(res => {
                    if (res.data.respCode == 0) {
                        let {accountStatus, oldOrder, htOrderDetailDOS, htMoney, htOrderDO,financePhone} = res.data.data;
                        if (oldOrder == 1) { // 是否有订单（1是  其他否
                            _this.$confirm(`您有订单已生成待付款, 请先处理该订单。`, `提示`, {
                                confirmButtonText: '查看付款订单',
                                cancelButtonText: '暂不处理',
                            }).then((action) => {
                                _this.toWait()
                            }).catch(() => {

                            });
                        } else {
                            _this.XFD_MANAGER_PARAMS(_this.xfdManagerParams)
                            _this.$router.push({
                                path: 'htOrder',
                                query: {
                                    htMoney,
                                    financePhone,
                                    htOrderDetailDOS: JSON.stringify(htOrderDetailDOS),
                                    htOrderDO: JSON.stringify(htOrderDO),
                                }
                            });
                        }
                    }
                }).catch(err=>{
                    console.log(err);
                }).finally(()=>{
                    setTimeout(()=>{
                        _this.request = false
                    },500)
                })
            },
            toWait(){
                this.$router.push({
                    path: 'htOrder',
                    query: {isWait:true}
                });
            },
            handleCurrentChange(val){
                this.currentPage = val;
            },
            accountDetail() {
                let _this = this;
                this.$api.accountDetail({}).then(res => {
                    _this.accountAmount = res.data.data.wsBalance || 0;
                }).catch(err => {
                    console.log(err);
                })
            },
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = '' //1:待确认 2:待支付 3:支付成功 4:发放完成 5:已取消 6:处理出错
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = '待确认'
                        break
                    case 2:
                        status = '待支付'
                        break
                    case 3:
                        status = '支付成功'
                        break
                    case 4:
                        status = '发放完成'
                        break
                    case 5:
                        status = '已取消'
                        break;
                    case 6:
                        status = '处理出错'
                        break
                    default:
                        status = '--'
                        break
                }
                return status
            },
            getCurrentTime() {
                let _this = this;
                this.$api.getCurrentTime().then(res => {
                    console.log(res)
                    if (res.respCode == 0) {
                        _this.payTime = res.data  // 时间戳
                        _this.currentTime = res.data  // 时间戳
                    }
                })
            },
        },
    }
</script>
<style lang="scss">
    .co-orange {
        cursor: pointer;
    }

    .xfd-budget {
        .add-no-select {
            cursor: not-allowed;
            pointer-events: none;

            .cell .el-checkbox .el-checkbox__inner {
                background-color: #edf2fc;
            }
        }
        .cg-disable-select {
            color: #C8CACC;
        }
        .font-weight {
            .el-form-item__label {
                font-weight: 600;
            }
        }

        .cg-disable-select {
            color: #C8CACC;
        }

        .import-btn-wrap {
            display: flex;

            .cus-input {
                width: 280px;
                border: 1px solid #EAEDF4;
                margin-right: 18px;
            }
        }

        .subItem {
            img, span {
                display: inline-block;
                vertical-align: middle;
                color: #5C5C5C;
            }

            img {
                width: 13px;
                height: 15px;
                margin-right: 3px;
            }
        }

        .selectStatus {
            color: #4C4C4C;
            font-size: 12px;
            margin-left: 25px;
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
            margin-bottom: 10px;
        }

        .operateCon {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            align-content: center;
            align-items: center;
        }

        .subItem {
            cursor: pointer;
        }

        .cusHeader {
            vertical-align: 1px;
        }

        .questionMark {
            color: #E94A1E;
            font-size: 18px;
            cursor: pointer;
        }

        .exportContainer {
            display: flex;
            flex-direction: row;
            flex-wrap: wrap;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            padding-left: 30px;
            padding-right: 22px;
            box-sizing: border-box;

            .exportLeftCon {
                display: flex;
                flex-direction: row;
                flex-wrap: wrap;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
            }

            .exportRightCon {

            }
        }

        .el-button--small {
            font-size: 12px;
            background-color: #ffefea;
            border: 1px solid #f7beb2;
            color: #e9481c;
        }

        .wait-replace-dialog .el-dialog__header {
            border-bottom: none;
        }

        .el-dialog__footer {
            padding-bottom: 10px !important;
        }

        .el-button.is-disabled {
            color: #C0C4CC;
            cursor: not-allowed;
            background-color: #FFFFFF;
            border-color: #EBEEF5;
        }

        .el-table .cell {
            text-align: center;
        }

        .sche-title {
            text-align: center;
            font-size: 20px;
            font-stretch: normal;
            line-height: 2;
            letter-spacing: 1px;
            color: #262626;
            padding-top: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .importBtnCon {
            position: relative;

            input {
                width: 80px;
                height: 30px;
                position: absolute;
                left: 0;
                top: 0;
                opacity: 0;
                cursor: pointer;
            }

            .el-button {
                height: 30px;
                line-height: 11px;
            }
        }

        .centerDialog {
            .el-dialog {
                width: 640px;
            }

            .el-dialog__header {
                border-bottom: none;
            }

            .importCustomItemCon {
                margin: auto;
            }

            .controlContainer {
                .el-form-item {
                    margin-bottom: 10px;
                }

                .controlText {
                    padding-top: 24px;
                    color: #9D9DA2;
                }
            }

            .paddingSpecial {
                padding-left: 130px;
            }

            .centerCancel {
                width: 90px !important;
            }

            .centerConfirm {
                width: 110px !important;
            }
        }

        .finalPaymentDialog {
            .el-dialog__header {
                border-bottom: none;
            }

            .el-input__inner {
                height: 30px;
                width: 280px;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }

            .el-dialog__body {
                padding-top: 20px !important;
                padding-bottom: 20px !important;
            }
        }

        .addressDialog {
            .el-dialog {
                width: 740px !important;
                height: 354px !important;
            }

            .el-input__inner {
                height: 30px;
            }

            .el-dialog__body {
                padding: 30px 120px !important;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }
        }

        .newDialog {
            .el-dialog {
                width: 740px !important;
                height: 520px !important;
            }

            .el-dialog__body {
                padding-top: 40px !important;
                padding-left: 120px !important;
                padding-right: 120px !important;
                padding-bottom: 45px !important;
            }

            .el-input__inner {
                height: 30px;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }
        }

        .copyCenterDialog {
            .el-input__inner {
                height: 30px;
                line-height: 30px;
            }

            .dialog-footer {
                .el-button {
                    width: 90px;
                }
            }

            .billControlContainer {
                height: 340px;
            }

            .el-dialog__body {
                padding-top: 40px;
            }

            .controlContainer {
                width: 540px;
                margin: 0 auto;
                box-sizing: border-box;

                .el-button {
                    height: 30px;
                    width: 90px;
                }
            }

            .el-dialog {
                width: 740px !important;
                height: 520px !important;
            }


            .el-button.is-disabled {
                color: #C0C4CC;
                cursor: not-allowed;
                background-color: #FFFFFF;
                border-color: #EBEEF5;
            }

            .el-table .cell {
                text-align: center;
            }

            .centerDialog {
                .el-dialog__header {
                    border-bottom: none;
                }

                .el-dialog {
                    position: absolute;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    top: 0;
                    margin: auto !important;
                    width: 600px;
                    height: 210px;
                }

            }

        }

        .el-dialog-2 .el-dialog__footer {
            padding-bottom: 10px !important;
        }

        .el-dialog-2 .el-input .el-input__inner {
            height: 32px !important;
        }

    }
</style>
