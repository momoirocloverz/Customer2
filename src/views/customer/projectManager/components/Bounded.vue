<template>
  <div class="back-white">
    <search-bar @handleSearch="handleSearch" placeholder="输入班务经理姓名搜索"></search-bar>

    <div class="table-box back-white">
      <el-table :data="tabledata" empty-text="暂无相关信息">
        <el-table-column prop="managerNameAlias" align="center" label="姓名" min-width="100"></el-table-column>
        <el-table-column prop="managerMobile" label="手机号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="bindingTime" :formatter="dateFormatter" label="最近绑定时间" align="center" min-width="100"></el-table-column>
        <el-table-column prop="unbindingTime" :formatter="dateFormatter" label="最近解绑时间" align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="handleView(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="pageCount">
        <el-pagination class="mypagination" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
      
    </div>
    <el-dialog
      :title="thusName"
      :visible.sync="showContent"
      width="80%"
      center>
      <div>基本信息</div>
      <hr class="el-radio-group-hr" />
      <div class="box-body-item">
          <div class="table-info info-item">
            <div class="table-info-col1"><span>姓名</span></div>
            <div class="table-info-col2"><span>{{thusRow.name}}</span></div>
            <div class="table-info-col1"><span>手机号</span></div>
            <div class="table-info-col2"><span>{{thusRow.mobile}}</span></div>
            <div class="table-info-col1"><span>身份证号</span></div>
            <div class="table-info-col2"><span>{{thusRow.idCard}}</span></div>
            <div class="table-info-col1"><span>所在位置</span></div>
            <div class="table-info-col2"><span>{{thusRow.address}}</span></div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <!--<el-button @click="showBindLog = false">取 消</el-button>-->
        <el-button type="primary" @click="showContent = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import util from '../../../../common/util'
import SearchBar from '@/components/SearchBar'
export default {
  name: "",
  components: { SearchBar },
  data() {
    return {
      showContent:false,
      thusName:'',
      thusRow:{},
      tabledata: [],
      radio4: 1,
      currentPage: 1,
      pageSize: 20,
      pageCount: 1,
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
    console.log(this.tabledata)
    this.getPmList()
  },
  filters: {
    formatminDate(val) {
      return util.minDate(val)
    }
  },
  methods: {
     handleView(row){
      this.$api.customerManagerClassManagerDetail({managerId:row.managerId}).then(res=>{
        if(res.respCode===0){
          this.thusRow = res.data;
          this.thusName = res.data.name;
           this.showContent = true;
        }
      })
      // this.thusName = row.managerNameAlias;
      // this.thusRow = row;
     
    },
    handleSearch(keyword) {
      this.form.keyWord = keyword
      this.getPmList()
    },
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue)
    },
    statusFormatter(row, column, cellValue, index) {
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
    routeToDetail(item) {
      const { href } = this.$router.resolve({
        name: "projectManagerdetail",
        params: {
          id: item.id,
          userId: item.userId,
        }
      });
      window.open(href, "_blank");
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getPmList();
    },
    getPmList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        bindingStatus: this.form.bindingStatus,
        nameAlias: this.form.keyWord,
        status:2
      }
      console.log(params)
      this.$api.managerMyBindingManagerList(params).then((response) => {
        const {
          data
        } = response;
        this.tabledata = data.list||[];
        this.total = data.total||0;
      }).catch((error) => {
      });
    },  }
}
</script>
<style>
.info-item {
  margin: 20px 0px;
}
.box-body-item-title {
  font-size: 18px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #262626;
  line-height: 40px;
}
.box-body-item {
  margin-top: 40px;
}
.table {
  padding: 20px;
}
.setting-table {
  width: 100%;
}
thead {
  width: 100%;
}
.rant-input {
  width: 180px;
}
.setting-table {
  td {
    background-color:#fff
  }
}
.table-info .t-div{
  font-size: 14px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #5C5C5C;
    margin-top: 16px;
    line-height: 20px;
}
</style>