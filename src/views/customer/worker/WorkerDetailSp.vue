<template>
  <span style="width:100%;" class="workerDetailSpCon">
    <div style="margin-bottom:30px">
      <el-radio-group v-model="radio4">
        <el-radio-button label="1">基本信息</el-radio-button>
      </el-radio-group>
      <hr class="el-radio-group-hr" />
    </div>
    <span style="margin:0 auto" v-if="radio4== 1">
      <div class="workerName">{{data.realNameAlias}}</div>
      <span class="table-info">
        <div class="table-info-col1"><span>姓名</span></div>
        <div class="table-info-col2"><span>{{data.realNameAlias }}</span></div>          
        <div class="table-info-col1"><span>性别</span></div>
        <div class="table-info-col2"><span>{{data.sex == '1' ? '男' : '女'}}</span></div>
        <div class="table-info-col1"><span>身份证号</span></div>
        <div class="table-info-col2"><span>{{data.idCard}}</span></div>
        <div class="table-info-col1"><span>手机号</span></div>
        <div class="table-info-col2"><span>{{data.mobile}}</span></div>
        <div class="table-info-col1"><span>出生年月</span></div>
        <div class="table-info-col2"><span>{{data.birthday}}</span></div>
        <div class="table-info-col1"><span>民族</span></div>
        <div class="table-info-col2"><span>{{data.nation||'待完善'}}</span></div>
        <div class="table-info-col1"><span>户籍地址</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="data.originAddress||'待完善'" placement="top">
            <span show-overflow-tooltip>{{data.originAddress||'待完善'}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>现住地址</span></div>
        <div class="table-info-col2 text-overflow">
              <el-tooltip class="item" effect="dark" :content="String(data.province+data.city+data.region+data.address)" placement="top">
            <span show-overflow-tooltip>{{data.province||'待完善'}}{{data.city}}{{data.region}}{{data.address}}</span>
          </el-tooltip>
        </div>
          <div class="table-info-col1"><span>紧急联系人</span></div>
          <div class="table-info-col2">
            <el-tooltip class="item" effect="dark" :content="talentContacts.contactName||'待完善'" placement="top">
              <span show-overflow-tooltip>{{talentContacts.contactName||'待完善'}}</span>
            </el-tooltip>
          </div>
          <div class="table-info-col1"><span>紧急联系人电话</span></div>
          <div class="table-info-col2"><span>{{talentContacts.phone||'待完善'}}</span></div>
          <div class="table-info-col1"><span>紧急联系人关系</span></div>
          <div class="table-info-col2">
            <el-tooltip class="item" effect="dark" :content="talentContacts.relationship||'待完善'" placement="top">
              <span show-overflow-tooltip>{{talentContacts.relationship||'待完善'}}</span>
            </el-tooltip>
          </div>
        <div class="table-info-col1"><span>身份证正反面照片</span></div>
        <div class="table-info-col2">
            <el-popover  placement="top"  trigger="hover" popper-class="workerDetailFrontText" :disabled="(!frontPic)&&(!backPic)">
                <div class="text" v-if="frontPic"><span><a :href="frontPic" target="_blank">正面</a></span></div>
                <div class="text" v-if="backPic"><span><a :href="backPic" target="_blank">反面</a></span></div>
                <span slot="reference" class="checkIdPic">{{(!frontPic)&&(!backPic) ? '不可用' :'查看'}}</span>
            </el-popover>
        </div> 
      </span>

    </span>

  </span>
</template>

<script>
export default {
  name: "WorkerDetailSp",
  data() {
    return {
      radio4: 1,
      form: {
        sex: "不限",
        settleType: "不限",
        manager: "不限",
        tag: "不限",
        keyWord: ""
      },
      data: {},
      talentContacts: [],
      tag: '',
        frontPic:'',
        backPic:'',
    };
  },
  mounted() {
      this.getList();
  },
  methods: {
      getIdPics( data ){
          if( data.idCardPositive ){
              this.frontPic = data.idCardPositive;
          }else{
              this.frontPic = '';
          }
          if( data.idCardNegative ){
              this.backPic = data.idCardNegative;
          }else{
              this.backPic = '';
          }
      },
    getList() {
      const params = {
          talentId: this.$route.query.talentId,
      };
      this.$api.copyDetailLite(params).then(res => {
          let { respCode,data } = res;
          if( respCode === 0 ){
              this.data = data;
              if( data.talentContacts.length ){
                  this.talentContacts = data.talentContacts[0];
              }
              this.getIdPics( data );
          }
        }).catch(error => {
          console.log(error);
        });
    },
  },
};
</script>
<style lang="scss" scoped>
  .workerDetailSpCon {
    .el-radio-button:first-child:last-child .el-radio-button__inner{
      border-radius:0;
    }
    .workerName {
      font-size: 18px;
      color: #262626;
      margin-bottom: 20px;
    }
    .table-info{
      justify-content:start;
    }
      .checkIdPic {
          cursor: pointer;
      }
  }
</style>
<style lang="scss">
    .workerDetailFrontText {
          color: #e84518;
          text-align: center;
        .text a{
            text-decoration: none;
            color: #e84518;
            cursor: pointer;
            height: 40px;
            line-height: 40px;
            box-sizing: border-box;
        }
      }
</style>