<template>
    <div>
        <el-form :model="form" label-width="100px" labelPosition="center">
                <el-form-item label="时间范围：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="form.months">
                        <el-radio label="">本年度</el-radio>
                        <el-radio label="1">自定义</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="自定义：" class="formSearchMargin" v-if="form.months == '1'">
                        <el-date-picker class="margin_left40" size="mini" v-model="form.startDate" type="month" value-format="yyyy-MM-dd" placeholder="选择开始时间">
                        </el-date-picker>
                        --
                        <el-date-picker class="margin_left10" size="mini" v-model="form.endDate" type="month" value-format="yyyy-MM-dd" placeholder="选择结束时间">
                        </el-date-picker>
                        <el-button type="primary" size="small" class="datesearchBtn newbtn" @click="btn_true">确定</el-button>
                </el-form-item>
            </el-form>
            <div>
                <div id="chartmainline" style="width:100%; height:400px;background:#ffffff;"></div>
            </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            form: {
                months: '',
                startDate: '',
                endDate: ''
            },
            options : {
                tooltip: {
                    trigger: 'axis'
                },
                toolbox: {
                    show: true,
                    feature: {
                        dataView: {readOnly: false},
                        magicType: {type: ['line', 'bar']},
                        saveAsImage: {}
                    }
                },
                xAxis:  {
                    type: 'category',
                    boundaryGap: false,
                    name: '月份',
                    data: []
                },
                yAxis: {
                    type: 'value',
                    name: '利润汇总',
                    axisLabel: {
                        formatter: '{value}'
                    }
                },
                series: [
                    {
                        name:'利润汇总',
                        type:'line',
                        data:[],
                    }
                ]
            },
        }
    },
    watch: {
        'form.months': function(val,old){
            if(val == ''){
                this.currentPage = 1
                this.getData()
                this.drawChart()
            }else if(val == '1'){
                this.form.startDate = ''
                this.form.endDate = ''
            }
        }
    },
    mounted(){
        this.drawChart()
        this.getData()
    },
    methods: {
        getData(){
            if(this.form.months == ''){
                this.form.startDate = ''
                this.form.endDate = ''
            }else if(this.form.months == '1'){
                this.form.startDate = this.form.startDate
                this.form.endDate = this.form.endDate
            }
            let params = {
                monthStart: this.form.startDate?this.form.startDate.substr(0,7):'',
                monthEnd: this.form.endDate?this.form.endDate.substr(0,7):'',
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                order: "asc"
            }
            this.$api.profitTotalQuery(params).then(res => {
                // console.log(res)
                if(res.respCode == 0){
                    if(res.data.list){
                        let yearMonthStr = []
                        let profitAll = []
                        res.data.list.forEach(item => {
                            yearMonthStr.push(item.yearMonthStr)
                            profitAll.push(item.profit)
                        });
                        this.options.xAxis.data = yearMonthStr
                        this.options.series[0].data = profitAll
                        this.drawChart()
                    }else {
                        this.options.xAxis.data = []
                        this.options.series[0].data = []
                        this.drawChart()
                    }
                }
            }).catch()
        },
        drawChart() {
            let chartmainline = this.$echarts.init(document.getElementById("chartmainline"));
            chartmainline.setOption(this.options)
        },
        btn_true(){
            if(!this.form.startDate&&!this.form.endDate){
                return this.$message.error('时段不能为空')
            }else if(!this.form.startDate){
                return this.$message.error('开始时间不能为空')
            }else if(!this.form.endDate){
                return this.$message.error('结束时间不能为空')
            }else if(this.form.startDate > this.form.endDate){
                return this.$message.error('结束时间不能早于开始时间')
            }
            this.getData()
            this.drawChart()
        }
    }
}
</script>

<style scoped>
.el-button--primary{
    margin-left: 15px;
}
</style>
