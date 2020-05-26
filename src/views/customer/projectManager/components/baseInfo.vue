<template>
  <div>
    <div class="box-body-item">
      <div class="table-title">基本信息</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>姓名</span></div>
        <div class="table-info-col2"><span>{{form.nameAlias}}</span></div>
        <div class="table-info-col1"><span>手机号</span></div>
        <div class="table-info-col2"><span>{{form.accountMobile}}</span></div>

        <div class="table-info-col1"><span>身份证号</span></div>
        <div class="table-info-col2"><span>{{form.idCard|idCardFilter(form.ownManager)}}</span></div>
        <div class="table-info-col1"><span>所在位置</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="form.address" placement="top-start">
            <span show-overflow-tooltip>{{form.address}}</span>
          </el-tooltip>
        </div>

        <div class="table-info-col1"><span>当前服务公司</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="form.bindingCustomerName" placement="top-start">
            <span>{{form.bindingCustomerName}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>零工数</span></div>
        <div class="table-info-col2"><span>{{form.empCount}}</span></div>
      </div>
    </div>
    <div class="box-body-item">
      <div class="table-title">企业信息</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>公司名称</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="form.financeCustomer.name" placement="top-start">
            <span>{{form.financeCustomer.name}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>统一社会信用代码</span></div>
        <div class="table-info-col2"><span>{{form.financeCustomer.creditCode}}</span></div>
        <div class="table-info-col1"><span>注册地址</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="form.financeCustomer.registeAddress" placement="top-start">
            <span>{{form.financeCustomer.registeAddress}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>注册电话</span></div>
        <div class="table-info-col2"><span>{{form.financeCustomer.phone}}</span></div>
        <div class="table-info-col1"><span>开户银行</span></div>
        <div class="table-info-col2"><span>{{form.financeCustomer.bankName}}</span></div>
        <div class="table-info-col1"><span>银行账号</span></div>
        <div class="table-info-col2"><span>{{form.financeCustomer.bankCard}}</span></div>
        <div class="table-info-col1"><span>营业执照</span></div>
        <div class="table-info-col2">
          <p type="text" @click="visible=true" class="is-link" v-if="form.financeCustomer.businessLicense">查看</p>
        </div>
        <div class="table-info-col1"><span></span></div>
        <div class="table-info-col2"><span></span></div>
      </div>
    </div>

    <big-image @handleWrapperClick="handleWrapperClick" :image="form.financeCustomer.businessLicense" :visible="visible"></big-image>
  </div>
</template>

<script>
import BigImage from "../../../../components/bigImage.vue";
import ElButton from "../../../../../node_modules/element-ui/packages/button/src/button.vue";

export default {
  name: "PmBaseInfo",
  components: {
    ElButton,
    BigImage  },
  data() {
    return {
      form: {
        nameAlias: '',
        accountMobile: '',
        idCard: '',
        address: '',
        financeCustomer: {
          name: '',
          creditCode: '',
          registeAddress: '',
          phone: '',
          bankName: '',
          bankCard: '',
          businessLicense: ''
        }
      },
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

    },
    idCardFilter(val, type) {
      if (type) {
        return val
      } else {
        return val.replace(/(\d{6})\d{8}(\d{4})/, '$1********$2')
      }
    }
  },

  created() {
    if (!this.form.financeCustomer) {
      this.form.financeCustomer = {}
    }
  },
  mounted() {
    this.getDetail()
  },
  methods: {
    getDetail() {
      const params = {
        id: this.$route.params.id,
      }
      this.$api.detailPm(params).then((response) => {
        if (response.respCode == 0) {
          this.form = response.data;
          if (!this.form.financeCustomer) {
            this.form.financeCustomer = {}
          } else {
            if (this.form.financeCustomer.businessLicense) {
              let watermark = localStorage.getItem('watermark')
              this.form.financeCustomer.businessLicense = this.form.financeCustomer.businessLicense + watermark
            }
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
