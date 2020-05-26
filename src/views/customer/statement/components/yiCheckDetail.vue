<template>
  <div>
    <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;">班务利润表-{{name}}-{{month}}</h1>
    <h1 style="color:#5C5C5C;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;display:flex;align-items: center;"><span class="h1_span"></span>&nbsp;<span>收入</span></h1>
    <el-table :data="inData" empty-text="暂无相关信息" show-summary>
      <el-table-column label="班务" prop="bizName" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="当月金额(元)" prop="bizAmount" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="年度累计金额" prop="yearBizTotal" show-overflow-tooltip align="center" min-width="80"></el-table-column>
    </el-table>

    <h1 style="color:#5C5C5C;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;display:flex;align-items: center;"><span class="h1_span"></span>&nbsp;<span>费用</span></h1>
    <el-table :data="outData" empty-text="暂无相关信息" show-summary>
      <el-table-column label="班务" prop="bizName" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="当月金额(元)" prop="bizAmount" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="年度累计金额" prop="yearBizTotal" show-overflow-tooltip align="center" min-width="80"></el-table-column>
    </el-table>

    <h1 style="color:#5C5C5C;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;display:flex;align-items: center;"><span class="h1_span"></span>&nbsp;<span>利润</span></h1>
    <el-table :data="totalData" empty-text="暂无相关信息">
      <el-table-column label="班务" prop="bizName" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="当月金额(元)" prop="bizAmount" show-overflow-tooltip align="center" min-width="80"></el-table-column>
      <el-table-column label="年度累计金额" prop="yearBizTotal" show-overflow-tooltip align="center" min-width="80"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      totalData: [],
      name: '',
      month: '',
      managerId: 0,
    }
  },
  computed: {
    inData() {
      return this.tableData.filter(item => {
        return item.inOutType == 1
      })
    },
    outData() {
      return this.tableData.filter(item => {
        return item.inOutType == 2
      })
    }
  },
  mounted() {
    this.getParam()
    this.getDetail()
  },
  methods: {
    getParam() {
      this.managerId = this.$route.query.id
      this.name = this.$route.query.name
      this.month = this.$route.query.month
    },
    getDetail() {
      let param = {
        managerId: this.managerId,
        month: this.month
      }

      this.$api.profitQueryDetail(param)
        .then(res => {
          console.log(res);
          if (res.respCode == 0) {
            if(res.data){
            let data = res.data
            data = data.filter( action => action.bizName != '派工收入' && action.bizName != '派工费用' );//3.02  版本去掉 派工收入和派工费用项
            this.tableData = data
            let monthTotal = 0
            let yearTotal = 0

            this.tableData.forEach(item => {
              if (item.inOutType == 1) {
                monthTotal += (item.bizAmount * 100)
                yearTotal += (item.yearBizTotal * 100)
              } else if (item.inOutType == 2) {
                monthTotal -= (item.bizAmount * 100)
                yearTotal -= (item.yearBizTotal * 100)
              }
            })

            let obj = {
              bizName: '利润',
              bizAmount: (monthTotal / 100).toFixed(2),
              yearBizTotal: (yearTotal / 100).toFixed(2)
            }

            this.totalData.push(obj)
            }
          }
        })
        .catch(err => {
          console.log(err)
          this.$message.error('查询失败！')
        })
    }
  }
}
</script>

<style scoped>
.h1_span {
  display: inline-block;
  width: 6px;
  height: 15px;
  background: #c0c1c2;
}
.el-table {
  margin-bottom: 20px !important;
}
</style>
