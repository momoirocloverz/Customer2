<template>
  <div>
    <div class="overflow-box1 input-box">
      <div class="box-title" v-if="title2"><span>添加自有个体工商户</span></div>
      <div class="box-title" v-if="title3"><span>添加平台个体工商户</span></div>
      <div class="box-title" v-if="title1"><span>编辑个体工商户</span></div>
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form ref="form" :model="form" label-width="160px" label-position="left" :rules="rules">
              <el-form-item label="所属项目经理：" v-if="isOwn && !isEdit" prop="manager">
                <el-select v-model="form.manager" class="radius-input " style="width: 100%;" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="分配项目经理：" v-if="!isOwn && !isEdit">
                <el-select v-model="form.distributeManager" class="radius-input " style="width: 100%;" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="已交年费：" v-if="!isEdit && isOwn" prop="yearFee">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.yearFee" type="number"></el-input>
                <span class="yuan">元</span>
              </el-form-item>
              <el-form-item label="交费日期：" v-if="!isEdit && isOwn" prop="paidDate">
                <el-date-picker v-model="form.paidDate" type="date" class="radius-input dateWidth" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="服务截止日期：" v-if="!isEdit && isOwn" prop="endTime">
                <el-date-picker class="radius-input dateWidth" v-model="form.endTime" type="date" placeholder="选择日期" :picker-options="pickerOptions0" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="字号名称：" prop="name">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.name" @blur="checkName"></el-input>
              </el-form-item>
              <el-form-item label="经营者姓名：" prop="boss">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.boss"></el-input>
              </el-form-item>
              <el-form-item label="经营场所：" prop="address">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.address"></el-input>
              </el-form-item>
              <el-form-item label="统一社会信用代码：" prop="code">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.code"></el-input>
              </el-form-item>
              <el-form-item label="注册日期：" prop="submitDate">
                <el-date-picker v-model="form.submitDate" type="date" class="radius-input dateWidth" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="开户银行：">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.bank"></el-input>
              </el-form-item>
              <el-form-item label="户名：">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.bankAccount"></el-input>
              </el-form-item>
              <el-form-item label="银行账号：" prop="acountId">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.acountId" type="number"></el-input>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="box-footer">
        <el-button round size="medium" type="primary" @click="submitOwn" v-if="title2">保 存</el-button>
        <el-button round size="medium" type="primary" @click="submitPlat" v-if="title3">保 存</el-button>
        <el-button round size="medium" type="primary" @click="update" v-if="title1">保 存</el-button>
        <el-button round size="medium" @click="goBack">取 消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "NewPrivately",
  data() {
    let _this = this;
    let checkNum = (rule, value, callback) => {
      if (value) {
        if (value < 0) {
          callback(new Error("请输入大于0的数字"));
        } else {
          _this.form.yearFee = value.replace(
            /^(\-)*(\d+)\.(\d\d).*$/,
            "$1$2.$3"
          );
          callback();
        }
      } else {
        callback(new Error("已交年费不能为空"));
      }
    };
    let checkAccount = (rule, value, callback) => {
      if (value) {
        if (value.length == 1) {
          _this.form.acountId = value.replace(/[^1-9]/g, "");
          callback();
        } else {
          _this.form.acountId = value.replace(/\D/g, "");
          callback();
        }
      } else {
        callback();
      }
    };
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() < new Date().getTime();
        }
      },
      form: {
        manager: "",
        distributeManager: "",
        yearFee: "",
        paidDate: "",
        endTime: "",
        name: "",
        boss: "",
        address: "",
        code: "",
        submitDate: "",
        bank: "",
        bankAccount: "",
        acountId: ""
      },
      isEdit: false,
      isOwn: false,
      title1: false,
      title2: false,
      title3: false,
      rules: {
        manager: [
          {
            required: true,
            message: "所属项目经理不能为空",
            trigger: "change"
          }
        ],
        yearFee: [
          {
            required: true,
            // message: "已交年费不能为空",
            trigger: "blur",
            validator: checkNum
          },
          {
            min: 1,
            max: 10,
            message: "长度在 1 到 10 个字符",
            trigger: "blur"
          }
        ],
        paidDate: [
          {
            required: true,
            message: "交费日期不能为空",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: "服务截止日期不能为空",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "字号名称不能为空",
            trigger: "blur"
          }
        ],
        boss: [
          {
            required: true,
            message: "经营者姓名不能为空",
            trigger: "blur"
          }
        ],
        address: [
          {
            required: true,
            message: "经营场所不能为空",
            trigger: "blur"
          }
        ],
        code: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur"
          }
        ],
        submitDate: [
          {
            required: true,
            message: "注册日期不能为空",
            trigger: "change"
          }
        ],
        acountId: [
          {
            required: false,
            trigger: "blur",
            validator: checkAccount
          }
        ]
      },
      options: [],
      isCheckName: true
    };
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    },
    submitOwn() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            managerId: this.form.manager,
            annualFee: this.form.yearFee,
            dateOfPayment: this.form.paidDate,
            endTime: this.form.endTime,
            companyName: this.form.name,
            legalPerson: this.form.boss,
            address: this.form.address,
            creditCode: this.form.code,
            recordDate: this.form.submitDate,
            bankName: this.form.bank,
            bankCard: this.form.bankAccount,
            accountHolder: this.form.acountId
          };
          this.$api
            .addPrivately(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success(`新增成功`);
                this.$router.go(-1);
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
    test() {
      this.$api
        .aaa()
        .then(response => {
          // console.log("1111");
        })
        .catch(error => {
          console.log(error);
        });
    },
    clearNoNum(obj) {
      //先把非数字的都替换掉，除了数字和.
      obj.value = obj.value.replace(/[^\d.]/g, "");
      //保证只有出现一个.而没有多个.
      obj.value = obj.value.replace(/\.{2,}/g, ".");
      //必须保证第一个为数字而不是.
      obj.value = obj.value.replace(/^\./g, "");
      //保证.只出现一次，而不能出现两次以上
      obj.value = obj.value
        .replace(".", "$#$")
        .replace(/\./g, "")
        .replace("$#$", ".");
      //只能输入两个小数
      obj.value = obj.value.replace(/^(\-)*(\d+)\.(\d\d).*$/, "$1$2.$3");
    },
    update() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            financeCustomerId: this.$route.params.id,
            companyName: this.form.name,
            legalPerson: this.form.boss,
            address: this.form.address,
            creditCode: this.form.code,
            recordDate: this.form.submitDate,
            bankName: this.form.bank,
            bankCard: this.form.bankAccount,
            accountHolder: this.form.acountId
          };
          this.$api
            .updatePrivately(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success(`修改成功`);
                this.$router.go(-1);
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
    submitPlat() {
      this.$refs.form.validate(valid => {
        if (valid) {
          const params = {
            companyName: this.form.name,
            legalPerson: this.form.boss,
            address: this.form.address,
            creditCode: this.form.code,
            recordDate: this.form.submitDate,
            bankName: this.form.bank,
            bankCard: this.form.bankAccount,
            accountHolder: this.form.acountId
          };
          this.$api
            .addPrivatelyPlat(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success(`新增成功`);
                // this.$router.push({name:'privatelyList'})
                this.$router.go(-1);
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
      // this.$router.go(-1)
    },
    getOwnDetail() {
      const params = {
        isSelf: this.$route.params.isSelf,
        financeCustomerId: this.$route.params.id
      };
      this.$api
        .PrivatelyOwnDetail(params)
        .then(response => {
          // this.form.distributeManager = response.data.data.managerId
          this.form.yearFee = response.data.data.annualFee;
          this.form.paidDate = response.data.data.dateOfPayment;
          this.form.endTime = response.data.data.endTime;
          this.form.name = response.data.data.name;
          this.form.boss = response.data.data.legalPerson;
          this.form.address = response.data.data.address;
          this.form.code = response.data.data.creditCode;
          this.form.submitDate = response.data.data.recordDate;
          this.form.bank = response.data.data.bankName;
          this.form.bankAccount = response.data.data.bankCard;
          this.form.acountId = response.data.data.accountHolder;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getManagerList() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        managerStatus: 2,
      };
      this.$api
        .getPmList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.options = response.data.data.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    checkName() {
      if (this.isEdit) {
        const params = {
          companyName: this.form.name,
          financeCustomerId: this.$route.params.id,
        };
        this.$api
          .CheckPriName(params)
          .then(response => {
            if (response.respCode == 0) {
              this.$message.error('字号名称已存在')
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        const params = {
          companyName: this.form.name,
        };
        this.$api
          .CheckPriName(params)
          .then(response => {
            if (response.data.respCode != 0) {
              this.$message.error('字号名称已存在')
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  },
  mounted() {

    if (this.$route.name == "editPrivately") {
      this.isEdit = true;
      this.title1 = true;
      this.getOwnDetail();
    } else {
      if (this.$route.name == "newPrivately") {
        this.isOwn = true;
        this.isEdit = false;
        this.title2 = true;
        this.getManagerList()
      }
      if (this.$route.name == "newPlatPrivately") {
        this.isOwn = false;
        this.isEdit = false;
        this.title3 = true;
        this.getManagerList()
      }
    }
  },
  watch: {}
};
</script>
<style scoped>
.box-body-item-title {
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #262626;
  line-height: 40px;
}
.box-body-item {
  margin: 40px;
}
.box-body-form {
  margin: 20px;
}
.line {
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
}
.overflow-box1 {
  font-family: MicrosoftYaHei;
  background-color: #ffffff;
  /*box-shadow: 0px 2px 21px 0px rgba(156, 156, 156, 0.35);*/
  border-radius: 8px;
  margin: 70px auto;
  padding-bottom: 36px;
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
  margin-bottom: 40px;
}
.box-body1 {
  padding: 10px;
  /*height: 300px;*/
}
.workerInp {
  position: relative;
}
.yuan {
  position: absolute;
  right: -20px;
}
.dateWidth {
  width: 346px;
  height: 36px !important;
}
</style>

