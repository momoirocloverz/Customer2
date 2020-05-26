<template>
  <div class="back-white">
    <search-bar combCondition="true" @handleSearch="handleSearch">
      <el-form ref="form" :model="form" label-width="90px" class="formSearchMarginTop">
        <!--选择条件的单选按钮-->
        <el-form-item label="性别：" class="formSearchMargin formSearchMarginTop">
          <el-radio-group class="radio-search" v-model="form.sex">
            <el-radio label="">不限</el-radio>
            <el-radio label="1">男</el-radio>
            <el-radio label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标签：" class="formSearchMargin">
          <el-radio-group class="radio-search" v-model="form.skill">
            <el-radio label="">不限</el-radio>
            <el-radio :label="item.skillName" v-for="(item,index) in skillList" :key="index">{{item.skillName}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </search-bar>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关零工信息">
        <el-table-column prop="realNameAlias" align="center" label="真实姓名" min-width="100"></el-table-column>
        <el-table-column prop="sexName" align="center" label="性别" min-width="100"></el-table-column>
        <el-table-column prop="empSettlementType" align="center" label="结算方式" min-width="100"></el-table-column>
        <el-table-column prop="talentSkills" :formatter="skillFormatter" label="技能" align="center" min-width="100"></el-table-column>
        <el-table-column prop="mobile" label="手机号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="idCard" label="身份证号" align="center" min-width="100"></el-table-column>
        <el-table-column prop="startTime" :formatter="dateFormatter" label="最近分配时间" align="center" min-width="100"></el-table-column>
      </el-table>

      <div class="pagination-container" v-if="pageCount">
        <el-pagination class="pagebox" background layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import util from '../../../../common/util'
import SearchBar from '@/components/SearchBar'

export default {
  name: "PmWorker",
  components: { SearchBar },
  data() {
    return {
      skillList: '',
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      pageCount: 1,
      id: '',
      form: {
        sex: '',
        bindStatus: '',
        skill: '',
        keyWords: ''
      }
    }
  },
  watch: {
    // 'form.sex': function (val, oldval) {
    //   this.currentPage = 1
    //   this.getList()
    // },
    // 'form.settlementType': function (val, oldval) {
    //   this.currentPage = 1
    //   this.getList()
    // },
    // 'form.empManagerStatus': function (val, oldval) {
    //   this.currentPage = 1
    //   this.getList()
    // },
    // 'form.skill': function (val, oldval) {
    //   this.currentPage = 1
    //   this.getList()
    // },
    'form.isMyOwnEmp': function (val, oldval) {
      this.currentPage = 1
      this.getSkill()
      this.getList()
    },
    'form': {
      handler() {
        this.currentPage = 1
        this.getList()
      },
      deep: true
    }
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getSkill()
    this.getList()
  },
  methods: {
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue)
    },
    skillFormatter(row, column, cellValue, index) {
      let skills = []
      cellValue.forEach(item => {
        skills.push(item.skillName)
      })

      return skills.join(' ')
    },
    handleSearch(keyword) {
      this.form.keyWords = keyword
    },
    getSkill() {
      const params = {
        isMyOwnEmp: false,
        managerId: this.id
      }
      this.$api.getmanagerSkill(params).then((response) => {
        this.skillList = response.data;
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
        managerId: Number(this.id),
        sex: this.form.sex,
        skill: this.form.skill,
        isMyOwnEmp: false,
        pageNum: this.currentPage,
        pageSize: 20,
        nameAlias: this.form.nameAlias,
        keyWords: this.form.keyWords
      };
      this.$api
        .getmanagerEmpList(params)
        .then(response => {
          this.tableData = response.data.data.list;
          this.total = response.data.data.total;
          this.pageCount = response.data.data.pages
        })
        .catch(error => {
          console.log(error);
        });
    },
  }
}
</script>
