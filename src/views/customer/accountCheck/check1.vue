<template>
    <div class="check1Con">
        <div class="formContainer" >
            <el-form ref="form1" :model="form" label-width="150px" label-position="right" :rules="rules">
            <el-form-item label="公司简称：" prop="shortName">
                <el-input class="radius-input workerInp" placeholder="输入公司简称" v-model="form.shortName" size="medium" maxlength="50"></el-input>
              </el-form-item>
            <el-form-item label="公司全称：" prop="fullName">
                <el-input class="radius-input workerInp" placeholder="输入公司全称"  v-model="form.fullName" size="medium" maxlength="50"></el-input>
              </el-form-item>
            <el-form-item label="公司所在地：" required>
                <el-row>
                  <el-col :span="8">
                    <el-form-item prop="province">
                      <el-select class="radius-input " clearable v-model="form.province" placeholder="省">
                        <el-option v-for="item in provinceList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="city">
                      <el-select class="radius-input " clearable v-model="form.city" placeholder="市">
                        <el-option v-for="item in cityList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="8">
                    <el-form-item prop="region">
                      <el-select class="radius-input " clearable v-model="form.region" placeholder="区县">
                        <el-option v-for="item in regionList" :key="item.dicVal" :label="item.dicName" :value="item.dicVal">
                        </el-option>
                      </el-select>
                    </el-form-item>
                  </el-col>
                </el-row>
                <el-form-item prop="address">
                  <el-input class="radius-input workerInp" style="margin-top: 20px" placeholder="详细地址" v-model="form.address" size="medium" maxlength="100"></el-input>
                </el-form-item>
              </el-form-item>
            <el-form-item label="统一社会信用代码：" prop="creditCode">
                <el-input placeholder="请输入内容" v-model="form.creditCode">
                </el-input>
              </el-form-item>
            <el-form-item label="营业执照：" required>
                <el-input v-model="form.businessLicense" style="display: none"></el-input>
                <el-upload class="upload-demo" action="//upload.qiniu.com/" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="handleExceed" :on-success="handleAvatarScucess" :file-list="fileList" :data="upload_form">
                  <el-button size="small" type="primary">上传</el-button>
                  <div slot="tip" class="el-upload__tip">只支持jpg、png格式</div>
                </el-upload>
                  <img class="imgPreview" v-if="form.businessLicense" :src="form.businessLicense">
              </el-form-item>
            <el-form-item label="联系人姓名：" prop="contactName">
                <el-input  placeholder="请输入内容" v-model="form.contactName">
                </el-input>
              </el-form-item>
            <el-form-item label="联系人电话：" prop="contactPhone">
                <el-input  placeholder="请输入内容" v-model="form.contactPhone">
                </el-input>
              </el-form-item>
                </el-form>
        </div>
        <div class="btnCon"><el-button round size="medium" type="primary" @click="sendNow">提交审核</el-button></div>
    </div>
</template>
<script>
export default {
  name: 'check1',
  data() {  
      return {   
          form:{
              shortName:'',
              fullName:'',
              province:'',
              city:'',
              region:'',
              address:'',
              creditCode:'',
              businessLicense:'',
              contactName:'',
              contactPhone:'',
          },
          rules:{
              shortName:[
                  { required: true, message: '公司简称不能为空', trigger: 'blur' },
                  { max: 128, message: '长度不超过128字', trigger: 'blur' },
              ],
              fullName:[
                  { required: true, message: '公司全称不能为空', trigger: 'blur' },
                  { max: 128, message: '长度不超过128字', trigger: 'blur' },
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
              creditCode:[
                  { required: true, message: '统一社会信用代码不能为空', trigger: 'blur' },
                  { pattern: /^[A-Za-z0-9]{18}$/, message: '请填写正确的社会统一信用代码' },
              ],
              contactName:[
                  { required: true, message: '联系人姓名不能为空', trigger: 'blur' },
                  { max: 12, message: '长度不超过12字', trigger: 'blur' }
              ],
              contactPhone:[
                  { required: true, message: '联系人电话不能为空', trigger: 'blur' },
                  { pattern: /^[0-9]{8,30}$/, message: '请填写正确的联系人电话' },
              ],   
          },
          provinceList: [],
          cityList: [],
          regionList: [],
          fileList: [],
          upload_form: {},
          count1: 1,
          count2:1,
          addDisable: false,
          paramId:'',
          editFlag:false,
          imgForUpload:'',
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
      this.initSource();
      this.initStorage();
      this.getProvince();
      this.getToken();
  },
  methods: { 
      initSource(){
          if( sessionStorage.getItem('auditWithData') ){
              let bridge = JSON.parse(sessionStorage.getItem('auditWithData'));
              console.log( 'bridge',bridge );
              this.editFlag = true;
              this.form.shortName = bridge.shortName;
              this.form.fullName = bridge.name;
              this.form.province = bridge.province;
              this.form.city = bridge.city;
              this.form.region = bridge.region;
              this.form.address = bridge.address;
              this.form.creditCode = bridge.creditCode;
//              this.form.businessLicense = bridge.businessLicense;
              this.form.contactName = bridge.customerContact.contactName;
              this.form.contactPhone = bridge.customerContact.phone;
              this.imgForUpload = bridge.businessLicense;
              let watermark = localStorage.getItem('watermark');
              this.form.businessLicense = bridge.businessLicense + watermark;
          }  
      },
      initStorage(){
          if( localStorage.getItem('userInfo') ){
              this.paramId = JSON.parse(localStorage.getItem('userInfo')).customerId;
          }          
      },
      getToken() {
          this.$api.getToken().then((res) => {
              const {
                  data: {
                      fileName, upToken,
                  },
              } = res.data;
              this.upload_form = {
                  key: fileName,
                  token: upToken,
              };
          });
      },
      getRegion() {
          this.$api.getDicList('city', this.form.city).then((res) => {
              if (res.data.respCode == 0) {
                  this.regionList = res.data.data;
              }
          }).catch((error) => {
              console.log(error);
          });
      },
      getCity() {
          this.$api.getDicList('city', this.form.province).then((res) => {
              if (res.data.respCode == 0) {
                  this.cityList = res.data.data;
              }
          }).catch((error) => {
              console.log(error);
          });
      },
      getProvince() {
          this.$api.getDicList('city', '0').then((res) => {
              if (res.data.respCode == 0) {
                  this.provinceList = res.data.data;
              }
          }).catch((error) => {
              console.log(error);
          });
      },
      sendNow(){
          this.$refs['form1'].validate();
          if (this.addDisable) {
              return false;
          }        
          if (!this.form.businessLicense) {
              this.$message.error('营业执照不能为空')
              return false;
          } 
          this.$refs['form1'].validate((valid) => {
              if (valid) {                  
                  let params = {
                      id:this.paramId,
                      shortName:this.form.shortName,
                      name:this.form.fullName,
                      province:this.form.province,
                      city:this.form.city,
                      region:this.form.region,
                      address:this.form.address,
                      creditCode:this.form.creditCode,
                      businessLicense:this.imgForUpload,
                      customerContact:{
                          contactName:this.form.contactName,
                          phone:this.form.contactPhone,
                      },
                  };      
                  if( this.editFlag ){
                      params.editStatus = 2;
                  }
                  this.$api.completeRegister(params).then(res=>{
                      let { data:layer1 } = res;
                      let { respCode,data } = layer1;
                      if( respCode === 0 ){
                          this.$message({
                              message: '提交成功，等待审核。',
                              type: 'success'
                          });
                          this.$store.commit('setAuditStage',2);
                          sessionStorage.removeItem('auditWithData');
                          sessionStorage.setItem("auditStatus",'1');
                      }
                  }).catch(err=>{
                      console.log('err',err);
                  })
              } else {
                  return false;
              }
          });
      },
      handleRemove(file, fileList) {
        this.form.businessLicense = "";
        this.$forceUpdate();
    },
    handleAvatarScucess(res, file) {
      console.log(file);
      const key = res.key;
      const img = `http://${this.bucketHost}/${key}`;
        this.imgForUpload = `http://${this.bucketHost}/${key}`;
      let watermark = localStorage.getItem('watermark');
      this.form.businessLicense = img + watermark;
        console.log( this.form.businessLicense  );
      this.getToken()
    },
    handleExceed(files, fileList) {
      this.$message.warning(`请删除当前文件再重新上传！`);
    },
    beforeAvatarUpload(file) {
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG && !isPNG) {
        this.$message.error('上传营业执照只能是 JPG 或PNG格式!');
      }
      if (!isLt2M) {
        this.$message.error('上传营业执照大小不能超过 2MB!');
      }
      return isLt2M && (isPNG || isJPG);
    },
  },
}
</script>
<style lang="scss" scoped>  
    .check1Con {
        width: 900px;  
        background-color: #fff;
        margin: 0 auto;
        padding: 60px;
        border-radius: 8px;
        margin-top: 50px;
        .formContainer {

        }
        .btnCon {
            text-align: center;
        }
        .imgPreview {
            width: 500px;
        }
    }    
</style>