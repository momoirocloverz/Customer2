<template>
    <div>
        <el-form ref="formRegister" :model="formRegister" label-width="120px" labelPosition="right" :rules="rules">
            <p style="padding: 0 0 15px 15px;">适用于因公安库无零工照片导致的零工无法自行注册，但您又能确认零工身份真实的情况</p>
            <el-form-item label="零工手机号："  prop="mobile" class="formSearchMargin formSearchMarginTop">
                <el-input style="width:330px" v-model="formRegister.mobile" placeholder="零工手机号" maxlength="11"></el-input>
            </el-form-item>
            <el-form-item label="短信验证码："  prop="validator" class="formSearchMargin formSearchMarginTop">
                <el-input style="width:175px" v-model="formRegister.validator" placeholder="短信验证码"></el-input>
                <el-button type="primary" size="small" class="newBtnStyle" :disabled="isMobile" @click="getCode">{{codeTxt}}</el-button>
            </el-form-item>
            <el-form-item label="登录密码："  prop="password" class="formSearchMargin formSearchMarginTop">
                <el-input style="width:330px" type="password" v-model="formRegister.password" placeholder="登录密码"></el-input>
            </el-form-item>
            <el-form-item label="重复登录密码："  prop="passwords" class="formSearchMargin formSearchMarginTop">
                <el-input style="width:330px" type="password" v-model="formRegister.passwords" placeholder="请再次输入登录密码"></el-input>
            </el-form-item>
            <el-form-item label="姓名："  prop="realName" class="formSearchMargin formSearchMarginTop">
                <el-input style="width:330px" v-model="formRegister.realName" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item label="身份证号："  prop="idCard" class="formSearchMargin formSearchMarginTop">
                <el-input style="width:330px" v-model="formRegister.idCard" placeholder="请输入身份证号" maxlength="18"></el-input>
            </el-form-item>
            <el-form-item label="零工自拍照："  class="formSearchMargin formSearchMarginTop">
                <el-input v-model="formRegister.bestFrame" style="display: none;width: 330px"></el-input>
                <el-upload class="upload-demo" action="//upload.qiniu.com/" :on-remove="handleRemove" :before-upload="beforeAvatarUpload" :limit="1" :on-exceed="handleExceed" :on-success="handleAvatarScucess" :file-list="fileList" :data="upload_form">
                      <!-- <img v-if="false" :src="formRegister.bestFrame"> -->
                      <el-button size="small" class="btnborder" round>上传</el-button>&nbsp;
                      <span slot="tip" class="el-upload__tip marginleft20">请确保零工自拍照清晰，以免打卡时系统无法识别</span>
                </el-upload>
            </el-form-item>
            <el-button type="primary" size="small" style="margin-left:50px;" @click="save">保存</el-button>
            <!-- <el-button @click="open2">555</el-button> -->
        </el-form>
    </div>
</template>

<script>
export default {
    data(){
        var validatePass = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("登录密码不能为空"));
            } else {
                if (this.formRegister.passwords !== "") {
                this.$refs.formRegister.validateField("passwords");
                }
                callback();
            }
            };
            var validatePass2 = (rule, value, callback) => {
            if (value === "") {
                callback(new Error("重复登录密码不能为空"));
            } else if (value !== this.formRegister.password) {
                callback(new Error("两次输入密码不一致!"));
            } else {
                callback();
            }
        };
        return {
            formRegister: {
                mobile: '',
                validator: '',
                password: '',
                passwords: '',
                realName: '',
                idCard: '',
                bestFrame: ''
            },
            fileList: [],
            upload_form: {},
            codeTxt: '发送验证码',
            codeTime: 60,
            isMobile: false,
            onces: true,
            rules: {
                password: [
                    { validator: validatePass, trigger: "blur" },
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { min: 6, max: 18, message: "密码必须是6到18位的字母或数字", trigger: "blur" },
                    {
                        pattern: /^[a-zA-Z0-9]{6,18}$/,
                        message: "密码必须是6到18位的字母或数字"
                    }
                ],
                passwords: [
                    { validator: validatePass2, trigger: "blur" },
                    { required: true, message: "密码不能为空", trigger: "blur" },
                    { min: 6, max: 18, message: "密码必须是6到18位的字母或数字", trigger: "blur" },
                        {
                        pattern: /^[a-zA-Z0-9]{6,18}$/,
                        message: "密码必须是6到18位的字母或数字"
                    }
                ],
                validator: [
                    { required: true, message: "验证码不能为空", trigger: "blur" },
                    {
                        pattern: /^[0-9]*$/,
                        message: "请填写正确的验证码"
                    }
                ],
                mobile: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    {
                        pattern: /^1[3456789]\d{9}$/,
                        message: "手机号码格式不正确"
                    },
                    { pattern: /^[1-9][0-9]*$/, message: '手机号码必须全为数字' },
                ],
                idCard: [
                    {
                            required: true,
                            message: "身份证号不能为空",
                            trigger: "blur"
                        },
                        { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '身份证格式不正确' },
                ],
                realName: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' },
                    { max: 12, message: '长度不超过12字', trigger: 'blur' }
                ]
            }
        }
    },
    mounted(){
        this.getToken()
    },
    methods: {
        save(){
        if(!this.formRegister.mobile){
            return this.$message.error('手机号码不能为空！')
        }
        let pattern = /^[a-zA-Z0-9]{6,18}$/
        if(!this.formRegister.validator){
            return this.$message.error('验证码不能为空！')
        }
        if(!this.formRegister.password){
            return this.$message.error('登录密码不能为空！')
        }
        if(!this.formRegister.passwords){
            return this.$message.error('重复登录密码不能为空！')
        }
        if(!pattern.test(this.formRegister.password) || !pattern.test(this.formRegister.passwords)){
            return this.$message.error('密码必须是6到18位的字母或数字！')
        }
        if(this.formRegister.realName == ''){
            return this.$message.error('姓名不能为空！')
        }
        if(!this.formRegister.idCard){
            return this.$message.error('身份证号不能为空！')
        }
        if(!this.formRegister.bestFrame){
            return this.$message.error('上传图片不能为空！')
        }
            const params = {
                mobile: this.formRegister.mobile,
                validator: this.formRegister.validator,
                password: this.formRegister.password,
                realName: this.formRegister.realName,
                idCard: this.formRegister.idCard,
                userType: 5,
                talent: {
                    mobile: this.formRegister.mobile,
                    realName: this.formRegister.realName,
                    idCard: this.formRegister.idCard,
                    bestFrame: this.formRegister.bestFrame
                }
            }
            if(!this.onces){
                return
            }
            this.onces = false
            this.$api.signTalent(params).then(res => {
                console.log(res)
                if(res.data.respCode == 0){
                    // this.$message.success('保存成功')
                    this.$alert('保存成功', '提示', {
                        showClose:false,
                        confirmButtonText: '确定',
                        callback: action => {
                            window.location.reload()
                        }
                    });
                }
            }).catch().finally(()=>{
                this.onces = true
            })
        },
    //     open2() {
    //     this.$alert('这是一段内容', '标题名称', {
    //       confirmButtonText: '确定',
    //         showClose:false,
    //       callback: action => {
    //         this.$message({
    //           type: 'info',
    //           message: `action: ${ action }`
    //         });
    //       }
    //     });
    //   },
        getCode() {
            let params = {
                mobile: this.formRegister.mobile
            };
            this.$api
                .getMobileCode(params)
                .then(res => {
                // console.log(res)
                if (res.data.respCode == 0) {
                    this.getTime();
                    return this.$message.success(
                    "短信发送成功，请注意查收验证码信息！"
                    );
                } else {
                    return this.$message.success("短信发送失败！");
                }
                })
                .catch();
        },
        getTime() {
            this.codeTime = this.codeTime - 1;
            this.codeTxt = this.codeTime + "秒后重新发送";
            if (this.codeTime == 0) {
                this.codeTxt = "重新发送";
                this.codeTime = 60;
                this.isMobile = false;
                return;
            } else {
                this.isMobile = true;
            }
            setTimeout(this.getTime, 1000);
            },
        handleRemove(file, fileList) {
            this.formRegister.bestFrame = "";
            console.log(this.formRegister.bestFrame)
            console.log(file, fileList);
        },
        handleExceed(files, fileList) {
            console.log(files)
            console.log(fileList)
            console.log('2222')
            this.$message.warning(`请删除当前文件再重新上传！`);
        },
        handleAvatarScucess(response, file) {
            console.log(file);
            console.log(response);
            const key = response.key;
            const img = `http://${this.bucketHost}/${key}`;
            this.formRegister.bestFrame = img;
            this.getToken()
            // this.$refs.uploadimg.clearValidate()
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
    }
}
</script>

<style>
.newBtnStyle {
  width: 135px;
  margin-left: 15px !important;
  text-align: center;
  /* border: 1px solid #F7BEB2; */
  /* background: #F7BEB2; */
  font-size: 14px;
  /* color: #E84518; */
}
.el-message-box__message p{
    text-align: center;
}
.el-message-box__btns .el-button{
    margin-left: 5px !important;
}
</style>
