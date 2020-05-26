<template>
    <div>
        <div class="head">
            <div class="overflow-box pwd-box" style="margin: 40px auto;padding: 40px" v-if="firstStep">
                <div class="box-title"><span>充值</span></div>
                <div class="box-body">
                    <div>
                        <el-form ref="form" :model="form" label-width="110px" :rules="rules">
                            <el-form-item label="充值金额：" prop="idCard" >
                                <el-input class="radius-input workerInp" maxlength="128" @blur="checkLoginName" size="medium" v-model="form.idCard" style="width:90%"></el-input><span> 元</span>
                                <span class="charge-label">每笔充值收取{{charge}}元的手续费</span>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="box-footer">
                    <el-button round size="medium"  type="primary" @click="Next">提 交</el-button>
                    <el-button round size="medium"  @click="$router.go(-1)">取 消</el-button>
                </div>
            </div>
        </div>
        <el-dialog
                title=""
                :visible.sync="lastFeeDia"
                width="600px"
                center
        >
            <div class="dialog-head">
                <span>您正在第三方支付页面充值</span>
            </div>
            <span
                    slot="footer"
                    class="dialog-footer"
                >
                <el-button
                        round
                        size="medium"
                        type="primary"
                        @click="check"
                >充值已完成</el-button>
                <el-button
                class="btnEdit"
                        round
                        size="medium"
                        @click="lastFeeDia = false"
                >修改充值信息</el-button>
            </span>
        </el-dialog>
    </div>
    <!--<someComponent></someComponent>-->
</template>

<script>
  //import someComponent from './someComponent'
  export default {
    name: "",
    components: {
    },
    data() {
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
        msg: "Hello Vue.js",
        lastFeeDia:false,
        charge:'0'
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
                this.agreeVisible=true
                this.setTiming()
                })
                .catch(error => {
                console.log(error);
                });
        },
        check(){
            this.$router.push({name:'mAccountList'})
        },
        getFee(){
        const params = {
          paramName: 'recharge',
        };
        this.$api.ParamsInfo(params)
            .then(response => {
              if (response.respCode == 0) {
                this.charge = response.data
              }
            })
            .catch(error => {
              console.log(error);
            });
      }
  },
  mounted () {
        this.getFee()
    }
  }
</script>


<style scoped>
    .charge-label{
        display: inline-block;
        font-family: PingFang-SC-Medium;
        font-size: 16px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 24px;
        letter-spacing: 0px;
        color: #666666;
    }
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
        width:424px;
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
    .btnEdit {
        width:120px !important
    }
</style>