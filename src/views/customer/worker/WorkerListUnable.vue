<template>
  <div class="worker-unable back-white" v-loading="loading" element-loading-text="正在导出excel表...">
    <search-bar combCondition="true" @handleSearch="handleSearch" placeholder="输入零工姓名搜索">
      <el-form ref="form" :model="form" label-width="110px" label-position="left">
        <!--选择条件的单选按钮-->
        <el-form-item label="性别：" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="form.sex">
            <el-radio label="">不限</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="结算类型：" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="form.settlementType">
            <el-radio label="">不限</el-radio>
            <el-radio label='2'>月结</el-radio>
            <el-radio label='4'>周结</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </search-bar>
    <div class="back-white btn-div flexable">
        <el-button class="primary-btn" size="mini" :disabled="isDisabled" @click="expoetExcel">导出名单</el-button>
      </div>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关零工信息">
        <el-table-column label="姓名" prop="realNameAlias" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="性別" prop="sex" :formatter="sexFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="手机号" prop="mobile" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="身份证号" prop="idCard" show-overflow-tooltip align="center" min-width="120"></el-table-column>    
          <el-table-column label="结算方式" prop="settlementType" :formatter="settlementTypeFormatter"
                                     show-overflow-tooltip align="center" min-width="80"></el-table-column>
        <el-table-column label="最近停用时间" prop="stopTime" :formatter="dateFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination-container" v-if="pageCount">
        <el-pagination class="mypagination" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" layout="total , prev, pager, next, jumper" :total="total">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import util from "../../../common/util";
import SearchBar from '@/components/SearchBar'
export default {
  name: "WorkerListUnable",
  components: { SearchBar },
  data() {
    return {
      isDisabled: false,
      loading: false,
      PmList: [],
      settlementTypeList: [],
      tableData: [],
      total: 0,
      currentPage: 1,
      pageCount: 1,
      pageSize: 10,
      form: {
        sex: "",
        settlementType: "",
        managerName: "",
        managerId: "",
        tag: "",
        keyWord: "",
        skill: ""
      },
      skillList: [],
    };
  },
  mounted() {
    this.getPmList();
    this.getsettlement();
    this.getList();
  },
  methods: {
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue);
    },
    sexFormatter(row, column, cellValue, index) {
      let status = "男";
      switch (Number.parseInt(cellValue)) {
        case 1:
          status = "男";
          break;
        case 2:
          status = "女";
          break;
        default:
          status = "男";
          break;
      }
      return status;
    },
      settlementTypeFormatter(row, column, cellValue, index) {
                let status = "";
                switch (Number.parseInt(cellValue)) {
                    case 1:
                        status = "日结";
                        break;
                    case 2:
                        status = "月结";
                        break;
                    case 3:
                        status = "实时结";
                        break;
                    case 4:
                        status = "周结";
                        break;
                    default:
                        status = "";
                        break;
                }
                return status;
            },
    handleSearch(keyword) {
      this.currentPage = 1
      this.form.keyWord = keyword
      this.getList()
    },
    getManagerList() {
      const params = {
        bindingStatus: 1
      };
      this.$api.getPmListCus(params).then(res => {
          this.managerList = res.data;
        }).catch(error => {
          console.log(error);
        });
    },
    getsettlement() {
      this.$api.getDicList("settlementType", 0).then(res => {
          this.settlementTypeList = res.data.data;
        }).catch(error => {
          console.log(error);
        });
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    getPmList() {
        let ID = JSON.parse(localStorage.userInfo).customerId || '';
        let params = {
            customerId:ID
        }   
        this.$api.classManagerList(params).then(res => {
            let { respCode,data } = res;
            if(  respCode === 0  ){
                this.PmList = data;   
            }
        }).catch(error => {
            console.log(error);
        });  
    },
    expoetExcel(){
      let status = 2
      const params = {
        customerStatus: status,
        pageNum: this.currentPage,
        pageSize: 10,
        settlementType: this.form.settlementType,
        sex: this.form.sex,
        managerName: this.form.managerName,
        managerId: this.form.managerId,
        nameAlias: this.form.keyWord
      }
      this.loading = true
      this.$api.getDisableExport(params).then(res => {
        // console.log(res)
        if(res.data.respCode == 0){
        setTimeout(() => {
          this.loading = false
        },2000)
          if(res.data.data){
            window.open(res.data.data)
          }
        }
      }).catch()
    },
    getList() {
      let status = 2
      const params = {
        customerStatus: status,
        pageNum: this.currentPage,
        pageSize: 10,
        settlementType: this.form.settlementType,
        sex: this.form.sex,
        managerName: this.form.managerName,
        managerId: this.form.managerId,
        nameAlias: this.form.keyWord
      };
      this.$api
        .getWorkerListThree(params)
        .then(response => {
          this.tableData = response.data.data.list
            ? response.data.data.list
            : [];
          this.total = response.data.data.total;
          if (this.tableData.length == 0) {
            this.isDisabled = true;
          } else {
            this.isDisabled = false;
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    routeToDetail(row) {
      const {href} = this.$router.resolve({
        name: "workerDetail",
        params: {
          id: row.empCustomerId,
          talentId: row.talentId
        }
      });
      window.open(href, "_blank");
    },
  },
  watch: {
    "form.sex": function (val, oldval) {
      this.currentPage = 1;
      this.getList();
    },
    "form.settlementType": function (val, oldval) {
      this.currentPage = 1;
      this.getList();
    },
    "form.managerName": function (val, oldval) {
      this.currentPage = 1;
      this.getList();
    },
  }
};
</script>