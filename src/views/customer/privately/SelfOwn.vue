<template>
  <div class="self-own back-white">
    <search-bar combCondition="false" @handleSearch="handleSearch"></search-bar>
    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关个体工商户信息">
        <el-table-column label="字号名称" prop="name" show-overflow-tooltip align="center" min-width="120"></el-table-column>
        <el-table-column label="经营者姓名" prop="legalPerson" show-overflow-tooltip align="center" min-width="130"></el-table-column>
        <el-table-column label="统一社会信用代码" prop="creditCode" show-overflow-tooltip align="center" min-width="170"></el-table-column>
        <el-table-column label="已交年费（元）" prop="totalPayAmount" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="服务截止日期" prop="endTime" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="本月剩余额度(元)" prop="surplusAmount" show-overflow-tooltip align="center" min-width="110"></el-table-column>
        <el-table-column label="已统筹金额(元)" prop="userAmount" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="服务状态" prop="serversType" show-overflow-tooltip align="center" min-width="80"></el-table-column>
        <el-table-column label="状态" prop="status" show-overflow-tooltip :formatter="statusFormatter" align="center" min-width="80"></el-table-column>

        <el-table-column label="操作" min-width="120">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status != 3" type="text" size="mini" class="btn-icon btn-icon-pay" @click="payCharge(scope.row)">续费</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container">
        <el-pagination class="pagebox" @current-change="changePage" :current-page="currentPage" :total="total" layout="total, prev, pager, next, jumper">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="payChargeVisible" width="600px" center>
      <div class="dialog-head">
        <span>自有个体工商户续费</span>
      </div>
      <div class="dialog-body">
        <el-form ref="form1" :model="feeForm" label-width="110px" label-position="left" :rules="rules">
          <el-form-item label="字号名称：" class="mTop2">
            {{feeForm.feeName}}
          </el-form-item>
          <el-form-item label="经营者姓名：" class="mTop2">
            {{feeForm.feeLegalPerson}}
          </el-form-item>
          <el-form-item label="年费：" class="mTop2">
            {{feeForm.charge}}元/年
          </el-form-item>
          <!-- <el-form-item label="续费年数：" prop="year">
            <el-select v-model="feeForm.year" class="radius-input" placeholder="请选择" style="width:100%">
              <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
            <span class="yuan">年</span>
          </el-form-item> -->
          <el-form-item label="" prop="">
            服务有效期至{{feeForm.valid | forTime}}
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="payFee">保 存</el-button>
        <el-button size="medium" @click="payChargeVisible = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import SearchBar from '@/components/SearchBar'
export default {
  name: 'SelfOwn',
  components: { SearchBar },
  data() {
    return {
      tableData: [],
      total: 0,
      pageCount: 0,
      currentPage: 1,
      payChargeVisible: false,
      feeForm: {
        year: '',
        feeName: '',
        feeLegalPerson: '',
        charge: '',
        valid: ''
      },
      form: {
        keyWord: ''
      },
      rules: {
        yearFee: [
          {
            required: true,
            trigger: "blur",
            // validator: checkNum
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
          },
        ]
      },
    }
  },
  mounted() {
    this.getList()
  },
  filters: {
    forTime(val) {
      return `${val.substring(0, 4)}年${val.substring(5, 7)}月${val.substring(8, 10)}日`
    }
  },
  methods: {
    statusFormatter(row, column, cellValue, index) {
      if (cellValue == 3) {
        return '已注销'
      } else {
        return '正常'
      }
    },
    handleSearch(keyword) {
      this.form.keyWord = keyword
      this.getList()
    },
    changePage(val) {
      this.currentPage = val
      this.getList()
    },
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
            this.tableData = response.data.data.list
            this.total = response.data.data.total
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    payCharge() {
      this.payChargeVisible = true
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
    },
    payFee() {
      this.$refs.form1.validate(valid => {
        if (valid) {
          const params = {
            financeCustomerId: this.feeId,
            payAmount: this.charge * this.feeForm.year,
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
  }
}
</script>
