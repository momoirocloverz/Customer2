<template>
  <div class="getOverHere1 back-white table-content">
      <table class="setting-info-table" cellspacing="0" cellpadding="0">
        <thead>
          <tr class="header">
            <th width="10%">工种</th>
            <th width="15%">结算方式</th>
            <th width="15%">性别</th>
            <th width="40%">报酬设置</th>
          </tr>
        </thead>

        <tbody v-for="(item,index) in form" :key="index">
          <tr>
            <td rowspan="6">{{item.industryName}}</td>
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
      salary: [],
        checkStatus:1,
        centerDialogVisible:false,
        checkObj:{},
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
  },
    mounted() {
        this.getaskSalaryList()
    },
    methods: {
      checkAction(){
          this.checkObj = this.$route.query;
          this.centerDialogVisible = true;
      },
    getaskSalaryList() {
      const params = {
        id: this.$route.query.receiveMId,
      }
      this.$api.viewSetting(params).then((response) => {
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
    handleWrapperClick() {
      this.visible = false
    },
  }
}
</script>

<style scoped lang="scss">
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
  /* height: 140px; */
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
  /* margin-left: 17px; */
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