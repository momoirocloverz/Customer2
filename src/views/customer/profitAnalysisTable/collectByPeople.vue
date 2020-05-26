<template>
    <div class="collectBySomeCon">
        <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;">
            利润分析-按班务经理</h1>
        <div style="background-color:#fff;">
            <el-form :model="limitForm" class="pt10 pb10" label-width="100px" labelPosition="center">
                <div class="date-3010">
                    <el-form-item label="选择时段:">
                        <el-radio-group class="radio-search" v-model="limitForm.date" @change="hanldeChangeLimitFormDate">
                            <el-radio label="1">本月</el-radio>
                            <el-radio label="2">上月</el-radio>
                            <el-radio label="3">自定义</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="自定义:" v-if="limitForm.date == '3'">
                        <el-date-picker v-model="limitForm.daterange"
                                        type="daterange"
                                        style="margin-left: -80px;margin-top: -5px"
                                        range-separator="至" start-placeholder="开始日期"
                                        @change="handleChangeDateRange"
                                        end-placeholder="结束日期">
                        </el-date-picker>
                    </el-form-item>
                </div>
                <el-form-item label="选择数据源:">
                    <el-radio-group class="radio-search" v-model="limitForm.dataSource" @change="handleDataSourceChange">
                        <el-radio label="1">收入</el-radio>
                        <el-radio label="2">支出</el-radio>
                        <el-radio label="3">利润</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div class="masterCon">
            <div v-show="showNull"
                 style="width:100%; height:400px;background:#ffffff;text-align:center;padding-top:160px">暂无数据
            </div>
            <div v-show="!showNull" ref="collectBySomeChart" id="collectBySomeChart" style="width:100%; height:400px;background:#ffffff;"></div>
        </div>
        <div class="alertText">注：本页面只有已零工结算的排班数据才会进行统计</div>
        <div>
            <div class="summary">
                <span>合计: 收入{{formStatement.inCome | getPrecision}}元,</span>
                <span>支出{{formStatement.expend | getPrecision }}元, </span>
                <span>利润{{formStatement.profit | getPrecision }}元</span>
            </div>
            <el-table :data="tableData" empty-text="暂无相关信息">
            <el-table-column label="班务经理" prop="managerName" show-overflow-tooltip align="center"></el-table-column>
            <el-table-column label="收入(元)" prop="inCome" :formatter="numberFormat" show-overflow-tooltip
                             align="center"></el-table-column>
            <el-table-column label="支出(元)" prop="expend" :formatter="numberFormat" show-overflow-tooltip
                             align="center"></el-table-column>
            <el-table-column label="利润(元)" prop="profit" :formatter="numberFormat" show-overflow-tooltip
                             align="center"></el-table-column>
            <el-table-column label="操作" show-overflow-tooltip align="center">
                <template v-slot="scope">
                    <el-button type="text" class="btn-icon btn-icon-view" size="mini"
                               @click="routerTo(scope.row)">查看
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                chartInstance:null,
                tableData: [],
                showNull:false,
                limitForm: {
                    date: '1',
                    daterange: [],
                    dataSource: '1',
                    startDate: this.Moment(new Date()).startOf('month').format('YYYY-MM-DD'),
                    endDate: this.Moment(new Date()).format('YYYY-MM-DD')
                },
                formStatement:{
                    inCome:0,
                    expend:0,
                    profit:0,
                },
                options:{},
            }
        },
        filters:{
            getPrecision(cellValue){
                if ((toString.call(cellValue) === '[object Null]') || (toString.call(cellValue) === '[object Undefined]')) {
                      return 0;
                  } else {
                      let fix = (Math.round(+cellValue + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                      return fix;
                  }
            },
        },
        mounted() {
            this.initEchart();
            this.getData();
        },
        methods: {
            rowClass ({ row, column, rowIndex, columnIndex }) {
                if (rowIndex % 2 === 1) {
                    return 'cell-odd-num'
                }
            },
            initEchart(){
                this.chartInstance = this.$echarts.init(this.$refs.collectBySomeChart);
                window.addEventListener('resize', ()=>{
					this.chartInstance.resize();
				});
            },
            drawChart() {
                this.chartInstance.setOption(this.options);
            },
            routerTo(row){
                const {href} = this.$router.resolve({
                    path:'profitCopyDetail',
                    query:{
                        startDate:this.limitForm.startDate,
                        endDate:this.limitForm.endDate,
                        managerId:row.managerId,
                        name:row.managerName
                    }
                })
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
            handleDataSourceChange() {
                this.getData();
            },
            controlOption(data){
                this.options = {
                    color:['#37A2DA','#67E0E3', '#FFDB5C', '#ff9f7f', '#E062AE'],
                     tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                    },
                    grid: {
                        left: '3%',
                        right: '4%',
                        bottom: '3%',
                        containLabel: true
                    },
                    dataZoom: [{
                        type: 'inside'
                    }, {
                        type: 'slider'
                    }],
                    xAxis : [
                        {
                            type : 'category',
                            data:data.x,
                            axisLabel:{
                                interval:0,
                                rotate:30,
                            },
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series :data.series
                };
            },
            getData() {
                const { startDate, endDate, dataSource } = this.limitForm
                let params = {
                    startDate,
                    endDate,
                };   
                this.$api.getClassTaskProfitByManager(params).then(res => {
                    let { data:layer1 } = res;
                    let { respCode,data } = layer1;
                    if (respCode === 0) {
                        if (data) {   
                            function float2Fun(ele){
                                if ((toString.call(ele) === '[object Null]') || (toString.call(ele) === '[object Undefined]')) {
                                    return 0;
                                } else {
                                    let fix = (Math.round(+ele + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                                    return Number(fix);
                                }
                            };                              
                            let generate = [];
                            switch( this.limitForm.dataSource ){
                                case '1':
                                    generate =   [
                                        {
                                            name:'收入',
                                            type:'bar',
                                            stack: '总量',
                                            barWidth : 10,
                                            data:data.inCome.map(ele=>{
                                                return float2Fun(ele);
                                            }),
                                        },
                                    ];
                                    break;
                                case '2':
                                    generate =   [
                                        {
                                            name:'支出',
                                            type:'bar',
                                            stack: '总量',
                                            barWidth : 10,
                                            data:data.expend.map(ele=>{
                                                return float2Fun(ele);
                                            }),
                                        },
                                    ];
                                    break;
                                    case '3':
                                    generate =   [
                                        {
                                            name:'利润',
                                            type:'bar',
                                            stack: '总量',
                                            barWidth : 10,
                                            data:data.profit.map(ele=>{
                                                return float2Fun(ele);
                                            }),
                                        }
                                    ];
                                    break;                                    
                            }
                           let params = {
                               x:data.x,
                               series:generate
                           };
                            this.controlOption(params);
                            this.drawChart();
                            this.formStatement = {
                                inCome:data.inComeTotal,
                                expend:data.expendTotal,
                                profit:data.profitTotal,
                            };
                            if( data.x ){
                                this.showNull = false; 
                            }else{
                                this.showNull = true; 
                            }
                            if( data.classTaskProfitList ){
                                this.tableData = data.classTaskProfitList;
                            }else{
                                this.tableData = [];
                            }
                        }
                    }else{
                        this.showNull = true; 
                    }
                }).catch(err=>{
                    this.showNull = true; 
                    console.log('err',err);
                });       
            },            
            handleCurrentChange(val) {
                this.getData();
            },
            hanldeChangeLimitFormDate(val) {
                switch (val) {
                    case '1':
                        this.limitForm.startDate = this.Moment(new Date()).startOf('month').format('YYYY-MM-DD');
                        this.limitForm.endDate = this.Moment(new Date()).format('YYYY-MM-DD');
                        this.getData();
                        break;
                    case '2':
                        this.limitForm.startDate = this.Moment().month(this.Moment().month() - 1).startOf('month').format('YYYY-MM-DD');
                        this.limitForm.endDate = this.Moment().month(this.Moment().month() - 1).endOf('month').format('YYYY-MM-DD');
                        this.getData();
                        break;
                    case '3':
                        this.limitForm.startDate = '';
                        this.limitForm.endDate = '';
                        break;
                    default:
                        break;
                }
            },
            handleChangeDateRange(val) {
                this.limitForm.startDate = this.Moment(val[0]).format('YYYY-MM-DD');
                this.limitForm.endDate = this.Moment(val[1]).format('YYYY-MM-DD');
                if (this.Moment(this.limitForm.endDate).diff(this.limitForm.startDate, 'days') + 1 > 180) {
                    this.$message.warning('最多选180天');
                    return;
                }
                this.getData();
            },            
        }
    }
</script>
<style lang="scss" scoped>
    .collectBySomeCon {
        width: 100%;
        .alertText {
            font-size: 14px;
            margin-top: 20px;
        }
        .summary {
            font-weight: bold;
            color:#383838;
            font-size:14px;
            padding:20px 0 20px 30px;
            background: #ffffff;
            margin-top:20px;
            border-bottom:1px solid #EAEDF4;
        }
        .masterCon {
            width: 100%;
        }
    }
</style>
<style lang="scss">
    .collectBySomeCon {
        .radio-search .el-radio__input {
            display: none;
        }
        .el-table {
            .cell {
                text-align: center;
                padding-left: 10px;
            }
        }
    }
</style>