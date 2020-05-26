<template>
  <div class="page-login">
    <div class="banner" :style="note">
      <div class="panel-body flexSafari">
        <div class="login-panel">
          <h3 class="panel-title">密码登录</h3>
          <div class="marginC flexSafari">
            <el-form ref="form" :model="form" class="loginDiv" label-position="left" :rules="rules">
              <el-form-item prop="userName" class="user-name">
                <el-input type="text" v-model="form.userName" class="icon " placeholder="用户名" />
              </el-form-item>
              <el-form-item prop="password" class="user-psw">
                <el-input type="password" v-model="form.password" class="icon " placeholder="密码" @keyup.enter.native="login" />
              </el-form-item>
              <!-- <el-radio-group v-model="type" class="login-radio">
                <el-radio label="2">客户</el-radio>
                <el-radio label="3">项目经理</el-radio>
              </el-radio-group> -->
            </el-form>
          </div>
          <el-button type="primary" class="btn-login" @click="login">登 录</el-button>
            <div class="subFunctionCon">
                <div class="getpsw" @click="findPwd">忘记密码</div>
                <div class="registerBtn">没有账号<span class="registerText" @click="goToRegister">立即注册</span></div>
            </div>
            
        </div>
      </div>
    </div>
    <div class="bannerBody bgGray bg2"></div>
    <div class="bannerBody bg3"></div>
    <div class="bannerBody bgGray bg4"></div>
    <div class="bannerBody bgGray bg5"></div>
    <Footer />      
      <el-dialog :visible.sync="regShow" title="注册" width="390px" class="base-dialog littleCancelDialog">
            <div>
                <el-form :model="regForm" :rules="regRules" ref="regForm" label-width="0" class="">
                    <el-form-item  prop="phone" >
                        <el-input v-model="regForm.phone" placeholder="登录手机号"></el-input>
                    </el-form-item>
                    <el-form-item prop="sms" >
                        <div class="smsCon">
                            <el-input v-model="regForm.sms" placeholder="短信验证码"></el-input>
                            <el-button type="primary" class=" smSendBtn" @click="sendSms(regForm.phone)" :disabled="smsAble">{{buttonText}}</el-button>
                        </div>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input v-model="regForm.password" placeholder="登录密码"></el-input>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-fo">                
                <div class="agreementCon">
                    <el-checkbox v-model="checked"></el-checkbox>
                    <div class="checkHere">注册代表您已阅读并同意<span class="agreementLink" @click="popAgreement">《经理人注册协议》</span></div>
                </div>
                <el-button type="primary" class="regNow" @click="confirmReg">立即注册</el-button>
            </div>
        </el-dialog>
      <el-dialog :visible.sync="agreementShow" title="万才经理人注册协议" width="800px" class="base-dialog copyCancelDialog">
          <div class="agreementScrollCon">
              <div class="ql-container">
                  <div class="ql-editor">
                      <div class="articleText " v-html="content"></div>      
                    </div>
                </div>
            </div>
          <div class="agreementSelfCheck">
              <el-checkbox v-model="checked"></el-checkbox>
              <div class="checkHere">我已经阅读并完全同意</div>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import Header from "../components/Heaader";
import Footer from "../components/Footer";
import util from '../common/util'
import {mapState,mapGetters,mapMutations} from 'vuex';

export default {
  name: "login",
  components: {
    Header,
    Footer
  },
  data() {      
    return {
        content:'',
        agreementShow:false,
        smsAble:false,
        checked:true,
        regForm:{},
        buttonText:'获取验证码',
        regRules:{
            phone:[
                { required: true, message: '请输入登录手机号', trigger: 'blur' },
                { pattern: /^1[3456789]\d{9}$/,message: "手机号格式不正确" },
            ],
            sms:[
                { required: true, message: '请输入短信验证码', trigger: 'blur' },
                { max: 6, message: '短信验证码长度不超过6个字符', trigger: 'blur' },
            ],
            password:[
                { required: true, message: '请输入登录密码', trigger: 'blur' },
                { min: 6, max: 18, message: '长度在6到18个字符', trigger: 'blur' },
                { pattern: /[a-zA-z0-9]/,message: "密码必须是字母或数字" },
            ],
        },
        regShow:false,        
      form: {
        userName: "",
        password: ""
      },
      type: '2',
      note: {
        backgroundImage: "url(" + require("../../src/assets/images/banner2.png") + ")",
        backgroundRepeat: "no-repeat",
        backgroundSize: "auto 100%",
        backgroundPosition: "center center",
      },
        wating:60,
      rules: {
        userName: [
          {
            required: true,
            message: "登录账号不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "登录密码不能为空",
            trigger: "blur"
          },
          {
            min: 1,
            max: 128,
            message: "长度在 1 到 128 个字符",
            trigger: "blur"
          }
        ]
      },
    };
  },
    mounted(){
    },
  methods: {
      ...mapMutations(['IFHAVEPAYOWM']),
      popAgreement(){
          this.agreementShow = true;
          let params = {
              title: '万才平台注册服务协议'
          };
          this.$api.getUserAgreement(params).then(res=>{
              let { respCode,data } = res;
              if( respCode === 0 ){
                  this.content = data.content;
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      goToRegister(){
          this.regShow = true;
          this.regForm = {};
          this.$nextTick(()=>{
              this.$refs.regForm.clearValidate('phone');
              this.$refs.regForm.clearValidate('sms');
              this.$refs.regForm.clearValidate('password');
          })
      },
      afterRegProcess(data){
          const params = {
            username: `${data.mobile},${data.userType}`,
            password: data.password
          };
          this.$api.login(params).then(res => {
              let { data:layer1 } = res;
              let { respCode,data } = layer1;
              if( respCode === 0 ){
                  if( data.auditStatus != 3 ){
                      this.commonSetProcess(res);
                      switch(data.auditStatus) {
                          case 0:
                              this.$store.commit('setAuditStage',1);
                              this.$router.push({ name: "accountCheckMaster" });
                              break;
                          case 1:   
                              this.$store.commit('setAuditStage',2);
                              sessionStorage.setItem("auditStatus",'1');
                              this.$router.push({ name: "accountCheckMaster" });
                              break;
                          case 2:
                              this.$store.commit('setAuditStage',2);
                              sessionStorage.setItem("auditStatus",'2');
                              this.$router.push({ name: "accountCheckMaster" });
                              break;                          
                      }
                  }
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      confirmReg(){
          this.$refs.regForm.validate((valid)=>{
              if (valid) {
                  if( this.checked ){                      
                      let params = {
                          mobile: this.regForm.phone,
                          validator: this.regForm.sms,
                          password: this.regForm.password,
                          userType: 2,
                      };
                      this.$api.registerNow(params).then(res=>{
                          let { data:layer1 } = res;
                          let { data,respCode } = layer1;
                          if( respCode === 0 ){
                              this.$message({
                                  message: '注册成功',
                                  type: 'success'
                              });
                              this.regShow = false;
                              this.afterRegProcess(params);   
                          }                          
                      }).catch(err=>{
                         console.log('err',err); 
                      });    
                  }else{
                      this.$message.error('阅读并同意注册协议。');
                  }
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      },
      sendSms(val){
          this.$refs.regForm.validateField('phone');
          if( /^1[3456789]\d{9}$/.test(val) ){
              const params = {
                  mobile: this.regForm.phone,
                  userType: 2,
              };
              this.$api.checkMobileMsg(params).then(res => {
                  let { respCode,data } = res;
                  if(data){
                      this.$message.error('您输入的手机号已注册');
                  }else{
                      this.getSms();  
                  }
                }).catch(error => {
                  console.log(error);
                });
          }else{
//              this.$message.error('手机号格式不正确。');
          }
      },
      getSms(){          
          this.smsAble = true;
          const params = {
              mobile: this.regForm.phone,
          };
          this.$api.getSmsCode(params).then(res => {
              if (res.respCode === 0) {
                  this.wating = 60;
                  this.$message({
                      message: '验证码已发送',
                      type: 'success'
                  });
                  let that = this;
                  let timing = setInterval(function () {
                      if (that.wating < 0) {
                          that.smsAble = false;  
                          that.buttonText = '获取验证码';
                          window.clearInterval(timing)
                      } else { 
                          that.buttonText = that.wating + '秒后重试';
                          that.wating--;                          
                      }
                  },1000)
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      commonSetProcess(res){
          localStorage.setItem('onceNo',1);

          let authorization = res.headers.authorization;          
          sessionStorage.setItem("token", authorization);
          util.setLocalStorage('token', authorization);
          
          let loginType = res.data.data.loginType;
          sessionStorage.setItem("logintype", loginType);
          localStorage.setItem("logintype", loginType);

          let SoSecurity = res.data.data.isSettingSocialSecurity;          
          sessionStorage.setItem('isSettingSocialSecurity', SoSecurity);
          localStorage.setItem('isSettingSocialSecurity', SoSecurity);
          
          let userInfo = JSON.stringify(res.data.data);
          sessionStorage.setItem('userInfo', userInfo);
          localStorage.setItem('userInfo', userInfo);
          let ifHavePayOwn = res.data.data.ifHavePayOwn ? res.data.data.ifHavePayOwn : 0; //判断是否及时雨账户
          this.IFHAVEPAYOWM(ifHavePayOwn)
          localStorage.setItem('xfdStatus', res.data.data.xfdStatus);  
      },
      normalLoginProcess(res){
          this.commonSetProcess(res);
          let loginType = res.data.data.loginType;
          if (loginType == 2) {
              this.$router.replace({ name: "welcome",query:{login:true,}});
          } else {
              if (res.data.data.isAuthenticated != 2) {
                  localStorage.setItem('isAuthenticated', 1)
              } else {
                  localStorage.setItem('isAuthenticated', 2)
              }
              this.$router.push({ name: "mAccountList" });
          }
          
          let emptyTalentSwitch = res.data.data.emptyTalentSwitch; 
          if(emptyTalentSwitch == 2){
              let arr3 = this.$router.options.routes;
              let newArr = []
              arr3.forEach(item => {
                  if(item.alias == '零工管理'){
                      newArr = item.children
                  }
              })
              let new2Arr = []
              newArr.forEach(item => {
                  if(item.alias != '特殊考勤人员'){
                      new2Arr.push(item)
                  }
              })
              this.$router.options.routes[5]['children'] = new2Arr
          }else{
              this.$router.options.routes[5]['children']=JSON.parse(localStorage.getItem("newroutes"))
          }
          
      },
    login() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            username: `${this.form.userName},${this.type}`,
            password: this.form.password
          };
          this.$api.login(params).then(res => {
              let { data:layer1 } = res;
              let bridge = res;
              let { respCode,data } = layer1;
              if( respCode === 0 ){
                  this.commonSetProcess(res);
                  let hiId = JSON.parse(localStorage.getItem('userInfo') ).customerId;
                  let params = {
                    id:hiId,
                }
                this.$api.detailLite(params).then(res => {
                    let { respCode,data } = res;
                    if( respCode === 0 ){
                      if( data.auditStatus != 3 ){
                          switch(data.auditStatus) {
                              case 0:
                                  this.$store.commit('setAuditStage',1);
                                  this.$router.push({ name: "accountCheckMaster" });
                                  break;
                              case 1:   
                                  this.$store.commit('setAuditStage',2);
                                  sessionStorage.setItem("auditStatus",'1');
                                  this.$router.push({ name: "accountCheckMaster" });
                                  break;
                              case 2:
                                  this.$store.commit('setAuditStage',2);
                                  sessionStorage.setItem("auditStatus",'2');
                                  this.$router.push({ name: "accountCheckMaster" });
                                  break;                          
                          }
                      }else{
                          this.normalLoginProcess(bridge);
                      }
                    }
                }).catch(err => {
                    console.log(err);
                })  
              }
            }).catch(error => {
              console.log(error);
            });
        } else {
            console.log("error submit!!");
            return false;
        }
      });
    },
    findPwd() {
      this.$router.push({ name: "FindPwd" });
    }
  },
};
</script>
<style lang='scss'>
    .page-login {
        .agreementScrollCon {
            height: 450px;
            overflow-y: scroll;
            margin-bottom: 20px;
        }
        .copyCancelDialog {
            .agreementSelfCheck {
                display: flex;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
            }
            .el-dialog__header {
                padding-top: 30px;
            }
            .el-dialog__body {
                padding-top: 10px;
                padding-bottom: 10px;
            }
            .el-dialog {
                text-align: center;
                height: 600px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }
        }
        .subFunctionCon {
                display: flex;
                justify-content:space-between;
                align-content: center;
                align-items: center;
            }
        .dialog-fo {
            padding-left: 30px;
            padding-right: 30px;
        }
        .regNow {
            background-color: #f06a46;
            color: #fff;
            width: 100%;
            height: 40px;  
            margin-top: 17px;
        }
        .checkHere {
                margin-left: 10px;
                font-size: 13px;
                color: #C3C3C3;
            }
        .littleCancelDialog {            
            .smSendBtn {
                height: 40px;
                margin-left: 20px;
                background-color: #f06a46;
                color: #fff;
                width: 110px;
            }            
            .agreementLink {
                color: #f06a46;
                cursor: pointer;
            }
            .smsCon {
                display: flex;
                justify-content: flex-start;
                align-content: center;
                align-items: center;
            }
            .agreementCon {
                display: flex;
                justify-content: center;
                align-content: center;
                align-items: center;
/*                margin-top: 20px;*/
            }
            .el-dialog {
                text-align: center;
                height: 420px;
                position: absolute;
                left: 0;
                right: 0;
                top: 0;
                bottom: 0;
                margin: auto !important;
            }
            .el-dialog__header {
/*                height: 40px;*/
                padding-top: 40px;
                border-bottom: none;
            }
            .el-dialog__body {
                padding: 30px;
                padding-top: 20px;
                padding-bottom: 0;
            }
            .el-input__inner {
                background-color: #f0f0f0;
            }  
            .el-dialog__footer  {
                border: none !important;
            }
        }
    .registerBtn{
        color: #666;
        font-size: 14px;
        text-align: right;
        .registerText {
            color: #f06a46;
            cursor: pointer;
        }        
    } 
  .panel-body {
    position: relative;
    width: 860px;
    margin: 0 auto;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .bg2 {
    height: 450px;
    background-image: url(../assets/images/2.png);
  }
  .bg3 {
    height: 450px;
    background-image: url(../assets/images/3.png);
  }
  .bg4 {
    height: 450px;
    background-image: url(../assets/images/4.png);
  }
  .bg5 {
    height: 450px;
    background-image: url(../assets/images/5.png);
  }
  .bannerBody {
    background-size: auto 100%;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .bgGray {
    background-color: #f7f9fa;
  }
  .banner {
    height: 940px;
  }
  .login-panel {
    position: absolute;
    box-sizing: border-box;
    width: 360px;
    height: 400px;
    padding: 35px 30px 32px 30px;
    background-color: #fff;
    border-radius: 2px;
    align-items: center;
    top: 150px;
    right: 30px;
    box-shadow: 2px 2px 10px rgba(84, 84, 84, 0.04);
    .el-form-item {
      width: 100%;
      background-color: #f0f0f0;
    }
    .el-input__inner {
      background-color: #f0f0f0;
      border: 1px solid #dcdfe6;
    }
  }
        .panel-title {
            font-size: 16px;
            font-weight: normal;
            line-height: 1;
            color: #5c5c5c;
        }
  .user-name {
    margin-top: 30px;
  }
  .user-psw {
    margin-top: 36px;
  }
  input:focus {
    outline: none;
  }
  .login-radio {
    .el-radio:nth-of-type(2) {
      margin-left: 75px;
    }
  }
  .btn-login {
    width: 100%;
    height: 40px;
    text-align: center;
    padding: 0;
    background-color: #f06a46;
    font-size: 14px;
    line-height: 40px;
    color: #fff;
    margin: 30px 0 36px 0;
    &:hover {
      background-color: #ff754e;
    }
    & :active {
      background-color: #ec552b;
    }
  }
        .getpsw {
            cursor: pointer;
            font-size: 14px;
            line-height: 1;
            color: #666666;
            text-align: center;
        }
    }
</style>