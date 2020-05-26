<template>
  <div class="back-white">
    <search-bar combCondition="true" @handleSearch="handleSearch">
      <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
        <!--选择条件的单选按钮-->
        <el-form-item label="工种：" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="form.industry">
            <el-radio label="">不限</el-radio>
            <el-radio :label="item.industry" v-for="(item,index) in industryList" :key="index">{{item.industryName}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算方式：" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="form.settlementType">
            <el-radio label="">不限</el-radio>
            <el-radio label="2">月结</el-radio>
            <el-radio label="4">周结</el-radio>
            <el-radio label="1">日结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </search-bar>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关零工信息">
        <el-table-column label="姓名" prop="talentName" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="性别" prop="sexName" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="年龄" prop="age" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="来源" show-overflow-tooltip align="center" min-width="100">
          <template v-slot="scope">
            <span class="is-link" v-if="scope.row.type==1">排班</span>
            <span class="is-link" v-else @click="RouteToTask(scope.row)">{{scope.row.sourceTaskName}}</span>
          </template>
        </el-table-column>
        <el-table-column label="上班时间" align="center" min-width="100">
          <template v-slot="scope">
            <span v-if="scope.row.customerStartTime">
              {{scope.row.customerStartDate==scope.row.schedulingDate?'当日':'次日'}}{{scope.row.customerStartTime | formatCusTimeString}}
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip label="下班时间" align="center" min-width="100">
          <template v-slot="scope">
            <span v-if="scope.row.customerEndDate">
              {{scope.row.customerEndDate==scope.row.schedulingDate?'当日':'次日'}}{{scope.row.customerEndTime | formatCusTimeString}}
            </span>
            <span v-else>无</span>
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="pieceSize" label="计件量" align="center" min-width="100">
          <template v-slot="scope">
            {{scope.row.pieceSize | formatPieces}}{{scope.row.pieceState | formatpieceState}}
          </template>
        </el-table-column>
        <el-table-column show-overflow-tooltip prop="settlementTypeName" label="考勤图片" align="center" min-width="100">
          <template v-slot="scope">
            <span v-if="scope.row.hasPhoto == 2" @click="routeToImg(scope.row)">
              查看
            </span>
            <span else>无</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="pageCount">
        <el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize"></el-pagination>
      </div>
    </div>

    <el-dialog :visible.sync="ImageVisible" width="540px" center>
      <div>
        <span class="img-label">上班考勤图片</span>
        <img v-if="selected.startPhoto" :src="selected.startPhoto" style="width: 100%" />
        <p v-else style="text-align: center">暂无考勤图片</p>
        <span class="img-label">下班考勤图片</span>
        <img v-if="selected.endPhoto" :src="selected.endPhoto" style="width: 100%" />
        <p v-else style="text-align: center">暂无考勤图片</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="large" class="dialog-large-button" type="primary" @click="ImageVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../../../common/util'
import SearchBar from '@/components/SearchBar'
export default {
  name: "Unbound",
  components: { SearchBar },
  data() {
    return {
      selected: {},
      hasPhoto: '',
      ImageVisible: false,
      industryList: [],
      DeleteVisible: false,
      currentPage: 1,
      pageSize: 20,
      pageCount: '',
      total: 0,
      settlementTypeList: '',
      belongtoList: '',
      input5: '',
      select: '',
      tableData: [],
      form: {
        industry: '',
        taskStatus: '',
        belongtoItem: '',
        settlementType: "",
        publishType: "",
      },
      mineItem: {},
      reveiveId: '',
      publishId: '',
    }
  },
  filters: {
    formatPieces(val) {
      if (val) {
        return util.formatPieceSize(val)
      } else {
        return '无'
      }
    },
    formatpieceState(val) {
      if (val == 1) {
        return '(待审核)'
      } else {
        return ''
      }
    },
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      } else {
        return '未打卡'
      }
    },
    formatCusTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      } else {
        return '无'
      }
    },
    formatminDate(val) {
      return util.minDate(val)
    },
    formatStatus(val) {
      if (val == 1) {
        return '待领取'
      } else if (val == 2) {
        return '进行中'
      } else if (val == 3) {
        return '已结束'
      } else {
        return ''
      }
      return util.minDate(val)
    }
  },
  mounted() {
    this.getsettlement();
    this.getIndustryList();
    this.getList();
    this.hasPhoto = this.$route.query.hasPhoto
  },
  watch: {
    'form.industry': function (val, oldval) {
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
    routeToImg(row) {
      this.selected = row;
      this.ImageVisible = true
    },
    RouteToTask(row) {
      const { href } = this.$router.resolve({
        name: "taskTrackDetail",
        query: {
          id: row.sourceTaskId,
        }
      });
      window.open(href, "_blank");
    },
    handleSearch(keyword) {
      this.form.realNameAlias = keyword
      this.search()
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        settlementType: this.form.settlementType,
        realNameAlias: this.form.realNameAlias,
        industry: this.form.industry,
        schedulingId: this.$route.query.id,
        talentType: 1,
      }
      this.$api.scheduleWorker(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.pageCount = pages
        this.tableData = list
        this.total = total
      }).catch((error) => {
        console.log(error);
      });
    },
    getIndustryList() {
      const params = {
        schedulingId: this.$route.query.id
      }
      this.$api.scheindustryList(params).then((response) => {
        if (response.respCode == 0) {
          this.industryList = response.data
        }
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
        return '待班务经理同意解绑'
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
    },
    search() {
      this.currentPage = 1
      this.getList()
    }
  }
}
</script>
