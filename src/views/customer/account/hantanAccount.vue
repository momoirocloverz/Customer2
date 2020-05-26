<template>
    <div style="background-color:#f2f2f5;" class="audit-pass">
        <el-form label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;padding-bottom: 15px">
            <div class="pt20">
                <span class="pr30 f14">账户余额: <strong class="co-orange-new f18">{{xfdAccountTotal}}</strong>元</span>
                <el-button size="medium" type="primary" class="charge-btn" @click="handleRecharge">充值
                </el-button>
            </div>
        </el-form>
        <el-tabs v-model="activeName" class="activeTab">
            <el-tab-pane label="明细账单" name="1"></el-tab-pane>
            <el-tab-pane label="按日汇总" name="2"></el-tab-pane>
        </el-tabs>
        <hantan-detail v-if="activeName == '1'" @showTotal="getTotal"></hantan-detail>
        <hantan-collect v-if="activeName == '2'"></hantan-collect>
        <el-dialog title="充值" :visible.sync="chargeVisible" width="540px"
                   class="chargeForm resetInnerCon base-dialog" style="text-align: left;">
            <el-form label-width="150px" ref="chargeForm">
                <div class="f14 pb20 pl30">请向以下网商银行账户转账：</div>
                <el-form-item label="银行：" class="resetFormItem">
                    <span>{{chargeInfo.bankName}}</span>
                </el-form-item>
                <el-form-item label="户名：" class="resetFormItem">
                    <span>{{chargeInfo.accountName}}</span>
                </el-form-item>
                <el-form-item label="账号：" class="resetFormItem">
                    <span>{{chargeInfo.accountNo}}</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align: right;">
                <el-button type="primary" @click="chargeVisible = false">关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import hantanDetail from './component/hantanDetail'
    import hantanCollect from './component/hantanCollect'
    export default {
        components:{hantanDetail,hantanCollect},
        data() {
            return {
                xfdAccountTotal:0,
                activeName:'1',
                chargeVisible:false,
                accountInfo: {},
                chargeInfo:{}
            }
        },
        mounted(){
          this.getCharge()
        },
        methods: {
            getTotal(val){
                this.xfdAccountTotal = val.xfdAccountTotal;
            },
            handleRecharge() {
                this.chargeVisible = true;
            },
            async getCharge(){
                 const {data} = await this.$api.htOrdersCharge();
                 this.chargeInfo = data;
                console.log(data);
            }
        },
    }
</script>
<style lang="scss">
    .audit-pass{
        .charge-btn{
            font-size: 12px;
            background-color: #ffefea !important;
            border: 1px solid #f7beb2;
            color:#e9481c;
        }
        .operateCon {
            display: flex;
            flex-direction: row;
            flex-wrap: nowrap;
            justify-content: space-around;
            align-content: center;
            align-items: center;
            .subItem{
                img,span{
                    display: inline-block;
                    vertical-align: middle;
                }
                img{
                    width: 13px;
                    height:15px;
                    margin-right:3px;
                }
            }
        }
        .el-table .cell{
            padding-left: 5px;
            .el-button{
                padding: 10px 15px;
            }
            .el-button + .el-button{
                margin-left:5px;
            }
        }
        .formSearchMargin {
            margin-bottom: 0;
            .el-radio-group{
                height: 32px;
            }
        }
        .datesearchBtn {
            margin-left: 15px;
        }
        .fontsizecolor {
            color: #e84518;
        }
        .elRadio {
            padding-bottom: 15px;
            margin-left: 0px;
        }
        .searchBtn {
            width: 100px;
            height: 34px;
            margin-left: 15px;
        }
        .inputWidth {
            width: 520px;
            /* margin-right: 15px; */
        }
        .showHeight {
            height: 50px;
            overflow: hidden;
        }
    }
</style>


