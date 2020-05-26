<template>
    <div class="add-class-form ">
        <el-dialog :title="'发布班务至班务市场'" width="800px" :visible.sync="showAddClassForm" center
                   :before-close="handleCancelAddClassForm">
            <el-form ref="form" :model="form" label-width="140px" :rules="formRules">
                <el-form-item label="任务名称：" class="belongToItem" prop="taskId" required>
                    <el-select v-model="form.taskId" @change="taskChange" filterable placeholder="请选择任务">
                        <el-option v-for="(item,index) in taskList" :key="index"
                                   :label="`${item.taskName}(${item.taskType == 4 ? '外包任务': (item.taskType == '' ? '' : '代发任务')})`"
                                   :value="`${item.assignmentInfoId}`"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="班务名称:" prop="classifyName">
                    <el-col :span="22">
                        <el-input v-model="form.classifyName"></el-input>
                        <!--<div v-if="edit">{{form.classifyName}}</div>-->
                        <!--<div>填写建议：客户简称+需要处理的任务+白晚班示例：中心局内部处理白班</div>-->
                    </el-col>
                </el-form-item>
                <el-form-item label="开始时间：">
                    <div v-if="!edit">
                        <el-col :span="12">
                            <el-form-item prop="startDateTime">
                                <el-date-picker v-model="form.startDateTime" type="date" @change="handleTest"
                                                placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                                :picker-options="pickerOptions0">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item prop="startDateTime1">
                                <el-time-select v-model="form.startDateTime1" placeholder="选择时间" value-format="HH:mm"
                                                format="HH:mm" @change="handleTest"
                                                :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
                                </el-time-select>
                            </el-form-item>
                        </el-col>
                    </div>
                    <div v-if="edit">{{form.startDateTime+' '+form.startDateTime1}}</div>
                </el-form-item>


                <el-form-item label="结束时间：">
                    <el-col :span="12">
                        <el-form-item prop="endDateTime">
                            <el-date-picker v-model="form.endDateTime" type="date" placeholder="选择日期"
                                            value-format="yyyy-MM-dd" format="yyyy-MM-dd"
                                            :picker-options="pickerOptions1">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop="endDateTime1">
                            <el-time-select v-model="form.endDateTime1" placeholder="选择时间" value-format="HH:mm"
                                            format="HH:mm"
                                            :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="结算方式:" required>
                    <el-radio-group v-model="form.settlementType" :disabled="edit"
                                    @change="settlementChange(form.settlementType)">
                        <el-radio label="1">日结</el-radio>
                        <el-radio label="2">月结</el-radio>
                        <el-radio label="4">周结</el-radio>
                    </el-radio-group>
                </el-form-item>


                <el-form-item label="客户核定人数:" prop="customerNum">
                    <el-col :span="22">
                        <el-input v-model="form.customerNum" type="number"></el-input>
                        <!--<div>用于统计生产分析报表 任务客户核定人数{{params.cusAuthorizedNumber}}人，最高可填写{{params.cusAuthorizedNumber}}人</div>-->
                        <div>用于统计生产分析报表</div>
                    </el-col>

                </el-form-item>
                <el-form-item label="生产核定人数:" prop="productionNum">
                    <el-col :span="22">
                        <el-input v-model="form.productionNum" type="number"></el-input>
                        <div>建议核定人数在实际需要人数基础上增加10%</div>
                        <!--<div>任务生产核定人数{{params.authorizedNumber}}人，最高可填写{{params.authorizedNumber}}人</div>-->
                    </el-col>
                </el-form-item>

                <el-form-item label="核算单价:" prop="unitPrice">
                    <div style="display:flex;width:560px;background-color:#F5F6F7">
                        <div class="priceTextLimit">
                            <div v-if="form.unitPrice.valuationType===1">
                                {{form.unitPrice.valuationPrice?`${form.unitPrice.valuationPrice}元/小时`:null}}
                            </div>
                            <div v-if="form.unitPrice.valuationType===2&&form.unitPrice.calculateType===2">
                                {{form.unitPrice.calculatePricePiece}}元/件,<br/>
                                {{form.unitPrice.calculatePriceBag}}元/袋,<br/>
                                {{form.unitPrice.calculatePriceCar}}元/车,<br/>
                                {{form.unitPrice.calculatePriceTon}}元/吨
                            </div>
                            <div v-if="form.unitPrice.valuationType===2&&form.unitPrice.calculateType===1&&form.unitPrice.calculatePrice===1">
                                {{form.unitPrice.calculatePriceReal}}元/{{unitMap[form.unitPrice.unit]}}
                            </div>
                            <div v-if="form.unitPrice.valuationType===2&&form.unitPrice.calculateType===1&&form.unitPrice.calculatePrice===2">
                                <div v-if="form.unitPrice.priceList.length>0">
                                    <div v-for="(it,i) in form.unitPrice.priceList" :key="i">
                                        <div v-if="i===0">
                                            {{it.num}}{{unitMap[form.unitPrice.unit]}}以下（含）,{{it.price}}元/{{unitMap[form.unitPrice.unit]}}
                                        </div>
                                        <div v-else>
                                            {{Number(form.unitPrice.priceList[i-1].num)+1}}至{{it.num}}{{unitMap[form.unitPrice.unit]}}（含）,{{it.price}}元/{{unitMap[form.unitPrice.unit]}}
                                        </div>
                                    </div>
                                    <div>
                                        {{Number(form.unitPrice.exceedPrice.num)+1}}{{unitMap[form.unitPrice.unit]}}以上，{{form.unitPrice.exceedPrice.price}}元/{{unitMap[form.unitPrice.unit]}}
                                    </div>
                                </div>
                            </div>
                            <div v-if="form.unitPrice.valuationType===3&&form.unitPrice.calculateType===1&&form.unitPrice.calculatePrice===1">
                                {{form.unitPrice.valuationPrice}}元/小时,<br/>
                                {{form.unitPrice.calculatePriceReal}}元/{{unitMap[form.unitPrice.unit]}}
                            </div>
                            <div v-if="form.unitPrice.valuationType===3&&form.unitPrice.calculateType===2">
                                {{form.unitPrice.valuationPrice}}元/小时,<br/>
                                {{form.unitPrice.calculatePricePiece}}元/件,<br/>
                                {{form.unitPrice.calculatePriceBag}}元/袋,<br/>
                                {{form.unitPrice.calculatePriceCar}}元/车,<br/>
                                {{form.unitPrice.calculatePriceTon}}元/吨
                            </div>
                            <div v-if="form.unitPrice.valuationType===3&&form.unitPrice.calculateType===1&&form.unitPrice.calculatePrice===2">
                                {{form.unitPrice.valuationPrice}}元/小时,<br/>
                                <div v-if="form.unitPrice.priceList.length>0">
                                    <div v-for="(it,i) in form.unitPrice.priceList" :key="i">
                                        <div v-if="i===0">
                                            {{it.num}}{{unitMap[form.unitPrice.unit]}}以下（含）,{{it.price}}元/{{unitMap[form.unitPrice.unit]}}
                                        </div>
                                        <div v-else>
                                            {{Number(form.unitPrice.priceList[i-1].num)+1}}至{{it.num}}{{unitMap[form.unitPrice.unit]}}（含）,{{it.price}}元/{{unitMap[form.unitPrice.unit]}}
                                        </div>
                                    </div>
                                    <div>
                                        {{Number(form.unitPrice.exceedPrice.num)+1}}{{unitMap[form.unitPrice.unit]}}以上，{{form.unitPrice.exceedPrice.price}}元/{{unitMap[form.unitPrice.unit]}}
                                    </div>
                                </div>
                            </div>
                            <div v-if="form.unitPrice.valuationType===4">
                                {{form.unitPrice.dayPrice?`${form.unitPrice.dayPrice}元/天`:null}}
                            </div>
                        </div>
                        <div v-if="!edit">
                            <div class="editBtn" v-if="!edit&&!isSaved" @click="handleEditUnitPrice">修改</div>
                            <div class="editBtn" v-else @click="handleEditUnitPrice">修改</div>
                        </div>
                    </div>
                    <div>核算班务经理利润用</div>
                </el-form-item>


                <el-form-item label="上班时间:" prop="officeHours" v-if="!edit">
                    <el-time-select
                            v-model="form.officeHours"
                            :picker-options="{
                                start: '00:00',
                                step: '00:30',
                                end: '23:30'
                              }"
                            placeholder="选择时间">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="下班时间:" v-if="!edit">
                    <el-col :span="11">
                        <el-form-item prop="timeOutDate">
                            <el-select v-model="form.timeOutDate" placeholder="请选择" @change="handleChangeTimeOutDate">
                                <el-option label="当日" :value="1"></el-option>
                                <el-option label="次日" :value="2"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item prop="timeOut">
                            <el-time-select
                                    v-model="form.timeOut"
                                    :picker-options="{
                                      start: '00:00',
                                      step: '00:30',
                                      end: '23:30'
                                    }"
                                    placeholder="选择时间">
                            </el-time-select>
                        </el-form-item>
                    </el-col>
                </el-form-item>
                <el-form-item label="打卡地点" style="position:relative" prop="address" class="el_form_item">

                    <el-tooltip class="item" effect="dark" :content="form.address" placement="top-start">
                        <el-input class="radius-input workerInp" placeholder="搜索地点，并进行选择" size="medium"
                                  v-model="form.address" @focus="viewMap" v-if="!mapDia">
                        </el-input>
                        <el-input class="radius-input workerInp" placeholder="" size="medium"
                                  v-model="mapConfig.keyword" v-if="mapDia" @focus="viewMap">
                        </el-input>
                    </el-tooltip>
                    <div class="text0">上下班打卡所在地</div>
                    <!-- </el-form-item> -->

                    <div v-if="mapDia" class="mapContain">
                        <baidu-map class="map-container" :scroll-wheel-zoom="true" :center="mapConfig.center"
                                   :zoom="mapConfig.zoom">
                            <bm-local-search :keyword="mapConfig.keyword" :auto-viewport="true"
                                             :location="mapConfig.location" @infohtmlset="infohtmlset">
                            </bm-local-search>
                        </baidu-map>
                    </div>
                </el-form-item>
                <el-form-item label="打卡方式" prop="cardType">
                    <el-radio-group v-model="form.cardType">
                        <el-radio :label="1">扫码打卡</el-radio>
                        <el-radio :label="2">自主打卡</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="是否人脸打卡:" prop="isFaceCard">
                    <el-radio-group v-model="form.isFaceCard">
                        <el-radio :label="0">是</el-radio>
                        <el-radio :label="1">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="打卡范围:" prop="cardLimit">
                    <el-col :span="22">
                        <el-input v-model="form.cardLimit" type="number"></el-input>
                    </el-col>
                    <el-col :span="2">
                        米
                    </el-col>
                </el-form-item>
                <el-form-item label="工种要求:" prop="professionDemand">
                    <div style="background-color:#F5F6F7;display:flex;width:560px">
                        <div style="width:480px">
                            <div class="u-profession-demand" style="width:100%" v-if="form.professionDemand.length>0">
                                <div class="u-profession-demand-item" v-for="(it,i) in form.professionDemand" :key="i">
                                    {{typeWorkMap[it]}}
                                </div>
                            </div>
                        </div>
                        <div>
                            <div style="cursor:pointer;color:#E94A1E" @click="handleEditProfessionDemand"
                                 v-if="form.professionDemand.length>0">修改
                            </div>
                            <div style="cursor:pointer;color:#E94A1E" @click="handleEditProfessionDemand" v-else>添加
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="零工单价审核" prop="needPriceCheck">
                    <el-radio-group v-model="form.needPriceCheck">
                        <el-radio :label="1">需要审核</el-radio>
                        <el-radio :label="2">不需要审核</el-radio>
                    </el-radio-group>
                    <span class="highlightText">设为需审核后，该班务下的排班都需审核通过后才能进行零工结算确认</span>
                </el-form-item>
                <el-form-item label="零工单价上限" prop="priceLimit">
                    <el-radio-group v-model="form.priceLimit">
                        <el-radio :label="1">启用</el-radio>
                        <el-radio :label="2">不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div>
                    <el-form-item label="已选中的工种:"  v-if="form.priceLimit===1" prop="alreadySelectWork">
                        <el-table
                                :data="form.workList"
                                border
                                style="width: 100%">
                            <el-table-column
                                    fixed
                                    prop="type"
                                    label="工种"
                            >
                                <template v-slot="scope">
                                    {{typeWorkMap[scope.row.type]}}
                                </template>
                            </el-table-column>
                            <el-table-column
                                    fixed
                                    prop="1"
                                    label="计时(元)"
                            >
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.hour"
                                              @change="(val)=>{handleDealListPrice(scope.row,scope.$index,'hour',val)}"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="2"
                                    label="计件(元)"
                            >
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.piece"
                                              @change="(val)=>{handleDealListPrice(scope.row,scope.$index,'piece',val)}"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="3"
                                    label="计袋(元)"
                            >
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.bag"
                                              @change="(val)=>{handleDealListPrice(scope.row,scope.$index,'bag',val)}"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="4"
                                    label="计车(元)"
                            >
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.car"
                                              @change="(val)=>{handleDealListPrice(scope.row,scope.$index,'car',val)}"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="5"
                                    label="计吨(元)"
                            >
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.ton"
                                              @change="(val)=>{handleDealListPrice(scope.row,scope.$index,'ton',val)}"></el-input>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="6"
                                    label="日固定(元)"
                            >
                                <template v-slot="scope">
                                    <el-input v-model="scope.row.dayFixed"
                                              @change="(val)=>{handleDealListPrice(scope.row,scope.$index,'dayFixed',val)}"></el-input>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-form-item>
                </div>
                <el-form-item label="我方签署客户全称:" prop="fullName">
                    <el-col :span="22">
                        <el-input v-model="form.fullName"></el-input>
                        <div>用于生成客户确认表的表头</div>
                    </el-col>
                </el-form-item>
                <el-form-item label="日常产量确认人:" prop="confirm">
                    <el-checkbox-group v-model="form.confirm" @change="handleChangeConfirm">
                        <el-checkbox v-for="(it,i) in allConfirmList" :key="i" :label="it.id" name="type">
                            {{it.nameAlias}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="保证金:" class="addRequireFixBug" prop="depositProp">
                    <el-col :span="10">
                        <el-input v-model="form.deposit" :disabled="edit" @input="updateForBug"></el-input>
                    </el-col>
                    <el-col :span="2">
                        元
                    </el-col>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="onSubmit" :loading="saveLoading">确 认</el-button>
                    <el-button @click="handleCancelAddClassForm">取 消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>


        <el-dialog title="修改班务核算单价" :visible.sync="showEditUnitPrice" width="600px" center
                   :modal-append-to-body="false">
            <el-form ref="priceForm" :model="priceForm" label-width="100px" label-position="left"
                     :rules="priceFormRules">
                <el-form-item label="计价方式:" prop="valuationType">
                    <el-select v-model="priceForm.valuationType" placeholder="请选择">
                        <el-option label="计时" :value="1"></el-option>
                        <el-option label="计量" :value="2"></el-option>
                        <el-option label="计时+计量" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <!--
                         <el-form-item label="日固定:" prop="dayPrice" v-if="priceForm.valuationType===4">
                          <el-col :span="20">
                              <el-input v-model="priceForm.dayPrice" ></el-input>
                          </el-col>
                          <el-col :span="4">
                          元/天
                          </el-col>
                        </el-form-item>
                -->
                <div v-if="priceForm.valuationType!==4">
                    <el-form-item label="计时单价:" prop="valuationPrice" v-if="priceForm.valuationType!==2">
                        <el-col :span="20">
                            <el-input v-model="priceForm.valuationPrice"
                                      @change="(val)=>{handleNumber(val,'valuationPrice','priceForm')}"></el-input>
                        </el-col>
                        <el-col :span="4">
                            元/小时
                        </el-col>
                    </el-form-item>

                    <div v-if="priceForm.valuationType!==1">
                        <el-form-item label="计量方式" prop="calculateType">
                            <el-radio-group v-model="priceForm.calculateType">
                                <el-radio :label="1">单一计量</el-radio>
                                <el-radio :label="2">组合计量</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="计量单位:" prop="calculateUnit" v-if="priceForm.calculateType===1">
                            <el-select v-model="priceForm.calculateUnit" placeholder="请选择">
                                <el-option label="件" :value="1"></el-option>
                                <el-option label="袋" :value="2"></el-option>
                                <el-option label="车" :value="3"></el-option>
                                <el-option label="吨" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="计量单价:" prop="calculatePrice" v-if="priceForm.calculateType===1">
                            <el-radio-group v-model="priceForm.calculatePrice">
                                <el-radio :label="1">固定计价</el-radio>
                                <el-radio :label="2">阶梯计价</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="计量单价:" v-if="priceForm.calculateType===2">
                            <el-form-item prop="calculatePricePiece" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePricePiece"
                                              @change="(val)=>{handleNumber(val,'calculatePricePiece','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/件
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="calculatePriceBag" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceBag"
                                              @change="(val)=>{handleNumber(val,'calculatePriceBag','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/袋
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="calculatePriceCar" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceCar"
                                              @change="(val)=>{handleNumber(val,'calculatePriceCar','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/车
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="calculatePriceTon" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceTon"
                                              @change="(val)=>{handleNumber(val,'calculatePriceTon','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/吨
                                </el-col>
                            </el-form-item>
                        </el-form-item>
                        <div v-if="priceForm.calculatePrice===1">
                            <el-form-item prop="calculatePriceReal"
                                          v-if="priceForm.calculatePrice===1&&priceForm.calculateType===1">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceReal"
                                              @change="(val)=>{handleNumber(val,'calculatePriceReal','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/{{unitMap[priceForm.calculateUnit]}}
                                </el-col>
                            </el-form-item>
                        </div>


                        <div v-if="priceForm.calculatePrice===2&&priceForm.calculateType===1">
                            <el-form-item v-for="(item,index) in ladderList" :key="index">
                                <div>
                                    <i class="el-icon-delete" style="cursor:pointer"
                                       v-if="index == ladderList.length - 1" @click="handleDeleteLadder(index)"></i>
                                    第{{index+1}}档:
                                </div>

                                <el-col :span="8">
                                    <el-form-item :prop="`ladder${index+1}num`">
                                        <el-input v-model="priceForm[`ladder${index+1}num`]"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="2">
                                    {{unitMap[priceForm.calculateUnit]}},
                                </el-col>

                                <el-col :span="8">
                                    <el-form-item :prop="`ladder${index+1}price`">
                                        <el-input v-model="priceForm[`ladder${index+1}price`]"
                                                  @change="(val)=>{handleNumber(val,`ladder${index+1}price`,'priceForm')}"></el-input>
                                    </el-form-item>
                                </el-col>

                                <el-col :span="4">
                                    元/{{unitMap[priceForm.calculateUnit]}}
                                </el-col>
                            </el-form-item>

                            <el-form-item>
                                <el-button @click="handleAddLadder">添加阶梯</el-button>
                            </el-form-item>

                            <el-form-item prop="exceedLadder">
                                超过第{{ladderList.length}}档时,<br/>
                                <el-col :span="20">
                                    <el-input v-model="priceForm.exceedLadder"
                                              @change="(val)=>{handleNumber(val,'exceedLadder','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/{{unitMap[priceForm.calculateUnit]}}
                                </el-col>
                            </el-form-item>

                            <el-form-item>
                                <div v-for="(item,index) in ladderList" :key="index">
                                    <div v-if="index == 0">
                                        {{priceForm[`ladder${index+1}num`]?priceForm[`ladder${index+1}num`]:'X'}}{{unitMap[priceForm.calculateUnit]}}以下（含）,{{priceForm[`ladder${index+1}price`]||'Y'}}元/{{unitMap[priceForm.calculateUnit]}}
                                    </div>
                                    <div v-else>
                                        {{priceForm[`ladder${index}num`]?Number(priceForm[`ladder${index}num`])+1:'X'}}至{{priceForm[`ladder${index+1}num`]?Number(priceForm[`ladder${index+1}num`]):'X'}}{{unitMap[priceForm.calculateUnit]}}(含）,{{priceForm[`ladder${index+1}price`]||'Y'}}元/{{unitMap[priceForm.calculateUnit]}}
                                    </div>
                                    <div v-if="index == ladderList.length - 1">
                                        {{priceForm[`ladder${index+1}num`]?Number( priceForm[`ladder${index+1}num`]
                                        )+1:'X'}}
                                        {{unitMap[priceForm.calculateUnit]}}以上，{{priceForm.exceedLadder||'Y'}}元/{{unitMap[priceForm.calculateUnit]}}
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <el-form-item>
                    <div>我跟班务经理结算时的单价</div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="showEditUnitPrice = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="savePriceForm">确 认</el-button>
      </span>
        </el-dialog>


        <el-dialog title="修改班务工种要求" :visible.sync="showEditProfessionDemand" width="600px" center
                   :modal-append-to-body="false">
            <el-form ref="professionDemandForm" :model="professionDemandForm" label-width="100px" label-position="left"
                     :rules="professionDemandFormRules">
                <el-form-item prop="professionDemand" label="工种要求:">
                    <el-checkbox-group v-model="professionDemandForm.professionDemand" @change="handleTest">
                        <el-checkbox :disabled="edit&&thusWorkList.some(z=>z.type===it.dicVal)"
                                     v-for="(it,i) in typeWorkList" :key="i" :label="it.dicVal">{{it.dicName}}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="showEditProfessionDemand = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="saveProfessionDemandForm">确 认</el-button>
        </span>
        </el-dialog>
    </div>
</template>

<script>
    import moment from 'moment';
    import rules from './validRules'

    export default {
        name: 'addClassForm',
        mixins: [rules],
        props: {
            save: [Function],
            showAddClassForm: [Boolean],
            cancelAddClassForm: [Function],
            saveLoading: [Boolean],
            editData: [Object],
            edit: [Boolean],
            handleEdit: [Function]
        },

        data() {
            return {
                changeLadderStatus: false,
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() <= (Date.now() - 8.64e7)
                    }
                },
                pickerOptions1: {
                    disabledDate(time) {
                        return time.getTime() <= (Date.now() - 8.64e7)
                    }
                },
                isSaved: false,
                mapDia: false,
                mapConfig: {
                    location: '',
                    keyword: '',
                    center: {lng: 120.21937542, lat: 30.25924446},
                    zoom: 12,
                },
                typeWorkMap: {},
                typeWorkList: [],
                allConfirmList: [],
                taskList: [],
                unitMap: {
                    [1]: '件',
                    [2]: '袋',
                    [3]: '车',
                    [4]: '吨',
                },
                ladderList: [],
                showEditUnitPrice: false,
                showEditProfessionDemand: false,
                priceText: '',
                params: {},
            }
        },
        filters: {},
        mounted() {

        },
        beforeDestroy() {
        },
        watch: {
            showAddClassForm: function(val,old){
                if(!val){
                    this.handleClearState();
                }
            },
            mapDia: function (val, old) {
                if (val == true) {
                    this.mapConfig.keyword = '';
                    this.form.address = ''
                }
            },
        },
        methods: {
            updateForBug() {
                this.$forceUpdate();
            },
            async taskChange(val) {
                await this.$api.getAssignmentInfoClassTaskList({
                    pageNum: 1,
                    pageSize: 0,
                    assignmentInfoId: Number(val)
                }).then(res => {
                    this.params = Object.assign({}, {classListLen: res.data.total, assignmentInfoId: val})
                })
                await this.$api.getTaskStatus({id: val}).then(res => {
                    this.params = {...this.params, ...res.data}
                })
                console.log(this.params);
                // this.handleSetEditData(this.params); 编辑的时候用
                this.handleInitForm(this.params);
            },
            settlementChange(val) {
                this.$forceUpdate();
            },
            handleJSONParse(val) {
                return JSON.parse(JSON.stringify(val));
            },
            handleInitForm() {
                const {classListLen,taskName,latitude, longitude, workingPlace, authorizedNumber, cusAuthorizedNumber, startTime, endTime, workStartTime, endWorkType, workEndTime, price, industryList,isGrab,deposit} = this.params;
                let $userInfo = JSON.parse(localStorage.getItem('userInfo'));
                this.form.fullName = $userInfo.customerName;
                this.form.classifyName = taskName + '(' + (classListLen + 1) + ')';
                this.form.latitude = latitude;
                this.form.longitude = longitude;
                this.form.address = workingPlace;
                this.form.customerNum = cusAuthorizedNumber;
                this.form.productionNum = authorizedNumber;
                this.form.startDateTime = startTime.split(' ')[0];
                this.form.startDateTime1 = startTime.split(' ')[1].substring(0, startTime.split(' ')[1].length - 3);
                this.form.endDateTime = endTime ? endTime.split(' ')[0] : '';
                this.form.endDateTime1 = endTime ? endTime.split(' ')[1].substring(0, endTime.split(' ')[1].length - 3) : '';
                this.form.officeHours = workStartTime.substr(0, workStartTime.length - 3);
                this.form.timeOutDate = endWorkType;
                this.form.timeOut = workEndTime.substr(0, workEndTime.length - 3);
                this.form.unitPrice = {
                    ...this.hanldeSetEditPrice(JSON.parse(price))
                };
                this.form.settlementType = JSON.parse(price).settlementType ? JSON.parse(price).settlementType : '1';
                this.form.isGrab = '2';
                this.form.deposit = deposit;
                this.priceText = this.GlobalPriceFilter.priceFilter(price);
                this.form.workList = industryList.split(',').map(it => {
                    return {
                        type: it,
                        hour: '',
                        piece: '',
                        bag: '',
                        car: '',
                        ton: '',
                        dayFixed: ''
                    }
                });
                this.form.professionDemand = industryList.split(',');
                this.professionDemandForm = {
                    professionDemand: industryList.split(',')
                };
            },
            handleDealListPrice(row, i, key, val) {
                this.form.workList[i][key] = String(val).replace(/^(.*\..{4}).*$/, "$1");
            },
            handleDealPrice(val, key, form) {
                let $val = String(val).replace(/^(.*\..{4}).*$/, "$1");
                if (form) {
                    this[form][key] = Number($val);
                } else {
                    this[key] = Number($val);
                }
                return $val;
            },
            handleNumber(e, key, form) {
                this.handleDealPrice(e, key, form);
            },
            handleTest(val) {
            },
            infohtmlset(poi) {
                this.form.address = `${poi.city}${poi.address}${poi.title}`;
                this.form.latitude = poi.point.lat;
                this.form.longitude = poi.point.lng;
                this.mapDia = false;
                this.$refs['form'].validateField('address');
            },
            viewMap() {
                this.mapDia = true
            },
            handleDealForm(val) {
                const {
                    deposit,
                    isGrab,
                    longitude,
                    latitude,
                    workList,
                    classifyName,
                    classManager,
                    dataRange,
                    startDateTime,
                    startDateTime1,
                    endDateTime,
                    endDateTime1,
                    customerNum,
                    productionNum,
                    unitPrice: {
                        priceList,
                        exceedPrice,
                        //计价方式
                        valuationType,
                        //计量方式
                        calculateType,
                        //计量单价
                        calculatePrice,
                        //计时单价
                        valuationPrice,
                        calculatePricePiece,
                        calculatePriceBag,
                        calculatePriceCar,
                        calculatePriceTon,
                        //固定计价
                        calculatePriceReal,
                        unit,
                        dayPrice
                    },
                    officeHours,
                    timeOutDate,
                    timeOut,
                    cardType,
                    isFaceCard,
                    cardLimit,
                    professionDemand,
                    priceLimit,
                    needPriceCheck,
                    fullName,
                    confirm,
                    address,
                    settlementType
                } = val;
                let $price = {};
                if (valuationType === 1) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: "",
                            countChe: "",
                            countDun: "",
                            countDai: ""
                        }], unit: "", valuationType: 1, settlementType: settlementType
                    }
                } else if (valuationType === 2 && calculateType === 1 && calculatePrice === 1) {

                    $price = {
                        price: [{
                            countTime: "",
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: unit === 1 ? calculatePriceReal : "",
                            countDai: unit === 2 ? calculatePriceReal : "",
                            countChe: unit === 3 ? calculatePriceReal : "",
                            countDun: unit === 4 ? calculatePriceReal : ""
                        }], unit, valuationType: 2, settlementType: settlementType
                    }
                } else if (valuationType === 2 && calculateType === 1 && calculatePrice === 2) {

                    $price = {
                        price: [{
                            countTime: "",
                            ladderObj: [...priceList.map(it => {
                                return {
                                    count: it.num,
                                    unit: it.price
                                }
                            }), {overUnit: exceedPrice.price}],
                            countSettle: "",
                            countChe: "",
                            countDun: "",
                            countDai: ""
                        }], unit, valuationType: 3, settlementType: settlementType
                    }
                } else if (valuationType === 2 && calculateType === 2) {

                    $price = {
                        price: [{
                            countTime: "",
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: calculatePricePiece,
                            countDai: calculatePriceBag,
                            countChe: calculatePriceCar,
                            countDun: calculatePriceTon
                        }], unit: "", valuationType: 4, settlementType: settlementType
                    }
                } else if (valuationType === 3 && calculateType === 1 && calculatePrice === 1) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: unit === 1 ? calculatePriceReal : "",
                            countDai: unit === 2 ? calculatePriceReal : "",
                            countChe: unit === 3 ? calculatePriceReal : "",
                            countDun: unit === 4 ? calculatePriceReal : ""
                        }], unit, valuationType: 5, settlementType: settlementType
                    }
                } else if (valuationType === 3 && calculateType === 1 && calculatePrice === 2) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [...priceList.map(it => {
                                return {
                                    count: it.num,
                                    unit: it.price
                                }
                            }), {overUnit: exceedPrice.price}],
                            countSettle: "",
                            countChe: "",
                            countDun: "",
                            countDai: ""
                        }], unit, valuationType: 6, settlementType: settlementType
                    }
                } else if (valuationType === 3 && calculateType === 2) {

                    $price = {
                        price: [{
                            countTime: valuationPrice,
                            ladderObj: [{count: "", unit: ""}],
                            countSettle: calculatePricePiece,
                            countDai: calculatePriceBag,
                            countChe: calculatePriceCar,
                            countDun: calculatePriceTon
                        }], unit: "", valuationType: 7, settlementType: settlementType
                    }
                } else if (valuationType === 4) {
                    $price = {
                        price: [{sex: 3, countFixed: dayPrice}],
                        unit: "",
                        valuationType: 8,
                        settlementType: settlementType
                    }

                }
                const $params = {
                    isGrab,
                    deposit,
                    settlementType,
                    longitude,
                    latitude,
                    assignmentInfoId: this.params.assignmentInfoId,
                    classTaskName: classifyName,
                    managerId: classManager,
                    startTime: startDateTime + ' ' + startDateTime1 + ':00',
                    endTime: endDateTime && endDateTime1 ? endDateTime + ' ' + endDateTime1 + ':00' : '',
                    cusAuthorizedNumber: customerNum,
                    authorizedNumber: productionNum,
                    price: JSON.stringify($price),
                    workStartTime: officeHours + ':00',
                    endWorkType: timeOutDate,
                    workEndTime: timeOut + ':00',
                    workingPlace: address,
                    punchWay: cardType,
                    isRecognition: isFaceCard,
                    punchRange: cardLimit,
                    industryList: professionDemand.join(','),
                    uppeLimit: priceLimit,
                    needPriceCheck: needPriceCheck,
                    signCustomerName: fullName,
                    classTaskPriceLimitDTOList: workList.map(it => {
                        return {
                            industry: it.type,
                            priceLimit: priceLimit === 2 ?
                                JSON.stringify({
                                    price: [{
                                        countTime: "",
                                        countSettle: "",
                                        countDai: "",
                                        countChe: "",
                                        countDun: "",
                                        countFixed: ""
                                    }]
                                })
                                : JSON.stringify({
                                    price: [{
                                        countTime: it.hour,
                                        countSettle: it.piece,
                                        countDai: it.bag,
                                        countChe: it.car,
                                        countDun: it.ton,
                                        countFixed: it.dayFixed
                                    }]
                                })
                        }
                    }),
                    classTaskConfirmDTOList: this.allConfirmList.filter(it => confirm.some(z => z === it.id)).map(it => {
                        return {
                            confirmId: it.id,
                            name: it.nameAlias,
                            idCard: it.idCard
                        }
                    })
                }
                return $params;

            },
            handleChangeTimeOutDate() {
                this.$refs['form'].validateField('timeOutDate');
            },
            handleChangeClassManager() {
                this.$refs['form'].validateField('classManager');
            },
            handleClearState() {
                this.mapDia = false;
                this.isSaved = false;
                this.form = {
                    //  taskName:'',
                    longitude: '',
                    latitude: '',
                    isGrab:'2',
                    deposit:'',
                    taskId: '',
                    workList: [],
                    classifyName: '',
                    classManager: '',
                    startDate: '',
                    endDate: '',
                    customerNum: null,
                    productionNum: null,
                    unitPrice: {
                        unit: 1,
                        priceList: [],
                        exceedPrice: {
                            num: null,
                            price: null,
                        },
                        valuationType: 1,
                        calculateType: 1,
                        calculatePrice: 1,
                        valuationPrice: null,
                        calculatePricePiece: null,
                        calculatePriceBag: null,
                        calculatePriceCar: null,
                        calculatePriceTon: null,
                        calculatePriceReal: null
                    },
                    startDateTime: '',
                    startDateTime1: '',
                    endDateTime: '',
                    endDateTime1: '',
                    officeHours: '',
                    timeOutDate: 1,
                    timeOut: '',
                    cardType: 1,
                    isFaceCard: 0,
                    cardLimit: '2000',
                    professionDemand: [],
                    priceLimit: 2,
                    needPriceCheck: 1,
                    fullName: '',
                    confirm: [],
                    address: '',
                };
                this.priceForm = {
                    calculateType: 1,
                    calculateUnit: 1,
                    calculatePrice: 1,
                    valuationType: 1,
                    exceedLadder: null,
                    ladder1num: null,
                    ladder1price: null,
                    calculatePricePiece: null,
                    calculatePriceBag: null,
                    calculatePriceCar: null,
                    calculatePriceTon: null,
                    calculatePriceReal: null
                };
                this.professionDemandForm = {
                    professionDemand: []
                };
                if (this.$refs['form']) {
                    this.$refs['form'].clearValidate();
                }
            },

            handleChangeConfirm(val) {
                this.$refs['form'].validateField('confirm');
            },
            handleCancelAddClassForm() {
                this.handleClearState();
                this.cancelAddClassForm();
            },
            saveProfessionDemandForm() {
                this.$refs['professionDemandForm'].validate((valid) => {
                    if (valid) {
                        let $workList = this.professionDemandForm.professionDemand.map(it => {
                            if (this.form.workList.some(z => z.type === it)) {
                                return null;
                            } else {
                                return {
                                    type: it,
                                    hour: '',
                                    piece: '',
                                    bag: '',
                                    car: '',
                                    ton: '',
                                    dayFixed: ''
                                }
                            }
                        }).filter(it => !!it);
                        let $workList2 = this.form.workList.filter(it => this.professionDemandForm.professionDemand.some(z => z === it.type));
                        this.form.professionDemand = this.professionDemandForm.professionDemand;
                        this.form.workList = [...$workList2, ...$workList];
                        this.$refs['form'].validateField('professionDemand');
                        this.showEditProfessionDemand = false;
                    } else {
                    }
                });
            },
            handleEditProfessionDemand() {
                this.showEditProfessionDemand = true;
            },
            handleAddLadder() {
                const checkNumer = (rule, value, callback) => {
                    if (Number(value) <= 0) {
                        callback(new Error("请输入大于0的整数"));
                    } else {
                        callback();
                    }
                }
                const checkPointValid = (rule, value, callback) => {
                    if (!pointValid.test(Number(value))) {
                        callback(new Error("请输入正确的格式"));
                    } else {
                        callback();
                    }
                }
                const newLadder = {
                    count: '',
                    unit: ''
                };
                this.ladderList.push(newLadder);
                console.log('this.ladderList', this.ladderList);
                this.priceForm = {
                    ...this.priceForm,
                    [`ladder${this.ladderList.length}num`]: null,
                    [`ladder${this.ladderList.length}price`]: null
                };
                console.log('this.priceForm', this.priceForm);
                this.priceFormRules = {
                    ...this.priceFormRules,
                    [`ladder${this.ladderList.length}num`]: [{
                        required: true, message: '班务核算数量不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        , {validator: checkPointValid, trigger: 'blur'}
                    ],
                    [`ladder${this.ladderList.length}price`]: [{
                        required: true, message: '班务核算单价不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                };
                this.changeLadderStatus = true;
            },
            handleDeleteLadder(index) {
                const {ladderList, priceForm, priceFormRules} = this;
                this.ladderList.splice(this.ladderList.length - 1, 1);
                delete priceForm[`ladder${index + 1}num`];
                delete priceForm[`ladder${index + 1}price`];
                delete priceFormRules[`ladder${index + 1}num`];
                delete priceFormRules[`ladder${index + 1}price`];
                this.priceForm = {
                    ...priceForm
                };
                this.priceFormRules = {
                    ...priceFormRules
                };
                this.changeLadderStatus = true;
            },
            handleEditUnitPrice() {
                let res = JSON.parse(this.params.price);
                let ladderShorter = res.price[0].ladderObj;
                let ladderLastElement = ladderShorter[ladderShorter.length - 1];
                let lastLength = Object.keys(ladderLastElement);
                if (this.changeLadderStatus) {
                } else {
                    if (lastLength.length == 1) {
                        console.log(ladderShorter.slice(0, ladderShorter.length - 1));
                        this.ladderList = ladderShorter.slice(0, ladderShorter.length - 1);
                    } else {
                    }
                }
                // console.log( 'form.unitPrice.priceList',this.form.unitPrice );
                this.showEditUnitPrice = true;
            },
            onSubmit() {
                this.$refs['form'].validate((valid) => {
                    if (valid) {
                        let $params = this.handleDealForm(this.form);
                        const {startTime, endTime, workStartTime, endWorkType, workEndTime} = $params;
                        if (endTime && moment(startTime) - moment(endTime) >= 0) {
                            this.$message({
                                message: '开始时间不能大于等于结束时间',
                                type: 'warning'
                            });
                        } else if (endWorkType === 1 && moment('1992-8-21' + ' ' + workStartTime + ':00') - (moment('1992-8-21' + ' ' + workEndTime + ':00')) > 0) {
                            this.$message({
                                message: '当日上班时间不能大于下班时间',
                                type: 'warning'
                            });
                        } else {
                            // console.log('$params',$params);
                            if (this.edit) {
                                this.handleEdit($params);
                            } else {
                                this.save($params);
                            }
                        }

                    } else {
                    }
                });
            },
            savePriceForm() {
                this.$refs['priceForm'].validate((valid) => {
                    console.log('valid', valid);
                    let notLadderData = () => {
                        let outObj = this.priceForm;
                        let outObj2 = this.form.unitPrice;
                        // console.log( 'outObj',outObj );
                        // console.log( 'outObj2',outObj2 );
                        let collection = [
                            'calculatePrice',
                            'calculatePriceBag',
                            'calculatePriceCar',
                            'calculatePricePiece',
                            'calculatePriceReal',
                            'calculatePriceTon',
                            'calculateType',
                            'valuationPrice',
                            'valuationType'
                        ];
                        collection.forEach(ele => {
                            this.form.unitPrice[ele] = this.priceForm[ele];
                        });
                        this.form.unitPrice.unit = this.priceForm.calculateUnit;
                    };
                    if (valid) {
                        let priceList = [];
                        // console.log( 'this.ladderList',this.ladderList );
                        // console.log( this.form.unitPrice );
                        // console.log( this.priceForm );
                        notLadderData();
                        if (this.ladderList.length) {
                            let waiting = this.ladderList.map((ele, index) => {
                                return {
                                    num: this.priceForm[`ladder${index + 1}num`],
                                    price: this.priceForm[`ladder${index + 1}price`]
                                }
                            })
                            this.priceList = waiting;
                            let exceedPrice = {
                                num: this.priceList[this.priceList.length - 1].num,
                                price: this.priceForm.exceedLadder
                            }
                            //  console.log( 'exceedPrice',exceedPrice );
                            let calculatePriceList = [
                                this.priceForm.calculatePricePiece,
                                this.priceForm.calculatePriceBag,
                                this.priceForm.calculatePriceCar,
                                this.priceForm.calculatePriceTon,
                            ];
                            let generateListFlag = calculatePriceList.some(ele => {
                                ele > 0
                            });
                            if ((this.priceForm.calculateType === 2) && (!generateListFlag)) {
                                this.$message({
                                    message: '必须有计量单价大于0',
                                    type: 'warning'
                                });
                            } else {
                                this.priceList.forEach(ele => {
                                    ele.num = Number(ele.num);
                                    ele.price = String(ele.price);
                                });
                                // console.log( 'priceForm',this.priceForm );
                                // console.log( 'this.priceList',this.priceList );
                                this.priceList.forEach((ele, index) => {
                                    this.ladderList.forEach((subEle, subIndex) => {
                                        this.ladderList[index].count = ele.num;
                                        this.ladderList[index].unit = ele.price;
                                    })
                                })
                                const repeatFunction = () => {
                                    let tempObj = Object.assign({}, this.priceForm);
                                    let tempObj2 = Object.assign({}, this.form.unitPrice);
                                    let tempObj3 = Object.assign({}, this.form.unitPrice);
                                    for (let val in tempObj2) {
                                        tempObj3[val] = tempObj[val];
                                    }
                                    tempObj3.exceedPrice = {
                                        price: this.priceForm.exceedLadder,
                                        num: this.priceList[this.priceList.length - 1].num,
                                    };
                                    tempObj3.unit = this.priceForm.calculateUnit;
                                    tempObj3.priceList = this.priceList;
                                    this.form.unitPrice = Object.assign({}, tempObj3);
                                    // console.log( 'this.form.unitPrice',this.form.unitPrice );
                                    this.$refs['form'].validateField('unitPrice');
                                    this.isSaved = true;
                                    this.showEditUnitPrice = false;
                                    this.$forceUpdate();
                                };
                                if (this.priceList[0].num && this.priceList.length > 1) {
                                    let judge = this.priceList.every((it, i) => {
                                        if (i < this.priceList.length - 1) {
                                            return it.num - this.priceList[i + 1].num < 0
                                        } else {
                                            return true;
                                        }
                                    });
                                    if (judge) {
                                        repeatFunction();
                                    } else {
                                        if (this.priceForm.calculateType === 2) {
                                            repeatFunction();
                                        } else {
                                            if (this.priceForm.calculatePrice === 2) {
                                                this.$message({
                                                    message: '后面档位的数量必须大于前面所有档位的数量',
                                                    type: 'warning'
                                                });
                                            } else {
                                                repeatFunction();
                                            }
                                        }
                                    }
                                } else {
                                    repeatFunction();
                                }
                            }
                        } else {
                            this.isSaved = true;
                            this.showEditUnitPrice = false;
                            this.$forceUpdate();
                        }


                    } else {
                    }
                });
            }
        },
    }
</script>
<style lang="scss">
    .highlightText {
        color: #e84518;
    }

    .priceTextLimit {
        width: 500px;
        box-sizing: border-box;
        padding: 20px;
    }

    .editBtn {
        cursor: pointer;
        color: #E94A1E;
        padding-top: 20px;
        padding-bottom: 20px;
    }

    .el-date-editor--daterange.el-input__inner {
        width: 400px;
    }

    .u-profession-demand {
        display: flex;

        .u-profession-demand-item {
            width: 60px;
            text-align: center;
        }
    }

    .add-class-form {
        .addRequireFixBug {
            .el-form-item__label {
                &::before {
                    content: '*';
                    color: #F56C6C;
                    margin-right: 4px;
                }
            }
        }
    }
</style>