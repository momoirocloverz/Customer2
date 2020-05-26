<template>
  <div class="getOverHere1 back-white table-content">
      
      <el-dialog class="resetDialog" title="提示" :visible.sync="centerDialogVisible"  width="400px" center>
          <span>确认排班<span class="infoMark">{{checkObj.name}}</span>通过审核</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click="centerDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="confirmPass">确 定</el-button>
          </span>
        </el-dialog>
      
      <div class="checkStatusCon">
          <span>审核状态：<span>{{statusTextObj[checkStatus]}}</span></span>
          <div class="checkActionBtn" v-show="shouldPriceCheck == '1'"   @click="checkAction"><el-button class="resetBtnStyle">审核</el-button></div>
          <div class="describeText">排班单价需审核，审核通过后才能零工结算确认，可在班务中关闭审核要求</div>
        </div>
    <div>
      <h3 class="table-title">基本信息</h3>
      <table class="setting-info-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="header">
            <th width="10%">工种</th>
            <th width="10%">上班时间</th>
            <th width="10%">下班时间</th>
            <th width="15%">结算方式</th>
            <th width="15%">性别</th>
            <th width="40%">报酬设置</th>
          </tr>
        </thead>

        <tbody v-for="(item,index) in form" :key="index">
          <tr>
<!--            <td rowspan="6">{{item.industryName}}</td>-->
              
              <td rowspan="6">
                  <div>{{item.industryName}}</div>
                  <div class="editPop" @click="editPopAct(item)">修改</div>
                </td>
              
            <td rowspan="6">{{item.workStartTime | formatTimeString}}</td>
            <td rowspan="6">{{item.endWorkType == 2 ? '次日' : '当日'}}{{item.workEndTime | formatTimeString}}</td>
            <td rowspan="2">{{salary[index][0].settlementType | formatSettle}}
              <span class="setting-tag" v-if="salary[index][0].valuationType == 1">计时</span>
              <span class="setting-tag" v-if="salary[index][0].valuationType == 8">日固定</span>
              <span class="setting-tag" v-if="salary[index][0].valuationType == 2 || salary[index][0].valuationType == 3 || salary[index][0].valuationType == 4">计量</span>
              <span class="setting-tag" v-if="salary[index][0].valuationType == 5 || salary[index][0].valuationType == 6 || salary[index][0].valuationType == 7">计时+计量</span>
            </td>
            <td>
              {{salary[index][0].price[0].sex == 1 ? '男' : '女'}}

            </td>
            <td>
              <!-- 计时 1-->
              <br />
              <span v-if="salary[index][0].valuationType ==1 || salary[index][0].valuationType ==6 || salary[index][0].valuationType == 5 || salary[index][0].valuationType == 7">{{salary[index][0].price[0].countTime}}元/小时<br /></span>
              <!-- 阶梯 -->
              <span v-if="(salary[index][0].valuationType ==6 || salary[index][0].valuationType ==3) && i == 0" v-for="(data,i) in salary[index][0].price[0].ladderObj">{{data.count}}{{salary[index][0].unit | formatType}}以下(含)， {{data.unit}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <span v-if="(salary[index][0].valuationType ==6 || salary[index][0].valuationType ==3) && i != 0 && i != salary[index][0].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[0].ladderObj">{{Number(salary[index][0].price[0].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}{{salary[index][0].unit | formatType}}(含)， {{data.unit}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <span v-if="(salary[index][0].valuationType ==6 || salary[index][0].valuationType ==3) && i == salary[index][0].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[0].ladderObj">{{salary[index][0].price[0].ladderObj[i-1].count}}{{salary[index][0].unit | formatType}}以上， {{data.overUnit}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <!-- 计量 -->
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 2">{{salary[index][0].price[0].countDai}}元/{{salary[index][0].unit | formatType}}<br /></span>
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 1">{{salary[index][0].price[0].countSettle}}元/{{salary[index][0].unit | formatType}}<br /></span>
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 3">{{salary[index][0].price[0].countChe}}元/{{salary[index][0].unit | formatType}}<br /></span>
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 4">{{salary[index][0].price[0].countDun}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <!-- 组合 -->
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[0].countSettle">{{salary[index][0].price[0].countSettle}}元/件<br /></span>
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[0].countDai">{{salary[index][0].price[0].countDai}}元/袋<br /></span>
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[0].countChe">{{salary[index][0].price[0].countChe}}元/车<br /></span>
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[0].countDun">{{salary[index][0].price[0].countDun}}元/吨<br /></span>

              <!--日固定-->
              <span v-if="salary[index][0].valuationType == 8">{{salary[index][0].price[0].countFixed || 0}}元/天<br /></span>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              {{salary[index][0].price[1].sex == 1 ? '男' : '女'}}
            </td>
            <!-- <td rowspan="4">{{item.workStartTime | formatTimeString}}</td>
                    <td rowspan="4">{{item.endWorkType == 2 ? '次日' : '当日'}}{{item.workEndTime | formatTimeString}}</td> -->
            <td>
              <!-- 计时 2-->
              <br />
              <span v-if="salary[index][0].valuationType ==1 || salary[index][0].valuationType ==6 || salary[index][0].valuationType == 5 || salary[index][0].valuationType == 7">{{salary[index][0].price[1].countTime}}元/小时<br /></span>
              <!-- 阶梯 -->
              <span v-if="(salary[index][0].valuationType ==6 || salary[index][0].valuationType ==3) && i == 0" v-for="(data,i) in salary[index][0].price[1].ladderObj">{{data.count}}{{salary[index][0].unit | formatType}}以下(含)， {{data.unit}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <span v-if="(salary[index][0].valuationType ==6 || salary[index][0].valuationType ==3) && i != 0 && i != salary[index][0].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[1].ladderObj">{{Number(salary[index][0].price[1].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}{{salary[index][0].unit | formatType}}(含)， {{data.unit}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <span v-if="(salary[index][0].valuationType ==6 || salary[index][0].valuationType ==3) && i == salary[index][0].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][0].price[1].ladderObj">{{salary[index][0].price[1].ladderObj[i-1].count}}{{salary[index][0].unit | formatType}}以上， {{data.overUnit}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <!-- 计量 -->
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 2">{{salary[index][0].price[1].countDai}}元/{{salary[index][0].unit | formatType}}<br /></span>
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 1">{{salary[index][0].price[1].countSettle}}元/{{salary[index][0].unit | formatType}}<br /></span>
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 3">{{salary[index][0].price[1].countChe}}元/{{salary[index][0].unit | formatType}}<br /></span>
              <span v-if="(salary[index][0].valuationType == 2 || salary[index][0].valuationType == 5) && salary[index][0].unit == 4">{{salary[index][0].price[1].countDun}}元/{{salary[index][0].unit | formatType}}<br /></span>

              <!-- 组合 -->
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[1].countSettle">{{salary[index][0].price[1].countSettle}}元/件<br /></span>
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[1].countDai">{{salary[index][0].price[1].countDai}}元/袋<br /></span>
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[1].countChe">{{salary[index][0].price[1].countChe}}元/车<br /></span>
              <span v-if="(salary[index][0].valuationType == 4 || salary[index][0].valuationType == 7) && salary[index][0].price[1].countDun">{{salary[index][0].price[1].countDun}}元/吨<br /></span>

              <!--日固定-->
              <span v-if="salary[index][0].valuationType == 8">{{salary[index][0].price[1].countFixed || 0}}元/天<br /></span>
              <br />
            </td>
          </tr>
          <tr>
            <td rowspan="2">{{salary[index][1].settlementType | formatSettle}}
              <span class="setting-tag" v-if="salary[index][1].valuationType == 1">计时</span>
              <span class="setting-tag" v-if="salary[index][1].valuationType == 8">日固定</span>
              <span class="setting-tag" v-if="salary[index][1].valuationType == 2 || salary[index][1].valuationType == 3 || salary[index][1].valuationType == 4">计量</span>
              <span class="setting-tag" v-if="salary[index][1].valuationType == 5 || salary[index][1].valuationType == 6 || salary[index][1].valuationType == 7">计时+计量</span>
            </td>
            <td>
              {{salary[index][1].price[0].sex == 1 ? '男' : '女'}}

            </td>
            <td>
              <!-- 计时3 -->
              <br />
              <span v-if="salary[index][1].valuationType ==1 || salary[index][1].valuationType ==6 || salary[index][1].valuationType == 5 || salary[index][1].valuationType == 7">{{salary[index][1].price[0].countTime}}元/小时<br /></span>
              <!-- 阶梯 -->
              <span v-if="(salary[index][1].valuationType ==6 || salary[index][1].valuationType ==3) && i == 0" v-for="(data,i) in salary[index][1].price[0].ladderObj">{{data.count}}{{salary[index][1].unit | formatType}}以下(含)， {{data.unit}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <span v-if="(salary[index][1].valuationType ==6 || salary[index][1].valuationType ==3) && i != 0 && i != salary[index][1].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[0].ladderObj">{{Number(salary[index][1].price[0].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}{{salary[index][1].unit | formatType}}(含)， {{data.unit}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <span v-if="(salary[index][1].valuationType ==6 || salary[index][1].valuationType ==3) && i == salary[index][1].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[0].ladderObj">{{salary[index][1].price[0].ladderObj[i-1].count}}{{salary[index][1].unit | formatType}}以上， {{data.overUnit}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <!-- 计量 -->
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 2">{{salary[index][1].price[0].countDai}}元/{{salary[index][1].unit | formatType}}<br /></span>
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 1">{{salary[index][1].price[0].countSettle}}元/{{salary[index][1].unit | formatType}}<br /></span>
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 3">{{salary[index][1].price[0].countChe}}元/{{salary[index][1].unit | formatType}}<br /></span>
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 4">{{salary[index][1].price[0].countDun}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <!-- 组合 -->
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[0].countSettle">{{salary[index][1].price[0].countSettle}}元/件<br /></span>
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[0].countDai">{{salary[index][1].price[0].countDai}}元/袋<br /></span>
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[0].countChe">{{salary[index][1].price[0].countChe}}元/车<br /></span>
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[0].countDun">{{salary[index][1].price[0].countDun}}元/吨<br /></span>
              <!--日固定-->
              <span v-if="salary[index][1].valuationType == 8">{{salary[index][1].price[0].countFixed || 0}}元/天<br /></span>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              {{salary[index][1].price[1].sex == 1 ? '男' : '女'}}
            </td>
            <td>
              <!-- 计时4 -->
              <br />
              <span v-if="salary[index][1].valuationType ==1 || salary[index][1].valuationType ==6 || salary[index][1].valuationType == 5 || salary[index][1].valuationType == 7">{{salary[index][1].price[1].countTime}}元/小时<br /></span>
              <!-- 阶梯 -->
              <span v-if="(salary[index][1].valuationType ==6 || salary[index][1].valuationType ==3) && i == 0" v-for="(data,i) in salary[index][1].price[1].ladderObj">{{data.count}}{{salary[index][1].unit | formatType}}以下(含)， {{data.unit}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <span v-if="(salary[index][1].valuationType ==6 || salary[index][1].valuationType ==3) && i != 0 && i != salary[index][1].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[1].ladderObj">{{Number(salary[index][1].price[1].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}{{salary[index][1].unit | formatType}}(含)， {{data.unit}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <span v-if="(salary[index][1].valuationType ==6 || salary[index][1].valuationType ==3) && i == salary[index][1].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][1].price[1].ladderObj">{{salary[index][1].price[1].ladderObj[i-1].count}}{{salary[index][1].unit | formatType}}以上， {{data.overUnit}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <!-- 计量 -->
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 2">{{salary[index][1].price[1].countDai}}元/{{salary[index][1].unit | formatType}}<br /></span>
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 1">{{salary[index][1].price[1].countSettle}}元/{{salary[index][1].unit | formatType}}<br /></span>
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 3">{{salary[index][1].price[1].countChe}}元/{{salary[index][1].unit | formatType}}<br /></span>
              <span v-if="(salary[index][1].valuationType == 2 || salary[index][1].valuationType == 5) && salary[index][1].unit == 4">{{salary[index][1].price[1].countDun}}元/{{salary[index][1].unit | formatType}}<br /></span>

              <!-- 组合 -->
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[1].countSettle">{{salary[index][1].price[1].countSettle}}元/件<br /></span>
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[1].countDai">{{salary[index][1].price[1].countDai}}元/袋<br /></span>
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[1].countChe">{{salary[index][1].price[1].countChe}}元/车<br /></span>
              <span v-if="(salary[index][1].valuationType == 4 || salary[index][1].valuationType == 7) && salary[index][1].price[1].countDun">{{salary[index][1].price[1].countDun}}元/吨<br /></span>

              <!--日固定-->
              <span v-if="salary[index][1].valuationType == 8">{{salary[index][1].price[1].countFixed || 0}}元/天<br /></span>
              <br />
            </td>
          </tr>
          <tr>
            <td rowspan="2">{{salary[index][2].settlementType | formatSettle}}
              <span class="setting-tag" v-if="salary[index][2].valuationType == 1">计时</span>
              <span class="setting-tag" v-if="salary[index][2].valuationType == 8">日固定</span>
              <span class="setting-tag" v-if="salary[index][2].valuationType == 2 || salary[index][2].valuationType == 3 || salary[index][2].valuationType == 4">计量</span>
              <span class="setting-tag" v-if="salary[index][2].valuationType == 5 || salary[index][2].valuationType == 6 || salary[index][2].valuationType == 7">计时+计量</span>
            </td>
            <td>
              {{salary[index][2].price[0].sex == 1 ? '男' : '女'}}

            </td>
            <td>
              <!-- 计时3 -->
              <br />
              <span v-if="salary[index][2].valuationType ==1 || salary[index][2].valuationType ==6 || salary[index][2].valuationType == 5 || salary[index][2].valuationType == 7">{{salary[index][2].price[0].countTime}}元/小时<br /></span>
              <!-- 阶梯 -->
              <span v-if="(salary[index][2].valuationType ==6 || salary[index][2].valuationType ==3) && i == 0" v-for="(data,i) in salary[index][2].price[0].ladderObj">{{data.count}}{{salary[index][2].unit | formatType}}以下(含)， {{data.unit}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <span v-if="(salary[index][2].valuationType ==6 || salary[index][2].valuationType ==3) && i != 0 && i != salary[index][2].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][2].price[0].ladderObj">{{Number(salary[index][2].price[0].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}{{salary[index][2].unit | formatType}}(含)， {{data.unit}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <span v-if="(salary[index][2].valuationType ==6 || salary[index][2].valuationType ==3) && i == salary[index][2].price[0].ladderObj.length - 1" v-for="(data,i) in salary[index][2].price[0].ladderObj">{{salary[index][2].price[0].ladderObj[i-1].count}}{{salary[index][2].unit | formatType}}以上， {{data.overUnit}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <!-- 计量 -->
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 2">{{salary[index][2].price[0].countDai}}元/{{salary[index][2].unit | formatType}}<br /></span>
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 1">{{salary[index][2].price[0].countSettle}}元/{{salary[index][2].unit | formatType}}<br /></span>
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 3">{{salary[index][2].price[0].countChe}}元/{{salary[index][2].unit | formatType}}<br /></span>
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 4">{{salary[index][2].price[0].countDun}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <!-- 组合 -->
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[0].countSettle">{{salary[index][2].price[0].countSettle}}元/件<br /></span>
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[0].countDai">{{salary[index][2].price[0].countDai}}元/袋<br /></span>
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[0].countChe">{{salary[index][2].price[0].countChe}}元/车<br /></span>
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[0].countDun">{{salary[index][2].price[0].countDun}}元/吨<br /></span>
              <!--日固定-->
              <span v-if="salary[index][2].valuationType == 8">{{salary[index][2].price[0].countFixed || 0}}元/天<br /></span>
              <br />
            </td>
          </tr>
          <tr>
            <td>
              {{salary[index][2].price[1].sex == 1 ? '男' : '女'}}
            </td>
            <td>
              <!-- 计时4 -->
              <br />
              <span v-if="salary[index][2].valuationType ==1 || salary[index][2].valuationType ==6 || salary[index][2].valuationType == 5 || salary[index][2].valuationType == 7">{{salary[index][2].price[1].countTime}}元/小时<br /></span>
              <!-- 阶梯 -->
              <span v-if="(salary[index][2].valuationType ==6 || salary[index][2].valuationType ==3) && i == 0" v-for="(data,i) in salary[index][2].price[1].ladderObj">{{data.count}}{{salary[index][2].unit | formatType}}以下(含)， {{data.unit}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <span v-if="(salary[index][2].valuationType ==6 || salary[index][2].valuationType ==3) && i != 0 && i != salary[index][2].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][2].price[1].ladderObj">{{Number(salary[index][2].price[1].ladderObj[i-1].count) + 1}} - {{Number(data.count)}}{{salary[index][2].unit | formatType}}(含)， {{data.unit}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <span v-if="(salary[index][2].valuationType ==6 || salary[index][2].valuationType ==3) && i == salary[index][2].price[1].ladderObj.length - 1" v-for="(data,i) in salary[index][2].price[1].ladderObj">{{salary[index][2].price[1].ladderObj[i-1].count}}{{salary[index][2].unit | formatType}}以上， {{data.overUnit}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <!-- 计量 -->
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 2">{{salary[index][2].price[1].countDai}}元/{{salary[index][2].unit | formatType}}<br /></span>
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 1">{{salary[index][2].price[1].countSettle}}元/{{salary[index][2].unit | formatType}}<br /></span>
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 3">{{salary[index][2].price[1].countChe}}元/{{salary[index][2].unit | formatType}}<br /></span>
              <span v-if="(salary[index][2].valuationType == 2 || salary[index][2].valuationType == 5) && salary[index][2].unit == 4">{{salary[index][2].price[1].countDun}}元/{{salary[index][2].unit | formatType}}<br /></span>

              <!-- 组合 -->
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[1].countSettle">{{salary[index][2].price[1].countSettle}}元/件<br /></span>
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[1].countDai">{{salary[index][2].price[1].countDai}}元/袋<br /></span>
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[1].countChe">{{salary[index][2].price[1].countChe}}元/车<br /></span>
              <span v-if="(salary[index][2].valuationType == 4 || salary[index][2].valuationType == 7) && salary[index][2].price[1].countDun">{{salary[index][2].price[1].countDun}}元/吨<br /></span>

              <!--日固定-->
              <span v-if="salary[index][2].valuationType == 8">{{salary[index][2].price[1].countFixed || 0}}元/天<br /></span>
              <br />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
      <el-dialog class="editPriceCon" title="修改零工报酬" :visible.sync="showEdit" width="700px">
          <priceSet v-if="showEdit" :info="propForChild" @confirmAdjust="refreshNow" @cancelAdjust="quitNow"></priceSet>
        </el-dialog>
  </div>
</template>

<script>
    import priceSet from '@/views/customer/schedule/components/priceSet.vue'
export default {
  name: "hsd",
    props:{
        refreshTrigger:Function
    },
    components:{
        priceSet
    },
  data() {
    return {
      form: [],
      visible: false,
      salary: [],
        shouldPriceCheck:2,
         checkStatus:1,
        statusTextObj:{
            1:'已审核',
            2:'待审核',
            3:'不需要审核'
        },
        centerDialogVisible:false,
        checkObj:{},
        showEdit:false,
        propForChild:{},
    }
  },
  filters: {
    formatTimeString(val) {
      if (val) {
        return val.substring(0, 5)
      }
    },
    formatType(val) {
      if (val == 1) {
        return '件'
      } else if (val == 2) {
        return '袋'
      } else if (val == 3) {
        return '车'
      } else {
        return '吨'
      }
    },
    formatSettle(val) {
      if (val == 1) {
        return '日结'
      } else if (val == 2) {
        return '月结'
      } else if (val == 4) {
        return '周结'
      } else {
        return ''
      }
    },
  },
    mounted() {
        this.getaskSalaryList()
        this.getCheckStatus();
    },
    methods: {
        refreshNow(){
            this.showEdit = false;            
            this.$emit('refreshTrigger');
        },
        quitNow(){
            console.log('quit')
            this.showEdit = false;
        },
        editPopAct(item){
            this.showEdit = true;
            this.propForChild = item;
        },
        confirmPass(){
            let params = {
                    schedulingId: this.checkObj.id,
                }
                this.$api.schedulingCheckAction(params).then(res => {
                    let { data:layer1 } = res;
                    let { respCode } = layer1;
                    if( respCode === 0 ){
                        this.$message({
                          message: '审核成功',
                          type: 'success'
                        });
                        this.centerDialogVisible = false;
                        this.getCheckStatus();
                    }
                }).catch(err=>{
                    console.log('err',err);
                })
          },
      checkAction(){
          this.checkObj = this.$route.query;
          this.centerDialogVisible = true;
      },
      getCheckStatus(){
          let params = {
              id: this.$route.query.id
          }
          this.$api.schedulingDetailLite(params).then((res) => {
              let { data,respCode } = res;
              if( respCode === 0 ){
                  this.shouldPriceCheck = data.shouldPriceCheck;
                  if( data.needPriceCheck == 1 ){
                      this.checkStatus = data.priceCheckStatus;
                  }else{
                      this.checkStatus = 3;
                  }  
              }
          }).catch((err) => {
              console.log('err',err);
          });
      },
    getaskSalaryList() {
      const params = {
        id: this.$route.query.id,
      }
      this.$api.scheduleSetting(params).then((response) => {
        if (response.respCode == 0) {
          this.form = response.data
          for (let i in this.form) {
            let list = JSON.parse(this.form[i].salary);
            let item = {};
            if(list.length == 2){
                item = list[1]
                item['settlementType'] = 4;
                list.push(item)
            }
            this.salary.push(list)
          }
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  }
}
</script>
<style scoped lang="scss">
    .editPop {
        color: #e84518;
        cursor: pointer;
    }
    .checkStatusCon {
        margin-bottom: 20px;
        font-size: 14px;
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        .checkActionBtn {
            margin-left: 20px;
        }
        .resetBtnStyle {
            color: #E9481C;
            background-color: #FFEFEA;
            border-color: #F7BEB2;
            border-radius: 2px;
          }
        .describeText {
            margin-left: 20px;
            color: #999;
        }
    }
.table-content {
  border-top: 10px solid #f5f5f7;
  padding: 20px;
}
table {
  border-right: solid 1px #e4e4e4;
  border-bottom: solid 1px #e4e4e4;
  font-size: 14px;
}
td {
  border-left: solid 1px #e4e4e4;
  border-top: solid 1px #e4e4e4;
}
th {
  border-left: 1px solid #e4e4e4;
  border-top: 1px solid #e4e4e4;
  line-height: 46px;
  background-color: #f5f5fa;
}
.header {
  background-color: #f6f6f6;
  font-family: MicrosoftYaHei;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #262626;
}
.header td {
  height: 40px;
}
.setting-info-table {
  width: 100%;
  text-align: center;
}
.setting-padding {
  padding: 13px 33px;
}
.setting-salary {
  height: 100%;
  text-align: left;
}
.setting-label {
  font-family: PingFang-SC-Medium;
  font-size: 16px;
  color: #0d0d0d;
  display: inline-block;
}
.setting-tag {
  border-radius: 8px;
  border: solid 1px #e84518;
  font-family: PingFang-SC-Medium;
  font-size: 12px;
  letter-spacing: 0px;
  color: #e84518;
  padding: 4px 5px;
}
.tag-group {
  margin-bottom: 15px;
}
.setting-salary-table {
  height: 42px;
  border: solid 1px #e4e4e4;
  vertical-align: middle;
  padding: 0 30px;
}
.setting-salary-table + .setting-salary-table {
  border-top: none;
}
.setting-salary-label {
  font-family: PingFang-SC-Regular;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  letter-spacing: 0px;
  color: #0d0d0d;
  line-height: 42px;
  float: left;
}
.setting-salary-value {
  font-family: PingFang-SC-Medium;
  font-size: 12px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 42px;
  letter-spacing: 0px;
  color: #636363;
  float: right;
}
</style>
<style lang="scss">
    .getOverHere1 {
        .resetDialog {
            .el-dialog {
                margin: auto !important;
                left: 0;
                right: 0;
                bottom: 0;
                top: 0;
                position: absolute;
                height: 190px;
            }
        }
    }    
</style>