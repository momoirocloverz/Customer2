<template>
  <div class="back-white">
    <div class="filter-condition">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <!--选择条件的单选按钮-->
        <div class="search-zone">
          <el-form-item class="formSearchMargin">
            <el-input placeholder="输入关键字搜索" v-model="input5" size="mini" class="input-with-select select-input">
              <el-select v-model="select" slot="append" placeholder="请选择">
                <el-option label="任务名称" value="1"></el-option>
                <el-option label="项目经理" value="2"></el-option>
              </el-select>
            </el-input>
            <el-button type="primary" class="searchBtn" @click="getList">搜索</el-button>

            <el-button class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
          </el-form-item>
        </div>

        <div v-show="isShowComb" class="combine-zone">
          <el-form-item label="状态：" class="formSearchMargin formSearchMarginTop">
            <el-radio-group class="radio-search" v-model="form.taskStatus">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">待领取</el-radio>
              <el-radio label="2">领取完毕</el-radio>
              <el-radio label="3">已关闭</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="结算方式：" class="formSearchMargin">
            <el-radio-group class="radio-search" v-model="form.settlementType">
              <el-radio label="">不限</el-radio>
              <el-radio label="1">日结</el-radio>
              <el-radio label="4">周结</el-radio>
              <el-radio label="2">月结</el-radio>
            </el-radio-group>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关任务信息">
        <el-table-column prop="taskName" label="任务名称" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="receiveName" label="项目经理" align="center" show-overflow-tooltip min-width="100">
          <template v-slot="scope">
            <span>
              {{scope.row.receiveName || '无'}}
            </span>
          </template>
        </el-table-column>
        <el-table-column prop="startTime" :formatter="dateFormatter" label="开始时间" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="endTime" :formatter="dateFormatter" label="结束时间" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="settlementTypeName" label="任务结算方式" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="workingPlace" label="工作地点" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column prop="status" :formatter="statusFormatter" label="状态" align="center" show-overflow-tooltip min-width="100"></el-table-column>
        <el-table-column label="操作" align="right" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="pageCount!=0">
        <el-pagination class="pagebox" layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="currentPage" :total="total" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../../../common/util'

export default {
  name: 'CustomerTask',
  data() {
    return {
      isShowComb: false,
      rules: {
        managerUserId: [
          { required: true, message: '项目经理不能为空', trigger: 'blur' },
        ],
      },
      PmList: [],
      selectItem: {},
      DeleteVisible: false,
      AssignVisible: false,
      currentPage: 1,
      pageSize: 20,
      pageCount: 1,
      total: 0,
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '1',
      tableData: [],
      form: {
        taskStatus: '',
        belongtoItem: '',
        settlementType: "",
      },
      mineItem: {},
      price: {},
      content: '',
      boundDialogVisible: false,
      CancelVisible: false,
      agreeVisible: false,
      unboundDialogVisible: false
    }
  },
  name: "Unbound",
  mounted() {
    this.getList();
  },
  watch: {
    'form.taskStatus': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
    'form.belongtoItem': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
    'form.settlementType': function (val, oldval) {
      this.currentPage = 1
      this.getList();
    },
  },
  methods: {
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    },
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue)
    },
    statusFormatter(row, column, cellValue, index) {
      let status = ''
      switch (Number.parseInt(cellValue)) {
        case 1:
          status = '待领取'
          break
        case 2:
          status = '领取完毕'
          break
        case 3:
          status = '已关闭'
          break
        default:
          status = ''
          break
      }
      return status
    },
    typeFormatter(row, column, cellValue, index) {
      let status = ''
      switch (Number.parseInt(cellValue)) {
        case 1:
          status = '服务中'
          break
        case 2:
          status = '待对方同意解绑'
          break
        case 3:
          status = '待我同意解绑'
          break
        case 4:
          status = '已解绑'
          break
        default:
          status = ''
          break
      }
      return status
    },
    RouteToPm(row) {
      const params = {
        userId: row.receiveUserId,
        type: row.receiveUserType == 1 ? 2 : 3,
      }
      this.$api.getPrimaryKey(params).then(response => {
        console.log(response)
        if (response.respCode == 0) {
          this.pmId = response.data
          const { href } = this.$router.resolve({
            name: "projectManagerdetail",
            params: {
              id: this.pmId,
              userId: row.receiveUserId,
            }
          });
          window.open(href, "_blank");
        }
      })
        .catch(error => {
          console.log(error);
        });
      console.log(row)
    },
    handleAssign(item) {
      this.selectItem = item;
      this.AssignVisible = true;
      this.getPmList();
    },
    getPmList() {
      const params = {
        pageNum: 1,
        pageSize: 0,
        bindingStatus: 1
      };
      this.$api
        .getPmListCus(params)
        .then(response => {
          const {
            data
          } = response;
          this.PmList = data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    handleDeleteVisible(item) {
      this.selectItem = item;
      this.DeleteVisible = true;
    },
    handleDelete() {
      const params = {
        taskId: this.selectItem.id,
      }
      this.$api.TaskDelete(params).then((response) => {
        if (response.respCode == 0) {
          this.$message.success('删除成功')
          this.DeleteVisible = false;
          this.getList()
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    AssignTask() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          const params = {
            taskId: this.selectItem.id,
            managerUserId: this.form.managerUserId,
          }
          this.$api.TaskAssign(params).then((response) => {
            if (response.respCode == 0) {
              this.$message.success('指派成功')
              this.AssignVisible = false;
              this.getList()
            }
          }).catch((error) => {
            console.log(error);
          });
        }
      });
    },
    getList() {

      let taskName = this.select == 1 ? this.input5 : '';
      let receiveUserName = this.select == 2 ? this.input5 : '';
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        receiptType: 1,
        receiveStatus: 3,
        taskName: taskName,
        receiveUserName: receiveUserName,
        taskStatus: this.form.taskStatus,
        settlementType: this.form.settlementType,
        taskType: 2,
        belongto: this.$route.params.id
      }
      console.log(params)

      this.$api.mainTaskList(params).then((response) => {
        console.log(response)
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
        this.total = total
      }).catch((error) => {
        console.log(error);
      });
    },
    getsettlement() {
      this.$api
        .getDicList("settlementType", 0)
        .then(response => {
          this.settlementTypeList = response.data.data;
        })
        .catch(error => {
          console.log(error);
        });
    },
    getbelongtoList() {
      this.$api
        .getBelongtoList()
        .then(response => {
          this.belongtoList = response.data;
          console.log(this.belongtoList)
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
    formatbindingStatus(row) {
      let val = row.bindingStatus
      if (val == 1) {
        return '服务中'
      } else if (val == 2) {
        return '待项目经理同意解绑'
      } else if (val == 3) {
        return '待客户同意解绑'
      } else if (val == 4) {
        return '已解绑'
      } else {
        return ''
      }
    },
    routeTowoker() {
      this.$router.push({ name: 'myworker' })
    },
    handleClose() {

    },
    addNew() {
      this.$router.push({ name: 'addTask' })
    }
  }
}
</script>
