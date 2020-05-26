<template>
  <div>
    <div style="margin-top: 40px">
      <table class="setting-info-table" cellspacing="0" cellpadding="0">
        <tr class="header">
          <td width="15%">工种</td>
          <td width="20%">结算方式</td>
          <td width="20%">性别</td>
          <td width="45%">报酬设置</td>
        </tr>
        <tr v-if="!form || form.length<1">
          <td colspan="4">暂无班务设置信息</td>
        </tr>
        <tbody v-if="form && form.length >= 1" v-for="(item,index) in form">
        <tr>
          <td rowspan="6">{{item.industryName}}</td>
          <td rowspan="2">{{salary[index][0].settlementType | formatSettle}} <span class="tag">{{salary[index][0].valuationType | valuationTypeFilter}}</span> </td>
          <td>{{salary[index][0].price[0].sex == 1 ? '男' : '女'}}</td>
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
          <td>{{salary[index][0].price[1].sex == 1 ? '男' : '女'}}</td>
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
          <td rowspan="2">{{salary[index][1].settlementType | formatSettle}}<span class="tag">{{salary[index][0].valuationType | valuationTypeFilter}}</span></td>
          <td>{{salary[index][1].price[0].sex == 1 ? '男' : '女'}}</td>
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
          <td>{{salary[index][1].price[1].sex == 1 ? '男' : '女'}}</td>
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
          <td rowspan="2">{{salary[index][2].settlementType | formatSettle}}<span class="tag">{{salary[index][0].valuationType | valuationTypeFilter}}</span></td>
          <td>{{salary[index][2].price[0].sex == 1 ? '男' : '女'}}</td>
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
            <span v-if="salary[index][2].valuationType == 8">{{salary[index][1].price[0].countFixed || 0}}元/天<br /></span>
            <br />
          </td>
        </tr>
        <tr>
          <td>{{salary[index][2].price[1].sex == 1 ? '男' : '女'}}</td>
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
  </div>
</template>

<script>

  export default {
    name: "reword",
    data() {
      return {
        form: [],
        visible: false,
        msg: "Hello Vue.js",
        salary: []
      }
    },

    filters: {
      formatSettle(val) {
        console.log(val)
        if (val == 1) {
          return '日结'
        } else if (val == 2) {
          return '月结'
        } else if (val == 3) {
          return ''
        } else if (val == 4) {
          return '周结'
        } else {
          return ''
        }
      },
      valuationTypeFilter(val) {
        let result = ''
        switch (Number(val)) {
          case 1:
            result = '计时'
            break;
          case 8:
            result = '日固定'
            break;
          case 2:
          case 3:
          case 4:
            result = '计量'
            break;
          case 5:
          case 6:
          case 7:
            result = '计时 + 计量'
            break;
          default:
            break;
        }
        return result
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
      }
    },
    mounted() {
      this.getaskSalaryList()
    },
    methods: {
      getaskSalaryList() {
        let id = this.$route.query.receiveId || this.$route.query.classTaskId;
        const params = {
          id: id,
        }
        this.$api.viewPriceSetting(params).then((response) => {
          this.form = response.data;
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
        }).catch((error) => {
        });
      },
      handleWrapperClick() {
        this.visible = false
      },
    }
  }
</script>

<style scoped>
  table {
    border-right: solid 1px #e4e4e4;
    border-bottom: solid 1px #e4e4e4;
    font-size: 14px;
  }
  td {
    border-left: solid 1px #e4e4e4;
    border-top: solid 1px #e4e4e4;
    height: 70px;
  }
  .header {
    background-color: #f6f6f6;
    font-family: MicrosoftYaHei;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #262626;
  }
  .tag {
    padding: 3px 6px;
    border-radius: 3px;
    border: 1px solid #e84518;
    margin-left: 5px;
  }
  .header td {
    height: 40px;
  }
  .setting-info-table {
    width: 100%;
    text-align: center;
  }
</style>