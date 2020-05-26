<template>
    <div>
        <div class="overflow-box1 input-box" >
            <div class="box-title" v-if="!isEdit"><span>添加子女教育专项扣除</span></div>
            <div class="box-title" v-if="isEdit"><span>编辑子女教育专项扣除</span></div>
            <div class="box-body1">
                <div class="box-body-item">
                    <div class="box-body-form">
                        <el-form ref="form1" :model="childForm" label-width="150px" label-position="left" :rules="rules">
                            <el-form-item label="子女姓名：" prop="realName">
                                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model.trim="childForm.realName" maxlength="10"></el-input>
                            </el-form-item>
                            <el-form-item label="子女身份证号：" prop="idcard">
                                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model.trim="childForm.idcard" maxlength="18"></el-input>
                            </el-form-item>
                            <el-form-item label="当前受教育阶段：" prop="status"  >
                                <el-select v-model="childForm.step" class="radius-input " style="width: 100%;" placeholder="请选择">
                                    <el-option v-for="item in eduList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="受教育开始时间：" prop="startTime"  >
                                 <el-date-picker v-model="childForm.startTime" type="date" class="radius-input dateWidth" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="受教育结束时间：" prop="endTime"  >
                                 <el-date-picker v-model="childForm.endTime" type="date" class="radius-input dateWidth" placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="就读学校：" prop="school">
                                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model.trim="childForm.school" maxlength="18"></el-input>
                            </el-form-item>
                            <el-form-item label="当前受教育阶段：" prop="status"  >
                                <el-select v-model="childForm.percent" class="radius-input " style="width: 100%;" placeholder="请选择">
                                    <el-option v-for="item in percentList" :key="item.value" :label="item.label" :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </div>
            <div class="box-footer">
                <el-button round size="medium" type="primary" @click="submitChild">保 存</el-button>
                <el-button round size="medium" @click="goBack">取 消</el-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: "AddForm",
    data () {
        return {
            isEdit:false,
            childForm:{
                realName:'',
                step:'',
                idcard:'',
                startTime:'',
                endTime:'',
                percent:'',
                school:'',
            },
            eduList:[
                {
                    label:'学前教育',
                    value:1,
                },
                {
                    label:'义务教育',
                    value:2,
                },
                {
                    label:'高中教育',
                    value:3,
                },
                {
                    label:'高等教育',
                    value:4,
                },
            ],
            percentList:[
                {
                    label:'50%',
                    value:50,
                },
                {
                    label:'100%',
                    value:100,
                },
            ],
        }
    }

};
</script>
<style scoped>
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
    .workerInp {
        position: relative;
    }
    .yuan {
        position: absolute;
        right: -20px;
    }
    .dateWidth {
        width: 346px;
        height: 36px !important;
    }
</style>
