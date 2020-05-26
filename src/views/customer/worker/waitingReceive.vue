<template>
    <div class="back-white waitingReceive">
            <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入零工姓名搜索">
                <el-form ref="form" :model="form" label-width="110px" label-position="left" class="woker-list">
                    <el-form-item label="性别：">
                        <el-radio-group class="radio-search pt8" v-model="form.sex" @change="genderChange">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="1">男</el-radio>
                            <el-radio label="2">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="班务经理：">
                        <el-radio-group class="radio-search pt8" v-model="form.managerName" @change="managerChange">
                            <el-radio class="mb5" label="">不限</el-radio>
                            <div>
                                <el-radio class="mb5" :label="item.nameAlias" v-for="(item,index) in managerList" :key="index">
                                    {{item.nameAlias}}
                                </el-radio>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </search-bar>
            <div class="back-white btn-div flexable">
<!--                <el-button class="primary-btn" size="mini" @click="addGeneralWorker">批量编辑</el-button>-->
                <el-button class="primary-btn" :disabled="!selectArr.length" size="mini" @click="batchAgreement">批量同意</el-button>
            </div>
            <div class="table-box back-white">
                <el-table :data="tableData" empty-text="暂无相关零工信息" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column label="姓名" prop="realNameAlias" show-overflow-tooltip align="center"></el-table-column>
                    <el-table-column label="性別" prop="sex" :formatter="sexFormatter" show-overflow-tooltip  align="center" ></el-table-column>
                    <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip align="center"
                                     ></el-table-column>
                    <el-table-column label="手机号" prop="mobile" show-overflow-tooltip align="center"
                                     ></el-table-column>
                    <el-table-column label="班务经理" prop="ownManager" show-overflow-tooltip align="center"></el-table-column> 
                    <el-table-column label="操作" align="center" width="280">
                        <template v-slot="scope">
                            <div class="btnCon">
                                <el-button type="text" class="btn-icon btn-icon-edit" size="mini"
                                           @click="agreeItem(scope.row)">同意
                                </el-button>
                                <el-button type="text" class="btn-icon btn-icon-stop" size="mini"
                                           @click="deleteItem(scope.row)">删除
                                </el-button>
                                <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                                       @click="routeToDetail(scope.row)">查看
                            </el-button>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="pagination-container" v-if="total">
                    <el-pagination class="mypagination" @current-change="handleCurrentChange"
                                   :current-page="currentPage" :page-size="pageSize"
                                   layout="total , prev, pager, next, jumper" :total="total">
                    </el-pagination>
                </div>
            </div>
                <el-dialog title="同意以下零工转为可用" :visible.sync="transferShow" class="singleAgreeDialog">
                    <div class="overflow-box">
                        <el-form label-width="184px" label-position="right" ref="singleForm" :model="singleForm" >
                            <el-form-item label="零工姓名：" class=" inpWidth">
                                <span class="info">{{rowObj.realNameAlias}}</span>
                            </el-form-item>
                            <el-form-item label="零工身份证号：" class="inpWidth">
                                <span class="info">{{rowObj.idCard}}</span>
                            </el-form-item>
                        </el-form>
                        <el-form label-width="184px" label-position="right">
                            <el-form-item label="结算方式："  class="inpWidth woker-list">
                                <el-radio-group v-model="singleForm.settleType">
                                    <el-radio :label=2>月结</el-radio>
                                    <el-radio :label=4>周结</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="是否外包：" class="inpWidth woker-list">
                                <el-radio-group v-model="singleForm.outsourceType">
<!--                                    <el-radio :label=1>外包</el-radio>-->
                                    <el-radio :label=2>代发收入</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="medium"  class="setWidth" @click="transferShow = false">取 消</el-button>
                        <el-button size="medium" class="setWidth" type="primary" @click="confirmSingleTrans">确 认</el-button>
                    </span>
                </el-dialog>
                <el-dialog title="删除" :visible.sync="deleteShow" class="deleteDialog">
                    <div class="overflow-box">确认删除</div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="medium" class="setWidth" @click="deleteShow = false">取 消</el-button>
                        <el-button size="medium" class="setWidth" type="primary" @click="confirmSingleDelete">确 认</el-button>
                    </span>
                </el-dialog>

                 <el-dialog title="同意选中的零工为可用零工" :visible.sync="multipleTransferShow" class="multipleAgreeDialog">
                    <div class="overflow-box">
                        <el-form label-width="184px" label-position="right" ref="multipleForm" :model="multipleForm">
                            <el-form-item label="结算方式："  class="inpWidth woker-list">
                                <el-radio-group v-model="multipleForm.settleType" >
                                    <el-radio :label=2>月结</el-radio>
                                    <el-radio :label=4>周结</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="是否外包：" class="inpWidth woker-list">
                                <el-radio-group v-model="multipleForm.outsourceType" >
<!--                                    <el-radio :label=1>外包</el-radio>-->
                                    <el-radio :label=2>代发收入</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-form>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button size="medium"  class="setWidth" @click="multipleTransferShow = false">取 消</el-button>
                        <el-button size="medium" class="setWidth" type="primary" @click="confirmMultipleTrans">确 认</el-button>
                    </span>
                </el-dialog>
    </div>
</template>
<script>
    import SearchBar from '@/components/SearchBar'
    export default {
        name: "WorkerReceive",
        components: {
            SearchBar
        },
        data() {          
            return {    
                deleteShow:false,
                tableData: [],
                total: 0,
                currentPage: 1,                
                pageSize: 10,
                form: {
                    sex: "",
                    managerName:'',
                    keyWord: "",
                },   
                managerList: [],
                selectArr:[],
                transferShow:false,
                multipleTransferShow:false,
                rowObj:{},
                singleForm:{
                    settleType:2,
                    outsourceType:2,
                },
                multipleForm:{
                    settleType:2,
                    outsourceType:2,
                },
                customerId:'',
                requestAble1:true,
            }
        },
        mounted() {
            this.getManager();
            this.getList();
        },
        methods: {  
            confirmMultipleTrans(){
                let recommendIdArr =  [];
                let talentIdArr =  [];
                let recommendIdStr = '';
                let talentIdStr =  '';
                recommendIdArr = this.selectArr.map((ele,index)=>{
                    return ele.recommendId;
                });
                talentIdArr = this.selectArr.map((ele,index)=>{
                    return ele.talentId;
                });
                recommendIdStr = recommendIdArr.join(',');
                talentIdStr = talentIdArr.join(',');                
                let params = {
                    settlementType:this.multipleForm.settleType,
                    payType:this.multipleForm.outsourceType,
                    status:1,
                    customerId:this.customerId,
                    recommendIds:recommendIdStr,
                    talentIds:talentIdStr,
                };
                this.$api.switchEmpStatus(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        this.multipleTransferShow = false;
                        this.$message({
                          message: '批量同意操作成功',
                          type: 'success'
                        });
                        this.getList();
                    }
                }).catch(err=>{
                   console.log( 'err',err ); 
                });
            },
            handleSelectionChange(val){
                this.selectArr = val;
            },
            getList(){
                let params = {
                    pageSize:this.pageSize,
                    pageNum:this.currentPage,
                    sex:this.form.sex,
                    managerName: this.form.managerName,
                    talentName:this.form.keyWord,
                };
                this.$api.waitReceiveEmp(params).then(res=>{
                    let { respCode,data } = res;
                    if( respCode === 0 ){
                        this.tableData = data.list ? data.list : [];
                        this.total = data.total;
                    }
                }).catch(err=>{
                   console.log('err',err); 
                });
            },
            genderChange(){
                this.currentPage = 1;
                this.getList();
            },
            managerChange(){
                this.currentPage = 1;
                this.getList();
            },
            getManager(){
                this.customerId = JSON.parse(localStorage.userInfo).customerId || '';
                let params = {
                    customerId:this.customerId
                }   
                this.$api.classManagerList(params).then(res => {
                    let { respCode,data } = res;
                    if(  respCode === 0  ){
                        this.managerList = data;
                    }
                }).catch(error => {
                    console.log(error);
                });  
            },
//            addGeneralWorker() {               
//            },
            handleSearch(keyword) {
                this.currentPage = 1;
                this.form.keyWord = keyword;
                this.getList()
            },
            sexFormatter(row, column, cellValue, index) {
                let status = "男";
                switch (Number(cellValue)) {
                    case 1:
                        status = "男";
                        break;
                    case 2:
                        status = "女";
                        break;
                }
                return status;
            },
            settlementTypeFormatter(row, column, cellValue, index) {
                let status = "";
                switch (Number(cellValue)) {
                    case 1:
                        status = "日结";
                        break;
                    case 2:
                        status = "月结";
                        break;
                    case 3:
                        status = "实时结";
                        break;
                    case 4:
                        status = "周结";
                        break;
                }
                return status;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.getList();
            },
            batchAgreement() {
                this.multipleTransferShow = true;
            },
            agreeAction(row){
                let params = {
                    settlementType:this.singleForm.settleType,
                    payType:this.singleForm.outsourceType,
                    status:1,
                    customerId:this.customerId,
                    recommendIds:row.recommendId,
                    talentIds:row.talentId,
                };                
                if( this.requestAble1 ){
                    this.requestAble1 = false;
                    this.$api.switchEmpStatus(params).then(res=>{
                        let { data:layer1 } = res;
                        let { respCode,data ,errorMsg} = layer1;
                        console.log( respCode,data,errorMsg);
                        if( respCode === 0 ){
                            this.transferShow = false;
                            this.$message({
                              message: '同意操作成功',
                              type: 'success'
                            });
                            this.getList();
                        }else{
                            this.$message.error(errorMsg);
                        }
                    }).catch(err=>{
                       console.log( 'err',err ); 
                    }).finally(()=>{
                        setTimeout(()=>{
                            this.requestAble1 = true;
                        },2000)
                    });
                }
            },
            confirmSingleDelete(){
                this.deleteAction(this.rowObj);
            },
            confirmSingleTrans(){
                this.agreeAction(this.rowObj);
            },
            agreeItem(row) {
                this.transferShow = true;
                this.rowObj = {
                    recommendId:row.recommendId,
                    realNameAlias:row.realNameAlias,
                    idCard:row.idCard,
                    talentId:row.talentId,
                };   
            },
            deleteAction(row){
                let params = {
                    recommendIds:row.recommendId,
                    status:2,
                    talentIds:row.talentId,
                };
                this.$api.switchEmpStatus(params).then(res=>{
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        this.deleteShow = false;
                        this.$message({
                          message: '变更成功',
                          type: 'success'
                        });
                        this.getList();
                    }
                }).catch(err=>{
                    console.log( 'err',err ); 
                });
            },
            deleteItem(row) {    
                this.deleteShow = true;
                this.rowObj = {
                    recommendId:row.recommendId,
                    talentId:row.talentId,
                };
            },
            routeToDetail(row) {                
                const {href} = this.$router.resolve({
                    path: "/worker/WorkerDetailSp",
                    query: {
                        talentId: row.talentId
                    }
                });
                window.open(href, "_blank");
            },
        }
    };
</script>
<style scoped lang="scss">
    .waitingReceive {
        .primary-btn {
            min-width: 96px;
            width: auto;
        }
        .radio-search {
            align-items: start;
        }
        .btnCon {
            display: flex;
            justify-content: space-around;
            align-content: center;
            align-items: center;
        }
        .setWidth {
            width: 112px;
        }
    }
</style>
<style lang="scss">
    .waitingReceive {
        .el-table .cell {
            text-align: center;
            padding-left: 10px;
        }
        .btnCon {
            .el-button + .el-button {
                margin-left: 0;
            }
        }
        .el-dialog {
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto !important;
        }
        .deleteDialog {
            .el-dialog {
                width: 400px;
                height: 195px;
            }
            .el-dialog__header {
                box-sizing: border-box;
                border-bottom: 1px solid #EAEDF4;
            }
        }
        .singleAgreeDialog {
            .el-dialog {
                width: 740px;
                height: 390px;
            }
            .el-dialog__header {
                box-sizing: border-box;
                border-bottom: 1px solid #EAEDF4;
            }
        }
        .multipleAgreeDialog {
            .el-dialog {
                width: 740px;
                height: 280px;
            }
            .el-dialog__header {
                box-sizing: border-box;
                border-bottom: 1px solid #EAEDF4;
            }
        }
    }
</style>