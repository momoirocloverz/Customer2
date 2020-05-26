<template>
    <div class="marketReceiveTaskCon">
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="待收" name="first"></el-tab-pane>
            <el-tab-pane label="已收" name="second"></el-tab-pane>
            <awaitingPayment v-if="activeName == 'first' " />
            <alreadyPaid v-if="activeName == 'second' " />
        </el-tabs>
    </div>
</template>
<script>
    import awaitingPayment from './components/awaitingPayment.vue';
    import alreadyPaid from './components/alreadyPaid.vue';    
    export default {
        name: "marketReceiveTask",
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
    .marketReceiveTaskCon {
        
    }
</style>