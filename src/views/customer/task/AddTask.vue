<template>
  <div class="overflow-box">
    <div class="box-body">
      <div class="box-body-item">
        <div class="box-body-form">
          <el-form ref="form" :model="form" label-width="150px" label-position="right" :rules="rules">
            <el-form-item label="任务名称：" prop="taskName" class="el_form_item">
              <el-input class="radius-input workerInp" placeholder="不超过10个字" :disabled="addOrIdetStatus == 2 ? true : false" size="medium" v-model="form.taskName" :maxlength="10"></el-input>
              <div class="text">填写建议：客户简称+需要处理的任务+白晚班</div>
              <div class="text">示例：中心局内部处理白班</div>
            </el-form-item>
            
            <el-form-item label="任务所属：" prop="belongToName" class="el_form_item">
              <el-select v-model="form.belongToName" class="radius-input" filterable style="width: 330px" placeholder="请选择">
                <el-option v-for="item in subCustomerList" :key="item.shortName" :label="item.shortName" :value="`${item.belongTo},${item.taskType}`">
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="项目经理：" style="position:relative" prop="manager " class="is-required el_form_item">
              <el-radio-group v-model="form.mode">
                <el-radio label="2" class="sending" :disabled="addOrIdetStatus == 2 ? true : false">指派</el-radio>
                <el-radio label="1" :disabled="addOrIdetStatus == 2 ? true : false">项目经理抢单</el-radio>
              </el-radio-group>
              <el-select v-model="form.manager" class="radius-input mangerInput" filterable style="width: 330px" :disabled="addOrIdetStatus == 2 ? true : false" placeholder="请选择" @change="checkManager">
                <el-option v-for="item in PmList" :key="item.value" :label="item.name" :value="item.userId">
                </el-option>
              </el-select>
              <div class="validText" v-if="!isCheckM">项目经理不能为空</div>
            </el-form-item>

            <el-form-item label="结算方式：" class="is-required el_form_item">
              <el-radio-group v-model="form.settlementType" :disabled="addOrIdetStatus == 2 ? true : false">
                <el-radio label="2">月结</el-radio>
                <el-radio label="3">实时结（任务结束后结算）</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="开始时间：" required class="el_form_item">
              <el-col :span="12">
                <el-form-item prop="startTime">
                  <el-date-picker v-model="form.startTime" :disabled="addOrIdetStatus == 2 ? true : false" type="date" class="radius-input dateInp" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="changestartTime0" :picker-options="pickerOptions0">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="startTime1">
                  <el-time-select v-model="form.startTime1" :disabled="addOrIdetStatus == 2 ? true : false" class="radius-input dateInp" placeholder="选择时间" value-format="HH:mm" format="HH:mm" :picker-options="{minTime: rangeStart,start: '00:00',step: '00:30',end: '23:30'}">
                  </el-time-select>
                </el-form-item>
              </el-col>

            </el-form-item>
            <el-form-item label="结束时间：" v-if="form.settlementType == 2" class="el_form_item">
              <el-col :span="12">
                <el-date-picker v-model="form.endTime" type="date" class="radius-input dateInp" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions1">
                </el-date-picker>
              </el-col>
              <el-time-select v-model="form.endTime1" class="radius-input dateInp" placeholder="选择时间" value-format="HH:mm:ss" format="HH:mm:ss" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
              </el-time-select>
            </el-form-item>
            <el-form-item label="结束时间：" v-if="form.settlementType == 3" prop="end" required class="el_form_item">
              <el-col :span="12">
                <el-form-item prop="endTime">
                  <el-date-picker v-model="form.endTime" type="date" class="radius-input dateInp" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions1">
                  </el-date-picker>
                </el-form-item>
              </el-col>
              <el-col :span="12">
                <el-form-item prop="endTime1">
                  <el-time-select v-model="form.endTime1" class="radius-input dateInp" placeholder="选择时间" value-format="HH:mm:ss" format="HH:mm:ss" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
                  </el-time-select>
                </el-form-item>
              </el-col>
            </el-form-item>
            <el-form-item label="核定人数：" prop="people" class="el_form_item">
              <!-- @change="countMale" -->
              <el-input class="radius-input workerInp" size="medium" placeholder="" v-model="form.people" :maxlength="10"></el-input>
              <div class="text0">建议核定人数在实际需要人数基础上增加10%</div>
            </el-form-item>
            <el-form-item label="任务单价：" style="position:relative" class="is-required el_form_item">
              <el-select v-model="form.valuationType" class="radius-input" style="width: 330px" placeholder="请选择" :disabled="addOrIdetStatus == 2 ? true : false">
                <el-option v-for="item in planList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 计时 -->
            <el-form-item v-if="form.valuationType == 1 || form.valuationType == 3" prop="countTime">
              <el-input class="radius-input workerInp countTimeInp" placeholder="" type="number" size="medium" v-if="addOrIdetStatus == 1" v-model="form.countTime" maxlength="10"></el-input><label v-if="addOrIdetStatus == 1">元/小时</label><br v-if="addOrIdetStatus == 1" />
              <el-input class="radius-input workerInp countTimeInp" placeholder="" type="number" size="medium" v-if="addOrIdetStatus == 2" v-html="content" maxlength="10"></el-input><br v-if="addOrIdetStatus == 2" />
              <span style="color:#666;font-size:16px">我跟项目经理结算时的单价</span>
            </el-form-item>

            <!-- 计量单位-->
            <el-form-item v-if="form.valuationType == 2 || form.valuationType == 3" class="is-required">
              <el-form-item>
                <el-radio-group v-model="form.mUnit">
                  <el-radio label="1" :disabled="addOrIdetStatus == 2 ? true : false">单一计量</el-radio>
                  <el-radio label="2" :disabled="addOrIdetStatus == 2 ? true : false">组合计量</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-form-item>

            <el-form-item label="计量单位：" style="position:relative;margin-left:80px;" class="is-required" v-if="(form.valuationType == 2 || form.valuationType == 3 ) &&form.mUnit == 1">
              <el-select v-model="form.mWay" class="radius-input" style="width: 330px" placeholder="请选择" :disabled="addOrIdetStatus == 2 ? true : false">
                <el-option v-for="item in wayList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>

            <!-- 计量 -->
            <div v-if="(form.valuationType == 2 || form.valuationType == 3 ) &&form.mUnit == 1">
              <el-form-item>
                <el-radio-group v-model="form.countType">
                  <el-radio label="1" :disabled="addOrIdetStatus == 2 ? true : false">固定计价</el-radio>
                  <el-radio label="2" :disabled="addOrIdetStatus == 2 ? true : false">阶梯计价</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="form.countType == 1" prop="settleCount">
                <!-- 1.元/{{varUnit}}2.元/{{varUnit}} -->
                <el-input class="radius-input countTimeInp" style="width:330px" placeholder="" size="medium" v-if="addOrIdetStatus == 1" v-model="form.settleCount" type="number" @blur="settleCheck" maxlength="10"></el-input>元/{{varUnit}}<br />
                <el-input class="radius-input countTimeInp" style="width:330px" placeholder="" size="medium" v-html="content" v-if="addOrIdetStatus == 2" type="number" @blur="settleCheck" maxlength="10"></el-input><br />
                <span style="color:#666;font-size:16px">我跟项目经理结算时的单价</span>
                <div class="validText" v-if="!isCheckS">请填写正确的单价</div>
              </el-form-item>

              <el-row v-if="form.countType == 2" v-for="(item, index) in form.ladderObj">
                <el-col :span="14">
                  <el-form-item :prop="`ladderObj.${index}.count`" :rules="ladderObjRules.count" class="ladder-form errorForm">
                    <!-- <img src="../../../assets/images/delete_ladder.png" alt="删除" class="delete_ladder" v-if="index != -1" @click="deleteLadder(index)"> -->
                    <span class="level">第{{index+1}}档：</span>
                    <el-input class="radius-input ladderInp" type="number" placeholder="" size="medium" v-model="item.count" v-if="addOrIdetStatus == 1" oninput="if(value.length>10)value=value.slice(0,10)" maxlength="10"></el-input>
                    <el-input class="radius-input ladderInp" type="number" placeholder="" size="medium" v-html="content" oninput="if(value.length>10)value=value.slice(0,10)" v-if="addOrIdetStatus == 2" maxlength="10"></el-input>
                    <span style="color:#666;font-size:16px" class="ladNum">{{varUnit}}，</span>
                  </el-form-item>
                </el-col>
                <el-col :span="8">
                  <el-form-item :prop="`ladderObj.${index}.unit` " :rules="ladderObjRules.unit" class="errorForm" style="margin-left:0px;">
                    <el-input style="width:230px;margin-left:-150px;margin-top:32px;" class="radius-input ladderInp2" type="number" placeholder="" v-if="addOrIdetStatus == 1" size="medium" v-model="item.unit" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkUnit(item.unit,index)"></el-input>
                    <el-input style="width:230px;margin-left:-150px;margin-top:32px;" class="radius-input ladderInp2" type="number" placeholder="" v-if="addOrIdetStatus == 2" size="medium" :content="content" v-html="content" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkUnit(item.unit,index)"></el-input>
                    <span class="yuanUnit">元/{{varUnit}}</span>
                  </el-form-item>
                </el-col>
              </el-row>
              <el-button round size="medium" class="addBtn" @click="addLadder" v-if="form.countType == 2 && addOrIdetStatus == 1" style="margin: 0 0 10px 150px;">添加阶梯</el-button>

              <el-form-item v-if="form.countType == 2">
                <span>超过第{{form.ladderObj.length || 0}}档时，</span>
                <el-input style="width:230px;" class="radius-input overInput" placeholder="" size="medium" type="number" v-if="addOrIdetStatus == 1" v-model="form.overUnit" maxlength="10" @blur="checkOverE"></el-input>
                <el-input style="width:230px;" class="radius-input overInput" placeholder="" size="medium" v-html="content" v-if="addOrIdetStatus == 2" type="number" maxlength="10" @blur="checkOverE"></el-input>
                <span style="color:#666;font-size:16px">元/{{varUnit}}</span>
                <span class="overError" v-if="!isOver">请填写正确的单价</span>
                <div class="b_line"></div>

                <div class="text0">{{form.ladderObj[0].count}}件以下（含），
                  {{form.ladderObj[0].unit}}元/{{varUnit}}</div>
                <div v-for="(item, index) in form.ladderObj">
                  <div class="text0" v-if="index != 0">{{Number((form.ladderObj[index-1].count)) + 1}}至{{item.count}}{{varUnit}}（含），{{item.unit}}元/{{varUnit}}</div>
                </div>
                <div class="text0">{{form.ladderObj[form.ladderObj.length-1].count}}{{varUnit}}以上，{{form.overUnit}}元/{{varUnit}}</div>
                <div class="text0">我跟项目经理结算时的单价</div>
              </el-form-item>
            </div>

            <!-- 组合 -->
            <!-- <el-input style="width:330px;" class="radius-input countTimeInp" :content="content" v-text="content" v-if="addOrIdetStatus == 2" placeholder="" size="medium" type="number"></el-input> -->
            <el-form-item v-if="(form.valuationType == 2 || form.valuationType == 3) &&form.mUnit == 2" prop="countjian">
              <el-input style="width:330px;" class="radius-input countTimeInp" placeholder="" size="medium" type="number" v-if="addOrIdetStatus == 1" v-model="form.countjian" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountjian"></el-input><label v-if="addOrIdetStatus == 1">元/件</label>
              <el-input style="width:330px;" class="radius-input countTimeInp" :content="content" v-html="sethtml(form.valuationType,content)" v-if="addOrIdetStatus == 2" placeholder="" size="medium" type="number" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountDai"></el-input>
            </el-form-item>
            <el-form-item v-if="(form.valuationType == 2 || form.valuationType == 3) &&form.mUnit == 2" prop="countDai">
              <el-input style="width:330px;" class="radius-input countTimeInp" placeholder="" size="medium" type="number" v-if="addOrIdetStatus == 1" v-model="form.countDai" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountDai"></el-input><label v-if="addOrIdetStatus == 1">元/袋</label>
              <!-- <el-input style="width:330px;" class="radius-input countTimeInp" :content="content" v-html="content" v-if="addOrIdetStatus == 2" placeholder="" size="medium" type="number"  oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountDai"></el-input> -->
            </el-form-item>
            <el-form-item v-if="(form.valuationType == 2 || form.valuationType == 3) &&form.mUnit == 2" prop="countChe">
              <el-input style="width:330px;" class="radius-input countTimeInp" placeholder="" size="medium" type="number" v-if="addOrIdetStatus == 1" v-model="form.countChe" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountChe"></el-input><label v-if="addOrIdetStatus == 1">元/车</label>
              <!-- <el-input style="width:330px;" class="radius-input countTimeInp" :content="content" v-html="content" v-if="addOrIdetStatus == 2" placeholder="" size="medium" type="number"  oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountChe"></el-input> -->
            </el-form-item>
            <el-form-item v-if="(form.valuationType == 2 || form.valuationType == 3) &&form.mUnit == 2" prop="countDun">
              <el-input style="width:330px;" class="radius-input countTimeInp" placeholder="" size="medium" type="number" v-if="addOrIdetStatus == 1" v-model="form.countDun" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountDun"></el-input><label v-if="addOrIdetStatus == 1">元/吨</label>
              <!-- <el-input style="width:330px;" class="radius-input countTimeInp" :content="content" v-html="content" v-if="addOrIdetStatus == 2" placeholder="" size="medium" type="number" oninput="if(value.length>10)value=value.slice(0,10)" @blur="checkcountDun"></el-input> -->
            </el-form-item>

            <el-form-item label="上班时间：" prop="workStartTime" class="el_form_item">
              <el-time-select v-model="form.workStartTime" class="radius-input workerInp dateWidth" placeholder="选择时间" value-format="HH:mm" format="HH:mm" :picker-options="{minTime: range,start: '00:00',step: '00:30',end: '23:30'}">
              </el-time-select>
            </el-form-item>
            <el-form-item label="下班时间：" prop="workEndTime" class="el_form_item">
              <el-select v-model="form.endWorkType" class="radius-input endSelect" filterable style="width: 330px;margin-bottom:3px" placeholder="请选择">
                <el-option v-for="item in dayList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <el-time-select v-model="form.workEndTime" class="radius-input workerInp endSelectTime" placeholder="选择时间" value-format="HH:mm:" format="HH:mm" :picker-options="{minTime: range,start: '00:00',step: '00:30',end: '23:30'}">
              </el-time-select>
            </el-form-item>
            <el-form-item label="工作地点：" style="position:relative" prop="workingPlace" class="el_form_item">

              <el-tooltip class="item" effect="dark" :content="form.workingPlace" placement="top-start">
                <el-input class="radius-input workerInp" placeholder="搜索地点，并进行选择" size="medium" v-model="form.workingPlace" @focus="viewMap" v-if="!mapDia">
                </el-input>
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="mapConfig.keyword" v-if="mapDia" @focus="viewMap">
                </el-input>

              </el-tooltip>
              <div class="text0">上下班打卡所在地</div>
            </el-form-item>
            <div v-if="mapDia" class="mapContain">
              <baidu-map class="map-container" :scroll-wheel-zoom="true" :center="mapConfig.center" :zoom="mapConfig.zoom">
                <bm-local-search :keyword="mapConfig.keyword" :auto-viewport="true" :location="mapConfig.location" @infohtmlset="infohtmlset">
                </bm-local-search>
              </baidu-map>
            </div>
            <el-form-item label="男工人数：" style="position:relative" prop="maleNum" class="el_form_item">
              <el-select v-model="form.maleNum" class="radius-input" filterable style="width: 330px" placeholder="请选择" :disabled="isMaleAble">
                <el-option v-for="item in maleList" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="女工人数：" prop="yearFee" v-if="femaleForm" class="el_form_item">
              {{form.femaleNum || ''}}
            </el-form-item>
            <el-form-item label="年龄要求：" prop="yearFee" class="is-required el_form_item">
              <el-col :span="11">
                <el-form-item prop="ageLowerLimit">
                  <el-input class="radius-input oldInp" placeholder="" size="medium" v-model="form.ageLowerLimit"></el-input>岁&nbsp;至
                </el-form-item>
              </el-col>
              <el-col :span="11">
                <el-form-item prop="ageUpperLimit">
                  <el-input class="radius-input oldInp" placeholder="" size="medium" v-model="form.ageUpperLimit"></el-input>岁
                </el-form-item>
              </el-col>
            </el-form-item>
            <!-- @change="checkIndustry" -->
            <el-form-item label="工种要求：" prop="industry" class="el_form_item">
              <el-checkbox-group v-model="industry" class="el_form_item_flex">
                <el-checkbox :disabled="initIndustry.includes(item.dicName)" :label="item.dicName" @change="setIndustry(item.dicName,item.dicVal)" :value="item.dicVal" v-for="(item,index) in taskIndustryNameList" class="cBox">{{item.dicName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="零工单价上限控制：" required class="el_form_item">
              <el-radio-group v-model="form.uppeLimit">
                <el-radio label="1">启用</el-radio>
                <el-radio label="2">不启用</el-radio>
              </el-radio-group>
              <!-- <div class="text0" v-if="!setTimer">您尚未设置工种价格上限，<span class="clickText" @click="setUperPrice">点击此处前去设置</span></div> -->
            </el-form-item>
            <el-form-item label="已选中的工种：" class="el_form_item" v-if="form.uppeLimit == '1' && industry.length>0">
              <table class="setting-table">
                <thead>
                  <tr>
                    <th>工种</th>
                    <th>计时</th>
                    <th>计件</th>
                    <th>计袋</th>
                    <th>计吨</th>
                    <th>计车</th>
                  </tr>
                </thead>

                <tbody>
                  <tr v-for="(item,index) in setindustry">
                    <td style="width:72px;color:#e84518;text-align:left">{{item.industryName}}：</td>
                    <td>
                      <el-input class="rant-input" :key="item.industryName" @blur="setBlurVal(price[index].countTime,index,'countTime')" @keyup.native="chooseVal(price[index].countTime,index,'countTime')" v-model="price[index].countTime"></el-input>
                      <span class="input-piece">元/小时</span>
                    </td>
                    <td>
                      <el-input class="rant-input" :key="item.industryName" @blur="setBlurVal(price[index].countSettle,index,'countSettle')" @keyup.native="chooseVal(price[index].countSettle,index,'countSettle')" v-model="price[index].countSettle"></el-input>
                      <span class="input-piece">元/件</span>
                    </td>
                    <td>
                      <el-input class="rant-input " :key="item.industryName" @blur="setBlurVal(price[index].countDai,index,'countDai')" @keyup.native="chooseVal(price[index].countDai,index,'countDai')" v-model="price[index].countDai"></el-input>
                      <span class="input-piece">元/袋</span>
                    </td>
                    <td>
                      <el-input class="rant-input " :key="item.industryName" @blur="setBlurVal(price[index].countChe,index,'countChe')" @keyup.native="chooseVal(price[index].countChe,index,'countChe')" v-model="price[index].countChe"></el-input>
                      <span class="input-piece">元/车</span>
                    </td>
                    <td>
                      <el-input class="rant-input " :key="item.industryName" @blur="setBlurVal(price[index].countDun,index,'countDun')" @keyup.native="chooseVal(price[index].countDun,index,'countDun')" v-model="price[index].countDun"></el-input>
                      <span class="input-piece">元/吨</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </el-form-item>

            <el-form-item label="我方签约客户全称：" prop="signCustomerName" class="el_form_item">
              <el-input class="radius-input workerInp" placeholder="" size="medium" maxlength="128" v-model="form.signCustomerName"></el-input>
              <div class="text0">用于生成客户确认表的表头</div>
            </el-form-item>
            <el-form-item label="客户工作量确认人员：" label-width="190px">
              <div v-for="(item,index) in confirmPersonList" :key="index" style="padding:5px 0">
                <i class="el-icon-delete" style="margin-right:15px;cursor:pointer" @click="removePerson(index)"></i><label>人员{{index+1}}</label>
                <el-form-item label="姓名：" label-width="90px" :rules="confirmPersonRules.name">
                  <el-input class="radius-input workerInp" placeholder="" size="medium" maxlength="128" v-model="item.name" style=''></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" label-width="100px" :rules="confirmPersonRules.idCard">
                  <el-input class="radius-input workerInp" placeholder="" size="medium" maxlength="128" v-model="item.idCard"></el-input>
                </el-form-item>
              </div>
              <el-button @click="addPerson" style="margin: 10px 0;highet:28px;line-height:0px">添加人员</el-button>
            </el-form-item>
            <el-form-item label="其他要求：" prop="yearFee" class="el_form_item">
              <el-input type="textarea" :rows="2" class="textArea workerInp" placeholder="比如：以上零工必须要有投递经验" v-model="form.textarea">
              </el-input>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="box-footer" style="margin-left:455px">
      <el-button round size="medium" @click="closeAddTask">取 消</el-button>
      <el-button round size="medium" type="primary" :loading="isLoading" @click="save">保 存</el-button>
    </div>
  </div>
</template>
<script>
let _this = this
window.onbeforeunload = function (e) {
  e = e || window.event;
  // 兼容IE8和Firefox 4之前的版本
  if (e) {
    e.returnValue = '关闭提示1111';
  }
  // Chrome, Safari, Firefox 4+, Opera 12+ , IE 9+
  return '关闭提示222';
}
import Util from '../../../common/util.js'
export default {
  name: 'AddTask',
  data() {
    let _this = this;
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
    let checkcountTime = (rule, value, callback) => {
      if (value) {
        if (value <= 0) {
          callback(new Error("请输入大于0的数字"));
        } else {
          this.form.countTime = value.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
          this.form.countTime = value.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
          this.form.countTime = value.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
          this.form.countTime = String(value).replace(/^(.*\..{4}).*$/, "$1");
          callback();
        }
      } else {
        callback(new Error("任务单价不能为空"));
      }
    };
    let checkunit = (rule, value, callback) => {
      if (value) {
        if (value <= 0) {
          callback(new Error("请输入大于0的数字"));
        } else {
          value = value.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
          value = value.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
          value = value.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
          value = String(value).replace(/^(.*\..{4}).*$/, "$1");
          this.$forceUpdate();
          callback();
        }
      } else {
        callback(new Error("任务单价不能为空"));
      }
    };
    return {
      pickerOptions0: {
        disabledDate(time) {
          return time.getTime() <= (Date.now() - 8.64e7)
        }
      },
      pickerOptions1: {
        disabledDate(time) {
          return time.getTime() <= (new Date(_this.form.startTime).getTime() - 8.64e7)
        }
      },
      // forms: [],
      industryListName: '',
      belongTo: '',
      taskType: '',
      isIndustry: false,
      isEdit: false,
      dicValArr: [],
      industry: [],
      setindustry: [],
      ishtml: false,
      form: {
        taskPoint:1,
        taskName: '',
        belongToName: '',
        manager: '',
        startTime: '',
        startTime1: '',
        endTime: '',
        endTime1: '',
        // endTime: '',
        workStartTime: '',
        workEndTime: '',
        people: '',
        mode: '2',
        settlementType: '2',
        uppeLimit: '',
        valuationType: 1,
        maleNum: 0,
        femaleNum: 0,
        quilty: '',
        textarea: '',
        count: 1,
        countTime: '',
        settleCount: '',
        ageUpperLimit: '',
        ageLowerLimit: '',
        workingPlace: '',
        endWorkType: 1,
        unit: '',
        signCustomerName: '',
        countType: '1',
        ladderObj: [
          {
            count: '',
            unit: '',
          },
        ],
        longitude: '',
        latitude: '',
        overUnit: '',
        mUnit: '1',
        mWay: 1,
        countSettle: '',
        countChe: '',
        countDun: '',
        countDai: '',
      },
      valid: true,
      price: [],
      industrySalaryList: [
        // {
        //   industry: 35,
        //   priceLimit: '{"price":[{"countTime":"220","countSettle":"220","countDai":"220","countChe":"220","countDun":"220"}]}'
        // }
      ],
      confirmPersonList: [
        {
          name: '',
          idCard: '',
        }
      ],
      varUnit: '件',
      planList: [
        {
          label: '计时',
          value: 1
        },
        {
          label: '计量',
          value: 2
        },
        {
          label: '计时 + 计量',
          value: 3
        },
      ],
      wayList: [
        {
          label: '件',
          value: 1
        },
        {
          label: '袋',
          value: 2
        },
        {
          label: '车',
          value: 3
        },
        {
          label: '吨',
          value: 4
        },
      ],
      maleList: [],
      countList: [
        {
          label: '件',
          value: 1
        },
        {
          label: '吨',
          value: 2
        },
      ],
      dayList: [
        {
          label: '当日',
          value: 1
        },
        {
          label: '次日',
          value: 2
        },
      ],
      taskIndustryNameList: [],
      PmList: [],
      subCustomerList: [],
      isCheckM: true,
      isCheckS: true,
      rules: {
        taskName: [
          {
            required: true,
            message: "任务名称不能为空",
            trigger: "blur",
          },
        ],
        belongToName: [
          {
            required: true,
            message: "任务所属不能为空",
            trigger: "change"
          }
        ],
        manager: [
          {
            required: true,
            message: "项目经理不能为空",
            trigger: "change"
          }
        ],
        startTime: [
          {
            required: true,
            message: "开始时间不能为空",
            trigger: "change"
          }
        ],
        startTime1: [
          {
            required: true,
            message: "开始时间不能为空",
            trigger: "change"
          }
        ],
        endTime: [
          {
            required: true,
            message: "结束时间不能为空",
            trigger: "change"
          }
        ],
        endTime1: [
          {
            required: true,
            message: "结束时间不能为空",
            trigger: "change"
          }
        ],
        people: [
          {
            required: true,
            message: "核定人数不能为空",
            trigger: "blur",
          },
          {
            pattern: /^[1-9][0-9]*$/,
            message: "请填写正确的核定人数"
          }
        ],
        workStartTime: [
          {
            required: true,
            message: "上班时间不能为空",
            trigger: "change"
          }
        ],
        workEndTime: [
          {
            required: true,
            message: "下班时间不能为空",
            trigger: "change"
          }
        ],
        maleNum: [
          {
            required: true,
            message: "男工人数不能为空",
            trigger: "change"
          },

        ],
        workingPlace: [
          {
            required: true,
            message: "工作地点不能为空",
            trigger: "change",
          },
        ],
        // industry: [
        //   {
        //     required: true,
        //     message: "工种要求不能为空",
        //     trigger: "blur",
        //   },
        // ],
        signCustomerName: [
          {
            required: true,
            message: "我方签约客户全称不能为空",
            trigger: "blur"
          },
        ],
        nameIdcard: [
          {
            required: true,
            message: "客户工作量确认人员姓名或身份证号不能为空",
            trigger: "blur"
          },
        ],
        ageUpperLimit: [
          {
            required: true,
            trigger: "blur",
            validator: checkAgeUpperLimit
          },
          {
            pattern: /^[1-9][0-9]*$/,
            message: "请填写正确的年龄上限"
          }
        ],
        ageLowerLimit: [
          {
            required: true,
            message: "年龄要求不能为空",
            trigger: "blur",
          }
          ,
          {
            pattern: /^[1-9][0-9]*$/,
            message: "请填写正确的年龄下限"
          }
        ],
        countTime: [
          {
            required: true,
            trigger: "change",
            validator: checkcountTime
          },
        ],
        workStartTime: [
          {
            required: true,
            message: "上班时间不能为空",
            trigger: "change"
          }
        ],
        workEndTime: [
          {
            required: true,
            message: "下班时间不能为空",
            trigger: "change"
          }
        ],
        quilty: [
          {
            required: false,
            trigger: "blur"
          },
          {
            pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[1-9]{1,2})$/,
            message: "请填写正确的预计工作量"
          }
        ],
      },
      ladderObjRules: {
        count: [
          {
            required: true,
            message: "任务单价不能为空",
            trigger: "blur"
          },
          {
            pattern: /^[1-9][0-9]*$/,
            message: "请填写正确的件数"
          }
        ],
        unit: [
          {
            required: true,
            message: "任务单价不能为空",
            trigger: "change",
          },
          {
            pattern: /^(([1-9]\d*)(\.\d{1,4})?|0\.[1-9]{1,4})$/,
            message: "请填写正确的单价"
          }
        ],
      },
      confirmPersonRules: {
        name: [
          {
            required: true,
            message: "客户工作量确认人员姓名不能为空",
            trigger: "blur"
          },
        ],
        idCard: [
          {
            required: true,
            message: "客户工作量确认人员身份证不能为空",
            trigger: "blur"
          },
        ]
      },
      femaleForm: false,
      mapDia: false,
      isOver: true,
      isLadderCount: true,
      customerId: '',
      mapConfig: {
        location: '',
        keyword: '',
        center: { lng: 120.21937542, lat: 30.25924446 },
        zoom: 12,
      },
      range: '',
      mountFirst: 1,
      mountsecond: 1,
      isMaleAble: true,
      checkTime: true,
      setTimer: true,
      ageLimit: true,
      isActual: true,
      timer: null,
      valuationType: '',
      qualityUnit: '',
      isCombo: true,
      rangeStart: '',
      userInfo: {},
      isLoading: false,
      setArr: [],
      newPrice: {},
      content: '',
    }
  },
  props: ['formDetail', 'title', 'getList', 'addOrIdetStatus', 'addTaskVisible'],
  methods: {
    closeAddTask() {
      this.$emit('closeAddTask', false)
      this.getList()
      this.$forceUpdate()
      this.getWindowFuoceUpdate()
    },
    chooseVal(value, index, name) {
      let val = value;
      let reg = /^-?\d*\.?\d*$/
      if (reg.test(value)) {
        if (Number(val) >= 0) {
          let falseNum = value.substr(0, 1);
          let numLength = value.indexOf('.');
          if (val.indexOf('.') != -1) {
            this.price[index][name] = val.substr(0, val.indexOf(".") + 5);
            if (Number(falseNum) == 0 && numLength >= 2) {
              this.price[index][name] = null;
            }
          }
        } else {
          this.price[index][name] = null;
        }
      } else {
        this.price[index][name] = null;
      };
    },
    setBlurVal(value, index, name) {
      if (Number(value == 0) || Number(value == null)) {
        this.price[index][name] = null;
        this.$message.error('工种上限设置不能为0或不能为空！')
      }
    },
    getBelongList() {
      this.$api.getTaskBelongList()
        .then(res => {
          if (res.respCode == 0) {
            if (res.data) {
              this.subCustomerList = res.data
            }
          }
        })
        .catch()
    },
    addPerson() {
      this.confirmPersonList.push({
        name: '',
        idCard: '',
      })
    },
    removePerson(index) {
      if (this.confirmPersonList.length == 1) {
        return this.$message.error('客户工作量确认人至少为1位！')
      } else {
        this.confirmPersonList.splice(index, 1)
      }
    },
    setIndustry() {
      // var setArr = []
      this.setArr = []
      var industry = this.industry;
      var List = this.taskIndustryNameList;
      for (var i = 0; i < industry.length; i++) {
        for (var j = 0; j < List.length; j++) {
          if (industry[i] == List[j].dicName) {
            this.setArr.push({ 'industryName': industry[i], 'industry': List[j].dicVal });
          }
        }
      }
      this.setindustry = this.setArr;
    },
    sethtml(type, value) {
      var istype = type == 3;
      if (!this.ishtml || !istype) {
        this.ishtml = true;
        return value;
      }
      if (this.ishtml && istype) {
        return null;
      }
    },
    addLadder() {
      if (this.form.ladderObj[this.form.ladderObj.length - 1].count && this.form.ladderObj[this.form.ladderObj.length - 1].unit) {
        this.form.ladderObj.push({
          count: "",
          unit: "",
        });
        if (this.form.ladderObj.length >= 3) {
          if (this.form.ladderObj[this.form.ladderObj.length - 3].count > this.form.ladderObj[this.form.ladderObj.length - 2].count) {
            this.$message.error('请检查阶梯件数')
          }
        }
      } else {
        this.$message.error('请填写完整')
      }


    },
    getWindowFuoceUpdate() {
      // window.location.reload()
    },
    save() {

      // // debugger
      if (this.form.uppeLimit == '1') {
        let validIndustry = false;
        if (this.price.length == 0) {
          validIndustry = true
          this.$message.error('工种上限设置不能为空或为0！')
        }
        this.price = this.price.slice(0, this.setindustry.length)
        for (var i = 0; i < this.price.length; i++) {
          var jianValid = !this.price[i].countSettle
          var daiValid = !this.price[i].countDai
          var cheValid = !this.price[i].countChe
          var dunValid = !this.price[i].countDun
          var timeValid = !this.price[i].countTime
          if (jianValid || daiValid || cheValid || dunValid || timeValid) {
            validIndustry = true
            return this.$message.error('工种上限设置不能为空或为0！')
          }
        }
        if (validIndustry) {
          return
        }
        if (!validIndustry) {
          var priceArr = this.price;
          var setindustryArr = this.setindustry;
          for (var i = 0; i < setindustryArr.length; i++) {
            var arr = [];
            arr.push(priceArr[i]);
            this.industrySalaryList.push({ 'industry': setindustryArr[i]['industry'], 'priceLimit': JSON.stringify({ 'price': arr }) });
          }
          let obj = {};
          var indataList = this.industrySalaryList;
          indataList = indataList.reduce((cur, next) => {
            obj[next.industry] ? "" : obj[next.industry] = true && cur.push(next);
            return cur;
          }, []) //设置cur默认类型为数组，并且初始值为空的数组
          this.industrySalaryList = indataList
        }
      } else if (this.form.uppeLimit == '2') {
        var priceArr = this.price;
        var setindustryArr = this.setindustry;
        for (var i = 0; i < setindustryArr.length; i++) {
          var arr = [];
          arr.push(priceArr[i]);
          this.industrySalaryList.push({ 'industry': setindustryArr[i]['industry'], 'priceLimit': JSON.stringify({ 'price': arr }) });
        }
        let obj = {};
        // var indataList = this.industrySalaryList;
        this.industrySalaryList = this.industrySalaryList.reduce((cur, next) => {
          obj[next.industry] ? "" : obj[next.industry] = true && cur.push(next);
          return cur;
        }, []) //设置cur默认类型为数组，并且初始值为空的数组
        // this.industrySalaryList = indataList
      } else if (this.form.uppeLimit == '') {
        return this.$message.error('零工单价上限控制必选一项！')
      }
      for (let x in this.confirmPersonList) {
        if (this.confirmPersonList[x].name == '' && this.confirmPersonList[x].idCard == '') {
          return this.$message.error('客户工作量确认人员姓名和身份证不能为空！')
        } else if (this.confirmPersonList[x].idCard == '') {
          return this.$message.error('客户工作量确认人员身份证不能为空！')
        } else if (this.confirmPersonList[x].name == '') {
          return this.$message.error('客户工作量确认人员姓名不能为空！')
        }
      }
      if (this.industry.length == 0) {
        return this.$message.error('工种价格上限设置至少选择一种！')
      }

      if (this.form.ageLowerLimit == '' || this.form.ageUpperLimit == '') {
        return this.$message.error('年龄范围不能为空！')
      }
      if (this.form.startTime == '' || this.form.startTime1 == '') {
        return this.$message.error('开始时间不能为空！')
      }
      if (this.form.workStartTime == '' || this.form.workEndTime == '') {
        return this.$message.error('上下班时间不能为空！')
      }
      if (this.form.settlementType == 3) {
        if (this.form.endTime == '' || this.form.endTime1 == '') {
          return this.$message.error('实时结算时，结束时间不能为空！')
        }
      }
      let regs = /^[1-9][0-9]*$/;
      if (!regs.test(this.form.people)) {
        return this.$message.error('请填写正确的核定人数！')
      }
      if (this.form.workingPlace == '') {
        return this.$message.error('上下班打卡所在地不能为空！')
      }
      if (this.form.mUnit == 2) {
        if (!this.form.countjian && !this.form.countDai && !this.form.countChe && !this.form.countDun) {
          this.isCombo = false
          // this.$message.error('请至少填写两个计量单价')
        } else {
          let count = 0
          if (this.form.countjian) {
            count++
          } if (this.form.countDai) {
            count++
          } if (this.form.countChe) {
            count++
          } if (this.form.countDun) {
            count++
          }
          if (count >= 2) {
            this.isCombo = true
          } else {
            // this.$message.error('请至少填写两个计量单价')
          }
        }
      } else {
        this.isCombo = true
      }

      // if (this.setTimer == false) {
      //   this.$message.error('您未设置工种价格上限')
      // }
      if (this.form.endTime && this.form.endTime1) {
        let end_time = `${this.form.endTime} ${this.form.endTime1}:00`
        let start_time = `${this.form.startTime} ${this.form.startTime1}:00`

        if (new Date(end_time).getTime() <= new Date(start_time).getTime()) {
          this.$message.error('结束时间必须大于开始时间')
          this.checkTime = false
        } else {
          this.checkTime = true
        }

      }
      if (this.form.endTime && !this.form.endTime1) {
        this.$message.error('请填写完整的结束时间')
        this.checkTime = false
      }
      if (!this.form.endTime && this.form.endTime1) {
        this.$message.error('请填写完整的结束时间')
        this.checkTime = false
      }
      if (!this.form.endTime && !this.form.endTime1) {
        this.checkTime = true
      }
      if (this.addOrIdetStatus == 1) {
        if (this.form.countType == 2 && this.form.valuationType != 1) {
          if (!this.form.overUnit || !this.isOver) {
            this.isOver = false
          } else {
            this.isOver = true
          }
          if (this.form.ladderObj.length >= 2) {
            for (let i in this.form.ladderObj) {
              if (i > 0) {
                if (this.form.ladderObj[i].count <= this.form.ladderObj[i - 1].count) {
                  this.$message.error('请检查阶梯件数')
                  this.isLadderCount = false
                  break

                } else {
                  this.isLadderCount = true
                }
              }
            }
          }
        } else {
          this.isLadderCount = true
          this.isOver = true
        }
      }
      if (this.form.valuationType != 1 && this.form.mUnit == 1 && this.form.countType == 1) {
        this.settleCheck()
      }
      this.checkManager()

      if (this.form.valuationType == 3) {
        if (this.form.mUnit == 1 && this.form.countType == 1) {
          this.valuationType = 5//计时+固定计量
          this.qualityUnit = this.form.mWay//计量单位
          this.isOver = true
        } else if (this.form.mUnit == 1 && this.form.countType == 2) {
          this.valuationType = 6//计时+阶梯计量
          this.qualityUnit = this.form.mWay//计量单位

        } else {
          this.valuationType = 7//计时+组合计量
          this.isOver = true
        }
      }
      if (this.form.valuationType == 1) {
        this.valuationType = 1//计时
        this.isOver = true
      }
      if (this.form.valuationType == 2) {
        if (this.form.mUnit == 1 && this.form.countType == 1) {
          this.valuationType = 2//固定计量
          this.qualityUnit = this.form.mWay//计量单位
          this.isOver = true
        } else if (this.form.mUnit == 1 && this.form.countType == 2) {
          this.valuationType = 3//阶梯计量
          this.qualityUnit = this.form.mWay//计量单位
        } else {
          this.valuationType = 4//组合计量
          this.isOver = true
        }
      }
      //  valid&& this.isCheckM && this.isCheckS && this.isLadderCount && this.isOver && this.checkTime && this.isCombo
      this.$refs.form.validate((valid) => {
        if (this.valid) {
          this.isLoading = true
          if (this.form.endTime && this.form.endTime1) {
            this.form.endTimes = `${this.form.endTime} ${this.form.endTime1}`

          } else {
            this.form.endTimes = ''
          }
          if (this.addOrIdetStatus == 1) {
            if (this.form.valuationType != 1 && this.form.mUnit == 1 && this.form.countType == 2) {
              this.form.ladderObj.push({
                overUnit: this.form.overUnit
              })
            }
          }


          if (this.form.valuationType == 1) {
            this.form.ladderObj = [
              {
                count: '',
                unit: '',
              },
            ];
            this.form.countSettle = ''
            this.form.overUnit = ''
            this.form.countjian = ''
            this.form.countChe = ''
            this.form.countDun = ''
            this.form.countDai = ''
          }

          // valuationType = 计量
          if (this.form.mUnit == 1 && this.form.countType == 1) {
            this.form.overUnit = ''
            this.form.countjian = ''
            this.form.countChe = ''
            this.form.countDun = ''
            this.form.countDai = ''
            this.form.ladderObj = [
              {
                count: '',
                unit: '',
              },
            ];
          }
          if (this.form.mUnit == 1 && this.form.countType == 2) {
            this.form.countjian = ''
            this.form.countChe = ''
            this.form.countDun = ''
            this.form.countDai = ''
            this.form.settleCount = ''
          }
          if (this.form.mUnit == 2) {
            this.form.overUnit = ''
            this.form.ladderObj = [
              {
                count: '',
                unit: '',
              },
            ];
            this.form.settleCount = ''
          }

          let price = this.form.mUnit == 1 ? {
            'price': [
              {
                countTime: this.form.valuationType != 2 ? this.form.countTime : '',
                ladderObj: this.form.countType == 2 ? this.form.ladderObj : [
                  {
                    count: '',
                    unit: '',
                  },
                ],

                countSettle: this.form.mWay == 1 ? this.form.settleCount : '',
                countChe: this.form.mWay == 3 ? this.form.settleCount : '',
                countDun: this.form.mWay == 4 ? this.form.settleCount : '',
                countDai: this.form.mWay == 2 ? this.form.settleCount : '',
              }
            ],
            unit: this.qualityUnit,
            valuationType: this.valuationType,
            settlementType: this.form.settlementType,

          } : {
              'price': [
                {
                  countTime: this.form.valuationType != 2 ? this.form.countTime : '',
                  ladderObj: this.form.countType == 2 ? this.form.ladderObj : [
                    {
                      count: '',
                      unit: '',
                    },
                  ],

                  countSettle: this.form.countjian,
                  countChe: this.form.countChe,
                  countDun: this.form.countDun,
                  countDai: this.form.countDai,
                }
              ],
              unit: this.qualityUnit,
              valuationType: this.valuationType,
              settlementType: this.form.settlementType,
            }

          if (this.addOrIdetStatus == 1) {
            const params = {
              taskName: this.form.taskName,
              belongTo: this.form.belongToName ? Number(this.form.belongToName.split(',')[0]) : '',
              taskType: this.form.belongToName ? Number(this.form.belongToName.split(',')[1]) : '',
              managerUserId: this.form.mode == 2 ? this.form.manager : '',
              settlementType: this.form.settlementType,
              startTime: `${this.form.startTime} ${this.form.startTime1}:00`,
              endTime: this.form.endTimes ? `${this.form.endTimes}:00` : '',
              authorizedNumber: this.form.people,
              uppeLimit: this.form.uppeLimit,
              valuationType: this.form.valuationType,
              price: JSON.stringify(price),
              workStartTime: `${this.form.workStartTime}:00`,
              workEndTime: `${this.form.workEndTime}:00`,
              maleNumber: this.form.maleNum == 0 ? '' : this.form.maleNum,
              femaleNumber: this.femaleForm ? this.form.femaleNum : '',
              ageLowerLimit: this.form.ageLowerLimit,
              ageUpperLimit: this.form.ageUpperLimit,
              taskIndustryNameList: this.industry.length == 0 ? '' : (this.industry).join(','),
              otherDemand: this.form.textarea,
              workingPlace: this.form.workingPlace,
              endWorkType: this.form.endWorkType,
              receiptType: 1,
              latitude: this.form.latitude,
              longitude: this.form.longitude,
              signCustomerName: this.form.signCustomerName,
              confirmPersonList: this.confirmPersonList,
              industrySalaryList: this.industrySalaryList
            };

            this.$api
              .AddTask(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success('添加任务成功')
                  this.getList()
                  this.$forceUpdate()
                  this.$emit('closeAddTask', false)
                  this.form = {}
                  this.setindustry = []
                  this.industry = []
                  this.confirmPersonList = []
                } else {
                  if (this.form.valuationType != 1 && this.form.countType == 2 && this.form.mUnit == 1 && this.form.ladderObj.length > 1) {
                    this.form.ladderObj.pop()
                  }

                }
              })
              .catch(error => {
                this.isLoading = false
              })
              .finally(() => {
                this.isLoading = false
              });
          } else if (this.addOrIdetStatus == 2) {
            const params = {
              id: this.formDetail.id,
              taskName: this.form.taskName,
              belongTo: this.form.belongToName ? Number(this.form.belongToName.split(',')[0]) : '',
              taskType: this.form.belongToName ? Number(this.form.belongToName.split(',')[1]) : '',
              settlementType: this.form.settlementType,
              startTime: `${this.form.startTime} ${this.form.startTime1}`,
              endTime: this.form.endTimes ? `${this.form.endTimes}` : '',
              authorizedNumber: this.form.people,
              uppeLimit: this.form.uppeLimit,
              workStartTime: this.form.workStartTime ? `${this.form.workStartTime}:00` : '',
              workEndTime: this.form.workEndTime ? `${this.form.workEndTime}:00` : '',
              ageLowerLimit: this.form.ageLowerLimit,
              ageUpperLimit: this.form.ageUpperLimit,
              taskIndustryNameList: this.industry.length == 0 ? '' : (this.industry).join(','),
              otherDemand: this.form.textarea,
              workingPlace: this.form.workingPlace,
              endWorkType: this.form.endWorkType,
              receiptType: 1,
              latitude: this.form.latitude,
              longitude: this.form.longitude,
              signCustomerName: this.form.signCustomerName,
              confirmPersonList: this.confirmPersonList,
              industrySalaryList: this.industrySalaryList
            };
            this.$api
              .UpdateTask(params)
              .then(response => {
                if (response.data.respCode == 0) {
                  this.$message.success('编辑任务成功')
                  this.getList()
                  this.$emit('closeAddTask', false)
                } else {

                  if (this.form.valuationType != 1 && this.form.mUnit == 1 && this.form.countType == 2 && this.form.ladderObj.length > 1) {
                    this.form.ladderObj.pop()
                  }

                }

              })
              .catch(error => {
                this.isLoading = false
              })
              .finally(() => {
                this.isLoading = false
              });
          }
        } else {
          return false;
        }
      });

    },
    getPmList() {
      const params = {
        pageNum: 1,
        pageSize: 999,
        bindingStatus: 1
      };
      this.$api
        .getPmListCus(params)
        .then(response => {
          const {
            data
          } = response;
          this.PmList = data;
        })
        .catch(error => {
        });
    },
    checkManager() {
      if (this.form.mode == 2) {
        if (this.form.manager) {
          this.isCheckM = true
        } else {
          this.isCheckM = false
        }
      } else {
        this.isCheckM = true
      }
    },
    settleCheck() {
      if (this.form.countType == 1) {
        if (this.form.settleCount) {
          if (Number(this.form.settleCount) <= 0) {
            this.isCheckS = false
          } else {
            this.form.settleCount = (this.form.settleCount).toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
            this.form.settleCount = (this.form.settleCount).toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
            this.form.settleCount = (this.form.settleCount).toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
            this.form.settleCount = String(this.form.settleCount).replace(/^(.*\..{4}).*$/, "$1");
            this.isCheckS = true
          }
        } else {
          this.isCheckS = false
          return false
        }
      } else {
        this.isCheckS = true
      }
    },
    deleteLadder(index) {
      this.form.ladderObj.splice(index, 1);
    },
    infohtmlset(poi) {
      this.form.workingPlace = `${poi.city}${poi.address}${poi.title}`;
      this.form.latitude = poi.point.lat;
      this.form.longitude = poi.point.lng;
      this.mapDia = false
    },
    saveLocation() {

    },
    viewMap() {
      this.mapDia = true
    },
    checkOverE() {
      if (!this.form.overUnit) {
        this.isOver = false
        return false
      } else {
        if (Number(this.form.overUnit) <= 0) {
          this.isOver = false
        } else {
          this.form.overUnit = (this.form.overUnit).toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
          this.form.overUnit = (this.form.overUnit).toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
          this.form.overUnit = (this.form.overUnit).toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
          this.form.overUnit = String(this.form.overUnit).replace(/^(.*\..{4}).*$/, "$1");
          this.isOver = true
        }

      }
    },
    checkUnit(unit, index) {
      this.form.ladderObj[index].unit = unit.toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
      this.form.ladderObj[index].unit = unit.toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
      this.form.ladderObj[index].unit = unit.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      this.form.ladderObj[index].unit = String(unit).replace(/^(.*\..{4}).*$/, "$1");
    },
    checkcountjian() {
      this.form.countjian = this.form.countjian ? this.form.countjian.toString().replace(/[^\d.]/g, "") : '';  //清除“数字”和“.”以外的字符  
      this.form.countjian = this.form.countjian ? this.form.countjian.toString().replace(/\.{2,}/g, ".") : ''; //只保留第一个. 清除多余的  
      this.form.countjian = this.form.countjian ? this.form.countjian.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") : '';
      this.form.countjian = String(this.form.countjian).replace(/^(.*\..{4}).*$/, "$1");
    },
    checkcountDai() {
      this.form.countDai = this.form.countDai ? this.form.countDai.toString().replace(/[^\d.]/g, "") : '';  //清除“数字”和“.”以外的字符  
      this.form.countDai = this.form.countDai ? this.form.countDai.toString().replace(/\.{2,}/g, ".") : ''; //只保留第一个. 清除多余的  
      this.form.countDai = this.form.countDai ? this.form.countDai.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") : '';
      this.form.countDai = String(this.form.countDai).replace(/^(.*\..{4}).*$/, "$1");
    },
    checkcountChe() {
      this.form.countChe = this.form.countChe ? this.form.countChe.toString().replace(/[^\d.]/g, "") : '';  //清除“数字”和“.”以外的字符  
      this.form.countChe = this.form.countChe ? this.form.countChe.toString().replace(/\.{2,}/g, ".") : ''; //只保留第一个. 清除多余的  
      this.form.countChe = this.form.countChe ? this.form.countChe.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") : '';
      this.form.countChe = String(this.form.countChe).replace(/^(.*\..{4}).*$/, "$1");
    },
    checkcountDun() {
      this.form.countDun = this.form.countDun ? this.form.countDun.toString().replace(/[^\d.]/g, "") : '';  //清除“数字”和“.”以外的字符  
      this.form.countDun = this.form.countDun ? this.form.countDun.toString().replace(/\.{2,}/g, ".") : ''; //只保留第一个. 清除多余的  
      this.form.countDun = this.form.countDun ? this.form.countDun.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".") : '';
      this.form.countDun = String(this.form.countDun).replace(/^(.*\..{4}).*$/, "$1");
    },
    getSkill() {
      let params = {
        code: 'industry',
        level: 2
      }
      this.$api
        .GetAllTagsV1(params)
        .then(response => {
          this.taskIndustryNameList = response.data;
          for (let item in this.taskIndustryNameList) {
            this.dicValArr.push(this.taskIndustryNameList[item].dicVal)
          }
        })
        .catch(error => {
        });
    },
    checkPrice() {
      this.$api
        .CheckUperPrice()
        .then(response => {
          if (response.data.respCode == 0) {
            if (response.data.data == false) {
              this.setTimer = false
            } else {
              this.setTimer = true
              clearInterval(this.timer);
            }
          }
        })
        .catch(error => {
        });
    },
    // setUperPrice() {
    //   sessionStorage.setItem('setUpPrice', 1)
    //   const { href } = this.$router.resolve({
    //     name: "taskList",
    //   });
    //   window.open(href, "_blank");
    // },
    // setTimerCount: function () {
    //   this.timer = setInterval(() => {
    //     this.checkPrice()
    //   }, 6 * 1000)
    // },
    checkAge() {
      if (this.form.ageLowerLimit > this.form.ageUpperLimit) {
        this.$message.error('年龄上限必须大于等于年龄下限')
        this.ageLimit = false
      } else {
        this.ageLimit = true
      }
    },
    getCurrentDate() {
      var now = new Date();
      var year = now.getFullYear(); //得到年份
      var month = now.getMonth();//得到月份
      var date = now.getDate();//得到日期
      var day = now.getDay();//得到周几
      var hour = now.getHours();//得到小时
      var minu = now.getMinutes();//得到分钟
      var sec = now.getSeconds();//得到秒
      month = month + 1;
      if (month < 10) month = "0" + month;
      if (date < 10) date = "0" + date;
      if (hour < 10) hour = "0" + hour;
      if (minu < 10) minu = "0" + minu;
      if (sec < 10) sec = "0" + sec;
      var time = "";
      time = hour + ":" + minu;
      return time;
    },
    beforeunloadHandler(e) {
      // alert(11111)
    },
    changestartTime0() {
      let curTime = Util.getTime()
      if (this.form.startTime == curTime) {
        this.form.startTime1 = ''
      }
    },
    checkunit(unit) {
      // unit =  (unit).toString().replace(/^(([1-9]\d{0,7})(\.\d{1,2})?|0\.[1-9]{1,2})$/);
      unit = (unit).toString().replace(/[^\d.]/g, "");  //清除“数字”和“.”以外的字符  
      unit = (unit).toString().replace(/\.{2,}/g, "."); //只保留第一个. 清除多余的  
      unit = (unit).toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
      unit = String(unit).replace(/^(.*\..{4}).*$/, "$1");
      this.$forceUpdate()
    },
    getIdetBtnList() {
      this.price = []
      this.industrySalaryList = []
      this.setindustry = []
      let parmas = {
        id: this.formDetail.id
      }
      this.$api.TaskDetail(parmas)
        .then(res => {
          this.form = res.data
          this.form.belongToName = `${res.data.belongTo},${res.data.taskType}`
          this.form.settlementType = res.data.settlementType.toString()
          this.form.people = res.data.authorizedNumber
          this.confirmPersonList = res.data.confirmPersonList
          this.form.textarea = res.data.otherDemand
          this.form.uppeLimit = res.data.uppeLimit.toString()
          this.form.endTime1 = res.data.endTime ? (res.data.endTime.split(' ')).slice(1).join() : ''
          this.form.startTime1 = res.data.startTime ? (res.data.startTime.split(' ')).slice(1).join() : ''
          this.form.startTime = res.data.startTime ? res.data.startTime.split(' ')[0] : ''
          this.form.endTime = res.data.endTime ? res.data.endTime.split(' ')[0] : ''
          for (let x in res.data.industrySalaryList) {
            res.data.industrySalaryList[x].priceLimit = JSON.parse(res.data.industrySalaryList[x].priceLimit)
            this.price.push(res.data.industrySalaryList[x].priceLimit.price[0])
          }
          this.form.workEndTime = res.data.workEndTime.substr(0, 5) || ''
          this.form.workStartTime = res.data.workStartTime.substr(0, 5) || ''
          this.form.maleNum = res.data.maleNumber ? res.data.maleNumber + '人' : '不限'
          this.form.femaleNum = res.data.femaleNumber ? res.data.femaleNumber + '人' : '不限'
          this.form.valuationType = '不可编辑'
          if (JSON.parse(res.data.price).valuationType == 7) {
            this.form.mUnit = '2'
          } else if (JSON.parse(res.data.price).valuationType == 6) {
            this.form.mUnit = '1'
            this.form.countType = '2'
          } else if (JSON.parse(res.data.price).valuationType == 5) {
            this.form.mUnit = '1'
            this.form.countType = '1'
          } else if (JSON.parse(res.data.price).valuationType == 4) {
            this.form.mUnit = '2'
          } else if (JSON.parse(res.data.price).valuationType == 3) {
            this.form.mUnit = '1'
            this.form.countType = '2'
          } else if (JSON.parse(res.data.price).valuationType == 2) {
            this.form.mUnit = '1'
            this.form.countType = '1'
          } else if (JSON.parse(res.data.price).valuationType == 1) {
            this.form.mUnit = ''
            this.form.countType = ''
          }
          this.industryListName = res.data.industryListName
          this.setindustry = res.data.industrySalaryList || []
          this.industry = res.data.taskIndustryNameList ? res.data.taskIndustryNameList.split(',') : ''
          if (res.data.receiveName) {
            this.form.mode = '2'
          } else {
            this.form.mode = '1'
          }
          this.form.manager = res.data.receiveName
        }).catch()
    },
    getPageinit() {
      // alert(123456)
      window.addEventListener('beforeunload', e => this.beforeunloadHandler(e))
      let userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.userInfo = userInfo;
      if (this.$route.name == 'editTask') {
        this.isEdit = true
      } else {
        this.isEdit = false
        this.mountsecond = 2
        this.mountFirst = 2
        this.form.signCustomerName = userInfo.customerName
      }
      this.maleList.push({
        label: '不限',
        value: 0
      })
      this.getSkill() //工种要求
      this.getPmList() //项目经理
      this.getBelongList()
      this.customerId = JSON.parse(localStorage.getItem('userInfo')).customerId
    }

  },
  mounted() {

    this.getPageinit()
  },
  created() {
    if (Number(this.addOrIdetStatus) === 2) {
      this.addOrIdetStatus = 2
      // this.getIdetBtnList()
    } else if (Number(this.addOrIdetStatus) === 1) {
      this.addOrIdetStatus = 1
      this.isEdit = false
      // this.form.mode = '2'
      // this.form.settlementType = '2'
    }
  },
  computed: {
    ladderCount: function () {
      return this.form.ladderObj[this.form.ladderObj.length - 1].count == '' ? 0 : this.form.ladderObj[this.form.ladderObj.length - 1].count
    },
    ladderUnit: function () {
      return this.form.ladderObj[this.form.ladderObj.length - 1].unit == '' ? 0 : this.form.ladderObj[this.form.ladderObj.length - 1].unit
    },
    ladderOverUnit: function () {
      return this.form.ladderObj[this.form.ladderObj.length - 1].overUnit == '' ? 0 : this.form.ladderObj[this.form.ladderObj.length - 1].overUnit
    },
    initIndustry() {
      return this.industryListName ? this.industryListName.split(',') : ''
    }
  },
  watch: {
    'form.belongToName': function (val, oldval) {
    },
    'form.startTime1': function (val, old) {
      this.$forceUpdate();
    },
    'form.workEndTime': function (val, old) {
      this.$forceUpdate();
    },
    'form.endWorkType': function (val, old) {
      this.$forceUpdate();
    },
    'form.workingPlace': function (val, old) {
      this.$forceUpdate();
    },
    'form.endTime1': function (val, old) {
      this.$forceUpdate();
    },
    'form.manager': function (val, old) {
      this.$forceUpdate()
    },
    'form.settlementType': function (val, old) {
      this.$forceUpdate()
    },
    addTaskVisible: {
      handler(val, oldval) {
        if (val == false) {
          if (Number(this.addOrIdetStatus) === 1) {
            this.industry = []
            this.getWindowFuoceUpdate()
          } else if (Number(this.addOrIdetStatus) === 2) {
            this.form = {}
            this.industry = []
            this.setindustry = []
            this.price = []
            this.getList()
            this.getPageinit()
            this.$forceUpdate()
          }
        } else {
          // this.getIdetBtnList()
          if (Number(this.addOrIdetStatus) === 2) {
            this.getIdetBtnList()
            this.$forceUpdate()
            this.getPageinit()
          } else if (Number(this.addOrIdetStatus) === 1) {
            this.form.mode = '2' //添加任务时，项目经理字段，需默认选择指派(未响应)
            this.form.settlementType = '2' //添加任务时，结算方式需默认选择月结(未响应)
            this.$forceUpdate()
          }
        }
      },
      deep: true,
      immediate: true
    },
    'form.settlementType': function (val, old) {
      if (val) {
        this.$forceUpdate();
      }
    },
    industry: function (val, old) {
      if (val.length > old.length) {
        let item = {
          countTime: '',
          countSettle: '',
          countChe: '',
          countDun: '',
          countDai: '',
        }
        this.price.push(item)
      } else {
        this.price.pop()
      }
    },
    'form.mode': function (val, old) {
      if (val == 1) {
        this.isCheckM = true
      }
      this.form.manager = ''
    },
    'form.countType': function (val, old) {
      if (val == 2) {
        this.isCheckS = true
        this.form.settleCount = ''
      }

    },
    'form.maleNum': function (val, old) {
      if (val != 0) {
        this.femaleForm = true
        if (this.form.people) {
          this.form.femaleNum = this.form.people - val
        } else {
          this.form.femaleNum = 0
        }

      } else {
        this.femaleForm = false
      }
    },
    'form.people': function (val, old) {
      this.isMaleAble = false
      this.maleList = []
      this.form.maleNum = 0
      for (let i = 1; i <= this.form.people; i++) {
        let obj = {
          label: i,
          value: i
        }

        this.maleList.push(obj)
      }
      this.maleList.unshift({
        label: '不限',
        value: 0
      })
    },
    mapDia: function (val, old) {
      if (val == true) {
        this.mapConfig.keyword = ''

      }
    },
    // 'form.workStartTime': function (val, old) {
    //   if (this.mountsecond != 1) {
    //     if (val) {
    //       if (this.form.endWorkType == 1) {
    //         this.range = this.form.workStartTime
    //         this.form.workEndTime = ''
    //       } else {
    //         this.range = ''
    //         this.form.workEndTime = ''
    //       }
    //     } else {
    //       this.form.workEndTime = ''
    //     }
    //   } else {
    //     this.mountsecond = 2
    //   }
    // },
    // 'form.endWorkType': function (val, old) {
    //   if (this.mountFirst != 1) {
    //     if (val == 1) {
    //       if (this.form.workStartTime) {
    //         this.form.workEndTime = ''
    //         this.range = this.form.workStartTime
    //       } else {
    //         this.range = ''
    //       }
    //     } else {
    //       this.range = ''
    //     }
    //   } else {
    //     this.mountFirst = 2
    //   }
    // },
    // 'form.uppeLimit': function (val, old) {
    //   if (this.addOrIdetStatus == 2) {
    //     this.form.uppeLimit = this.formDetail.uppeLimit.toString()
    //   } else {
    //     this.form.uppeLimit = ''
    //   }
    // },
    'form.uppeLimit': function (val, old) {
    },
    // setTimer: function (val, old) {
    //   if (val == false) {
    //     this.setTimerCount()
    //   } else {
    //     clearInterval(this.timer);
    //     // this.timer = null
    //   }
    // },
    'form.mWay': function (val, old) {
      if (val == 1) {
        this.varUnit = '件'
      } else if (val == 2) {
        this.varUnit = '袋'
      }
      else if (val == 3) {
        this.varUnit = '车'
      } else if (val == 4) {
        this.varUnit = '吨'
      }
    },
    'form.startTime': function (val, old) {
      let curTime = Util.getTime()
      if (this.form.startTime == curTime) {
        this.rangeStart = this.getCurrentDate()
      } else {
        this.rangeStart = ''
      }
    },
    newPrice: {
      handler(val, oldVal) {
        if (val.price[0]) {
          let price = val.price[0]
          let content = ''
          if (val.valuationType == 1) {
            content = `${price.countTime || '0'}元/小时`
          } else if (val.valuationType == 2) {
            if (val.unit == 1) {
              content = `${price.countSettle || '0'}元/件`
            } else if (val.unit == 2) {
              content = `${price.countDai || '0'}元/袋`
            } else if (val.unit == 3) {
              content = `${price.countChe || '0'}元/车`
            } else {
              content = `${price.countDun || '0'}元/吨`
            }
          } else if (val.valuationType == 3) {
            let varUnit
            if (val.unit == 1) {
              varUnit = '件'
            } else if (val.unit == 2) {
              varUnit = '袋'
            } else if (val.unit == 3) {
              varUnit = '车'
            } else {
              varUnit = '吨'
            }
            content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
            for (let i in price.ladderObj) {
              if (i > 0 && i != (price.ladderObj.length - 1)) {
                content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`
              }
            }
            content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
          } else if (val.valuationType == 4) {
            if (price.countSettle) {
              content += `${price.countSettle || '0'}元/件,`
            } if (price.countDai) {
              content += `${price.countDai || '0'}元/袋,`
            } if (price.countChe) {
              content += `${price.countChe || '0'}元/车,`
            } if (price.countDun) {
              content += `${price.countDun || '0'}元/吨`
            }
          } else if (val.valuationType == 5) {
            content += `${price.countTime || '0'}元/小时,`
            if (val.unit == 1) {
              content += `${price.countSettle || '0'}元/件`
            } else if (val.unit == 2) {
              content += `${price.countDai || '0'}元/袋`
            } else if (val.unit == 3) {
              content += `${price.countChe || '0'}元/车`
            } else {
              content += `${price.countDun || '0'}元/吨`
            }
          } else if (val.valuationType == 6) {
            content += `${price.countTime || '0'}元/小时,`
            let varUnit
            if (val.unit == 1) {
              varUnit = '件'
            } else if (val.unit == 2) {
              varUnit = '袋'
            } else if (val.unit == 3) {
              varUnit = '车'
            } else {
              varUnit = '吨'
            }
            content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
            for (let i in price.ladderObj) {
              if (i > 0 && i != (price.ladderObj.length - 1)) {
                content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`
              }
            }
            content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
          } else {
            content += `${price.countTime || '0'}元/小时,`
            if (price.countSettle) {
              content += `${price.countSettle || '0'}元/件,`
            } if (price.countDai) {
              content += `${price.countDai || '0'}元/袋,`
            } if (price.countChe) {
              content += `${price.countChe || '0'}元/车,`
            } if (price.countDun) {
              content += `${price.countDun || '0'}元/吨`
            }
          }
          this.content = content
        } else {
          return ''
        }
      },
      deep: true
    }
  },
  beforeDestroy() {
    clearInterval(this.timer)
  },
  destroyed() {
    window.removeEventListener('beforeunload', e => this.beforeunloadHandler(e))
  }
}
</script>
