<template>
  <div class="search-bar">
    <div class="input-search" :class="{'comb-condition': combCondition}">
      <div class="input-search-panel" style="display: flex;">
       
        <el-input class="search-bar-input" v-model="keywords" :placeholder="placeholder">
          <i class="el-icon-search el-input__icon" slot="prefix"></i>
        </el-input>
        <div>
        <el-select v-if="showSelect" v-model="value" @change="handleSelect" :placeholder="slectPlaceholder" class="u-select">
          <el-option
            v-for="item in shusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        </div>
        <el-button style="padding:0;" class="primary-btn" size="mini" @click="handleSearch">搜索</el-button>
        <el-button v-if="combCondition" class="comb-btn" size="mini" type="text" @click="handleCombShow">高级筛选<i class="el-icon-right el-icon-d-arrow-right" :class="isShowComb ? 'el-icon-d-arrow-right-down' : 'el-icon-d-arrow-right-right'"></i></el-button>
      </div>

      <transition name="router-fade" mode="out-in">
        <slot v-if="isShowComb"></slot>
      </transition>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchBar',
  props: {
    combCondition: {
      default: false
    },
    showSelect:{
      default: false
    },
    shusOptions: [Array],
    placeholder: String,
    slectPlaceholder:[String]
  },
  data() {
    return {
      keywords: '',
      isShowComb: false,
      value:''
    }
  },
  mounted() {
  },
  methods: {
    handleSearch() {
      this.$emit('handleSearch', this.keywords)
     
      // if(!this.showSelect){
        
      // }else {
      //   this.$emit('handleSearch', {keywords:this.keywords,value:this.value})
      // }
    },
    handleSelect(){
        this.$emit('handleSelect',this.value)
    },
    handleCombShow() {
      this.isShowComb = !this.isShowComb
    }
  }
}
</script>
<style lang="scss" scoped>
.primary-btn{
  width: 96px;
  height: 34px;
}
.search-bar {
  position: relative;
  padding: 18px 24px;
  .primary-btn {
    margin-left: 16px;
  }
  .comb-btn {
    position: initial;
    right: 6px;
    top: 18px;
  }
}
</style>
<style lang="scss" scope>
.search-bar {
  .el-input {
    width: auto;
  }
  .el-input__inner {
    width: 520px;
    height: 34px;
    font-size: 12px;
    line-height: 32px;
    background-color: #fbfbfd;
    border: 1px solid #dcdfe4;
    border-radius: 0;
  }
  .el-input__icon {
    line-height: 32px;
  }
  .el-button--mini {
    padding: 10px 0;
  }
  .comb-condition {
    form {
      padding: 0 10px;
      margin-top: 14px;
      border-top: 1px solid rgba(234, 237, 244, 1);
    }
  }
}
.el-select .el-input {
    width: 160px;
    .el-input__inner {
    width: 160px;
    }
  }
.u-select {
  margin-left: 12px;
}
</style>
