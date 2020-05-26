<template>
  <div class="back-white">
    <div>
      <search-bar combCondition="true" @handleSearch="handleSearch">
        <el-form ref="form" :model="form">
          <!--选择条件的单选按钮-->
          <el-form-item label="状态：" class="formSearchMargin formSearchMarginTop">
            <el-radio-group class="radio-search" v-model="form.status">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">可用</el-radio>
              <el-radio label="2">冻结</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="角色：" class="formSearchMargin">
            <el-radio-group class="radio-search" v-model="form.role">
              <el-radio label="">不限</el-radio>
              <el-radio v-for="(item,index) in roleList" :key="index" :label="item.id">{{item.roleName}}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </search-bar>
    </div>

    <div class="back-white btn-div flexable">
      <el-button class="primary-btn" size="mini" @click="addNew" style="width:135px;">新增系统用户</el-button>
    </div>

    <el-table class="table-outline" :data="tableDataPlat" empty-text="暂无相关用户信息">
      <el-table-column type="expand">
        <template slot-scope="scope">
          <div class="table-style">
            <div class="table-tr">
              <p class="table-td"><span class="td-title">创建时间：</span>{{scope.row.createdAt}}</p>
              <p class="table-td"><span class="td-title">最近登录时间：</span>{{scope.row.lastLoginTime}}</p>
              <p class="table-td"><span class="td-title">最近登录IP：</span>{{scope.row.loginIp}}</p>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="姓名" prop="realName" show-overflow-tooltip align="center" min-width="100"></el-table-column>
      <el-table-column label="角色" prop="roleList" :formatter="roleFormatter" show-overflow-tooltip align="center" min-width="130"></el-table-column>
      <el-table-column label="账号" prop="loginName" show-overflow-tooltip align="center" min-width="140"></el-table-column>
      <el-table-column label="绑定手机号" prop="mobile" show-overflow-tooltip align="center" min-width="110"></el-table-column>
      <el-table-column label="状态" prop="status" show-overflow-tooltip :formatter="formatStatus" align="center" min-width="80"></el-table-column>
      <el-table-column label="操作" min-width="80">
        <template slot-scope="scope">
          <el-button type="text" size="mini" class="btn-icon btn-icon-edit" @click="editItem(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container">
      <el-pagination class="mypagination" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <!-- 新增/编辑系统用户 -->
    <el-dialog :title="title" :visible.sync="systemVisible" v-if="systemVisible" width="540px" :before-close="emptyData">
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form ref="form1" :model="systemAddForm" label-width="110px" label-position="right" :rules="systemRules">
              <el-form-item label="姓名：" prop="realName">
                <el-input class="radius-input workerInp" size="medium" v-model.trim="systemAddForm.realName" maxlength="12"></el-input>
              </el-form-item>
              <el-form-item label="账号：" prop="loginName">
                <el-input class="radius-input workerInp" size="medium" v-model="systemAddForm.loginName" @blur="loginNameCheck"></el-input>
              </el-form-item>
              <el-form-item label="密码：" prop="password" v-if="!this.isEdit">
                <el-input type="password" class="radius-input workerInp" size="medium" v-model="systemAddForm.password"></el-input>
              </el-form-item>
              <el-form-item label="绑定手机号：" prop="mobile">
                <el-input class="radius-input workerInp" size="medium" v-model="systemAddForm.mobile"></el-input>
              </el-form-item>
              <el-form-item label="角色：">
                <el-select v-model="systemAddForm.roleIdList" class="radius-input " @change="$forceUpdate()" multiple filterable style="width: 220px" placeholder="请选择">
                  <el-option v-for="item in roleList" :key="item.id" :label="item.roleName" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="状态：" prop="status" v-if="isEdit">
                <el-select v-model="systemAddForm.status" class="radius-input " style="width: 100%;" placeholder="请选择">
                  <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" @click="submitOwn">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import SearchBar from '@/components/SearchBar'

export default {
  name: "UserList",
  components: { SearchBar },
  data() {
    return {
      systemVisible: false,
      name: "UserList",
      addForm: {},
      pageSize: 999,
      rules: {
        NewPassword: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
          {
            pattern: /^[a-zA-Z0-9]{6,18}$/,
            message: "密码应为6-18位数字或字母",
          },
        ],
      },
      systemRules: {
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
      systemAddForm: {
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
      systemRoleList: [],
      id: '',
      isEdit: false,
      resetVisible: false,
      form: {
        status: "",
        role: "",
        name: ""
      },
      tableDataPlat: [],
      currentPage: 1,
      pageCountPlat: 1,
      total: 0,
      roleList: [],
      selectItem: {},
      title: '新增系统用户'
    };
  },
  mounted() {
    this.getList()
    this.getRoleList()
  },
  watch: {
    'form.role': function (val, oldval) {
      this.currentPage = 1
      this.getList()
    },
    'form.status': function (val, oldval) {
      this.currentPage = 1
      this.getList()
    }
  },
  methods: {
    // roleFormatter(row, column, cellValue, index) {
    //   let value = cellValue || []
    //   let result = []
    //   value.forEach(item => {
    //     result.push(item.roleName)
    //   })
    //   return result.join(' ')
    // },
    roleFormatter(row, column, cellValue, index) {
      let result = []
      if(cellValue){
        cellValue.forEach(item => {
          result.push(item.roleName)
        })
        return result.join(' ')
      }else{
        return '无'
      }
    },
    handleSearch(keyword) {
      this.form.userName = keyword
      this.getList()
    },
    emptyData(done) {
      this.systemAddForm = {}
      done()
    },
    // 新增/编辑系统用户start
    loginNameCheck() {
      if (this.systemAddForm.loginName) {
        const params = {
          loginName: this.systemAddForm.loginName,
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
    submitOwn() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          if (!this.isEdit) {
            const params = {
              realName: this.systemAddForm.realName,
              loginName: this.systemAddForm.loginName,
              password: this.systemAddForm.password,
              mobile: this.systemAddForm.mobile,
              roleIdList: this.systemAddForm.roleIdList,
              userType: 2,
            };
            this.$api
              .AddUser(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success(`新增成功`);
                  this.systemVisible = false
                  this.getList()
                }

              })
              .catch(error => {
                console.log(error);
              });
          } else {
            if(this.systemAddForm.roleIdList.length == 0){
              return this.$message.error('角色不能为空！')
            }
            const params = {
              id: this.id,
              realName: this.systemAddForm.realName,
              loginName: this.systemAddForm.loginName,
              mobile: this.systemAddForm.mobile,
              roleIdList: this.systemAddForm.roleIdList,
              status: this.systemAddForm.status,
              userType: 2,
            };
            this.$api
              .EditUser(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success(`编辑成功`);
                  this.systemVisible = false
                  this.getList()
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
    cancel() {
      this.systemVisible = false
      this.systemAddForm = {
        name: "",
        account: "",
        phone: "",
        status: '',
        roleIdList: []
      }
    },
    // 新增/编辑系统用户end
    reset(row) {
      this.resetVisible = true
      this.selectItem = row
    },
    handleReset() {
      const params = {
        id: this.selectItem.id,
        NewPassword: this.addForm.NewPassword
      };
      this.$api
        .EditUser(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$message.success(`密码重置成功`);
            this.resetVisible = false
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRoleList() {
      const params = {
        pageNum: 1,
        pageSize: 999,
      };
      this.$api
        .RoleList(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.roleList = response.data.data.list
            // if(!sessionStorage.getItem('roleList')){
            //   sessionStorage.setItem('roleList',JSON.stringify(response.data.data.list))
            // }else{
            //   sessionStorage.removeItem('roleList')
            // }
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    formatStatus(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '可用'
      } else if (cellValue == 2) {
        return '冻结'
      }
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        userName: this.form.userName,
        roleId: this.form.role,
        status: this.form.status
      };
      this.$api
        .UserList(params)
        .then(response => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.tableDataPlat = response.data.data.list;
            this.total = response.data.data.total;
            this.pageCountPlat = response.data.data.pages
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    addNew() {
      this.systemVisible = true
      this.title = "新增系统用户"
      this.isEdit = false
      // this.roleList = JSON.parse(sessionStorage.getItem('roleList'))
      this.getRoleList()
    },
    editItem(row) {
      console.log(row)
      this.getRoleList()
      // this.roleList = JSON.parse(sessionStorage.getItem('roleList'))
      console.log(this.roleList)
      this.title = "编辑系统用户"
      this.systemVisible = true
      this.isEdit = true
      this.id = row.id
      this.systemAddForm = row
      this.systemAddForm.roleIdList = []
      row.roleList && row.roleList.forEach(item => {
        this.systemAddForm.roleIdList.push(item.id)
      })
    },
  },
};
</script>
<style scoped>
.myplain-btn1 {
  padding: 10px 12px;
  color: #e84518;
  width: 150px;
  height: 32px;
  background-color: #ffffff;
  border: solid 1px #e84518;
  border-radius: 0;
  font-size: 12px !important;
}
.bodyDiv {
  padding: 20px 26px 0;
}
/* 新增/编辑系统用户 */
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
  width: 220px;
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
