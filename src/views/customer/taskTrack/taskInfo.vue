<template>
  <div class="taskBaseInfoCon">
    <div class="box-body-item">
      <div class="table-info info-item">
        <div class="table-info-col1"><span>任务名称</span></div>
        <div class="table-info-col2 setLimit"><span>{{this.form.taskName}}</span></div>
        <div class="table-info-col1"><span>状态</span></div>
        <div class="table-info-col2"><span>{{this.form.receiveStatus | formatStatus}}</span></div>
        <div class="table-info-col1"><span>任务所属</span></div>
        <div class="table-info-col2 setLimit"><span>{{this.form.belongToName}}</span></div>
        <div class="table-info-col1"><span>开始时间</span></div>
        <div class="table-info-col2"><span>{{this.form.startTime | formatminDate}}</span></div>
        <div class="table-info-col1"><span>结束时间</span></div>
        <div class="table-info-col2 text-overflow">
          <span>{{this.form.endTime | formatminDate}}</span>
        </div>
        <div class="table-info-col1"><span>结算方式</span></div>
        <div class="table-info-col2"><span>{{this.form.settlementType | settlementTypeFilter }}</span></div>
        <div class="table-info-col1"><span>任务单价</span></div>
        <div class="table-info-col2 text-overflow setLimit">
          <span>
            <el-tooltip class="item" effect="dark" :content="content" placement="top-start">
              <span class="text-overflow">
                {{content}}
              </span>
            </el-tooltip>
          </span>
        </div>
        <div class="table-info-col1"><span>上班时间</span></div>
        <div class="table-info-col2"><span>{{this.form.workStartTime | formatTimeString}}</span></div>
        <div class="table-info-col1"><span>下班时间</span></div>
        <div class="table-info-col2 text-overflow">
          <span>{{this.form.endWorkType == 1 ? '当日' : '次日' }}{{this.form.workEndTime | formatTimeString}}</span>
        </div>
        <div class="table-info-col1"><span>打卡地点</span></div>
        <div class="table-info-col2 text-overflow setLimit"><span>
            <el-tooltip class="item" effect="dark"  :content="form.workingPlace" placement="top-start">
              <span class="text-overflow">
                {{form.workingPlace}}
              </span>
            </el-tooltip>
          </span></div>
        <div class="table-info-col1"><span>性别要求</span></div>
        <div class="table-info-col2">
          <span> 男工{{this.form.maleNumber | formatNumber}}</span>、
          <span> 女工{{this.form.femaleNumber| formatNumber}}</span>
        </div>
        <div class="table-info-col1"><span>年龄要求</span></div>
        <div class="table-info-col2 text-overflow">
          <span> {{this.form.ageLowerLimit}}到{{this.form.ageUpperLimit}}岁</span>
        </div>
        <div class="table-info-col1"><span>工种要求</span></div>
        <div class="table-info-col2 text-overflow setLimit">
          <!-- industryList -->
          <el-tooltip class="item" effect="dark" :content="taskIndustryList" placement="top-start">
            <span class="text-overflow">{{taskIndustryList}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>其他要求</span></div>
        <div class="table-info-col2 setLimit">
          <el-tooltip class="item" effect="dark" :disabled="!this.form.otherDemand" :content="this.form.otherDemand" placement="top-start">
            <span show-overflow-tooltip>{{this.form.otherDemand?this.form.otherDemand:'无'}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>创建时间</span></div>
        <div class="table-info-col2"><span>{{this.form.createdAt | formatminDate}}</span></div>
        <div class="table-info-col1"><span>核定人数</span></div>
        <div class="table-info-col2"><span>{{this.form.cusAuthorizedNumber}}</span></div>
        <div class="table-info-col1"><span>预估总量</span></div>
        <div class="table-info-col2"><span>{{this.form.expectPieceSize || 0}}</span></div>
        <div class="table-info-col1"><span>预估总价</span></div>
        <div class="table-info-col2"><span>{{this.form.expectMoney || 0}}</span></div>
      </div>
    </div>
  </div>
</template>

<script>
  import util from '@/common/util'
  export default {
    data() {
      return {
        form: {
          taskType:'',
        },
        visible: false,
        price: {},
        content: '',
        taskIndustryList:'',
      }
    },
    filters: {
      settlementTypeFilter(val){
        let status = '';
        if (val) {
          switch (Number.parseInt(val)) {
            case 1:
              status = '日结'
              break
            case 2:
              status = '月结'
              break
            case 4:
              status = '周结'
              break
          }
        } else {
          status = '无';
        }
        return status
      },
      formatTimeString(val) {
        if (val) {
          return val.substring(0, 5)
        } else {
          return '无'
        }
      },
      formatminDate(val) {
        if(val){
          return util.minDate(val)
        }else{
          return '永久'
        }

      },
      formatuppeLimit(val) {
        if (val == 1) {
          return '启用'
        } else if (val == 2) {
          return '关闭'
        } else {
          return ''
        }
      },
      formatNumber(val) {
        if (val == null) {
          return '不限'
        } else {
          return val + '人';
        }
      },
      formatUnit(val) {
        if (val == 1) {
          return '件'
        } else if (val == 2) {
          return '吨';
        }
      },
      formatStatus(val) {
        if (val == 1) {
          return '待领取'
        } else if (val == 2) {
          return '领取完毕'
        } else if (val == 3) {
          return '关闭'
        } else {
          return ''
        }
      }
    },
    mounted() {
      this.getDetail()
    },
    methods: {
      getDetail() {
        const params = {
          id: this.$route.query.id,
        }
        this.$api.assignmentInfoDetail(params).then((res) => {
          let { data,respCode } = res;
          if( respCode === 0 ){
               this.form = data;
              this.price = JSON.parse(this.form.price);
              let testSet = new Set(this.form.industryListName.split(','));
              let bridge = Array.from(testSet.values());
              let reStr = bridge.join(',');
              this.taskIndustryList = reStr ? reStr :'';  
          }
        }).catch((error) => {
          console.log(error);
        });
      },
      handleWrapperClick() {
        this.visible = false
      },
    },
    watch: {
      price: {//深度监听，可监听到对象、数组的变化
        handler(val, oldVal) {
          let price = val.price[0];
          let content = '';
          let ValuationType = Number( val.valuationType );
          if (ValuationType == 1) {
            content = `${price.countTime || '0'}元/小时`
          } else if (ValuationType == 2) {
            if (val.unit == 1) {
              content = `${price.countSettle || '0'}元/件`
            } else if (val.unit == 2) {
              content = `${price.countDai || '0'}元/袋`
            } else if (val.unit == 3) {
              content = `${price.countChe || '0'}元/车`
            } else {
              content = `${price.countDun || '0'}元/吨`
            }
          } else if (ValuationType == 3) {
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

          } else if (ValuationType == 4) {

            if (price.countSettle) {
              content += `${price.countSettle || '0'}元/件,`
            } if (price.countDai) {
              content += `${price.countDai || '0'}元/袋,`
            } if (price.countChe) {
              content += `${price.countChe || '0'}元/车,`
            } if (price.countDun) {
              content += `${price.countDun || '0'}元/吨`
            }

          } else if (ValuationType == 5) {

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

          } else if (ValuationType == 6) {

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

          } else if (ValuationType == 8) {

            content += `${price.countFixed}元/天`

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
        },
        deep: true
      },
    }
  }
</script>
<style scoped lang="scss">
  .taskBaseInfoCon {
    .setLimit {
      height: 56px;
      overflow: hidden;
    }
  }
  .info-item {
    margin: 20px 0px;
  }
  .box-body-item-title {
    font-size: 18px;
    font-weight: normal;
    font-stretch: normal;
    letter-spacing: 0px;
    color: #262626;
    line-height: 40px;
  }
  .box-body-item {
    margin-top: 40px;
  }
  .table {
    padding: 20px;
  }
  .setting-table {
    width: 100%;
  }
  thead {
    width: 100%;
  }
  .rant-input {
    width: 180px;
  }
</style>