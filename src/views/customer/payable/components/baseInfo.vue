<template>
    <div>
    <div class="box-body-item">
        <!--<div class="box-body-item-title">基本信息</div>-->
        <!--<div class="line"></div>-->
        <div class="table-info info-item">
            <div class="table-info-col1"><span>任务名称</span></div>
            <div class="table-info-col2"><span>{{this.form.taskName}}</span></div>
            <div class="table-info-col1"><span>任务所属</span></div>
            <div class="table-info-col2">
                <span class="is-mylink" @click="RouteToBelong(form)">{{this.form.belongToName}}</span>
                </div>
            <div class="table-info-col1"><span>发布人</span></div>

            <div class="table-info-col2">
                <span class="is-mylink" @click="RouteToPublish(form)">{{this.form.publishName}}</span></div>
            <div class="table-info-col1"><span>开始时间</span></div>
            <div class="table-info-col2"><span>{{this.form.startTime | formatminDate}}</span></div>
            <div class="table-info-col1"><span>结束时间</span></div>
            <div class="table-info-col2 text-overflow">
                <span>{{this.form.endTime | formatminDate}}</span>
                <!--<el-tooltip class="item" effect="dark" :content="this.form.address" placement="top-start">-->
                    <!--<span show-overflow-tooltip>{{this.form.address}}</span>-->
                <!--</el-tooltip>-->
            </div>
            <div class="table-info-col1"><span>核定人数</span></div>
            <div class="table-info-col2"><span>{{this.form.authorizedNumber}}</span></div>

            <div class="table-info-col1"><span>工种价格上限控制</span></div>
            <div class="table-info-col2"><span>{{this.form.uppeLimit | formatuppeLimit}}</span></div>
            <div class="table-info-col1"><span>结算方式</span></div>
            <div class="table-info-col2"><span>{{this.form.settlementTypeName}}</span></div>
            <div class="table-info-col1"><span>任务单价</span></div>

            <div class="table-info-col2">
              <span>
                  <el-tooltip class="item" effect="dark" :content="content" placement="top-start">
                    <span class="text-overflow">
                        {{content}}
                    </span>
                  </el-tooltip>
              </span>
            </div>
            <div class="table-info-col1"><span>上班时间</span></div>
            <div class="table-info-col2"><span>{{this.form.workStartTime}}</span></div>
            <div class="table-info-col1"><span>下班时间</span></div>
            <div class="table-info-col2 text-overflow">
                    <span>{{this.form.workEndTime}}</span>
            </div>
            <!--<div class="table-info-col2">-->
                <!--<el-button type="text" @click="visible=true" class="chakan">查看</el-button>-->
            <!--</div>-->
            <div class="table-info-col1"><span>工作地点</span></div>
            <div class="table-info-col2"><span>{{this.form.workingPlace}}</span></div>

            <div class="table-info-col1"><span>性别要求</span></div>
            <div class="table-info-col2">
                <span> 男工{{this.form.maleNumber | formatNumber}}</span>、
                <span>  女工{{this.form.femaleNumber| formatNumber}}</span>
            </div>
            <div class="table-info-col1"><span>年龄要求</span></div>
            <div class="table-info-col2 text-overflow">
                <span>  {{this.form.ageLowerLimit}}到{{this.form.ageUpperLimit}}岁</span>
            </div>
            <!--<div class="table-info-col2">-->
                <!--<el-button type="text" @click="visible=true" class="chakan">查看</el-button>-->
            <!--</div>-->
            <div class="table-info-col1"><span>工种要求</span></div>
            <div class="table-info-col2">
              <el-tooltip
              class="item"
              effect="dark"
              :content="this.form.industryListName"
              placement="top-start"
            >
              <span show-overflow-tooltip>{{this.form.industryListName}}</span>
            </el-tooltip>
            </div>

            <div class="table-info-col1"><span>预计工作量</span></div>
            <div class="table-info-col2"><span>{{this.form.estimatedWorkload}}{{this.form.estimatedUnit | formatUnit}}</span></div>
            <div class="table-info-col1"><span>其他要求</span></div>
            <div class="table-info-col2">
                <el-tooltip class="item" effect="dark" :content="this.form.note" placement="top-start">
                <span show-overflow-tooltip>{{this.form.note}}</span>
                </el-tooltip>
            </div>
            <div class="table-info-col1"><span>创建时间</span></div>

            <div class="table-info-col2"><span>{{this.form.createdAt | formatminDate}}</span></div>

        </div>
    </div>

        <big-image @handleWrapperClick="handleWrapperClick" :image="this.form.businessLicense" :visible="visible"></big-image>
</div>
</template>

<script>
  import BigImage from "../../../../components/bigImage.vue";
  import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";
  import util from '../../../../common/util'

  export default {
    name: "",
    components: {
      ElButton,
      BigImage},
    data() {
      return {
        form:{},
        visible:false,
        msg: "Hello Vue.js",
        reveiveId:'',
        publishId:'',
        price:{},
      content:''
      }
    },

    filters:{
      formatminDate(val){
        return util.minDate(val)
      },
      formatuppeLimit(val){
        if(val==1){
          return '启用'
        }else if(val==2){
          return '关闭'
        }else{
          return ''
        }
      },
      formatNumber(val){
        if(val==null){
          return '不限'
        }else{
          return val+'人';
        }
      },
      formatUnit(val){
        if(val==1){
          return '件'
        }else if(val==2){
          return '吨';
        }
      },
      formatAccountStatus(val){

      }
    },

    created(){

    },
    mounted(){
      this.getDetail()
    },
    methods: {
      RouteToReceive(row){
        const params = {
          userId:row.receiveUserId,
          type:row.taskType,
        }
        this.$api.getPrimaryKey(params).then(response => {
          console.log(response)
          if(response.respCode==0){
            this.reveiveId=response.data
            if(row.receiveUserType==1 ){
              const { href } = this.$router.resolve({
                name: "pmDetail",
                params: {
                  id: this.reveiveId,
                }
              });
              window.open(href, "_blank");
            }else if(row.receiveUserType==2){
              const { href } = this.$router.resolve({
                name: "workerDetail",
                params: {
                  id: this.reveiveId,
                }
              });
              window.open(href, "_blank");
            }
          }else {
            this.$message.error(response.errorMsg)
          }
        })
            .catch(error => {
              console.log(error);
            });
      },
      RouteToPublish(row){
        const params = {
          userId:row.createdBy,
          type:row.taskType,
        }
        this.$api.getPrimaryKey(params).then(response => {
          console.log(response)
          if(response.respCode==0){
            this.publishId=response.data
            if(row.taskType==1 || row.taskType==2){
              const { href } = this.$router.resolve({
                name: "customerDetail",
                params: {
                  id: this.publishId,
                }
              });
              window.open(href, "_blank");
            }else if(row.taskType==3){
              const { href } = this.$router.resolve({
                name: "pmDetail",
                params: {
                  id: row.publishId,
                }
              });
              window.open(href, "_blank");
            }
          }else {
            this.$message.error(response.errorMsg)
          }
        })
            .catch(error => {
              console.log(error);
            });
      },
      RouteToBelong(row){
        if(row.taskType==3){
          const { href } = this.$router.resolve({
            name: "taskTrackDetail",
            query: {
              id: row.belongTo,
            }
          });
          window.open(href, "_blank");
        }else if(row.taskType==2){
          const { href } = this.$router.resolve({
            name: "subCustomerDetail",
            params: {
              id: row.belongTo,
            }
          });
          window.open(href, "_blank");
        }else if(row.taskType==1){
          const { href } = this.$router.resolve({
            name: "customerDetail",
            params: {
              id: row.belongTo,
            }
          });
          window.open(href, "_blank");
        }

      },
      getDetail(){
        const params = {
          id:this.$route.params.id,
        }
        this.$api.TaskDetail(params).then((response) => {
          console.log(response)
          this.form=response.data;
          this.price = JSON.parse(this.form.price)
        }).catch((error) => {
          console.log(error);
        });
      },
      handleWrapperClick(){
        this.visible=false
      },
    },
    watch: {
      price:{//深度监听，可监听到对象、数组的变化
          handler(val, oldVal){
            let content = ''
            if(this.form.valuationType != 1 && !val.countSettle){
              if(!val.countTime){
                
                content = `${(val.ladderObj)[0].count}件以下（含），${(val.ladderObj)[0].unit}元/件`
                for(let i in val.ladderObj){
                  if(i > 0 && i != (val.ladderObj.length - 1)){
                    content += `；${(Number((val.ladderObj)[i-1].count)) + 1}至${(val.ladderObj)[i].count}件（含），${(val.ladderObj)[i].unit}元/件`
                    
                  }
                }
                content += `；${(val.ladderObj)[val.ladderObj.length-2].count}件以上，${(val.ladderObj)[val.ladderObj.length-1].overUnit}元/件`
              }else{
                content = `${val.countTime}元/小时；`
                content += `${(val.ladderObj)[0].count}件以下（含），${(val.ladderObj)[0].unit}元/件`
                for(let i in val.ladderObj){
                  if(i > 0 && i != (val.ladderObj.length - 1)){
                    content += `；${(Number((val.ladderObj)[i-1].count)) + 1}至${(val.ladderObj)[i].count}件（含），${(val.ladderObj)[i].unit}元/件`
                    
                  }
                }
                content += `；${(val.ladderObj)[val.ladderObj.length-2].count}件以上，${(val.ladderObj)[val.ladderObj.length-1].overUnit}元/件`
              }
            }
            if(this.form.valuationType == 1){
              content = `${val.countTime}元/小时`
            }
            if(this.form.valuationType == 2 && val.countSettle){
              content = `${val.countSettle}元/件`
            }
            if(this.form.valuationType == 3 && val.countSettle){
              content = `${val.countTime}元/小时；${val.countSettle}元/件`
            }
            this.content = content
          },
          deep:true
      }
    }
  }
</script>

<style scoped>
    .info-item{
        margin: 20px 0px;
    }
    .box-body-item-title{
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #262626;
        line-height: 40px;
    }
    .box-body-item{
        margin-top:40px;
    }
    .line{
        /*height: 2px;*/
        /*background-color: #e5e5e5;*/
        /*width:100%;*/
    }
</style>