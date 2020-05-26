<template>
  <div class="back-white">
    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关任务信息">
        <el-table-column label="任务名称" prop="taskName" align="center" min-width="100"></el-table-column>
        <el-table-column label="任务所属" prop="belongToName" align="center" min-width="100"></el-table-column>
        <el-table-column label="发布人" prop="publishName" align="center" min-width="100"></el-table-column>
        <el-table-column label="开始时间" prop="startTime" :formatter="dateFormatter" align="center" min-width="100"></el-table-column>
        <el-table-column label="结束时间" prop="endTime" :formatter="dateFormatter" align="center" min-width="100"></el-table-column>
        <el-table-column label="结算方式" prop="settlementTypeName" align="center" min-width="100"></el-table-column>
        <el-table-column label="工作地点" prop="workingPlace" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column label="状态" prop="status" :formatter="statusFormatter" align="center" min-width="100"></el-table-column>
      </el-table>

      <div class="pagination-container" v-if="total">
        <el-pagination class="pagebox" layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="currentPage" :total="total" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../../../common/util'

export default {
  name: "PmTask",
  data() {
    return {
      tableData: [],
      radio4: 1,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      form: {
        sex: "不限",
        settleType: "不限",
        manager: "不限",
        tag: "不限",
        keyWord: "",
        bindingStatus: '4'
      }
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue)
    },
    statusFormatter(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '待领取'
      } else if (cellValue == 2) {
        return '进行中'
      } else if (cellValue == 3) {
        return '已结束'
      } else {
        return ''
      }
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        receiptType: 1,
        receiveStatus: 3,
        receiveUserId: this.$route.params.userId
      }

      this.$api.receiveTaskList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.tableData = list || []
        this.total = total
      }).catch((error) => {
        console.log(error);
      });
    },
  }
}
</script>
