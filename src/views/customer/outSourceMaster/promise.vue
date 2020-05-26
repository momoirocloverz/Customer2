<template>
    <div class="promisedTaskCon">
        <div>
            <div class="filter-condition addWhite">
                <el-form :model="searchForm" label-width="100px" labelPosition="left">
                    <div class="search-zone">
                        <el-form-item class="formSearchMargin">
                            <el-input placeholder="根据下拉框选项输入关键字搜索" v-model="searchForm.keyWord" size="mini" class="input-with-select select-input" >
                                <el-select v-model="searchForm.selectType" slot="append" placeholder="请选择" >
                                    <el-option label="任务名称" value="1"></el-option>
                                    <el-option label="经理人" value="2"></el-option>
                                </el-select>
                            </el-input>
                            <el-button type="primary" class="searchBtn" @click="handleSearch">搜索</el-button>
                            <el-button class="comb-btn removeHere" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>              
                        </el-form-item>
                    </div>          
                    <div v-show="isShowComb" class="combine-zone">
                        <el-form-item label="结算方式：" class="formSearchMargin">
                            <el-radio-group class="radio-search" v-model="searchForm.settlementType" @change="settlementTypeChange(searchForm.settlementType)">
                                <el-radio label="">不限</el-radio>
                                <el-radio label="2">月结</el-radio>
                                <el-radio label="4">周结</el-radio>
                                <el-radio label="1">日结</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="任务状态：" class="formSearchMargin formSearchMarginTop">
                            <el-radio-group class="radio-search" v-model="searchForm.status" @change="statusChange">
                                <el-radio label="">不限</el-radio>
                                <el-radio :label="1">未开始</el-radio>
                                <el-radio :label="2">进行中</el-radio>
                                <el-radio :label="3">已结束</el-radio>
                            </el-radio-group>
                            </el-form-item>
                    </div>
                </el-form>
            </div>
        </div>        
        <div>
            <div class="describeCon addWhite">
            <div class="leftPart"><span>合计：{{ summaryData.totalWorkHours | workHoursFilter }} 小时，</span><span>{{ summaryData.totalJian || 0 }} 件，</span><span>{{ summaryData.totalDai || 0 }} 袋，</span><span>{{ functionProcesser(summaryData.totalDun) }} 吨，</span><span>{{ summaryData.totalChe || 0 }} 车</span></div>
            <div><span>合计金额：{{ functionProcesser(+(summaryData.totalUnPayAmount) + +(summaryData.totalPayedAmount)) }} 元，</span><span>合计待付 {{ summaryData.totalUnPayAmount || 0 }} 元，</span><span>合计已付 {{ summaryData.totalPayedAmount || 0 }} 元</span></div>
        </div>
            <el-table :data="tableData" empty-text="暂无相关任务信息">
                <el-table-column label="任务" prop="taskName" show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="发布人" prop="publisherName" show-overflow-tooltip align="center" ></el-table-column>
                <el-table-column label="总工时" show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <div>{{ scope.row.totalWorkHours | workHoursFilter }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="总产量"show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <div>
                            <span>{{ scope.row.totalPieceSize ? JSON.parse(scope.row.totalPieceSize).jian : 0 }}件、</span>
                            <span>{{ scope.row.totalPieceSize ? JSON.parse(scope.row.totalPieceSize).dai : 0  }}袋、</span>
                            <span>{{ scope.row.totalPieceSize ? JSON.parse(scope.row.totalPieceSize).che : 0 }}车、</span>
                            <span>{{ scope.row.totalPieceSize ? functionProcesser(JSON.parse(scope.row.totalPieceSize).dun)  : 0 }}吨</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="合计金额(元)" show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <div>{{ functionProcesser(scope.row.totalAmount) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="待付金额"  show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <div>{{ functionProcesser(scope.row.totalUnPayAmount) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="已付金额" show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <div>{{ functionProcesser(scope.row.totalPayedAmount) }}</div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" show-overflow-tooltip align="center" >
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">班务明细</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container addWhite" v-if="total!==0">
                <el-pagination class="pagebox" layout="total , prev, pager, next, jumper" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentChange" :page-size="pageSize">
                </el-pagination>
              </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "promisedTask",
    data() {
        return {
            tableData:[{taskName:'hi',assignmentInfoId:12}],
            isShowComb: false,
            searchForm:{
                status:'',
                settlementType:'',
                selectType:'1',
            },
            currentPage: 1,
            pageSize: 20,
            total: 0,
            summaryData:{
                totalWorkHours:0,
                totalJian:0,
                totalDai:0,
                totalChe:0,
                totalDun:0,
                totalUnPayAmount:0,
                totalPayedAmount:0,
            },
        }
    },
    filters:{
        workHoursFilter(value){
              if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                return 0;
            } else {
                let fix = (Math.round(+value + 'e' + 1) / Math.pow(10, 1)).toFixed(1);
                return fix;
            }
        },
    },
    mounted() {
        this.getData();
    },
    methods: {
        functionProcesser(value){
            if ((toString.call(value) === '[object Null]') || (toString.call(value) === '[object Undefined]')) {
                return 0;
            } else {
                if( value == 0 ){
                    return 0;
                }else{
                    let fix = (Math.round(+value + 'e' + 2) / Math.pow(10, 2)).toFixed(2);
                    return fix;
                }
            }
        },
        routeToDetail(row){
            this.$router.push({
                name: "outSourcePromitemDetails" ,
                query:{
                    assmId:row.assignmentInfoId,
                    rowTaskName:row.taskName,
                }
            });
        },
        getSummary(params){
            this.$api.getOutPromiseSummary(params).then(res=>{
              let { data:layer1 } = res;
              let { data,respCode } = layer1;
              if( respCode === 0 ){
                  if(data){
                      this.summaryData = data;
                  }else{
                      this.summaryData = {
                        totalWorkHours:0,
                        totalJian:0,
                        totalDai:0,
                        totalChe:0,
                        totalDun:0,
                        totalUnPayAmount:0,
                        totalPayedAmount:0,
                      };
                  }
              }
          }).catch(err=>{
              console.log('err',err);
          })
        },
        statusChange(){
            this.handleSearch();
        },
        handleCurrentChange(val){
            this.currentPage = val;
            this.getData();
        },
        getData(){
            let params = {
                pageNum: this.currentPage,
                pageSize: this.pageSize,
                settlementType:this.searchForm.settlementType,
                processStatus:this.searchForm.status,
            };              
            if(this.searchForm.selectType == '1'){
                params.assmName = this.searchForm.keyWord;
            }
            if(this.searchForm.selectType == '2'){
                params.cusName = this.searchForm.keyWord;
            }            
          this.$api.getOutPromiseLists(params).then(res=>{
              let { data:layer1 } = res;
              let { data,respCode } = layer1;
              if( respCode === 0 ){
                  this.total = data.total;
                  if(data.list){
                      data.list.forEach(ele=>{
                         ele.totalAmount = (+(ele.totalPayedAmount ? ele.totalPayedAmount : 0) + +(ele.totalUnPayAmount ? ele.totalUnPayAmount : 0));
                      });
                      this.tableData = data.list;
                  }else{
                      this.tableData = [];
                  }
              }
          }).catch(err=>{
              console.log('err',err);
          })
          this.getSummary(params);
        },
        settlementTypeChange(val){
            this.currentPage =1;
            this.getData();
        },
        handleSearch(){
            this.currentPage =1;
            this.getData();
        },
        handleCombShow(){
            this.isShowComb = !this.isShowComb;
        },
    },
}
</script>
<style scoped lang="scss">
    .promisedTaskCon {
        .searchBtn {
            vertical-align: 2px;
        }
        .addWhite {
            background-color: #fff;
        }
        .removeHere {
            margin-left: 0;
            vertical-align: 2px;
        }
        .describeCon {
            margin-top: 10px;
            padding-top: 18px;
            padding-bottom: 18px;
            padding-left: 24px;
            box-sizing: border-box;
            font-size: 12px;
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
            .leftPart {
                margin-right: 80px;
                
            }
        }
    }
</style>