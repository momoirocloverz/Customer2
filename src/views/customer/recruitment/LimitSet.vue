<template>
  <div class="limit-set back-white">
    <p class="tip">如果不需要设置上限，则无需填写</p>
    <el-form label-width="300px" :model="form" ref="form" :rules="rules" label-position="left" class="page-form">
      <el-form-item label="每月每个项目经理招聘支出总和上限" prop="limit">
        <el-input v-model="form.limit">
          <template slot="append">元</template>
        </el-input>

      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSave" class="page-btn">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: 'LimitSet',
  components: {},
  data() {
    let __this = this
    let validateLimit = (rule, value, callback) => {
      // 最多两位小数的正实数
      let limitReg = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
      this.form.limit = value.replace(/^(.*\..{2}).*$/, "$1")

      if (!limitReg.test(value)) {
        callback(new Error('输入有效数字'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        limit: [
          { validator: validateLimit, trigger: 'blur' },
          { validator: validateLimit, trigger: 'change' },
          { required: true, message: '不能为空', trigger: 'blur' }
        ]
      },
      form: {
        limit: ''
      }
    };
  },

  computed: {},

  mounted() {

  },
  methods: {
    handleSave() {
      this.$refs.form.validate()
      // this.$message({
      //   message: '设置成功',
      //   type: 'success'
      // })

      // this.$router.push({ name: 'joblist' })
    },
  },
}
</script>
<style lang='scss' scoped>
.limit-set {
  padding: 30px;
  .tip {
    color: #999;
    padding-bottom: 30px;
  }
  .page-form {
    width: 500px;
  }
  .page-btn {
    width: 120px;
    height: 34px;
    font-size: 14px;
    line-height: 34px;
    padding: 0;
    text-align: center;
  }
}
</style>