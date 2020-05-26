<template>
    <div class="attendce back-white" v-loading="loading" element-loading-text="正在处理数据...">
        <div class="filter-condition">
            <el-form ref="form" :model="form" label-width="100px" labelPosition="left">
                <!--搜索区域-->
                <div class="search-zone">
                    <el-form-item class="formSearchMargin">
                        <el-input placeholder="根据下拉框选项输入关键字搜索" v-model="form.keyWord" size="mini"
                                  class="input-with-select select-input">
                            <el-select v-model="form.selectType" slot="append" placeholder="请选择">
                                <el-option label="班务名称" value="2"></el-option>
                                <el-option label="排班名称" value="1"></el-option>
                                <el-option label="零工姓名" value="3"></el-option>
                            </el-select>
                        </el-input>
                        <el-button type="primary" class="searchBtn out-search" @click="handleSearch">搜索</el-button>

                        <el-button class="comb-btn" style="position: relative;top:-3px"  size="mini" type="text" @click="handleCombShow">高级筛选<i
                                class="el-icon-right el-icon-d-arrow-right"
                                :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i>
                        </el-button>
                    </el-form-item>
                </div>

                <!--选择条件的单选按钮-->
                <div v-show="isShowComb" class="combine-zone">
                    <el-form-item label="班务经理：" class="formSearchMargin formSearchMarginTop pt10">
                        <el-radio-group class="radio-search" v-model="form.managerId">
                            <el-radio label="">不限</el-radio>
                            <div class="pt8">
                                <el-radio :label="item.id" class="elRadio mb5" v-for="item in customerManager" :key="item.id">
                                    {{item.nameAlias}}
                                </el-radio>
                            </div>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="结算方式：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="form.settlementType">
                            <el-radio label="">不限</el-radio>
                            <el-radio label="2">月结</el-radio>
                            <el-radio label="4">周结</el-radio>
                            <el-radio label="1">日结</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="日期范围：" class="formSearchMargin">
                        <el-radio-group class="radio-search" v-model="dateStatus">
                            <el-radio label="1">不限</el-radio>
                            <el-radio label="2">本月</el-radio>
                            <el-radio label="3">自定义</el-radio>
                        </el-radio-group>
                        <!-- :picker-options="pickerOptions2" -->
                        <div v-show="dateStatus == '3'">
                            <el-date-picker class="margin_left40" size="mini" v-model="startDate" type="date"
                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择开始时间">
                            </el-date-picker>
                            --
                            <el-date-picker class="margin_left10" size="mini" v-model="endDate" type="date"
                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择结束时间">
                            </el-date-picker>
                            <!-- :picker-options="pickerOptions2" -->
                            <el-button type="primary" class="datesearchBtn" @click="btn_get">确定</el-button>
                        </div>
                    </el-form-item>
                </div>
            </el-form>
        </div>

        <!-- <div class="back-white btn-div flexable" style="justify-content: space-between;">
          <el-button class="primary-btn" size="mini" style="width:135px;">导出考勤数据</el-button>
          <el-button class="primary-btn" size="mini" @click="handleSet">考勤设置</el-button>
        </div> -->

        <div class="divs" style="border:1px solid #E6E7EB;">
            <div style="padding: 15px 0 15px 24px;    border-bottom: 1px solid #E6E7EB;font-size:12px;color:#4D4D4D;">
                合计：&nbsp;&nbsp;&nbsp;{{totalData.totalWorkHours || 0}}小时 &nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;
                {{totalData.totalJian || 0}}件 &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{{totalData.totalDai || 0}}袋
                &nbsp;&nbsp;&nbsp;&nbsp;| &nbsp;&nbsp;&nbsp;{{totalData.totalChe || 0}}车&nbsp;&nbsp;&nbsp; &nbsp;|
                &nbsp;&nbsp;&nbsp;{{totalData.totalDun?totalData.totalDun.toFixed(2):0}}吨
            </div>
            <div class="back-white btn-div flexable" style="justify-content: space-between;">
                <el-button class="primary-btn" size="mini" style="width:135px;" @click="exportExcel"
                           :disabled="tableData.length == 0 ? true : false">导出考勤数据
                </el-button>
                <!-- <el-button class="primary-btn" size="mini" @click="handleSet">考勤设置</el-button> -->
            </div>
        </div>

        <div class="table-box back-white">
            <el-table :data="tableData" empty-text="暂无相关考勤信息,已经是最后一页了">
                <el-table-column label="姓名" prop="talentNameAlias" show-overflow-tooltip align="center"
                                 min-width="50"></el-table-column>
                <el-table-column label="工种" prop="industryName" align="center" min-width="50"></el-table-column>
                <el-table-column label="结算方式" prop="settlementTypeName" align="center" min-width="50"></el-table-column>
                <el-table-column label="班务" prop="taskName" align="center" min-width="50"></el-table-column>
                <el-table-column label="排班日期" prop="schedulingDate" align="center" min-width="50"></el-table-column>
                <el-table-column label="班务经理" prop="managerNameAlias" align="center" min-width="50"></el-table-column>
                <!-- <el-table-column label="考勤日期" prop="a" align="center" min-width="50"></el-table-column> -->
                <el-table-column label="上班时间" prop="workStartTime" :formatter="workStartFormatter" align="center"
                                 min-width="50"></el-table-column>
                <el-table-column label="下班时间" prop="workEndTime" :formatter="workEndFormatter" align="center"
                                 min-width="50"></el-table-column>
                <el-table-column label="工时" prop="workHours" :formatter="workHoursFormatter" align="center"
                                 min-width="50"></el-table-column>
                <el-table-column label="产量" prop="pieceSize" align="center" min-width="50" show-overflow-tooltip>
                    <template v-slot="scope">
                        <span>{{ scope.row.pieceSize | pieceSizeFormatter }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" prop="c" align="center" min-width="50">
                    <template v-slot="scope">
                        <el-button type="text" class="btn-icon btn-icon-edit" size="mini"
                                   @click="openAmendDialog(scope.row)">修改考勤
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="pagination-container">
                <el-button class="primary-btn" size="mini" :disabled="isFirstPage" @click="prePage()">上一页</el-button>
                <el-button class="primary-btn" size="mini" :disabled="isEndPage" @click="nextPage()">下一页</el-button>
                <!--<el-pagination class="pagebox" :total="total" layout="total , prev, pager, next, jumper"-->
                               <!--@current-change="handleCurrentChange" :page-count="pageCount" :current-page="currentPage"-->
                               <!--:page-size="pageSize">-->
                <!--</el-pagination>-->
            </div>
        </div>


        <el-dialog :visible.sync="amendVisible" v-if="amendVisible" width="739px" class="base-dialog" title="修改考勤">
            <div>
                <el-form :model="amendForm" label-position="right" label-width="200px">
                    <el-form-item label="零工姓名：">{{talentNameAlias}}</el-form-item>
                    <el-form-item label="所属排班：">{{taskName}}</el-form-item>
                    <el-form-item label="工种：">{{industryName}}</el-form-item>
                    <el-form-item label="上班时间：" required class="el_form_item">
                        <el-col :span="12">
                            <el-form-item prop="startTime">
                                <!-- @change="changestartTime0" -->
                                <el-date-picker v-model="amendForm.startTime" type="date" :clearable="false"
                                                class="radius-input dateInp" placeholder="选择日期"
                                                value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                                :picker-options="pickerOptions0">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="startTime1">
                                <el-time-select v-model="amendForm.startTime1" class="radius-input dateInp"
                                                placeholder="选择时间" value-format="HH:mm" format="HH:mm"
                                                :picker-options="{minTime: rangeStart,start: '00:00',step: '00:30',end: '23:30'}">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <el-form-item label="下班时间：" class="el_form_item">
                        <el-col :span="12">
                            <el-form-item prop="endTime">
                                <el-date-picker v-model="amendForm.endTime" type="date" :clearable="false"
                                                class="radius-input dateInp" placeholder="选择日期"
                                                value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                                :picker-options="pickerOptions1">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="endTime1">
                                <el-time-select v-model="amendForm.endTime1" class="radius-input dateInp"
                                                placeholder="选择时间" value-format="HH:mm:ss" format="HH:mm:ss"
                                                :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </el-form-item>
                    <!-- valuationType == 2 || valuationType == 3|| valuationType == 4|| valuationType == 5|| valuationType == 6|| valuationType == 7 -->
                    <!-- v-if="!(valuationType == 1 || valuationType == 8)" -->
                    <el-form-item label="产量：" v-if="!(valuationType == 1 || valuationType == 8)">
                        <el-input class="rant-input" v-model="pieceSize.jian"
                                  @keyup.native="chooseVal2(pieceSize.jian,'jian')"
                                  @blur="setBlurVal(pieceSize.jian,'jian')"></el-input> &nbsp;件
                        <el-input class="rant-input" v-model="pieceSize.dai"
                                  @keyup.native="chooseVal2(pieceSize.dai,'dai')"
                                  @blur="setBlurVal(pieceSize.dai,'dai')"></el-input> &nbsp;袋
                        <el-input class="rant-input" v-model="pieceSize.che"
                                  @keyup.native="chooseVal2(pieceSize.che,'che')"
                                  @blur="setBlurVal(pieceSize.che,'che')"></el-input> &nbsp;车
                        <el-input class="rant-input" v-model="pieceSize.dun"
                                  @keyup.native="chooseVal(pieceSize.dun,'dun')"
                                  @blur="setBlurVal(pieceSize.dun,'dun')"></el-input> &nbsp;吨
                    </el-form-item>
                    <el-form-item label="签名：" v-if="ifShowSign">
                        <!-- :style="{transform:'rotate('+ rotatedeg + 'deg)'}" -->
                        <div style="width:328px;height:144px;background:#F9F9F9;border:1px solid #DCDEE0;margin-top:10px;position: relative;">
                            <!-- style="position: absolute;top: 50%;left:50%;transform-origin: center center;transform: translate(-50%,-50%) rotate(-90deg);border:1px solid red;" -->
                            <canvas id="mycanvas"></canvas>
                        </div>
                        <el-button type="primary" size="mini" class="searchBtn clearBtn" @click="clearPad">清空
                        </el-button>
                    </el-form-item>
                </el-form>
            </div>
            <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="save">提 交</el-button>
            <el-button @click="amendVisible = false">取 消</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
    import Util from '../../../common/util'
    import Interval from '../../../common/interval'
    import SignaturePad from 'signature_pad'

    export default {
        name: 'AttendenceList',
        data() {
            let _this = this;
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        // return time.getTime() <= (Date.now() - 8.64e7)
                        return time.getTime() < (new Date(_this.schedulingDate).getTime() - 8.64e7) || (new Date(_this.schedulingDate).getTime() + 3600 * 1000 * 24) < time.getTime()
                    }
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() < (new Date(_this.schedulingDate).getTime() - 8.64e7) || (new Date(_this.schedulingDate).getTime() + 3600 * 1000 * 24) < time.getTime()
                    }
                },
                loading: false,
                isShowComb: false,
                amendVisible: false,
                startDate:`${this.Moment(Date.now()).format('YYYY-MM')}-01`,
                endDate: Interval.getDay(0),
                dateStatus: '2',
                customerList: [],
                form: {
                    settlementType: '',
                    keyWord: '',
                    date: '',
                    selectType: '2',
                    managerId: '',
                },
                amendForm: {
                    startTime: '',
                    startTime1: '',
                    endTime: '',
                    endTime1: '',
                },
                pieceSize: {
                    jian: '',
                    dai: '',
                    che: '',
                    dun: ''
                },
                range: '',
                rangeStart: '',
                endWorkType: 1,
                tableData: [],
                pageCount: 0,
                currentPage: 1,
                pageSize: 10,
                total: 0,
                customerManager: [],
                totalData: {},
                talentNameAlias: '',
                taskName: '',
                industryName: '',
                schedulingEmpId: '',
                schedulingId: '',
                punchId: '',
                imgval: '',
                schedulingDate: '',
                talentSalaryPlan: [],
                settlementType: '',
                valuationType: '',
                signUrl: '',
                ifShowSign: true,
                rotatedeg: 0,
                // isEndPage:false,
            }
        },
        computed:{
            isFirstPage() {
                if(this.currentPage == 1){
                    return true
                }else{
                    return false
                }
            },
            isEndPage(){
                if(this.tableData.length >= 10){
                    return false
                }else{
                    return true
                }
            },
        },
        mounted() {
            this.getCustomer()
            this.getList()
            this.getTotalData()
            this.getToken()
        },
        methods: {
            prePage(){
                if(this.request){return}
                this.request = true;
                this.currentPage --;
                this.getList()
            },
            nextPage(){
                if(this.request){return}
                this.request = true;
                this.currentPage ++;
                this.getList()
            },
            handleCombShow() {
                this.isShowComb = !this.isShowComb
            },
            btn_get() {
                this.currentPage = 1
                this.getList()
                this.getTotalData()
            },
            handleCurrentChange(val) {
                // console.log(val)
                this.currentPage = val
                this.getList()
                this.getTotalData()
            },
            initPad() {
                let canvas = document.getElementById('mycanvas')
                canvas.width = 328
                canvas.height = 144
                this.pad = new SignaturePad(canvas)
            },
            clearPad() {
                if (this.pad) {
                    this.pad.clear()
                }
            },
            openAmendDialog(row) {
                this.amendVisible = !this.amendVisible;
                console.log(row)
                this.talentNameAlias = row.talentNameAlias
                this.taskName = row.schedulingName
                this.industryName = row.industryName
                this.amendForm.startTime = row.workStartDate
                this.amendForm.endTime = row.workEndDate
                this.amendForm.startTime1 = row.workStartTime ? row.workStartTime.substr(0, 5) : ''
                this.amendForm.endTime1 = row.workEndTime ? row.workEndTime.substr(0, 5) : ''
                this.pieceSize = row.pieceSize ? JSON.parse(row.pieceSize) : {jian: '', dai: '', che: '', dun: ''}
                this.schedulingDate = row.schedulingDate
                // console.log(JSON.parse(row.talentSalaryPlan))
                this.settlementType = row.settlementType
                // console.log(row.settlementType)
                this.signUrl = row.signUrl
                if(this.signUrl!=''&&this.signUrl!=undefined){
                    this.ifShowSign=false
                }else{
                    this.ifShowSign=true
                }
                this.talentSalaryPlan = JSON.parse(row.talentSalaryPlan)
                this.valuationType = ''
                this.talentSalaryPlan.forEach(item => {
                    console.log(item)
                    console.log(row.settlementType)
                    if ((item.settlementType == row.settlementType) || (item.settlementType == '1' && row.settlementType == '4')) {
                        this.valuationType = item.valuationType
                    }
                });
                if (!this.signUrl) {
                    this.$nextTick(function () {
                        this.initPad()
                    })
                }
                // console.log(this.valuationType)
                // console.log(JSON.parse(row.pieceSize).jian)
                // 提交时的入参：
                this.schedulingEmpId = row.schedulingEmpId
                this.schedulingId = row.schedulingId
                this.punchId = row.punchId
            },
            save() {
                if (!this.amendForm.startTime || !this.amendForm.startTime1) {
                    return this.$message.error('上班时间不能为空！')
                }
                if ((this.amendForm.endTime && !this.amendForm.endTime1) || (!this.amendForm.endTime && this.amendForm.endTime1)) {
                    return this.$message.error('下班时间需填写完整！')
                }
                if (!(this.valuationType == 1 || this.valuationType == 8)) {
                    if (!this.pieceSize.jian || !this.pieceSize.dai || !this.pieceSize.che || !this.pieceSize.dun) {
                        return this.$message.error('件袋车吨均不能为空！')
                    }
                }
                if (!this.signUrl) {
                    if (this.pad.isEmpty()) {
                        return this.$message.error('请签字后再保存！')
                    }
                }
                if (this.amendForm.startTime > this.amendForm.endTime) {
                    return this.$message.error('下班时间不能早于上班时间！')
                }
                if (this.amendForm.startTime == this.amendForm.endTime) {
                    if (this.amendForm.startTime1 > this.amendForm.endTime1) {
                        return this.$message.error('下班时间不能早于上班时间！')
                    }
                }
                if (!this.signUrl) {
                    /*this.uploadQiniuyun()*/
                    this.rotateBase64Img(this.pad.toDataURL(),90,this.uploadQiniuyun)
                }else{
                    this.updateScheduing()
                }
                /*未考虑异步情况  数据错误bug*/
                /*if(this.requestSave){return}
                this.requestSave = true;
                const params = {
                    schedulingEmpId: this.schedulingEmpId,
                    schedulingId: this.schedulingId,
                    punchId: this.punchId,
                    startTime: `${this.amendForm.startTime1}:00`,
                    startDate: this.amendForm.startTime,
                    endTime: `${this.amendForm.endTime1 ? this.amendForm.endTime1 + ':00' : ''}`,
                    endDate: this.amendForm.endTime ? this.amendForm.endTime : '',
                    pieceSize: (this.valuationType == 1 || this.valuationType == 8) ? '{"jian":"","dai":"","che":"","dun":""}' : JSON.stringify(this.pieceSize),
                    signUrl: this.signUrl ? `http://${this.signUrl}` : ''
                }
                this.$api.updateForC(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        this.amendVisible = false
                        this.$message.success('保存成功')
                        this.getList()
                    } else if (res.data.respCode == -1) {
                        if (res.data.errorCode == 90055) {
                            this.$message.error(`本次考勤与${JSON.parse(res.data.errorMsg).schedulingName}排班的${JSON.parse(res.data.errorMsg).industryName}岗位考勤冲突`)
                        }
                    }
                }).catch(err => {
                    this.$message.error(err)
                }).finally(()=>{
                    this.requestSave = false;
                })*/
            },
            updateScheduing(){
                let _this = this;
                if(_this.requestSave){return}
                _this.requestSave = true;
                const params = {
                    schedulingEmpId: _this.schedulingEmpId,
                    schedulingId: _this.schedulingId,
                    punchId: _this.punchId,
                    startTime: `${_this.amendForm.startTime1}:00`,
                    startDate: _this.amendForm.startTime,
                    endTime: `${_this.amendForm.endTime1 ? this.amendForm.endTime1 + ':00' : ''}`,
                    endDate: _this.amendForm.endTime ? this.amendForm.endTime : '',
                    pieceSize: (_this.valuationType == 1 || _this.valuationType == 8) ? '{"jian":"","dai":"","che":"","dun":""}' : JSON.stringify(_this.pieceSize),
                    signUrl: _this.signUrl ? `http://${_this.signUrl}` : ''
                }
                this.$api.updateForC(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        _this.amendVisible = false
                        _this.$message.success('保存成功')
                        _this.getList()
                    } else if (res.data.respCode == -1) {
                        // _this.signUrl=''
                        if (res.data.errorCode == 90055) {
                            _this.$message.error(`本次考勤与${JSON.parse(res.data.errorMsg).schedulingName}排班的${JSON.parse(res.data.errorMsg).industryName}岗位考勤冲突`)
                        }
                    }
                }).catch(err => {
                    console.log(err)
                }).finally(()=>{
                    _this.requestSave = false;
                })
            },
            chooseVal(value, name) {
                let val = value;
                let reg = /^-?\d*\.?\d*$/
                // let reg = /^[0-9]*$/
                if (reg.test(value)) {
                    if (Number(val) >= 0) {
                        let falseNum = value.substr(0, 1);
                        let numLength = value.indexOf('.');
                        if (val.indexOf('.') != -1) {
                            this.pieceSize[name] = val.substr(0, val.indexOf(".") + 5);
                            if (Number(falseNum) == 0 && numLength >= 2) {
                                this.pieceSize[name] = null;
                            }
                        } else {
                            this.pieceSize[name] = name == 'dun' ? val.substr(0, 2) : '0'
                        }
                    } else {
                        this.pieceSize[name] = null;
                    }
                } else {
                    this.pieceSize[name] = null;
                }
                ;
            },
            chooseVal2(value, name) {
                let val = value;
                // let reg = /^-?\d*\.?\d*$/
                let reg = /^[0-9]*$/
                if (reg.test(value)) {
                    if (Number(val) >= 0) {
                        let falseNum = value.substr(0, 1);
                        let numLength = value.indexOf('.');
                        if (val.indexOf('.') != -1) {
                            this.pieceSize[name] = val.substr(0, val.indexOf(".") + 5);
                            if (Number(falseNum) == 0 && numLength >= 2) {
                                this.pieceSize[name] = null;
                            }
                        } else {
                            this.pieceSize[name] = name == 'jian' ? val.substr(0, 5) : (name == 'dai' ? val.substr(0, 4) : (name == 'che' ? val.substr(0, 3) : '0'))
                        }
                    } else {
                        this.pieceSize[name] = null;
                    }
                } else {
                    this.pieceSize[name] = null;
                }
                ;
            },
            setBlurVal(value, name) {
                // Number(value == 0) ||
                if (Number(value == '')) {
                    // this.pieceSize[name] = null;
                    this.$message.error('件袋车吨均不能为空！')
                }
            },rotateBase64Img(src, edg=270, callback) {
                var canvas = document.createElement("canvas");
                var ctx = canvas.getContext("2d");
                var imgW;//图片宽度
                var imgH;//图片高度
                var size;//canvas初始大小
                edg
                if (edg % 90 != 0) {
                    console.error("旋转角度必须是90的倍数!");
                    throw '旋转角度必须是90的倍数!';
                }
                (edg < 0) && (edg = (edg % 360) + 360)
                const quadrant = (edg / 90) % 4; //旋转象限
                const cutCoor = {sx: 0, sy: 0, ex: 0, ey: 0}; //裁剪坐标
                var image = new Image();
                image.crossOrigin = "anonymous"
                image.src = src;
                image.onload = function () {
                    imgW = image.width;
                    imgH = image.height;
                    size = imgW > imgH ? imgW : imgH;
                    canvas.width = size * 2;
                    canvas.height = size * 2;
                    switch (quadrant) {
                        case 0:
                            cutCoor.sx = size;
                            cutCoor.sy = size;
                            cutCoor.ex = size + imgW;
                            cutCoor.ey = size + imgH;
                            break;
                        case 1:
                            cutCoor.sx = size - imgH;
                            cutCoor.sy = size;
                            cutCoor.ex = size;
                            cutCoor.ey = size + imgW;
                            break;
                        case 2:
                            cutCoor.sx = size - imgW;
                            cutCoor.sy = size - imgH;
                            cutCoor.ex = size;
                            cutCoor.ey = size;
                            break;
                        case 3:
                            cutCoor.sx = size;
                            cutCoor.sy = size - imgW;
                            cutCoor.ex = size + imgH;
                            cutCoor.ey = size + imgW;
                            break;
                    }
                    ctx.translate(size, size);
                    ctx.rotate(edg * Math.PI / 180);
                    ctx.drawImage(image, 0, 0);
                    var imgData = ctx.getImageData(cutCoor.sx, cutCoor.sy, cutCoor.ex, cutCoor.ey);
                    if (quadrant % 2 == 0) {
                        canvas.width = imgW;
                        canvas.height = imgH;
                    } else {
                        canvas.width = imgH;
                        canvas.height = imgW;
                    }
                    ctx.putImageData(imgData, 0, 0);
                    callback(canvas.toDataURL())
                };
            },
            uploadQiniuyun(base64data) {
                this.imgval = base64data.substring(22)
                // console.log(this.imgval)
                this.$api
                    .postImg(
                        this.imgval,
                        this.upload_form.token
                    )
                    .then(response => {
                        // console.log(response)
                        if (response.data.key) {
                            // this.$message.success('签字成功！')
                            let key = response.data.key;
                            this.signUrl = `${this.bucketHost}/${key}`
                            console.log(this.signUrl)
                            this.updateScheduing()
                        }
                        this.getToken()
                    })
                    .catch(error => {
                        console.log(error);
                    })
                    .finally(() => {
                        // this.$indicator.close()
                    })
            },
            getToken() {
                this.$api.getToken().then((response) => {
                    const {
                        data: {
                            fileName, upToken,
                        },
                    } = response.data;
                    if (response.data.respCode == 0) {
                        this.upload_form = {
                            key: fileName,
                            token: upToken,
                        }
                        // console.log(this.upload_form.token)
                    }
                })
                    .catch(err => {
                    })
            },
            handleSearch() {
                this.currentPage = 1
                this.getList()
                this.getTotalData()
            },
            getList() {
                let _this = this;
                this.loading = true
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    managerId: this.form.managerId,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    settlementType: this.form.settlementType,
                    showOutsourcing:true
                }
                this.$api.innerList(params).then(res => {
                    console.log(res)
                    if (res.data.respCode == 0) {
                        if (res.data.data) {
                            const {
                                data: {
                                    list,
                                    pageNum,
                                    pages,
                                    total,
                                    isLastPage
                                }
                            } = res.data
                            this.tableData = list || []
                            this.pageCount = pages
                            // this.isEndPage = isLastPage;
                            this.total = total
                        }
                    }
                }).catch().finally(()=>{
                    setTimeout(()=>{
                        _this.request = false
                        _this.loading = false
                    },500)
                });
            },
            getCustomer() {
                let ID = JSON.parse(localStorage.userInfo).customerId || '';
                let params = {
                    customerId:ID
                }   
                this.$api.classManagerList(params).then(res => {
                    let { respCode,data } = res;
                    if(  respCode === 0  ){
                        this.customerManager = data;
                    }
                })
                .catch(error => {
                    console.log(error);
                });  
            },
            getTotalData() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    managerId: this.form.managerId,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    settlementType: this.form.settlementType,
                    showOutsourcing:true
                }
                this.$api.innerListSummary(params).then(res => {
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
            exportExcel() {
                let params = {
                    pageNum: this.currentPage,
                    pageSize: this.pageSize,
                    managerId: this.form.managerId,
                    selectType: this.form.selectType,
                    keyWords: this.form.keyWord,
                    startDate: this.startDate,
                    endDate: this.endDate,
                    settlementType: this.form.settlementType,
                    showOutsourcing:true
                }
                this.loading = true
                this.$api.innerListExport(params).then(res => {
                    // console.log(res)
                    setTimeout(() => {
                        this.loading = false
                    }, 2000)
                    if (res.data.respCode == 0) {
                        window.open(res.data.data)
                    }
                }).catch()
            },
            workHoursFormatter(row, column, cellValue) {
                if (cellValue) {
                    return cellValue
                } else if (cellValue == 0 || cellValue == 0.0) {
                    return '0'
                } else {
                    return '无'
                }
            },
            workStartFormatter(row, column, cellValue) {
                return row.workStartDate == row.schedulingDate ? `${cellValue ? '当日' + cellValue.substr(0, 5) : '无'}` : `${cellValue ? '次日' + cellValue.substr(0, 5) : '无'}`
            },
            workEndFormatter(row, column, cellValue) {
                return row.workEndDate == row.schedulingDate ? `${cellValue ? '当日' + cellValue.substr(0, 5) : '无'}` : `${cellValue ? '次日' + cellValue.substr(0, 5) : '无'}`
            },
        },
        watch: {
            dateStatus: function (val, oldval) {
                if (val == '1') {
                    this.startDate = ''
                    this.endDate = ''
                    this.getList()
                    this.getTotalData()
                }else if (val == '2') {
                    debugger;
                    this.endDate = Interval.getDay(0)
                    this.startDate = `${this.Moment(Date.now()).format('YYYY-MM')}-01`;
                    this.getList()
                    this.getTotalData()
                }else{
                    this.startDate = ''
                    this.endDate = ''
                }
            },
            // startDate: function (val, oldval) {
            //     if (val) {
            //         this.dateStatus = ''
            //     }
            // },
            // endDate: function (val, oldval) {
            //     if (val) {
            //         this.dateStatus = ''
            //     }
            // },
            'form.managerId': function (val, old) {
                this.currentPage = 1
                this.getList()
                this.getTotalData()
            },
            'form.settlementType': function (val, old) {
                this.currentPage = 1
                this.getList()
                this.getTotalData()
            }
        },
        filters: {
            pieceSizeFormatter(val) {
                if (val) {
                    return Util.formatPieceSize(val)
                } else {
                    return '无'
                }
            }
        }
    }
</script>
<style lang="scss">
    .attendce {
        .el-dialog__header {
            text-align: left;
        }
        .out-search{
            position: relative;
            top:-6px;
        }
        .base-dialog .el-dialog__footer {
            text-align: right;
        }
        .el-dialog__footer {
            padding-bottom: 10px !important;
            border-top: 1px solid #EDEEF0 !important;
        }
        .el-input--prefix .el-input__inner {
            width: 160px !important;
            height: 30px !important;
        }
        .el-input__icon {
            line-height: 34px !important;
        }
        .el-col-12 {
            width: 33%;
        }
        .el-date-editor.el-input {
            width: 160px;
        }
        .el-form-item__content {
            line-height: 40px;
        }
        .el-form-item__content {
            text-align: left;
        }
        .rant-input.el-input {
            width: 292px !important;
            height: 30px !important;
        }
        .rant-input .el-input__inner {
            width: 292px !important;
            height: 30px !important;
        }
        .clearBtn.el-button--primary {
            width: 85px !important;
            height: 30px !important;
        }
        .canvasStyle {
            transform: rotate(-90deg);
        }
    }
</style>