<template>
    <div class="back-white">
        <!--<el-tabs v-model="activeName">-->
            <!--<el-tab-pane label="未解绑" name="one"></el-tab-pane>-->
            <!--<el-tab-pane label="已解绑" name="two"></el-tab-pane>-->
        <!--</el-tabs>-->
        <!--<unBindCus v-if="activeName == 'one'"></unBindCus>-->
        <bindCus v-if="activeName == 'two'"></bindCus>
    </div>
</template>
<script>
    import bindCus from './components/bindCus.vue'
//    import unBindCus from './components/unBindCus.vue'
    export default {
        components: {
            bindCus,
        },
        data() {
            return {
                activeName: 'two'
            }
        }
    }
</script>