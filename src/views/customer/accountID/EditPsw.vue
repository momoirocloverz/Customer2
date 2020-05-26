<template>
  <div>
    <div class="box-body pwd-box-body">
      <el-form ref="form" :model="form" label-width="130px" label-position="left" :rules="rules">
        <el-form-item label="原密码：" class="width:100%" prop="password">
          <el-input class="radius-input msgText" type="password" v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="绑定手机号：" class="width:100%">
          <span class="info">{{mobile | formatMobile}}</span>
        </el-form-item>
        <el-form-item label="短信验证码：" class="width:100%" prop="validator">
          <el-input class="radius-input msgText inputWid" v-model="form.validator"></el-input>
          <el-button class="msg-btn" round :disabled="getcoding" @click="getCode">{{buttonText}}</el-button>
        </el-form-item>
        <el-form-item label="新密码：" class="width:100%" prop="newPassword">
          <el-input class="radius-input workerInp" placeholder="6-18位字母或数字" size="medium" v-model="form.newPassword"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div class="box-footer">
      <el-button round size="medium" type="primary" @click="submit">保 存</el-button>
    </div>
    <el-dialog title="" :visible.sync="confirmDia" width="600px" center>
      <div class="dialog-head">
        <span>密码修改成功，请重新登录</span>
        <div class="countDown">{{time}}秒后自动退出</div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="BacktoLogin">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "editPsw",
  data() {
    return {
      time: 3,
      mobile: '',
      wating: 60,
      getcoding: false,
      buttonText: '获取验证码',
      form: {
        psw: "",
        phone: "",
        code: "",
        newPsw: ""
      },
      confirmDia: false,
      rules: {
        password: [
          {
            required: true,
            message: "原密码不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z0-9]{6,18}$/,
            message: "原密码应为6-18位数字或字母",
          },
        ],
        validator: [
          {
            required: true,
            message: "短信验证码不能为空",
            trigger: "blur"
          }
        ],
        newPassword: [
          {
            required: true,
            message: "新密码不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[a-zA-Z0-9]{6,18}$/,
            message: "新密码应为6-18位数字或字母",
          },
        ]
      }
    };
  },
  filters: {
    formatMobile(val) {
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(7);
      }
    }
  },
  mounted() {
    this.userInfo = JSON.parse(localStorage.getItem('userInfo'))
    this.mobile = this.userInfo.mobile;
  },
  methods: {
    BacktoLogin() {
      this.confirmDia = false
      this.$router.replace('/')
    },
    setTiming() {
      this.time = 3
      let that = this;
      let timing = setInterval(function () {
        if (that.time == 0) {
          window.clearInterval(timing)
          sessionStorage.removeItem('token')
          localStorage.removeItem('token')
          that.$router.replace('/')
        } else {
          that.time--;
        }
      }, 1000)
    },
    handleSubmit() {
      const params = {
        loginName: this.form.loginName,
        validator: this.form.validator,
        password: this.form.password,
        mobile: this.mobile,
      };
      this.$api
        .UpdateUserPassword(params)
        .then(response => {
          this.agreeVisible = true
          this.setTiming()
        })
        .catch(error => {
          console.log(error);
        });
    },
    getCode() {
      this.getcoding = true;
      this.wating = 60

      const params = {
        mobile: this.mobile,
      };
      this.$api
        .getSmsCode(params)
        .then(response => {
          this.$message.success('短信已发送，请注意查收')
        })
        .catch(error => {
          console.log(error);
        });

      let that = this
      let timing = setInterval(function () {
        if (that.wating < 0) {
          that.getcoding = false;
          that.buttonText = '获取验证码';
          window.clearInterval(timing)
        } else {
          that.buttonText = that.wating + '秒后重试'
          that.wating--;
        }
      }, 1000)
    },
    goBack() {
      this.$router.go(-1)
    },
    submit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            mobile: this.mobile,
            password: this.form.password,
            validator: this.form.validator,
            newPassword: this.form.newPassword,
          };
          this.$api
            .UpdateUserPwd(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.confirmDia = true
                this.setTiming();
              }
            })
            .catch(error => {
              console.log(error);
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goBack() {
      this.$router.go(-1)
    }
  }
};
</script>
<style scoped>
.pwd-box {
  width: 454px;
  height: 446px;
}
.pwd-box1 {
  width: 504px;
  height: 446px;
}
.pwd-box-body {
  height: 150px;
  margin: 0 40px;
}
.pwd-box-body {
  height: 150px;
  margin: 0 40px;
}
.overflow-box {
  background-color: #ffffff;
  box-shadow: 0px 2px 21px 0px rgba(156, 156, 156, 0.35);
  border-radius: 8px;
  margin: 0 auto;
  padding-bottom: 30px;
}
.box-title {
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
.box-title span {
  padding-bottom: 10px;
  border-bottom: 3px solid #e84518;
  border-radius: 1px;
}
.box-footer {
  text-align: center;
}
.box-body {
  display: flex;
  display: -webkit-flex; /* Safari */
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  margin-top: 20px;
}
.msg-btn {
  display: inline-block;
  padding: 12px 8px;
  margin-left: 5px;
  height: 40px;
}
.inputWid {
  width: 140px;
}
.countDown {
  font-size: 18px;
  color: #262626;
  margin-top: 50px;
}
</style>

