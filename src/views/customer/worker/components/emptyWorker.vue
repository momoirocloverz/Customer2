<template>
  <div style="background-color:#f2f2f5;">
    <div>
      <el-form ref="form" :model="form" label-width="110px" labelPosition="left" style="background-color:white;padding-left:20px;">
        <div style="display:flex;align-items:center;padding:20px 20px 20px 0;" class="search-zone">
          <div style="display:flex;align-items:center;">
          <el-input
            class="rant-input inputWidth inputAb"
            placeholder="输入零工姓名搜索"
            v-model="form.name"
            style="width:520px;margin-right:15px"
          ></el-input>
          <!-- searchBtn keyWBtn -->
          <el-button type="primary" style="width:90px;" class="primary-btn" size="mini" @click="checkName">搜索</el-button>
          </div>
          <el-button style="margin-left:20px" class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
        </div>
        <div v-show="isShowComb" class="combine-zone" style="border-top: 1px solid #EAEDF4">
          <!--选择条件的单选按钮-->
        <el-form-item label="分配状态：" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="form.status">
            <el-radio label>不限</el-radio>
            <el-radio label="1">未分配</el-radio>
            <el-radio label="2">已分配</el-radio>
          </el-radio-group>
        </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="splitLine"></div>
    <div style="background-color:white;border:1px solid #E6E7EB;margin-top:18px;">
      <!-- <div style="padding-left:24px;border-bottom: 1px solid #E6E7EB;height:50px;line-height:50px;font-size:12px;">
        <span class="recordNum">符合查询条件的记录{{total}}条</span>
      </div> -->
      <div>
    <el-button
      class="myplain-btn"
       size="mini"
       style="margin:8px 0 8px 24px;width:150px;height:34px;"
      @click="handleAssign"
      :disabled="multipleSelection.length==0"
    >批量分配班务经理</el-button>
        <el-button class="primary-btn" size="mini" style="margin:8px 0 8px 24px;width:98px;height:34px;" @click="RouteToImport">导入名单</el-button>
      </div>
    </div>
    <el-table
      class="table-outline"
      :data="tableDataPlat"
      empty-text="暂无相关信息"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"></el-table-column>
      <el-table-column
        prop="nameAlias"
        :show-overflow-tooltip="true"
        label="姓名"
        align="center"
        min-width="80"
      ></el-table-column>
      <el-table-column
        prop="sexName"
        :show-overflow-tooltip="true"
        label="性别"
        align="center"
        min-width="80"
      ></el-table-column>
      <el-table-column
        prop="idCard"
        :show-overflow-tooltip="true"
        label="身份证号"
        align="center"
        min-width="100"
      ></el-table-column>
      <el-table-column
        prop="managerNameAlias"
        :show-overflow-tooltip="true"
        label="所属班务经理"
        align="center"
        min-width="100"
        :formatter="managerFormatter"
      ></el-table-column>
      <el-table-column
        prop="sign"
        :show-overflow-tooltip="true"
        label="签名"
        align="center"
        min-width="100"
        :formatter="signFormatter"
      ></el-table-column>
      <el-table-column
        prop="createdAt"
        :show-overflow-tooltip="true"
        label="添加时间"
        align="center"
        min-width="100"
      >
        <template slot-scope="scope">
          <span>{{scope.row.createdAt | formatminDate}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="120">
        <template slot-scope="scope">
          <el-button class="btn-icon btn-icon-edit" size="mini" @click="getEmptyTalentSign(scope.row)" type="text">修改签名</el-button>
          <el-button
            class="btn-icon btn-icon-view"
            type="text"
            size="mini"
            v-if="scope.row.sign"
            @click="checkSign(scope.row)"
          >查看签名</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-container" style="background:#ffffff;">
        <el-pagination class="mypagination" @current-change="changePagePlat" :current-page="currentPagePlat" :page-size="pageSize" :total="total" layout="total , prev, pager, next, jumper">
        </el-pagination>
      </div>
    <!-- <div class="page-container">
      <el-pagination
        class="pagebox"
        @current-change="changePagePlat"
        :current-page="currentPagePlat"
        :page-size="pageSize"
        :page-count="pageCountPlat"
        :total="total"
        background
        layout="prev, pager, next"
      ></el-pagination>
    </div> -->

    <el-dialog title :visible.sync="AssignVisible" width="470px" center>
      <div class="dialog-head box-title">
        <span class>分配班务经理</span>
      </div>
      <el-form
        ref="form"
        :model="form"
        label-width="100px"
        label-position="left"
        :rules="rules"
        style="margin-top: 30px;padding: 40px;padding-top: 60px;"
      >
        <el-form-item label="班务经理：" prop="managerUserId">
          <el-select
            v-model="form.managerUserId"
            class="radius-input"
            clearable
            style="width: 100%;"
            placeholder="请选择"
          >
            <el-option
              v-for="(item,index) in PmList"
            :key="index"
             :label="item.nameAlias"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="AssignTask">确 定</el-button>
        <el-button round size="medium" @click="AssignVisible = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改签名start -->
    <el-dialog title="修改签名" :visible.sync="dialogVisibleSign" width="640px">
      <div style="width:584px;height:186px;border:1px solid #EAEDF4;background-color:#F9F9F9;">
        <canvas id="mycanvas"></canvas>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="clearPad">清 空</el-button>
        <el-button type="primary" @click="truePad">确认签名</el-button>
      </span>
    </el-dialog>
    <!-- 修改签名end -->
    <!-- 查看签名start -->
    <el-dialog title="查看签名" :visible.sync="checkDialogVisibleSign" width="640px" class="checkDialog">
      <div style="width:584px;height:186px;border:1px solid #EAEDF4;background-color:#F9F9F9;">
        <img :src="check_Sign" alt="">
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="checkDialogVisibleSign = false">确 认</el-button>
      </span>
    </el-dialog>
    <!-- 查看签名end -->
  </div>
</template>
<script>
import util from "../../../../common/util";
import SignaturePad from 'signature_pad'
export default {
  name: "UserList",
  data() {
    return {
      isShowComb: false,
      dialogVisibleSign: false,
      checkDialogVisibleSign: false,
      multipleSelection: [],
      AssignVisible: false,
      addForm: {},
      rules: {
        NewPassword: [
          { required: true, message: "密码不能为空", trigger: "blur" },
          {
            pattern: /^[a-zA-Z0-9]{6,18}$/,
            message: "密码应为6-18位数字或字母"
          }
        ]
      },
      resetVisible: false,
      form: {
        status: "",
        role: "",
        name: "",
        managerUserId: ""
      },
      tableDataPlat: [],
      currentPagePlat: 1,
      pageCountPlat: 0,
      total: 0,
      pageSize: 20,
      roleList: [],
      selectItem: {},
      PmList: [],
      pad: null,
      upload_form: {},
      signImg: '',
      imgval: '',
      padId: '',
      check_Sign: ''
    };
  },
  watch: {
    "form.status": function(val, oldval) {
      this.currentPagePlat = 1;
      this.getList();
    }
  },
  filters: {
    formatminDate(val) {
      if (val) {
        return util.minDate(val);
      } else {
        return "";
      }
    }
  },
  methods: {
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    initPad(){
      let canvas = document.getElementById('mycanvas')
      canvas.width = 584
      canvas.height = 186
      this.pad = new SignaturePad(canvas)
    },
    clearPad(){
      if(this.pad){
        this.pad.clear()
      }
    },
    truePad(){
      if(this.pad.isEmpty()){
        return this.$message.error('请签字后再保存！')
      }
      this.uploadQiniuyun()
    },
    handleAssign() {
      this.AssignVisible = true;
    },
    AssignTask() {
      if(this.form.managerUserId == ''){
        return this.$message.error('分配班务经理不能为空')
      }
      const params = {
        ids: this.selectIds,
        managerId: this.form.managerUserId
      };
      this.$api
        .pmAssign(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.getList();
            this.AssignVisible = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPmList() {
        let ID = JSON.parse(localStorage.userInfo).customerId || '';
        let params = {
            customerId:ID
        }   
        this.$api.classManagerList(params).then(res => {
            let { respCode,data } = res;
            if(  respCode === 0  ){
                this.PmList = data;
            }
        })
        .catch(error => {
            console.log(error);
        });  
//      const params = {
//        pageNum: 1,
//        pageSize: 0,
//        bindingStatus: 1
//      };
//      this.$api
//        .getPmListCus(params)
//        .then(response => {
//          if (response.data.respCode == 0) {
//            const {
//              data: { list, pages, total, pageNum }
//            } = response.data;
//            this.PmList = list;
//            // console.log(this.PmList);
//          }
//        })
//        .catch(error => {
//          console.log(error);
//        });
    },
    RouteToImport() {
      const { href } = this.$router.resolve({
        name: "WorkerImport"
      });
      window.open(href, "_blank");
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
      this.selectIds = [];
      for (let x in val) {
        this.selectIds.push(val[x].id);
      }
    },
    getEmptyTalentSign(row) {
      this.dialogVisibleSign = !this.dialogVisibleSign
      this.padId = row.id
      // console.log(this.padId)
      this.$nextTick(function(){
        this.initPad()
      })
      
    },
    savePad(){
      let params = {
        id: this.padId,
        sign: this.signImg
      }
      console.log(params)
      this.$api.updateEmptyTalentSign(params).then(res => {
        // console.log(res)
        if(res.data.respCode == 0){
          this.$message.success('签名修改成功！')
          this.dialogVisibleSign = false
          this.getList()
        }
      }).catch()
    },
    getToken() {
      this.$api.getToken().then((response) => {
        const {
          data: {
            fileName, upToken,
          },
        } = response.data;
        if (response.data.respCode == 0) {
          this.upload_form = {
            key: fileName,
            token: upToken,
          }
          // console.log(this.upload_form.token)
        }
      })
        .catch(err => {
        })
    },
    uploadQiniuyun() {
      this.imgval = this.pad.toDataURL().substring(22)
      // console.log(this.imgval)
      // console.log(this.upload_form.token)
      this.$api
        .postImg(
          this.imgval,
          this.upload_form.token
        )
        .then(response => {
          // console.log(response)
          if (response.data.key) {
            // this.$message.success('签字成功！')
            let key = response.data.key;
            this.signImg = `${this.bucketHost}/${key}`
            console.log(this.signImg)
            this.savePad()
          }
          this.getToken()
        })
        .catch(error => {
          console.log(error);
        })
        .finally(() => {
          // this.$indicator.close()
        })
    },
    checkSign(row) {
      console.log(row.sign)
      this.check_Sign = ''
      this.checkDialogVisibleSign = true
      if(row.sign.substr(0,7) == 'http://'){
        this.check_Sign = row.sign
      }else{
        this.check_Sign = `http://${row.sign}`
      }
      // window.open('http://' + row.sign);
      // console.log(row.sign.substr(0,7))
      // if(row.sign.substr(0,7) == 'http://'){
      //   window.open(row.sign)
      // }else{
      //   window.open('http://' + row.sign);
      // }
    },
    reset(row) {
      this.resetVisible = true;
      this.selectItem = row;
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
            this.resetVisible = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getRoleList() {
      const params = {
        pageNum: 1,
        pageSize: 999
      };
      this.$api
        .RoleList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.roleList = response.data.data.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    signFormatter(row, column, cellValue){
      if(cellValue){
        return '已签'
      }else{
        return '未签'
      }
    },
    managerFormatter(row, column, cellValue){
      if(cellValue){
        return cellValue
      }else{
        return '无'
      }
    },
    formatStatus(row) {
      let val = row.status;
      if (val == 1) {
        return "可用";
      } else if (val == 2) {
        return "冻结";
      }
    },
    checkName(){
      this.currentPagePlat = 1
      this.getList()
    },
    getList() {
      const params = {
        pageNum: this.currentPagePlat,
        pageSize: this.pageSize,
        status: this.form.status,
        name: this.form.name
      };
      this.$api
        .emptyWorkerList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableDataPlat = response.data.data.list;
            this.total = response.data.data.total;
            this.pageCountPlat = response.data.data.pages;
//            console.log(this.tableDataPlat);
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    changePagePlat(val) {
      this.currentPagePlat = val;
      this.getList();
    },
    addNew() {
      this.$router.push({ name: "addUser" });
    },
    editItem(row) {
      this.$router.push({ name: "editUser", params: { id: row.id } });
    }
  },
  mounted() {
    this.getList();
    this.getRoleList();
    this.getPmList();
    this.$nextTick(function(){
      this.getToken()
    })
  }
};
</script>
<style scope>
.checkDialog .el-button--primary{
  width: 90px;
  font-size: 12px;
}
.el-dialog__footer{
  padding-bottom: 10px !important;
}
.el-button--primary{
  width: 112px;
  height: 36px;
  line-height: 8px;
}
.el-button--default{
  width: 90px;
  height: 36px;
  line-height: 8px;
}
.el-input__inner{
  height: 34px;
}
</style>

<style scoped>
.box-title span {
  padding-bottom: 10px;
  border-bottom: 3px solid #e84518;
  border-radius: 1px;
}
</style>
