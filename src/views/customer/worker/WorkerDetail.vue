<template>
  <span style="width:100%;" class="worker-detail">
    <div style="margin-bottom:30px">
      <el-radio-group v-model="radio4">
        <el-radio-button label="1">基本信息</el-radio-button>
        <!--<el-radio-button label="2">社保信息</el-radio-button>-->
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
          
        <template v-for="(item,index) in talentContacts" v-if="index == 0">
          <div class="table-info-col1"><span>紧急联系人</span></div>
          <div class="table-info-col2">
            <el-tooltip class="item" effect="dark" :content="item.contactName||'待完善'" placement="top">
              <span show-overflow-tooltip>{{item.contactName||'待完善'}}</span>
            </el-tooltip>
          </div>
          <div class="table-info-col1"><span>紧急联系人电话</span></div>
          <div class="table-info-col2"><span>{{item.phone||'待完善'}}</span></div>
          <div class="table-info-col1"><span>紧急联系人关系</span></div>
          <div class="table-info-col2">
            <el-tooltip class="item" effect="dark" :content="item.relationship||'待完善'" placement="top">
              <span show-overflow-tooltip>{{item.relationship||'待完善'}}</span>
            </el-tooltip>
          </div>
            <div class="table-info-col1"><span></span></div>
            <div class="table-info-col2"><span></span></div>
        </template>
        <div class="table-info-col1"><span>身份证正反面照片</span></div>
        <div class="table-info-col2">
            <el-popover  placement="top"  trigger="hover" popper-class="workerDetailFrontText" :disabled="(!frontPic)&&(!backPic)">
                <div class="text" v-if="frontPic"><span><a :href="frontPic" target="_blank">正面</a></span></div>
                <div class="text" v-if="backPic"><span><a :href="backPic" target="_blank">反面</a></span></div>
                <span slot="reference" class="checkIdPic">{{(!frontPic)&&(!backPic) ? '不可用' :'查看'}}</span>
            </el-popover>
        </div> 

        <div  class="table-info-col1"><span>银行卡</span></div>
        <div class="table-info-col2"><span>{{ bindAccountStatus ? '已绑卡' : '未绑卡'}}</span></div>


        <div v-if="!(payWayType=='日结')" class="table-info-col1"><span>状态</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col2"><span>{{data.talentStatus | forTalentStatus}}</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col1"><span>班务经理</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col2">       
          <el-tooltip class="item" effect="dark" :content="data.ownManagerName" placement="top">
            <span show-overflow-tooltip>{{data.ownManagerName ? data.ownManagerName: '无'}}</span>
          </el-tooltip>
        </div>
        <div v-if="!(payWayType=='日结')" class="table-info-col1"><span>结算方式</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col2"><span>{{payWayType ? payWayType : data.settlementType }}</span></div>
         <div v-if="!(payWayType=='日结')" class="table-info-col1"><span>日固定收入</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col2"><span>{{data.dailyPayAmount | forAmount}}</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col1"><span>是否外包</span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col2"><span>{{data.payType | forPayType}}</span></div>      
        <div v-if="!(payWayType=='日结')" class="table-info-col1"><span></span></div>
        <div v-if="!(payWayType=='日结')" class="table-info-col2"></div>



      </span>

    </span>

  </span>
</template>

<script>
export default {
  name: "WorkerDetail",
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
      payWayType:'',
      talentContacts: [],
      tag: '',
      social: {},
      showText:true,
        frontPic:'',
        backPic:'',
        bindAccountStatus:false,
    };
  },
  mounted() {
    if(this.$route.query.payWayType){
      this.payWayType = this.$route.query.payWayType
    }
    if(this.payWayType){
       this.getListDay()
    }else{
      this.getList();
    }
  },
  methods: {
    getListDay() {
      const params = {
        id: this.$route.params.talentId,
      };      
      this.$api.getWorkerDetail(params).then(res => {
                this.data = res.data;    
          if( this.data.accountBanks ){
              this.bindAccountStatus = true;
          }else{
              this.bindAccountStatus = false;
          }
                this.social = res.data.empWelfare ? res.data.empWelfare : {};
                this.talentContacts = res.data.talentContacts;
          this.getIdPics( res.data );
      }).catch(error => {
          console.log(error);
      });
    },
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
        talentId: this.$route.params.talentId,
        // managerId: this.$route.params.id
      };
      this.$api.getWorkerDetailThree(params).then(res => {
          this.data = res.data;
          if( this.data.accountBanks ){
              this.bindAccountStatus = true;
          }else{
              this.bindAccountStatus = false;
          }
          this.social = res.data.empWelfare ? res.data.empWelfare : {};
          this.talentContacts = res.data.talentContacts;
          this.getIdPics( res.data );
          // let l = this.data.ownManagerName.length;
          // if(l > 31){
          //   this.showText = false;
          // }
        }).catch(error => {
          console.log(error);
        });
    },
  },
  filters: {
    forAmount(val) {
      if (val) {
        return `${val}元`
      } else {
        return '无'
      }
    },
    forTalentStatus(val) {
      if (val == 1) {
        return `在用`
      } else if(val == 2){
        return `停用`
      }else{
        return `无`
      }
    },
    forPayType(val) {
      let result = ''
      switch (Number(val)) {
        case 1:
          result = '外包'
          break;
        case 2:
          result = '代发收入'
          break;
        case 3:
          result = '--'
          break;
        default:
          result = '代发收入'
          break;
      }
      return result
    },
    typeFilter(val) {
      let result = ''
      switch (Number(val)) {
        case 1:
          result = '其他'
          break;
        case 2:
          result = '学生'
          break;
        case 3:
          result = '退休人员'
          break;
        default:
          break;
      }
      return result
    }
  },
  watch: {
    // talentContacts: function(val, old) {
    //   // console.log(val)
    //   if ( !val || val.length % 2 == 0 ) {
    //     let div = document.getElementsByClassName("table-info")[0];
    //     let item = document.createElement("div");
    //     item.className = "table-info-col1";
    //     div.appendChild(item);
    //     let item2 = document.createElement("div");
    //     item2.className = "table-info-col2";

    //     div.appendChild(item2);
    //     // console.log(div)
    //   }
    // },
    'data.talentSkills': {
      handler(newValue, oldValue) {
        if( newValue ){
            let tag = []
            for (let i = 0; i < newValue.length; i++) {
              tag.push(newValue[i].skillName)
            }
            this.tag = tag.join(',')
        }  
      },
      deep: true
    },
    'data.settlementType': function (val, old) {
      if (val == 1) {
        this.data.settlementType = '日结'
      }
      if (val == 2) {
        this.data.settlementType = '月结'
      }
      if (val == 3) {
        this.data.settlementType = '实时结'
      }
      if (val == 4) {
        this.data.settlementType = '周结'
      }
    },
  }
};
</script>
<style lang="scss" scoped>
  .worker-detail {
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