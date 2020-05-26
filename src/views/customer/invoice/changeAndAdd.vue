<template>
  <div class="change-and-add">
   <span style="color:#383838;font-size:12px;line-height:40px;">{{value}}&nbsp;&nbsp;&nbsp;</span>
    <el-button class="el-btn new_btn" @click="add" v-if="!showChange">添加</el-button>
    <el-button class="el-btn new_btn" @click="change" v-if="showChange">设置</el-button>
  </div>
</template>

<script>
  export default {
    name: "changeAndAdd",
    props:{
      add:Function,
      change:Function,
      showChange:{
        type:Boolean,
        default:false
      },
      value:[String],
    },
    // computed:{
    //   changeValue(){
    //     this.modelValue =this.value;
    //     return this.modelValue;
    //   }
    // },
    methods: {
      // updatedInput() {
      //   console.log(this.value)
      //   this.$emit('changeTo',this.value)
      // },
      dispatch(componentName,eventName,params){
        var parent = this.$parent||this.$root;
        var name = parent.$options.componentName;
        while (parent&&(!name||name!==componentName)){
          parent = parent.$parent;
          if(parent){
            name= parent.$options.componentName;
          }
        }
        if(parent){
          parent.$emit.apply(parent,[eventName].concat(params));
        }
      }
    },
    watch:{
      value(o,n){
          this.$emit('update',this.value)
          this.dispatch('ElFormItem','el.form.blur',['name'])
      }
    }
  }
</script>

<style scoped>

.div .el-button {
  width: 102px !important;
  height: 30px !important;
  line-height: 0px;
}
</style>
