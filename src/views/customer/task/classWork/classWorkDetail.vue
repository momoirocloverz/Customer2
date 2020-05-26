<template>
    <div class="">
        <h3 class="sche-title tc pt10 pb20"> {{$route.query.taskName}}</h3>

        <div class="back-white">
            <el-tabs v-model="activeName">
                <el-tab-pane label="班务信息" name="1">
                    <classInfo v-if="activeName == '1'"></classInfo>
                </el-tab-pane>
                <el-tab-pane label="排班零工单价" name="2">
                    <classSetting v-if="activeName == '2'"></classSetting>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>
<script>
    import classInfo from './components/classInfo.vue'
    import classSetting from './components/classSetting.vue';
    export default {
        name: "classWorkDetail",
        components: {
            classInfo,
            classSetting,
        },
        data() {
            return {
                activeName: '1'
            }
        }
    }
</script>