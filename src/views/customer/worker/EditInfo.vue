<template>
    <div>
        <div class="overflow-box1 input-box" >
            <div class="box-title" ><span>编辑社保信息</span></div>
            <div class="box-body1">
                <div class="box-body-item">
                    <div class="box-body-form">
                        <el-form ref="form" :model="form" label-width="180px" label-position="left" :rules="rules">
                            <el-form-item label="是否缴纳社保：" prop="isSociaSecurity" required>
                                <el-radio-group v-model="form.isSociaSecurity" >
                                    <el-radio label="2">否</el-radio>
                                    <el-radio label="1">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="开始缴纳月份：" prop="startMonth" required>
                                <el-radio-group v-model="form.startMonth" >
                                    <el-radio label="1">本月</el-radio>
                                    <el-radio label="2">次月</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="社保缴纳基数：" class="is-required">
                                <el-col :span="12">
                                    <el-form-item prop="incomeType">
                                        <el-select v-model="form.incomeType" class="radius-input workerInp" placeholder="请选择">
                                            <el-option v-for="item in incomeTypeList" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item prop="income" v-if="form.incomeType == 1">
                                        <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.income" maxlength="10"></el-input>元
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="是否缴纳公积金：" prop="isAccumulationFund">
                                <el-radio-group v-model="form.isAccumulationFund" required>
                                    
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="是否享受个税专项扣除：" prop="isPIncome" required>
                                <el-radio-group v-model="form.isPIncome" >
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="是否有配偶：" prop="isMate" class="is-required">
                                <el-radio-group v-model="form.hasSpouse" >
                                    <el-radio label="1">是</el-radio>
                                    <el-radio label="2">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <el-form-item label="配偶姓名：" prop="spouseName">
                                <el-input class="radius-input" placeholder="" size="medium" v-model="form.spouseName" maxlength="10"></el-input>
                            </el-form-item>
                            <el-form-item label="配偶身份证号：" prop="spouseIdCard">
                                <el-input class="radius-input" placeholder="" size="medium" v-model="form.spouseIdCard" maxlength="18"></el-input>
                            </el-form-item>
                            <el-form-item label="子女教育专项扣除：" v-if="form.isSociaSecurity == 1 && form.pType == 1"  prop="child">
                                <template>
                                    <el-input class="radius-input keepWidth" placeholder="" size="medium" v-model="form.child" maxlength="10"></el-input>元
                                    <el-button class="read-btn">添加</el-button>
                                    <el-button class="read-btn">删除</el-button>
                                </template>
                            </el-form-item>
                            <el-form-item label="继续教育专项扣除：" v-if="form.isSociaSecurity == 1 && form.pType == 1"  prop="keep">
                                <el-input class="radius-input keepWidth" placeholder="" size="medium" v-model="form.keep"  maxlength="10"></el-input>元
                            </el-form-item>
                            <el-form-item label="住房专项扣除类型：" v-if="form.isSociaSecurity == 1 && form.pType == 1" class="is-required">
                                <el-col :span="12">
                                    <el-form-item prop="incomeType">
                                        <el-select v-model="form.houseType" class="radius-input workerInp" placeholder="请选择">
                                            <el-option v-for="item in huuseList" :key="item.value" :label="item.label" :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                    <el-form-item prop="house">
                                        <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="form.house"  maxlength="10"></el-input>元
                                    </el-form-item>
                                </el-col>
                            </el-form-item>
                            <el-form-item label="赡养老人扣除：" v-if="form.isSociaSecurity == 1 && form.pType == 1"  prop="old">
                                <el-input class="radius-input keepWidth" placeholder="" size="medium" v-model="form.old"  maxlength="10"></el-input>元
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="box-footer2">
        <el-button
          round
          size="medium"
          type="primary"
          @click="saveWelfare"
        >保 存</el-button>
        <el-button
          round
          size="medium"
          @click="$router.go(-1)"
          
        >取 消</el-button>
      </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:"editInfo",
        data () {
            return {
                form:{
                    isSociaSecurity:'2',
                    startMonth:'1',
                    incomeType:1,
                    income:'',
                    isAccumulationFund:'1',
                    isPIncome:'1',
                    hasSpouse:'2',
                    spouseName:'',
                    spouseIdCard:'',
                    pType:1,
          child:'',
          keep:'',
          house:'',
          houseType:'',
          old:'',
                },
                incomeTypeList:[
                    {
                        label:'部分收入',
                        value:1,
                    },
                    {
                        label:'全部收入',
                        value:2,
                    },
                ],
                data:{},
                id:'',
                rules: {
                    spouseName: [
                        {
                            required: true,
                            message: "配偶姓名不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[\u4e00-\u9fa5]*$/,
                            message: "请输入正确的配偶姓名"
                        }
                    ],
                    spouseIdCard: [
                        {
                            required: true,
                            message: "配偶身份证号不能为空",
                            trigger: "blur"
                        },
                    ],
                    income: [
                        {
                            required: true,
                            message: "社保缴纳基数不能为空",
                            trigger: "blur"
                        },
                        {
                            pattern: /^[1-9][0-9]*$/,
                            message: "社保缴纳基数必须全为数字"
                        }
                    ],
                },
            }
        },
        methods: {
            getDetail() {
                const params = {
                    talentId: this.$route.params.id
                };
                this.$api
                    .GetWelfareDetil(params)
                    .then(response => {
                        console.log(response)
                        this.id = response.data.id
                        this.form.isSociaSecurity =(response.data.isSociaSecurity).toString()
                        this.form.startMonth =(response.data.startMonth).toString()
                        this.form.isPIncome =(response.data.isTaxDeduction).toString()
                        this.form.hasSpouse =(response.data.hasSpouse).toString()
                        this.form.income = response.data.socialSecurityBase
                        this.form.spouseName = response.data.spouseName
                        this.form.spouseIdCard = response.data.spouseIdCard
                        this.form.isAccumulationFund = (response.data.isAccumulationFund).toString()
                    })
                    .catch(error => {
                    console.log(error);
                    });
            },
            saveWelfare() {
                this.$refs.form.validate((valid) => {
                if (valid) {
                    const params = {
                    id: this.id,
                    isSociaSecurity: this.form.isSociaSecurity,
                    startMonth: this.form.startMonth,
                    hasSpouse: this.form.hasSpouse,
                    socialSecurityBase: this.form.incomeType = 1 ? this.form.income : '',
                    isTaxDeduction: this.form.isPIncome,
                    spouseName: this.form.spouseName,
                    spouseIdCard: this.form.spouseIdCard,
                    isAccumulationFund: this.form.isAccumulationFund,
                };
                this.$api
                    .saveWelfareSetting(params)
                    .then(response => {
                    if(response.data.respCode == 0){
                        this.$router.go(-1);
                    this.$message.success(`编辑成功`);
                    }
                    })
                    .catch(error => {
                    console.log(error);
                    });
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
                
            },
        },
        mounted () {
            this.getDetail()
        }
    }
</script>

<style scoped>
.overflow-box1 {
    font-family: MicrosoftYaHei;
    background-color: #ffffff;
    box-shadow: 0px 2px 21px 0px rgba(156, 156, 156, 0.35);
    border-radius: 8px;
    margin: 70px auto;
    padding-bottom: 36px;
    width:646px
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
.box-body1 {
    padding: 10px;
    /*height: 300px;*/
}
.box-body-item {
    margin: 40px;
}
.box-body-form {
    margin: 20px;
}
 .workerInp{
    width:146px
}
.box-footer2 {
  text-align: center;
  padding: 30px 0;
}
.keepWidth{
  width:172px
}
.read-btn {
  /* width: 128px; */
  height: 38px;
  border-radius: 18px;
  background-color: #ffffff;
  border: solid 1px #e84518;
  color: #e84518;
  padding: 12px 16px;
  /* margin-left: 20px; */
}
</style>