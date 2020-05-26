<template>
  <div class="price-setting back-white">
    <!-- <div>
      <table class="setting-info-table" cellspacing="0" cellpadding="0">
        <tr class="header">
          <td width="30%">工种</td>
          <td width="70%">单价上限</td>
        </tr>
        <tr v-for="(item,index) in form">
          <td>{{item.dicName}}</td>
          <td>
            <div class="tableset-input">
              <el-form :ref="'form'+index" :model="form[index].Json" label-width="70px" labelPosition="left">
                <el-form-item label="计时：" prop='countTime' :rules="[ {pattern: /^(([1-9]\d*)(\.\d{1,4})?|0\.[0-9]{0,3}[1-9])$/, message: '请输入正确的单价', trigger: ['blur', 'change']}]" inline-message>
                  <div class="input-forunit">
                    <el-input class="rant-input " v-model="form[index].Json.countTime">
                    </el-input>
                    <span class="input-unit">元/小时</span>
                  </div>

                </el-form-item>
                <el-form-item label="计件：" prop='countSettle' :rules="[ {pattern: /^(([1-9]\d*)(\.\d{1,4})?|0\.[0-9]{0,3}[1-9])$/, message: '请输入正确的单价', trigger: ['blur', 'change']}]">
                  <div class="input-forunit">
                    <el-input class="rant-input " v-model="form[index].Json.countSettle">
                    </el-input>
                    <span class="input-piece">元/件</span>
                  </div>

                </el-form-item>
                <el-form-item label="计袋：" prop='countDai' :rules="[ {pattern: /^(([1-9]\d*)(\.\d{1,4})?|0\.[0-9]{0,3}[1-9])$/, message: '请输入正确的单价', trigger: ['blur', 'change']}]">
                  <div class="input-forunit">
                    <el-input class="rant-input " v-model="form[index].Json.countDai">
                    </el-input>
                    <span class="input-piece">元/袋</span>
                  </div>

                </el-form-item>
                <el-form-item label="计吨：" prop='countDun' :rules="[ {pattern: /^(([1-9]\d*)(\.\d{1,4})?|0\.[0-9]{0,3}[1-9])$/, message: '请输入正确的单价', trigger: ['blur', 'change']}]">
                  <div class="input-forunit">
                    <el-input class="rant-input " v-model="form[index].Json.countDun">
                    </el-input>
                    <span class="input-piece">元/吨</span>
                  </div>

                </el-form-item>
                <el-form-item label="计车：" prop='countChe' :rules="[ {pattern: /^(([1-9]\d*)(\.\d{1,4})?|0\.[0-9]{0,3}[1-9])$/, message: '请输入正确的单价', trigger: ['blur', 'change']}]">
                  <div class="input-forunit">
                    <el-input class="rant-input " v-model="form[index].Json.countChe">
                    </el-input>
                    <span class="input-piece">元/车</span>
                  </div>

                </el-form-item>
              </el-form>
            </div>
          </td>
        </tr>
      </table>
    </div> -->

    <div class="back-white btn-div flexable">
      <el-button class="primary-btn" size="mini" @click="handleSubmit">保存</el-button>
    </div>

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
        <tr v-for="(item,index) in form">
          <td>{{ item.dicName }}</td>
          <td>
            <el-input class="rant-input " v-model="form[index].Json.countTime"></el-input>
            <span class="input-piece">元/小时</span>
          </td>
          <td>
            <el-input class="rant-input " v-model="form[index].Json.countSettle"></el-input>
            <span class="input-piece">元/件</span>
          </td>
          <td>
            <el-input class="rant-input " v-model="form[index].Json.countDai"></el-input>
            <span class="input-piece">元/袋</span>
          </td>
          <td>
            <el-input class="rant-input " v-model="form[index].Json.countChe"></el-input>
            <span class="input-piece">元/车</span>
          </td>
          <td>
            <el-input class="rant-input " v-model="form[index].Json.countDun"></el-input>
            <span class="input-piece">元/吨</span>
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
  name: "PriceSetting",
  components: {
    ElButton,
    BigImage
  },
  data() {
    return {
      isEdit: false,
      skillList: [],
      form: [],
      visible: false,
      msg: "Hello Vue.js",
    }
  },

  filters: {
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
    formatAccountStatus(val) {

    }
  },

  created() {

  },
  mounted() {
    this.getSalaryList()
    //      this.getSkill()
  },
  methods: {
    handleSubmit() {
      let validResult = true;
      //        for (let x in this.form) {
      //         if(this.form[x].timeLimit==''){
      //           this.$message.error(this.form[x].dicName+'计时不能为空！')
      //           validResult=false
      //           return false
      //         }
      //         if(this.form[x].pieceLimit==''){
      //           this.$message.error(this.form[x].dicName+'计件不能为空！')
      //           validResult=false
      //           return false
      //         }
      //        }
      let regu = /^(([1-9]\d*)(\.\d{1,4})?|0\.[0-9]{0,3}[1-9])$/
      let re = new RegExp(regu);
      console.log(this.form)
      for (let x in this.form) {
        console.log(this.form[x].Json.countChe)
        if (this.form[x].Json.countTime && !re.test(this.form[x].Json.countTime)) {
          this.$message.error(this.form[x].dicName + '计时请输入正确的单价！')
          validResult = false
          return false
        }
        if (this.form[x].Json.countSettle && !re.test(this.form[x].Json.countSettle)) {
          this.$message.error(this.form[x].dicName + '计件请输入正确的单价！')
          validResult = false
          return false
        }
        if (this.form[x].Json.countDai && !re.test(this.form[x].Json.countDai)) {
          this.$message.error(this.form[x].dicName + '计袋请输入正确的单价！')
          validResult = false
          return false
        }
        if (this.form[x].Json.countDun && !re.test(this.form[x].Json.countDun)) {
          this.$message.error(this.form[x].dicName + '计吨请输入正确的单价！')
          validResult = false
          return false
        }
        if (this.form[x].Json.countChe && !re.test(this.form[x].Json.countChe)) {
          this.$message.error(this.form[x].dicName + '计车请输入正确的单价！')
          validResult = false
          return false
        }
      }
      if (validResult) {
        let para = []
        for (let x in this.form) {
          let price = []
          price.push(
            this.form[x].Json
          )
          let priceLimit = {}
          priceLimit.price = price
          para.push({
            industry: this.form[x].industry,
            dicName: this.form[x].dicName,
            priceLimit: JSON.stringify(priceLimit),
            id: this.form[x].id,
          })
        }
        console.log(para)
        if (!this.isEdit) {
          this.$api.SalaryAdd(para).then((response) => {
            if (response.data.respCode == 0) {
              this.$message.success('工种价格设置成功')
            }
          }).catch((error) => {
            console.log(error);
          });
        } else {
          this.$api.SalaryUpdate(para).then((response) => {
            if (response.data.respCode == 0) {
              this.$message.success('工种价格设置成功')
            }
          }).catch((error) => {
            console.log(error);
          });
        }

      }
    },
    getSkill() {
      let params = {
        code: 'industry',
        level: 2
      }

      this.$api
        .GetAllTags(params)
        .then(response => {
          console.log(response)
          this.skillList = response.data;
          for (let x in this.skillList) {
            this.form.push({
              industry: this.skillList[x].dicVal,
              dicName: this.skillList[x].dicName,
              Json: {},
            })
          }
        })
        .catch(error => {
          console.log(error);
        });
    },
    getSalaryList() {
      this.form = []
      let params = {
        pageNum: 1,
        pageSize: 9999,
        customerId: 4
      }
      this.$api
        .SalaryList(params)
        .then(response => {
          console.log(response.data.list)
          if (response.respCode == 0) {
            if (response.data.list) {
              this.skillList = response.data.list;
              console.log(this.skillList)
              for (let x in this.skillList) {
                this.form.push({
                  industry: this.skillList[x].industry,
                  dicName: this.skillList[x].industryName,
                  Json: JSON.parse(this.skillList[x].priceLimit).price[0],
                  id: this.skillList[x].id,
                })
              }
              this.isEdit = true;
            } else {
              this.isEdit = false;
              this.getSkill()
            }
          }
          console.log('isEdit:' + this.isEdit)

        })
        .catch(error => {
          console.log(error);
        });
    },
    handleWrapperClick() {
      this.visible = false
    },
  }
}
</script>

<style lang="scss">
.price-setting {
  table {
    width: 100%;
    border-spacing: 0;
  }
  thead {
    th {
      padding: 12px 0;
      min-width: 160px;
      font-weight: normal;
    }
    th:nth-of-type(1) {
      padding-left: 35px;
    }
  }
  .el-input {
    display: inline-block;
    width: 80px;
  }
  tbody {
    tr {
      td {
        padding: 24px 0;
      }
      td:nth-of-type(1) {
        padding-left: 35px;
      }
    }
    tr:nth-of-type(odd) {
      background-color: #fff;
    }
    tr:nth-of-type(even) {
      background-color: #f5f5f7;
    }
    .el-input__inner {
      height: 22px;
      line-height: 22px;
    }
  }
}
/* .btnDiv {
  width: 100%;
  text-align: center;
  margin: 70px 0px;
}

table {
  border-right: solid 1px #e4e4e4;
  border-bottom: solid 1px #e4e4e4;
  font-size: 14px;
}

td {
  border-left: solid 1px #e4e4e4;
  border-top: solid 1px #e4e4e4;
  height: 130px;
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
  height: 66px;
}

.setting-info-table {
  width: 100%;
  text-align: center;
}

.input-forunit {
  position: relative;
  width: 85%;
}

.input-unit {
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 90px;
  letter-spacing: 0px;
  color: #262626;
  position: absolute;
  right: -80px;
  top: -23px;
}

.input-piece {
  font-family: MicrosoftYaHei;
  font-size: 16px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 90px;
  letter-spacing: 0px;
  color: #262626;
  position: absolute;
  right: -66px;
  top: -23px;
}

.tableset-input {
  padding: 22px 40px 0;
} */
</style>