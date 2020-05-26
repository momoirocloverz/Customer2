<template>
  <div>
    <div>
      <el-radio-group v-model="radio4">
        <el-radio-button label="1">自有</el-radio-button>
        <el-radio-button label="2">平台分配</el-radio-button>
      </el-radio-group>
    </div>
    <!-- 个体工商户列表-项目经理 -->
    <div v-show="radio4 == 1">
      <el-form ref="form" :model="form" label-width="110px" class="formSearchMarginTop">
        <!--选择条件的单选按钮-->
        <el-form-item label="关键字：" class="formSearchMargin ">
          <el-input class="rant-input inputWidth keyWFormParent" v-model="form.keyWord" placeholder="输入字号名称搜索"></el-input>
          <el-button type="primary" class="searchBtn keyWBtn" @click="getList">搜索
          </el-button>
        </el-form-item>
      </el-form>
      <div class="splitLine"></div>
      <el-table class="table-outline" :data="tableData" empty-text="暂无相关个体工商户信息">
        <el-table-column prop="name" :show-overflow-tooltip="true" label="字号名称" align="center" min-width="120"></el-table-column>
        <el-table-column prop="legalPerson" :show-overflow-tooltip="true" label="经营者姓名" align="center" min-width="130"></el-table-column>
        <el-table-column prop="creditCode" :show-overflow-tooltip="true" label="统一社会信用代码" align="center" min-width="170"></el-table-column>
        <el-table-column prop="totalPayAmount" :show-overflow-tooltip="true" label="已交年费（元）" align="center" min-width="100"></el-table-column>
        <el-table-column prop="endTime" label="服务截止日期" :show-overflow-tooltip="true" align="center" min-width="100"></el-table-column>
        <el-table-column prop="surplusAmount" :show-overflow-tooltip="true" label="本月剩余额度(元)" align="center" min-width="110"></el-table-column>
        <el-table-column prop="userAmount" :show-overflow-tooltip="true" label="已统筹金额(元)" align="center" min-width="100"></el-table-column>
        <el-table-column prop="serversType" :show-overflow-tooltip="true" label="服务状态" align="center" min-width="80"></el-table-column>
        <el-table-column prop="status" :show-overflow-tooltip="true" label="状态" :formatter="forPType" align="center" min-width="80"></el-table-column>
        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status != 3" type="text" size="mini" class="btn-icon btn-icon-pay" @click="payCharge(scope.row)">续费</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPage" :page-count="pageCount" background layout="prev, pager, next"></el-pagination>
      </div>
    </div>
    <!-- 个体工商户列表-平台 -->
    <div v-show="radio4 == 2">
      <el-form ref="form" :model="formPlat" label-width="110px" class="formSearchMarginTop">
        <!--选择条件的单选按钮-->
        <el-form-item label="关键字：" class="formSearchMargin ">
          <el-input class="rant-input inputWidth keyWFormParent" v-model="formPlat.keyWord" placeholder="输入字号名称搜索"></el-input>
          <el-button type="primary" class="searchBtn keyWBtn" @click="getPlatList">搜索</el-button>
        </el-form-item>
      </el-form>
      <div class="splitLine"></div>

      <el-table class="table-outline" :data="tableDataPlat" @selection-change="handleSelectionChange" empty-text="暂无相关个体工商户信息">
        <el-table-column prop="name" :show-overflow-tooltip="true" label="字号名称" align="center" min-width="150">
        </el-table-column>
        <el-table-column prop="legalPerson" :show-overflow-tooltip="true" label="经营者姓名" align="center" min-width="150">
        </el-table-column>
        <el-table-column prop="creditCode" :show-overflow-tooltip="true" label="统一社会信用代码" align="center" min-width="160">
        </el-table-column>
        <el-table-column prop="userAmount" :show-overflow-tooltip="true" label="已统筹金额(元)" align="center" min-width="150">
        </el-table-column>
        <el-table-column prop="totalPayAmount" :show-overflow-tooltip="true" label="累计支付服务费(元)" align="center" min-width="150">
        </el-table-column>
        <el-table-column label="操作" width="150">
          <template slot-scope="scope">
            <el-button type="text" size="mini" class="btn-icon btn-icon-detail" @click="viewRecord(scope.row)">明细</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" @current-change="changePagePlat" :current-page="currentPagePlat" :page-count="pageCountPlat" background layout="prev, pager, next"></el-pagination>
      </div>
    </div>
    <el-dialog title="" :visible.sync="lastFeeDia" width="600px" center>
      <div class="dialog-head">
        <span>自有个体工商户续费</span>
      </div>
      <div class="bodyDiv">
        <el-form ref="form1" :model="feeForm" label-width="110px" label-position="left" :rules="rules" class="formSearchMarginTop">
          <el-form-item label="字号名称：" class="mTop2">
            {{feeName}}
          </el-form-item>
          <el-form-item label="经营者姓名：" class="mTop2">
            {{feeLegalPerson}}
          </el-form-item>
          <el-form-item label="年费：" class="mTop2">
            {{charge}}元/年
          </el-form-item>
          <el-form-item label="续费年数：" prop="year">
            <el-select v-model="feeForm.year" class="radius-input" placeholder="请选择" style="width:100%">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <span class="yuan">年</span>
          </el-form-item>
          <el-form-item label="" prop="">
            服务有效期至{{valid | forTime}}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="payFee">保 存</el-button>
        <el-button round size="medium" @click="lastFeeDia = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="lanuchManDia" width="600px" center>
      <div class="dialog-head">
        <span>分配项目经理</span>
      </div>
      <div class="bodyDiv">
        <el-form ref="formManger" :model="managerForm" label-width="160px" label-position="left" :rules="managerFormrules">
          <el-form-item label="所属项目经理：" style="margin-top:40px" prop="manager">
            <el-select v-model="managerForm.manager" class="radius-input " style="width: 80%;" placeholder="请选择">
              <el-option v-for="item in managerList" :key="item.value" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="lanuchItem" v-if="adjustNum == 1">保 存</el-button>
        <el-button round size="medium" type="primary" @click="lanuchItemRow" v-if="adjustNum == 2">保 存</el-button>
        <el-button round size="medium" @click="lanuchManDia = false">取 消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="" :visible.sync="confirmDia" width="600px" center>
      <div class="dialog-head">
        <span>确认收回分配给{{managerName}}的{{singPerson}}吗？</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button round size="medium" type="primary" @click="recycleItem">确 认</el-button>
        <el-button round size="medium" @click="confirmDia = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "PrivatelyList",
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
        callback(new Error("续费金额不能为空"));
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
        callback(new Error("续费年数不能为空"));
      }
    };
    return {
      radio4: "1",
      form: {
        status: "",
        dateRange: "",
        manager: "不限",
        tag: "不限",
        keyWord: "",
        keyWord2: "",
        keyWord3: "",
        select: 1
      },
      formPlat: {
        status: "",
        keyWord: "",
        keyWord2: "",
        keyWord3: "",
        select: 1
      },
      lastFeeDia: false,
      feeForm: {
        year: "",
        paidDate: "",
        yearFee: ""
      },
      tableData: [],
      rules: {
        yearFee: [
          {
            required: true,
            // message: "续费金额不能为空",
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
        year: [
          {
            required: true,
            message: "续费年数不能为空",
            trigger: "change"
            // validator: checkAccount
          },
        ]
      },
      managerFormrules: {
        manager: [
          {
            required: true,
            message: "所属项目经理不能为空",
            trigger: "change"
          }
        ]
      },
      lanuchManDia: false,
      managerForm: {
        manager: ""
      },
      managerList: [],
      confirmDia: false,
      currentPage: 1,
      pageCount: 1,
      currentPagePlat: 1,
      pageCountPlat: 1,
      total: 0,
      tableDataPlat: [],
      selected: [],
      recyleId: "",
      recyleManagerId: "",
      recyleMFC: "",
      managerName: "",
      adjustNum: "",
      adjustManagerId: "",
      adjustId: "",
      feeManagerId: "",
      feeId: "",
      feeManagerName: "",
      feeName: "",
      feeLegalPerson: "",
      isLanuch: true,
      totalPlat: 0,
      singPerson: '',
      endTime: '',
      options: [

      ],
      valid: '',
      charge: '0'
    };
  },
  methods: {
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: 20,
        isSelf: 3,
        companyName: this.form.keyWord
      };
      this.$api
        .PrivatelyList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableData = response.data.data.list;
            this.total = response.data.data.total;
            this.pageCount = response.data.data.pages;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getPlatList() {
      const params = {
        pageNum: this.currentPagePlat,
        pageSize: 20,
        isSelf: 2,
        companyName: this.formPlat.keyWord
      };
      this.$api
        .PlatPrivatelyList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.tableDataPlat = response.data.data.list;
            this.totalPlat = response.data.data.total;
            this.pageCountPlat = response.data.data.pages;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    addNew() {
      this.$router.push({ name: "newPrivately" });
      // this.$router.go(-1)
    },
    viewRecord(row) {
      const { href } = this.$router.resolve({
        name: "viewRecordC",
        params: {
          id: row.id,
          legalPerson: row.legalPerson,
          name: row.name,
        }
      });
      window.open(href, "_blank");
    },
    editOwnPrivately(row) {
      this.$router.push({
        name: "editPrivately",
        params: { id: row.id, isSelf: 1 }
      });
    },
    addNewPlat() {
      this.$router.push({ name: "newPlatPrivately" });
    },
    newLanuch() {
      this.getManagerList();
      this.adjustNum = 1;
      this.lanuchManDia = true;
    },
    payCharge(row) {
      this.getFee()
      this.lastFeeDia = true;
      this.feeId = row.id;
      this.valid = row.endTime
      this.feeManagerId = row.customerId;
      this.feeManagerName = row.managerName;
      this.feeName = row.name;
      this.feeLegalPerson = row.legalPerson;
      console.log(row.endTime)
      this.endTime = row.endTime;
    },
    payFee() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          const params = {
            // managerId: this.feeManagerId,
            financeCustomerId: this.feeId,
            // payAmount: this.feeForm.yearFee,
            payAmount: this.charge * this.feeForm.year,
            // payDate: this.feeForm.paidDate,
            years: this.feeForm.year
          };
          this.$api
            .PrivatelyPayCharge(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.getList();
                this.lastFeeDia = false;
                this.$message.success("续费成功");
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
    changePage(val) {
      this.currentPage = val;
      this.getList();
    },
    changePagePlat(val) {
      this.currentPagePlat = val;
      this.getPlatList();
    },
    recycleItem() {
      const params = {
        managerId: this.recyleManagerId,
        financeCustomerId: this.recyleId,
        managerFinanceCustomerId: this.recyleMFC
        // financeCustomerId: this.selected[0].id,
      };
      this.$api
        .Recycle(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$message.success("收回成功");
            this.radio4 = "2";
            this.getPlatList();
            this.confirmDia = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    lanuchItem() {
      this.$refs.formManger.validate(valid => {
        if (valid) {
          let id = []
          for (let i in this.selected) {
            id.push(this.selected[i].id)
          }
          const params = {
            managerId: this.managerForm.manager,
            financeCustomerIds: id
          };
          this.$api
            .Allocation(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success("分配成功");
                this.radio4 = "2";
                this.getPlatList();
                this.lanuchManDia = false;
                this.managerForm.manager = "";
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
    lanuchItemRow() {
      this.$refs.formManger.validate(valid => {
        if (valid) {
          const params = {
            managerId: this.managerForm.manager,
            financeCustomerId: this.adjustId
          };
          this.$api
            .AllocationRow(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.$message.success("调整成功");
                this.radio4 = "2";
                this.getPlatList();
                this.lanuchManDia = false;
                this.managerForm.manager = "";
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
    forPType(row) {
      if (row.status == 3) {
        return '已注销'
      } else {
        return '正常'
      }
    },
    handleSelectionChange(val) {
      this.selected = val;
      console.log(val);
      if (this.selected.length != 0) {
        for (let i in this.selected) {
          if (this.selected[i].managerName) {
            this.isLanuch = true;
            break
          } else {
            this.isLanuch = false;
          }
        }
      } else {
        this.isLanuch = true;
      }
      // if (this.selected.length == 1) {
      //   if (this.selected[0].managerName) {
      //     this.isLanuch = true;
      //   } else {
      //     this.isLanuch = false;
      //   }
      // } else {
      //   this.isLanuch = true;
      // }
    },
    editPlatPrivately(row) {
      this.$router.push({
        name: "editPrivately",
        params: { id: row.id, isSelf: 2 }
      });
    },
    confirmDiaShow(row) {
      this.managerName = row.managerName;
      this.singPerson = row.name;
      this.confirmDia = true;
      this.recyleId = row.id;
      this.recyleMFC = row.managerFinanceCustomerId;
      this.recyleManagerId = row.useManagerId;
      // console.log(row)
    },
    adjust(row) {
      this.getManagerList();
      this.lanuchManDia = true;
      this.adjustNum = 2;
      this.adjustManagerId = row.managerId;
      this.adjustId = row.id;
    },
    getManagerList() {
      const params = {
        pageNum: 1,
        pageSize: 10000,
        managerStatus: 2
      };
      this.$api
        .getPmList(params)
        .then(response => {
          if (response.data.respCode == 0) {
            this.managerList = response.data.data.list;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    goManager(row) {
      const { href } = this.$router.resolve({
        name: "pmDetail",
        params: {
          id: row.managerId,
        }
      });
      window.open(href, "_blank");
    },
    getFee() {
      const params = {
        paramName: 'privately_service_charge',
      };
      this.$api.ParamsInfo(params)
        .then(response => {
          if (response.respCode == 0) {
            this.charge = response.data
          }
        })
        .catch(error => {
          console.log(error);
        });
    }
  },
  mounted() {
    this.getList();
    this.getPlatList();
    for (let i = 1; i <= 10; i++) {
      this.options.push({
        label: i,
        value: i,
      })
    }
  },
  filters: {
    forTime(val) {
      return `${val.substring(0, 4)}年${val.substring(5, 7)}月${val.substring(8, 10)}日`
    }
  },
  watch: {
    "form.select": function (val, old) {
      this.form.keyWord = "";
    },
    lastFeeDia: function (val, old) {
      if (val == false) {
        this.charge = ''
        this.valid = ''
        this.feeForm.year = ''
      }
    },
    "formPlat.select": function (val, old) {
      this.formPlat.keyWord = "";
    },
    "form.status": function (val, old) {
      if (val != old) {
        this.currentPage = 1
        this.getList();
      }
    },
    "form.dateRange": function (val, old) {
      if (val != old) {
        this.currentPage = 1
        this.getList();
      }
    },
    "feeForm.year": function (val, old) {
      if (val) {
        let date = (this.endTime).substr(4, 6)
        let year = parseInt((this.endTime).substr(0, 4)) + val
        this.valid = `${year}${date}`
      }
    }
  }
};
</script>
