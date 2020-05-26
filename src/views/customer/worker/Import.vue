<template>
  <div>
    <div class="overflow-box" style="width:594px;">
      <div class="box-title">
        <span>导入名单</span>
      </div>
      <div class="box-body1">
        <div class="box-body-item">
          <div class="box-body-form">
            <el-form
              ref="form"
              :model="form"
              label-width="150px"
              label-position="left"
              :rules="rules"
              style="margin: 120px 0;"
            >
              <el-form-item label="选择导入的文件：" required>
                <!--<el-input v-model="form.businessLicense" style="display: none"></el-input>-->
                <!--&lt;!&ndash;<img style="visibility: hidden" :src="form.businessLicense">&ndash;&gt;-->
                <el-upload
                  ref="upload"
                  class="upload-demo"
                  :action="$emptyImport"
                  :on-preview="handlePreview"
                  :on-remove="handleRemove"
                  :before-upload="beforeAvatarUpload"
                  :limit="1"
                  accept=".xls, .xlsx"
                  :on-exceed="handleExceed"
                  :on-success="handleAvatarScucess"
                  :file-list="fileList"
                  :auto-upload="false"
                  :headers="uploadHeaders"
                >
                  <!--<img v-if="false" :src="form.businessLicense">-->
                  <el-button size="small" class="btnborder" round>浏览</el-button>
                  <span slot="tip" class="el-upload__tip marginleft20">只支持excel文件</span>
                  <span
                    slot="tip"
                    class="el-upload__tip marginleft20 is-link"
                    @click="DownLoad"
                  >点击下载文件模板</span>
                </el-upload>
                <p class="import-label">导入特殊考勤人员库的人再也无法作为正常零工被添加，请谨慎操作</p>
              </el-form-item>
            </el-form>
          </div>
        </div>
      </div>
      <div class="box-footer">
        <el-button
          round
          size="medium"
          type="primary"
          @click="submitUpload"
          style="width: 250px;"
          :disabled="importing"
        >{{importingLabel}}</el-button>
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
      importingLabel: "导 入",
      isImport: true,
      importing: false,
      uploadHeaders: {},
      form: {},
      isEdit: false,
      fileList: [],
      upload_form: {},
      rules: {
        creditCode: [
          {
            required: true,
            message: "统一社会信用代码不能为空",
            trigger: "blur"
          },
          { max: 128, message: "长度不超过128字", trigger: "blur" },
          { pattern: /^[a-z0-9]*$/, message: "统一社会信用代码为数字或字母" }
          //            { validator: validateRepeatC, trigger: 'blur' }
        ]
      },
      options: [],
      provinceList: [],
      cityList: [],
      regionList: [],
      insdutryList: [],
      value: "",
      customerId: "",
      count1: "",
      count2: "",
    };
  },
  watch: {},
  mounted() {
    let token = localStorage.getItem("token");
    this.uploadHeaders = {
      Authorization: `Bearer ${JSON.parse(token).val}`
    };
  },
  methods: {
    submitUpload() {
      // console.log("sssssasa");
      let list = document.getElementsByClassName("el-upload-list__item");
      console.log(list)
      if (list.length == 0) {
        this.$message({
          type: "error",
          message: "导入的模板不能为空！"
        });
        return;
      }
      this.$refs.upload.submit()
    },

    DownLoad() {
      this.$api.emptyDownload().then(response => {
        if (response.respCode == 0) {
          window.open(response.data);
        }
      });
    },
    getToken() {
      this.$api.getToken().then(response => {
        const {
          data: { fileName, upToken }
        } = response.data;
        this.upload_form = {
          key: fileName,
          token: upToken
        };
      });
    },
    handleAdd() {
      if (!this.form.businessLicense) {
        this.$message.error("导入的文件不能为空");
        return false;
      }
      let valid1;
      this.$refs.form.validate(valid => {
        valid1 = valid;
      });
      if (valid1) {
        const params = this.form;
        this.$api
          .addChildCus(params)
          .then(response => {
            if (response.data.respCode == 0) {
              this.$message.success("添加成功！");
              this.$router.go(-1);
            } else {
              this.$message.error(response.data.errorMsg);
            }
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        return false;
      }
    },

    handleRemove(file, fileList) {
      this.form.businessLicense = "";
      console.log(this.form.businessLicense);
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleAvatarScucess(response, file) {
      this.importingLabel = "导入";
      this.importing = false;
      if (response.respCode == 0) {
        if(response.data){
            localStorage.setItem('importSummaryMsg',response.data.importSummaryMsg);
            let errList = response.data.importDetailErrorMsgList ? response.data.importDetailErrorMsgList : [];
            localStorage.setItem('importDetailErrorMsgList',JSON.stringify(errList));
        }
      const { href } = this.$router.resolve({
        name: 'ImportDetail',
      })
      setTimeout(() => {
        window.open(href, '_self')
      },500)
      } else {
        this.$message.error(response.errorMsg);
      }

      //        console.log(file);
      //        const key = response.key;
      //        const img = `http://${this.bucketHost}/${key}`;
      //        this.form.businessLicense = img;
    },
    handleExceed(files, fileList) {
      this.$message.warning(`请删除当前文件再重新上传！`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`);
    },
    beforeRemove2(file, fileList) {
      return false;
    },
    beforeAvatarUpload(file) {
      //        const isText = file.type === 'application/vnd.ms-excel'
      //        const isTextComputer = file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      console.log(file);
      var fileName = new Array();
      fileName = file.name.split(".");
      const extension = fileName[fileName.length - 1] === "xls";
      const extension2 = fileName[fileName.length - 1] === "xlsx";
      if (!extension && !extension2) {
        this.$message.error("请上传excel文件");
      } else {
        this.importingLabel = "导入中";
        this.importing = true;
      }
      return extension || extension2;
    }
  }
};
</script>

<style scoped>
.import-label {
  font-family: PingFang-SC-Regular;
  font-size: 14px;
  font-weight: normal;
  font-stretch: normal;
  line-height: 24px;
  letter-spacing: 0px;
  color: #e84518;
}
.is-link {
  cursor: pointer;
}
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