<template>
  <div>
    <div class="box-body pwd-box-body">
      <el-form ref="form" :model="form" :rules="rules" label-width="190px" label-position="left">
        <el-form-item label="原手机号：" class="width:100%">
          <span class="info">{{form.oldPhone}}</span>
        </el-form-item>
        <el-form-item label="原手机号短信验证码：" prop="validator" class="width:100%">
          <el-input class="radius-input msgText inputWid" v-model="form.validator"></el-input>
          <el-button class="msg-btn" round :disabled="getcoding1" @click="getOldCode">{{buttonText1}}</el-button>
        </el-form-item>
        <el-form-item label="新手机号：" class="width:100%" prop="newMobile">
          <el-input class="radius-input workerInp" size="medium" v-model="form.newMobile"></el-input>
        </el-form-item>
        <el-form-item label="新手机号短信验证码：" class="width:100%" prop="newValidator">
          <el-input class="radius-input workerInp inputWid" size="medium" v-model="form.newValidator"></el-input>
          <el-button class="msg-btn" round :disabled="getcoding2" @click="getNewCode">{{buttonText2}}</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="box-footer">
      <el-button round size="medium" type="primary" @click="save">保 存</el-button>
    </div>
    <el-dialog title="" :visible.sync="bindDia" width="600px" center>
      <div class="dialog-head">
        <span>绑定手机号修改成功</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="bindDia = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "bindPhone",
  data() {
    return {
      wating1: 60,
      getcoding1: false,
      buttonText1: '获取验证码',
      wating2: 60,
      getcoding2: false,
      buttonText2: '获取验证码',
      rules: {
        validator: [
          { required: true, message: '原手机号短信验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{1,6}$/, message: '验证码格式不正确', trigger: 'blur' },
        ],
        newMobile: [
          { required: true, message: '新手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "新手机号码格式不正确"
          },
        ],
        newValidator: [
          { required: true, message: '新手机号短信验证码不能为空', trigger: 'blur' },
          { pattern: /^\d{1,6}$/, message: '验证码格式不正确', trigger: 'blur' },
        ],
      },
      bindDia: false,
      form: {
        phone: "",
        code: "",
        oldCode: "",
        oldPhone: ""
      },
      phone: '',
      id: '',
    };
  },
  filters: {
    formatMobile(val) {
      if (val) {
        return val.substr(0, 3) + "****" + val.substr(7);
      }
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    getOldCode() {
      this.getcoding1 = true;
      this.wating1 = 60
      const params = {
        mobile: this.phone,
      };
      this.$api
        .getSmsCode(params)
        .then(response => {
          this.$message.success('短信已发送，请注意查收')
          let that = this
          let timing = setInterval(function () {
            if (that.wating1 < 0) {
              that.getcoding1 = false;
              that.buttonText1 = '获取验证码';
              window.clearInterval(timing)
            } else {
              that.buttonText1 = that.wating1 + '秒后重试'
              that.wating1--;
            }
          }, 1000)
        })
        .catch(error => {
          console.log(error);
        });


    },
    getNewCode() {
      if (this.form.newMobile) {
        this.getcoding2 = true;
        this.wating2 = 60
        const params = {
          mobile: this.form.newMobile,
        };
        this.$api
          .getSmsCode(params)
          .then(response => {
            this.$message.success('短信已发送，请注意查收')
            let that = this
            let timing = setInterval(function () {
              if (that.wating2 < 0) {
                that.getcoding2 = false;
                that.buttonText2 = '获取验证码';
                window.clearInterval(timing)
              } else {
                that.buttonText2 = that.wating2 + '秒后重试'
                that.wating2--;
              }
            }, 1000)
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        this.$message.error('请输入新手机号')
      }

    },
    save() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            mobile: this.phone,
            validator: this.form.validator,
            newMobile: this.form.newMobile,
            newValidator: this.form.newValidator,
            userType: 2
          };
          this.$api
            .UpdateUserTel(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success('修改绑定手机号成功！')
                //                      this.bindDia = true
                this.$router.replace('/')
              }
              //                  this.$router.go(-1)
            })
            .catch(error => {
              console.log(error);
            });
        }
      })
    }
  },
  mounted() {
    let userInfo = JSON.parse(localStorage.getItem("userInfo"))
    console.log(userInfo)
    this.phone = userInfo.mobile;
    this.id = userInfo.userId;
    this.form.oldPhone = this.phone.substr(0, 3) + "****" + this.phone.substr(7);
  }
};
</script>
<style scoped>
.pwd-box1 {
  width: 510px;
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
