<template>
    <div class="xfd-list">
        <statusOne v-if="Number(status) === 0 || Number(status) === 1"></statusOne>
        <statusTwo v-if="Number(status) === 3 || Number(status) === 5"></statusTwo>
        <statusThr v-if="Number(status) === 2 || Number(status) === 4"></statusThr>
    </div>
</template>

<script>
    import statusOne from './accountXfd.vue'
    import statusTwo from './accountXfdFail.vue'
    import statusThr from './auditPass.vue'

    export default {
        components:{statusOne,statusTwo,statusThr},
        data() {
            return {
                status:0,
            }
        },
        mounted() {
            this.status = JSON.parse(localStorage.getItem('xfdStatus'));
            if(this.status > 0){
                this.getApply()
            }
        },
        methods: {
            getApply() {
                this.$api.getXfdaccount({}).then(res => {
                    if (res.respCode === 0) {
                        this.status = res.data.status
                        localStorage.xfdStatus = res.data.status
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
        }
    }
</script>

<style lang="scss">
</style>
