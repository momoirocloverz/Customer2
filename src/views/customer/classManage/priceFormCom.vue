<template>
    <div class="popSpCon">
        <div class="topCon">
            <div class="formPopContainer">
            <el-form ref="priceForm" :model="priceForm" label-width="100px" label-position="left"
                     :rules="priceFormRules">
                <el-form-item label="生效日期:" prop="enableDate">
                    <el-date-picker type="date" value-format="yyyy-MM-dd"  placeholder="选择日期" v-model="priceForm.enableDate" style="width: 80%;" format="yyyy-MM-dd"
                                                :picker-options="pickerOptions0">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="计价方式:" prop="valuationType">
                    <el-select v-model="priceForm.valuationType" placeholder="请选择">
                        <el-option label="计时" :value="1"></el-option>
                        <el-option label="计量" :value="2"></el-option>
                        <el-option label="计时+计量" :value="3"></el-option>
                    </el-select>
                </el-form-item>
                <div v-if="priceForm.valuationType!==4">
                    <el-form-item label="计时单价:" prop="valuationPrice" v-if="priceForm.valuationType!==2">
                        <el-col :span="20">
                            <el-input v-model="priceForm.valuationPrice"
                                      @change="(val)=>{handleNumber(val,'valuationPrice','priceForm')}"></el-input>
                        </el-col>
                        <el-col :span="4">
                            元/小时
                        </el-col>
                    </el-form-item>

                    <div v-if="priceForm.valuationType!==1">
                        <el-form-item label="计量方式" prop="calculateType">
                            <el-radio-group v-model="priceForm.calculateType">
                                <el-radio :label="1">单一计量</el-radio>
                                <el-radio :label="2">组合计量</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="计量单位:" prop="calculateUnit" v-if="priceForm.calculateType===1">
                            <el-select v-model="priceForm.calculateUnit" placeholder="请选择" @change="fix1">
                                <el-option label="件" :value="1"></el-option>
                                <el-option label="袋" :value="2"></el-option>
                                <el-option label="车" :value="3"></el-option>
                                <el-option label="吨" :value="4"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="计量单价:" prop="calculatePrice" v-if="priceForm.calculateType===1">
                            <el-radio-group v-model="priceForm.calculatePrice" @change="calculatePriceChange(priceForm.calculatePrice)">
                                <el-radio :label="1">固定计价</el-radio>
                                <el-radio :label="2">阶梯计价</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="计量单价:" v-if="priceForm.calculateType===2">
                            <el-form-item prop="calculatePricePiece" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePricePiece" ></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/件
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="calculatePriceBag" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceBag" ></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/袋
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="calculatePriceCar" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceCar" ></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/车
                                </el-col>
                            </el-form-item>
                            <el-form-item prop="calculatePriceTon" style="margin-bottom:20px">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceTon"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/吨
                                </el-col>
                            </el-form-item>
                        </el-form-item>
                        <div v-if="priceForm.calculatePrice===1">
                            <el-form-item prop="calculatePriceReal"
                                          v-if="priceForm.calculatePrice===1&&priceForm.calculateType===1">
                                <el-col :span="20">
                                    <el-input v-model="priceForm.calculatePriceReal"
                                              @change="(val)=>{handleNumber(val,'calculatePriceReal','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/{{unitMap[priceForm.calculateUnit]}}
                                </el-col>
                            </el-form-item>
                        </div>
                        <div v-if="priceForm.calculatePrice===2&&priceForm.calculateType===1">
                            <el-form-item v-for="(item,index) in ladderList" :key="index">
                                <div>
                                    <i class="el-icon-delete" style="cursor:pointer"
                                       v-if="(index == ladderList.length - 1)&&( index != 0 )" @click="handleDeleteLadder(index)"></i>
                                    第{{ index + 1}}档:
                                </div>
                                <el-col :span="8">
                                    <el-form-item :prop="`ladder${index+1}num`">
                                        <el-input v-model="priceForm[`ladder${index+1}num`]"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="2">
                                    {{unitMap[priceForm.calculateUnit]}},
                                </el-col>
                                <el-col :span="8">
                                    <el-form-item :prop="`ladder${index+1}price`">
                                        <el-input v-model="priceForm[`ladder${index+1}price`]"
                                                  @change="(val)=>{handleNumber(val,`ladder${index+1}price`,'priceForm')}"></el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="4">
                                    元/{{unitMap[priceForm.calculateUnit]}}
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <el-button @click="handleAddLadder">添加阶梯</el-button>
                            </el-form-item>
                            <el-form-item prop="exceedLadder">
                                超过第{{ladderList.length }}档时,<br/>
                                <el-col :span="20">
                                    <el-input v-model="priceForm.exceedLadder"
                                              @change="(val)=>{handleNumber(val,'exceedLadder','priceForm')}"></el-input>
                                </el-col>
                                <el-col :span="4">
                                    元/{{unitMap[priceForm.calculateUnit]}}
                                </el-col>
                            </el-form-item>
                            <el-form-item>
                                <div v-for="(item,index) in ladderList" :key="index">
                                    <div v-if="index == 0">
                                        {{priceForm[`ladder${index+1}num`]?priceForm[`ladder${index+1}num`]:'X'}}{{unitMap[priceForm.calculateUnit]}}以下（含）,{{priceForm[`ladder${index+1}price`]||'Y'}}元/{{unitMap[priceForm.calculateUnit]}}
                                    </div>
                                    <div v-else>
                                        {{priceForm[`ladder${index}num`]?Number(priceForm[`ladder${index}num`])+1:'X'}}至{{priceForm[`ladder${index+1}num`]?Number(priceForm[`ladder${index+1}num`]):'X'}}{{unitMap[priceForm.calculateUnit]}}(含）,{{priceForm[`ladder${index+1}price`]||'Y'}}元/{{unitMap[priceForm.calculateUnit]}}
                                    </div>
                                    <div v-if="index == ladderList.length - 1">
                                        {{priceForm[`ladder${index+1}num`]?Number( priceForm[`ladder${index+1}num`]
                                        )+1:'X'}}
                                        {{unitMap[priceForm.calculateUnit]}}以上，{{priceForm.exceedLadder||'Y'}}元/{{unitMap[priceForm.calculateUnit]}}
                                    </div>
                                </div>
                            </el-form-item>
                        </div>
                    </div>
                </div>
                <el-form-item>
                    <div>我跟班务经理结算时的单价</div>
                </el-form-item>
            </el-form>
        </div>
        <div class="listCon">
            <div class="titleText">历史单价</div>
            <el-table :data="gridData" height="560">
                <el-table-column property="createdAt" label="创建时间" show-overflow-tooltip></el-table-column>
                <el-table-column property="enableDate" label="生效时间" show-overflow-tooltip></el-table-column>
                <el-table-column property="formatText" label="单价" show-overflow-tooltip></el-table-column>
                <el-table-column property="status" label="状态"  :formatter="statusFormatter"  show-overflow-tooltip></el-table-column>
            </el-table>
            <div class="setPagnation">
                <el-pagination @current-change="handleCurrentChange"
                                   :current-page="currentPage" :page-size="pageSize"
                                   layout="total , prev, pager, next, jumper" :total="total">
                </el-pagination>
            </div>
        </div>
        </div>
        <div class="bottomCon">
            <el-button size="medium" @click="cancelNow">取 消</el-button>
                <el-button size="medium" type="primary" @click="savePriceForm">确 认</el-button>
        </div>
    </div>
</template>
<script>
    const integerValid = /^\d+$/;
    const pointValid = /^[0-9]*([.][0-9]+)?$/;
    const limit8 = /^\d{1,8}$/;
    const limit10 = /^\d{1,10}$/;
    export default {
        name: 'priceFormCom',
        props: {
            priceStr:String,
            classTaskId:String,
            getData:Function,
            cancelAction:Function,
        },
        data() {
            let checkCount1 = (rule, value, callback) => {
                if ((this.lastStepCount != rule.field) && (this.lastStepCount)) {
                    this.$refs.priceForm.validateField(this.lastStepCount);
                    this.lastStepCount = rule.field;
                } else {
                    this.lastStepCount = rule.field;
                }
                if ((this.priceForm.calculateType == 2)  ) {
                    let arr = ['calculatePricePiece', 'calculatePriceBag', 'calculatePriceCar', 'calculatePriceTon'];
                    let testLength = arr.filter(ele => {
                        return this.priceForm[ele];
                    });
                    if (testLength.length >= 2) {
                        let numberFormat = Number(value);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if( value ){
                            if (value.length) {
                            if (value == 0) {
                                this.priceForm[rule.field] = '';
                            }else{
                                if (isNan) {
                                this.priceForm[rule.field] = '';
                            } else {
                                if (isInteger) {
                                    if (numberFormat <= 0) { 
                                        this.priceForm[rule.field] = '';
                                    } else {
                                        callback();
                                    }
                                } else {
                                    let floatLength = value.split('.')[1].length;
                                    if (floatLength >= 4) {
                                        let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                        this.priceForm[rule.field] = process;
                                    }
                                    callback();
                                }
                            }
                            }
                            } else {
                                callback();
                            }
                        }else{
                            callback();
                        }
                    } else {
                        callback(new Error("请至少填写两个计量单价"));
                    }
                } else {
                    callback();
                }
            };
            const checkPointValid = (rule, value, callback) => {
                if (!pointValid.test(Number(value))) {
                    callback(new Error("请输入正确的格式"));
                } else {
                    callback();
                }
            }        
            const checkNumer = (rule, value, callback) => {
                if (Number(value) <= 0) {
                    callback(new Error("请输入大于0的数字"));
                } else {
                    callback();
                }
            }          
            return {
                pickerOptions0: {
                    disabledDate(time) {
                        return time.getTime() <= (Date.now()  + 24*60*60*1000 - 8.64e7)
                    }
                },
                form:{
                    unitPrice:{},
                },
                total:0,
                currentPage:1,
                pageSize:10,
                gridData:[],
                changeLadderStatus: false,
                isSaved: false,
                thusWorkList: [],
                mapDia: false, 
                allConfirmList: [],
                unitMap: {
                    [1]: '件',
                    [2]: '袋',
                    [3]: '车',
                    [4]: '吨',
                },
                ladderList: [],
                showEditUnitPrice: false,
                showEditProfessionDemand: false,
                priceText: '',  
                priceForm: {
                    dayPrice: null,
                    calculateType: 1,
                    calculateUnit: 1,
                    calculatePrice: 1,
                    valuationType: 1,
                    exceedLadder: null,
                    ladder1num: null,
                    ladder1price: null,
                    valuationPrice: null,
                    calculatePricePiece: null,
                    calculatePriceBag: null,
                    calculatePriceCar: null,
                    calculatePriceTon: null,
                    calculatePriceReal: null,
                    enableDate:'',
                },
                priceFormRules: {
                    enableDate:[{
                        required: true, message: '生效日期不能为空', trigger: 'change'
                    }],
                    dayPrice: [{
                        required: true, message: '日固定不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'}],
                    valuationType: [{
                        required: true, message: '计价方式不能为空', trigger: 'blur'
                    }],
                    valuationPrice: [{
                        required: true, message: '计时单价不能为空', trigger: 'blur'
                    },
                        {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                    calculateType: [{
                        required: true, message: '计量方式不能为空', trigger: 'blur'
                    }],
                    calculateUnit: [{
                        required: true, message: '计量单位不能为空', trigger: 'blur'
                    }],
                    calculatePrice: [{
                        required: true, message: '计量单价不能为空', trigger: 'blur'
                    },
                        {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                    exceedLadder: [{
                        required: true, message: '超出单价不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                    calculatePricePiece: [ 
                        {validator: checkCount1, trigger: 'blur'},
                    ],
                    calculatePriceBag: [
                        {validator: checkCount1, trigger: 'blur'},
                    ],
                    calculatePriceCar: [ 
                        {validator: checkCount1, trigger: 'blur'},
                    ],
                    calculatePriceTon: [
                        {validator: checkCount1, trigger: 'blur'},
                    ],
                    calculatePriceReal: [{
                        required: true, message: '计量单价不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                    ladder1num: [{
                        required: true, message: '班务核算数量不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                    ladder1price: [{
                        required: true, message: '班务核算单价不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                },
                professionDemandForm: {
                    professionDemand: []
                },
            }
        },
        mounted() {
            this.setUnableTimeOption();
            this.analyseData();
            this.getPriceHistory();
        },
        methods: {
            setUnableTimeOption(){
                this.$api.getCurrentTime().then(res => {
                    if (res.respCode == 0) {
                        this.pickerOptions0 = {
                            disabledDate(time) {
                                return time.getTime() <= (Date.parse(res.data)  + 24*60*60*1000 - 8.64e7)
                            }
                        };
                    }
                })
            },
            calculatePriceChange(val){ 
                console.log(this.ladderList);
                if(!this.ladderList.length){
                    this.ladderList = [
                        { count: "",unit: "" }
                    ];
                }
            },
            cancelNow(){
                this.$emit('cancelAction');
            },
            statusFormatter(row, column, cellValue, index) {
              let status = ''
              switch (Number.parseInt(cellValue)) {
                case 1:
                  status = '生效中'
                  break
                case 2:
                  status = '待生效'
                  break
                case 3:
                  status = '已失效'
                  break
                case 4:
                  status = '已作废'
                  break;
              }
              return status
            },
            getPriceHistory(){
                let param = {
                      classTaskId:this.classTaskId,
                      pageNum:this.currentPage,
                      pageSize:this.pageSize,
                  };
                  this.$api.classTaskPriceLogList(param).then(res=>{
                      let { data,respCode } = res;
                      if( respCode === 0 ){
                          if( data&&data.list ){
                              data.list.forEach(ele=>{
                                  ele.formatText = this.GlobalPriceFilter.priceFilter(ele.price);
                              });
                              this.gridData = data.list;
                              this.total = data.total;
                          }else{
                              this.gridData = [];
                              this.total = 0;
                          }
                      }else{
                          this.total = 0;
                      }
                  }).catch(err=>{
                      console.log('err',err);
                  })
            },
            handleCurrentChange(val){
                this.currentPage = val;
                this.getPriceHistory();
            },
            analyseData(){
                if( this.priceStr ){
                    this.hanldeSetEditPrice( JSON.parse(this.priceStr) );   
                }
            },
            fix1(){
                this.updateForBug();
                this.$refs['priceForm'].validateField('calculateUnit');
            },
            updateForBug(){
                this.$forceUpdate();
            },
            handleDealPrice(val, key, form) {
                let $val = String(val).replace(/^(.*\..{4}).*$/, "$1");
                if (form) {
                    this[form][key] = Number($val);
                } else {
                    this[key] = Number($val);
                }
                return $val;
            },
            handleNumber(e, key, form) {
                this.handleDealPrice(e, key, form);
            },
            hanldeSetEditPrice(price) {
                let $unitPrice = {};
                const {
                    countChe,
                    countDai,
                    countDun,
                    countSettle,
                    countTime,
                    ladderObj,
                    countFixed
                } = price.price[0];
                this.handleEditUnitPrice( ladderObj );
                switch ( +price.valuationType ) {                    
                    case 1:
                        $unitPrice = {
                            dayPrice: null,
                            unit: price.unit ? +price.unit :1,
                            priceList: [],
                            exceedPrice: {
                                num: null,
                                price: null,
                            },
                            valuationType: 1,
                            calculateType: 1,
                            calculatePrice: 1,
                            valuationPrice: countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 1,
                            calculateUnit: price.unit ? +price.unit :1,
                            calculatePrice: 1,
                            valuationType: 1,
                            exceedLadder: null,
                            ladder1num: null,
                            ladder1price: null,
                            valuationPrice: price.price[0].countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        break;
                    case 2:
                        $unitPrice = {
                            dayPrice: null,
                            unit: price.unit ? +price.unit :1,
                            priceList: [],
                            exceedPrice: {
                                num: null,
                                price: null,
                            },
                            valuationType: 2,
                            calculateType: 1,
                            calculatePrice: 1,
                            valuationPrice: price.price[0].countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: countChe || countDai || countDun || countSettle,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 1,
                            calculateUnit: price.unit ? +price.unit :1,
                            calculatePrice: 1,
                            valuationType: 2,
                            exceedLadder: null,
                            ladder1num: null,
                            ladder1price: null,
                            valuationPrice: null,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: countChe || countDai || countDun || countSettle,
                            enableDate:'',
                        }
                        break;
                    case 3:
                        // valuationType===2&&calculateType===1&&calculatePrice===2
                        let $ladderObj1 = ladderObj.map(it => {
                            if (it.unit) {
                                return {
                                    num: it.count,
                                    price: it.unit
                                }
                            } else {
                                return null;
                            }
                        }).filter(it => !!it);
                        $unitPrice = {
                            dayPrice: null,
                            unit: price.unit ? +price.unit :1,
                            priceList: $ladderObj1,
                            exceedPrice: {
                                num: ladderObj[ladderObj.length - 2].count,
                                price: ladderObj[ladderObj.length - 1].overUnit,
                            },
                            valuationType: 2,
                            calculateType: 1,
                            calculatePrice: 2,
                            valuationPrice: null,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 1,
                            calculateUnit: price.unit ? +price.unit :1,
                            calculatePrice: 2,
                            valuationType: 2,
                            exceedLadder: ladderObj[ladderObj.length - 1].overUnit,
                            valuationPrice: null,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        $ladderObj1.map((it, i) => {


                            this.priceForm = {
                                ...this.priceForm,
                                [`ladder${i + 1}num`]: it.num,
                                [`ladder${i + 1}price`]: it.price
                            }


                            if (i !== 0) {
                                this.priceFormRules = {
                                    ...this.priceFormRules,
                                    [`ladder${i + 1}num`]: [{
                                        required: true, message: '班务核算数量不能为空', trigger: 'blur'
                                    }],
                                    [`ladder${i + 1}price`]: [{
                                        required: true, message: '班务核算单价不能为空', trigger: 'blur'
                                    }],
                                }
                            }

                        })


                        break;
                    case 4:

                        $unitPrice = {
                            dayPrice: null,
                            unit: 1,
                            priceList: [],
                            exceedPrice: {
                                num: null,
                                price: null,
                            },
                            valuationType: 2,
                            calculateType: 2,
                            calculatePrice: 1,
                            valuationPrice: null,
                            calculatePricePiece: countSettle,
                            calculatePriceBag: countDai,
                            calculatePriceCar: countChe,
                            calculatePriceTon: countDun,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 2,
                            calculateUnit: 1,
                            calculatePrice: 1,
                            valuationType: 2,
                            exceedLadder: null,
                            ladder1num: null,
                            ladder1price: null,
                            valuationPrice: null,
                            calculatePricePiece: countSettle,
                            calculatePriceBag: countDai,
                            calculatePriceCar: countChe,
                            calculatePriceTon: countDun,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        break;
                    case 5:
                        $unitPrice = {
                            dayPrice: null,
                            unit: price.unit ? +price.unit :1,
                            priceList: [],
                            exceedPrice: {
                                num: null,
                                price: null,
                            },
                            valuationType: 3,
                            calculateType: 1,
                            calculatePrice: 1,
                            valuationPrice: countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: countChe || countDai || countDun || countSettle,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 1,
                            calculateUnit: price.unit ? +price.unit :1,
                            calculatePrice: 1,
                            valuationType: 3,
                            exceedLadder: null,
                            ladder1num: null,
                            ladder1price: null,
                            valuationPrice: countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: countChe || countDai || countDun || countSettle,
                            enableDate:'',
                        }
                        break;
                    case 6:
                        //valuationType===3&&calculateType===1&&calculatePrice===2
                        let $ladderObj2 = ladderObj.map(it => {
                            if (it.unit) {
                                return {
                                    num: it.count,
                                    price: it.unit
                                }
                            } else {
                                return null;
                            }
                        }).filter(it => !!it);
                        $unitPrice = {
                            dayPrice: null,
                            unit: price.unit ? +price.unit :1,
                            priceList: $ladderObj2,
                            exceedPrice: {
                                num: ladderObj[ladderObj.length - 2].count,
                                price: ladderObj[ladderObj.length - 1].overUnit,
                            },
                            valuationType: 3,
                            calculateType: 1,
                            calculatePrice: 2,
                            valuationPrice: price.price[0].countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 1,
                            calculateUnit: price.unit ? +price.unit :1,
                            calculatePrice: 2,
                            valuationType: 3,
                            exceedLadder: ladderObj[ladderObj.length - 1].overUnit,
                            // ladder1num:null,
                            // ladder1price:null,
                            valuationPrice: price.price[0].countTime,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        $ladderObj2.map((it, i) => {

                            this.priceForm = {
                                ...this.priceForm,
                                [`ladder${i + 1}num`]: it.num,
                                [`ladder${i + 1}price`]: it.price
                            }


                            if (i !== 0) {
                                this.priceFormRules = {
                                    ...this.priceFormRules,
                                    [`ladder${i + 1}num`]: [{
                                        required: true, message: '班务核算数量不能为空', trigger: 'blur'
                                    },],
                                    [`ladder${i + 1}price`]: [{
                                        required: true, message: '班务核算单价不能为空', trigger: 'blur'
                                    }],
                                }
                            }

                        })
                        break;
                    case 7:
                        //valuationType===3&&calculateType===2
                        $unitPrice = {
                            dayPrice: null,
                            unit: 1,
                            priceList: [],
                            exceedPrice: {
                                num: null,
                                price: null,
                            },
                            valuationType: 3,
                            calculateType: 2,
                            calculatePrice: 1,
                            valuationPrice: price.price[0].countTime,
                            calculatePricePiece: countSettle,
                            calculatePriceBag: countDai,
                            calculatePriceCar: countChe,
                            calculatePriceTon: countDun,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        this.priceForm = {
                            dayPrice: null,
                            calculateType: 2,
                            calculateUnit: 1,
                            calculatePrice: 1,
                            valuationType: 3,
                            exceedLadder: null,
                            ladder1num: null,
                            ladder1price: null,
                            valuationPrice: price.price[0].countTime,
                            calculatePricePiece: countSettle,
                            calculatePriceBag: countDai,
                            calculatePriceCar: countChe,
                            calculatePriceTon: countDun,
                            calculatePriceReal: null,
                            enableDate:'',
                        }
                        break;
                    case 8:
                        $unitPrice = {
                            dayPrice: countFixed,
                            unit: price.unit ? +price.unit :1,
                            priceList: [],
                            exceedPrice: {
                                num: null,
                                price: null,
                            },
                            valuationType: 4,
                            calculateType: 1,
                            calculatePrice: 1,
                            valuationPrice: null,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null
                        }
                        this.priceForm = {
                            dayPrice: countFixed,
                            calculateType: 1,
                            calculateUnit: price.unit ? +price.unit :1,
                            calculatePrice: 1,
                            valuationType: 4,
                            exceedLadder: null,
                            ladder1num: null,
                            ladder1price: null,
                            valuationPrice: null,
                            calculatePricePiece: null,
                            calculatePriceBag: null,
                            calculatePriceCar: null,
                            calculatePriceTon: null,
                            calculatePriceReal: null
                        }
                    default:
                        break;

                }
                return $unitPrice;
            },           
            handleClearState() {
                this.mapDia = false;
                this.isSaved = false;     
                if (!this.edit) {
                    const {classListLen, taskName} = this.$store.state;
                    this.form.classifyName = taskName + '(' + (classListLen + 1) + ')';
                    let $userInfo = JSON.parse(localStorage.getItem('userInfo'));
                    this.form.fullName = $userInfo.customerName;
                }
                this.priceForm = {
                    calculateType: 1,
                    calculateUnit: 1,
                    calculatePrice: 1,
                    valuationType: 1,
                    exceedLadder: null,
                    ladder1num: null,
                    ladder1price: null,
                    calculatePricePiece: null,
                    calculatePriceBag: null,
                    calculatePriceCar: null,
                    calculatePriceTon: null,
                    calculatePriceReal: null
                };
                this.professionDemandForm = {
                    professionDemand: []
                };
                if (this.$refs['form']) {
                    this.$refs['form'].clearValidate();
                }
            },
            handleCancelAddClassForm() {
                this.handleClearState();
                this.cancelAddClassForm();
            },
            handleAddLadder() {
                const checkNumer = (rule, value, callback) => {
                    if (Number(value) <= 0) {
                        callback(new Error("请输入大于0的整数"));
                    } else {
                        callback();
                    }
                }
                const checkPointValid = (rule, value, callback) => {
                    if (!pointValid.test(Number(value))) {
                        callback(new Error("请输入正确的格式"));
                    } else {
                        callback();
                    }
                }
                const newLadder = {
                    count: '',
                    unit: ''
                };
                this.ladderList.push(newLadder);
                console.log('this.ladderList', this.ladderList);
                this.priceForm = {
                    ...this.priceForm,
                    [`ladder${this.ladderList.length}num`]: null,
                    [`ladder${this.ladderList.length}price`]: null
                };
                console.log('this.priceForm', this.priceForm);
                this.priceFormRules = {
                    ...this.priceFormRules,
                    [`ladder${this.ladderList.length}num`]: [{
                        required: true, message: '班务核算数量不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        , {validator: checkPointValid, trigger: 'blur'}
                    ],
                    [`ladder${this.ladderList.length}price`]: [{
                        required: true, message: '班务核算单价不能为空', trigger: 'blur'
                    }, {validator: checkNumer, trigger: 'blur'},
                        {validator: checkPointValid, trigger: 'blur'},
                    ],
                };
                this.changeLadderStatus = true;
            },
            handleDeleteLadder(index) {
                const {ladderList, priceForm, priceFormRules} = this;
                this.ladderList.splice(this.ladderList.length - 1, 1);
                delete priceForm[`ladder${index + 1}num`];
                delete priceForm[`ladder${index + 1}price`];
                delete priceFormRules[`ladder${index + 1}num`];
                delete priceFormRules[`ladder${index + 1}price`];
                this.priceForm = {
                    ...priceForm
                };
                this.priceFormRules = {
                    ...priceFormRules
                };
                this.changeLadderStatus = true;
            },
            handleEditUnitPrice(ladderShorter) {
                let ladderLastElement = ladderShorter[ladderShorter.length - 1];
                let lastLength = Object.keys(ladderLastElement);
                if (this.changeLadderStatus) {
                } else {
                    if (lastLength.length == 1) {
                        this.ladderList = ladderShorter.slice(0, ladderShorter.length - 1);
                    } else {
                    }
                }
                this.showEditUnitPrice = true;
            },
            savePriceForm() {
                this.$refs['priceForm'].validate((valid) => {
                    console.log('valid', valid);
                    console.log( this.ladderList );
                    let notLadderData = () => {
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
                            'valuationType',
                            'enableDate',
                        ];
                        collection.forEach(ele => {
                            this.form.unitPrice[ele] = this.priceForm[ele];
                        });
                        this.form.unitPrice.unit = this.priceForm.calculateUnit;
                    };
                    if (valid) {
                        let priceList = [];
                        notLadderData();
                        if (this.ladderList.length) {

                            let waiting = this.ladderList.map((ele, index) => {
                                return {
                                    num: this.priceForm[`ladder${index + 1}num`],
                                    price: this.priceForm[`ladder${index + 1}price`]
                                }
                            })
                            this.priceList = waiting;
                            let exceedPrice = {
                                num: this.priceList[this.priceList.length - 1].num,
                                price: this.priceForm.exceedLadder
                            }
                            //  console.log( 'exceedPrice',exceedPrice );
                            let calculatePriceList = [
                                this.priceForm.calculatePricePiece,
                                this.priceForm.calculatePriceBag,
                                this.priceForm.calculatePriceCar,
                                this.priceForm.calculatePriceTon,
                            ];
                            let generateListFlag = calculatePriceList.some(ele => {
                                ele > 0
                            });
                            if ((this.priceForm.calculateType === 2) && (!generateListFlag)) {
                                this.$message({
                                    message: '必须有计量单价大于0',
                                    type: 'warning'
                                });
                            } else {
                                this.priceList.forEach(ele => {
                                    ele.num = Number(ele.num);
                                    ele.price = String(ele.price);
                                });
                                this.priceList.forEach((ele, index) => {
                                    this.ladderList.forEach((subEle, subIndex) => {
                                        this.ladderList[index].count = ele.num;
                                        this.ladderList[index].unit = ele.price;
                                    })
                                })
                                const repeatFunction = () => {
                                    let tempObj = Object.assign({}, this.priceForm);
                                    let tempObj2 = Object.assign({}, this.form.unitPrice);
                                    let tempObj3 = Object.assign({}, this.form.unitPrice);
                                    for (let val in tempObj2) {
                                        tempObj3[val] = tempObj[val];
                                    }
                                    tempObj3.exceedPrice = {
                                        price: this.priceForm.exceedLadder,
                                        num: this.priceList[this.priceList.length - 1].num,
                                    };
                                    tempObj3.unit = this.priceForm.calculateUnit;
                                    tempObj3.priceList = this.priceList;
                                    this.form.unitPrice = Object.assign({}, tempObj3);
                                    console.log( 'this.form.unitPrice',this.form.unitPrice );
                                    this.$emit( 'getData',this.form.unitPrice );
                                    // this.$refs['form'].validateField('unitPrice'); 
                                };
                                if (this.priceList[0].num && this.priceList.length > 1) {
                                    let judge = this.priceList.every((it, i) => {
                                        if (i < this.priceList.length - 1) {
                                            return it.num - this.priceList[i + 1].num < 0
                                        } else {
                                            return true;
                                        }
                                    });
                                    if (judge) {
                                        repeatFunction();
                                    } else {
                                        if (this.priceForm.calculateType === 2) {
                                            repeatFunction();
                                        } else {
                                            if (this.priceForm.calculatePrice === 2) {
                                                this.$message({
                                                    message: '后面档位的数量必须大于前面所有档位的数量',
                                                    type: 'warning'
                                                });
                                            } else {
                                                repeatFunction();
                                            }
                                        }
                                    }
                                } else {
                                    repeatFunction();
                                }
                            }
                        } else {
                            this.$emit( 'getData',this.form.unitPrice );
                        }
                    } else {
                    }
                });
            }
        },
    }
</script>
<style lang="scss">
    .highlightText {
        color: #e84518;
    }    
    .priceTextLimit {
        width: 500px;
        box-sizing: border-box;
        padding: 20px;
    }
    .editBtn {
        cursor: pointer;
        color: #E94A1E;
        padding-top: 20px;
        padding-bottom: 20px;
    }
    .u-profession-demand {
        display: flex;
        .u-profession-demand-item {
            width: 60px;
            text-align: center;
        }
    }    
    .topCon {
        height: 450px;
        overflow-y: scroll;
    }
    .formPopContainer {        
    }
    .bottomCon {
        border-top: 1px solid #DCDFE6;
        padding-top: 20px;
    }
    .popSpCon {  
        height: 500px;
        .listCon {
            border-top: 1px solid #DCDFE6;
            padding-top: 10px;
        }
        .titleText {
            margin-bottom: 10px;
        }
        .setPagnation {
            text-align: center;
            padding-top: 10px;
            padding-bottom: 10px;
        }
        .el-table {
            .cell {
                text-align: center !important;
            }
        }
        .el-date-editor--daterange.el-input__inner {
            width: 400px;
        }
        .addRequireFixBug {
            .el-form-item__label {
                &::before {
                    content: '*';
                    color: #F56C6C;
                    margin-right: 4px;
                }
            }
        }
    }
</style>