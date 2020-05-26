<template>
  <div class="back-white">
    <search-bar @handleSearch="handleSearch"></search-bar>

    <div class="back-white btn-div flexable">
      <el-button class="primary-btn" size="mini" @click="addNew">新增角色</el-button>
    </div>

    <div class="table-box">
      <el-table class="table-outline" :data="tableDataPlat">
        <el-table-column prop="roleName" :show-overflow-tooltip="true" label="角色名" align="center" min-width="180"></el-table-column>
        <el-table-column prop="createdAt" :show-overflow-tooltip="true" label="创建时间" align="center" min-width="180">
        </el-table-column>
        <el-table-column label="操作" min-width="180" align="center">
          <template slot-scope="scope">
            <el-button type="text" size="small" class="btn-icon btn-icon-edit" @click="editRole(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="mypagination" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCountPlat" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :title="title" :visible.sync="confirmDia" v-if="confirmDia" width="540px" class="base-dialog">
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form ref="form1" :model="addForm" label-width="80px" label-position="right" :rules="managerFormrules">
              <el-form-item label="角色名：" prop="roleName" class="el_form_item">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.roleName"></el-input>
              </el-form-item>
              <el-form-item label="权限：" prop="" label-width="60px" class="el_form_items">
                <el-tree :data="tree" node-key="id" ref="tree" show-checkbox highlight-current :default-checked-keys="permissionIds" :props="defaultProps" style="width:220px;float:left;">
                </el-tree>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="box-footer">
        <el-button size="medium" type="primary" v-if="title == '新增角色'" @click="submitOwn">保 存</el-button>
        <el-button size="medium" type="primary" v-if="title == '编辑角色'" @click="edit">保 存</el-button>
        <el-button size="medium" @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import SearchBar from '@/components/SearchBar'
  export default {
    name: "RoleList",
    components: { SearchBar },
    data() {
      return {
        form: {
          name: ""
        },
        pageSize: 20,
        confirmDia: false,
        title: '新增角色',
        id: '',
        permissionIds: [],
        defaultProps: {
          children: "permissionList",
          label: "permission"
        },
        tree: [],
        addForm: {
          roleName: '',
          name: "",
          account: "",
          password: "",
          phone: "",
          status: ""
        },
        options: [],
        childIds: [],
        parentIds: [],
        isEdit: false,
        tableDataPlat: [],
        currentPage: 1,
        pageCountPlat: 0,
        total: 0,
        emptyTalentSwitch: 0,
        // pageCount:0,
        managerFormrules: {
          name: [
            {
              required: true,
              message: "角色不能为空",
              trigger: "blur"
            }
          ]
        },
      };
    },
    mounted() {
      this.getList();
      this.isEdit = this.$route.meta.isEdit
      this.getListAdd()
      if(JSON.parse(localStorage.getItem('userInfo'))!=null){
        this.emptyTalentSwitch = JSON.parse(localStorage.getItem('userInfo')).emptyTalentSwitch
      }
    },
    methods: {
      handleSearch(keyword) {
        this.form.name = keyword
        this.getList()
      },
      cancel() {
        this.confirmDia = false
        this.addForm = {}
      },
      // 新增角色/编辑角色start
      getCurrentPermissions() {
        const params = {
          roleId: this.id
        }
        this.$api
                .ViewRole(params)
                .then(response => {
                  if (response.respCode == 0) {
                    this.addForm.description = response.data.description;
                    this.addForm.roleName = response.data.roleName;
                    //          this.defaultCheckedKeys=res.data.data.permIdList;
                    this.permissionIds = response.data.permissionIds;
                    console.log(this.permissionIds)
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      getListAdd() {          
        this.$api.TreePermission({}).then(response => {
                  if (response.data.respCode == 0) {
                    if(this.emptyTalentSwitch == 1){
                      this.tree = response.data.data;
                    }else if(this.emptyTalentSwitch == 2){
                      this.tree = response.data.data;
                      console.log(this.tree)
                      let newArr = []
                      this.tree.forEach(item => {
                        if(item.permission == '零工管理'){
                          newArr = item.permissionList
                        }
                      })
                      console.log(newArr)
                      let permissionArr = []
                      newArr.forEach(item => {
                        if(item.permission != '特殊考勤人员'){
                          permissionArr.push(item)
                        }
                      })
                      console.log(permissionArr)
                      this.tree.forEach(item => {
                        if(item.permission == '零工管理'){
                          item.permissionList = permissionArr
                        }
                      })
                    }
                    // this.total = response.data.data.total;
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      edit() {
        let _this = this;
        this.$refs.form1.validate(valid => {
          if (valid) {
            let _arrId = [];
            let _list = this.$refs.tree.getCheckedNodes();
            if(_list.length === 0){
              _this.$message.error(`请选择权限`);
              return;
            }
            _arrId = _list.map(item => {
              return item.id
            });
            const params = {
              roleName: this.addForm.roleName,
              description: this.addForm.description,
              permissionIds: _arrId,
              id: this.id
            };
            this.$api
                    .EditRole(params)
                    .then(response => {
                      if (response.data.respCode == 0) {
                        this.$message.success(`编辑成功`);
                        // this.$router.go(-1);
                        this.confirmDia = false
                        this.getList()
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
      submitOwn() {
        let _this = this;
        this.$refs.form1.validate(valid => {
          if (valid) {
            let _arrId = [];
            let _list = this.$refs.tree.getCheckedNodes();
            if(_list.length === 0){
              _this.$message.error(`请选择权限`);
              return;
            }
            _arrId = _list.map(item => {
              return item.id
            });
            let params = {
              roleName: this.addForm.roleName,
              description: this.addForm.description,
              permissionIds:_arrId
            };
            this.$api
                    .AddRole(params)
                    .then(response => {
                      if (response.data.respCode == 0) {
                        this.$message.success(`新增成功`);
                        this.confirmDia = false
                        this.getList()
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
      // 新增角色/编辑角色end
      editRole(row) {
        console.log(row)
        // this.$router.push({ name: 'editRole', params: { id: row.id } })
        this.confirmDia = true
        this.title = '编辑角色'
        this.id = row.id
        this.addForm = row
        this.permissionIds = row.permissionIds
      },
      deleteRole(row) {
        const params = {
          id: row.id,
          status: 2
        }
        this.$api
                .EditUser(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.$message.success('删除成功！')
                    this.getList()
                  }
                })
                .catch(error => {
                  console.log(error);
                });
      },
      getList() {
        const params = {
          pageNum: this.currentPage,
          pageSize: 20,
          roleName: this.form.name,
        };
        this.$api
                .RoleList(params)
                .then(response => {
                  if (response.data.respCode == 0) {
                    this.tableDataPlat = response.data.data.list;
                    this.total = response.data.data.total;
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
        // this.$router.push({ name: "addRole" });
        this.confirmDia = true
        this.title = '新增角色'
        this.permissionIds = []
        this.addForm.roleName = ''
      },
      save() {
        this.$refs.formManger.validate(valid => {
          if (valid) {
            const params = {
              managerId: this.addForm.name,
            };
            this.$api
                    .AddRole(params)
                    .then(response => {
                      if (response.data.respCode == 0) {
                        this.$message.success("新增成功");
                        this.getList();
                        this.confirmDia = false;
                        this.addForm.name = "";
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
    },
  };
</script>
<style scoped>
  .el_form_item {
    margin-left: 80px;
  }
  .el_form_items {
    margin-left: 100px;
  }
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
  .box-body-item-title {
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #262626;
    line-height: 40px;
  }
  .box-body-item {
    /* margin: 40px; */
  }
  .box-body-form {
    /* margin: 20px; */
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
    margin-left: -100px;
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
