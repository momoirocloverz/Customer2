<template>
  <div class="back-white">
    <div class="box-body-item">
      <div class="table-title">客户基本信息</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>公司简称</span></div>
        <div class="table-info-col2">
          <el-tooltip class="item" effect="dark" :content="form.shortName" placement="top-start">
            <span>{{form.shortName}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>所属行业</span></div>
        <div class="table-info-col2"><span>{{form.industryName}}</span></div>
        <div class="table-info-col1"><span>公司所在地</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="`${form.provinceName}${form.cityName}${form.regionName}${form.address}`" placement="top-start">
            <span>{{form.provinceName}}{{form.cityName}}{{form.regionName}}{{form.address}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>营业执照</span></div>
        <div class="table-info-col2">
          <p type="text" @click="visible=true" class="chakan" v-if="form.businessLicense">查看</p>
        </div>
        <div class="table-info-col1"><span>添加时间</span></div>
        <div class="table-info-col2"><span>{{form.createdAt | formatminDate}}</span></div>
        <div class="table-info-col1"><span></span></div>
        <div class="table-info-col2"><span></span></div>
      </div>
    </div>

    <div class="box-body-item">
      <div class="table-title">客户开票信息</div>
      <div class="line"></div>
      <div class="table-info info-item">
        <div class="table-info-col1 "><span>公司全称</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="form.name" placement="top-start">
            <span show-overflow-tooltip>{{form.name}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>统一社会信用代码</span></div>
        <div class="table-info-col2"><span>{{form.creditCode}}</span></div>
        <div class="table-info-col1 "><span>注册地址</span></div>
        <div class="table-info-col2 text-overflow">
          <el-tooltip class="item" effect="dark" :content="form.registeAddress" placement="top-start">
            <span>{{form.registeAddress}}</span>
          </el-tooltip>
        </div>
        <div class="table-info-col1"><span>注册电话</span></div>
        <div class="table-info-col2"><span>{{form.phone}}</span></div>
        <div class="table-info-col1"><span>开户银行</span></div>
        <div class="table-info-col2"><span>{{form.bankName}}</span></div>
        <div class="table-info-col1"><span>银行账号</span></div>
        <div class="table-info-col2"><span>{{form.bankCard}}</span></div>
      </div>
    </div>

    <div class="box-body-item">
      <div class="table-title">客户联系人信息</div>
      <div class="table-info info-item">
        <div class="table-info-col1"><span>联系人</span></div>
        <div class="table-info-col2"><span>{{form.contactName}}</span></div>
        <div class="table-info-col1"><span>联系电话</span></div>
        <div class="table-info-col2"><span>{{form.phone2}}</span></div>
      </div>
    </div>
    <big-image @handleWrapperClick="handleWrapperClick" :image="form.businessLicense" :visible="visible"></big-image>
  </div>
</template>

<script>
import BigImage from "../../../../components/bigImage.vue";
import util from "../../../../common/util"
export default {
  name: "CustomerBaseInfo",
  components: { BigImage },
  data() {
    return {
      form: {},
      visible: false,
    }
  },
  watch: {

  },
  filters: {
    formatStatus(val) {
      if (val == 1) {
        return '可用'
      } else if (val == 2) {
        return '冻结'
      } else {
        return ''
      }
    },
    formatminDate(val) {
      if (val) {
        return util.minDate(val)
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.getChildCusDetail()
  },
  methods: {
    handleWrapperClick() {
      this.visible = false
    },
    getChildCusDetail() {
      const params = {
        id: this.$route.params.id,
      }
      this.$api.ChildCusDetail(params).then((response) => {
        this.form = response.data;
        if (this.form.businessLicense) {
          let watermark = localStorage.getItem('watermark')
          this.form.businessLicense = this.form.businessLicense + watermark
        }
      }).catch((error) => {
        console.log(error);
      });
    },
  }
}
</script>
