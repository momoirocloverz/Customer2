<template>
    <div class="home page-container">
        <el-container class="page-wrapper">
            <el-header class="page-header">
                <div>
                    <div class="logo"></div>
                    万才网经理人后台
                </div>
                <div style="margin-left:100px;">
                    <el-menu :default-active="activeIndexTop" class="el-menu-demo" mode="horizontal">
                        <el-menu-item :index="`${it.name}`" v-for="it,i in topNavList" :key="i">
                            <span class="top-point" v-show="it.alias == '接发单市场' && total>0">{{total}}</span>
                            <router-link :to="{name:handleSetRouterName(it)}">{{it.alias}}</router-link>
                        </el-menu-item>
                    </el-menu>
                </div>
                <user-info></user-info>
            </el-header>
            <el-container class="content-wrapper">
                <!--<el-aside class="main-nav">-->
                <!--<nav-aside></nav-aside>-->
                <!--</el-aside>-->
                <el-main class="main-content">
                    <el-container class="main-content-wrapper">
                        <el-aside class="asideTag" v-show="name != 'welcome'"  style="width: 208px;overflow: auto">
                            <!--                            <div class="u-currentTitle" >{{currentTitle? currentTitle : '总览'}}</div>-->
                            <el-menu :default-active="activeIndex" class="u-inner-nav" :collapse="false" unique-opened>
                                <template v-for="it,i in subNav">
                                    <el-submenu :index="it.name" class="u-sec-title" :key="i"
                                                v-if="it.hasOwnProperty('children')">
                                        <template slot="title">{{it.alias}}</template>
                                        <template
                                                v-for="z,j in it.children"
                                                v-if="!z.hidden"
                                        >
                                            <el-menu-item
                                                    :index="z.name"
                                                    :key="j"
                                                    v-if="!z.hasOwnProperty('children')"
                                            >
                                                <span class="left-point" v-show="z.isWork === 1 && getTaskMarketInfo.taskNumber>0">{{getTaskMarketInfo.taskNumber}}</span>
                                                <span class="left-point" v-show="z.isWork === 2 && getTaskMarketInfo.workNumber>0">{{getTaskMarketInfo.workNumber}}</span>
                                                <span class="left-point" v-show="z.isWork === 3 && getTaskMarketInfo.noSetNumber>0">{{getTaskMarketInfo.noSetNumber}}</span>
                                                <router-link :to="{name:z.name}">{{z.alias}}</router-link>
                                            </el-menu-item>
                                            <el-submenu
                                                    :index="z.name"
                                                    :key="j"
                                                    v-else="z.hasOwnProperty('children')"
                                            >
                                                <template slot="title">{{z.alias}}</template>
                                                <el-menu-item
                                                        v-for="q,k in z.children"
                                                        :index="q.name"
                                                        v-if="!q.hidden"
                                                        :key="k"
                                                >
                                                    <!--<router-link v-if="getHavePayOwn" :to="{name:q.name}">{{q.alias}}</router-link>-->
                                                    <router-link :to="{name:q.name}">{{q.alias}}</router-link>
                                                </el-menu-item>
                                            </el-submenu>
                                        </template>

                                    </el-submenu>
                                    <el-menu-item :index="it.name" :key="i" v-else class="noChildrenMenuItem">
                                        <router-link :to="{name:it.name}">{{it.alias}}</router-link>
                                    </el-menu-item>
                                </template>

                            </el-menu>
                        </el-aside>
                        <el-main class="main-content-detail">
                            <breadcrumb></breadcrumb>
                            <div class="specialPad">
                                <transition name="router-fade" mode="out-in">
                                    <router-view></router-view>
                                </transition>
                            </div>
                        </el-main>
                    </el-container>
                </el-main>
            </el-container>
        </el-container>
        <outstandingFees :show="outstandingShow" :cancel="outstandingCancel"
                         :confirm="outstandingConfirm"></outstandingFees>
    </div>
</template>

<script>
    // @ is an alias to /src
    import { mapState, mapGetters, mapActions, mapMutations } from 'vuex'
    import Breadcrumb from "@/components/Breadcrumb"
    import NavAside from "@/components/NavAside"
    import UserInfo from '@/components/UserInfo'
    import outstandingFees from '@/components/outstandingFees'

    export default {
        name: "home",
        components: {
            Breadcrumb,
            NavAside,
            UserInfo,
            outstandingFees
        },
        data() {
            return {
                activeIndexTop: '0',
                isCollapse: true,
                topNavList: [],
                activeIndex: '0',
                showInnerNav: true,
                username: "",
                realName: "",
                managerName: "",
                activeIndex2: "1",
                logintype: "",
                isSettingSocialSecurity: "",
                isWelcome: true, // 是否在欢迎页，欢迎页的侧边栏导航处理与其他部分不同
                currentTitleName: '',
                currentTitle: '',
                subNav: [],
                name:'',
                outstandingShow: false,
            };
        },
        computed:{
            //获取任务市场的待确认数字
            ...mapGetters(['getTaskMarketInfo','getHavePayOwn']),
            total(){
                return Number(this.getTaskMarketInfo.workNumber) + Number(this.getTaskMarketInfo.taskNumber)+ Number(this.getTaskMarketInfo.noSetNumber)
            }
        },
        created(){

        },
        mounted() {
            if(this.$route.query.login){
                this.getTaskMarket({type:0});
            }
            this.isSettingSocialSecurity = localStorage.getItem("isSettingSocialSecurity");
            this.logintype = localStorage.getItem("logintype");
            this.username = JSON.parse(localStorage.getItem("userInfo")).username;
            this.managerName = JSON.parse(localStorage.getItem("userInfo")).managerName;
            this.realName = JSON.parse(localStorage.getItem("userInfo")).realName;
            //   this.logintype = 2;
            this.getCurrentPath();
            this.hanldeSetTopNav();            
//            console.log(this.$route.matched)
//        this.checkOutStanding();
        },
        methods: {
            ...mapActions(['getTaskMarket']),
            handleSetActiveIndexTop(name) {
                this.activeIndexTop = name;
            },
            handleSetRouterName(it) {
                if (it.children.filter(z => !z.hidden)[0].hasOwnProperty('children')) {
//                    console.log('1')
//                    console.log(it)
//                    console.log(it.children.filter(z => !z.hidden)[0].children.filter(z => !z.hidden)[0].name)
                    return it.children.filter(z => !z.hidden)[0].children.filter(z => !z.hidden)[0].name;
                } else {
//                   console.log(2,it)
                    return it.children.filter(z => !z.hidden)[0].name;
                }

            },
            handleCheck(param) {
                /*let noaccessName = "noaccess" + this.currentTitleName;
                this.$api.menuAuth(`${param.path}`)
                  .then(res => {
                    if (res.respCode == 0) {
                    } else {
                      this.$router.push({ name: noaccessName })
                    }
                  })
                  .catch(err => {
                    alert(err)
                  })*/
            },
            getCurrentPath() {
                if (this.logintype == 2) {
                    let parentPath = this.$route.matched[0].path;
                    this.name = this.$route.matched[1].name;
                    this.activeIndex2 = parentPath;
                } else {
                    this.activeIndex2 = "/mAccount";
                }
            },
            handleSetShowNavHidden(status) {
                this.showInnerNav = status;
            },
            hanldeSetTopNav() {                
                let cusType = JSON.parse(localStorage.getItem('userInfo')).customerType;
                let filterLayer1 = this.$router.options.routes.filter(it => it.showTop);
                let outMasterIndex = filterLayer1.findIndex(ele=>{
                    return ele.name == 'outSourceMaster';
                })
                let accountIndex = filterLayer1.findIndex(ele=>{
                    return ele.name == 'account';
                })
                let outMasterSelf =  filterLayer1[outMasterIndex];
                let layer2 = outMasterSelf.children;
                let layer2TargetIndex = layer2.findIndex(ele=>{
                    return ele.name == 'promi';
                })
                if( cusType == 2 ){
                    layer2[layer2TargetIndex].hidden = false;
                }else if(cusType == 1){
                    layer2[layer2TargetIndex].hidden = true;
                }
                let accountItem = filterLayer1[accountIndex].children;
                if(this.getHavePayOwn == 1){
                    //及时雨隐藏一级导航外包栏
                    filterLayer1.splice(outMasterIndex,1)
                    console.log(filterLayer1);
                    //及时雨隐藏易宝，薪福多，薪企云服
                    for(let item of accountItem){
                        if(item.ifHavePayOwn == 1){//及时雨账户、薪企云服，幸福多，易宝账户需要隐藏
                            item.hidden = true;
                        }
                        if(item.ifHavePayOwn == 2){//及时雨账户显示出来
                            let rainName = JSON.parse(localStorage.getItem('userInfo')).customerShortName;
                            item.hidden = false;
                            item.alias = rainName;
                            item.meta.breadName = rainName;
                        }
                    }
                    filterLayer1[accountIndex-1].children = accountItem;
                }else{
                    for(let item of accountItem){
                        if(item.ifHavePayOwn == 1){
                            item.hidden = false;
                            if(Number(item.cusType) >= 1 && cusType != item.cusType){//如果不相同需要隐藏
                                item.hidden = true;
                            }
                        }
                        if(item.ifHavePayOwn == 2){
                            let rainName = JSON.parse(localStorage.getItem('userInfo')).customerShortName;
                            item.hidden = true;
                            item.alias = rainName;
                            item.meta.breadName = rainName;
                        }
                    }
                    filterLayer1[accountIndex].children = accountItem;
                }
//                console.log(accountItem)
                let copyMaster = filterLayer1;
                this.topNavList = copyMaster;
//                console.log(this.topNavList)
                this.getSubNav();
            },
            handleSetActiveIndex(name) {
                //console.log(name)
                this.activeIndex = name;

            },
            getSubNav() {
                let currentPath = this.$router.options.routes.find(item => {
                    return item.path === this.$route.matched[0].path;
                });
                if (currentPath) {
                    this.currentTitle = currentPath && currentPath.alias;
                    this.subNav = currentPath && currentPath.children.filter(item => {
                        return !(item.hidden === true)
                    });
                    this.currentTitleName = currentPath.name;
                    this.handleSetActiveIndex(this.$route.name);
                    this.handleSetActiveIndexTop(currentPath.name);
                   // console.log(this.currentTitle)
                   // console.log(this.currentTitleName)
                }
                if (this.$route.name == 'welcome') {
                    this.isWelcome = true
                } else {
                    this.isWelcome = false
                }
            },
            outstandingCancel() {
                this.outstandingShow = false;
                localStorage.setItem('outstandingAlertShow', false);
            },
            outstandingConfirm() {
                this.outstandingShow = false;
                this.$router.push({
                    path: '/account/accountList'
                })
            },
            checkOutStanding() {
                this.outstandingShow = false;
                this.$api.managementFee().then(res => {
                    let {data: layer1} = res;
                    let {respCode, data} = layer1;
                    if (respCode === 0) {
                        if (data) {
                            let short1 = JSON.parse(localStorage.getItem('outstanding'));
                            let short2 = JSON.parse(localStorage.getItem('outstandingAlertShow'));
                            let test = toString.call(short2);
                            if ((test === '[object Null]') || (test === '[object Undefined]')) {
                                localStorage.setItem('outstandingAlertShow', true);
                            } else {
                                this.outstandingShow = short1 && short2;
                            }
                            localStorage.setItem('outstanding', true);
                        }
                    }
                }).catch(err => {
                    console.log(err)
                })
            },
        },
        watch: {
            $route(to, from) {
                this.getCurrentPath();
                this.isSettingSocialSecurity = localStorage.getItem(
                    "isSettingSocialSecurity"
                );
                this.getSubNav();
//        this.checkOutStanding();
            },

        },
    };
</script>
<style lang="scss">
    * {
        padding: 0;
        margin: 0;
        box-sizing: border-box;
    }

    .home {
        .el-aside {
            padding-right: 10px;
            background-color: #27292E;
        }

        .el-menu {
            border-right: 0px solid rgba(0, 0, 0, 0) !important;
            background-color: transparent !important;
        }

        .el-menu-item {
            padding-right: 0;
            padding-left: 50px !important;
        }
    }

    .u-inner-nav {
        a {
            position: relative;
            text-decoration: none;
            display: inline-block;
            width: 100%;
            color: #757983;
            padding-left: 10px;
            &::before {
                content: '';
                position: absolute;
                width: 4px;
                height: 4px;
                background-color: #666;
                border-radius: 50%;
                left: 0px;
                top: 22px;
            }
        }

        .el-menu-item.is-active {
            background-color: #393C43;
            a {
                color: #fff;
                &::before {
                    background-color: #fff;
                }
            }            
            &:hover a{
                color: #27292e;
                &::before {
                    background-color: #27292e;
                }
            }
        }

        > li:last-child {
            /*            border-bottom: 1px solid #dedede;*/
        }

        > li.el-submenu:last-child:not(.is-opened) {
            /*            border-bottom: 0px solid #dedede;*/
        }
    }

    .page-header {
        a {
            text-decoration: none;
            display: inline-block;
            width: 100%;
        }

        .el-menu {
            background-color: #27292e !important;
        }

        .el-menu-item:hover {
            background-color: transparent !important;
        }

        .el-menu-item {
            padding: 0 !important;
            margin: 0 50px;
            font-size: 14px;
        }

        .el-menu--horizontal .el-menu-item:not(.is-disabled):hover {
            color: #fff !important;
        }

        .el-menu--horizontal > .el-menu-item.is-active {
            color: #fff;
            border-bottom: 3px solid #E9481C !important;
        }

        .horizontal > .el-menu-item:not(.is-disabled):focus {
            background-color: transparent !important;
        }

        .el-menu-item:focus {
            background-color: transparent !important;
        }

        .el-menu--horizontal > .el-menu-item {
            height: 56px;
            height: 56px;
        }
    }

    .el-main {
        padding: 0;
    }

    .main-nav {
        width: 50px !important;
        overflow: visible !important;
        z-index: 100;
    }

    .sub-nav {
        // width: 170px !important;
    }

    .dropClass {
        display: inline-block;
    }

    .router-fade-enter-active,
    .router-fade-leave-active {
        transition: opacity 0.3s;
    }

    .router-fade-enter,
    .router-fade-leave-active {
        opacity: 0;
    }

    .sub-nav {
        .current-title {
            padding: 26px 0 18px 32px;
            font-size: 14px;
            /*    font-weight: bold;*/
            line-height: 1;
            color: #333;
        }

        a {
            display: block;
            width: 100%;
            height: 100%;
            padding-left: 30px;
            text-align: left;
        }

        .router-link-exact-active {
            color: #333;
            background-color: #f2f2f5;
        }
    }

    .home {
        .sub-nav-itemCus {
            a {
                padding-left: 35px;
                font-weight: bold;
                color: #333 !important;
            }
        }

        .subIndex {
            a {
                padding-left: 45px;
            }
        }
    }

    .u-currentTitle {
        height: 48px;
        line-height: 48px;
        font-size: 14px;
        padding-left: 14px;
        color: #333;
        border-bottom: 1px solid #dedede;
    }

    .main-content {
        .el-submenu__title {
            color: #fff !important;
            border-left: 0px solid rgba(0, 0, 0, 0) !important;
            line-height: 40px;
            height: 40px;
            font-size: 12px;
            background-color: #27292E;
            padding-left: 30px !important;
        }
        .el-submenu__title {
            height: 60px;
            font-size: 14px;
            line-height: 60px;
        }
        .el-menu-item {
            color: #333 !important;
            line-height: 50px;
            height: 50px;
            font-size: 12px;
            padding-left: 0px;
        }
        .noChildrenMenuItem {
                &:hover a {
                    color: #27292e !important;
                }
            }
        .u-sec-title {  
            .el-menu-item.is-active {
                &:hover a {
                    &::before {
                        background-color: #27292e;
                    }
                }
            }
            .el-menu-item {
                &:hover a {
                    color: #27292e !important;
                }   
            }            
            .el-submenu__title {
                &:hover {
                    color: #27292e !important;                    
                }
            }
            &.is-opened {
                &:hover {
                    .el-submenu__title {
                        &:hover {
                            color: #27292e !important;
                        }
                    }
                }
            }
        }

        .u-sec-title > div.el-submenu__title {
            color:#757983 !important;
        }
        .u-sec-title.is-active .el-submenu__title {
            color:#fff !important;
        }
        .u-sec-title.is-opened .el-submenu__title {
            color:#fff !important;
        }

        .el-submenu.is-active:not(.u-sec-title) .el-submenu__title {
            background-color: #dedede !important;
            //border-left: 'not specified'!important;
        }


        .asideTag .el-submenu__icon-arrow {
            color: #fff;
        }


        // .el-menu {
        //   //border-bottom: 1px solid #dedede;
        //   padding: 0 10px;
        // }
    }
</style>
<style lang="scss" scoped>
    $theme-bg-color: #27292e;
    .page-container {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        width: 100vw;
        height: 100vh;
        min-height: 400px;
        text-align: left !important;
        margin-bottom: 0 !important;

        .page-wrapper {
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;

            .page-header {
                display: flex;
                position: relative;
                padding-left: 68px;
                background-color: #27292e;
                font-size: 14px;
                height: 56px !important;
                line-height: 56px;
                text-align: left;
                color: #fff;

                .logo {
                    position: absolute;
                    width: 22px;
                    height: 22px;
                    top: 18px;
                    left: 16px;
                    background-image: url(../assets/images/logo-white.png);
                    background-repeat: no-repeat;
                    background-position: center center;
                    background-size: cover;
                }
            }

            .content-wrapper {
                flex: 1;
                display: flex;

                .main-nav {
                    width: 50px;
                    height: 100%;
                    min-height: 600px;
                    background-color: $theme-bg-color;
                    overflow-y: scroll;
                }

                .specialPad {
                    padding: 0 30px;
                    height: 100%;
                }

                .main-content {
                    flex: 1;
                    height: 100%;
                    display: flex;

                    .main-content-wrapper {
                        height: 100%;
                        display: flex;
                    }

                    .sub-nav {
                        width: 170px;
                        height: 100%;
                        font-size: 12px;
                        line-height: 40px;
                        background-color: #dedee0;
                        color: #333;

                        a {
                            text-decoration: none;
                            color: #666;
                        }
                    }

                    .main-content-detail {
                        flex: 1;
                        height: 100%;
                        // padding: 0 30px;
                        overflow-y: scroll;
                        background-color: #f2f2f5;
                    }
                }
            }
        }
    }
</style>