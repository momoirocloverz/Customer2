<template>
  <div class="overflow-box">
    <div class="box-title" v-if="!isEdit">新增系统用户</div>
    <div class="box-title" v-if="isEdit">编辑系统用户</div>
    <div class="box-body">
      <div class="box-body-item">
        <div class="box-body-form">
          <el-form ref="form1" :model="addForm" label-width="110px" label-position="left" :rules="rules">
            <el-form-item label="姓名：" prop="realName">
              <el-input class="radius-input workerInp" placeholder="" size="medium" v-model.trim="addForm.realName" maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="账号：" prop="loginName">
              <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.loginName" @blur="loginNameCheck"></el-input>
            </el-form-item>
            <el-form-item label="密码：" prop="password" v-if="!this.isEdit">
              <el-input type="password" class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.password"></el-input>
            </el-form-item>
            <el-form-item label="绑定手机号：" prop="mobile">
              <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.mobile"></el-input>
            </el-form-item>
            <el-form-item label="角色：" prop="roleIdList">
              <el-select v-model="addForm.roleIdList" class="radius-input " @change="$forceUpdate()" multiple filterable style="width: 100%;" placeholder="请选择">
                <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="状态：" prop="status" v-if="isEdit">
              <el-select v-model="addForm.status" class="radius-input " style="width: 100%;" placeholder="请选择">
                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <el-button size="medium" type="primary" @click="submitOwn">保 存</el-button>
      <el-button size="medium" @click="goBack">取 消</el-button>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddUser",
  data() {
    let missionPass = (rule, value, callback) => {
      console.log(value)
      if (!value) {
        callback(new Error('角色不能为空'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        realName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' },
          { max: 12, message: '长度不超过12字', trigger: 'blur' }
        ],
        loginName: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{1,128}$/,
            message: "账号应为数字或字母",
          },
          { max: 128, message: '长度不超过128字', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{6,18}$/,
            message: "密码应为6-18位数字或字母",
          },
        ],
        mobile: [
          { required: true, message: '绑定手机号不能为空', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "请输入正确的手机号"
          },
          { pattern: /^[1-9][0-9]*$/, message: '绑定手机号必须全为数字' }
        ],
        roleIdList: [
          { required: true, message: '角色不能为空', trigger: 'change' },],
      },
      addForm: {
        name: "",
        account: "",
        phone: "",
        status: '',
        roleIdList: []
      },
      options: [
        {
          label: "可用",
          value: 1
        },
        {
          label: "冻结",
          value: 2
        }
      ],
      roleList: [],
      isEdit: false
    };
  },
  mounted() {
    this.getList()
    if (this.$route.name == "editUser") {
      this.isEdit = true;
      this.getDetail()
    } else {
      this.isEdit = false;
    }
  },
  methods: {
    loginNameCheck() {
      if (this.addForm.loginName) {
        const params = {
          loginName: this.addForm.loginName,
          userType: 1,
        }
        this.$api
          .checkUsername(params)
          .then(response => {
            if (response.data.respCode == 0) {
              if (response.data.data == false) {
                this.$message.error('账号已存在，请更换')
              }

            } else {
              this.$message.error(response.errorMsg)
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    },
    getList() {
      const params = {
        pageNum: 1,
        pageSize: 999,
      };
      debugger
      this.$api
        .RoleList(params)
        .then(response => {
          console.log('$'.repeat(20))
          console.info(response.respCode)
          console.info(response.data.list)
          if (response.respCode == 0) {
            this.roleList = response.data.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getDetail() {
      const params = {
        id: this.$route.params.id
      };
      this.$api
        .RoleDetail(params)
        .then(response => {
          this.addForm = response.data;
          if (!this.addForm.roleIdList) {
            this.addForm.roleIdList = []
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    submitOwn() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            const params = {
              realName: this.addForm.realName,
              loginName: this.addForm.loginName,
              password: this.addForm.password,
              mobile: this.addForm.mobile,
              roleIdList: this.addForm.roleIdList,
              userType: 2,
            };
            this.$api
              .AddUser(params)
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
            const params = {
              id: this.$route.params.id,
              realName: this.addForm.realName,
              loginName: this.addForm.loginName,
              mobile: this.addForm.mobile,
              roleIdList: this.addForm.roleIdList,
              status: this.addForm.status,
              userType: 2,
            };
            this.$api
              .EditUser(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success(`编辑成功`);
                  this.$router.go(-1);
                }
              })
              .catch(error => {
                console.log(error);
              });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
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
  box-shadow: 0px 2px 21px 0px rgba(156, 156, 156, 0.35);
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
