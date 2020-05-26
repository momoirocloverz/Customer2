<template>
  <div class="back-white">
    <div class="back-white btn-div flexable">
      <el-button class="primary-btn" size="mini" @click="handleAdd">添加新设置</el-button>
    </div>

    <div class="table-box back-white">
      <el-table class="table-outline" :data="tableData" empty-text="暂无相关信息">
        <el-table-column prop="oldAgePension" :formatter="percentFormatter" show-overflow-tooltip label="养老保险缴纳比例" align="center" min-width="120"></el-table-column>
        <el-table-column prop="medicalInsurance" :formatter="percentFormatter" label="医疗保险缴纳比例" align="center" min-width="120"></el-table-column>
        <el-table-column prop="unemploymentInsurance" :formatter="percentFormatter" label="失业保险缴纳比例" align="center" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="accumulationFund" :formatter="percentFormatter" label="公积金缴纳比例" align="center" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="effectMonth" :formatter="formatToday" label="生效月份" align="center" show-overflow-tooltip min-width="120"></el-table-column>
        <el-table-column prop="endDate" :formatter="formatToday" label="截止月份" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="status" :formatter="formatStatus" label="状态" align="center" min-width="80"></el-table-column>

        <el-table-column label="操作" align="left" min-width="100">
          <template v-slot="scope">
            <el-button size="mini" type="text" class="btn-icon btn-icon-delete" v-if="scope.row.status ==1 || scope.row.status ==4" @click="handleDelete( scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="pageCount">
        <el-pagination class="mypagination" @current-change="handleCurrentChange" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="deleteDialogVisible" width="540px" class="base-dialog">
      <div class="dialog-head">
        <p class="dialog-alert">
          <i class="el-icon-warning"></i>&nbsp;谨慎操作
        </p>
        <p class="base-dialog-title">确认要删除吗？</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handleConfirmDelete">确 定</el-button>
        <el-button size="medium" @click="deleteDialogVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog :visible.sync="addDialogVisible" width="740px" class="base-dialog">
      <social-setting @handleCancel="handleCancel"></social-setting>
    </el-dialog>
  </div>
</template>

<script>
import SocialSetting from '../workerSocials/setting'
export default {
  name: "WorkSocial",
  components: { SocialSetting },
  data() {
    return {
      NotAdd: false,
      DeleteVisible: false,
      currentPage: 1,
      pageSize: 20,
      total: 0,
      pageCount: '',
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '',
      deleteDialogVisible: false,
      tableData: [],
      currentId: 0,
      form: {
        taskStatus: '',
        belongtoItem: '',
        settlementType: "",
        publishType: "",
      },
      mineItem: {},
      reveiveId: '',
      publishId: '',
      addDialogVisible: false
    }
  },

  mounted() {
    this.getList();
  },

  methods: {
    formatToday(row, column, cellValue, index) {
      if (cellValue) {
        return cellValue.substring(0, 7)
      }
    },
    formatStatus(row, column, cellValue, index) {
      if (cellValue == 1) {
        return '待生效'
      } else if (cellValue == 2) {
        return '生效中'
      } else if (cellValue == 3) {
        return '已失效'
      } else if (cellValue == 4) {
        return '已作废'
      } else {
        return '删除'
      }
    },
    percentFormatter(row, column, cellValue, index) {
      return cellValue + '%'
    },
    handleAdd() {
      if (this.NotAdd == true) {
        this.$message.error('当前存在待生效的记录，无法添加')
      } else {
        this.addDialogVisible = true
      }
    },
    handleCancel() {
      this.addDialogVisible = false
    },
    handleSelectionChange(val) {
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
      }
      console.log(params)

      this.$api.SocialList(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.tableData = list
        this.total = total
        for (let x in list) {
          if (list[x].status == 1) {
            this.NotAdd = true
            break;
          }
        }
        this.pageCount = pages
      }).catch((error) => {
        console.log(error);
      });
    },
    handleDelete(row, index) {
      this.deleteDialogVisible = true
      this.currentId = row.id
    },
    handleConfirmDelete() {
      const params = {
        id: this.currentId
      }
      this.$api
        .SocialDelete(params)
        .then(response => {
          if (response.respCode == 0) {
            this.$message.success('删除成功')
            this.deleteDialogVisible = false
            this.getList()
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "taskTrackDetail",
        query: {
          id: row.id,
        }
      });
      window.open(href, "_blank");
    },
    routeToEdit(row) {
      this.$router.push({ name: 'editTask', params: { id: row.id } })
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    routeTowoker() {
      this.$router.push({ name: 'myworker' })
    },
    handleClose() {

    },
    addNew() {
      this.$router.push({ name: 'addTask' })
    }
  },
  watch: {
    'form.taskStatus': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
  },
}
</script>

<style scoped>
.el-input .el-select {
  width: 100px;
}
.select-input {
  width: 396px;
  margin-right: 20px;
}
</style>