<template>
  <div>
    <div class="overflow-box" style="width:646px;">
      <div class="box-title"><span>批量导出客户确认表</span></div>
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form ref="form" :model="form" label-width="150px" label-position="left" :rules="rules">
              <el-form-item label="客户：" prop="industry">
                <el-select class="radius-input " v-model="form.industry" style="width: 100%;" placeholder="">
                  <el-option v-for="item in insdutryList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="任务：" prop="industry">
                <el-select class="radius-input " v-model="form.industry" style="width: 100%;" placeholder="">
                  <el-option v-for="item in insdutryList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="日期范围：" prop="industry">
                <el-date-picker class="radius-input workerInp" style="width:46%;" v-model="form.industry" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>
                —
                <el-date-picker class="radius-input workerInp" style="width: 47%;" v-model="form.industry" type="date" value-format="yyyy-MM-dd" format="yyyy-MM-dd" placeholder="选择日期">
                </el-date-picker>
                <span class="note-label">以上条件可单选</span>
              </el-form-item>
            </el-form>
          </div>
        </div>

      </div>
      <div class="box-footer">
        <el-button round size="medium" v-if="!isEdit" type="primary" @click="handleAdd">保 存</el-button>
        <el-button round size="medium" v-else type="primary" @click="handleEdit">保 存</el-button>
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
    const validateRepeat = (rule, value, callback) => {
      const params = {
        shortName: value,
        id: this.customerId
      }
      this.$api.checkShortNameChild(params).then((response) => {
        console.log(response)
        if (response.respCode == 0) {
          if (response.data == true) {
            callback(new Error('公司简称已存在!'))
          } else {
            callback()
          }
        }
        else {
          callback(new Error('服务器报错'))
        }
      }).catch((error) => {
        console.log(error);
        callback(new Error('报错'))
      });

    }
    const validateRepeatF = (rule, value, callback) => {
      if (value != null && value != "") {
        const params = {
          fullName: value,
          id: this.customerId
        }
        this.$api.checkFullNameChild(params).then((response) => {
          if (response.data == true) {
            callback(new Error('公司全称已存在!'))
          } else {
            callback()
          }
        }).catch((error) => {
          console.log(error);
        });

      }
      else {
        callback();
      }
    }
    const validateRepeatC = (rule, value, callback) => {
      if (value != null && value != "") {
        const params = {
          creditCode: value,
          id: this.customerId
        }
        this.$api.checkCreditCodeChild(params).then((response) => {
          console.log(response)
          if (response.data == true) {
            callback(new Error('统一社会信用代码已存在!'))
          } else {
            callback()
          }
        }).catch((error) => {
          console.log(error);
        });

      }
      else {
        callback();
      }
    }
    return {
      form: {
        //          address: "国防部",
        //          bankCard: "3243546",
        //          bankName: "广东人发v",
        //          businessLicense: "http://img.10000rc.com/yHBYOB-1543570419246",
        //          city: "120100",
        //          contactName: "3二十多",
        //          creditCode: "21",
        //          customerBill: {},
        //          customerContact: {},
        //          industry: "4",
        //          name: "广泛",
        //          phone: "13232434",
        //          phone2: "13232333333",
        //          province: "120000",
        //          region: "120104",
        //          registeAddress: "共同瓜分",
        //          shortName: "3婷",
      },
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
        shortName: [
          { required: true, message: '公司简称不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          //            { validator: validateRepeat, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '公司全称不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          //            { validator: validateRepeatF, trigger: 'blur' }
        ],

        province: [
          { required: true, message: '省不能为空', trigger: 'change' }
        ],
        city: [
          { required: true, message: '市不能为空', trigger: 'change' }
        ],
        region: [
          { required: true, message: '县不能为空', trigger: 'change' }
        ],
        address: [
          { required: true, message: '详细地址不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' }
        ],
        businessLicense: [
          { required: true, message: '营业执照不能为空', trigger: 'blur' },
        ],
        industry: [
          { required: true, message: '行业不能为空', trigger: 'change' }
        ],

        registeAddress: [
          { required: true, message: '注册地址不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' }
        ],
        phone: [
          { required: true, message: '注册电话不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' }
        ],
        bankName: [
          { required: true, message: '开户银行不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' }
        ],
        bankCard: [
          { required: true, message: '银行账号不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          { pattern: /^[1-9][0-9]*$/, message: '银行账号必须全为数字' }
        ],
        contactName: [
          { required: true, message: '联系人不能为空', trigger: 'blur' },
          { max: 12, message: '长度不超过12字', trigger: 'blur' }
        ],
        phone2: [
          { required: true, message: '联系电话不能为空', trigger: 'blur' },
          {
            pattern: /^1[3456789]\d{9}$/,
            message: "联系电话必须为数字"
          },
          { pattern: /^[1-9][0-9]*$/, message: '联系电话必须全为数字' },

        ]
      },
      options: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }, {
        value: '选项3',
        label: '蚵仔煎'
      }, {
        value: '选项4',
        label: '龙须面'
      }, {
        value: '选项5',
        label: '北京烤鸭'
      }],
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
    this.count1 = 1;
    this.count2 = 1;
    this.getToken();
    this.isEdit = this.$route.meta.isEdit;
    this.customerId = this.$route.params.id;
    this.getInsdustry();
    if (this.isEdit) {
      this.getCustomerDetail();
    }
    this.getProvince();
  },
  methods: {

    validateRepeatC() {
      const params = {
        creditCode: this.form.creditCode,
        id: this.customerId
      }
      this.$api.checkCreditCodeChild(params).then((response) => {
        if (response.respCode == 0) {
          if (response.data == true) {
            this.$message.error('统一社会信用代码已存在!')
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    validateRepeat() {
      const params = {
        shortName: this.form.shortName,
        id: this.customerId
      }
      this.$api.checkShortNameChild(params).then((response) => {
        if (response.respCode == 0) {
          if (response.data == true) {
            this.$message.error('公司简称已存在!')
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    validateRepeatF() {
      const params = {
        fullName: this.form.name,
        id: this.customerId
      }
      this.$api.checkFullNameChild(params).then((response) => {
        if (response.respCode == 0) {
          if (response.data == true) {
            this.$message.error('公司全称已存在!')
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    getByCreditCode(queryString, cb) {
      if (queryString.length > 8) {
        const params = {
          creditCode: queryString
        }
        this.$api.getByCreditCode(params).then((response) => {
          console.log(response.data)
          let result = []
          if (response.respCode == 0 && response.data) {
            result = response.data.map(function (obj, index) {
              obj.businessLicense = '';
              obj.value = obj.creditCode + '    ' + obj.name;
              return obj
            })
            //             result=response.data
            //            console.log(result[1])
            //            for(let x in result){
            //            result[x].businessLicense='';
            //              result[x].value=result[x].creditCode+'    '+result[x].name;
            //            }


          }
          console.log(response.data)
          cb(result);
        }).catch((error) => {
          console.log(error);
        });
      } else {
        cb([])
      }

    },
    handleSelect(item) {
      this.form = item
    },
    querySearch(queryString, cb) {
      this.restaurants = [
        { "value": "111", "address": "长宁区仙霞西路88号百联2楼" },
        { "value": "222", "address": "天山西路389号" },
        { "value": "333", "address": "普陀区金沙江路1699号鑫乐惠美食广场A13" }
      ]
      //        var restaurants = this.restaurants;
      //        var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
      // 调用 callback 返回建议列表的数据
      cb(this.restaurants);
    },
    createFilter(queryString) {
      return (restaurant) => {
        return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
      };
    },
    getRegion() {
      this.$api.getDicList('city', this.form.city).then((response) => {
        this.regionList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },
    getCity() {
      this.$api.getDicList('city', this.form.province).then((response) => {
        this.cityList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },
    getProvince() {
      this.$api.getDicList('city', '0').then((response) => {
        this.provinceList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },
    getInsdustry() {
      this.$api.getDicList('industry', '0').then((response) => {
        this.insdutryList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },
    getCustomerDetail() {
      const params = {
        id: this.customerId,
      }
      this.$api.ChildCusDetail(params).then((response) => {
        this.form = response.data;
        if (this.form.businessLicense) {
          this.fileList = [
            { url: this.form.businessLicense }
          ]
        }
      }).catch((error) => {
        console.log(error);
      });
    },
    getToken() {
      this.$api.getToken().then((response) => {
        const {
          data: {
            fileName, upToken,
          },
        } = response.data;
        this.upload_form = {
          key: fileName,
          token: upToken,
        };
      });
    },

    handleAdd() {
      if (!this.form.businessLicense) {
        this.$message.error('营业执照不能为空')
        return false;
      }
      let valid1;
      this.$refs.form.validate((valid) => {
        valid1 = valid;
      });
      if (valid1) {
        const params = this.form
        this.$api.addChildCus(params).then((response) => {
          if (response.data.respCode == 0) {
            this.$message.success('添加成功！')
            this.$router.go(-1)
          } else {
            this.$message.erroe(response.data.errorMsg)
          }

        }).catch((error) => {
          console.log(error);
        });
      } else {
        return false;
      }

    },

    handleEdit() {
      if (!this.form.businessLicense) {
        this.$message.error('营业执照不能为空')
        return false;
      }
      let valid1;
      this.$refs.form.validate((valid) => {
        valid1 = valid;
      });

      if (valid1) {
        const params = this.form
        this.$api.ChildCusupdate(params).then((response) => {
          if (response.respCode == 0) {
            this.$message.success('编辑成功！')
            this.$router.go(-1)
          } else {
            //                this.$message.error(response.data.errorMsg)
          }
        }).catch((error) => {
          console.log(error);
        });
      } else {
        return false;
      }

    },
    handleRemove(file, fileList) {
      this.form.businessLicense = "";
      console.log(this.form.businessLicense)
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleAvatarScucess(response, file) {
      console.log(file);
      const key = response.key;
      const img = `http://${this.bucketHost}/${key}`;
      this.form.businessLicense = img;
      this.getToken()
      this.$refs.uploadimg.clearValidate()
    },
    handleExceed(files, fileList) {
      console.log(files)
      console.log(fileList)
      console.log('2222')
      this.$message.warning(`请删除当前文件再重新上传！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeRemove2(file, fileList) {
      return false;
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传头像图片只能是 JPG 或PNG格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }
      return isLt2M && (isPNG || isJPG);
      //        if(!isJPG && !isLt2M){
      //          this.fileList=[{}];
      //        }
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
</style>