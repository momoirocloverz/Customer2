<template>
  <div class="outstandingFeesCon">
    <el-dialog :visible.sync="innerShow" width="540px" class="base-dialog fuckThis" :close-on-click-modal="false">
      <div class="setHeight">
        <p>您的账户已欠费，所有功能已停用，请充值</p>
      </div>
      <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click.native="cancel">以后再说</el-button>
          <el-button size="medium" class="setCommon" @click.native="confirm">前往充值</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
    data(){
        return {
            innerShow:false,
        }
    },
    props:{
        show:{
          type: Boolean,
          required: true
        },
        cancel:{
            type: Function,
            required: true
        },
        confirm:{
            type: Function,
            required: true
        },
    },
    watch:{
        show:function(nval,val){
            this.innerShow = nval;
        }
    },
}
</script>
<style lang="scss" scope>
    .outstandingFeesCon {
        .setHeight {
            height: 60px !important;
        }
        .el-button {
            width: 120px !important;
            font-size: 14px !important;
            &:hover {
                background: #FFFFFF !important;
                border: 1px solid #DCDFE6 !important;
                border-color: #DCDFE6 !important;
                color: #606266 !important;
            }
        }
        .el-dialog{
            position: absolute;
            left: 0;
            right: 0;
            bottom: 0;
            top: 0;
            margin: auto !important;
            width: 540px !important;
            height: 196px !important;
        }
        .setCommon {
            background-color: #ffefea !important;
            border: 1px solid #f7beb2 !important;
            color:  #e9481c !important;
            &:hover {
                background-color: #ffefea !important;
                border: 1px solid #f7beb2 !important;
                color:  #e9481c !important;
            }
        }
        .fuckThis {
            .el-dialog__header {
                border-bottom: none;
                height: 20px !important;
                padding-bottom:0 !important;
            }
        }
    }
</style>