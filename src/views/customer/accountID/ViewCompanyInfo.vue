<template>
  <div>
    <div class="workerName">公司信息</div>
    <div class="redLine"></div>

    <div class="box-body-item">
      <div class="box-body-item-title">基本信息</div>
      <div class="line"></div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>公司简称</span></div>
        <div class="table-info-col2"><span>{{this.form.shortName}}</span></div>
        <div class="table-info-col1 "><span>公司所在地</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="this.form.provinceName+this.form.cityName+this.form.regionName+this.form.address" placement="top-start">
            <span>{{this.form.provinceName}}{{this.form.cityName}}{{this.form.regionName}}{{this.form.address}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>所属行业</span></div>
        <div class="table-info-col2"><span>{{this.form.industryName}}</span></div>
        <div class="table-info-col1"><span>营业执照</span></div>
        <div class="table-info-col2">
          <p type="text" @click="visible=true" class="chakan" v-if="this.form.businessLicense">查看</p>
        </div>
      </div>
    </div>
    <div class="box-body-item">
      <div class="box-body-item-title">开票信息</div>
      <div class="line"></div>
      <div class="table-info info-item">
        <div class="table-info-col1 "><span>公司全称</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="this.form.customerBill.name" placement="top-start">
            <span show-overflow-tooltip>{{this.form.customerBill.name}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>统一社会信用代码</span></div>
        <div class="table-info-col2"><span>{{this.form.customerBill.creditCode}}</span></div>
        <div class="table-info-col1"><span>注册地址</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="this.form.customerBill.registeAddress" placement="top-start">
            <span>{{this.form.customerBill.registeAddress}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>注册电话</span></div>
        <div class="table-info-col2"><span>{{this.form.customerBill.phone}}</span></div>
        <div class="table-info-col1"><span>开户银行</span></div>
        <div class="table-info-col2"><span>{{this.form.customerBill.bankName}}</span></div>
        <div class="table-info-col1"><span>银行账号</span></div>
        <div class="table-info-col2"><span>{{this.form.customerBill.bankCard}}</span></div>
      </div>
    </div>
    <div class="box-body-item">
      <div class="box-body-item-title">联系人信息</div>
      <div class="line"></div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>联系人</span></div>
        <div class="table-info-col2"><span>{{this.form.customerContact.contactName}}</span></div>
        <div class="table-info-col1"><span>联系电话</span></div>
        <div class="table-info-col2"><span>{{this.form.customerContact.phone}}</span></div>
      </div>
    </div>
    <big-image @handleWrapperClick="handleWrapperClick" :image="this.form.businessLicense" :visible="visible"></big-image>
  </div>
</template>
<script>
import BigImage from "../../../components/bigImage.vue";

export default {
  name: "viewCompanyInfo",
  components: {
    BigImage: BigImage
  },
  data() {
    return {
      userId: '',
      visible: false,
      form: {
        customerBill: {},
        customerContact: {},
      },
      customerId: ''
    }
  },
  mounted() {
    this.customerId = this.$route.query.id || JSON.parse(localStorage.getItem('userInfo')).customerId
    console.log(this.userId)
    this.getCustomerDetail()
  },
  methods: {
    handleWrapperClick() {
      this.visible = false
    },
    getCustomerDetail() {
      if (this.customerId) {
        const params = {
          id: this.customerId,
        }
        this.$api.detailCustomer(params).then((response) => {
          console.log(response)
          this.form = response.data;
          if (this.form.businessLicense) {
            let watermark = localStorage.getItem('watermark')
            this.form.businessLicense = this.form.businessLicense + watermark
          }
          console.log(this.form)
        }).catch((error) => {
          console.log(error);
        });
      }
    },
  }
};
</script>
<style scoped>
.chakan {
  margin-top: 15px;
  color: #e84518;
  cursor: pointer;
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
</style>

