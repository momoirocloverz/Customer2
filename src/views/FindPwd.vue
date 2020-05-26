<template>
    <div>
        <div class="head">
            <Header />
            <div class="overflow-box pwd-box" style="margin: 40px auto" v-if="firstStep">
                <div class="box-title"><span>找回密码</span></div>
                <div class="box-body">
                    <div>
                        <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                            <el-form-item label="登录账号：" prop="idCard" class="width:100%">
                                <!--@blur="checkLoginName"-->
                                <el-input class="radius-input workerInp" maxlength="128"  size="medium" v-model="form.idCard"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="box-footer">
                    <el-button round size="medium"  type="primary" @click="Next">下一步</el-button>
                    <el-button round size="medium"  @click="goBack">取 消</el-button>
                </div>
            </div>
            <div class="overflow-box pwd-box" style="margin: 40px auto" v-else>
                <div class="box-title"><span>找回密码</span></div>
                <div class="box-body pwd-box-body">
                    <el-form ref="form" :model="form" label-width="110px" label-position="left">
                        <el-form-item label="登录账号：" class="width:100%">
                            <span class="info">{{form.idCard}}</span>
                        </el-form-item>
                        <el-form-item label="绑定手机号：" class="width:100%">
                            <span class="info">{{mobile | formatMobile}}</span>
                        </el-form-item>
                        <el-form-item label="短信验证码：" class="width:100%">
                            <el-input class="radius-input msgText" v-model="form.validator" autocomplete = 'new-password'></el-input>
                            <el-button class="msg-btn" round :disabled="getcoding" @click="getCode">{{buttonText}}</el-button>
                        </el-form-item>
                        <el-form-item label="新密码：" class="width:100%">
                            <el-input class="radius-input workerInp" type="password" placeholder="6-18位字母或数字"  size="medium" v-model="form.password" autocomplete = 'new-password'></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="box-footer">
                    <el-button round size="medium"  type="primary" @click="handleSubmit">确 定</el-button>
                    <el-button round size="medium"  @click="goBack">取 消</el-button>
                </div>
            </div>
            <el-dialog
                    title=""
                    :visible.sync="agreeVisible"
                    width="450px"
                    center
            >
                <div class="dialog-head">
                    <span>密码找回成功，请前往登录</span>
                    <h4>{{this.time}}秒后自动跳转</h4>
                </div>
                <span slot="footer" class="dialog-footer">
                <el-button round size="medium"  type="primary" @click="agreeVisible = false">确 定</el-button>
                    <!--<el-button round size="medium"  @click="goBack">取 消</el-button>-->
            </span>
            </el-dialog>
        </div>
        <Footer style="margin-top:  110px" />
    </div>
    <!--<someComponent></someComponent>-->
</template>

<script>
  import Header from "../components/Heaader.vue";
  import Footer from "../components/Footer";
  //import someComponent from './someComponent'
  export default {
    name: "",
    components: {
      Header,
      Footer
    },
    data() {
      const validateRepeatF= (rule, value, callback) => {
        if (value != null && value != "") {
          const params={
            loginName:this.form.idCard,
            userType:1,
          }
          this.$api
              .getUserInfo(params)
              .then(response => {
                console.log(response)
                if(response.respCode==0){
                  callback()
                }else{
                  callback(new Error('登录账号不存在!'))
                }
              })
              .catch(error => {
                console.log(error);
              });
        }
        else {
          callback();
        }
      }
      return {
        time:3,
        wating:60,
        getcoding:false,
        buttonText:'获取验证码',
        rules: {
          idCard: [
            {required: true, message: '登录账号不能为空', trigger: 'blur'},
//            { validator: validateRepeatF, trigger: 'blur' },
            {max: 128, message: '长度不超过128字', trigger: 'blur'}
          ],
        },
        firstStep:true,
        agreeVisible:false,
        form:{
          idCard:'',
        },
        msg: "Hello Vue.js"
      }
    },
    filters:{
      formatMobile(val){
        if(val){
          return val.substr(0, 3) + "****" + val.substr(7);
        }
      }
    },
    methods: {
      setTiming(){
        this.time=3
        let that =this;
        let timing = setInterval(function(){
          if(that.time==0){
            that.$router.replace('/')
            window.clearInterval(timing)
          }else {
            that.time--;
          }
        },1000)
      },
      handleSubmit(){
        const params = {
          loginName: this.form.loginName,
          validator: this.form.validator,
          password: this.form.password,
          mobile: this.mobile,
          userType:2,
        };
        this.$api
            .UpdateUserPassword(params)
            .then(response => {
              if(response.data.respCode==0){
                this.agreeVisible=true
                this.setTiming()
              }

            })
            .catch(error => {
              console.log(error);
            });
      },
      getCode(){
        this.getcoding=true;
        this.wating = 60

        const params = {
          mobile: this.mobile,
        };
        this.$api
            .getSmsCode(params)
            .then(response => {
              if(response.respCode==0){
                this.$message.success('短信已发送，请注意查收')
              }
            })
            .catch(error => {
              console.log(error);
            });

        let that = this
        let timing = setInterval(function(){
          if(that.wating<0){
            that.getcoding=false;
            that.buttonText='获取验证码';
            window.clearInterval(timing)
          }else {
            that.buttonText=that.wating+'秒后重试'
            that.wating--;
          }
        },1000)
      },
      goBack(){
        this.$router.go(-1)
      },
      checkLoginName(){
        const params={
          loginName:this.form.idCard,
          userType:2,
        }
        this.$api
            .getUserInfo(params)
            .then(response => {
              if(response.respCode==0){
                this.mobile=response.data.mobile
//                this.firstStep=false;
              }else{
                this.$message.error(response.errorMsg)
              }
            })
            .catch(error => {
              console.log(error);
            });
      },
      Next(){
        this.$refs.form.validate(valid => {
          if (valid) {
            const params={
              loginName:this.form.idCard,
              userType:2,
            }
            this.$api
                .getUserInfo(params)
                .then(response => {
                  if(response.respCode==0){
                    this.mobile=response.data.mobile
                    this.firstStep=false;
                  }else{
                    this.$message.error(response.errorMsg)
                  }
                })
                .catch(error => {
                  console.log(error);
                });


//            this.firstStep=false
          }
        });
      },
    }
  }
</script>


<style scoped>
    .dialog-head h4{
        color: #262626;
    }
    .msgText{
        display: inline-block;
        width:64%;
    }
    .msg-btn{
        display: inline-block;
        padding: 12px 8px;
        margin-left: 5px;
        height:40px;
    }
    .pwd-box{
        width: 454px;
        height: 446px;
    }
    .pwd-box-body{
        height: 150px;
        margin:0 40px;
    }
    .pwd-box-body{
        height: 150px;
        margin:0 40px;
    }
    .overflow-box{
        background-color: #ffffff;
        box-shadow: 0px 2px 21px 0px
        rgba(156, 156, 156, 0.35);
        border-radius: 8px;
        margin:0 auto;
        padding-bottom: 30px;
    }
    .box-title{
        text-align: center;
        padding-top: 35px;
        width: 100%;
        font-family: PingFang-SC-Medium;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 24px;
        letter-spacing: 1px;
        color: #262626;
    }
    .box-title span{
        padding-bottom: 10px;
        border-bottom: 3px solid #e84518;
        border-radius: 1px;
    }
    .box-footer{
        text-align: center;
    }
    .box-body{
        display: flex;
        display: -webkit-flex; /* Safari */
        flex-direction:column;
        justify-content:center;
        align-items: center;
        height:300px;
        margin-top: 20px;
    }
</style>