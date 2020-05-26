<template>
  <div style="height: 100%;">
    <div class="workerName">张三</div>
    <div class="redLine"></div>
    <el-form ref="form" :model="form" label-width="90px">
      <!--选择条件的单选按钮-->
      <el-form-item label="绑定状态：" class="formSearchMargin formSearchMarginTop">
        <el-radio-group class="radio-search" v-model="form.bindStatus">
          <el-radio label="">不限</el-radio>
          <el-radio label="1">服务中</el-radio>
          <el-radio label="2">待对方同意解绑</el-radio>
          <el-radio label="3">待我同意解绑</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="标签：" class="formSearchMargin">
        <el-radio-group class="radio-search" v-model="form.skill">
          <el-radio label="">不限</el-radio>
          <el-radio :label="item.skillName" v-for="(item,index) in skillList" :key="index">{{item.skillName}}</el-radio>
          <!--<el-radio label="周结"></el-radio> &ndash;&gt;-->
        </el-radio-group>
      </el-form-item>
      <el-form-item label="关键字：" class="formSearchMargin ">
        <el-input class="rant-input inputWidth keyWFormParent" v-model="form.keyWord"></el-input>
        <el-button type="primary" class="searchBtn keyWBtn">搜索</el-button>
      </el-form-item>
    </el-form>
    <div class="splitLine"></div>
    <div class="recordNum" style="margin-left: 20px;">符合查询条件的记录{{total}}条</div>
    <div class="viewWorkerBox clearfix" style="margin: 20px; margin-bottom: 110px">
      <div class=" vw-box flexSafari" v-for="item in tableData">
        <span class="vw-left flexSafari worker-left">
          <span class="vw-name">{{item.realName}}</span>
          <span class="vw-sex clearfix">
            <span class="vw-sex-tag">{{item.sexName}}</span>
            <span class=" vw-settle-tag" style="margin-left: 8px">{{item.empSettlementType}}</span>
          </span>
          <!--<span class="vw-tag">-->
          <!--<span class="vw-tag-name floatLeft" v-for="skill in item.talentSkills">{{skill.skillName}}</span>-->
          <!--</span> -->
          <span class="vw-tag">
            <span class="vw-tag-name floatLeft">分拣</span>
            <span class="vw-tag-name floatLeft">分拣</span>
          </span>

        </span>
        <span class="vw-center flexSafari"></span>
        <span class="vw-right flexSafari">
          <span class="vw-right-t">
            <span class="vw-right-t-tel floatLeft">手机号：</span>
            <span class="vw-right-t-num floatLeft">{{item.mobile}}</span>
          </span>
          <span class="vw-right-t">
            <span class="vw-right-t-tel floatLeft">身份证号：</span>
            <span class="vw-right-t-num floatLeft">{{item.idCard}}</span>
          </span>
          <span class="vw-right-t">
            <span class="vw-right-t-tel floatLeft">最近分配时间：</span>
            <span class="vw-right-t-num floatLeft">{{item.bindingTime | formatminDate}}</span>
          </span>
        </span>
      </div>
    </div>
    <div class="page-container" v-if="pageCount==0">
      <el-pagination class="pagebox" background layout="prev, pager, next" @current-change="handleCurrentChange" :current-page="currentPage" :page-count="pageCount">
      </el-pagination>
    </div>
    <Nodata :msg="'经理人'" v-if="pageCount==0"></Nodata>
  </div>
  <!--<someComponent></someComponent>-->
</template>

<script>
import util from '../../../common/util'
import Nodata from '../../../components/Nodata'
export default {
  name: "",
  components: {
    Nodata: Nodata
  },
  data() {
    return {
      skillList: '',
      tableData: [],
      currentPage: 1,
      pageSize: 20,
      pageCount: 1,
      id: '',
      form: {
        bindStatus: '',
        skill: '',
      }
    }
  },
  filters: {
    formatminDate(val) {
      return util.minDate(val)
    }
  },
  watch: {
    'form.sex': function (val, oldval) {
      this.currentPage = 1
      this.getList()
    },
    'form.settlementType': function (val, oldval) {
      this.currentPage = 1
      this.getList()
    },
    'form.empManagerStatus': function (val, oldval) {
      this.currentPage = 1
      this.getList()
    },
    'form.skill': function (val, oldval) {
      this.currentPage = 1
      this.getList()
    },
    'form.isMyOwnEmp': function (val, oldval) {
      this.currentPage = 1
      this.getSkill()
      this.getList()
    },
  },
  mounted() {
    this.id = this.$route.params.id;
    this.getSkill()
    this.getList()
  },
  methods: {
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
        empManagerStatus: this.form.empManagerStatus,
        sex: this.form.sex,
        settlementType: this.form.settlementType,
        skill: this.form.skill,
        isMyOwnEmp: true,
        pageNum: this.currentPage,
        pageSize: 20,
        nameAlias: this.form.nameAlias,
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

<style scoped>
.worker-left {
  width: 24%;
}
.vw-settle-tag {
  font-family: PingFang-SC-Medium;
  font-size: 10px;
  color: #666666;
  padding: 4px;
  text-align: center;
  float: left;
  background-color: #eeeeee;
  border-radius: 3px;
}
.vw-sex-tag {
  font-family: PingFang-SC-Medium;
  font-size: 10px;
  color: #6cd674;
  padding: 4px;
  text-align: center;
  float: left;
  background-color: #eeeeee;
  border-radius: 3px;
  width: 27px;
  height: auto;
}
</style>