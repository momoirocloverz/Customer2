<template>
    <div class="attendceMarksCon back-white" v-loading="loading" element-loading-text="正在处理数据...">
        <div class="filter-condition" v-show="isShowComb">
            <div class="pt10 pb10 linebdb mb10 f14 fs-bold">选择筛选条件</div>
            <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
                <el-form-item label="客户：" class="formSearchMargin formSearchMarginTop">
                    <el-radio-group class="radio-search" v-model="form.belongtoItem">
                        <el-radio :label="item.belongTo" v-for="(item,index) in belongToList" :key="index">
                            {{item.belongToName}}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="选择班务：" class="formSearchMargin formSearchMarginTop">
                    <div class="f12 co-999 pl10 pb5 ">
                        可多选,不选查所有
                    </div>
                </el-form-item>
                <el-form-item label="" class="formSearchMargin formSearchMarginTop select-new-307">
                    <div class="select-el-wrap pl10 pb20">
                        <span class="f12">进行中</span>
                        <el-select class="ml20" v-model="taskId" filterable multiple remote reserve-keyword
                                   placeholder="请输入关键字并选择"
                        >
                            <el-option
                                    v-for="item in taskingList"
                                    :key="item.classTaskId"
                                    :label="item.classTaskName"
                                    :value="item.classTaskId">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="select-el-wrap pl50 pb20">
                        <span class="f12">已结束</span>
                        <el-select class="ml20" v-model="taskId2" filterable multiple remote reserve-keyword
                                   placeholder="请输入关键字并选择">
                            <el-option
                                    v-for="item in taskedList"
                                    :key="item.classTaskId"
                                    :label="item.classTaskName"
                                    :value="item.classTaskId">
                            </el-option>
                        </el-select>
                    </div>
                </el-form-item>
                <el-form-item label="选择零工：" class="formSearchMargin">
                    <el-row class="pl10">
                        <el-col :span="12">
                            <el-autocomplete
                                    class="inline-input"
                                    v-model="form.keyWord"
                                    :fetch-suggestions="querySearch"
                                    placeholder="输入零工姓名"
                                    :trigger-on-focus="false"
                                    @select="handleSelect"
                            ></el-autocomplete>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item label="结算方式：" class="formSearchMargin pt10">
                    <el-radio-group class="radio-search" v-model="form.settlementType">
                        <el-radio label="">不限</el-radio>
                        <el-radio label="2">月结</el-radio>
                        <el-radio label="4">周结</el-radio>
                        <el-radio label="1">日结</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="日期范围：" class="formSearchMargin pt10">
                    <el-radio-group class="radio-search" v-model="dateStatus">
                        <el-radio label="1">不限</el-radio>
                        <el-radio label="2">本月</el-radio>
                        <el-radio label="3">自定义</el-radio>
                    </el-radio-group>
                    <div v-show="dateStatus == '3'" class="pt10">
                        <el-date-picker class="" size="mini" v-model="startDate" type="date"
                                        value-format="yyyy-MM-dd" placeholder="选择开始时间">
                        </el-date-picker>
                        --
                        <el-date-picker class="margin_left10" size="mini" v-model="endDate" type="date"
                                        value-format="yyyy-MM-dd" placeholder="选择结束时间">
                        </el-date-picker>
                        <!--<el-button type="primary" class="datesearchBtn" @click="btn_get">确定</el-button>-->
                    </div>
                </el-form-item>
            </el-form>
            <div class="tc">
                <el-button @click="queryList()" type="primary">查询</el-button>
            </div>
        </div>

        <div v-show="!isShowComb" class="divs" style="border:1px solid #E6E7EB;">
            <div style="padding: 15px 0 15px 24px;    border-bottom: 1px solid #E6E7EB;font-size:12px;color:#4D4D4D;">
                合计：&nbsp;&nbsp;&nbsp;{{totalData.totalWorkHours || 0}}小时 &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                {{totalData.totalJian || 0}}件 &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{{totalData.totalDai || 0}}袋
                &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{{totalData.totalChe || 0}}车&nbsp;&nbsp;&nbsp; &nbsp;|
                &nbsp;&nbsp;&nbsp;{{totalData.totalDun?totalData.totalDun.toFixed(2) : 0}}吨
            </div>
            <div class="back-white btn-div flexable" style="justify-content: space-between;">
                <el-button class="primary-btn" size="mini" @click="handleexport" style="width:135px;"
                           :disabled="tableData.length == 0 ? true : false">导出考勤数据
                </el-button>
                <el-button class="primary-btn" size="mini" @click="queryRefresh()">重新查询</el-button>
            </div>
        </div>
        <div v-show="!isShowComb" class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关考勤信息,已经是最后一页了">
                <!-- <el-table-column type="expand">
                  <template slot-scope="scope">
                    <div class="table-style">
                      <div class="table-tr">
                        <p class="table-td">
                          <span class="td-title">所属班务：</span>
                          <span class="is-link" @click="RouteToTask(scope.row)">{{ scope.row.taskName }}
                            <el-tooltip :content="scope.row.taskName" placement="top">
                              {{scope.row.taskName.substring(0,10)}}...
                            </el-tooltip>
                          </span>
                        </p>
                        <p class="table-td"><span class="td-title">客户：</span>{{scope.row.customerIndirectCustomerName || scope.row.customerShortName}}</p>
                        <p class="table-td"><span class="td-title">考勤时间：</span>{{scope.row.schedulingDate}}</p>
                        <p class="table-td" v-if="scope.row.hasPhoto != 1"><span class="td-title">考勤图片：</span><span class="is-link" @click="routeToImg(scope.row)">查看</span></p>
                      </div>
                    </div>
                  </template>
                </el-table-column> -->
                <el-table-column label="姓名" prop="talentNameAlias" show-overflow-tooltip align="center" min-width="80">
                </el-table-column>
                <el-table-column label="工种" prop="industryName" align="center" min-width="80"></el-table-column>
                <el-table-column label="结算方式" prop="settlementTypeName" align="center" min-width="80"></el-table-column>
                <el-table-column label="班务" prop="taskName" align="center" min-width="80" show-overflow-tooltip>
                    <template v-slot="scope">
                        <span>{{ scope.row.taskName }}</span>
                        <!--<span class="is-link" @click="RouteToTask(scope.row)">{{ scope.row.taskName }}</span>-->
                    </template>
                </el-table-column>
                <el-table-column label="排班日期" show-overflow-tooltip align="center" min-width="80">
                    <template v-slot="scope">
                        <!-- @click="RouteToschedule(scope.row)" -->
                        <span>{{ scope.row.schedulingDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="班务经理" prop="managerNameAlias" align="center" min-width="80"></el-table-column>
                <el-table-column label="客户" align="center" min-width="80">
                    <template v-slot="scope">
                        <span>{{scope.row.customerIndirectCustomerName || scope.row.customerShortName}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="上班时间" prop="customerStartTime" :formatter="startTimeFormatter" align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="下班时间" prop="customerEndTime" :formatter="endTimeFormatter" align="center"
                                 min-width="80"></el-table-column>
                <el-table-column label="工时" prop="customerWorkHours" align="center" min-width="80"></el-table-column>
                <el-table-column label="产量" align="center" min-width="100" show-overflow-tooltip>
                    <template v-slot="scope">
                        {{scope.row.pieceSize | formatPieces}}{{scope.row.pieceState | formatState}}
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-button class="primary-btn" size="mini" :disabled="isFirstPage" @click="prePage()">上一页</el-button>
                <el-button class="primary-btn" size="mini" :disabled="isEndPage" @click="nextPage()">下一页</el-button>
                <!--<el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="currentPage" :page-size="pageSize" :page-count="pageCount">-->
                <!--</el-pagination>-->
            </div>
        </div>

        <el-dialog :visible.sync="setVisible" width="540px" class="base-dialog">
            <div class="dialog-head">
                <p class="base-dialog-title">考勤设置</p>
            </div>
            <div class="dialog-body">
                考勤是否上传本人照片：
                <el-radio-group v-model="form.hasPhoto">
                    <el-radio label="2">是</el-radio>
                    <el-radio label="1" style="margin-left: 30px">否</el-radio>
                </el-radio-group>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" type="primary" @click="handlePhotoSet">保存</el-button>
        <el-button size="medium" @click="setVisible = false">取消</el-button>
      </span>
        </el-dialog>

        <el-dialog :visible.sync="ImageVisible" width="540px" class="base-dialog">
            <div class="dialog-head">
                <p class="base-dialog-title">考勤图片</p>
            </div>
            <div class="dialog-body">
                <div class="dialog-img-box">
                    <span class="img-label">上班考勤图片</span>
                    <img v-if="selected.startPhoto" :src="selected.startPhoto" style="width: 100%"/>
                    <p v-else>暂无考勤图片</p>
                    <span class="img-label">下班考勤图片</span>
                    <img v-if="selected.endPhoto" :src="selected.endPhoto" style="width: 100%"/>
                    <p v-else>暂无考勤图片</p>
                </div>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="exportVisible" width="540px">
            <export/>
        </el-dialog>
    </div>
</template>
<script>
    import Export from './Export.vue'
    import Interval from '../../../common/interval'
    import Util from '../../../common/util'

    export default {
        name: 'AttendenceList',
        components: {Export},
        data() {
            return {
                loading: false,
                isShowComb: true,
                dateStatus: '2',
                belongToList: [],
                exportVisible: false,
                ImageVisible: false,
                setVisible: false,
                selected: {},
                startDate: `${this.Moment(Date.now()).format('YYYY-MM')}-01`,
                endDate: Interval.getDay(0),
                customerList: [],
                form: {
                    customerId: '',
                    settlementType: '',
                    classTaskIdList: [],
                    keyWord: '',
                    date: '',
                    selectType: '3',
                    belongtoItem: '',
                    hasPhoto: '1',
                },
                tableData: [],
                settlementTypeList: [],
                pageCount: 0,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                customerManager: [],
                totalData: {},
                taskId: [],
                taskId2: [],
                taskIds: [],
                taskingList: [],//进行中
                taskedList: [],//已结束
                talentList: [],//零工列表
                wordName:"",
                // isEndPage:false,
            }
        },
        computed: {
            isFirstPage() {
                if (this.currentPage == 1) {
                    return true
                } else {
                    return false
                }
            },
            isEndPage() {
                if (this.tableData.length >= 10) {
                    return false
                } else {
                    return true
                }
            },
        },
        filters: {
            formatTimeString(val) {
                if (val) {
                    return val.substring(0, 5)
                } else {
                    return '未打卡'
                }
            },

            formatPieces(val) {
                if (val) {
                    return Util.formatPieceSize(val)
                } else {
                    return '无'
                }
            },
            formatState(val) {
                if (val == 1) {
                    return '(待审核)'
                } else {
                    return ''
                }
            },
        },
        mounted() {
            this.handleGetTaskBelongToList();
            this.getPhotoSet();
            this.getTalentList();
            this.getTaskList();
        },
        methods: {
            async queryList() {
                if (this.dateStatus == 3) {
                    if (!this.startDate) {
                        return this.$message.error('开始时间不能为空!')
                    }
                    if (!this.endDate) {
                        return this.$message.error('结束时间不能为空!')
                    }
                    if (this.startDate > this.endDate) {
                        return this.$message.error('结束日期要大于开始日期!')
                    }
                }
                this.currentPage = 1;
                this.form.classTaskIdList = this.taskId.concat(this.taskId2);
                await this.getList();
                await this.getTotalData();
                this.isShowComb = false;
            },
            queryRefresh() {
                this.isShowComb = true;
            },
            querySearch(queryString, cb) {
                var restaurants = this.talentList;
                console.log(restaurants);
                var results = queryString ? restaurants.filter((i) => i.value.includes(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            handleSelect(item) {
                this.form.keyWord = item.value;
                console.log(item);
            },
            async getTaskList() {
                let params = {pageNum: 1, pageSize: 0, classTaskStatus: 2};
                let res = await this.$api.getClassTaskCustomerList(params);
                params['classTaskStatus'] = 3;
                let res2 = await this.$api.getClassTaskCustomerList(params);
                if (res.data.respCode === 0) {
                    if (res.data.data.list) {
                        this.taskingList = res.data.data.list
                    }
                }
                if (res2.data.respCode === 0) {
                    if (res2.data.data.list) {
                        this.taskedList = res2.data.data.list
                    }
                }
                console.log(this.taskingList)
                console.log(this.taskedList)
            },
            getTalentList() {
                const params = {
                    customerStatus: 1,
                    pageNum: this.currentPage,
                    pageSize: 0,
                    nameAlias: this.form.keyWord,
                };
                this.$api.getAllEmpList(params).then(res => {
                    let result = res.data ? res.data : [];
                    if (result.length > 0) {
                        this.talentList = result.map((i) => {
                            return Object.assign({}, {value: i});
                        })
                    }
                }).catch(error => {
                    console.log(error);
                });
            },
            prePage() {
                if (this.request) {
                    return
                }
                this.request = true;
                this.currentPage--;
                this.getList()
            },
            nextPage() {
                if (this.request) {
                    return
                }
                this.request = true;
                this.currentPage++;
                this.getList()
            },
            handleGetTaskBelongToList() {
                this.$api.getTaskBelongToList().then(res => {
                    let $belongToList = res.data || [];
                    this.belongToList = [{belongTo: '', belongToName: '不限'}, ...$belongToList.map(it => {
                        return {
                            ...it,
                            belongTo: `${it.belongTo}-${it.belongToType}`
                        }
                    })];
                })
            },
            handleTest(val) {
                console.log(val)
            },
            btn_get() {
                this.currentPage = 1
                this.getList()
                this.getTotalData()
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            formatCusTimeString(val) {
                if (val) {
                    return val.substring(0, 5)
                } else {
                    return '无'
                }
            },
            startTimeFormatter(row, column, cellValue, index) {
                return (row.customerStartDate == row.schedulingDate ? '当日' : '次日') + (this.formatCusTimeString(row.customerStartTime))
            },
            endTimeFormatter(row, column, cellValue, index) {
                return (row.customerEndDate == row.schedulingDate ? '当日' : '次日') + (this.formatCusTimeString(row.customerEndTime))
            },
            handleSearch() {
                this.currentPage = 1
                this.getList()
                this.getTotalData()
            },
            getPhotoSet() {
                const params = {
                    //          id:this.$route.params.id,
                }
                this.$api.getPhotoSet(params).then((response) => {
                    if (response.respCode == 0) {
                        if (response.data) {
                            this.form.hasPhoto = response.data.toString()
                        } else {
                            this.form.hasPhoto = '2'
                        }
                        console.log(this.form.hasPhoto)
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            handlePhotoSet() {
                const params = {
                    hasPhoto: this.form.hasPhoto
                }
                console.log(params)

                this.$api.photoSet(params).then((response) => {
                    if (response.respCode == 0) {
                        this.$message.success('保存成功')
                        this.setVisible = false
                    }
                }).catch((error) => {
                    console.log(error);
                });
            },
            routeToImg(row) {
                this.selected = row;
                this.ImageVisible = true
            },
            handleSet() {
                this.setVisible = true
            },
            handleexport() {
                // this.exportVisible = true
                let belongtoItem = this.form.belongtoItem
                let params = {
                    belongToType: belongtoItem ? belongtoItem.split('-')[1] : '',
                    belongTo: belongtoItem ? belongtoItem.split('-')[0] : '',
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    customerId: this.form.customerId,
                    classTaskIdList: this.form.classTaskIdList,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    settlementType: this.form.settlementType,
                }
                this.loading = true
                this.$api.outerListExport(params).then(res => {
                    // console.log(res)
                    setTimeout(() => {
                        this.loading = false
                    }, 2000)
                    if (res.data.respCode == 0) {
                        window.open(res.data.data)
                    }
                }).catch()
            },
            RouteToTask(row) {
                const {href} = this.$router.resolve({
                    name: "taskTrackDetail",
                    query: {
                        id: row.taskId,
                    }
                });
                window.open(href, "_blank");
            },
            // RouteToschedule(row) {
            //   console.log(row)
            //   const { href } = this.$router.resolve({
            //     name: "schedulingDetail",
            //     params: {
            //       id: row.schedulingId,
            //       hasPhoto: row.hasPhoto,
            //       name: row.schedulingName
            //     }
            //   });
            //   window.open(href, "_blank");
            // },
            getList() {
                this.loading = true
                let _this = this;
                let belongtoItem = this.form.belongtoItem
                const params = {
                    belongToType: belongtoItem ? belongtoItem.split('-')[1] : '',
                    belongTo: belongtoItem ? belongtoItem.split('-')[0] : '',
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    customerId: this.form.customerId,
                    classTaskIdList: this.form.classTaskIdList,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    settlementType: this.form.settlementType,
                }
                this.$api.attendanceList2(params).then((response) => {
                    console.log(response)
                    const {
                        data: {
                            list,
                            pages,
                            total,
                            pageNum,
                            isLastPage,
                        },
                    } = response.data;
                    this.tableData = list || []
                    this.pageCount = pages
                    // this.isEndPage = isLastPage;
                    this.total = total
                }).catch((error) => {
                    console.log(error);
                }).finally(() => {
                    setTimeout(() => {
                        _this.request = false
                        _this.loading = false
                    }, 500)
                });
            },
            getTotalData() {
                let belongtoItem = this.form.belongtoItem
                let params = {
                    belongToType: belongtoItem ? belongtoItem.split('-')[1] : '',
                    belongTo: belongtoItem ? belongtoItem.split('-')[0] : '',
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    customerId: this.form.customerId,
                    classTaskIdList: this.form.classTaskIdList,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    settlementType: this.form.settlementType,
                }
                this.$api.outListSummary(params).then(res => {
                    // console.log(res)
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            this.totalData = res.data.data
                        } else {
                            this.totalData = {}
                        }
                    }
                }).catch()
            },
            getsettlement() {
                this.$api
                    .getDicList("settlementType", 0)
                    .then(response => {
                        this.settlementTypeList = response.data.data;
                    })
                    .catch(error => {
                        console.log(error);
                    });
            },
            handleCurrentChange(val) {
                this.currentPage = val
                this.getList()
            }
        },
        watch: {
            dateStatus: function (val, oldval) {
                if (val == '1') {
                    this.startDate = ''
                    this.endDate = ''
                    // this.getList()
                    // this.getTotalData()
                } else if (val == '2') {
                    this.endDate = Interval.getDay(0)
                    this.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
                    // this.getList()
                    // this.getTotalData()
                } else {
                    this.startDate = ''
                    this.endDate = ''
                }
            },
            // startDate: function (val, oldval) {
            //   if (val) {
            //     this.dateStatus = ''
            //   }
            // },
            // endDate: function (val, oldval) {
            //   if (val) {
            //     this.dateStatus = ''
            //   }
            // },
            activeName: function (val, oldval) {
                if (val === 'second') {
                    this.getPhotoSet()
                }
            },
            // 'form.belongtoItem': function (val, oldval) {
            //     this.currentPage = 1
            //     this.getList();
            //     this.getTotalData()
            // },
            // 'form.customerId': function (val, oldval) {
            //     this.currentPage = 1
            //     this.getList();
            //     this.getTotalData()
            // },
            // 'form.settlementType': function (val, oldval) {
            //     this.currentPage = 1
            //     this.getList();
            //     this.getTotalData()
            // },
            // 'form.managerId': function (val, oldval) {
            //     this.currentPage = 1
            //     this.getList();
            //     this.getTotalData()
            // },
        },
    }
</script>
<style lang="scss">
    .divs .btn-div {
        height: 57px;
        border-top: 0 !important;
    }
    .attendceMarksCon {
        .el-form-item__label{
            color: #333;
            font-weight: bold;
        }
        .select-new-307{
            .el-form-item__content{
                display: flex;
                justify-content: flex-start;
                align-items: flex-start;
                .select-el-wrap {
                    .el-select {
                        vertical-align: top;
                    }
                }
            }
        }
        .searchBtn {
            vertical-align: 2px;
        }
    }
</style>