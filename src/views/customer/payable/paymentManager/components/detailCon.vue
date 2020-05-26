<template>
    <div class="marketPaymenTaskCon">
        <div class="nameCon">{{taskName}}</div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="班务收入" name="first"></el-tab-pane>
            <el-tab-pane label="班务支出" name="second"></el-tab-pane>
            <detailSelf v-if=" activeName == 'first' "></detailSelf>
            <expense v-if=" activeName == 'second' "></expense>
        </el-tabs>
    </div>
</template>
<script>
    import detailSelf from './detailSelf.vue';
    import expense from './expense.vue';
    export default {
        name: "marketPaymenTask",
        data() {
            return {
                taskName:'任务明细',
                activeName:'first',
            }
        },
        components:{
            detailSelf,
            expense
        },
        mounted() {
            this.analyseQuery();
        },
        methods: {
            analyseQuery(){
                this.taskName =  `${this.$route.query.classTaskName}任务明细${this.$route.query.batchNumber}`;
            },
            handleClick(tab, event){
//                console.log(tab);
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketPaymenTaskCon {
        .nameCon {
            margin-bottom: 20px;
            margin-top: 20px;
            text-align: center;
            font-size: 20px;
            line-height: 2;
            letter-spacing: 1px;
            color: #262626;
            font-weight: bold;
        }
    }
</style>
<style lang="scss">
    .marketPaymenTaskCon {
        
    }
</style>