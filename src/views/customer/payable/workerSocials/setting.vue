<template>
  <div class="overflow-box">
    <p class="base-dialog-title">添加零工社保信息</p>
    <div class="box-body">
      <div class="box-body-item">
        <div class="box-body-form">
          <el-form ref="form" :model="form" label-width="150px" label-position="left" :rules="rules">
            <el-form-item label="养老保险缴纳比例" prop="oldAgePension">
              <el-input class="radius-input workerInp" size="medium" v-model.number="form.oldAgePension" style="width: 90%;" @blur="checkSum"></el-input> %
            </el-form-item>
            <el-form-item label="医疗保险缴纳比例" prop="medicalInsurance">
              <el-input class="radius-input workerInp" size="medium" v-model.number="form.medicalInsurance" style="width: 90%;" @blur="checkSum"></el-input> %
            </el-form-item>
            <el-form-item label="失业保险缴纳比例" prop="unemploymentInsurance">
              <el-input class="radius-input workerInp" size="medium" v-model.number="form.unemploymentInsurance" style="width: 90%;" @blur="checkSum"></el-input> %
            </el-form-item>
            <el-form-item label="公积金缴纳比例" prop="accumulationFund">
              <el-input class="radius-input workerInp" placeholder="" size="medium" v-model.number="form.accumulationFund" style="width: 90%;" @blur="checkSum"></el-input> %
            </el-form-item>
            <el-form-item label="生效月份" prop="takeEffectMonth">
              <el-radio-group v-model="form.takeEffectMonth">
                <el-radio label="1">本月</el-radio>
                <el-radio label="2" v-if="monthShow">次月</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
    <div class="box-footer">
      <el-button size="medium" type="primary" :loading="loading" @click="handleSubmit">保存</el-button>
      <el-button size="medium" @click="handleCancel">取消</el-button>
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
      loading: false,
      monthShow: true,
      routeForm: '',
      form: {
        oldAgePension: '',
        medicalInsurance: '',
        unemploymentInsurance: '',
        accumulationFund: '',
        takeEffectMonth: '1',
      },
      rules: {
        oldAgePension: [
          { required: true, message: '养老保险缴纳比例不能为空', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[0-9]{1,2})$/, message: '请输入正确的比例', trigger: ['blur', 'change'] }
        ],
        medicalInsurance: [
          { required: true, message: '医疗保险缴纳比例不能为空', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[0-9]{1,2})$/, message: '请输入正确的比例', trigger: ['blur', 'change'] }
        ],
        unemploymentInsurance: [
          { required: true, message: '失业保险缴纳比例不能为空', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[0-9]{1,2})$/, message: '请输入正确的比例', trigger: ['blur', 'change'] }
        ],
        accumulationFund: [
          { required: true, message: '公积金缴纳比例不能为空', trigger: 'blur' },
          { pattern: /^(([1-9]\d*)(\.\d{1,2})?|0\.[0-9]{1,2})$/, message: '请输入正确的比例', trigger: ['blur', 'change'] }
        ],
        takeEffectMonth: [
          { required: true, message: '生效月份不能为空', trigger: 'blur' },
        ],
      },
    }
  },
  watch: {
    'form.belongto': function (val, oldval) {
      if (val) {
        for (let x in this.belongtoList) {
          if (this.belongtoList[x].id == val) {
            this.taskType = this.belongtoList[x].taskType
            this.belongto = this.belongtoList[x].belongto
            break;
          }
        }
        this.getTaskList()
      }
    },
    'form.province': function (val, oldval) {
      if (val) {
        if (this.form.city && this.count1 != 1) {
          this.form.city = ''
        }
        this.getCity()
        this.count1++
      }
    },
    'form.city': function (val, oldval) {
      if (val) {
        if (this.form.region && this.count2 != 1) {
          this.form.region = ''
        }
        this.getRegion()
        this.count2++
      }
    },
  },
  mounted() {
    let isSettingSocialSecurity = localStorage.getItem('isSettingSocialSecurity');
    if (isSettingSocialSecurity == 'false') {
      this.monthShow = false
    }
  },
  methods: {
    checkSum() {
      let sum = Number(this.form.medicalInsurance) + Number(this.form.unemploymentInsurance) + Number(this.form.accumulationFund) + Number(this.form.oldAgePension)
      if (sum > 99) {
        this.$message.error('四项之和>=100：所有比例之和必须小于100')
      }
    },
    handleSubmit() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.loading = true;
          const params = {
            oldAgePension: this.form.oldAgePension,
            medicalInsurance: this.form.medicalInsurance,
            unemploymentInsurance: this.form.unemploymentInsurance,
            accumulationFund: this.form.accumulationFund,
            takeEffectMonth: this.form.takeEffectMonth,
          }
          this.$api
            .AddSocial(params)
            .then(response => {
              if (response.data.respCode == 0) {
                console.log(this.routeForm)
                if (this.form.takeEffectMonth == 1) {
                  localStorage.setItem('isSettingSocialSecurity', true)
                }
                this.loading = false
                this.$emit('handleCancel')
              }
            })
            .catch(error => {
              console.log(error);
            })
            .finally(() => {

            });
        }
      });
    },
    handleCancel() {
      this.$emit('handleCancel')
    }
  },
}
</script>
