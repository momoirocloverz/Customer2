<template>
    <div class="add-worker">
        <div class="add-title">添加零工</div>
        <div class="content">
            <div class="c-1">
                <!--<div class="c-1-l f12">-->
                    <!--<span class="co-orange">外包模式</span>-->
                    <!--<p>人员为您提供外包服务，您在支付费用时，可申请开票</p>-->
                <!--</div>-->
                <div class="c-1-2 f12">
                    <span class="co-blue">代发收入</span>
                    <p>人员为您的自有员工，您在使用系统代发收入时，无法申请开票</p>
                </div>
            </div>
            <div class="c-2 f12">
                <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
                    <el-form-item label="选择: " class="model-select">
                        <el-radio-group class="radio-search" v-model="form.type">
                            <!--<el-radio label="1">外包模式-月结</el-radio>-->
                            <!--<el-radio label="2">外包模式-周结</el-radio>-->
                            <el-radio label="3">代发收入-月结</el-radio>
                            <el-radio label="4">代发收入-周结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </el-form>
            </div>
            <div class="c-3">
                <div id="qrcode"></div>
                <!--<img class="img" :src="httpUrl" alt="">-->
                <div class="c-3-r">
                    <span class="f12 pb20" >当前选择：{{modelText}}</span>
                    <el-button class="primary-btn" size="middle" @click="copy()">复制链接</el-button>
                </div>
            </div>
        </div>
        <footer class="linebdt">
            <el-button class="primary-btn" size="middle" @click="goBack()">返回</el-button>
        </footer>
    </div>
</template>
<script>
    import QRCode from 'qrcodejs2'
    export default {
        name: "addWorker",
        data() {
            return {
                httpUrl: '',
                form: {
                    type: '3',
                    settlementType: '2',//结算方式结算方式 2：月 4：周",
                    payType: '2',//付款方式 1外包 2代发收入",
                    industry:'',
                    industryName:'',
                },
                modelText:'代发收入-月结',
                toParams: JSON.parse(localStorage.userInfo) || {},
                isRequst:false,
            };
        },

        watch: {
            'form.type': function (val, oldval) {
                switch (val) {
                    case '1':
                        this.form.settlementType = '2';
                        this.form.payType = '1';
                        this.modelText = '外包模式-月结'
                        break;
                    case '2':
                        this.form.settlementType = '4';
                        this.form.payType = '1';
                        this.modelText = '外包模式-周结' ;
                        break;
                    case '3':
                        this.form.settlementType = '2';
                        this.form.payType = '2';
                        this.modelText = '代发收入-月结';
                        break;
                    case '4':
                        this.form.settlementType = '4';
                        this.form.payType = '2';
                        this.modelText = '代发收入-周结' ;
                        break;
                    default:
                }
                this.getWechatUrl();
            },
        },
        methods: {
            qrcode() {
                document.getElementById('qrcode').innerHTML = '';
                let qrcode = new QRCode('qrcode', {
                    width:168,
                    height:168,
                    text:this.httpUrl, // 二维码地址
                    colorDark : "#000",
                    colorLight : "#fff",
                    correctLevel : QRCode.CorrectLevel.H
                })
            },
            goBack: function () {
                this.$router.go(-1);
            },
            copy: function () {
                let _this = this;
                try {
                    if(_this.isRequst){return}
                    _this.isRequst = true;
                    if(_this.httpUrl){
                        console.log(_this.httpUrl);
                        let createInput = document.createElement('input');
                        createInput.value = _this.httpUrl;
                        document.body.appendChild(createInput);
                        createInput.select(); // 选择对象
                        document.execCommand("Copy"); // 执行浏览器复制命令
                        createInput.className = 'createInput';
                        createInput.style.display='none';
                    }
                }catch (e) {
                    console.log(e)
                }finally {
                    setTimeout(()=>{
                        _this.isRequst = false;
                    },500)
                }
            },
            getDetail: function () {
                let params = {
                    id:this.toParams.customerId || " "
                };
                this.$api.detailCustomer(params).then(res => {
                    if(res.respCode === 0){
                        this.form.industry = res.data.industry;
                        this.form.industryName = res.data.industryName;
                        console.log(res.data)
                        this.getWechatUrl();
                    }
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            },
            getWechatUrl: function () {
                let params = {
                    // type: '16', //16 模式自定义的，零工端接收这个调往指定绑定经理人页面
                    // snsapi_userinfo: 'snsapi_base', //固定参数
                    state: {
                        id:this.toParams.customerId, //经理人id
                        settlementType:this.form.settlementType, //结算方式结算方式 2：月 4：周",
                        payType:this.form.payType,//付款方式 1外包 2代发收入",
                        toc:'2',//添加零工 0 只绑定班务经理 1 绑定班务经理和经理人 2 只绑定经理人"
                    }
                };
                params.state = JSON.stringify(params.state);
                this.$api.wechatHandle(params).then(res => {
                    if(res.respCode === 0){
                        this.httpUrl = res.data;
                        this.qrcode();
                    }
                    console.log(res)
                }).catch(err => {
                    console.log(err)
                })
            },
        },
        mounted() {
            this.getDetail();
        },
    };
</script>
<style lang="scss">
    .add-worker {
        background-color: #fff;
        .radio-search .el-radio__input {
            display: block;
        }
        .model-select .el-form-item__label{
            line-height: 40px;
        }
        .add-title {
            height: 62px;
            padding: 0 32px;
            display: flex;
            justify-content: start;
            justify-items: center;
            align-items: center;
            font-size: 14px;
            border-bottom: 1px solid #EAEDF4;
        }
        .content {
            padding: 36px 40px;
            .c-1 {
                line-height: 1.8;
                display: flex;
                flex-direction: row;

                .c-1-2 {
                    margin-left: 70px;
                }
            }
            .c-2 {
                padding-top: 40px;
                .el-radio-group {
                    height: 40px;
                    display: flex;
                    flex-direction: row;
                    justify-content: start;
                    align-items: center;
                    .el-radio {
                        display: flex;
                        flex-direction: row;
                        justify-content: center;
                        align-items: center;
                    }
                }
            }
            #qrcode{
                background-color: #fff;
                padding:10px;
                width:190px;
                height:190px;
                border:1px solid #C0C1C2;
            }
            .c-3 {
                display: flex;
                flex-direction: row;
                justify-content: start;
                align-items: center;
                img {
                    display: inline-block;
                    width:168px;
                    height:168px;
                }

                .c-3-r {
                    display: flex;
                    flex-direction: column;
                    margin-left: 40px;
                }
            }
        }

        footer {
            height: 62px;
            padding: 0 32px;
            display: flex;
            justify-content: flex-end;
            justify-items: center;
            align-items: center;
            font-size: 14px;
        }
    }

    .co-orange {
        color: #E94A1E;
    }

    .co-blue {
        color: #3296FA;
    }

    .f12 {
        font-size: 12px;
    }

    .pb20 {
        padding-bottom: 20px;
    }
</style>

