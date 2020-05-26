<template>
    <div>
        <h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;">选择任务</h1>
        <div style="background: #ffffff;">
            <el-form :model="formStatus" label-width="100px" labelPosition="center">
                <el-form-item label="状态：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="currentIndex">
                        <el-radio :class="{'e-cg-active': currentIndex == 0}" @change="tabShow(0)">全部</el-radio>
                        <el-radio :class="{'e-cg-active': currentIndex == 1}" @change="tabShow(1)">进行中</el-radio>
                        <el-radio :class="{'e-cg-active': currentIndex == 2}" @change="tabShow(2)">已结束</el-radio>
                        <!-- <el-radio label="1">待领取</el-radio> -->
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div v-for="(parentItem, parentIndex) in dataList" :key="parentIndex">
            <el-collapse v-show="parseInt(currentIndex) === parentIndex">
                <el-collapse-item
                     v-for="(item, index) in parentItem.list"
                     :key="index"
                     :title="item.name">
                    <div style="display:flex;">
                        <el-checkbox :indeterminate="item.isIndeterminate"
                                     v-model="item.checkAll"
                                     :class="{'check-all-hand':!item.checkAll}"
                                     @change="changeAll(index)"
                                     style="color:#000;">全选：
                        </el-checkbox>
                        <div style="margin-left:20px;">
                            <el-checkbox-group v-model="item.checkedCities">
                                <el-checkbox v-for="(childItem, childIndex) in item.cityList"
                                             :key="childIndex"
                                             @change="changeChild(index,childIndex)"
                                             :label="childItem"
                                            :value="childItem">
                                        {{`${childItem.taskName}(${childItem.startTime.substr(0,10)} 至 ${childItem.endTime? childItem.endTime.substr(0,10) : '永久' })`}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
        <div class="div_style">
            <p style="width:88px;">已选任务：</p>
            <div v-for="(parentItem,parentIndex) in dataList" :key="parentIndex">
                <div v-for="(item,index) in parentItem.list" :key="index">
                    <span class="span_style" v-for="(childItem,childIndex) in item.checkedCities" >
                        {{`${childItem.taskName}(${childItem.startTime.substr(0,10)} 至 ${childItem.endTime? childItem.endTime.substr(0,10) : '永久' })`}}
                        <i class="xIcon" @click="deleteVal(index,childIndex)"></i>
                    </span>
                </div>
            </div>
        </div>
        <h1 style="color:#383838;font-size:14px;padding:20px 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;">
            <el-button size="medium" style="font-size:12px;" @click="$router.go(-1)">取消</el-button>
            <el-button size="medium" type="primary" style="font-size:12px;" @click="goToPage" :disabled="isDisabled">提交</el-button>
        </h1>
    </div>
</template>

<script>
export default {
    data(){
        return {
            currentIndex:0 ,
            formStatus: {
                status: '0'
            },
            isDisabled:true,
            subData: [
                {
                    list:[],
                }, {
                    list:[],
                }, {
                    list:[],
                }
            ], //选中需要提交的数据
            dataList:[
                {
                    isRequest:false, //是否请求过
                    list:[],
                    statu:'0',
                },
                {
                    isRequest:false,
                    list:[],
                    statu:'2',
                },
                {
                    isRequest:false,
                    list:[],
                    statu:'3',
                }
            ],
        }
    },
    created(){
        this.getList(0);
        this.getList(1);
        this.getList(2);
    },
    mounted(){
    },
    methods: {
        tabShow:function(index){
            this.currentIndex = index;
        },
        getList(index){
            let _this = this;
            let currentItem = _this.dataList[index];
            _this.$api.analyTaskList({
                status:currentItem.statu
            }).then(res => {
                if(parseInt(res.respCode) === 0){
                    let result = res.data;
                    for(let [key,value] of Object.entries(result)){
                        currentItem.list.push({
                            name:key,
                            cityList:value, //显示可选的内容
                            isIndeterminate:false, //显示可选的内容
                            checkAll:false, //是否全选
                            checkedCities:[], //选中的内容
                        });
                    }
                }
            }).catch(err=> {
                console.log(err);
            })
        },
        /*
       * 跳转
        */
        goToPage(){
            let _this = this;
            let arr = [], dataList = [],nextList = [];
            for(let item of _this.subData){
                arr.push(item.list);
            }
            dataList = _this.flatten(arr);
            for (let item of dataList){
                if(item != undefined){
                    nextList.push({
                        id: item.id,
                        name: item.taskName
                    })
                }
            }
            this.$router.push({
                name: 'statementList',
                query: {
                    data:JSON.stringify([...nextList]),
                }
            })
        },
        /**
         * 将多维数组拉成一个数组
         */
        flatten(arr){
            let _this = this;
            let res = [];
            for(let i=0;i<arr.length;i++){
                if(Array.isArray(arr[i])){
                    res = res.concat(_this.flatten(arr[i]));
                }else{
                    res.push(arr[i]);
                }
            }
            return res;
        },
        /*
       * 单个全选
       * @parmas {String, Number} index 索引值
        */
        changeAll(index) {
            let _this = this;
            let current = _this.dataList[_this.currentIndex].list;
            let item = current[index];
            if(!item.checkAll){
                item.checkedCities = [];
            }else{
                item.checkedCities = [...item.cityList];
            }
            item.checkAll = item.checkedCities.length === item.cityList.length;
            item.isIndeterminate = item.checkedCities.length > 0 && item.checkedCities.length < item.cityList.length;
            _this.subData[_this.currentIndex].list[index] = [...item.checkedCities];
            _this.isHave();
      },
        /*
        * 多选框选中或清除
        * @parmas {String, Number} index 一层索引值 index2 二层索引值
         */
        changeChild (index,index2){
        let _this = this;
      let current = _this.dataList[_this.currentIndex].list;  //当前状态的数据列表映射
      let item = current[index];
        let checkedCount = item.checkedCities.length;
        item.checkAll = checkedCount === item.cityList.length;
        item.isIndeterminate = checkedCount > 0 && checkedCount < item.cityList.length;
        _this.subData[_this.currentIndex].list[index] = [...item.checkedCities];
        _this.isHave();
      },
        /*
        * 删除选中的内容
        * @parmas {String, Number} index 一层索引值 index2 二层索引值
         */
      deleteVal(index,index2){
          let _this = this;
          let current = _this.dataList[_this.currentIndex].list;
          let item = current[index];
          item.checkedCities.splice(index2,1);
          item.checkAll = item.checkedCities.length === item.cityList.length;
          item.isIndeterminate = item.checkedCities.length > 0 && item.checkedCities.length < item.cityList.length;
          _this.subData[_this.currentIndex].list[index] = [...item.checkedCities];
          _this.isHave();
      },
        /*
       * 是否具备提交的条件
        */
        isHave(){
            let _this = this;
            let have = true;
            for (let item of _this.subData){
                for(let itemChlid of item.list){
                    if(itemChlid && itemChlid.length > 0){
                        have = false;
                    }
                }
            }
            _this.isDisabled = have;
        }
    }
}
</script>

<style>
    .check-all-hand .el-checkbox__input .el-checkbox__inner{
        background-color: #fff !important;
        border-color:#DCDFE6;
    }
.el-form-item__content{
    line-height: 38px !important;
}
.el-collapse-item__header{
    padding-left: 30px;
}
.el-collapse-item__content{
    padding-left: 30px;
}
.el-checkbox + .el-checkbox{
    margin-left: 0 !important;
}
.xIcon{
    display: inline-block;
    width: 8px;
    height: 8px;
    background-image: url(../../../assets/images/xIcon.png);
    background-size: cover;
    cursor: pointer;
}
.div_style{
    color:#383838;
    font-size:14px;
    font-style:'MicrosoftYaHei';
    padding:20px 0 20px 30px;
    border-bottom:1px solid #EAEDF4;
    background: #ffffff;
    display: flex;
    flex-direction: column;
}
.span_style{
font-size:12px;
color:#1890FF;
padding:8px 15px 8px 15px;
border:1px solid #1890FF;
margin-right: 5px;
margin-top: 3px;
float: left;
}
.radio-search .e-cg-active{
    color: #e84518;
    padding:12px 0;
    border-bottom:2px solid #e84518;
}
.radio-search .e-cg-active .el-radio__label{
    padding:0 10px;
}
</style>
