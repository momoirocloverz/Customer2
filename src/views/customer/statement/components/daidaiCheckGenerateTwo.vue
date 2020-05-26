<template>
    <div>
        <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;background: #ffffff;border-bottom:1px solid #EAEDF4;">第二步，确认支出</h1>
        <div style="background:#ffffff;padding-left:35px;">
            <el-form :model="form" label-width="120px" labelPosition="center" :rules="rules">
                <el-form-item label="应付零工：" class="formSearchMargin">
                    <span>{{(fixationIncome.payPop).toFixed(2) || 0}}</span>元
                </el-form-item>
                <!--<el-form-item label="社保费用：" class="formSearchMargin">-->
                    <!--<span>{{(fixationIncome.paySocial).toFixed(2) || 0}}</span>元-->
                <!--</el-form-item>-->
                <el-form-item label="考勤管理费：" class="formSearchMargin">
                    <span>{{(fixationIncome.payAttendance).toFixed(2) || 0}}</span>元
                </el-form-item>
                <!--<el-form-item label="派工费用：" class="formSearchMargin">-->
                    <!--<span>{{(fixationIncome.paySend).toFixed(2) || 0}}</span>元-->
                <!--</el-form-item>-->
                <el-form-item label="固定费用：" class="formSearchMargin">
                    <el-radio-group v-model="form.qiyong">
                        <el-radio label="1">启用</el-radio>
                        <el-radio label="2">不启用</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="计算方式：" class="formSearchMargin" v-if="form.qiyong=='1'">
                    <el-select v-model="form.region">
                        <el-option label="计时" value="1"></el-option>
                        <el-option label="计量" value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="总工时：" class="formSearchMargin" v-if="form.qiyong=='1'&&form.region=='1'">
                    <span>{{fixationIncome.times || 0}}</span>
                </el-form-item>
                <el-form-item label="总产量：" class="formSearchMargin" v-if="form.qiyong=='1'&&form.region=='2'">
                    <span>{{fixationIncome.jian}}件</span>&nbsp;&nbsp;
                    <span>{{fixationIncome.dai}}袋</span>&nbsp;&nbsp;
                    <span>{{fixationIncome.che}}车</span>&nbsp;&nbsp;
                    <span>{{fixationIncome.dun}}吨</span>&nbsp;&nbsp;
                </el-form-item>
                <el-form-item label="单价：" prop="hours" class="formSearchMargin" v-if="form.qiyong=='1'&&form.region=='1'">
                    <el-input v-model="form.hours" style="width:220px;" @keyup.native="keyUpCost(form.hours,'hours')"></el-input>元/小时
                </el-form-item>
                <el-form-item label="单价：" class="formSearchMargin" v-if="form.qiyong=='1'&&form.region=='2'">
                    <el-input v-model="form.jian" style="width:130px;" @keyup.native="keyUpCost(form.jian,'jian')"></el-input>元/件
                    <el-input v-model="form.dai" style="width:130px;" @keyup.native="keyUpCost(form.dai,'dai')"></el-input>元/袋
                    <el-input v-model="form.che" style="width:130px;" @keyup.native="keyUpCost(form.che,'che')"></el-input>元/车
                    <el-input v-model="form.dun" style="width:130px;" @keyup.native="keyUpCost(form.dun,'dun')"></el-input>元/吨
                </el-form-item>
                <el-form-item label="固定费用合计：" class="formSearchMargin" v-if="form.qiyong=='1'">
                    <span>{{fixationFee}}</span>元
                </el-form-item>
                <div v-for="(item,index) in otherArr" :key="index" class="other">
                    <el-form-item :label="item.name+'：'" class="formSearchMargin">
                        <span>{{item.amount}}</span>元&nbsp;&nbsp;&nbsp;<i class="btn-icon btn-icon-delete" style="cursor:pointer;" @click="deleteOther(index,item.name)"></i>
                    </el-form-item>
                </div>
            </el-form>
        <h1 style="color:#E9481C;font-size:14px;font-style:MicrosoftYaHei;padding:0 0 20px 30px;background: #ffffff;border-bottom:1px solid #EAEDF4;"><span style="cursor: pointer;" @click="openAmount">+ 添加其他支出</span></h1>
        <div style="background:#ffffff;padding: 12px 0 12px 35px;">
            <el-button style="font-size:12px;" size="medium" @click="cancel">上一步</el-button>
            <el-button style="width:102px;height:36px;" type="primary" size="small" class="datesearchBtn" @click="btn_submit">提交</el-button>&nbsp;&nbsp;&nbsp;
            <span style="color:#383838;">费用总计： {{allShouRu}}</span>
        </div>
        </div>
        <!-- 弹窗 -->
        <el-dialog title="添加其他支出" :visible.sync="dialogFormVisible" v-if="dialogFormVisible" width="540px">
        <el-form :model="formDialog" :rules="rulesDialog">
            <el-form-item label="支出名：" label-width="220px">
            <el-select v-model="formDialog.name" placeholder="请输入支出名">
                <el-option :label="item.dicName" :value="item.dicName" v-for="item in skillArr" :key="item.id" :disabled="item.disabled"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="支出金额：" prop="amount" label-width="220px">
            <el-input v-model="formDialog.amount" @keyup.native="keyUpCost2(formDialog.amount,'amount')" style="width:220px;"></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="btn_true">确 认</el-button>
            <el-button @click="dialogFormVisible = false">取 消</el-button>
        </div>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            isDisabled: false,
            dialogFormVisible: false,
            form: {
                qiyong: '1',
                region: '1',
                jian: '',
                dai: '',
                che: '',
                dun: '',
                hours: 0
            },
            // fixationFee: 0,
            formDialog: {
                name: '',
                amount: '',
            },
            manageId: '',
            month: '',
            id: '',
            managerName: '',
            fixationIncome: {},
            skillArr: [],
            otherArr: [],
            btnDisabled: false,
            otherAmount: 0,
            requestArr: [],
            Arr: [],
            otherObj: {},
            rules: {
                hours: [
                    // { required: true, message: "计时单价不能为空", trigger: "blur" }
                ]
            },
            rulesDialog: {
                amount: [
                    { required: true, message: "支出金额不能为空", trigger: "blur" }
                ]
            },
            pattern: /^-?\d*\.?\d*$/
        }
    },
    watch: {
        dialogFormVisible: {
            handler(val,old){
                if(val == false){
                    this.formDialog.name = ''
                    this.formDialog.amount = ''
                }
            },
            deep: true,
            immediate: true
        },
    },
    computed: {
        'allShouRu': function(){
            //this.fixationIncome.paySend+ 3.02版本去掉
             let abc = (this.fixationIncome.payPop+this.fixationIncome.paySocial+this.fixationIncome.payAttendance+Number(this.fixationFee)) || 0
             this.otherArr.forEach(item => {
                 abc+=Number(item.amount)
             })
             return abc.toFixed(2)
        },
        'fixationFee':function(){
            if(this.form.qiyong == '1'){
                if(this.form.region=='1'){
                    return (this.fixationIncome.times && this.form.hours)?(this.fixationIncome.times*this.form.hours).toFixed(2) : 0 
                }else if(this.form.region=='2'){
                    return (this.fixationIncome.jian*this.form.jian+this.fixationIncome.dai*this.form.dai+this.fixationIncome.che*this.form.che+this.fixationIncome.dun*this.form.dun).toFixed(2) || 0
                }
            }else if(this.form.qiyong == '2'){
                return 0
            }
        }
    },
    methods: {
        btn_submit(){
            if(this.form.qiyong == '1'){
                if(this.form.region == '1'){
                    if(!this.form.hours){
                        return this.$message.error('单价不能为空')
                    }else if(this.form.hours==0.0||this.form.hours==0.00||this.form.hours==0.000||this.form.hours==0.0000){
                        return this.$message.error('请输入正确的单价')
                    }
                }else if(this.form.region == '2'){
                    if(!this.form.jian || !this.form.dai || !this.form.che || !this.form.dun){
                        return this.$message.error('计量单价：件，袋，车，吨均不能为空')
                    }else if(!this.pattern.test(this.form.jian)||!this.pattern.test(this.form.dai)||!this.pattern.test(this.form.che)||!this.pattern.test(this.form.dun)){
                        return this.$message.error('请输入正确的单价')
                    }else if(this.form.jian=='0'||this.form.dai=='0'||this.form.che=='0'||this.form.dun=='0'){
                        return this.$message.error('单价不能为0')
                    }
                }
            }
            this.requestArr = []
            this.requestArr.push(
                {
                  profitId: this.id,
                  managerId: this.manageId,
                  inOutType: 2,
                  bizType: 3,
                  bizName: '应付零工',
                  bizId: '',
                  bizAmount: this.fixationIncome.payPop
                },
                {
                  profitId: this.id,
                  managerId: this.manageId,
                  inOutType: 2,
                  bizType: 4,
                  bizName: '社保费用',
                  bizId: '',
                  bizAmount: this.fixationIncome.paySocial
                },
                {
                  profitId: this.id,
                  managerId: this.manageId,
                  inOutType: 2,
                  bizType: 5,
                  bizName: '考勤管理费',
                  bizId: '',
                  bizAmount: this.fixationIncome.payAttendance
                },
                // {
                //   profitId: this.id,
                //   managerId: this.manageId,
                //   inOutType: 2,
                //   bizType: 6,
                //   bizName: '派工费用',
                //   bizId: '',
                //   bizAmount: this.fixationIncome.paySend
                // },
                {
                  profitId: this.id,
                  managerId: this.manageId,
                  inOutType: 2,
                  bizType: 7,
                  bizName: '固定费用',
                  bizId: '',
                  bizAmount: this.fixationFee
                }
            )
            this.Arr.forEach(item => {
                this.requestArr.push(item)
            })
            const params = {
                id: this.id,
                managerId: this.manageId,
                managerName: this.managerName,
                yearMonthStr: this.month,
                totalOut: this.allShouRu,
                profitDetailDOList: this.requestArr
            }
            if(this.form.qiyong == '2'){
                let newRequestArr = []
                this.requestArr.forEach(item => {
                    if(item.bizName != '固定费用'){
                        newRequestArr.push(item)
                    }
                })
                this.requestArr = newRequestArr
            }
            console.log(this.requestArr)
            console.log(params)
            this.$api.finshProfitTwo(params).then(res => {
                console.log(res)
                if(res.data.respCode == 0){
                    this.$message.success('提交成功!')
                    setTimeout(()=>{
                        this.$router.push({name: 'profitDetail1'})
                    },500)
                }else if(res.data.respCode == -1 && res.data.errorCode == 500){
                    this.$message.error(res.data.errorMsg)
                }else if(res.data.respCode == -2){
                    this.$message.error('需要登录!')
                }
            }).catch()
        },
        getData(){
            let params = {
                managerId: this.manageId,
                month: this.month
            }
            this.$api.payQuery(params).then(res => {
                console.log(res)
                if(res.respCode == 0){
                    if(res.data){
                        this.fixationIncome = res.data
                    }
                }
            }).catch()
        },
        btn_true(){
            if(!this.formDialog.amount){
                return this.$message.error('支出金额不能为空！')
            }else if(this.formDialog.amount == '0'){
                return this.$message.error('支出金额不能为0！')
            }else if(this.formDialog.amount == '0.0'||this.formDialog.amount == '0.00'){
                return this.$message.error('请输入正确的支出金额！')
            }
            if(!this.formDialog.name){
                return this.$message.error('支出名不能为空！')
            }
            this.otherArr.push({
                name: this.formDialog.name,
                amount: this.formDialog.amount,
            })
            this.skillArr.forEach(item => {
                if(item.dicName == this.formDialog.name){
                    item.disabled = true
                }
            })
            // this.btnDisabled = this.skillArr.every(item => {
            //     return item.disabled
            // })
            console.log(this.skillArr)
            this.dialogFormVisible = false
            console.log(this.otherArr)
            this.otherAmount = 0
            this.otherArr.forEach(item => {
                this.otherAmount+= Number(item.amount)
            })
            this.otherObj = {
                profitId: this.id,
                managerId: this.manageId,
                inOutType: 2,
                bizType: 8,
                bizName: this.formDialog.name,
                bizId: '',
                bizAmount: this.formDialog.amount
            }
            this.Arr.push(this.otherObj)
            // console.log(this.otherObj)
            // console.log(this.Arr)
        },
        openAmount(){
            console.log(this.otherArr)
            this.dialogFormVisible = true
        },
        deleteOther(index,name){
            console.log(index)
            this.Arr.forEach((item,i) => {
                if(i == index){
                    this.Arr.splice(i,1)
                }
            })
            // console.log(this.Arr)
            this.otherArr.splice(index,1)
            this.skillArr.forEach((item,i)=>{
                if(item.dicName == name){
                    item.disabled = false
                }
            })
        },
        cancel(){
            this.$router.push({
                name: 'daiCheckGenerate'
            })
        },
        getSkill(){
            const params = {
                code: 'profit_out'
            }
            this.$api.GetAllTags(params).then(res => {
                console.log(res)
                if(res.respCode == 0){
                    if(res.data){
                        this.skillArr = res.data
                    }
                }
            }).catch()
        },
    keyUpCost(value,name) {
    //   let value = this.form.hours || this.form.jian || this.form.dai || this.form.che || this.form.dun;
      console.log(value);
      let pattern = /^-?\d*\.?\d*$/;
      console.log(Number(value));
      if (pattern.test(value)) {
        if (Number(value >= 0)) {
          let falseNum = value.substr(0, 1);
          let numLength = value.indexOf(".");
          if (value.indexOf(".") != -1) {
            this.form[name] = value.substr(0, value.indexOf(".") + 5);
            if (Number(falseNum) == 0 && numLength >= 2) {
              this.form[name] = null;
            }
          } else {
            this.form[name] = value.substr(0, 10);
          }
        } else {
          this.form[name] = null;
        }
      } else {
        this.form[name] = null;
      }
    },
    keyUpCost2(value,name) {
    //   let value = this.form.hours || this.form.jian || this.form.dai || this.form.che || this.form.dun;
      console.log(value);
      let pattern = /^-?\d*\.?\d*$/;
      console.log(Number(value));
      if (pattern.test(value)) {
        if (Number(value >= 0)) {
          let falseNum = value.substr(0, 1);
          let numLength = value.indexOf(".");
          if (value.indexOf(".") != -1) {
            this.formDialog[name] = value.substr(0, value.indexOf(".") + 3);
            if (Number(falseNum) == 0 && numLength >= 2) {
              this.formDialog[name] = null;
            }
          } else {
            this.formDialog[name] = value.substr(0, 10);
          }
        } else {
          this.formDialog[name] = null;
        }
      } else {
        this.formDialog[name] = null;
      }
    }
    },
    created(){
        this.manageId = this.$route.params.managerId
        this.month = this.$route.params.month
        this.id = this.$route.params.id
        this.managerName = this.$route.params.managerName
        this.getData()
        this.getSkill()
    }
}
</script>

<style>
.other .el-form-item__content {
    display: flex;
    align-items: center;
}
.other .btn-icon::before{
    position: absolute;
    top: -6px;left: 0;
}
</style>
