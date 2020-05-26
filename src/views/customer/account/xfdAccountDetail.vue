<template>
    <div style="background-color:#f2f2f5;" class="xfd-pay-detail pos-i">
        <el-form label-width="100px" labelPosition="left" style="background-color:white;padding-left:20px;padding-bottom: 15px">
            <div class="pt20 pb10 f14 co-333">
                <span class= "">薪福多付款服务费费率：{{userInfo.rate}}%</span>
                <span class="pl30">单笔最低：{{userInfo.minMoney}}元</span>
            </div>
        </el-form>
        <div class="table-box back-white pos-i">
            <el-table class="table-outline pos-i" :data="list"
                      emptyText="暂无相关信息" style="width: 100%;">
                <el-table-column class="pos-i" label="序号" prop="" align="center">
                    <template v-slot="scope">
                        <span>{{scope.$index+1}}</span>
                    </template>
                </el-table-column>
                <el-table-column class="pos-i" align="center" label="资料类型" prop="title"></el-table-column>
                <el-table-column class="pos-i" align="center" min-width="300" label="说明" prop="desc"></el-table-column>
                <el-table-column class="pos-i" align="center" label="操作(查看)" prop="">
                    <template v-slot="scope">
                        <div class="demo-image__preview pos-i">
                            <el-image
                                    class=""
                                    style="width:100px; height:50px;"
                                    :src="scope.row.srcList[0]"
                                    :preview-src-list="scope.row.srcList">
                            </el-image>
                            <span class="text-pos co-orange-new">查看</span>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
    export default {
        data() {
            return {
                list: [
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '1',
                        multiple: false,
                        title: '营业执照正本',
                        desc: '营业执照正本，彩色扫描件，必须清晰显示法人、成立时间、经营范围、经营时间等关键信息'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '1',
                        multiple: false,
                        title: '营业执照副本',
                        desc: '营业执照副本，彩色扫描件，必须清晰显示法人、成立时间、经营范围、经营时间等关键信息'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        limit: '1',
                        multiple: false,
                        srcList: [],
                        uid: [],
                        title: '开户许可证',
                        desc: '公司开户许可证彩色扫描件，三证合一则请上传营业执照正本彩色扫描件'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '1',
                        multiple: false,
                        title: '机构信用代码证',
                        desc: '公司机构信用代码证彩色扫描件，三证合一则请上传营业执照正本彩色扫描件'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '2',
                        multiple: false,
                        title: '法人身份证',
                        desc: '公司法人 二代身份证人像面照片和身份证国徽面照片'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '12',
                        multiple: false,
                        title: '授权书',
                        desc: '中信开户信息附件表彩色扫描件'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '2',
                        multiple: false,
                        title: '经办人身份证',
                        desc: '经办人 二代身份证人像面照片和身份证国徽面照片'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '2',
                        multiple: false,
                        title: '财务负责人身份证',
                        desc: '财务负责人 二代身份证人像面照片和身份证国徽面照片'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '2',
                        multiple: false,
                        title: '财务联系人身份证',
                        desc: '财务联系人 二代身份证人像面照片和身份证国徽面照片'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '12',
                        multiple: false,
                        title: '公司章程',
                        desc: '公司章程打印并加盖公章后的彩色扫描件，多页请加盖骑缝章'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        uid: [],
                        limit: '12',
                        multiple: false,
                        title: '股东身份证件的复印件',
                        desc: '股权大于等于25%的股东 二代身份证人像面照片和身份证国徽面照片'
                    },
                ],
                userInfo:{},
                url:'',
                srcList:[],
            }
        },
        watch: {
        },
        mounted() {
            this.getApply()
        },
        methods: {
            routeToDetail(row) {
                this.srcList = row.url.split(',');
                this.url = this.srcList[0];
                console.log(this.srcList)
            },
            load(val){
                console.log(val)
            },
            getApply(){
                this.$api.getXfdaccount({}).then(res=>{
                    if(res.respCode === 0){
                        this.userInfo = res.data
                        localStorage.xfdStatus = res.data.status
                        this.list[0].url = res.data.businessLicense //营业执照正本",
                        this.list[1].url = res.data.businessLicenseCopy//营业执照副本",
                        this.list[2].url = res.data.openPermit //开户许可证",
                        this.list[3].url = res.data.creditCode //机构信用代码",
                        this.list[4].url = res.data.legalIdCard//法人身份证",
                        this.list[5].url = res.data.authorization //授权书",
                        this.list[6].url = res.data.handlerIdCard//经办人身份证",
                        this.list[7].url = res.data.financeIdCard//财务联系人身份证",
                        this.list[8].url = res.data.financeOwnIdCard //财务负责人身份证",
                        this.list[9].url = res.data.associationArticles //公司章程",
                        this.list[10].url = res.data.shareholderIdCard  //股东身份证",
                        let result = [];
                        for(let item of this.list){
                            item.srcList = item.url.split(',')
                            result.push(item)
                        }
                        this.list = result;
                        console.log(this.list)
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
        },
    }
</script>
<style lang="scss">
    .xfd-pay-detail{
        .text-pos{
            position: relative;
            top: -20px;
            left: -50px;
            z-index: 0;
        }
        .el-table .cell{
            padding-left: 5px;
            .el-button{
                padding: 10px 15px;
            }
            .el-button + .el-button{
                margin-left:5px;
            }
        }
    }
</style>


