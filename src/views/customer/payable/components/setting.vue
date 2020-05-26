<template>
    <div>
        <div style="margin-top: 40px">
            <table class="setting-info-table"  cellspacing="0" cellpadding="0" >
                <tr class="header">
                    <td width="15%">工种</td>
                    <td width="20%">结算方式</td>
                    <td width="20%">性别</td>
                    <td width="45%" >报酬设置</td>
                </tr>
                <tbody v-for="(item,index) in form">
                <tr>
                    <td rowspan="4">{{item.industryName}}</td>
                    <td rowspan="2">{{salary[index][0].settlementType | formatSettle}}</td>
                    <td>{{salary[index][0].price[0].sex == 1 ? '男' : '女'}}</td>
                    <td >
                        <!-- 计时 -->
                        <span v-if="salary[index][0].price[0].countTime">{{salary[index][0].price[0].countTime}}元/小时</span><br/>
                        <!-- 阶梯 -->
                        <span v-if="salary[index][0].price[0].ladderObj && i == 0" v-for="(data,i) in salary[index][0].price[0].ladderObj">{{data.count}}件以下(含)， {{data.unit}}元/件</span><br/>

                        <span v-if="salary[index][0].price[0].ladderObj && i != 0 && i != salary[index][0].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[0].ladderObj">{{Number(salary[index][0].price[0].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}件(含)， {{data.unit}}元/件<br/></span>

                        <span v-if="salary[index][0].price[0].ladderObj && i == salary[index][0].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[0].ladderObj">{{salary[index][0].price[0].ladderObj[i-1].count}}件以上， {{data.overUnit}}元/件</span><br/>
                        <!-- 固定 -->
                        <span v-if="salary[index][0].price[0].countSettle">{{salary[index][0].price[0].countSettle}}元/小时</span><br/>
                    </td>
                </tr>
                <tr>
                    <td>{{salary[index][0].price[1].sex == 1 ? '男' : '女'}}</td>
                    <td>
                        <!-- 计时 -->
                        <span v-if="salary[index][0].price[1].countTime">{{salary[index][0].price[1].countTime}}元/小时</span><br/>
                        <!-- 阶梯 -->
                        <span v-if="salary[index][0].price[1].ladderObj && i == 0" v-for="(data,i) in salary[index][0].price[1].ladderObj">{{data.count}}件以下(含)， {{data.unit}}元/件</span><br/>

                        <span v-if="salary[index][0].price[1].ladderObj && i != 0 && i != salary[index][0].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[1].ladderObj">{{Number(salary[index][0].price[1].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}件(含)， {{data.unit}}元/件<br/></span>

                        <span v-if="salary[index][0].price[1].ladderObj && i == salary[index][0].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[1].ladderObj">{{salary[index][0].price[1].ladderObj[i-1].count}}件以上， {{data.overUnit}}元/件</span><br/>
                        <!-- 固定 -->
                        <span v-if="salary[index][0].price[1].countSettle">{{salary[index][0].price[1].countSettle}}元/小时</span><br/>
                    </td>
                </tr>
                <tr>
                    <td rowspan="2">{{salary[index][1].settlementType | formatSettle}}</td>
                    <td>{{salary[index][1].price[0].sex == 1 ? '男' : '女'}}</td>
                    <td>
                        <!-- 计时 -->
                        <span v-if="salary[index][1].price[0].countTime">{{salary[index][1].price[0].countTime}}元/小时</span><br/>
                        <!-- 阶梯 -->
                        <span v-if="salary[index][1].price[0].ladderObj && i == 0" v-for="(data,i) in salary[index][1].price[0].ladderObj">{{data.count}}件以下(含)， {{data.unit}}元/件</span><br/>

                        <span v-if="salary[index][1].price[0].ladderObj && i != 0 && i != salary[index][1].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[0].ladderObj">{{Number(salary[index][1].price[0].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}件(含)， {{data.unit}}元/件<br/></span>

                        <span v-if="salary[index][1].price[0].ladderObj && i == salary[index][1].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[0].ladderObj">{{salary[index][1].price[0].ladderObj[i-1].count}}件以上， {{data.overUnit}}元/件</span><br/>
                        <!-- 固定 -->
                        <span v-if="salary[index][1].price[0].countSettle">{{salary[index][1].price[0].countSettle}}元/小时</span><br/>
                    </td>
                </tr>
                <tr>
                    <td>{{salary[index][1].price[1].sex == 1 ? '男' : '女'}}</td>
                    <td>
                        <!-- 计时 -->
                        <span v-if="salary[index][1].price[1].countTime">{{salary[index][1].price[1].countTime}}元/小时</span><br/>
                        <!-- 阶梯 -->
                        <span v-if="salary[index][1].price[1].ladderObj && i == 0" v-for="(data,i) in salary[index][1].price[1].ladderObj">{{data.count}}件以下(含)， {{data.unit}}元/件</span><br/>

                        <span v-if="salary[index][1].price[1].ladderObj && i != 0 && i != salary[index][1].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[1].ladderObj">{{Number(salary[index][1].price[1].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}件(含)， {{data.unit}}元/件<br/></span>

                        <span v-if="salary[index][1].price[1].ladderObj && i == salary[index][1].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[1].ladderObj">{{salary[index][1].price[1].ladderObj[i-1].count}}件以上， {{data.overUnit}}元/件</span><br/>
                        <!-- 固定 -->
                        <span v-if="salary[index][1].price[1].countSettle">{{salary[index][1].price[1].countSettle}}元/小时</span><br/>
                    </td>
                </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
  import BigImage from "../../../../components/bigImage.vue";
  import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";

  export default {
    name: "",
    components: {
      ElButton,
      BigImage
    },
    data() {
      return {
        form: [],
        visible: false,
        msg: "Hello Vue.js",
        salary:[]
      }
    },

    filters: {
      formatSettle(val){
        if(val==1){
          return '日结'
        }else if(val==2){
          return '月结'
        }else if(val==3){
          return '实时结'
        }else if(val==4){
          return '周结'
        }else{
          return ''
        }
      },
      formataccountStatus(val) {
        if (val == 1) {
          return '可用'
        } else if (val == 2) {
          return '冻结'
        } else {
          return ''
        }
      },
      formatFeeStatus(val) {
        if (val == 1) {
          return '未开通'
        } else if (val == 2) {
          return '免费试用'
        } else if (val == 3) {
          return '正常'
        } else if (val == 4) {
          return '欠费'
        } else {
          return ''
        }
      },
      formatAccountStatus(val) {

      }
    },

    created() {

    },
    mounted() {
      this.getaskSalaryList()
    },
    methods: {

      getaskSalaryList(){
        const params = {
          taskId	:this.$route.params.id,
        }
        this.$api.taskSalaryList(params).then((response) => {
          this.form = response.data
          for(let i in this.form){
            this.salary.push(JSON.parse(this.form[i].salary))
            // this.
          }
          console.log(this.salary)

          // console.log(this.form)
          this.form=response.data;
        }).catch((error) => {
          console.log(error);
        });
      },
      handleWrapperClick() {
        this.visible = false
      },
    }
  }
</script>

<style scoped>
    table{
        border-right:solid 1px #e4e4e4;
        border-bottom:solid 1px #e4e4e4;
        font-size: 14px;
    }
    td{
        border-left:solid 1px #e4e4e4;
        border-top:solid 1px #e4e4e4;
        height: 70px;
    }
    .header{
        background-color: #f6f6f6;
        font-family: MicrosoftYaHei;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #262626;
    }
    .header td{
        height: 40px;
    }
    .setting-info-table{
        width:100%;
        text-align: center;
    }
</style>