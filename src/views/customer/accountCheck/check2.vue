<template>
    <div class="check2Con">    
        <div>
            <div v-if="flag">
                <div class="imgCon"><img :src="rightImg"></div>
                <div class="describe">
                    您的公司基本信息已提交审核，<br/>审核需要1~3个工作日，请耐心等待
                </div>
            </div>
            <div v-else>
                <div class="imgCon"><img :src="badImg"></div>
                <div class="describe">
                    您的公司基本信息审核未通过，<br/>请重新提交。
                </div>
            </div>
        </div>
        <div  v-if="!flag">
            <div class="detailReason">审核未通过原因：<span>{{storeData.failReason}}</span></div>
            <el-button class="setBtnWidth"  size="medium" type="primary" @click="reWrite">重新填写基本信息</el-button>
        </div>
    </div>
</template>
<script>
export default {
  name: 'check2',
  data() {
      return {
          rightImg:require('@/assets/images/ok.png'),
          badImg:require('@/assets/images/notgood.png'),
          flag:true,
          paramId:'',
          storeData:{},
      }
  },
  mounted() {       
      this.initSession();
  },
  methods: {
      initStorage(){
          if( localStorage.getItem('userInfo') ){
              this.paramId = JSON.parse(localStorage.getItem('userInfo')).customerId;
          }          
      },
      getReason(){
          this.initStorage();
          let params = {
              id: this.paramId,
          }
          this.$api.detailCustomer(params).then((res) => {
              let { respCode,data } = res;
              if( respCode === 0 ){
                  this.storeData = data;
              }
          }).catch((error) => {
            console.log(error);
          });          
      },
      initSession(){
          let auditStatus = sessionStorage.getItem("auditStatus");  
          console.log( 'aSessionuditStatus',auditStatus );
          if( auditStatus == '1' ){
              this.flag = true;
          }
          if( auditStatus == '2' ){
              this.flag = false;
              this.getReason();
          }
      },
      reWrite(){
          this.$store.commit('setAuditStage',1);
          sessionStorage.setItem('auditWithData',JSON.stringify(this.storeData));
      },
  },
}
</script>
<style lang="scss" scoped>
    .check2Con {
        width: 900px;  
        background-color: #fff;
        margin: 0 auto;
        padding: 60px;
        padding-top: 100px;
        padding-bottom: 150px;
        border-radius: 8px;
        margin-top: 50px;
        text-align: center;
        .imgCon {
            
        }
        .describe {
            color: #666;
            font-size: 18px;
            font-weight: bold;
            margin-bottom: 30px;
            line-height: 50px;
        }
        .detailReason {
            font-size: 14px;
            color: #F06D46;
        }
        img {
            width: 80px;
            height: 80px;
            margin-bottom: 50px;
        }
        .setBtnWidth {
            margin-top: 40px;
            width: 190px;
        }
    }    
</style>