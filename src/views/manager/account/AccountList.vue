<template>
  <div class="account">
    <div v-if="isAuthenticated == 1" class="uncheckBox flexSafari">
      <img src="../../../assets/images/walle.png" alt="钱包" class="wallet">
      <div class="text">您的账户尚未开通，请登录经理人APP进行身份认证，认证成功后自动开通</div>
      <!-- <el-button round size="medium" type="primary" @click="fullTagDia = false">去开通</el-button> -->
    </div>
    <div v-if="isAuthenticated == 2">
      <div class="clearfix">
        <div class="floatLeft">
          <div class="amount">账户余额</div>
          <div class="mt">
            <span class="hudrend">{{accountInfo.totalAmount}}</span>
            <span class="yuan">元</span>
          </div>
        </div>
        <div class="floatLeft btnG">
          <div class="btnCharge">
            <el-button round size="medium" type="primary" @click="recharge">充值</el-button>
            <!-- <el-button round size="medium" @click="fullTagDia = false" class="btn">开户信息查看</el-button> -->
          </div>
        </div>
      </div>
      <div class="splitLine"></div>
      <div class="moneyInfo">
        <div class="useable floatLeft">
          <div class="amount">可用余额</div>
          <div>
            <span class="black">{{accountInfo.balance}}</span>
            <span class="amount">元</span>
          </div>
        </div>
        <div class="span floatLeft"></div>
        <div class="useable floatLeft">
          <div class="amount">冻结金额</div>
          <div>
            <span class="black">{{accountInfo.freezingAmount}}</span>
            <span class="amount">元</span>
          </div>
        </div>
      </div>
      <div class="splitLine"></div>
      <div class="title">明细</div>
      <el-table class="table-outline" :data="tableData" emptyText="暂无相关明细">
        <el-table-column prop="note" label="明细" align="center" min-width="180">
        </el-table-column>
        <el-table-column prop="type" align="center" label="收入/支出" min-width="180">

          <template v-slot="scope">
            {{scope.row.type |formatType}}
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额（元）" align="center" min-width="180">
          <template v-slot="scope">
            <span v-if="scope.row.type==1">+ {{scope.row.amount}}</span>
            <span v-else>- {{scope.row.amount}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="date" label="时间" align="center" min-width="180">
          <template v-slot="scope">
            {{scope.row.receiveTime |formatminDate }}
          </template>
        </el-table-column>

      </el-table>
      <div class="page-container">
        <el-pagination class="pagebox" background layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import util from '../../../common/util'
export default {
  name: "AccountList",
  data() {
    return {
      tableData: [],
      accountInfo: {},
      currentPage: 1,
      pageSize: 20,
      pageCount: 0,
      show: true,
      isAuthenticated: null
    };
  },
  filters: {
    formatType(val) {
      return val == 1 ? '收入' : '支出'
    },
    //  formatAmount(val){
    //    if(Number(val)>0){
    //      return '+'+val;
    //    }else{
    //      return val;
    //    }
    //  },
    formatminDate(val) {
      if (val) {
        return util.minDate(val)
      } else {
        return ''
      }
    },
  },
  methods: {
    recharge() {
      this.$router.push({ name: 'mRecharge' })
    },
    getDetail() {
      this.$api.AccountDetail().then((response) => {
        if (response.data.respCode == 0) {
          this.accountInfo = response.data.data
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        objectType: 3,
      }
      this.$api.AccountRunning(params).then((response) => {
        if (response.data.respCode == 0) {
          const {
            data: {
              list,
              pages,
              total,
              pageNum,
            },
          } = response.data;
          this.tableData = list
          this.pageCount = pages
        }

        console.log(this.tabledata)
      }).catch((error) => {
        console.log(error);
      });
    },
  },
  mounted() {
    this.getDetail()
    this.getList()
    this.isAuthenticated = localStorage.getItem('isAuthenticated')
    console.log(this.isAuthenticated)
  }

};
</script>
<style scoped>
.text {
  font-size: 16px;
  color: #666666;
}
.btn {
  width: 124px;
}
.span {
  width: 1px;
  height: 42px;
  background-color: #eeeeee;
  margin: 0 60px;
}
.amount {
  font-size: 14px;
  color: #666666;
}
.yuan {
  font-size: 18px;
  margin-left: 10px;
}
.account {
  color: #666666;
  width: 100%;
}
.hudrend {
  font-size: 30px;
  color: #e84518;
}
.btnG {
  margin-left: 60px;
}
.mt {
  margin-top: 24px;
}
.btnCharge {
  margin-top: 16px;
}
.black {
  font-size: 18px;
  color: #262626;
}
.useable {
  height: 54px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}
.moneyInfo {
  display: flex;
  justify-content: flex-start;
}
.title {
  font-size: 24px;
  line-height: 90px;
  color: #262626;
}
.wallet {
  width: 124px;
  height: 210px;
  margin: 130px 0 70px 0;
}
.uncheckBox {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
</style>
