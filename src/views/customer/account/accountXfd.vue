<template>
    <div class="acc-xfd">
        <div class="bg-fff pt15 pb15 pl30 pr30">
            <span class="f14 co-333">开户状态: {{userInfo.status | forStatus}}</span>
            <el-button v-if="userInfo.status == '1'" @click="routeToDetail()" class="co-orange-new" type="text">取消审核</el-button>
        </div>
        <div class="bg-fff mt15 pt30 pb20 pl30 pr30">
            <el-steps :active="active" align-center style="width: 50%;margin: auto">
                <el-step title="资料上传" description=""></el-step>
                <el-step title="资料审核" description=""></el-step>
                <el-step title="开户成功" description=""></el-step>
            </el-steps>
        </div>
        <div class="pt20 mt15 bg-fff pl30 pr30">
            <div class="text-xfd pt15 pl20 pr20">线上提交资料即可便捷的进行薪福多开户，成功开户后即可使用薪福多付款。资料提交需要审核，审核通过开户需7天。
                上传加盖公章的原件照片或扫描件，支持jpg，jpeg，bmp，gif，png格式照片，大小不超过5M
            </div>
            <div class="mt20 pl30 pr30" style="height:50vh;overflow-y:auto">
                <ul class="up-list">
                    <li v-for="(item,index) in list" :key="index" @click="targetIndex(index)">
                        <div class="f12 co-333 pb10"><b class="co-">*</b>{{index + 1}}.{{item.title}}：<span
                                class="co-999">{{item.desc}}</span></div>
                        <el-upload
                                action="//upload.qiniu.com/" :before-upload="beforeAvatarUpload"
                                :limit="Number(item.limit)" :on-exceed="handleExceed"
                                :on-preview="handlePictureCardPreview"
                                :on-remove="handleRemove"
                                :on-success="handleAvatarScucess" :data="upload_form"
                                :file-list="item.urlList"
                                list-type="picture-card" :multiple="item.multiple">

                            <i slot="default" class="el-icon-plus"></i>
                            <div v-show="item.url">
                                <div slot="file" slot-scope="{file}">
                                    <img class="el-upload-list__item-thumbnail" :src="file.url" alt="">
                                    <!--<span class="el-upload-list__item-actions">-->
                                    <!--&lt;!&ndash;<span class="el-upload-list__item-preview" @click="handlePictureCardPreview(file)">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<i class="el-icon-zoom-in"></i>&ndash;&gt;-->
                                    <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                    <!--&lt;!&ndash;<span v-if="!disabled" class="el-upload-list__item-delete"&ndash;&gt;-->
                                    <!--&lt;!&ndash;@click="handleRemove(file)">&ndash;&gt;-->
                                    <!--&lt;!&ndash;<i class="el-icon-delete"></i>&ndash;&gt;-->
                                    <!--&lt;!&ndash;</span>&ndash;&gt;-->
                                    <!--</span>-->
                                </div>
                            </div>
                        </el-upload>
                        <el-dialog :visible.sync="item.dialogVisible">
                            <img width="100%" :src="dialogImageUrl" alt="">
                        </el-dialog>
                    </li>
                </ul>
            </div>
            <div class="pt15 pb20 pl30 tr" v-if="Number(userInfo.status) === 0 || !userInfo.status">
                <el-button type="primary" @click="save">申请提交</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogImageUrl: '',
                dialogVisible: false,
                disabled: false,
                currentIndex: 0,
                upload_form: {},
                userInfo:{},
                active:1,
                fileList: [],
                list: [
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
                        uid: [],
                        title: '开户许可证',
                        desc: '公司开户许可证彩色扫描件，三证合一则请上传营业执照正本彩色扫描件'
                    },
                    {
                        url: '',
                        dialogVisible: false,
                        srcList: [],
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
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
                        urlList: [],
                        uid: [],
                        limit: '2',
                        multiple: false,
                        title: '股东身份证件的复印件',
                        desc: '股权大于等于25%的股东 二代身份证人像面照片和身份证国徽面照片'
                    },
                ],
                request:false,
            }
        },
        filters: {
            forStatus(val) {
                //开户审核通过 0未开户1待审核2审核通过3审核未通过4开户成功5开户失败
                let stutus = '未开户';
                switch (Number(val)) {
                    case 0:
                        stutus =  '未开户'
                        break;
                    case 1:
                        stutus = '待审核'
                        break;
                    case 2:
                        stutus = '审核通过'
                        break;
                    case 3:
                        stutus = '审核未通过'
                        break;
                    case 4:
                        stutus = '开户成功'
                        break;
                    case 5:
                        stutus = '开户失败'
                        break;
                    default:
                        break
                }
                return stutus
            }
        },
        mounted() {
            this.getToken()
            let status = JSON.parse(localStorage.getItem('xfdStatus'));
            if(status > 0){
                this.active = 2;
                this.getApply()
            }
        },
        methods: {
            getApply() {
                this.$api.getXfdaccount({}).then(res => {
                    if (res.respCode === 0) {
                        this.userInfo = res.data
                        localStorage.xfdStatus = res.data.status
                        let result = [];
                        if(res.data.status == 1){
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
                            for (let item of this.list) {
                                item.srcList = item.url.split(',')
                                let _arr = [];
                                for(let src of item.srcList){
                                    _arr.push({url:src});
                                }
                                item.urlList = _arr;
                                result.push(item)
                            }
                        }else{
                            for (let item of this.list) {
                                item.urlList = []
                                item.srcList = []
                                result.push(item)
                            }
                        }
                        this.list = result;
                        console.log(this.list)
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            cancel(){
                this.$api.xfdAccountCancal({}).then(res=>{
                    if(res.data.respCode === 0){
                        this.$message.success('取消成功!');
                        this.getApply()
                    }
                })
            },
            routeToDetail(){
                let _this = this;
                _this.$confirm(`确认取消审核吗`, `提示`, {
                    confirmButtonText: '确认取消',
                    cancelButtonText: '暂不取消',
                }).then((action) => {
                    this.cancel();
                }).catch(() => {

                });
            },
            handleRemove(file) {
                console.log(file)
                let srcList = this.list[this.currentIndex].srcList;
                if(this.list[this.currentIndex].limit == '1' || this.list[this.currentIndex].srcList.length == 1){
                    this.list[this.currentIndex].srcList = [];
                    this.list[this.currentIndex].uid = [];
                    this.list[this.currentIndex].url = '';
                }else{
                    let uidIndex = this.list[this.currentIndex].uid.indexOf(file.uid);
                    this.list[this.currentIndex].uid.splice(uidIndex,1)
                    this.list[this.currentIndex].srcList.splice(uidIndex,1)
                    let str = this.list[this.currentIndex].srcList.join(',');
                    this.list[this.currentIndex].url = str;
                }
                console.log(this.list)
            },
            targetIndex(index) {
                this.currentIndex = index;
            },
            handlePictureCardPreview(file) {
                console.log(file)
                this.dialogImageUrl = file.url;
                this.list[this.currentIndex].dialogVisible = true;
            },
            handleExceed(files, fileList) {
                this.$message.warning(`请删除当前文件再重新上传！`);
            },
            handleAvatarScucess(response, file) {
                let _this = this;
                console.log(file);
                console.log(response);
                if(_this.request){return}
                _this.request = true
                const key = response.key;
                const img = `http://${this.bucketHost}/${key}`;
                this.list[this.currentIndex].srcList.push(img);
                this.list[this.currentIndex].uid.push(file.uid);
                if(this.list[this.currentIndex].limit == '1'){
                    this.list[this.currentIndex].url = img;
                }else{
                    let str = this.list[this.currentIndex].srcList.join(',');
                    this.list[this.currentIndex].url = str;
                }
                console.log(this.list)
                this.getToken()
            },
            beforeAvatarUpload(file) {
                const isJPG = file.type === 'image/jpeg';
                const isPNG = file.type === 'image/png';
                const isJPEG = file.type === 'image/jpeg';
                const isBMP = file.type === 'image/bmp';
                const isGIF = file.type === 'image/gif';
                const isLt5M = file.size / 1024 / 1024 < 5;
                if (!isJPG && !isPNG && !isJPEG && !isBMP && !isGIF) {
                    this.$message.error('上传图片只能是 JPG,PNG,JPEG,BMP,GIF格式!');
                }
                if (!isLt5M) {
                    this.$message.error('上传图片大小不能超过 5MB!');
                }
                return isLt5M && (isPNG || isJPG);
            },
            getToken() {
                this.$api.getToken().then((response) => {
                    const {
                        data: {
                            fileName, upToken,
                        },
                    } = response.data;
                    this.upload_form = {
                        key: fileName,
                        token: upToken,
                    };
                }).catch(err=>{

                }).finally(()=>{
                    this.request = false
                });
            },
            save(){
                let _this = this;
                for(let item of this.list){
                    if(!item.url){
                        return this.$message.warning(`请上传${item.title}!`)
                    }
                }
                if(this.request){
                    return
                }
                this.request = true
                let params = {
                    businessLicense:this.list[0].url, //营业执照正本",
                    businessLicenseCopy:this.list[1].url, //营业执照副本",
                    openPermit:this.list[2].url, //开户许可证",
                    creditCode:this.list[3].url, //机构信用代码",
                    legalIdCard:this.list[4].url, //法人身份证",
                    authorization:this.list[5].url, //授权书",
                    handlerIdCard:this.list[6].url, //经办人身份证",
                    financeIdCard:this.list[7].url, //财务联系人身份证",
                    financeOwnIdCard:this.list[8].url, //财务负责人身份证",
                    associationArticles:this.list[9].url, //公司章程",
                    shareholderIdCard:this.list[10].url, //股东身份证"
                };
                this.$api.accountApply(params).then(res=>{
                    if(res.data.respCode === 0){
                        this.getApply()
                        this.$message.success('提交成功，请等待审核结果');
                    }
                }).catch(err=>{

                }).finally(()=>{
                    setTimeout(()=>{
                        _this.request = false
                    },500)
                })
            }
        }
    }
</script>

<style lang="scss">
    .acc-xfd {
        .el-step__head.is-finish {
            color: #fff;

            .el-step__icon.is-text {
                background-color: #F16B47;
            }
        }

        .el-step__title.is-process {
            color: #D9D9D9;
        }

        .el-step__head.is-process {
            color: #D9D9D9;
            border-color: #D9D9D9;

            .el-step__icon {
                height: 26px;
                width: 26px;
                color: #D9D9D9;
                background-color: #F5F5F5;
            }
        }

        .el-step__title {
            font-size: 12px;
        }

        .text-xfd {
            box-sizing: border-box;
            margin: auto;
            width: 915px;
            height: 71px;
            background: rgba(245, 246, 247, 1);
            opacity: 1;
            color: #8C8C8C;
            font-size: 12px;
            line-height: 22px;
        }

        .el-upload-list--picture-card .el-upload-list__item {
            width: 166px;
            height: 96px;
            line-height: 96px;

            .el-upload-list__item-thumbnail {
                width: 166px;
                height: 96px;
                line-height: 96px
            }
        }

        .el-upload--picture-card {
            width: 166px;
            height: 96px;
            line-height: 96px;
        }

        .up-list > li {
            padding: 15px 0;
            border-top: 1px solid #F3F3F3;
        }
    }
</style>
