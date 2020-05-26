<template>
  <div>
    <h1
      style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;border-bottom:1px solid #EAEDF4;"
    >第一步，确认收入</h1>
    <h1
      style="color:#5C5C5C;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;display:flex;align-items: center;"
    >
      <span class="h1_span"></span>&nbsp;
      <span>班务收入&nbsp;&nbsp;&nbsp;{{taskShouRu?taskShouRu.toFixed(2):0}}</span>
    </h1>
    <el-table :data="tableData" empty-text="暂无相关信息" :header-row-class-name='getRowClass'>
      <el-table-column
        label="班务"
        prop="taskName"
        show-overflow-tooltip
        align="center"
        min-width="80"
      ></el-table-column>
      <el-table-column
        label="工时"
        prop="workHours"
        show-overflow-tooltip
        align="center"
        min-width="80"
      ></el-table-column>
      <el-table-column label="产量" align="center">
        <el-table-column label="件" prop="jian" show-overflow-tooltip align="center" min-width="50"></el-table-column>
        <el-table-column label="袋" prop="dai" show-overflow-tooltip align="center" min-width="50"></el-table-column>
        <el-table-column label="车" prop="che" show-overflow-tooltip align="center" min-width="50"></el-table-column>
        <el-table-column label="吨" prop="dun" show-overflow-tooltip align="center" min-width="50"></el-table-column>
      </el-table-column>
      <el-table-column label="单价" prop="price" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column
        label="原金额(元)"
        prop="salary"
        show-overflow-tooltip
        align="center"
        min-width="80"
      >
        <template v-slot="scope"><span>{{scope.row.salary?scope.row.salary.toFixed(2):0}}</span></template>
      </el-table-column>
      <el-table-column label="调整金额(元)" show-overflow-tooltip align="center" min-width="80">
        <template v-slot="scope">
          <span>{{scope.row.resetMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column label="调整后金额(元)" show-overflow-tooltip align="center" min-width="80">
        <template v-slot="scope">
          <span>{{scope.row.resetSalary?scope.row.resetSalary.toFixed(2):0}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" min-width="180">
        <template v-slot="scope">
          <el-button
            type="text"
            class="btn-icon btn-icon-edit"
            size="mini"
            @click="openDialog(scope.row)"
          >调整</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- <h1 style="color:#5C5C5C;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;display:flex;align-items: center;border-bottom:1px solid #EAEDF4;">
            <span class="h1_span"></span>&nbsp;<span>其他收入</span>
    </h1>-->
    <!--<h1-->
      <!--style="color:#5C5C5C;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;display:flex;align-items: center;border-bottom:1px solid #EAEDF4;"-->
    <!--&gt;-->
      <!--<span class="h1_span"></span>&nbsp;-->
      <!--<span>派工收入&nbsp;&nbsp;&nbsp;{{taskBack || 0}}</span>元-->
    <!--</h1>-->
    <div style="background:#ffffff;padding: 12px 0 12px 35px;">
      <el-button style="font-size:12px;" size="medium" @click="cancel" id="btn_ert">取消</el-button>
      <el-button
        style="width:102px;height:36px;"
        type="primary"
        size="small"
        class="datesearchBtn"
        @click="goToNext"
      >下一步</el-button>&nbsp;&nbsp;&nbsp;
      <span style="color:#383838;">收入总计： {{(taskShouRu + taskBack).toFixed(2) || 0}}</span>
    </div>
    <!-- 弹窗 -->
    <el-dialog title="调整" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="540px">
      <el-form :model="form" :rules="rules">
        <el-form-item label="调整方式：" label-width="220px">
          <el-select v-model="form.region" placeholder="请选择调整方式">
            <el-option label="增加" value="增加"></el-option>
            <el-option label="扣减" value="扣减"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="调整金额：" prop="amount" label-width="220px">
          <el-input v-model="form.amount" style="width:220px;" @keyup.native="keyUpCost"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="comfrim(row)">确 认</el-button>
        <el-button @click="cancelText">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      dialogFormVisible: false,
      form: {
        amount: "",
        region: ""
      },
      manageId: "",
      month: "",
      managerName: "",
      taskBack: 0,
      nullObj: {},
      row: {},
      id: "",
      taskShouRu: 0,
      newObj: {},
      paiObj: {},
      newTableData: [],
      onceClick: true,
      rules: {
        amount: [
          { required: true, message: "调整金额不能为空", trigger: "blur" }
        ]
      }
    };
  },
  watch: {
    dialogFormVisible: {
      handler(val, old) {
        if (val == false) {
          this.form.amount = "";
          this.form.region = "";
          this.dialogFormVisible = false;
        }
      }
    }
  },
  mounted() {
    // this.getData()
  },
  methods: {
    getRowClass ({row, column, rowIndex, columnIndex}) {
      if (rowIndex === 0) {
        return 'row-cus-border'
      } else {
        return ''
      }
    },
    getData() {
      const params = {
        managerId: this.manageId,
        month: this.month
      };
      this.$api
        .taskQuery(params)
        .then(res => {
          console.log(res);
          if (res.respCode == 0) {
            if (res.data && res.data.taskBack) {
              this.tableData = res.data.taskQueryDTOList;
              this.taskBack = res.data.taskBack;
              this.newTableData = [];
              this.newTableData = this.tableData;
              this.newTableData.forEach(item => {
                this.taskShouRu =
                  this.taskShouRu + item.resetSalary;
              });
              this.newTableData.forEach(item => {
                item.bizId = item.taskId;
                item.bizAmount = item.resetSalary;
                item.bizName = item.taskName;
                item.inOutType = 1;
                item.bizType = 1;
                item.profitId = this.id;
                item.managerId = this.manageId;
              });
              this.newObj = {
                id: this.id,
                managerId: this.manageId,
                yearMonthStr: this.month,
                managerName: this.managerName,
                totalIn: this.taskShouRu,
                profitDetailDOList: this.newTableData
              };
            }
          }
        })
        .catch();
    },
    openDialog(row) {
      console.log(row);
      this.form.amount = row.resetMoney?row.resetMoney=='0.0'?0:row.resetMoney.slice(1):''
      this.form.region = row.resetMoney?row.resetMoney.slice(0,1)=="+"?"增加":(row.resetMoney.slice(0,1)=="-"?"扣减":''):''
      this.row = row;
      this.newTableData = [];
      this.dialogFormVisible = true;
    },
    comfrim(row) {
        if(this.form.amount == '0'){
            return this.$message.error('调整金额不能为0！')
        }else if(this.form.amount == ''){
          return this.$message.error('调整金额不能为空！')
        }else if(this.form.amount == 0.0||this.form.amount == 0.00){
          return this.$message.error('请输入正确调整金额格式！')
        }
        if(!this.form.region){
          return this.$message.error('调整方式不能为空！')
        }
      this.newTableData = [];
      this.taskShouRu = 0;
      this.paiObj = {};
      this.nullObj = {
        region: this.form.region,
        amount: this.form.amount
      };
        if(this.form.region == '扣减'){
            if(this.nullObj.amount >row.salary){
                return this.$message.error('调整金额不能大于原金额！')
            }
        }
      console.log(row);
      row.resetMoney =
        this.nullObj.region == "增加"
          ? "+" + this.nullObj.amount
          : this.nullObj.region == "扣减"
          ? "-" + this.nullObj.amount
          : 0;
      if (this.nullObj.region == "增加") {
        // if (row.salary == row.resetSalary) {
          row.resetSalary = row.salary + Number(row.resetMoney);
        // } else {
        //   row.resetSalary = row.resetSalary + Number(row.resetMoney);
        // }
      } else if (this.nullObj.region == "扣减") {
        row.resetSalary = row.salary + Number(row.resetMoney);
      }
      this.newTableData = this.tableData;
      this.newTableData.forEach(item => {
        if (item.taskId == row.taskId) {
          item.bizId = row.taskId;
          item.bizAmount = row.resetSalary;
          item.bizName = row.taskName;
        }
        item.inOutType = 1;
        item.bizType = 1;
        item.profitId = this.id;
        item.managerId = this.manageId;
        this.taskShouRu = this.taskShouRu + item.resetSalary;
      });
      let _that = this;
      this.newObj = {
        id: this.id,
        managerId: this.manageId,
        managerName: this.managerName,
        yearMonthStr: this.month,
        totalIn: _that.taskShouRu,
        profitDetailDOList: this.newTableData
      };
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    cancelText() {
      this.form.amount = "";
      this.form.region = "";
      this.dialogFormVisible = false;
    },
    goToNext() {
      //3.02 版本去掉派工收入
      //   this.newTableData.concat([{
      //   profitId: this.id,
      //   managerId: this.manageId,
      //   inOutType: 1,
      //   bizType: 2,
      //   bizName: "派工收入",
      //   bizId: "",
      //   bizAmount: this.taskBack,
      //   resetSalary: 0
      // }])
      this.$api
        .finshProfitOne({...this.newObj,profitDetailDOList:this.newTableData})
        .then(res => {
          // console.log(res)
          if (res.data.respCode == 0) {
            // setTimeout(item => {
            //     this.$message.success('提交成功')
            // },10)
            const newTable = [];
            this.tableData.forEach(item => {
              if (item.bizName != "派工收入") {
                newTable.push(item);
              }
            });
            this.tableData = newTable;
            setTimeout(() => {
              const { href } = this.$router.resolve({
                name: "daidaiCheckGenerateTwo",
                params: {
                  managerId: this.manageId,
                  month: this.month,
                  id: this.id,
                  managerName: this.managerName
                }
              });
              window.open(href, "_self");
            }, 1000);
          } else if (res.data.respCode == -1) {
              const newTable = [];
            this.tableData.forEach(item => {
              if (item.bizName != "派工收入") {
                newTable.push(item);
              }
            });
            this.tableData = newTable;
            this.$message.error(res.data.errorMsg);
          } else if (res.data.respCode == -2) {
            this.$message.error("需要登录");
          }
        })
        .catch();
    },
    cancel() {
      this.$router.push({ name: "profitDetail1" });
    },
    keyUpCost() {
      let value = this.form.amount;
      console.log(value);
      let pattern = /^-?\d*\.?\d*$/;
      console.log(Number(value));
      if (pattern.test(value)) {
        if (Number(value >= 0)) {
          let falseNum = value.substr(0, 1);
          let numLength = value.indexOf(".");
          if (value.indexOf(".") != -1) {
            this.form.amount = value.substr(0, value.indexOf(".") + 3);
            if (Number(falseNum) == 0 && numLength >= 2) {
              this.form.amount = null;
            }
          } else {
            this.form.amount = value.substr(0, 10);
          }
        } else {
          this.form.amount = null;
        }
      } else {
        this.form.amount = null;
      }
    }
  },
  created() {
    this.manageId = this.$route.params.managerId;
    this.month = this.$route.params.month;
    this.id = this.$route.params.id;
    this.managerName = this.$route.params.managerName;
    this.getData();
  }
};
</script>

<style>
.h1_span {
  display: inline-block;
  width: 6px;
  height: 15px;
  background: #c0c1c2;
}
  .row-cus-border th.el-table_1_column_3{
    border-left:1px solid #EBEEF5;
  }
</style>
