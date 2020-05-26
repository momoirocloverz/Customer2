<template>
    <div class="bind-cus-list">
        <el-form ref="searchForm" :model="searchForm" label-width="100px" labelPosition="left" class="searchThisForm">
            <div class="search-zone">
                <el-input class="searchMaster" clearable placeholder="输入经理人简称搜索" prefix-icon="el-icon-search"
                          v-model="searchForm.taskName"></el-input>
                <div class="charge-btn" @click="searchNow">搜索</div>

                <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i
                        class="el-icon-right el-icon-d-arrow-right"
                        :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                </el-button>
            </div>
            <transition name="router-fade" mode="out-in">
                <div class="combine-zone pt10 pb10" v-if="isShowComb">
                    <el-form-item label="绑定状态：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="searchForm.bindStatus">
                            <el-radio label="">不限</el-radio>
                            <el-radio label='1'>绑定中</el-radio>
                            <el-radio label="2">待对方同意解绑</el-radio>
                            <el-radio label="3">待我同意解绑</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </transition>
        </el-form>
        <div class="table-box back-white">
            <div class="back-white btn-div flexable">
                <el-button class="primary-btn" size="mini" @click="getCode()">获取绑定验证码</el-button>
                <el-button class="primary-btn" size="mini" @click="putCode()">输入绑定验证码</el-button>
            </div>
            <el-table :data="tableData" empty-text="暂无相关信息">
                <el-table-column label="经理人简称" align="center" prop="partnerShortName" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="经理人全称" align="center" prop="partnerName" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="联系人号码" align="center" prop="partnerPhone" show-overflow-tooltip
                                 min-width="130"></el-table-column>
                <el-table-column label="最近绑定时间" align="center" prop="bindingTime" :formatter="timeFormatter"
                                 show-overflow-tooltip min-width="130"></el-table-column>
                <el-table-column label="绑定状态" align="center" prop="status" :formatter="settlementTypeFormatter"
                                 show-overflow-tooltip></el-table-column>
                <el-table-column label="操作" align="center" min-width="160">
                    <template v-slot="scope">
                        <el-button v-if="scope.row.status == 1" @click="one(scope.row)" type="text">解绑</el-button>
                        <el-button v-if="scope.row.status == 2" @click="two(scope.row)" type="text">取消解绑</el-button>
                        <el-button v-if="scope.row.status == 3" @click="thr(scope.row)" type="text">同意解绑</el-button>
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
        <el-dialog
                title="绑定验证码"
                :visible.sync="showBindLog"
                width="30%"
                center>
            <div style="width:100%;text-align:center">
                验证码:{{codeMa}}<br/>
                (验证码30分钟内有效)
            </div>
            <div>绑定步骤:<br/>
                1.将此验证码告知需绑定的经理人；<br/>
                2.经理人登录经理人端，进入"经理人列表"页面，点击【输入验证码】按钮；<br/>
                3.输入此验证码并提交进行绑定；
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="showBindLog = false">确 定</el-button>
  </span>
        </el-dialog>
        <el-dialog title="请输入绑定验证码" :visible.sync="dialogVisible" width="540px" class="resetDialog"
                   :before-close="close">
            <div class="code-panel" @click="handleClick">
                <input class="code-input" type="text" maxlength="6" v-model="code" ref="code-input" @keyup="codeValite">
                <div class="code-item" :class="{'active-code': code.length==0}">{{code[0]==undefined?'':code[0]}}</div>
                <div class="code-item" :class="{'active-code': code.length==1}">{{code[1]==undefined?'':code[1]}}</div>
                <div class="code-item" :class="{'active-code': code.length==2}">{{code[2]==undefined?'':code[2]}}</div>
                <div class="code-item" :class="{'active-code': code.length==3}">{{code[3]==undefined?'':code[3]}}</div>
                <div class="code-item" :class="{'active-code': code.length==4}">{{code[4]==undefined?'':code[4]}}</div>
                <div class="code-item" :class="{'active-code': code.length==5 && !code[5]}">{{code[5]==undefined?'':code[5]}}</div>
            </div>
            <div class="middleText pt20">确认成功后您与该经理人将绑定</div>
            <span slot="footer" class="dialog-footer">
                <el-button class="resetBtnSp" @click="close">取消</el-button>
                <el-button type="primary" @click="confimCode()">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';

    export default {
        data() {
            return {
                isShowComb: false,
                dialogVisible: false,
                showBindLog: false,
                searchForm: {
                    bindStatus: '',
                    taskName: '',
                },
                code: '',
                codeMa: '',
                belongtoList: [],
                tableData: [],
                total: 0,
                currentPage: 1,
                pageSize: 20,
                pickIcon: require('@/assets/icons/pick.png'),
                viewIcon: require('@/assets/icons/view.png'),
            }
        },
        watch: {
            "searchForm.bindStatus": function (val, oldval) {
                this.unitRequest();
            },
            // code(val, old) {
            //     if (String(val).length >= 6) {
            //         this.$refs["code-input"].blur()
            //     }
            // }
        },
        mounted() {
            this.fetchList();
        },
        methods: {
            close() {
                this.dialogVisible = false;
                this.code = ''
            },
            getCode() {
                this.$api.getBindingCode({}).then(res=>{
                    if(res.data){
                        this.codeMa = res.data;
                        this.showBindLog = true;
                    }
                })
            },
            codeValite(){
                this.code = this.code.replace(/[^\d]/g,'')
            },
            putCode() {
                let _this = this;
                this.dialogVisible = true;
                setTimeout(() => {
                    _this.$refs["code-input"].focus()
                })

            },
            confimCode() {
                let _this = this;
                if(!this.code){
                    return this.$message.warning('请填写6位绑定验证码!')
                }
                if(this.code.length != 6){
                    return this.$message.warning('请输入正确的验证码!')
                }
                if(this.request){return}
                this.request = true;
                let parmas = {
                    code:this.code
                }
                this.$api.bindingCustomer(parmas).then(res=>{
                    if(res.data.respCode == 0){
                        this.fetchList()
                        this.$message.success('绑定成功!');
                        this.dialogVisible = false;
                        this.code = '';
                    }
                }).catch(err=>{
                    console.log(err)
                }).finally(()=>{
                    setTimeout(()=>{
                        _this.request = false;
                    },500)
                })
            },
            handleClick() {
                this.$refs["code-input"].focus()
            },
            fetchList() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    status: this.searchForm.bindStatus,
                    partnerShortName: this.searchForm.taskName,
                };
                this.$api.bindingList(params).then(res => {
                    console.log(res)
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
            handleCombShow() {
                this.isShowComb = !this.isShowComb;
            },
            handleCurrentChange(val) {
                this.currentPage = val;
                this.fetchList();
            },
            routeToDetail(row) {
                const {href} = this.$router.resolve({
                    name: "viewCompanyInfo",
                    query: {
                        id: row.partnerId,
                    }
                });
                window.open(href, "_blank");
            },
            one(row) {
                console.log(row);
                let params = {
                    customerPartnerId:row.id
                }
                this.$confirm(`确认要与经理人${row.partnerShortName}解绑? \n 确认后需要对方点击同意才算解绑完成`, `提示`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then((action) => {
                    this.$api.openUnbinding(params).then(res=>{
                        let {data: result} = res;
                        let {data, respCode} = result;
                        if (respCode === 0) {
                            this.fetchList()
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(() => {

                });
            },
            two(row){
                let params = {
                    customerPartnerId:row.id
                }
                this.$confirm(`确认取消与经理人${row.partnerShortName}的解绑?`, `提示`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then((action) => {
                    this.$api.confirmUnbinding(params).then(res=>{
                        let {data: result} = res;
                        let {data, respCode} = result;
                        if (respCode === 0) {
                            this.fetchList()
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(() => {

                });
            },
            thr(row){
                let params = {
                    customerPartnerId:row.id
                }
                this.$confirm(`确认同意经理人${row.partnerShortName}的解绑要求? \n 确认后您与该经理人将解绑`, `提示`, {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                }).then((action) => {
                    this.$api.openAgreeUnbinding(params).then(res=>{
                        let {data: result} = res;
                        let {data, respCode} = result;
                        if (respCode === 0) {
                            this.fetchList()
                        }
                    }).catch(err=>{
                        console.log(err)
                    })
                }).catch(() => {

                });
            }
        },
    }
</script>
<style lang="scss">
    .bind-cus-list {
        background-color: #fff;

        .code-panel {
            position: relative;
            display: flex;
            justify-content: center;
            margin: auto;
        }

        .code-input {
            position: absolute;
            width: 100%;
            height: 100%;
            text-indent: -999em;
            margin-left: -100%;
            background-color: transparent;
            opacity: 0;
            z-index: 20;
        }

        .code-item {
            position: relative;
            box-sizing: border-box;
            width: 41px;
            height: 54px;
            font-size: 24px;
            line-height: 54px;
            text-align: center;
            color: #4b4d52;
            border-radius: 2px;
            background-color: #fff;
            margin-right: 20px;
            border: 1px solid #DCDEE0;
        }
        .active-code::after {
            position: absolute;
            content: "";
            display: block;
            width: 1px;
            height: 30px;
            background-color: #4d4d4d;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }
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