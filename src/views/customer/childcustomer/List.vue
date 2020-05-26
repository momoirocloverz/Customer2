<template>
  <div class="back-white">
    <search-bar @handleSearch="handleSearch" placeholder="输入客户简称搜索"></search-bar>

    <div class="back-white btn-div flexable">
      <el-button class="primary-btn" size="mini" @click="routeToadd">添加客户</el-button>
    </div>

    <div class="table-box back-white">
      <el-table :data="tableData" empty-text="暂无相关客户信息">
        <el-table-column label="简称" prop="shortName" align="center" min-width="100"></el-table-column>
        <el-table-column label="全称" prop="name" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="所在地" :formatter="locationFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="联系人" prop="contactName" align="center" min-width="100"></el-table-column>
        <el-table-column label="联系电话" prop="phone2" align="center" min-width="100"></el-table-column>
        <el-table-column label="进行中任务数" prop="processingTaskCount" align="center" min-width="100"></el-table-column>
        <el-table-column label="添加时间" prop="createdAt" :formatter="dateFormatter" show-overflow-tooltip align="center" min-width="100"></el-table-column>
        <el-table-column label="操作" align="center" min-width="150">
          <template v-slot="scope">
            <el-button type="text" class="btn-icon btn-icon-view" size="mini" @click="routeToDetail(scope.row)">查看</el-button>
            <el-button type="text" class="btn-icon btn-icon-edit" size="mini" @click="routeToEdit(scope.row)">编辑</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-container" v-if="pageCount!=0">
        <el-pagination class="pagebox" layout="total, prev, pager, next, jumper" @current-change="handleCurrentChange" :current-page="currentPage" :total="total" :page-size="pageSize">
        </el-pagination>
      </div>
    </div>
    <!-- 添加客户弹窗 -->
    <el-dialog :title=title :visible.sync="addCustomerVisible" width="740px" center :before-close="emptyData" :center="false">
      <div :style="{margin:'0 auto'}">
        <div>
          <!-- <div class="box-title" v-if="!isEdit"><span>添加客户</span></div> -->
          <!-- <div class="box-title" v-else><span>编辑客户</span></div> -->
          <div class="box-body1">
            <div class="box-body-item">
              <div class="box-body-form">
                <el-form ref="customerForm" :model="customerForm" label-width="150px" label-position="right" :rules="rules">
                  <el-form-item label="统一社会信用代码：" prop="creditCode" class="el-form-item">
                    <el-input class="radius-input workerInp" v-if="isEdit" placeholder="" v-model="customerForm.creditCode" size="medium" maxlength="128" @blur="validateRepeatC"></el-input>
                    <el-autocomplete v-if="!isEdit" class="inline-input radius-input" style="width:330px" v-model="customerForm.creditCode" :fetch-suggestions="getByCreditCode" placeholder="请输入内容" :trigger-on-focus="false" @select="handleSelect" @blur="validateRepeatC"></el-autocomplete>
                  </el-form-item>
                  <el-form-item label="公司简称：" prop="shortName">
                    <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="customerForm.shortName" @blur="validateRepeat" maxlength="128"></el-input>
                  </el-form-item>
                  <el-form-item label="公司全称：" prop="name">
                    <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="customerForm.name" maxlength="128" @blur="validateRepeatF"></el-input>
                  </el-form-item>
                  <el-form-item label="公司所在地：" required>
                    <el-row>
                      <el-col :span="8">
                        <el-form-item prop="province">
                          <el-select class="radius-input " clearable v-model="customerForm.province" placeholder="省" @change="changeProvince">
                            <el-option v-for="item in provinceList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="city">
                          <el-select class="radius-input " clearable v-model="customerForm.city" placeholder="市" @change="changeCity">
                            <el-option v-for="item in cityList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                      <el-col :span="8">
                        <el-form-item prop="region">
                          <el-select class="radius-input " clearable v-model="customerForm.region" placeholder="区县">
                            <el-option v-for="item in regionList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                            </el-option>
                          </el-select>
                        </el-form-item>
                      </el-col>
                    </el-row>
                    <el-form-item prop="address">
                      <el-input class="radius-input workerInp" style="margin-top: 20px;margin-left:-80px;" placeholder="详细地址" v-model="customerForm.address" size="medium" maxlength="100"></el-input>
                    </el-form-item>
                  </el-form-item>
                  <el-form-item label="所属行业：" prop="industry">
                    <el-select class="radius-input " v-model="customerForm.industry" style="width: 330px" placeholder="">
                      <el-option v-for="item in insdutryList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="营业执照：" required ref="uploadimg">
                    <el-input v-model="customerForm.businessLicense" style="display: none;width: 330px"></el-input>
                    <!-- <img style="visibility: hidden" :src="customerForm.businessLicense"> -->
                    <el-upload class="upload-demo" action="//upload.qiniu.com/" :on-preview="handlePreview" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="handleExceed" :on-success="handleAvatarScucess" :file-list="fileList" :data="upload_form">
                      <el-button size="small" class="btnborder" round>上传</el-button>
                      <span slot="tip" class="el-upload__tip marginleft20">只支持jpg、png格式</span>
                    </el-upload>
                    <img class="img-block" v-if="customerForm.businessLicense" :src="customerForm.businessLicense">
                  </el-form-item>
                  <el-form-item label="注册地址：" prop="registeAddress">
                    <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="customerForm.registeAddress" maxlength="128"></el-input>
                  </el-form-item>
                  <el-form-item label="注册电话：" prop="phone">
                    <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="customerForm.phone" maxlength="20"></el-input>
                  </el-form-item>
                  <el-form-item label="开户银行：" prop="bankName">
                    <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="customerForm.bankName" maxlength="50"></el-input>
                  </el-form-item>
                  <el-form-item label="银行账号：" prop="bankCard">
                    <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="customerForm.bankCard" maxlength="20"></el-input>
                  </el-form-item>
                  <el-form-item label="联系人：" prop="contactName">
                    <el-input class="radius-input workerInp" placeholder="" v-model="customerForm.contactName" size="medium"></el-input>
                  </el-form-item>
                  <el-form-item label="联系电话：" prop="phone2">
                    <el-input class="radius-input workerInp" placeholder="" v-model="customerForm.phone2" size="medium"></el-input>
                  </el-form-item>
                </el-form>
              </div>
            </div>

          </div>
          <!-- <div class="box-footer">
            <el-button round size="medium" v-if="!isEdit" type="primary" @click="handleAdd">保 存</el-button>
            <el-button round size="medium" v-else type="primary" @click="handleEdit">保 存</el-button>
            <el-button round size="medium" @click="$router.go(-1)">取 消</el-button>
          </div> -->
        </div>
      </div>

      <span slot='footer' class="dialog-footer">
        <el-button @click="cancel">取 消</el-button>
        <el-button type="primary" v-if="title == '添加客户'" @click="handleAdd">保 存</el-button>
        <el-button type="primary" v-if="title == '编辑客户'" @click="handleEdit">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import util from "../../../common/util"
import SearchBar from '@/components/SearchBar'
export default {
  name: "CustomerList",
  components: {
    SearchBar
  },
  data() {
    const validateRepeat = (rule, value, callback) => {
      const params = {
        shortName: value,
        id: this.customerId || window.localStorage.getItem('customerid')
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
          id: this.customerId || window.localStorage.getItem('customerid')
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
          id: this.customerId || window.localStorage.getItem('customerid')
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
      form: {},
      currentPage: 1,
      pageSize: 20,
      pageCount: '',
      total: 0,
      tableData: [],
      msg: "Hello Vue.js",
      addCustomerVisible: false,
      customerForm: {
        businessLicense: ''
      },
      title: '添加客户',
      isEdit: false,
      fileList: [],
      upload_form: {},
      rules: {
        creditCode: [
          { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9]{18}$/, message: '统一社会信用代码为18位数字或字母' },
          // { validator: validateRepeatC, trigger: 'blur' }
        ],
        shortName: [
          { required: true, message: '公司简称不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          // { validator: validateRepeat, trigger: 'blur' }
        ],
        name: [
          { required: true, message: '公司全称不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
        ],
        customerName: [
          { required: true, message: '公司全称不能为空', trigger: 'blur' },
          { max: 128, message: '长度不超过128字', trigger: 'blur' },
          // { validator: validateRepeatF, trigger: 'blur' }
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
      fullNameRepeat: false,
      shortNameRepeat: false,
      codeRepeat: false,
      options: [],
      provinceList: [],
      cityList: [],
      regionList: [],
      insdutryList: [],
      value: '',
      customerId: '',
      count1: '',
      isEditOpen:false,
      count2: '',
      ids: '',
    }
  },
  watch: {
    'customerForm.province': function (val, oldval) {
      if (val) {
        // if (this.customerForm.city && !this.isEditOpen) {
        //   this.customerForm.city = ''
        // }
        this.getCity()
        this.count1++
      }
    },
    'customerForm.city': function (val, oldval) {
      if (val) {
        // if (this.customerForm.region && !this.isEditOpen) {
        //   this.customerForm.region = ''
        // }
        this.getRegion()
        this.count2++
      }
    },
    addCustomerVisible: {
      handler(val, old) {
        if (val == false) {
          this.getList()
        } else {
          this.$forceUpdate()
        }
      },
      deep: true,
      immediate: true
    }
  },
  filters: {
    formatminDate(val) {
      if (val) {
        return util.minDate(val)
      } else {
        return ''
      }
    }
  },
  mounted() {
    this.getList()
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
    changeProvince(val){
      if (val) {
        if (this.customerForm.city) {
          this.customerForm.city = ''
        }
      }
        console.log(val)
    },
    changeCity(val){
      if(val){
        if (this.customerForm.region) {
          this.customerForm.region = ''
        }
      }
      console.log(val)
    },
    locationFormatter(row, column, cellValue, index) {
      return `${row.provinceName}${row.cityName}${row.regionName}${row.address}`
    },
    emptyData() {
      this.addCustomerVisible = false
      this.customerForm = {}
    },
    cancel() {
      this.addCustomerVisible = false
      this.customerForm = {}
    },
    handleSearch(keyword) {
      this.form.shortName = keyword
      // this.customerForm.shortName = keyword
      this.getList()
    },
    checkRepeat() {
      if (this.shortNameRepeat) {
        this.$message.error('公司简称已存在!')
        return true
      }
      if (this.fullNameRepeat) {
        this.$message.error('公司全称已存在!')
        return true
      }
      if (this.codeRepeat) {
        this.$message.error('统一社会信用代码已存在!')
        return true
      }
      return false
    },
    handleAdd() {
      if (!this.customerForm.businessLicense) {
        this.$message.error('营业执照不能为空')
        return false;
      }
      let checkResult = this.checkRepeat()
      if (checkResult) {
        return
      }
      let valid1;
      this.$refs.customerForm.validate((valid) => {
        valid1 = valid;
      });
      if (valid1) {
        const params = this.customerForm
        console.log(params)
        this.$api.addChildCus(params).then((response) => {
          console.log(response)
          if (response.data.respCode == 0) {
            this.$message.success('添加成功！')
            // this.$router.go(-1)
            this.addCustomerVisible = false
            this.customerForm.businessLicense = '' //保存完后，图片路径清空
            this.getList()
          } else {
            this.$message.error(response.data.errorMsg)
          }

        }).catch((error) => {
          console.log(error);
        });
      } else {
        return false;
      }

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
    getRegion() {
      this.$api.getDicList('city', this.customerForm.city).then((response) => {
        this.regionList = response.data.data;
      }).catch((error) => {
        console.log(error);
      });
    },
    getCity() {
      this.$api.getDicList('city', this.customerForm.province).then((response) => {
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
    handleEdit() {
      if (!this.customerForm.businessLicense) {
        this.$message.error('营业执照不能为空')
        return false;
      }
      let checkResult = this.checkRepeat()
      if (checkResult) {
        return
      }
      let valid1;
      this.$refs.customerForm.validate((valid) => {
        valid1 = valid;
      });

      if (valid1) {
        const params = this.customerForm
        this.$api.ChildCusupdate(params).then((response) => {
          if (response.data.respCode == 0) {
            this.$message.success('编辑成功！')
            this.customerForm.businessLicense = '' //编辑完后，图片路径清空
            this.getList()
            this.addCustomerVisible = false
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
      this.customerForm = item
      this.fileList = []
    },
    validateRepeatF() {
      if(this.customerId !=undefined){
        this.ids = this.customerId
      }else if(window.localStorage.getItem('customerid') != 'false'){
        this.ids = window.localStorage.getItem('customerid')
      }else{
        this.ids = null
      }
      const params = {
        fullName: this.customerForm.name,
        id: this.ids
      }
      this.$api.checkFullNameChild(params).then((response) => {
        if (response.respCode == 0) {
          if (response.data == true) {
            this.fullNameRepeat = true
            this.$message.error('公司全称已存在!')
          } else {
            this.fullNameRepeat = false
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    validateRepeatC() {
      if(this.customerId !=undefined){
        this.ids = this.customerId
      }else if(window.localStorage.getItem('customerid') != 'false'){
        this.ids = window.localStorage.getItem('customerid')
      }else{
        this.ids = null
      }
      const params = {
        creditCode: this.customerForm.creditCode,
        id: this.ids
      }
      console.log(this.ids)
      console.log(params)
      this.$api.checkCreditCodeChild(params).then((response) => {
        if (response.respCode == 0) {
          if (response.data == true) {
            this.codeRepeat = true
            this.$message.error('统一社会信用代码已存在!')
          } else {
            this.codeRepeat = false
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    validateRepeat() {
      if(this.customerId !=undefined){
        this.ids = this.customerId
      }else if(window.localStorage.getItem('customerid') != 'false'){
        this.ids = window.localStorage.getItem('customerid')
      }else{
        this.ids = null
      }
      const params = {
        shortName: this.customerForm.shortName,
        id: this.ids
      }
      this.$api.checkShortNameChild(params).then((response) => {
        if (response.respCode == 0) {
          if (response.data == true) {
            this.shortNameRepeat = true
            this.$message.error('公司简称已存在!')
          } else {
            this.shortNameRepeat = false
          }
        }
      }).catch((error) => {
        console.log(error);
      });

    },
    dateFormatter(row, column, cellValue, index) {
      return util.minDate(cellValue)
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    formatStatus(row) {
      let val = row.status;
      if (val == 1) {
        return '可用'
      } else if (val == 2) {
        return '冻结'
      } else {
        return ''
      }
    },
    routeToDetail(row) {
      const { href } = this.$router.resolve({
        name: "customerDetail",
        params: {
          id: row.id,
        }
      });
      window.open(href, "_blank");
      // this.$router.push({ name: 'customerDetail', params: { id: row.id } })
    },
    routeToEdit(row) {
      this.title = '编辑客户'
      this.isEditOpen= true;
      this.customerId = row.id
      this.customerForm = row
      window.localStorage.setItem('customerid', row.id)
      this.customerForm.businessLicense = row.businessLicense
      console.log(row)
      this.addCustomerVisible = true
      this.$forceUpdate()
    },
    routeToadd() {
      // this.$router.push({ name: 'addCustomer' })
      window.localStorage.setItem('customerid', this.tableData.length != 0 && this.tableData[0].customerId)
      console.log(this.tableData)
      this.addCustomerVisible = true
      this.title = '添加客户'
    },
    freeze(row) {
      console.log(row)
      this.$confirm("确认冻结吗?", "谨慎操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        let id = row.id
        this.$api.freezeCustomer(id).then((response) => {
          this.$message.success('冻结成功')
          row.status = 2
        }).catch((error) => {
          console.log(error);
        });
      })
    },
    unfreeze(row) {
      this.$confirm("确认解冻吗?", "谨慎操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "error"
      }).then(() => {
        let id = row.id
        this.$api.unfreezeCustomer(id).then((response) => {
          this.$message.success('解冻成功')
          row.status = 1
        }).catch((error) => {
          console.log(error);
        });
      })
    },
    getList() {
      const params = {
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        shortName: this.form.shortName
      }
      this.$api.getChildCus(params).then((response) => {
        const {
          data: {
            list,
            pages,
            total,
            pageNum,
          },
        } = response.data;
        this.tableData = list || []
        this.pageCount = pages
        this.total = total
      }).catch((error) => {
        console.log(error);
      });
    },
    handleRemove(file, fileList) {
      this.customerForm.businessLicense = "";
      console.log(this.customerForm.businessLicense)
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleAvatarScucess(response, file) {
      console.log(file);
      console.log(response);
      const key = response.key;
      const img = `http://${this.bucketHost}/${key}`;
      this.customerForm.businessLicense = img;
      this.getToken()
      // this.$refs.uploadimg.clearValidate()
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
        this.$message.error('上传图片只能是 JPG 或PNG格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 2MB!');
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
.el-form-item {
  margin-left: 80px !important;
}
.upload-demo{
  width:330px;
}
.img-block{
  display: block;
  width: 330px;
}
.el-col-8 {
  width: 41.33333% !important;
  margin-left: -80px !important;
}
.workerInp {
  width: 330px;
}
</style>
