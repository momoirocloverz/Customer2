<template>
  <div class="job-baseinfo">
    <div class="box-body-item">
      <div class="table-title">基本信息</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>工种</span></div>
        <div class="table-info-col2"><span>{{infoDetail.industryName}}</span></div>
        <div class="table-info-col1"><span>项目经理</span></div>
        <div class="table-info-col2"><span>{{infoDetail.managerNameAlias}}</span></div>
        <div class="table-info-col1"><span>所属任务</span></div>
        <div class="table-info-col2"><span>{{infoDetail.taskName}}</span></div>
        <div class="table-info-col1"><span>结算方式</span></div>
        <div class="table-info-col2"><span>{{infoDetail.jobType | jobTypeFilter}}</span></div>
        <div class="table-info-col1"><span>接收简历数量</span></div>
        <div class="table-info-col2"><span>{{infoDetail.maxRecommend}}</span></div>
        <div class="table-info-col1"><span>劳务地点</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="infoDetail.workingPlace" placement="top-start">
            <span>{{infoDetail.workingPlace}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>亮点</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="infoDetail.highlightNameList || '无'" placement="top-start">
            <span>{{infoDetail.highlightNameList || '无'}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>创建时间</span></div>
        <div class="table-info-col2"><span>{{infoDetail.createdAt}}</span></div>
        <div class="table-info-col1"><span>发布时间</span></div>
        <div class="table-info-col2"><span>{{infoDetail.publishTime}}</span></div>
        <div class="table-info-col1"><span>关闭时间</span></div>
        <div class="table-info-col2"><span>{{infoDetail.closeTime}}</span></div>
      </div>
    </div>

    <div class="box-body-item">
      <div class="table-title">劳务福利</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>劳务费</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="infoDetail.industryName" placement="top-start">
            <span>{{infoDetail.incomeRangeUnit}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>发放日期</span></div>
        <div class="table-info-col2"><span>{{infoDetail.payDay}}</span></div>
        <div class="table-info-col1"><span>伙食情况</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="infoDetail.mealSituation || '无'" placement="top-start">
            <span>{{infoDetail.mealSituation || '无'}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>住宿情况</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="infoDetail.hotelSituation || '无'" placement="top-start">
            <span>{{infoDetail.hotelSituation || '无'}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>其他福利</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="infoDetail.otherWelfare || '无'" placement="top-start">
            <span>{{infoDetail.otherWelfare || '无'}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span></span></div>
        <div class="table-info-col2"><span></span></div>
      </div>
    </div>

    <div class="box-body-item">
      <div class="table-title">劳务说明</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>劳务内容</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="infoDetail.industryName" placement="top-start">
            <span>{{infoDetail.workingContent}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>劳务时间</span></div>
        <div class="table-info-col2"><span>{{infoDetail.workingTime}}</span></div>
        <div class="table-info-col1"><span>劳务方式</span></div>
        <div class="table-info-col2"><span>{{infoDetail.workingWay | workingWayFilter}}</span></div>
        <div class="table-info-col1"><span></span></div>
        <div class="table-info-col2"><span></span></div>
      </div>
    </div>

    <div class="box-body-item">
      <div class="table-title">劳务要求</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>性别要求</span></div>
        <div class="table-info-col2"><span>{{infoDetail.sex | sexFilter}}</span></div>
        <div class="table-info-col1"><span>年龄要求</span></div>
        <div class="table-info-col2"><span>{{`${infoDetail.ageLowerLimit} - ${infoDetail.ageUpperLimit}`}}</span></div>
        <div class="table-info-col1"><span>学历要求</span></div>
        <div class="table-info-col2"><span>{{infoDetail.education | educationFilter}}</span></div>
        <div class="table-info-col1"><span>其他要求</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="infoDetail.industryName" placement="top-start">
            <span>{{infoDetail.otherRequirements || '无'}}</span>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'JobBaseinfo',
  props: {
    infoDetail: {}
  },
  filters: {
    jobTypeFilter(value) {
      let result = ''
      switch (Number(value)) {
        case 1:
          result = '日结'
          break;
        case 2:
          result = '月结'
          break;
        case 4:
          result = '周结'
          break;
        default:
          break;
      }
      return result
    },
    workingWayFilter(value) {
      let result = ''
      switch (Number(value)) {
        case 1:
          result = '坐班'
          break;
        case 2:
          result = '站班'
          break;
        case 3:
          result = '坐站都有'
          break;
        default:
          break;
      }
      return result
    },
    sexFilter(value) {
      let result = ''
      switch (Number(value)) {
        case 1:
          result = '男'
          break;
        case 2:
          result = '女'
          break;
        case 3:
          result = '不限'
          break;
        default:
          break;
      }
      return result
    },
    educationFilter(value) {
      let result = ''
      switch (Number(value)) {
        case 1:
          result = '不限'
          break;
        case 2:
          result = '初中'
          break;
        case 3:
          result = '高中'
          break;
        case 4:
          result = '中专/技校'
          break;
        case 5:
          result = '大专'
          break;
        case 6:
          result = '本科及以上'
          break;
        default:
          break;
      }
      return result
    }
  }
}
</script>
