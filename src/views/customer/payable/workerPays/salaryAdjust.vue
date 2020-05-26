<template>
  <div class="back-white">
    <div class="overflow-box" style="width:646px;">
      <div class="box-title"><span>收入调整</span></div>
      <p class="border-tip">调整后本批次将不再允许奖惩</p>
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form ref="form" :model="form" label-width="150px" label-position="left" :rules="rules">
              <el-form-item label="零工">
                {{name}}
              </el-form-item>
              <el-form-item :label="item.dicName" v-for="(item,index) in form.unsettleList" :key="index" :prop="'unsettleList.' + index + '.amount'" :rules="[
//                                              { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                                               {pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[0-9][1-9])$/, message: '请输入正确的金额', trigger: ['change']}
    ]">
                <span v-if="item.dicVal>0">增加 &nbsp;</span>
                <span v-if="item.dicVal<0">扣减 &nbsp;</span>
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model.number="item.amount" maxlength="128" style="width: 85%;"></el-input>元
              </el-form-item>

            </el-form>
          </div>
        </div>
      </div>
      <div class="box-footer">
        <el-button round size="medium" type="primary" @click="handleSubmit">确 定</el-button>
        <el-button round size="medium" @click="$router.go(-1)">取 消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import ElRow from "element-ui/packages/row/src/row";
export default {
  name: "",
  components: { ElRow },
  data() {
    return {
      form: {
        unsettleList: '',
      },
      id: '',
      name: '',
      talentId: '',
      nextDate: '',
      belongtoList: [],
      taskList: [],
      isEdit: false,
      fileList: [],
      upload_form: {},
      rules: {
        creditCode: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          { pattern: /^[a-z0-9]*$/, message: '统一社会信用代码为数字或字母' },
          //            { validator: validateRepeatC, trigger: 'blur' }
        ],
      },
      options: [],
      provinceList: [],
      cityList: [],
      regionList: [],
      insdutryList: [],
      value: '',
      customerId: '',
      count1: '',
      count2: '',
    }
  },
  watch: {

  },
  mounted() {
    this.id = this.$route.params.id
    this.name = this.$route.params.name
    this.talentId = this.$route.params.talentId
    this.getsettleList()
  },
  methods: {
    getsettleList() {
      const params = {
        salaryId: this.$route.params.id,
        //          salaryId:1,
      }
      console.log(params)

      this.$api.unsettleList(params).then((response) => {
        if (response.respCode == 0) {
          this.form.unsettleList = response.data
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    handleSubmit() {
      let adjustment = [];
      for (let x in this.form.unsettleList) {
        let obj = this.form.unsettleList[x]
        if (obj.amount) {
          adjustment.push({
            amount: (obj.dicVal < 0 ? '-' : '') + (obj.amount ? obj.amount : 0),
            salaryId: this.id,//写死
            talentId: this.talentId,//写死
            type: obj.dicVal,
            talentName: this.name
          })
        }
      }

      this.$api
        .adjustmentAdd(adjustment)
        .then(response => {
          if (response.data.respCode == 0) {
            this.$message.success('操作成功')
            this.$router.go(-1)
          }
        })
        .catch(error => {
          console.log(error);
        });
    },

  }
}
</script>

<style scoped>
.btnborder {
  border: solid 1px #e84518;
  color: #e84518;
  /*padding: 12px 22px;*/
}
.marginleft20 {
  margin-left: 20px;
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
  margin: 40px;
}
.box-body-form {
  margin: 20px;
}
.line {
  height: 1px;
  background-color: #e5e5e5;
  width: 100%;
}
.overflow-box {
  font-family: MicrosoftYaHei;
  background-color: #ffffff;
  box-shadow: 0px 2px 21px 0px rgba(156, 156, 156, 0.35);
  border-radius: 8px;
  margin: 70px auto;
  padding-bottom: 36px;
}
.box-title {
  text-align: center;
  padding-top: 35px;
  width: 100%;
  font-family: PingFang-SC-Medium;
  font-size: 24px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 1px;
  color: #262626;
}
.box-title span {
  padding-bottom: 10px;
  border-bottom: 3px solid #e84518;
  border-radius: 1px;
}
.box-footer {
  text-align: center;
  margin-bottom: 40px;
}
.box-body1 {
  padding: 10px;
  /*height: 300px;*/
}
.note-label {
  font-family: PingFang-SC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #666666;
}
.border-tip {
  width: 100%;
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #666666;
}
</style>