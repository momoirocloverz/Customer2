<template>
    <div class="choose-task">
        <!--<h1 style="color:#383838;font-size:14px;font-style:MicrosoftYaHei;padding:0 0 20px 30px;border-bottom:1px solid #EAEDF4;background: #ffffff;">-->
            <!--选择班务</h1>-->
        <!--<div style="background: #ffffff;">
            <el-form :model="formStatus" label-width="100px" labelPosition="center">
                <el-form-item label="状态：" class="formSearchMargin">
                    <el-radio-group class="radio-search" v-model="currentIndex">
                        <el-radio :class="{'e-cg-active': currentIndex == 0}" @change="tabShow(0)">未开始</el-radio>
                        <el-radio :class="{'e-cg-active': currentIndex == 1}" @change="tabShow(1)">进行中</el-radio>
                        <el-radio :class="{'e-cg-active': currentIndex == 2}" @change="tabShow(2)">已结束</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </div>
        <div v-for="(parentItem, parentIndex) in dataList" :key="parentIndex">
            <div v-show="parseInt(currentIndex) === parentIndex">
                <div class="new-p-item" v-for="(item, index) in parentItem.list" :key="index">
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
                                    {{`${childItem.classTaskName}(${childItem.startTime.substr(0,10)} 至
                                    ${childItem.endTime? childItem.endTime.substr(0,10) : '永久' })`}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="div_style">
            <p style="width:88px;">已选班务：</p>
            <div v-for="(parentItem,parentIndex) in dataList" :key="parentIndex">
                <div v-for="(item,index) in parentItem.list" :key="index">
                    <span class="span_style" v-for="(childItem,childIndex) in item.checkedCities">
                        {{`${childItem.classTaskName}(${childItem.startTime.substr(0,10)} 至 ${childItem.endTime? childItem.endTime.substr(0,10) : '永久' })`}}
                        <i class="xIcon" @click="deleteVal(index,childIndex)"></i>
                    </span>
                </div>
            </div>
        </div>-->
         <!--<div style="background: #ffffff;">-->
            <!--<el-form :model="formStatus" label-width="100px" labelPosition="center">-->
                <!--<el-form-item label="状态：" class="formSearchMargin">-->
                    <!--<el-radio-group class="radio-search" v-model="currentIndex">-->
                        <!--<el-radio :class="{'e-cg-active': currentIndex == 0}" @change="tabShow(0)">未开始</el-radio>-->
                        <!--<el-radio :class="{'e-cg-active': currentIndex == 1}" @change="tabShow(1)">进行中</el-radio>-->
                        <!--<el-radio :class="{'e-cg-active': currentIndex == 2}" @change="tabShow(2)">已结束</el-radio>-->
                    <!--</el-radio-group>-->
                <!--</el-form-item>-->
            <!--</el-form>-->
        <!--</div>-->
        <div class="div_style">
            <p class="">已选{{selectTotal}}个班务：</p>
            <div class="mb20 pt5" style="max-height:120px;overflow-y: auto">
                <div v-for="(parentItem,parentIndex) in dataList" :key="parentIndex">
                    <div v-for="(item,index) in parentItem.list" :key="index">
                    <span class="span_style" v-for="(childItem,childIndex) in item.checkedCities" >
                        {{`${childItem.classTaskName}(${childItem.startTime.substr(0,10)} 至 ${childItem.endTime? childItem.endTime.substr(0,10) : '永久' })`}}
                        <!--<i class="xIcon" @click="deleteVal(index,childIndex,childItem)"></i>-->
                        <img src="../../../assets/icons/x.png" style="cursor:pointer"
                             @click="deleteVal(index,childIndex,childItem)">
                    </span>
                    </div>
                </div>
            </div>
        </div>
        <div style="height:300px;overflow-y: auto">
            <div v-for="(parentItem, parentIndex) in dataList" :key="parentIndex">
                <el-collapse v-show="parseInt(currentIndex) === parentIndex" v-model="activeName">
                    <el-collapse-item
                            v-for="(item, index) in parentItem.list"
                            :key="index"
                            :name="index"
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
                                        {{`${childItem.classTaskName}(${childItem.startTime.substr(0,10)} 至 ${childItem.endTime? childItem.endTime.substr(0,10) : '永久' })`}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </div>
        <div class="dialog-footer-center" style="color:#383838;font-size:14px;padding:20px 0 20px 30px;background: #ffffff;">
            <el-button size="medium" class="mr15" style="font-size:12px;" @click="cancelList">取消</el-button>
            <el-button size="medium" type="primary" style="font-size:12px;" @click="goToPage" :disabled="isDisabled">
                提交
            </el-button>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex'
    export default {
        props:{
            'handleGetSelectClass':[Function],
            'handleCancelClassDia':[Function]
        },
        data() {
            return {
                currentIndex: 0,
                formStatus: {
                    status: '0'
                },
                activeName:[0,1],
                isDisabled: true,
                subData: [
                    {
                        list: [],
                    }, {
                        list: [],
                    }, {
                        list: [],
                    }
                ], //选中需要提交的数据
                dataList: [
                    {
                        isRequest: false, //是否请求过
                        list: [],
                        statu: '',//不传全部、1未开始、2进行中、3已结束
                    },
                    {
                        isRequest: false,
                        list: [],
                        statu: '2',
                    },
                    {
                        isRequest: false,
                        list: [],
                        statu: '3',
                    }
                ],
                selectTotal:0,
            }
        },
        computed: {
            ...mapGetters(['getSelectProfitList','getSelectProfitTotal'])
        },
        created() {
            this.getListOld(0);
            // this.getListOld(1);
            // this.getListOld(2);
            // this.getList();
            // this.getList(2);
        },
        mounted() {

        },
        methods: {
            cancelList(){
                console.log(1);
                this.dataList = this.getSelectProfitList;
                console.log(this.getSelectProfitList)
                this.selectTotal = this.getSelectProfitTotal;
                console.log(this.selectTotal)
                console.log(2);
                this.handleCancelClassDia()
            },
            tabShow: function (index) {
                this.currentIndex = index;
                // this.getListOld(index);
            },
            getList: function (index) {
                let _this = this;
                let currentItem = _this.dataList[index];
                if(currentItem.list.length > 0){
                    return
                }else{
                    _this.$api.getTaskList({
                        classTaskStatus: currentItem.statu
                    }).then(res => {
                        if (res.data.respCode === 0) {
                            let result = res.data.data;
                            currentItem.list.push({
                                name: '',
                                cityList: [...result.list], //显示可选的内容
                                isIndeterminate: false, //显示可选的内容
                                checkAll: false, //是否全选
                                checkedCities: [], //选中的内容
                            });
                        }
                        console.log(_this.dataList);
                    }).catch(err => {
                        console.log(err);
                    })
                }
            },
            getListOld(index) {
                let _this = this;
                let currentItem = _this.dataList[index];
                _this.$api.analyTaskList({
                    status: currentItem.statu
                }).then(res => {
                    if (parseInt(res.respCode) === 0) {
                        let result = res.data;
                        let arr = [];
                        console.log(res.data)
                        for (let [key, value] of Object.entries(result)) {
                            arr.push({
                                name: key,
                                cityList: value, //显示可选的内容
                                isIndeterminate: false, //显示可选的内容
                                checkAll: false, //是否全选
                                checkedCities: [], //选中的内容
                            });
                        }
                        currentItem.list = arr;
                        let dataList = JSON.parse(JSON.stringify(this.dataList))
                        this.$store.commit('SET_SELECT_PROFIT_LIST', dataList);
                        this.$store.commit('SET_SELECT_PROFIT_TOTAL', this.selectTotal);
                        // console.log(this.dataList)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            /*
           * 跳转
            */
            goToPage() {
                let _this = this;
                let arr = [], dataList = [], nextList = [];
                for (let item of _this.subData) {
                    arr.push(item.list);
                }
                dataList = _this.flatten(arr);
                for (let item of dataList) {
                    if (item != undefined) {
                        nextList.push({
                            id: item.classTaskId,
                            name: item.classTaskName
                        })
                    }
                }
                this.$store.commit('SET_SELECT_PROFIT',[...nextList]);
                let dataProList = JSON.parse(JSON.stringify(this.dataList))
                this.$store.commit('SET_SELECT_PROFIT_LIST', dataProList);
                this.$store.commit('SET_SELECT_PROFIT_TOTAL', this.selectTotal);
                this.handleGetSelectClass();
                // this.$router.push({
                //     name: 'statementList',
                //     query: {
                //         // hasContent:1,
                //         // data: JSON.stringify([...nextList]),
                //     }
                // })
            },
            /**
             * 将多维数组拉成一个数组
             */
            flatten(arr) {
                let _this = this;
                let res = [];
                for (let i = 0; i < arr.length; i++) {
                    if (Array.isArray(arr[i])) {
                        res = res.concat(_this.flatten(arr[i]));
                    } else {
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
                if (!item.checkAll) {
                    item.checkedCities = [];
                } else {
                    item.checkedCities = [...item.cityList];
                }
                item.checkAll = item.checkedCities.length === item.cityList.length;
                item.isIndeterminate = item.checkedCities.length > 0 && item.checkedCities.length < item.cityList.length;
                _this.subData[_this.currentIndex].list[index] = [...item.checkedCities];
                _this.getSelectTotal()
                _this.isHave();
            },
            getSelectTotal(){
                let _this = this;
                let arr = [],nextList = [];
                for (let item of _this.subData) {
                    arr.push(item.list);
                }
                console.log(arr)
                let dataList = _this.flatten(arr);
                for (let item of dataList) {
                    if (item != undefined) {
                        nextList.push({
                            id: item.classTaskId,
                            name: item.classTaskName
                        })
                    }
                }
                console.log(nextList)
                this.selectTotal = nextList.length;
            },
            /*
            * 多选框选中或清除
            * @parmas {String, Number} index 一层索引值 index2 二层索引值
             */
            changeChild(index, index2) {
                let _this = this;
                let current = _this.dataList[_this.currentIndex].list;  //当前状态的数据列表映射
                let item = current[index];
                let checkedCount = item.checkedCities.length;
                item.checkAll = checkedCount === item.cityList.length;
                item.isIndeterminate = checkedCount > 0 && checkedCount < item.cityList.length;
                _this.subData[_this.currentIndex].list[index] = [...item.checkedCities];
                _this.getSelectTotal()
                _this.isHave();
            },
            /*
            * 删除选中的内容
            * @parmas {String, Number} index 一层索引值 index2 二层索引值
             */
            deleteVal(index, index2,childItem) {
                let _this = this;
                let select = [];
                // const $index = childItem.status -1;
                const $index = 0;
                let current = _this.dataList[$index].list;
                let item = current[index];
                item.checkedCities.splice(index2, 1);
                item.checkAll = item.checkedCities.length === item.cityList.length;
                item.isIndeterminate = item.checkedCities.length > 0 && item.checkedCities.length < item.cityList.length;
                _this.subData[$index].list[index] = [...item.checkedCities];
                _this.getSelectTotal();
                _this.isHave();
            },
            /*
           * 是否具备提交的条件
            */
            isHave() {
                let _this = this;
                let have = true;
                for (let item of _this.subData) {
                    for (let itemChlid of item.list) {
                        if (itemChlid && itemChlid.length > 0) {
                            have = false;
                        }
                    }
                }
                _this.isDisabled = have;
            }
        }
    }
</script>

<style lang="scss">
    .choose-task{
        .el-collapse-item{
            border: 1px solid #EBEEF5;
            border-radius:3px;
            margin-bottom: 12px;
        }
        .el-collapse{
            border: none;
        }
        .el-collapse-item__header,.el-collapse-item__wrap{
            border: none;
        }
    }
    .check-all-hand .el-checkbox__input .el-checkbox__inner {
        background-color: #fff !important;
        border-color: #DCDFE6;
    }

    .el-form-item__content {
        line-height: 38px !important;
    }

    .el-collapse-item__header {
        padding-left: 30px;
    }

    .el-collapse-item__content {
        padding-left: 30px;
    }

    .el-checkbox + .el-checkbox {
        margin-left: 0 !important;
    }

    .xIcon {
        display: inline-block;
        width: 8px;
        height: 8px;
        background-image: url(../../../assets/images/xIcon.png);
        background-size: cover;
        cursor: pointer;
    }

    .new-p-item {
        padding: 30px;
        background-color: #fff;

        .el-checkbox {
            padding-bottom: 10px;
        }
    }

    .div_style {
        color: #383838;
        font-size: 14px;
        font-style: 'MicrosoftYaHei';
        /*border-bottom: 1px solid #EAEDF4;*/
        background: #ffffff;
        display: flex;
        flex-direction: column;
    }

    .span_style {
        position: relative;
        font-size: 12px;
        display: flex;
        justify-content: center;
        align-items: center;
        color:#3363FF;
        border-radius: 4px;
        padding:0 10px;
        height: 30px;
        background-color:rgb(233,240,245);
        /*border: 1px solid #1890FF;*/
        margin-right:15px;
        margin-top:10px;
        float: left;
        img{
            position: absolute;
            width: 16px;
            height: 16px;
            top: -2px;
            right: -5px;
        }
    }

    .radio-search .e-cg-active {
        color: #e84518;
        padding: 12px 0;
        border-bottom: 2px solid #e84518;
    }

    .radio-search .e-cg-active .el-radio__label {
        padding: 0 10px;
    }
</style>
