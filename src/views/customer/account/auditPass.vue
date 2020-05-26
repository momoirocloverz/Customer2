<template>
    <div style="background-color:#f2f2f5;" class="audit-pass">
        <el-form label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;padding-bottom: 15px">
            <div class="pt20">
                <span class="pr30 f14">账户余额: <strong class="co-orange-new f18">{{xfdAccountTotal}}</strong>元</span>
                <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routerTo()">查看账户详情</el-button>
            </div>
        </el-form>
        <el-tabs v-model="activeName" class="activeTab">
            <el-tab-pane label="明细账单" name="1"></el-tab-pane>
            <el-tab-pane label="按日汇总" name="2"></el-tab-pane>
        </el-tabs>
        <xfd-detail v-if="activeName == '1'" @showTotal="getTotal"></xfd-detail>
        <xfd-collect v-if="activeName == '2'"></xfd-collect>
    </div>
</template>
<script>
    import xfdDetail from './component/xfdDetail'
    import xfdCollect from './component/xfdCollect'
    export default {
        components:{xfdDetail,xfdCollect},
        data() {
            return {
                xfdAccountTotal:0,
                activeName:'1'
            }
        },
        methods: {
            getTotal(val){
                this.xfdAccountTotal = val.xfdAccountTotal;
            },
            routerTo() {
                const {href} = this.$router.resolve({
                    path: 'xfdAccountDetail',
                });
                window.open(href, '_blank')
            },
        },
    }
</script>
<style lang="scss">
    .audit-pass{
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


