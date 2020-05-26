<template>
    <div class="shortCutPart1Con">      
        <div class="formContainer">
    <el-form ref="form" :model="form" label-width="140px" :rules="formRules">   
          <el-form-item label="任务名称:" v-if="!edit">
            {{taskName}}
          </el-form-item>
          <el-form-item label="班务名称:" prop="classifyName">
          <el-col :span="22">
            <el-input v-model="form.classifyName" v-if="!edit"></el-input>            
            <div>填写建议：客户简称+需要处理的任务+白晚班示例：中心局内部处理白班</div>
          </el-col>
          </el-form-item>
          <el-form-item label="开始时间：" required>
                  <div v-if="!edit">
                  <el-col :span="12">
                    <el-form-item prop="startDateTime">
                      <el-date-picker v-model="form.startDateTime"  type="date" @change="checkField('startDateTime')"  placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd"  :picker-options="pickerOptions0">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="startDateTime1">
                      <el-time-select v-model="form.startDateTime1"  placeholder="选择时间" value-format="HH:mm" format="HH:mm" @change="checkField('startDateTime1')" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                   </div>
                </el-form-item>
                <el-form-item label="结束时间：" required>
                  <el-col :span="12">
                    <el-form-item prop="endDateTime">
                      <el-date-picker v-model="form.endDateTime" type="date" @change="checkField('endDateTime')"  placeholder="选择日期" value-format="yyyy-MM-dd" format="yyyy-MM-dd" :picker-options="pickerOptions1">
                      </el-date-picker>
                    </el-form-item>
                  </el-col>
                  <el-col :span="12">
                    <el-form-item prop="endDateTime1">
                      <el-time-select v-model="form.endDateTime1" @change="checkField('endDateTime1')" placeholder="选择时间" value-format="HH:mm" format="HH:mm" :picker-options="{start: '00:00',step: '00:30',end: '23:30'}">
                      </el-time-select>
                    </el-form-item>
                  </el-col>
                </el-form-item>
            <el-form-item label="结算方式:" required>
                <el-radio-group v-model="form.settlementType">
                  <el-radio label="1">日结</el-radio>
                </el-radio-group>
          </el-form-item>
          <el-form-item label="核算单价:" prop="unitPrice">
            <div style="display:flex;width:560px;background-color:#F5F6F7">
                <div class="priceTextLimit" >
            <div v-if="form.unitPrice.valuationType===1">
              {{form.unitPrice.valuationPrice?`${form.unitPrice.valuationPrice}元/小时`:null}}
            </div>
            </div>
              <div v-if="!edit">
                  <div class="editBtn" v-if="!edit&&!isSaved" @click="handleEditUnitPrice">修改</div>
                  <div class="editBtn" v-else @click="handleEditUnitPrice">修改</div>
              </div>
              </div>
              <div>核算班务经理利润用</div>
          </el-form-item>
           <el-form-item label="上班时间:" prop="officeHours" v-if="!edit">
              <el-time-select
              v-model="form.officeHours"
              :picker-options="{
              start: '00:00',
                step: '00:30',
                end: '23:30'
              }"
                @change="checkField('officeHours')" 
              placeholder="选择时间">
            </el-time-select>
          </el-form-item>
          <el-form-item label="下班时间:" v-if="!edit" required>
          <el-col :span="11">
            <el-form-item prop="timeOutDate">
              <el-select v-model="form.timeOutDate" placeholder="请选择" @change="handleChangeTimeOutDate">
                <el-option label="当日" :value="1"></el-option>
                <el-option label="次日" :value="2"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="11">
            <el-form-item prop="timeOut">
              <el-time-select
                @change="checkField('timeOut')"               
                v-model="form.timeOut"
                :picker-options="endTimeOption"                
                placeholder="选择时间">
              </el-time-select>
            </el-form-item>
          </el-col>
          </el-form-item>
          <el-form-item label="打卡地点" style="position:relative" prop="address" class="el_form_item">
              <el-tooltip class="item" effect="dark" :content="form.address" placement="top-start">
                <el-input class="radius-input workerInp" placeholder="搜索地点，并进行选择" size="medium" v-model="form.address" @focus="viewMap" v-if="!mapDia">
                </el-input>
                <el-input class="radius-input workerInp" placeholder="" size="medium" v-model="mapConfig.keyword" v-if="mapDia" @focus="viewMap">
                </el-input>
              </el-tooltip>
              <div class="text0">上下班打卡所在地</div>
            <div v-if="mapDia" class="mapContain">
              <baidu-map class="map-container" :scroll-wheel-zoom="true" :center="mapConfig.center" :zoom="mapConfig.zoom">
                <bm-local-search :keyword="mapConfig.keyword" :auto-viewport="true" :location="mapConfig.location" @infohtmlset="infohtmlset">
                </bm-local-search>
              </baidu-map>
            </div>
          </el-form-item>
          <el-form-item label="工种要求:" prop="professionDemand">
          <div style="background-color:#F5F6F7;display:flex;width:560px">
              <div style="width:480px">
              <div class="u-profession-demand" style="width:100%" v-if="form.professionDemand.length>0">
                <div class="u-profession-demand-item" v-for="(it,i) in form.professionDemand" :key="i">
                      {{typeWorkMap[it]}}
                </div>
              </div>
              </div>
              <div >
              <div style="cursor:pointer;color:#E94A1E" @click="handleEditProfessionDemand" v-if="form.professionDemand.length>0">修改</div>
              <div style="cursor:pointer;color:#E94A1E" @click="handleEditProfessionDemand" v-else>添加</div>
              </div>
          </div>
          </el-form-item>
          <el-form-item>            
            <el-button class="btnNormal" :loading="saveLoading2" @click="goToNext">下一步</el-button>
              <!-- <el-button class="btnNormal"  @click="onSubmit" :loading="saveLoading">保 存</el-button> -->
          </el-form-item>
        </el-form>
 <el-dialog title="修改班务核算单价" :visible.sync="showEditUnitPrice" width="600px" center  :modal-append-to-body="false">
      <el-form ref="priceForm" :model="priceForm" label-width="100px" label-position="left" :rules="priceFormRules">
        <el-form-item label="计价方式:" prop="valuationType">
          <el-select v-model="priceForm.valuationType" placeholder="请选择">
            <el-option label="计时" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <div v-if="priceForm.valuationType!==4">
        <el-form-item label="计时单价:" prop="valuationPrice" v-if="priceForm.valuationType!==2">
          <el-col :span="20">
              <el-input v-model="priceForm.valuationPrice" @change="(val)=>{handleNumber(val,'valuationPrice','priceForm')}" ></el-input>
          </el-col>
          <el-col :span="4">
          元/小时
          </el-col>
        </el-form-item>
        </div>
          <el-form-item>
              <div>我跟班务经理结算时的单价</div>
            </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="medium" @click="showEditUnitPrice = false">取 消</el-button>
        <el-button size="medium" type="primary" @click="savePriceForm">确 认</el-button>
      </span>
    </el-dialog>



    <el-dialog title="修改班务工种要求" :visible.sync="showEditProfessionDemand" width="600px" center  :modal-append-to-body="false">
        <el-form ref="professionDemandForm" :model="professionDemandForm" label-width="100px" label-position="left" :rules="professionDemandFormRules">
           <el-form-item prop="professionDemand" label="工种要求:">
              <el-checkbox-group v-model="professionDemandForm.professionDemand" @change="handleTest">
                <el-checkbox :disabled="edit&&thusWorkList.some(z=>z.type===it.dicVal)" v-for = "(it,i) in typeWorkList" :key="i" :label="it.dicVal">{{it.dicName}}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button size="medium" @click="showEditProfessionDemand = false">取 消</el-button>
          <el-button size="medium" type="primary" @click="saveProfessionDemandForm">确 认</el-button>
        </span>
    </el-dialog>
        </div>
    </div>
</template>
<script>
    const integerValid = /^\d+$/;
    const pointValid = /^[0-9]*([.][0-9]+)?$/;
    const limit8 = /^\d{1,8}$/;
    const limit10 = /^\d{1,10}$/;
export default {
  name: 'shortCutPart1',
  data() {
      const checkLimit8 = (rule,value,callback)=>{
      if(!limit8.test(Number(value))){
        callback(new Error("最多输入八位整数"));
      }else {
        callback();
      }
    }
    const checkPointValid = (rule,value,callback)=>{
      if(!pointValid.test(Number(value))){
        callback(new Error("请输入正确的格式"));
      }else {
        callback();
      }
    }
    const checkLimit10 = (rule,value,callback)=>{
      if(!limit10.test(Number(value))){
        callback(new Error("最多输入十位整数"));
      }else {
        callback();
      }
    }
    const checkNumer = (rule,value,callback)=>{
      if(Number(value)<=0){
        callback(new Error("请输入大于0的数字"));
      }else {
        callback();
      }
    }
    const checkInteger = (rule,value,callback)=>{
      if(String(value).indexOf('.')!==-1){
        callback(new Error("请输入大于0的整数"));
      }else {
        callback();
      }
    }
    const checkNumerZero = (rule,value,callback)=>{
      if(Number(value)<0){
        callback(new Error("请输入大于等于0的数字"));
      }else {
        callback();
      }
    }
    const checkAlreadySelectWork = (rule,value,callback)=>{
      let isAll = true;
      this.form.workList.map(it=>{
        for(let x in it){
          if(!it[x]||Number(it[x])<=0||!pointValid.test(Number(it[x]))){
            isAll = false;
          }
        }
      });
      if(!isAll){
        callback(new Error("已选中的工种不能为空且必须大于0"));
      }else {
        callback();
      }
    }
    const checkProfessionDemand =(rule, value, callback) => {
      if (value.length===0) {
        callback(new Error("工种要求不能为空"));
      } else {
        callback();
      }
    };
    const checkClassifyName = (rule, value, callback) => {
      if (value.length>10) {
        callback(new Error("字数上限10"));
      } else {
        callback();
      }
    };
    const checkUnitPrice =(rule, value, callback) => {
      const {
        valuationType,
        calculateType,
        calculatePrice,
        valuationPrice,
        calculatePriceReal,
        calculatePricePiece,
        calculatePriceBag,
        calculatePriceCar,
        calculatePriceTon,
        priceList
      } = value;
      if(valuationType===1){
          if(!valuationPrice){
            callback(new Error("核算单价不能为空"));
          }
      }      
      callback();
    };
      return {
          endTimeOption:{
              start: '00:00',
              step: '00:30',
              end: '23:30',
          },
        assignmentInfoId:'',
        taskName:'',
        edit:false,
        saveLoading2:false,
        saveLoading:false,
          changeLadderStatus:false,
      managerListMap:{

      },
      pickerOptions0: {
//        disabledDate(time) {
//          return time.getTime() <= (Date.now() - 8.64e7)
//        }
      },
    pickerOptions1: {
//      disabledDate(time) {
//        return time.getTime() <= (Date.now()- 8.64e7)
//      }
    },
      isSaved:false,
      thusWorkList:[],
      mapDia: false,
       mapConfig: {
        location: '',
        keyword: '',
        center: { lng: 120.21937542, lat: 30.25924446 },
        zoom: 12,
      },
      typeWorkMap:{

      },
      typeWorkList:[],
      managerList:[],
      allConfirmList:[],
    unitMap:{
      [1]:'件',
      [2]:'袋',
      [3]:'车',
      [4]:'吨',
    },
     ladderList:[],
     showEditUnitPrice: false,
     showEditProfessionDemand:false,
        priceText:'',
     form :{
      settlementType:'',
      longitude:'',
      latitude:'',
      workList:[],
       classifyName:'',
       classManager:'',
       startDateTime:'',
       startDateTime1:'',
       endDateTime:'',
       endDateTime1:'',
       customerNum:null,
       productionNum:null,
       unitPrice:{
         dayPrice:null,
         unit:1,
         priceList:[],
         exceedPrice:{
           num:null,
           price:null,
         },
         valuationType:1,
         calculateType:1,
         calculatePrice:1,
         valuationPrice:null,
          calculatePricePiece:null,
          calculatePriceBag:null,
          calculatePriceCar:null,
          calculatePriceTon:null,
          calculatePriceReal:null
       },
       officeHours:'',
       timeOutDate:1,
       timeOut:'',
       cardType:1,
       isFaceCard:0,
       cardLimit:'2000',
       professionDemand:[],
       priceLimit:2,
       fullName:'',
       confirm:[],
       address:'',
     },
     formRules:{       
       alreadySelectWork:[
           { validator: checkAlreadySelectWork, trigger:'blur'  }],
       classifyName:[{
              required: true,message: '班务名称不能为空', trigger: 'blur'
          },{ validator: checkClassifyName, trigger:'blur'  }],
       classManager:[{
              required: true,message: '班务经理不能为空', trigger: 'blur'
          }],
        startDateTime:[{
              required: true,message: '开始日期不能为空', trigger: 'blur'
          }],
         startDateTime1:[{
              required: true,message: '开始时间不能为空', trigger: 'blur'
          }],
         endDateTime:[{
              required: true,message: '结束日期不能为空', trigger: 'blur'
          }],
         endDateTime1:[{
              required: true,message: '结束时间不能为空', trigger: 'blur'
          }],
        endDate:[{
              required: true,message: '结束日期不能为空', trigger: 'blur'
        }],
        customerNum:[
          {
            required: true,message: '客户核定人数不能为空', trigger: 'blur',
          },
          {validator:checkNumer,trigger:'blur'},
          {validator:checkInteger,trigger:'blur'},
          {validator:checkLimit10,trigger:'blur'}        
        ],
        productionNum:[{
            required: true,message: '生产核定人数不能为空', trigger: 'blur'
        },
        {validator:checkNumer,trigger:'blur'},
         {validator:checkInteger,trigger:'blur'},
          {validator:checkLimit10,trigger:'blur'}
        ],
        unitPrice:[{
            required: true,message: '核算单价不能为空', trigger: 'blur'
        }, { validator: checkUnitPrice, trigger: "blur" }],
        officeHours:[{
            required: true,message: '上班时间不能为空', trigger: 'blur'
        }],
        timeOutDate:[{
            required: true,message: '日期不能为空', trigger: 'blur'
        }],
        timeOut:[{
            required: true,message: '下班时间不能为空', trigger: 'blur'
        }],
        address:[{
            required: true,message: '打卡地点不能为空', trigger: 'blur'
        }],
        cardType:[{
            required: true,message: '打卡方式不能为空', trigger: 'blur'
        }],
        isFaceCard:[{
            required: true,message: '是否人脸打卡不能为空', trigger: 'blur'
        }],
        cardLimit:[{
            required: true,message: '打卡范围不能为空', trigger: 'blur'
        },
        {validator:checkNumer,trigger:'blur'}
        ,{validator:checkInteger,trigger:'blur'},
        ,{validator:checkLimit8,trigger:'blur'},
        ],
        priceLimit:[{
            required: true,message: '零工单价上限不能为空', trigger: 'blur'
        }],
        fullName:[{
            required: true,message: '我方签署客户全称不能为空', trigger: 'blur'
        }],
        confirm:[{
            required: true,message: '日常产量确认人不能为空', trigger: 'blur'
        }],
        professionDemand:[{
            required: true,message: '工种要求不能为空', trigger: 'blur'
        },
         { validator: checkProfessionDemand, trigger: "blur" }],

     },
     priceForm:{
       dayPrice:null,
       calculateType:1,
       calculateUnit:1,
       calculatePrice:1,
       valuationType:1,
       exceedLadder:null,
       ladder1num:null,
       ladder1price:null,
       valuationPrice:null,
       calculatePricePiece:null,
       calculatePriceBag:null,
       calculatePriceCar:null,
       calculatePriceTon:null,
       calculatePriceReal:null
     },
     priceFormRules:{
       valuationType:[{
         required: true,message: '计价方式不能为空', trigger: 'blur'
       }],
       valuationPrice:[{
        required: true,message: '计时单价不能为空', trigger: 'blur'
       },
       {validator:checkNumer,trigger:'blur'},
        {validator:checkPointValid,trigger:'blur'},
       ],
       calculateType:[{
         required: true,message: '计量方式不能为空', trigger: 'blur'
       }],
       calculateUnit:[{
         required: true,message: '计量单位不能为空', trigger: 'blur'
       }],
       calculatePrice:[{
         required: true,message: '计量单价不能为空', trigger: 'blur'
       },
       {validator:checkNumer,trigger:'blur'},
        {validator:checkPointValid,trigger:'blur'},
       ],   
     },
     professionDemandForm:{
       professionDemand:[]
     },
     professionDemandFormRules:{
       professionDemand:[{
              required: true,message: '工种要求不能为空', trigger: 'blur'
          },
          { validator: checkProfessionDemand, trigger: "blur" },
          ],
     }
      }
  },
  mounted() {
      this.handleGetAllConfirm();
      this.handleGetManagerList();
      this.handleGetByCodeAndLevelIndustry(); 
      this.handleInitForm();
      this.initEndOption();
  },
    watch: {    
        mapDia: function (val, old) {
            if (val == true) {
                  this.mapConfig.keyword = '';
                  this.form.address = '';
            }
        },
        "form.timeOutDate":function(nval,val){
            if( nval == 2 ){
                if( this.form.officeHours ){
//                    this.form.timeOut = '00:00';
                    this.setEndMaxTime(this.form.officeHours);
                }else{
                    this.endTimeOption.maxTime = null;
                }
            }else{
                this.endTimeOption.maxTime = null;
            }
        },
        "form.officeHours":function(nval,val){
            if( nval ){                
                if( this.form.timeOutDate == 2 ){
                    this.setEndMaxTime(nval);
//                    this.form.timeOut = '00:00';
                }else{
                    this.endTimeOption.maxTime = null;
                }
            }else{
                this.endTimeOption.maxTime = null;
            }
        },
    },
  methods: {  
      setEndMaxTime(nval){
          let finalPart1 = '00';
          let finalPart2 = '30'; 
          let strPart1 = nval.split(':')[0];
          let strPart2 = nval.split(':')[1];
          let numPart1 = Number(nval.split(':')[0]);
          let numPart2 = Number(nval.split(':')[1]);
          let secValueLength = String(numPart2).length; 
          let firValueLength = String(numPart1).length;                
          if( secValueLength == 1 ){
              if( firValueLength == 1 ){
                  finalPart1 = '0' + String(numPart1);
              }
              if( firValueLength == 2 ){
                  finalPart1 = String(numPart1);
              }                
          }
          if( secValueLength == 2 ){
              finalPart2 = '00';
              if( firValueLength == 1 ){
                  finalPart1 = '0' + (numPart1 + 1);
              }
              if( firValueLength == 2 ){
                  finalPart1 = String(numPart1 + 1);
              }                 
          }
          if( (finalPart1 == '24')&&(finalPart2 == '30') ){
              finalPart1 = '00';
          }
          this.endTimeOption.maxTime = `${finalPart1}:${finalPart2}`;
      },
      checkField(str){
          console.log(str);
          this.$refs['form'].validateField(str);
          if( str == 'officeHours' ){
              if( this.form.timeOutDate == 2 ){
                  this.form.timeOut = '00:00';
              }
          }
      },
      initEndOption(){
          this.endTimeOption = {
              start: '00:00',
              step: '00:30',
              end: '23:30',
              maxTime:this.form.officeHours,
          };
      },
      settlementChange(val){
          this.$forceUpdate();
      },
      storageParseAndSetData(val){
          console.log('val',val);          
          let userInfo = JSON.parse(localStorage.getItem('userInfo'));
          this.form.fullName = userInfo.customerName;          
          this.form.classManager = val.managerId;
          
          let trans = val.classTaskConfirmDTOList.map((ele)=>{
              return ele.confirmId;              
          })
          this.form.confirm = trans;          
          this.taskName = val.taskName;
          this.form.classifyName = val.classTaskName;
          
          this.assignmentInfoId = val.assignmentInfoId; 
          this.form.latitude = val.latitude;
          this.form.longitude = val.longitude;
          this.form.address = val.workingPlace;
          this.form.customerNum = val.cusAuthorizedNumber;
          this.form.productionNum = val.authorizedNumber;
          
          this.form.startDateTime = this.Moment(val.startTime).format('YYYY-MM-DD');
          this.form.startDateTime1 =  this.Moment(val.startTime).format('HH:mm');
          this.form.endDateTime = val.endTime ? this.Moment(val.endTime).format('YYYY-MM-DD') : '';
          this.form.endDateTime1 = val.endTime? this.Moment(val.endTime).format('HH:mm') : '';
          this.form.officeHours = val.workStartTime.substr(0, val.workStartTime.length - 3);
          this.form.timeOutDate= val.endWorkType;          
          this.form.timeOut=val.workEndTime.substr(0, val.workEndTime.length - 3);          
          this.form.unitPrice={
              ...this.hanldeSetEditPrice(JSON.parse(val.price))
          };  
          this.form.settlementType = '1';  
          this.form.workList = val.industryList.split(',').map(item=>{
              return {
                  type:item,
                  hour:'',
                  piece:'',
                  bag:'',
                  car:'',
                  ton:'',
                  dayFixed:''
              }
          });          
          this.form.professionDemand = val.industryList.split(',');
          this.professionDemandForm= {
              professionDemand:val.industryList.split(',')
          }; 
      },      
      freshParseAndSetData(){
          let shazam = this.$store.state;
          let superMan = shazam.thusTaskDetail;
          console.log( superMan );
          let userInfo = JSON.parse(localStorage.getItem('userInfo'));
          this.form.fullName = userInfo.customerName;
          
          this.taskName = shazam.taskName;
          this.form.classifyName = shazam.taskName+'('+(shazam.classListLen+1)+')';

          this.assignmentInfoId = superMan.assignmentInfoId; 
          this.form.latitude = superMan.latitude;
          this.form.longitude = superMan.longitude;
          this.form.address = superMan.workingPlace;
          this.form.customerNum = superMan.cusAuthorizedNumber;
          this.form.productionNum = superMan.authorizedNumber;
          
          this.form.startDateTime = this.Moment(superMan.startTime).format('YYYY-MM-DD');
          this.form.startDateTime1 =  this.Moment(superMan.startTime).format('HH:mm');
          this.form.endDateTime = superMan.endTime ? this.Moment(superMan.endTime).format('YYYY-MM-DD') : '';
          this.form.endDateTime1 = superMan.endTime? this.Moment(superMan.endTime).format('HH:mm') : '';
          this.form.officeHours = superMan.workStartTime.substr(0, superMan.workStartTime.length - 3);
          this.form.timeOutDate=superMan.endWorkType;
          this.form.timeOut=superMan.workEndTime.substr(0, superMan.workEndTime.length - 3);
          
          this.form.unitPrice={
              ...this.hanldeSetEditPrice(JSON.parse(superMan.price))
          };  
          this.form.settlementType = '1';         
          this.form.workList = superMan.industryList.split(',').map(item=>{
              return {
                  type:item,
                  hour:'',
                  piece:'',
                  bag:'',
                  car:'',
                  ton:'',
                  dayFixed:''
              }
          });          
          this.form.professionDemand = superMan.industryList.split(',');
          this.professionDemandForm= {
              professionDemand:superMan.industryList.split(',')
          };             
//          format("YYYY-MM-DD HH:mm:ss");    
      },      
    handleInitForm(){
        let sessionExists = sessionStorage.getItem('shortCutFirst');
        console.log( '处理storage', );
        if(sessionExists){
            this.storageParseAndSetData( JSON.parse(sessionExists) );
        }else{
            this.freshParseAndSetData();
        }
    },
    handleDealListPrice(row,i,key,val){
      this.form.workList[i][key] = String(val).replace(/^(.*\..{4}).*$/, "$1");
    },
    handleDealPrice(val,key,form){
      let $val = String(val).replace(/^(.*\..{4}).*$/, "$1");
      if(form){
        this[form][key] = Number($val);
      }else {
        this[key] = Number($val);
      }
      return $val;
    },    
    handleNumber(e,key,form){
      this.handleDealPrice(e,key,form);
    },
    handleTest(val){
    },
    hanldeSetEditPrice(price){
        console.log( 'price',price );
        let unitPriceObj = {};
        const {countChe, countDai, countDun, countSettle, countTime,  ladderObj, countFixed} = price.price[0];  
        let valuationTypeValidate = (price.valuationType == 1);
        
            unitPriceObj = {
                dayPrice:null,
                unit:price.unit,
                priceList:[],
                exceedPrice:{
                    num:null,
                    price:null,
                },
                valuationType:1,
                calculateType:1,
                calculatePrice:1,
                valuationPrice:valuationTypeValidate ? countTime : 10,
                calculatePricePiece:null,
                calculatePriceBag:null,
                calculatePriceCar:null,
                calculatePriceTon:null,
                calculatePriceReal:null
            };
            this.priceForm={
                dayPrice:null,
                calculateType:1,
                calculateUnit:price.unit,
                calculatePrice:1,
                valuationType:1,
                exceedLadder:null,
                ladder1num:null,
                ladder1price:null,
                valuationPrice: valuationTypeValidate ? price.price[0].countTime : 10,
                calculatePricePiece:null,
                calculatePriceBag:null,
                calculatePriceCar:null,
                calculatePriceTon:null,
                calculatePriceReal:null
            };       
        return unitPriceObj;
    },
    infohtmlset(poi) {
      this.form.address = `${poi.city}${poi.address}${poi.title}`;
      this.form.latitude = poi.point.lat;
      this.form.longitude = poi.point.lng;
      this.mapDia = false;
      this.$refs['form'].validateField('address');
    },
    viewMap() {
      this.mapDia = true
    },
    handleDealForm(val){
      const {
      longitude,
      latitude,
       workList,
      classifyName,
       classManager,
       dataRange,
       startDateTime,
       startDateTime1,
       endDateTime,
       endDateTime1,
       customerNum,
       productionNum,
       unitPrice:{
         priceList,
         exceedPrice,
         //计价方式
         valuationType,
         //计量方式
         calculateType,
         //计量单价
         calculatePrice,
         //计时单价
          valuationPrice,
          calculatePricePiece,
          calculatePriceBag,
          calculatePriceCar,
          calculatePriceTon,
          //固定计价
          calculatePriceReal,
          unit,
          dayPrice
       },
       officeHours,
       timeOutDate,
       timeOut,
       cardType,
       isFaceCard,
       cardLimit,
       professionDemand,
       priceLimit,
       fullName,
       confirm,
       address,
       settlementType
       } = val;
      let $price = {};
      if(valuationType===1){
        $price = {
          price:[{countTime:valuationPrice,ladderObj:[{count:"",unit:""}],countSettle:"",countChe:"",countDun:"",countDai:""}],
            unit:"",
            valuationType:1,
            settlementType:'1'
        }
      }

   const $params = {
      settlementType,
        longitude,
        latitude,
        assignmentInfoId:this.assignmentInfoId,
        classTaskName:classifyName,
        managerId:classManager,
        startTime:startDateTime+' '+startDateTime1+':00',
        endTime:endDateTime&&endDateTime1?endDateTime+' '+endDateTime1+':00':'',
        cusAuthorizedNumber:customerNum,
        authorizedNumber:productionNum,
        price:JSON.stringify($price),
        workStartTime:officeHours+':00',
        endWorkType:timeOutDate,
        workEndTime:timeOut+':00',
        workingPlace:address,
        punchWay:cardType,
        isRecognition:isFaceCard,
        punchRange:cardLimit,
        industryList:professionDemand.join(','),
        uppeLimit:priceLimit,
        signCustomerName:fullName,
        classTaskPriceLimitDTOList:workList.map(it=>{
          return {
            industry:it.type,
            priceLimit:priceLimit===2?
            JSON.stringify({price:[{countTime:"",countSettle:"",countDai:"",countChe:"",countDun:"",countFixed:""}]})
            :JSON.stringify({price:[{countTime:it.hour,countSettle:it.piece,countDai:it.bag,countChe:it.car,countDun:it.ton,countFixed:it.dayFixed}]})
          }
        }),
        classTaskConfirmDTOList:this.allConfirmList.filter(it=>confirm.some(z=>z===it.id)).map(it=>{
        return {
          confirmId:it.id,
          name:it.nameAlias,
          idCard:it.idCard
        }
      })
      }
      return $params;
    },
    handleChangeTimeOutDate(){
        if( this.form.timeOutDate == 2 ){
            this.form.timeOut = '00:00';
        }
        this.$refs['form'].validateField('timeOutDate');
    },
    handleChangeClassManager(){
      this.$refs['form'].validateField('classManager');
    },
    handleClearState(){
      this.mapDia = false;
      this.isSaved = false;
      this.form ={
      //  taskName:'',
      longitude:'',
      latitude:'',
      workList:[],
       classifyName:'',
       classManager:'',
       startDate:'',
       endDate:'',
       customerNum:null,
       productionNum:null,
       unitPrice:{
         unit:1,
         priceList:[],
         exceedPrice:{
           num:null,
           price:null,
         },
         valuationType:1,
         calculateType:1,
         calculatePrice:1,
         valuationPrice:null,
          calculatePricePiece:null,
          calculatePriceBag:null,
          calculatePriceCar:null,
          calculatePriceTon:null,
          calculatePriceReal:null
       },
       startDateTime:'',
       startDateTime1:'',
       endDateTime:'',
       endDateTime1:'',
       officeHours:'',
       timeOutDate:1,
       timeOut:'',
       cardType:1,
       isFaceCard:0,
       cardLimit:'2000',
       professionDemand:[],
       priceLimit:2,
       fullName:'',
       confirm:[],
       address:'',
      };
    if(!this.edit){
      const {classListLen,taskName} = this.$store.state;
      this.form.classifyName = taskName+'('+(classListLen+1)+')';
       let $userInfo = JSON.parse(localStorage.getItem('userInfo'));
      this.form.fullName = $userInfo.customerName;
    }
      this.priceForm={
       calculateType:1,
       calculateUnit:1,
       calculatePrice:1,
       valuationType:1,
       exceedLadder:null,
       ladder1num:null,
       ladder1price:null,
       calculatePricePiece:null,
       calculatePriceBag:null,
       calculatePriceCar:null,
       calculatePriceTon:null,
       calculatePriceReal:null
     };
     this.professionDemandForm={
       professionDemand:[]
     };
     if(this.$refs['form']){
        this.$refs['form'].clearValidate();
     }                    
    },
    handleGetByCodeAndLevelIndustry(){
      this.$api.getByCodeAndLevelIndustry().then(res=>{
        this.typeWorkList = res.data;
         res.data.map(it=>{
          this.typeWorkMap = {
            ...this.typeWorkMap,
            [it.dicVal]:it.dicName
          }
        });
      });
    },
    handleGetManagerList(){
      
      this.$api.managerMyBindingManagerList({status:1,pageSize:0}).then(res=>{
        this.managerList = res.data.list||[];
        this.managerList.map(it=>{
          this.managerListMap = {
            ...this.managerListMap,
            [it.managerId]:it.managerNameAlias
                      }
         
        });
      });
    },
    handleChangeConfirm(val){        
      this.$refs['form'].validateField('confirm');
    },
    handleGetAllConfirm(){
      this.$api.getAllConfirm().then(res=>{
        this.allConfirmList = res.data||[];
      })
    },    
    saveProfessionDemandForm(){
      this.$refs['professionDemandForm'].validate((valid) => {
          if (valid) {
            let $workList = this.professionDemandForm.professionDemand.map(it=>{
              if(this.form.workList.some(z=>z.type===it)){
                return null;
              }else {
                return {
                  type:it,
                  hour:'',
                  piece:'',
                  bag:'',
                  car:'',
                  ton:'',
                  dayFixed:''
                }
              }
            }).filter(it=>!!it);
            let $workList2 = this.form.workList.filter(it=>this.professionDemandForm.professionDemand.some(z=>z===it.type));
            this.form.professionDemand = this.professionDemandForm.professionDemand;
            this.form.workList = [...$workList2,...$workList];
            this.$refs['form'].validateField('professionDemand');
            this.showEditProfessionDemand = false;
          } else {
          }
        });
    },
    handleEditProfessionDemand(){
      this.showEditProfessionDemand = true;
    },
    handleEditUnitPrice(){
        let res = JSON.parse( this.$store.state.thusTaskDetail.price );
        let ladderShorter = res.price[0].ladderObj;
        let ladderLastElement = ladderShorter[ladderShorter.length - 1];
        let lastLength = Object.keys(ladderLastElement);       
        if(this.changeLadderStatus){
        }else{
            if( lastLength.length == 1 ){
              console.log( ladderShorter.slice(0,ladderShorter.length - 1) );
            }else{
            }
        }    
        this.showEditUnitPrice = true;
    },
    checkForm(){
      this.$refs['form'].validate((valid) => {
          if (valid) {
              let $params = this.handleDealForm(this.form);
              const {startTime,endTime,workStartTime,endWorkType,workEndTime} = $params;
              if(endTime&&this.Moment(startTime)-this.Moment(endTime)>=0){
                this.$message({
                  message: '开始时间不能大于等于结束时间',
                  type: 'warning'
                });
              }else if(endWorkType===1&&this.Moment('1992-8-21'+' '+workStartTime+':00')-(this.Moment('1992-8-21'+' '+workEndTime+':00'))>0){
                this.$message({
                  message: '当日上班时间不能大于下班时间',
                  type: 'warning'
                });
              }else {
                  $params.taskName = this.taskName;
                  console.log( $params ); 
                  sessionStorage.setItem( 'shortCutFirst',JSON.stringify($params) );            
                  this.handleSave($params);
              }          
          } else {
              this.$message.error('请检查表单。');
          }
        });
    },
    goToNext(){
      this.checkForm();     
    },
    handleSave(params,str){ 
        this.$store.commit('setShortCutIndex',2);
    },
    savePriceForm(){
      this.$refs['priceForm'].validate((valid) => {
        console.log( 'valid',valid );  
        let notLadderData = ()=>{
            let outObj = this.priceForm;
            let outObj2 = this.form.unitPrice;
            let collection = [
              'calculatePrice',
              'calculatePriceBag',
              'calculatePriceCar',
              'calculatePricePiece',
              'calculatePriceReal',
              'calculatePriceTon',
              'calculateType',
              'valuationPrice',
              'valuationType'
            ];
            collection.forEach(ele=>{
              this.form.unitPrice[ele] = this.priceForm[ele];
            });
            this.form.unitPrice.unit = this.priceForm.calculateUnit;
        };
          if (valid) {
            let priceList = []; 
            notLadderData();
                this.isSaved = true;
                this.showEditUnitPrice = false;
                this.$forceUpdate();

          } else {
          }           
        });
    }
  },
}
</script>
<style lang="scss" scoped>
    .shortCutPart1Con {
        background-color: #fff;    
        .formContainer {
            width: 750px;
            padding-top: 30px;
            padding-bottom: 30px;
            margin: 0 auto;
        }
        .priceTextLimit {
            width: 500px;
            box-sizing: border-box;
            padding: 20px;
        }   
        .editBtn {
            cursor:pointer;
            color:#E94A1E;
            padding-top: 20px;
            padding-bottom: 20px;
        } 
        .btnNormal {
            width: 90px;
            color: #e84518;
            border-color: #f8c7ba;
            background-color: #fdece8;
        }
    }
</style>
<style lang="scss">
    .shortCutPart1Con {
          .el-date-editor--daterange.el-input__inner {
            width: 400px;
          }
          .u-profession-demand {
            display: flex;
            .u-profession-demand-item {
              width: 60px;
              text-align:center;
            }
          }
    }
</style>