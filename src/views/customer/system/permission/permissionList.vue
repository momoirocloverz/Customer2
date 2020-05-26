<template>
  <div class="back-white">
    <div class="margintop">
      <el-button type="primary" size="small" @click="handleFdialog" style="margin:10px 10px 10px 0px">添加权限</el-button>
      <el-button type="primary" size="small" @click="handleSdialog" style="margin:10px 10px 10px 0px">添加子权限</el-button>
      <el-button type="primary" size="small" @click="modifyDialog=true" style="margin:10px 10px 10px 0px" v-if="pId != ''">修改</el-button>
      <el-button type="primary" size="small" @click="deleteItem" style="margin:10px 10px 10px 0px" v-if="pId != ''">删除</el-button>
    </div>
    <div style="overflow:hidden">
      <el-tree :data="tree" node-key="id" ref="tree" highlight-current :props="defaultProps" @node-click="nodeClick" style="width:400px;float:left">
      </el-tree>
      <div style="float:left" class="marginleft  detail">
        <p>权限名称：{{this.modifyDia.permission}}</p>
        <p>权限链接：{{this.modifyDia.url}}</p>
        <p>权限代码：{{this.modifyDia.permCode}}</p>
        <p>权限类型：{{this.modifyDia.permType}}</p>
        <p>权限描述：{{this.modifyDia.description}}</p>
      </div>
    </div>

    <el-dialog title="添加权限" :visible.sync="addParentDia" center>
      <el-form :model="firstinfo" ref="firstinfoForm">
        <el-form-item label="权限名称：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="firstinfo.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限链接：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="firstinfo.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限代码“：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="firstinfo.permCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限类型：" prop="name" :label-width="formLabelWidth">
          <el-select v-model="firstinfo.type" class="radius-input " style="width: 100%;" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述：" prop="description" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="firstinfo.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="addParentDia=false">取 消</el-button>
        <el-button round size="medium" type="primary" @click="handleFirstAdd">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="添加子权限" :visible.sync="addSonDia" center>
      <el-form :model="secondinfo" ref="secondinfoForm">
        <el-form-item label="权限名称：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="secondinfo.name" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限链接：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="secondinfo.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限代码：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="secondinfo.permCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限类型：" prop="name" :label-width="formLabelWidth">
          <el-select v-model="secondinfo.type" class="radius-input " style="width: 100%;" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述：" prop="description" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="secondinfo.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="addSonDia=false">取 消</el-button>
        <el-button round size="medium" type="primary" @click="handleSecondAdd">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog title="编辑权限信息" :visible.sync="modifyDialog" center>
      <el-form :model="modifyDia" ref="firstinfoForm">
        <el-form-item label="权限名称：" prop="description" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="modifyDia.permission" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限链接：" prop="name" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="modifyDia.url" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限代码" prop="description" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="modifyDia.permCode" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="权限类型：" prop="name" :label-width="formLabelWidth">
          <el-select v-model="modifyDia.permType" class="radius-input " style="width: 100%;" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限描述" prop="description" :label-width="formLabelWidth">
          <el-input class="radius-input" v-model="modifyDia.description" auto-complete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button round size="medium" @click="modifyDialog=false">取 消</el-button>
        <el-button round size="medium" type="primary" @click="handEditPermission">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="" :visible.sync="confirmDia" width="600px" center>
      <div class="dialog-head">
        <span>确认删除权限吗?</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="removepermission">确 认</el-button>
        <el-button round size="medium" @click="confirmDia = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "permissionList",
  data() {
    return {
      defaultProps: {
        children: "permissionList",
        label: "permission"
      },
      node: {},
      expand: [],
      tree: [],
      modifyDialog: false,
      addSonDia: false,
      addParentDia: false,
      formLabelWidth: "100px",
      firstinfo: {
        name: "",
        description: "",
        permCode: "",
        url: "",
        type: "",
      },
      secondinfo: {
        parentId: "",
        name: "",
        description: "",
        permCode: "",
        url: "",
        type: "",
      },
      modifyDia: {
        permission: "",
        description: "",
        permCode: ""
      },
      options: [
        {
          label: '功能',
          value: 0,
        },
        {
          label: '操作',
          value: 1,
        },
        {
          label: 'app',
          value: 2,
        }
      ],
      pId: '',
      confirmDia: false,
      data: []
    };
  },
  methods: {
    nodeClick(data, node) {
      console.log(data);
      console.log(node);
      this.pId = data.id;
      this.parentId = data.parentId;
      this.des = data.description;
      this.modifyDia = data;
      this.node = node;
      this.data = data;
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
    handleFdialog() {
      this.addParentDia = true;
      this.firstinfo.permCode = "";
      this.$refs["firstinfoForm"].resetFields();
    },
    handleSdialog() {
      this.addSonDia = true;
      this.secondinfo.permCode = "";
      this.$refs["secondinfoForm"].resetFields();
    },
    handleFirstAdd() {
      const params = {
        parentId: 0,
        permission: this.firstinfo.name,
        description: this.firstinfo.description,
        permCode: this.firstinfo.permCode,
        url: this.firstinfo.url,
        permType: this.firstinfo.type,
      };
      this.$api
        .AddPermission(params)
        .then(response => {
          this.$message.success(`添加成功`);
          this.addParentDia = false;
          this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    handEditPermission() {
      //修改
      const params = {
        id: this.pId,
        description: this.modifyDia.description,
        permCode: this.modifyDia.permCode,
        permission: this.modifyDia.permission,
        url: this.modifyDia.url,
        permType: this.modifyDia.permType,
      };
      this.$api
        .EditPermission(params)
        .then(response => {
          this.$message.success(`修改成功`);
          this.modifyDialog = false;
          this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleSecondAdd() {
      const params = {
        parentId: this.pId,
        permission: this.secondinfo.name,
        description: this.secondinfo.description,
        permCode: this.secondinfo.permCode,
        url: this.secondinfo.url,
        permType: this.secondinfo.type,
      };
      this.$api
        .AddPermission(params)
        .then(response => {
          this.$message.success(`添加成功`);
          this.addSonDia = false;
          this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    removepermission() {
      const params = {
        deleteIds: (this.data.id).toString(),
      };
      this.$api
        .DeletePermission(params)
        .then(response => {
          this.$message.success(`删除成功`);
          this.confirmDia = false;
          this.getList();
        })
        .catch(error => {
          console.log(error);
        });
    },
    deleteItem() {
      this.confirmDia = true
    }
  },
  mounted() {
    this.getList();
  },
  watch: {
    'modifyDia.permType': function (val, oldVal) {
      if (val == 0) {
        this.modifyDia.permType = '功能'
      }
      if (val == 1) {
        this.modifyDia.permType = '操作'
      }
      if (val == 2) {
        this.modifyDia.permType = 'app'
      }
    }
  }
};
</script>
<style scoped>
.detail {
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 1px;
  color: #606266;
}
.margintop {
  margin-top: 25px;
}
</style>
