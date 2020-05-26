<template>
  <el-dialog class="addTaskDialogCon" :title="title" :visible.sync="addTaskVisible" width="740px" :center="true" :before-close="handleClose" :close-on-click-modal='true'>
    <el-form label-width="200px"  label-position="right" :model="form" :rules="rules" ref="form">
      <el-form-item label="任务名称：" prop="taskName">
        <el-input placeholder="不超过10个字" :disabled="isEdit" size="medium" v-model="form.taskName" @keyup.native="handleSlice" maxlength="10"></el-input>
        <div class="form-tip">填写建议：客户简称+需要处理的任务+白晚班</div>
        <div class="form-tip">示例：中心局内部处理白班</div>
      </el-form-item>
        
        <el-form-item v-show=" (form.taskType=='3')||(form.taskType=='2') "  label="任务指派：" prop="taskType">
            <el-radio-group v-model="form.taskType" :disabled="isEdit">
              <el-radio label="2">发至任务市场抢单</el-radio>
              <el-radio label="3">指派给其他经理人</el-radio>
            </el-radio-group>
        </el-form-item>
        
        <el-form-item label="指派给其他经理人：" required prop="selectManager" v-if="form.taskType==='3'">
            <div class="selectManagerSubCon">
                <el-select class="controlSelect" v-model="form.selectManager" filterable placeholder="请选择" :disabled="isEdit">
              <el-option v-for="(item,index) in PartnerBindingList" :key="index" :label="item.partnerName" :value="item.partnerId" ></el-option>
            </el-select>
            <div  v-if="!PartnerBindingList.length" class="bindSelectInfoText">您还未绑定经理人，无法指定&nbsp;&nbsp;&nbsp; <span class="bindText" @click="handleToBinding">去绑定</span> </div>
            </div>
        </el-form-item>    
        
        <el-form-item label="任务所属：" class="belongToItem" prop="belongTo"  v-show="(form.taskType=='1') || (form.taskType=='4')">
        <el-select :disabled="isEdit" v-model="form.belongTo" filterable placeholder="请选择" @change="belongToChange(form.belongTo)">
          <el-option v-for="(item,index) in subCustomerList" :key="index" :label="item.belongToName" :value="`${item.belongTo},${item.belongToName}`" ></el-option>
        </el-select>
      </el-form-item> 
        
        <el-form-item label="选择外包商：" required class="belongToItem" prop="outsourcingCusId"  v-show="(form.taskType=='4')">
        <el-select :disabled="isEdit" v-model="form.outsourcingCusId" filterable placeholder="请选择外包渠道商">
          <el-option v-for="(item,index) in outSourceingLists" :key="index" :label="item.shortName" :value="item.id" ></el-option>
        </el-select>
            <div class="limitWidthText">外包任务选择外包渠道商后，需指定外包渠道商所拥有的自由职业者工作，且收入通过该外包渠道商发放。</div>
      </el-form-item> 
        
        
        
      <el-form-item label="结算方式：" required>
        <el-radio-group v-model="form.settlementType" :disabled="isEdit">
          <el-radio label="1">日结</el-radio>
          <el-radio label="2">月结</el-radio>
          <el-radio label="4">周结</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间："  prop="startTimeProp">
        <div class="startTimeStyleCon commonFlex">
              <el-date-picker v-model="form.startTime0" :disabled="isEdit" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions0"></el-date-picker>            
              <el-time-select v-model="form.startTime1" :disabled="isEdit" placeholder="选择时间" value-format="HH:mm" format="HH:mm" :picker-options="{minTime: endStart,start: '00:00',step: '00:30',end: '23:30'}"></el-time-select>
        </div>
      </el-form-item>
      <el-form-item label="结束时间：" prop="endTimeProp" :required="form.settlementType == 3">
        <div class="startTimeStyleCon commonFlex">
              <el-date-picker type="date"  v-model="endTime0"  placeholder="选择日期" value-format="yyyy-MM-dd"  :picker-options="pickerOptions1" @change="endTimeChange('form','endTime0')" ></el-date-picker>
              <el-time-select   placeholder="选择时间" v-model="endTime1" value-format="HH:mm" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}"  @change="endTimeChange('form','endTime1')"></el-time-select>
        </div>
      </el-form-item>
      <el-form-item label="核定人数：" prop="authorizedNumber" required>
        <el-input size="medium" v-model="form.authorizedNumber" maxlength="10"></el-input>
        <div class="form-tip">建议核定人数在实际需要人数基础上增加10%</div>
      </el-form-item>
      <el-form-item label="计价方式：" class="valuationTypeItem" required>
        <!--计时，计量，计时+计量-->
        <el-select v-model="form.valuationType" placeholder="请选择" :disabled="isEdit" @change="resetValuationType('form','valuationType')">
          <el-option v-for="item in planList" :key="item.value" :label="item.label" :value="item.value" ></el-option>
        </el-select>
      </el-form-item>
      <!-- 计时 -->
      <el-form-item label="计时单价：" v-if="!isEdit&&isTiming" prop="countTime">
        <div class="countTimeInitStyle" >
            <el-input  size="medium" v-model.trim="form.countTime"  maxlength="10" :disabled="isEdit"></el-input>
          <div class="countTimeText">元/小时</div>
        </div>
      </el-form-item>
      <!-- 计量单位 -->
      <el-form-item v-if="!isEdit&&isMetering">
        <el-form-item class="measureUnitItem">
          <el-radio-group v-model="form.mUnit" @change="mUnitChange">
            <el-radio label="1" :disabled="isEdit">单一计量</el-radio>
            <el-radio label="2" :disabled="isEdit">组合计量</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form-item>
      <!--件、袋、车、吨-->
      <el-form-item class="measureUnitStyle" label="计量单位：" v-if="!isEdit&&isSingleMetering" required>
        <el-select v-model="form.mWay" placeholder="请选择" :disabled="isEdit" @change="mWayChange">
          <el-option v-for="item in wayList" :key="item.value" :label="item.label" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <!-- 计量 -->
      <div v-if="!isEdit&&isSingleMetering">
        <el-form-item label="计量单价：">
          <el-radio-group  v-model="form.countType" @change="countTypeChange('form','countType')" :disabled="isEdit">
            <el-radio label="1">固定计价</el-radio>
            <el-radio label="2">阶梯计价</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--固定计价-->
        <el-form-item v-if="form.countType == 1" prop="settleCount">
          <el-input size="medium" v-model="form.settleCount" :disabled="isEdit" maxlength="10" class="innerSpeSet"></el-input>元/{{varUnit}}<br/>
        </el-form-item>
        <!--阶梯计价-->
          
        <div v-if="form.countType == 2" class="ladderlimitWidth">
          <div v-for="(item, index) in form.ladderObj" :key="index">
            <el-row>
              <el-col :span="12" :offset="4">
                <img class="delIconImg" src="../../../assets/images/delete_ladder.png" alt="删除" v-if="index != 0" @click="deleteLadder(index)">
                <span class="level">第{{index+1}}档：</span>
              </el-col>
            </el-row>
            <el-row class="ladderFourItemCon">
                <div class="divideWidth">
                <el-form-item :prop="`ladderObj.${index}.count`" :rules="ladderObjRules.count">
                  <el-input  :disabled="isEdit" size="medium" v-model.trim.number="item.count" maxlength="10" class="short-input"></el-input>
                </el-form-item>
              <div class="divideWidthText">{{varUnit}}</div>
                </div>
              <div class="divideWidth removeSecondEffect">
                <el-form-item :prop="`ladderObj.${index}.unit` " :rules="ladderObjRules.unit">
                  <el-input :disabled="isEdit" size="medium" v-model.trim="item.unit" maxlength="10" class="short-input"></el-input>
                </el-form-item>
              <div class="divideWidthText">元/{{varUnit}}</div>
                </div>
            </el-row>
          </div>
        </div>

        <div v-if="form.countType == 2">
          <el-row>
            <el-col :span="8" :offset="4">
              <el-button round size="medium" class="addBtn" @click="addLadder" v-if="!isEdit">添加阶梯</el-button>
            </el-col>
          </el-row>
        </div>

        <el-form-item v-if="form.countType == 2 && form.ladderObj" prop="overUnitProp">
          <span>超过第{{form.ladderObj.length || 0}}档时，</span>
          <el-input :disabled="isEdit" size="medium" class="innerSingleStyle" v-model="form.overUnit" maxlength="10"></el-input>
          <span>元/{{varUnit}}</span>
          <div>{{form.ladderObj[0].count || ''}}{{varUnit}}以下（含），
            {{form.ladderObj[0].unit || ''}}元/{{varUnit}}</div>
          <div v-for="(item, index) in form.ladderObj" :key="index">
            <div v-if="index != 0">{{Number((form.ladderObj[index-1].count)) + 1}}至{{item.count}}{{varUnit}}（含），{{item.unit}}元/{{varUnit}}</div>
          </div>
          <div>{{form.ladderObj[form.ladderObj.length-1].count || ''}}{{varUnit}}以上，{{form.overUnit || ''}}元/{{varUnit}}</div>
        </el-form-item>

      </div>
      <!-- 组合 -->
          <div  v-show="!isEdit&&isCombMetering">
        <el-form-item prop="countjian">
          <el-input size="medium" v-model.trim="form.countjian" class="fourTextInput" maxlength="10"></el-input>元/件
        </el-form-item>
        <el-form-item prop="countDai">
          <el-input size="medium"  v-model.trim="form.countDai" class="fourTextInput" maxlength="10"></el-input>元/袋
        </el-form-item>
        <el-form-item prop="countChe">
          <el-input size="medium"  v-model.trim="form.countChe" class="fourTextInput" maxlength="10"></el-input>元/车
        </el-form-item>
        <el-form-item prop="countDun">
          <el-input size="medium"  v-model.trim="form.countDun" class="fourTextInput" maxlength="10"></el-input>元/吨
        </el-form-item>
      </div>

      <el-form-item label="上班时间：" prop="workStartTime">
        <el-time-select class="workStartTimeStyleCon" v-model="form.workStartTime" placeholder="选择时间" value-format="HH:mm" format="HH:mm" :picker-options="{minTime: range,start: '00:00',step: '00:30',end: '23:30'}"></el-time-select>
      </el-form-item>
      <el-form-item label="下班时间：" prop="workEndTime">
        <div class="workEndTimeStyleCon commonFlex">
            <el-select v-model="form.endWorkType" filterable placeholder="请选择" class="day-select" >
              <el-option v-for="item in dayList" :key="item.value" :label="item.label" :value="item.value"></el-option>
            </el-select>
            <el-time-select v-model="form.workEndTime" placeholder="选择时间" value-format="HH:mm" format="HH:mm" :picker-options="{minTime: range,start: '00:00',step: '00:30',end: '23:30'}"></el-time-select>
        </div>
      </el-form-item>
      <el-form-item label="打卡地点：" prop="workingPlace">
        <el-tooltip :disabled="!form.workingPlace.length" effect="dark" :content="form.workingPlace" placement="top-start">
                <el-input placeholder="搜索地点，并进行选择" size="medium" v-model="form.workingPlace" @focus="viewMap" v-if="!mapDia"></el-input>
          <el-input size="medium" v-model="mapConfig.keyword" v-if="mapDia" @focus="viewMap" ></el-input>
        </el-tooltip>
        <div class="form-tip">上下班打卡所在地</div>
      </el-form-item>
      <div v-if="mapDia" class="mapContain">
        <baidu-map class="map-container" :scroll-wheel-zoom="true" :center="mapConfig.center" :zoom="mapConfig.zoom">
          <bm-local-search :keyword="mapConfig.keyword" :auto-viewport="true" :location="mapConfig.location" @infohtmlset="infohtmlset">
          </bm-local-search>
        </baidu-map>
      </div>
      <el-form-item label="男工人数：" v-if="false">
<!--
          <el-autocomplete
              v-model="setLimit"
              :fetch-suggestions="querySearchAsync"
              placeholder="请输入内容"
              @select="handleSelect"
            ></el-autocomplete>
--> 
        <el-radio-group v-model="setLimit">
          <el-radio label="0">不限</el-radio>
          <el-radio label="1">输入限制</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item v-if="setLimit == 1" prop="maleNum" required>
        <el-input size="medium" type="number" v-model="form.maleNum"></el-input>
      </el-form-item>
      <!-- v-if="femaleNum > 0 && form.maleNum != 0" -->
      <el-form-item label="女工人数：" v-if="false">
        {{femaleNum || ''}}
      </el-form-item>
      <el-form-item label="年龄要求：" class="is_required ageRequired">
          <el-form-item prop="ageLowerLimit">
            <el-input size="medium" class="short-input" v-model="form.ageLowerLimit"></el-input>
          </el-form-item>
        <div class="ageText">岁&nbsp;至</div>
          <el-form-item prop="ageUpperLimit">
            <el-input size="medium" class="short-input" v-model="form.ageUpperLimit"></el-input>
          </el-form-item>
        <div>岁</div>
      </el-form-item>
      <el-form-item label="工种要求：" prop="inDicName">
        <el-checkbox-group v-model="industry" @change="handleCheckboxChange">
          <el-checkbox v-for="(item,index) in taskIndustryNameList" :key="index" :disabled="initIndustry.includes(item.dicName)" :label="item.dicName" :value="item.dicName"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="其他要求：" >
        <el-input class="textStyle" type="textarea" :rows="2" placeholder="比如：以上零工必须要有投递经验" v-model="form.otherDemand"></el-input>
      </el-form-item>
    </el-form>
    <div class="dialog-btn">
      <el-button size="medium" @click="handleCancel">取 消</el-button>
      <el-button size="medium" type="primary" @click="handleSave">保 存</el-button>
    </div>
  </el-dialog>
</template>
<script>
    import Util from '@/common/util.js';
    import rules from './validRules.js';  
    import initData from './initData.js';  
export default {
  name: 'AddTask',
    props: {
        addOrEditStatus: {
            type: Number,
            default: 2
        },
        taskId: {
            type: Number,
            default: 2
        },
        comeFrom:{
            type: String,
        },
    },
  data() { 
      let checkOverUnit = (rule, value, callback)=>{
          console.log( rule );
          if( this.form.countType == 2 ){
              if(this.form.overUnit.length == 0 ){
                 callback(new Error("单价不能为空"));
              }else{
                  let numberFormat = Number(this.form.overUnit);
                      console.log( 'numberFormat',this.form.overUnit,numberFormat );
                      let isNan = Number.isNaN(numberFormat);
                      let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
                  if( numberFormat === 0 ){
                      this.form.overUnit = '';
                  }
                  if(isNan){
                      this.form.overUnit = '';
                      callback(new Error("请填写正确的单价"));
                  }else{
                      if(isInteger){
                          if( numberFormat<=0 ){
                              this.form.overUnit = '';
                              callback(new Error("请填写正确的单价"));
                          }else{
                              callback(); 
                          }
                      }else{
                          let floatLength = this.form.overUnit.split('.')[1].length;
                          if( floatLength>=4 ){
                              let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4); 
                              this.form.overUnit = process;
                          }
                          callback();
                      }
                  }
              }  
          }else{
              callback(); 
          }
      };
      let checkLadderCount = (rule, value, callback)=>{
          console.log( rule );
          let checkIndex = Number(rule.field.split('.')[1]);
          console.log( 'checkIndex',checkIndex );
          if( value.length == 0 ){
             callback(new Error(`${this.varUnit}数不能为空`));
          }else{
              let numberFormat = Number(value);
              let isNan = Number.isNaN(numberFormat);
              let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
              if( numberFormat === 0 ){
                 this.form.ladderObj[checkIndex].count = '';
              }
              console.log( 'isNan', isNan);
              if(isNan){
                  this.form.ladderObj[checkIndex].count = '';
//                          callback(new Error("请填写正确的件数"));
              }else{
                  if(isInteger){
                      callback();  
                  }else{
                      this.form.ladderObj[checkIndex].count = '';
//                              callback(new Error("请填写正确的件数"));
                  }
              }
          }
      };
      let checkLadderUnit = (rule, value, callback)=>{
          let checkIndex = Number(rule.field.split('.')[1]);
          console.log( 'checkIndex',checkIndex );
          if( value.length === 0 ){
             callback(new Error(`单价不能为空`));
          }else{
              let numberFormat = Number(value);
                  console.log( 'numberFormat',value,numberFormat );
                  let isNan = Number.isNaN(numberFormat);
                  let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
                  if( numberFormat === 0 ){
                     this.form.ladderObj[checkIndex].unit = '';
                  }
              if(isNan){
                  this.form.ladderObj[checkIndex].unit = '';
//                          callback(new Error("请填写正确的单价"));
                      }else{
                          if(isInteger){
                              if( numberFormat<=0 ){
                                  this.form.ladderObj[checkIndex].unit = '';
//                                  callback(new Error("请填写正确的单价"));
                              }else{
                                  callback(); 
                              }
                          }else{
                              let floatLength = value.split('.')[1].length;
                              if( floatLength>=4 ){
                                  let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4); 
                                  this.form.ladderObj[checkIndex].unit = process;
                              }
                              callback();
                          }
                      }
          }
      };
      let checkSettleCount = (rule, value, callback) => {
          if( (this.form.mUnit == 1)&&(this.form.countType == 1) ){
              if( value.length === 0 ){
                  callback(new Error("单价不能为空"));
              }else{
                  let numberFormat = Number(value);
                  console.log( 'numberFormat',value,numberFormat );
                  let isNan = Number.isNaN(numberFormat);
                  let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
                  if( numberFormat === 0 ){
                     this.form.settleCount = '';
                     }
                      if(isNan){
                          callback(new Error("请填写正确的单价"));
                      }else{
                          if(isInteger){
                              if( numberFormat<=0 ){
                                  callback(new Error("请填写正确的单价"));
                              }else{
                                  callback(); 
                              }
                          }else{
                              let floatLength = value.split('.')[1].length;
                              if( floatLength>=4 ){
                                  let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4); 
                                  this.form.settleCount = process;
                              }
                              callback();
                          }
                      }
              }
          }else{
              callback();
          }
      };
      let checkcountTime = (rule, value, callback) => {
          if( this.form.valuationType === 1 ){
              if( value.length == 0 ){
                  callback(new Error("任务单价不能为空"));
              }else{
                 let numberFormat = Number(value);
                 console.log( 'numberFormat',value,numberFormat );
                 let isNan = Number.isNaN(numberFormat);
                 let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
                 if(  numberFormat === 0 ){
                     this.form.countTime = '';
                 }
                 if(isNan){
                     callback(new Error("请填写正确的单价"));
                 }else{
                     if(isInteger){
                         if( numberFormat<=0 ){
                             callback(new Error("请填写正确的单价"));
                         }else{
                             callback(); 
                         }
                     }else{
                         let floatLength = value.split('.')[1].length;
                         if( floatLength>=4 ){
                             let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4); 
                             this.form.countTime = process;
                         }
                         callback();
                     }
                 }
             }
          }else if( this.form.valuationType === 3 ){
              if( value.length == 0 ){
                  callback(new Error("任务单价不能为空"));
              }else{
                 let numberFormat = Number(value);
                 console.log( 'numberFormat',value,numberFormat );
                 let isNan = Number.isNaN(numberFormat);
                 let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
                 if(  numberFormat === 0 ){
                     this.form.countTime = '';
                 }
                 if(isNan){
                     callback(new Error("请填写正确的单价"));
                 }else{
                     if(isInteger){
                         if( numberFormat<=0 ){
                             callback(new Error("请填写正确的单价"));
                         }else{
                             callback(); 
                         }
                     }else{
                         let floatLength = value.split('.')[1].length;
                         if( floatLength>=4 ){
                             let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4); 
                             this.form.countTime = process;
                         }
                         callback();
                     }
                 }
             }
          }else{
              callback();
          }          
      };
      let checkAgeUpperLimit = (rule, value, callback) => {
          if (value) {
              if (parseInt(value) >= parseInt(this.form.ageLowerLimit)) {
                  callback()
              } else {
                  callback(new Error('年龄上限必须大于等于年龄下限'));
              }
          } else {
              callback(new Error('年龄要求不能为空'));
          }
      };      
      let checkInDicName = (rule, value, callback) => {
          if (this.industry.length) {
              callback()
          } else {
              callback(new Error('工种要求不能为空'));
          }
      };
      let checkWorkEndTime = (rule, value, callback) => {
          if (this.form.workEndTime) {
              if (this.form.endWorkType == '1') {
                  if (this.form.workEndTime < this.form.workStartTime) {
                      callback(new Error('下班时间不能早于上班时间'))
                  } else {
                      callback()
                  }
              } else {
                  callback()
              }
          } else {
              callback(new Error('下班时间不能为空'));
          }
      };
      let checkStartTime = (rule, value, callback) => {
          if( (!this.form.startTime0) || (!this.form.startTime1)  ){
              callback(new Error('开始时间不能为空'));
          }else{
              callback()
          }
      };
      let checkEndTime = (rule, value, callback) => {
          window.Timer2 = setTimeout(()=>{
              if( (!this.form.endTime0)&&(!this.form.endTime1)  ){
                  callback()
                  clearTimeout( window.Timer2 );
              }
              if( (this.form.endTime0)&&(this.form.endTime1)  ){
                  callback()
                  clearTimeout( window.Timer2 );
              }
              if( (this.form.endTime0)||(this.form.endTime1) ){
                  callback(new Error('结束时间不能为空'));
                  clearTimeout( window.Timer2 );
              }
          },500)
      };
      let checkMaleNum = (rule, value, callback) => {
          if (value) {
              if (Number(value) >= this.form.authorizedNumber) {
                  callback(new Error('男工人数不能超过核定人数'))
              } else if (Number(value) < 0) {
                  callback(new Error('男工人数不能为负数'))
              } else {
                  callback()
              }
          } else {
              callback(new Error('男工人数不能为空'));
          }
      };
       let checkWorkingPlace = (rule, value, callback) => {
           window.timerInner1 = setTimeout(()=>{
                if(this.form.workingPlace){
                    callback()
                    clearTimeout(window.timerInner1);
                }else{
                    clearTimeout(window.timerInner1);
                    callback(new Error('打卡地点不能为空'));
                }
           },500)
      };
      let checkOutSourcingCusId = (rule, value, callback) => {
          let target = this.form.taskType;
          switch (target){
              case '1':
                  callback();
                  break;
              case '2':
                  callback();
                  break;
                case '3':
                  callback();
                  break;
                case '4':
                  if( value ){
                      callback();
                  }else{
                      callback(new Error('外包商不能为空'));
                  }
                  break;
          }
      };
      let checkSelectManager = (rule, value, callback) => {
          let target = this.form.taskType;
          switch (target) {
              case '1':
                  callback();
                  break;
                  case '2':
                  callback();
                  break;
                  case '3':
                  if( value ){
                      callback();
                  }else{
                      callback(new Error('指派给其他经理人不能为空'));
                  }
                  break;
                  case '4':
                  callback();
                  break;
          }
      };
      let checkCount1 = (rule, value, callback) => {      
          if( (this.lastStepCount != rule.field)&&(this.lastStepCount) ){
             this.$refs.form.validateField(this.lastStepCount);
              this.lastStepCount = rule.field;
          }else{
              this.lastStepCount = rule.field;
          }
          if( (this.form.mUnit == 2)&&(this.form.valuationType == 2) ){
              let arr = [ 'countDai','countChe','countDun','countjian' ];
              let testLength = arr.filter(ele=>{                  
                  return this.form[ele];
              });
              console.log( 'testLength',testLength );
              if( testLength.length>=2 ){
                  let numberFormat = Number(value);
                  let isNan = Number.isNaN(numberFormat);
                  let isInteger = Number.parseInt( numberFormat,10 ) === numberFormat;
                    if( value.length ){
                        if( value == 0 ){
                           this.form[rule.field] = '';
                        }
                        if(isNan){
//                              callback(new Error("请填写正确的单价"));  
                            this.form[rule.field] = '';
                        }else{
                            if(isInteger){
                                if( numberFormat<=0 ){
//                                      callback(new Error("请填写正确的单价"));     
                                    this.form[rule.field] = '';
                                }else{
                                    callback(); 
                                }
                              }else{
                                  let floatLength = value.split('.')[1].length;
                                  if( floatLength>=4 ){
                                      let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4); 
                                      this.form[rule.field] = process;
                                  }
                                  callback();                              
                              }
                        }
                    }else{
                        callback();
                    }
              }else{
                 callback(new Error("请至少填写两个计量单价"));              
              }
          }else{
              callback();
          }
      };
      
      
      
    return {
        outSourceingLists:[],
      addTaskVisible: true,
      industry: [],
      initIndustry: [],  // 编辑状态下原有工种
      taskIndustryNameList: [],      
      subCustomerList: [],
      confirmPersonRules: {},
      endStart: '',
      setLimit: '0', // 男工人数是否做限制
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() <= (Date.now() - 8.64e7);
        }
      },
      pickerOptions1: {
          disabledDate(time) {
              return time.getTime() <= (Date.now() - 8.64e7);
          }
      },
      valuationType: '',
      range: '',
      mapDia: false,  // 地图相关
      mapConfig: {
        location: '',
        keyword: '',
        center: { lng: 120.21937542, lat: 30.25924446 },
        zoom: 12,
      },
      qualityUnit: '',
      lastValue0: '',  // 未编辑状态下的结束时间
      lastValue1: '',  // 未编辑状态下的结束时间
        globalLoading:null,
        priceLimitList:[],
        endTime0: '',
        endTime1: '',
        innerLadderFlag:true,
        PartnerBindingList:[],       
      form: {   
          outsourcingCusId:'',
        belongToName:'',
        selectManager:'',
          taskType:'2',
        taskName: '',
        belongTo: '',
        startTime: '',
        endTime: '',
        startTime0: '',
        startTime1: '',
        endTime0: '',
        endTime1: '',
        workStartTime: '',
        workEndTime: '',
        authorizedNumber: '',
        settlementType: '1',
        valuationType: 1,
        maleNum: '1',
        quilty: '',
        count: 1,
        countTime: '',
        settleCount: '',
        ageUpperLimit: '',
        ageLowerLimit: '',
        workingPlace: '',
        endWorkType: 1,
        unit: '',
        countType: '1',  // 固定计价/阶梯计价
        ladderObj: [
          {
            count: '',
            unit: '',
          },
        ],
        longitude: '',
        latitude: '',
        overUnit: '',
        mUnit: '1',  // 单一计价/组合计价
        mWay: 1,  // 计量单位：件袋车吨
        countSettle: '',  // 件
        countChe: '',  // 车
        countDun: '',  // 吨
        countDai: '',  // 袋
          countjian:'',
        receiptType: 1
      },
        storeBelongToObj:{},
      rules: {
          selectManager: [{
              trigger: "change",
               validator:checkSelectManager,
            }],
          outsourcingCusId:[{
              trigger: "change",
              validator:checkOutSourcingCusId,
          }],
           belongTo: [{
               required: true,
                message: "任务所属不能为空",
               trigger: 'change'
            }],
          overUnitProp:[{
              validator:checkOverUnit,
              trigger: "blur",
          }],
          countDun: [{
              validator:checkCount1,
              trigger: "blur",
          }],
          countjian: [{
              trigger: "blur",
              validator:checkCount1
          }],
          countDai: [{
              trigger: "blur",
              validator:checkCount1
          }],
          countChe: [{
              trigger: "blur",
              validator:checkCount1
          }],
          workingPlace: [{
              required: true,
              trigger: "blur",
              validator:checkWorkingPlace
          }], 
          startTimeProp:[{
              required: true,              
              trigger: "blur",
              validator:checkStartTime
          }],
          endTimeProp:[{         
              trigger: ["blur","change"],
              validator:checkEndTime
          }],
          inDicName:[{
              required: true,
              trigger: "change",
              validator: checkInDicName
          }],
        maleNum: [{
          required: true,
          trigger: "change",
          validator: checkMaleNum
        }],
          ageUpperLimit: [{
              required: true,
              trigger: "blur",
              validator: checkAgeUpperLimit
          }],
          settleCount:[{
              trigger: "blur",
              validator: checkSettleCount
          }],
          countTime: [{
              required: true,
              trigger: "blur",
              validator: checkcountTime
          }],
        workEndTime: [{
          required: true,
          trigger: "change",
          validator: checkWorkEndTime
        }],
        ...rules.rules
      },
          ladderObjRules: {
              count: [{ 
                  trigger: "blur",
                  validator:checkLadderCount
              }],
              unit: [{
                  trigger: "blur",
                  validator:checkLadderUnit
              }]
          },       
      taskConfirms:[],
      ...initData
    }
  },
  computed: {
      isEdit() {
          return (this.addOrEditStatus == 2)
      },
    title() {
      let result = '添加任务'
      result = this.addOrEditStatus == 2 ? '编辑任务' : '添加任务'
      return result
    },
    isTiming() {  // 计时
      return this.form.valuationType == 1 || this.form.valuationType == 3
    },
    isMetering() {  // 计量
      return this.form.valuationType == 2 || this.form.valuationType == 3
    },
    isSingleMetering() {  // 单一计量
      return (this.form.valuationType == 2 || this.form.valuationType == 3) && this.form.mUnit == 1
    },
    isCombMetering() {  // 组合计量
      return (this.form.valuationType == 2 || this.form.valuationType == 3) && this.form.mUnit == 2
    },
    femaleNum() {
      return this.form.authorizedNumber - this.form.maleNum
    },
    ladderCount: function () {
      return this.form.ladderObj[this.form.ladderObj.length - 1].count || 0
    },
    ladderUnit: function () {
      return this.form.ladderObj[this.form.ladderObj.length - 1].unit || 0
    },
    ladderOverUnit: function () {
      return this.form.ladderObj[this.form.ladderObj.length - 1].overUnit || 0
    },
    varUnit() {
      let result = '件'
      switch (this.form.mWay) {
        case 1:
          result = '件'
          break;
        case 2:
          result = '袋'
          break;
        case 3:
          result = '车'
          break;
        case 4:
          result = '吨'
          break;
      }
      return result
    },
  },
  watch: {
    mapDia: function (val, old) {
      if (val) {
        this.mapConfig.keyword = ''
      }
    },
    'form.startTime': function (val, old) {
      let curTime = Util.getTime()
      if (this.startTime0 == curTime) {
        this.endStart = this.getCurrentDate()
      } else {
        this.endStart = ''
      }
    }, 
    'form.startTime0': function (val, old) {
        let brige = this;   
        this.pickerOptions1 =  {
            disabledDate (time) {
                return  time.getTime() <= (new Date(brige.form.startTime0).getTime() -8.64e7)
            }
        };
    },     
  },
  mounted() {
      this.dialogInit();
      this.getSkill();
      this.getBelongList();
      this.handleGetPartnerListBinding(); 
      this.form.taskType = this.comeFrom;      
      this.getOutSourceingLists();
  },
  methods: {
      getOutSourceingLists(){
          let params = {
              pageSize:0,
              customerType:2,
          };
          this.$api.getOutLists(params).then(res=>{
              let { data:layer1 } = res;
              let { data,respCode } = layer1;
              if( respCode === 0 ){
                  this.outSourceingLists = data.list;
              }
          }).catch(err=>{
              console.log('err',err);
          })
      },
      handleToBinding(){
          this.$router.push({
             name:'bindCustomerList'
          });
      },
      handleGetPartnerListBinding(){
          let params = {
              pageSize:0,
              status:1,
          };
        this.$api.getPartnerListBinding(params).then(res=>{
            this.PartnerBindingList = res.data.data.list||[];            
        }).catch(err=>{
            console.log('res',res);
        })
      },
      mWayChange(){
          this.form.ladderObj = [{count: '',unit: ''}];          
          this.$refs.form.clearValidate('ladderObj.0.count');
          this.$refs.form.clearValidate('ladderObj.0.unit');          
      },
      mUnitChange(){
          this.form.countjian = '';
          this.form.countDai = '';
          this.form.countChe = '';
          this.form.countDun = '';
          this.$refs.form.clearValidate('countjian');
          this.$refs.form.clearValidate('countDai');
          this.$refs.form.clearValidate('countChe');
          this.$refs.form.clearValidate('countDun');
          this.$refs.form.clearValidate('settleCount');
          this.form.settleCount = '';
          this.form.ladderObj = [{count: '',unit: ''}];
          this.$refs.form.clearValidate('ladderObj.0.count');
          this.$refs.form.clearValidate('ladderObj.0.unit');             
          this.form.overUnit = '';
          this.$refs.form.clearValidate('overUnitProp');
      },
      countTypeChange(form,item){
          this.$refs.form.clearValidate('settleCount');
          this.form.settleCount = '';
          this.form.ladderObj = [{count: '',unit: ''}];
          this.$refs.form.clearValidate('ladderObj.0.count');
          this.$refs.form.clearValidate('ladderObj.0.unit');          
          this.form.overUnit = '';
          this.$refs.form.clearValidate('overUnitProp');
      },
      resetValuationType(form,item){
          this.form.countTime = '';
          this.form.countjian = '';
          this.form.countDai = '';
          this.form.countChe = '';
          this.form.countDun = '';
          this.form.mUnit = '1';
          this.form.mWay = 1;
          this.form.settleCount = '';
          this.form.overUnit = '';
          this.form.ladderObj = [{count: '',unit: ''}];
          this.$refs.form.clearValidate('countjian');
          this.$refs.form.clearValidate('countDai');
          this.$refs.form.clearValidate('countChe');
          this.$refs.form.clearValidate('countDun');
          this.$refs.form.clearValidate('settleCount');
          this.$refs.form.clearValidate('countTime');
          this.$refs.form.clearValidate('ladderObj.0.count');
          this.$refs.form.clearValidate('ladderObj.0.unit');    
          this.$refs.form.clearValidate('overUnitProp');
      },
      endTimeChange(form,item){  
          this[form][item] = this[item];
      },
      belongToChange(val){
          let data = {};
          data.belongToName = val.split(',')[1];
          this.trackBelongToInfo(data);
      },
      trackBelongToInfo(data){
          let findToNameInex = this.subCustomerList.findIndex( (ele)=>{
              return ele.belongToName === data.belongToName;
          } );
          this.storeBelongToObj = this.subCustomerList[findToNameInex];
      },
      initRemoteDate(data){
          if (data.startTime) {
              let time = data.startTime.toString().split(' ');
              this.form.startTime0 = time[0];
              this.form.startTime1 = time[1];
          }
          if (data.endTime) {
              let time = data.endTime.split(' ');
              this.form.endTime0 = time[0];
              this.form.endTime1 = time[1];
              this.lastValue0 = time[0];
              this.lastValue1 = time[1];  
              this.endTime0 = time[0];
              this.endTime1 = time[1];
          }   
      },
      initPrice(price,data){
          this.form.ladderObj = price.price[0].ladderObj;
          this.form.overUnit = this.form.ladderObj[this.form.ladderObj.length - 1].overUnit;
          this.form.countSettle = price.price[0].countSettle;
          this.form.countTime = price.price[0].countTime;
          let valuationType = price.valuationType || 1;
          switch (valuationType) {
              case 7:
                  this.form.mUnit = '2';
                  break;
              case 6:
                  this.form.mUnit = '1';
                  this.form.countType = '2';
                  break;
              case 5:
                  this.form.mUnit = '1';
                  this.form.countType = '1';
                  break;
              case 4:
                  this.form.mUnit = '2';
                  break;
              case 3:
                  this.form.mUnit = '1';
                  this.form.countType = '2';
                  break;
              case 2:
                  this.form.mUnit = '1';
                  this.form.countType = '1';
                  break;
              case 1:
                  this.form.mUnit = '';
                  this.form.countType = '';
                  break;
          }
          this.form.mWay = price.unit;
          this.form.settleCount = price.price[0].countSettle;  
      },
      initAnalysValuationType(data){
          switch( data.valuationType ){
              case 1:
                  this.form.valuationType = 1;
                  break;
              case 2:
                  this.form.valuationType = 2;
                  break;
              case 3:
                  this.form.valuationType = 2;
                  break;
              case 4:
                  this.form.valuationType = 2;
                  break;
              case 5:
                  this.form.valuationType = 3;
                  break;
              case 6:
                  this.form.valuationType = 3;
                  break;
              case 7:
                  this.form.valuationType = 3;
                  break;
          }
      },
    dialogInit() {
        if (this.addOrEditStatus == 2) {
            let params = {
              id: this.taskId
            }
            this.$api.assignmentInfoDetail(params).then(res => {
                let { respCode,data } = res;
                if( respCode === 0 ){
                    this.form = Object.assign({},data);
                    this.form.belongTo =  `${data.belongTo},${data.belongToName}`;
                    this.form.selectManager = data.receiverCusId;
                    this.form.outsourcingCusId = data.outsourcingCusId;
                    this.initAnalysValuationType(data);
                    this.trackBelongToInfo(data);
                    this.form.settlementType = String( data.settlementType );  
                    let initArr = data.industryListName ? data.industryListName.split(',')  : [];
                    this.form.taskType = String( data.taskType );
                    this.industry = Object.assign([], initArr);  
                    this.initIndustry = Object.assign([], initArr);  
                    let price = JSON.parse(data.price);
                    this.initRemoteDate(data);  
                    this.initPrice(price,data);
                    let genearteIndustryNumArr = data.industryList ? data.industryList.split(',') : [];
                    if( initArr.length ){
                        let gen = initArr.map((ele,index)=>{
                            return {
                                'industryName':ele,
                                'id':genearteIndustryNumArr[index],
                            }
                        })
                        let clone = Object.assign([],gen);
                        let unionValue = this.Lodash.unionBy(clone,'id');
                        this.priceLimitList = unionValue;                                            
                    }else{
                        this.priceLimitList = [];
                    }                    
                }
            }).catch(err => {
                console.error(err)
            })
        }
    },
        getBelongList() {
            this.$api.taskBelongSpToList().then(res=>{
                let { data,respCode } = res;
                if( respCode === 0 ){
                    if(data){
                        this.subCustomerList = data;
                        this.form.belongTo = `${data[0].belongTo},${data[0].belongToName}`;
                        this.belongToChange(this.form.belongTo);
                    }else{
                        this.subCustomerList = [];
                    }
                }
            }).catch(err=>{
                console.log('err',err);
            })
    },  
    handleSlice() {
      if (this.form.taskName.length > 10) {
        this.form.taskName = this.form.taskName.substring(0, 10)
      }
    },
    handleCheckboxChange(val) {        
        let industryName = val[val.length - 1];        
        this.taskIndustryNameList.forEach(item => {
            if (item.dicName == industryName) {
                let limitItem = {
                      id: item.dicVal,
                      industryName: industryName,
                }
                this.priceLimitList.push(limitItem)
                let clone = Object.assign([],this.priceLimitList);
                let unionValue = this.Lodash.unionBy(clone,'id');
                this.priceLimitList = unionValue;
            }
        })
    },
    handleCancel() {
      this.closeDialog(false)
    },
    handleSave() {
      this.$refs.form.validate((valid) => {
          if (valid) {
              if( this.form.endTime0 || this.form.endTime1 ) {
                  if( this.form.endTime0 && this.form.endTime1 ){                      
                      let bridge1 = this.form.endTime1;
                      let bridge2 = this.form.startTime1;
                      bridge1 = bridge1.padEnd(8, ':00');
                      bridge2 = bridge2.padEnd(8, ':00');
                      let end_time = `${this.form.endTime0} ${bridge1}`;
                      let start_time = `${this.form.startTime0} ${bridge2}` ; 
                      if (Date.parse( end_time ) <= Date.parse( start_time )) {
                          return this.$message.error('结束时间必须大于开始时间')
                      }
                  }else{
                      return this.$message.error('结束时间不能为空')
                  }
              }
              this.checkLadderStatus();
              let ladderJudge = this.ladderShilder();
              if( ladderJudge ){
                  this.saveAction()
              }
        } else {
          return this.$message.error('表单填写有误!')
        }
      })
    },
      industryDealSalaryList(){
          let initShazam = '';  
          let obj = {};
          let arr = this.industry.map((item, index) => {
              return this.priceLimitList[index].id
          })
          initShazam = arr.join(',');
          obj.industryList = initShazam;
          return obj;
      },
      formValuationTypeDimension(){
          let getvaluType = this.form.valuationType;
          console.log( 'setPricevaluationType',getvaluType );
          switch( getvaluType ){
              case 1:
                  this.valuationType = 1;//计时  
                  break;
              case 2:
                  if (this.form.mUnit == 1 && this.form.countType == 1) {
                      this.valuationType = 2//固定计量
                      this.qualityUnit = this.form.mWay//计量单位
                  } else if (this.form.mUnit == 1 && this.form.countType == 2) {
                      this.valuationType = 3//阶梯计量
                      this.qualityUnit = this.form.mWay//计量单位
                  } else {
                      this.valuationType = 4//组合计量
                  }
                  break;
              case 3:
                  if (this.form.mUnit == 1 && this.form.countType == 1) {
                      this.valuationType = 5//计时+固定计量
                      this.qualityUnit = this.form.mWay//计量单位
                  } else if (this.form.mUnit == 1 && this.form.countType == 2) {
                      this.valuationType = 6//计时+阶梯计量
                      this.qualityUnit = this.form.mWay//计量单位
                  } else {
                      this.valuationType = 7//计时+组合计量
                  }
                  break;
          }
      },
      measurementSet(){
          let price = {};
          if (this.form.mUnit == 1) {
              price = {
                  unit: this.qualityUnit,
                  valuationType: this.valuationType,
                  settlementType: this.form.settlementType,
                  'price': [{
                        countTime: this.form.valuationType != 2 ? this.form.countTime : '',
                        ladderObj: this.form.countType == 2 ? this.form.ladderObj : [{count: '',unit: ''}],
                        countSettle: this.form.mWay == 1 ? this.form.settleCount : '',
                        countChe: this.form.mWay == 3 ? this.form.settleCount : '',
                        countDun: this.form.mWay == 4 ? this.form.settleCount : '',
                        countDai: this.form.mWay == 2 ? this.form.settleCount : '',
                  }]
              };
          }else{
              price = {
                  unit: this.qualityUnit,
                  valuationType: this.valuationType,
                  settlementType: this.form.settlementType,
                  'price': [{
                      countTime: this.form.valuationType != 2 ? this.form.countTime : '',
                      ladderObj: this.form.countType == 2 ? this.form.ladderObj : [{count: '',unit: ''}],
                      countSettle: this.form.countjian,
                      countChe: this.form.countChe,
                      countDun: this.form.countDun,
                      countDai: this.form.countDai,
                    }]
                }
          }
          return JSON.stringify(price);          
      },
      checkLadderStatus(){
          this.innerLadderFlag = true  // 检查阶梯计价
          if (!this.isEdit) {
              
              if (this.form.valuationType != 1 && this.form.mUnit == 1 && this.form.countType == 2) {
                  if ( !(this.form.ladderObj[this.form.ladderObj.length - 1].overUnit)  ) {
                        this.form.ladderObj.push({
                            overUnit: this.form.overUnit
                        })
                  }
              }
              
              let ladderLength = this.form.ladderObj.length;
              if (ladderLength > 2) {
                    for (let i = 1; i < ladderLength - 1; i++) {
                        if (Number(this.form.ladderObj[i].count) <= Number(this.form.ladderObj[i - 1].count)) {
                            this.innerLadderFlag = false
                            this.form.ladderObj.splice( this.form.ladderObj.length -1 )
                            return this.$message.error('请检查阶梯件数！')
                        }
                    }
              }
              
              if (!this.innerLadderFlag) {
                  return
              }
          }
                // 计时
          if (this.form.valuationType == 1) {
              this.form.ladderObj = [{count: '',unit: ''}];
              this.form.countSettle = '';
              this.form.overUnit = '';
              this.form.countjian = '';
              this.form.countChe = '';
              this.form.countDun = '';
              this.form.countDai = '';
          }
      // 计量 单一计量
          if (this.form.mUnit == 1 && this.form.countType == 1) {
              this.form.overUnit = '';
              this.form.countjian = '';
              this.form.countChe = '';
              this.form.countDun = '';
              this.form.countDai = '';
              this.form.ladderObj = [{count: '',unit: ''}];
          }
          if (this.form.mUnit == 1 && this.form.countType == 2) {
              this.form.countjian = '';
              this.form.countChe = '';
              this.form.countDun = '';
              this.form.countDai = '';
              this.form.settleCount = '';
          }        
          if (this.form.mUnit == 2) {
              this.form.overUnit = '';
              this.form.ladderObj = [{count: '',unit: ''}];
              this.form.settleCount = '';
          }
      },
      ladderShilder(){
          if( this.innerLadderFlag ){
              return true;
          }else{
              return false;
          }
      },
      setPrice(){
          let price = {};
          this.formValuationTypeDimension();          
          let res = this.measurementSet();
          price.price = res;
          return price;
      },
      setTimePars(){
          let par = {};
             if ((this.form.endTime0) && (this.form.endTime1)) {
              let endTime1 = this.form.endTime1;
              endTime1 = endTime1.padEnd(8, ':00');
              par.endTime = `${this.form.endTime0} ${endTime1}`;
          }else{
              par.endTime = '';
          }
          if (this.form.startTime0 && this.form.startTime1) {
              let startTime1 = this.form.startTime1;
              startTime1 = startTime1.padEnd(8, ':00');
              par.startTime = `${this.form.startTime0} ${startTime1}`;
          }
          par.workStartTime = this.form.workStartTime.padEnd(8, ':00');
          par.workEndTime = this.form.workEndTime.padEnd(8, ':00');       
          console.log( 'par',par );
          return par;
      },
    saveAction() {      
      // 表单校验
      if (this.form.endWorkType == 1) {
        if (this.form.workEndTime < this.form.workStartTime) {
          return this.$message.error('下班时间不能早于上班时间')
        }
      }
      if(this.form.countjian == 0){
       /* return this.$message.error('单价不能为0') 逻辑不通*/
      }   
        
        let pInitaram = {};        
        let indusrtyObj = this.industryDealSalaryList(); 
        let priceParam = this.setPrice();
        let timerParam = this.setTimePars();
        let pickArr = [  
            { name : 'taskName' , transNumber : false },
            { name : 'taskType' , transNumber : true },
            { name : 'settlementType' , transNumber : true },
            { name : 'authorizedNumber' , transNumber : true },
            { name : 'endWorkType' , transNumber : true },
            { name : 'workingPlace' , transNumber : false },
            { name : 'longitude' , transNumber : true },
            { name : 'latitude' , transNumber : true },
            { name : 'ageUpperLimit' , transNumber : true },
            { name : 'ageLowerLimit' , transNumber : true },
            { name : 'otherDemand' , transNumber : false },
            { name : 'outsourcingCusId' , transNumber : true },
        ];
        pickArr.forEach(ele=>{  
            if( (toString.call(this.form[ele.name]) === '[object Null]') || (toString.call(this.form[ele.name]) === '[object Undefined]') ){
                pInitaram[ele.name] = '';
            }else{
                if( ele.transNumber ){
                    pInitaram[ele.name] = Number(this.form[ele.name]);
                }else{
                    pInitaram[ele.name] = this.form[ele.name];
                }
            }
        });
      
      // loading状态
      this.globalLoading = this.$loading({
        lock: true,
        text: '处理中...',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
        Object.assign( pInitaram,indusrtyObj );
        Object.assign( pInitaram,timerParam );
        if(  !this.storeBelongToObj  ){
            let tempObj = {
                belongToName:this.form.belongTo.split(',')[1],
            }
            this.trackBelongToInfo(tempObj);            
        }
        Object.assign( pInitaram,this.storeBelongToObj );
        
        pInitaram.valuationType = this.valuationType;
        let forNewStage = Object.assign( {},pInitaram );
        let newParam = Object.assign( forNewStage,priceParam );
        
        let forUpdateStage = Object.assign( {},pInitaram );        
        let updateParam = Object.assign( {},pInitaram );
        updateParam.id = this.form.assignmentInfoId;
        
        delete updateParam.taskName;
        delete updateParam.taskType;
        delete updateParam.settlementType;
        delete updateParam.startTime;
        delete updateParam.valuationType;   
        delete updateParam.outsourcingCusId; 
        
        if( this.form.taskType == 3 ){
            newParam.partnerId = this.form.selectManager;
            updateParam.partnerId = this.form.selectManager;
        }
       newParam.cusAuthorizedNumber = newParam.authorizedNumber;
        let forOutIndex =  this.outSourceingLists.findIndex(ele=>{
            return ele.id === this.form.outsourcingCusId;
        });
        newParam.outsourcingCusName = this.outSourceingLists[forOutIndex].shortName;        
       updateParam.cusAuthorizedNumber = updateParam.authorizedNumber;        
      if (this.isEdit) {
          this.updateThisTask(updateParam);
      } else {
          this.addNewTask(newParam);
      }
    },
      updateThisTask( params ){ 
          this.$api.assignUpdateTask(params).then(res => {
              let { data:layer1 } = res;
              let { respCode } = layer1;
              if( respCode === 0 ){
                  this.$message.success('编辑任务成功')
                  this.closeDialog(true)
              }              
          }).catch(err => {
              console.log( 'err',err );
          }).finally(() => {
              this.globalLoading.close()
          })
      },
      addNewTask( params ){
          this.$api.assignAddTask(params).then(res => {
              if (res.data.respCode == 0) {
                  this.$message.success('添加任务成功')
                  this.closeDialog(true)
              }
          }).catch(err => {
              console.log( 'err',err );
          }).finally(() => {
              this.globalLoading.close()
          })
      },
      handleClose() {
          this.addTaskVisible = false;
          this.closeDialog(false);
      },
      closeDialog(reload) { // reload是否重新获取列表
          this.$emit('closeDialog', reload)
      },    
      getSkill() {
          let params = {
            code: 'industry',
            level: 2
          }
          this.$api.GetAllTags(params).then(res => {
              this.taskIndustryNameList = res.data
          }).catch(err => {
              console.log(err);
          });
      },
    addLadder() {
        let objShort = this.form.ladderObj;
        if (objShort[objShort.length - 1].count && objShort[objShort.length - 1].unit) {
            this.form.ladderObj.push({
                count: "",
                unit: "",
            });
            if (objShort.length >= 3) {
                console.log(objShort);
                if (objShort[objShort.length - 3].count >= objShort[objShort.length - 2].count) {
                    this.form.ladderObj.splice(objShort.length-1);
                    this.$message.error('请检查阶梯件数')
                }
            }
        } else {            
            this.$message.error('请填写完整');            
        }
    },
    deleteLadder(index) {
        this.form.ladderObj.splice(index, 1);
    },
    infohtmlset(location) {
        this.form.workingPlace = `${location.city}${location.address}${location.title}`;
        this.form.latitude = location.point.lat;
        this.form.longitude = location.point.lng;
        this.mapDia = false
    },
    viewMap() {
        this.mapDia = true 
//        if(this.form.workingPlace){
//            this.mapDia = false;
//        }else{
//            this.mapDia = true;
//        }
    },
    getCurrentDate() {
      var now = new Date();
      var hour = now.getHours();//得到小时
      var minu = now.getMinutes();//得到分钟
      hour.padStart(2, '0')
      minu.padStart(2, '0')
      let time = ""
      time = hour + ":" + minu
      return time
    },
  }
}
</script>
<style lang="scss" scoped>
    .addTaskDialogCon {
        .selectManagerSubCon {
            display: flex;
            justify-content: flex-start;
            align-content: center;
            align-items: center;
        }
        .limitWidthText {
            width: 70%;
        }
        .bindSelectInfoText {
            height: 40px;
            line-height: 40px;
            margin-left: 20px;
        }
        .bindText {
            color: #e84518;
            cursor: pointer;
        }
        .startTimeStyleCon {
            width: 330px;
        }
        .delIconImg {
            width: 15px;
            cursor: pointer;
            vertical-align: -2px;
        }      
        .fourTextInput {
            margin-right: 7px;
        }
        .ladderlimitWidth {
            .ladderFourItemCon {
                width: 100%;
                display: flex;
                flex-wrap: nowrap;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
            }
            .divideWidth {
                display: flex;
                flex-wrap: nowrap;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
                .divideWidthText {
                    margin-left: 7px;
                    height: 36px;
                    line-height: 36px;
                    margin-bottom: 22px;
                }
            }
        }
        .workStartTimeStyleCon {
            width: 330px;
        }
        .workEndTimeStyleCon {
            width: 330px;
        }
        .commonFlex {
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            align-content: center;
            align-items: center;
        }
        .textStyle {
            width: 330px;
        }
        .countTimeText {
            margin-left: 10px;
        }
        .innerSpeSet {
            margin-right: 10px;
        }
    }
</style>
<style lang="scss">
    .addTaskDialogCon {
        .el-dialog__header {
            font-size: 16px;
            text-align: left;
        }        
        .form-tip {
            font-size: 12px;
            line-height: 1.5;
        }
        .el-input {
            width: 330px;
        }
        .el-date-editor {
            width: 155px;
        }
        .short-input {
            width: 150px;
        }
        .level-input {
            .el-form-item__content {
              margin-left: 75px !important;
            }
        }
        .day-select .el-input {
            width: 100%;
        }
        .setting-table .el-input {
            width: 100%;
        }
        .setting-table th:nth-of-type(1) {
            width: 100px;
            text-align: left;
        }
        .setting-table th {
            width: 100px;
        }
        .industry-name {
            text-align: left;
            color: #e84518;
        }
        .dialog-btn {
            text-align: center;
        }
        .is_required {
            position: relative;
            &::before {
              content: '*';
              position: absolute;
              color: #f00;
              left: 110px;
              top: 10px;
            }
        }
        .limit_required::before {
            left: 55px;
        }
        .el-form-item__label {
            line-height: 36px;
        }
        .controlSelect {
            width: 180px !important;
            .el-input__inner {
                width: 100% !important;
            }
            .el-input {
                width: 100% !important;
            }
        }
        .startTimeStyleCon {
            .el-form-item {
                width: 100%;
                .el-form-item__content {
                    display: flex;
                    flex-direction: row;
                    justify-content:space-between;
                    align-content: center;
                    align-items: center;
                }
            }
        }
        .countTimeInitStyle {
            display: flex;
            flex-direction: row;
            justify-content:flex-start;
            align-content: center;
            align-items: center;
        }
        .ageRequired {
            .ageText {
                margin-right: 10px;
            }
            .el-form-item__content {
                display: flex;
                flex-direction: row;
                justify-content:flex-start;
                align-content: center;
                align-items: center;
                .short-input {
                    width: 140px;
                    margin-right: 10px;
                }
            }
        }
        .belongToItem, .valuationTypeItem, .measureUnitItem, .measureUnitStyle{
            .el-input__inner {
                width: 330px !important;
            }
            .el-input {
                width: 330px !important;
            }
            .el-select {
                width: 330px !important;
            }
        }
        .removeSecondEffect {
            .el-form-item {
                margin-left: 7px !important;
            }
            .el-form-item__content {
                margin-left: 0 !important;
            }
        }
          .innerSingleStyle {
              width: 234px;
              margin-right: 7px;
        }
    }
</style>