<template>
    <div class="" style="width:80%;margin: auto">
        <div class="headerCon">
            <div>利润明细&nbsp;</div>
            <div>{{$route.query.startDate}}~{{$route.query.endDate}}</div>
            <div>&nbsp;{{$route.query.name}}</div>
        </div>
        <div class="pt20 pl10 pb10 pro-t">
            <span>收入</span>
            <span></span>
            <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                       @click="routerTo()">查看收入明细
            </el-button>
        </div>
        <el-table :data="incomeList" border style="width: 100%;">
            <el-table-column prop="classTaskName" label="班务" align="center"></el-table-column>
            <el-table-column prop="inCome" :formatter="numberFormat" label="金额(元)" align="center"></el-table-column>
        </el-table>
        <div class="pt20 pl10 pb10">支出</div>
        <el-table :data="expendList"  border style="width: 100%;">
            <el-table-column prop="title" label="事项" align="center"></el-table-column>
            <el-table-column prop="expend" :formatter="numberFormat" label="金额(元)" align="center"></el-table-column>
        </el-table>
        <div class="pt20 pl10 pb10">利润</div>
        <el-table  :data="profitList" border style="width: 100%;margin-bottom: 100px">
            <el-table-column prop="title" label="事项" align="center"></el-table-column>
            <el-table-column prop="profit" :formatter="numberFormat" label="金额(元)" align="center"></el-table-column>
        </el-table>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                incomeList: [],
                expendList: [
                    {title: '排班收入', expend: 0},
                    {title: '奖惩合计', expend: 0},
                ],
                profitList: [{title: '利润', profit: 0}],
                paramsInfo: {},
            }
        },
        mounted() {
            this.paramsInfo = this.$route.query;
            this.getData()
        },
        methods: {
            routerTo(row) {
                const {href} = this.$router.resolve({
                    path: 'incomeCopyDetail',
                    query:this.$route.query
                });
                window.open(href, '_blank')
            },
            numberFormat(row, column, cellValue) {
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                      return 0;
                  } else {
                      let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                      return fix;
                  }
            },
            getData() {
                this.$api.getProfitDetailByManagerId(this.paramsInfo).then(res => {
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if( respCode === 0 ){
                        if( data ){
                            console.log( 'data',data );
                            let obj1 = {};
                            let arr1 = ['inCome'];
                            let reGroup1 = []; 
                            if(data.inComelist){
                                arr1.forEach(ele=>{  
                                  obj1[ele]= data.inComelist.map(sub=>{
                                      if( !(typeof( sub[ele] ) == 'number') ){
                                          sub[ele] = 0;
                                      }
                                      return sub[ele];
                                  }).reduce((acc,cur)=>{
                                      return acc + cur;
                                  })
                              });
                            }    
                            obj1.classTaskName = '合计';
                            let inBridgeComelist = data.inComelist||[];
                            this.incomeList = [ ...inBridgeComelist,obj1 ];                            
                            let shorter1 = data.classTaskExpend.schuduleInCome || 0;
                            let shorter2 = data.classTaskExpend.rewardsPenalties || 0;
                            let rege1 = [
                                {title: '排班收入', expend:shorter1 },
                                {title: '奖惩合计', expend:shorter2 },
                            ];
                            console.log(shorter1,shorter2);
                            let calucate = Number(shorter1) + Number(shorter2);
                            let waiting = { title: '合计', expend:calucate };
                            this.expendList = [ ...rege1,waiting ];
                            this.profitList[0].profit = data.profit || 0;
                        }
                    }
                }).catch(err => {
                    console.log(err);
                })
            },           
        }
    }
</script>
<style scoped lang="scss">
    .headerCon {
        display: flex;
        justify-content: center;
        align-content: center;
        align-items: center;
        font-size: 18px;
         margin-bottom: 20px;
    }
    .pro-t{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>