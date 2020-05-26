<template>
  <div>
    <div class="overflow-box1" style="width:646px;">
      <div class="box-title" v-if="!isEdit"><span>新增角色</span></div>
      <div class="box-title" v-else><span>编辑角色</span></div>
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form ref="form1" :model="addForm" label-width="110px" label-position="left" :rules="rules">
              <el-form-item label="角色名：" prop="roleName">
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="addForm.roleName"></el-input>
              </el-form-item>
              <!--<el-form-item label="描述：" prop="description">-->
              <!--<el-input class="radius-input workerInp" type="textarea" placeholder="" size="medium" v-model="addForm.description"></el-input>-->
              <!--</el-form-item>-->
              <el-form-item label="权限：" prop="">
                <el-tree :data="tree" node-key="id" ref="tree" show-checkbox highlight-current :default-checked-keys="permissionIds" :props="defaultProps" style="width:400px;float:left">
                </el-tree>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="box-footer">
        <el-button size="medium" type="primary" v-if="!isEdit" @click="submitOwn">保 存</el-button>
        <el-button size="medium" type="primary" v-if="isEdit" @click="edit">保 存</el-button>
        <el-button size="medium" @click="$router.go(-1)">取 消</el-button>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "AddUser",
  data() {
    return {
      //          rules:{
      //            roleName:[
      //              { required: true, message: '角色名不能为空', trigger: 'blur' },
      //              {max: 128, message: '长度不超过128字', trigger: 'blur'}
      //            ],
      //          },
      permissionIds: [],
      defaultProps: {
        children: "permissionList",
        label: "permission"
      },
      tree: [],
      addForm: {
        name: "",
        account: "",
        password: "",
        phone: "",
        status: ""
      },
      options: [
        {
          label: '可用',
          value: 0,
        },
        {
          label: '禁用',
          value: 1,
        },
      ],
      childIds: [],
      parentIds: [],
      isEdit: false

    };
  },
  mounted() {
    this.isEdit = this.$route.meta.isEdit
    this.getList()
    if (this.isEdit) {
      this.getCurrentPermissions()
    }
  },
  methods: {
    getCurrentPermissions() {
      const params = {
        roleId: this.$route.params.id
      }
      this.$api
        .ViewRole(params)
        .then(response => {
          if (response.respCode == 0) {
            this.addForm.description = response.data.description;
            this.addForm.roleName = response.data.roleName;
            //          this.defaultCheckedKeys=res.data.data.permIdList;
            this.permissionIds = response.data.permissionIds;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getList() {
      this.$api
        .TreePermission({})
        .then(response => {
          if (response.data.respCode == 0) {
            this.tree = response.data.data;
            // this.total = response.data.data.total;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    edit() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.getFinalCheckKeys()
          const finalArray = this.childIds.concat(this.parentIds);
          const uniqFinalArray = Array.from(new Set(finalArray));
          // eslint-disable-next-line
          uniqFinalArray.filter((arr) => {
            return arr !== 0;
          });
          const params = {
            roleName: this.addForm.roleName,
            description: this.addForm.description,
            permissionIds: uniqFinalArray,
            id: this.$route.params.id
          };
          this.$api
            .EditRole(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success(`编辑成功`);
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
    submitOwn() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          this.getFinalCheckKeys()
          const finalArray = this.childIds.concat(this.parentIds);
          const uniqFinalArray = Array.from(new Set(finalArray));
          // eslint-disable-next-line
          uniqFinalArray.filter((arr) => {
            return arr !== 0;
          });
          const params = {
            roleName: this.addForm.roleName,
            description: this.addForm.description,
            permissionIds: uniqFinalArray
          };
          this.$api
            .AddRole(params)
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
    getParentIds(node) {
      this.parentIds.push(node.data.id)
      if (node.data.parentId) {
        this.getParentIds(this.$refs.tree.getNode(node.data.parentId))
      }
    },
    getFinalCheckKeys(array) {
      // eslint-disable-next-line
      const childArray = this.$refs.tree.getCheckedNodes().map((node) => {
        if (node.parentId) {
          this.getParentIds(this.$refs.tree.getNode(node.parentId))
        }
        return node.id;
      });
      this.childIds = childArray;
      // eslint-disable-next-line


    },
  }
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
