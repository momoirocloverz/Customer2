<template>
    <div>
        <div class="overflow-box" style="width:646px;" >
            <div class="box-title"><span>开票</span></div>
            <div class="box-body1">
                <div class="box-body-item">
                    <div class="box-body-form">
                        <el-form ref="form" :model="form" label-width="150px" label-position="left" :rules="rules">
                            <div v-for="(item,index) in items">
                            <el-form-item :label="'发票号码'+Number(index+1)+'：'" class="delete-rela">
                                <img src="../../../../assets/images/delete_ladder.png" alt="删除" class="delete-mark" v-if="index!==0" @click="deleteItem(index)">
                                <el-input class="radius-input workerInp" placeholder=""  size="medium" v-model="item.num"   maxlength="128"></el-input>
                            </el-form-item>
                                <el-button size="small" class="btnborder  " round style="margin-left: 150px" v-if="index==items.length-1" @click="addItem">添加</el-button>

                                <div class="splitLine" v-if="index!=items.length-1"></div>
                            </div>

                        </el-form>
                    </div>
                </div>

            </div>
            <div class="box-footer">

                <el-button round size="medium" type="primary"  @click="handleExort">确 认</el-button>
                <el-button round size="medium"   @click="$router.go(-1)">取 消</el-button>

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'undrawed',
        data () {
            return {
                form:{
                    belongto:'',
                },
                items:[{num:''}],
            }
        },
        methods: {
            changePage(val){
                this.currentPagePlat = val
                this.getList()
            },
            getList(){
                const params = {
                pageNum: this.currentPagePlat,
                pageSize: 20,
                userName: this.form.userName,
                roleId: this.form.role,
                status: this.form.status
                };
                this.$api
            .UserList(params)
            .then(response => {
              if (response.data.respCode == 0) {
                this.tableDataPlat = response.data.data.list;
                this.total = response.data.data.total;
                this.pageCountPlat=response.data.data.pages
              }
            })
            .catch(error => {
              console.log(error);
            });
            },
            addItem(){
                this.items.push({num:''})
            },
            deleteItem(index){
                this.items.splice(index,1)
            }
        }
    }
</script>

<style scoped>
.recordNum1 {
    font-size: 16px;
    color: #666666;
    margin-bottom: 16px;
    margin-top: 16px;
}
.box-body-item-title{
        font-size: 18px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: 0px;
        color: #262626;
        line-height: 40px;
    }
    .box-body-item{
        margin:40px;
    }
    .box-body-form{
        margin:20px;
    }
    .line{
        height: 1px;
        background-color: #e5e5e5;
        width:100%;
    }
    .overflow-box{
        font-family: MicrosoftYaHei;
        background-color: #ffffff;
        box-shadow: 0px 2px 21px 0px
        rgba(156, 156, 156, 0.35);
        border-radius: 8px;
        margin:70px auto;
        padding-bottom: 36px;
    }
    .box-title{
        text-align: center;
        padding-top: 35px;
        width: 100%;
        font-family: PingFang-SC-Medium;
        font-size: 24px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 24px;
        letter-spacing: 1px;
        color: #262626;
    }
    .box-title span{
        padding-bottom: 10px;
        border-bottom: 3px solid #e84518;
        border-radius: 1px;
    }
    .box-footer{
        text-align: center;
        margin-bottom: 40px;
    }
    .box-body1{
        padding: 10px;
        /*height: 300px;*/
    }
    .note-label{
        font-family: PingFang-SC-Regular;
        font-size: 14px;
        font-weight: normal;
        font-stretch: normal;
        line-height: 24px;
        letter-spacing: 0px;
        color: #666666;
    }
    .delete-rela{
        position: relative;
    }
    .delete-mark{
        position: absolute;
        left: -80px;
        top: 12px;
    }
    .btnborder{
        border: solid 1px #e84518;
        color: #e84518;
        /*padding: 12px 22px;*/
    }
</style>