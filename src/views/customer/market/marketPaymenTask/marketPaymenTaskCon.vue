<template>
    <div class="marketPaymenTaskCon">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待付" name="first"></el-tab-pane>
            <el-tab-pane label="已付" name="second"></el-tab-pane>
            <awaitingPayment v-if="activeName == 'first' " />
            <alreadyPaid v-if="activeName == 'second' " />
        </el-tabs>
    </div>
</template>
<script>
    import awaitingPayment from './components/awaitingPayment.vue';
    import alreadyPaid from './components/alreadyPaid.vue';  
    export default {
        name: "marketPaymenTask",
        data() {
            return {
                activeName:'first',
            }
        },
        components:{
            awaitingPayment,
            alreadyPaid
        },
        mounted() {
        },
        methods: {
            handleClick(tab, event){
//                console.log(tab);
            },
        },
    }
</script>
<style scoped lang="scss">
    .marketPaymenTaskCon {
        
    }
</style>
<style lang="scss">
    .marketPaymenTaskCon {
        
    }
</style>