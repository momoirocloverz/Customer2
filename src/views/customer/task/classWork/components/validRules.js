let rules = {
    data: function () {
        const integerValid = /^\d+$/;
        const zeroValid = /^\+?[1-9][0-9]*$/;
        const pointValid = /^[0-9]*([.][0-9]+)?$/;
        const limit8 = /^\d{1,8}$/;
        const limit10 = /^\d{1,10}$/;
        let checkdeposit = (rule, value, callback) => {
            if(this.form.deposit){
                if( !zeroValid.test(Number(this.form.deposit)) ){
                    callback(new Error("保证金必须为大于0的整数"));
                }else{
                    callback();
                }
            }else{
                callback(new Error("保证金不能为空"));
            }
        };
        const checkLimit8 = (rule, value, callback) => {
            if (!limit8.test(Number(value))) {
                callback(new Error("最多输入八位整数"));
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
        const checkLimit10 = (rule, value, callback) => {
            if (!limit10.test(Number(value))) {
                callback(new Error("最多输入十位整数"));
            } else {
                callback();
            }
        }
        const checkNumer = (rule, value, callback) => {
            if (Number(value) <= 0) {
                callback(new Error("请输入大于0的数字"));
            }else {
                callback();
            }
        }
        const checkProductionNum = (rule, value, callback) => {
            if (Number(value) <= 0) {
                callback(new Error("请输入大于0的数字"));
            } else {
                callback();
            }
            // if(Number(value) > this.params.authorizedNumber){
            //     callback(new Error("任务生产核定人数最高可填写" + this.params.authorizedNumber + '人'));
            // }
        }
        const checkCustomerNum = (rule, value, callback) => {
            if (Number(value) <= 0) {
                callback(new Error("请输入大于0的数字"));
            } else {
                callback();
            }
            // if(Number(value) > this.params.cusAuthorizedNumber){
            //     callback(new Error("客户核定人数最高可填写" + this.params.cusAuthorizedNumber + '人'));
            // }
        }
        const checkInteger = (rule, value, callback) => {
            if (String(value).indexOf('.') !== -1) {
                callback(new Error("请输入大于0的整数"));
            } else {
                callback();
            }
        }
        const checkNumerZero = (rule, value, callback) => {
            if (Number(value) < 0) {
                callback(new Error("请输入大于等于0的数字"));
            } else {
                callback();
            }
        }
        const checkAlreadySelectWork = (rule, value, callback) => {
            let isAll = true;
            this.form.workList.map(it => {
                for (let x in it) {
                    if (!it[x] || Number(it[x]) <= 0 || !pointValid.test(Number(it[x]))) {
                        isAll = false;
                    }
                }
            });
            if (!isAll) {
                callback(new Error("已选中的工种不能为空且必须大于0"));
            } else {
                callback();
            }
        }
        const checkProfessionDemand = (rule, value, callback) => {
            if (value.length === 0) {
                callback(new Error("工种要求不能为空"));
            } else {
                callback();
            }
        };
        const checkClassifyName = (rule, value, callback) => {
            if (value.length > 16) {
                callback(new Error("字数上限16"));
            } else {
                callback();
            }
        };
        const checkTaskName = (rule, value, callback) => {
            if (!value) {
                callback(new Error("任务名称不能为空"));
            } else {
                callback();
            }
        };
        const checkUnitPrice = (rule, value, callback) => {
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
            if (valuationType === 1) {
                if (!valuationPrice) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            if (valuationType === 2 && calculateType === 1 && calculatePrice === 1) {
                if (!calculatePriceReal) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            if (valuationType === 2 && calculateType === 2) {
                if (!calculatePricePiece && !calculatePriceBag && !calculatePriceCar && !calculatePriceTon) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            if (valuationType === 2 && calculateType === 1 && calculatePrice === 2) {
                if (priceList.length === 0) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            if (valuationType === 3 && calculateType === 1 && calculatePrice === 1) {
                if (!valuationPrice) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            if (valuationType === 3 && calculateType === 2 && calculatePrice === 1) {
                if (!valuationPrice) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            if (valuationType === 3 && calculateType === 2 && calculatePrice === 2) {
                if (!valuationPrice) {
                    callback(new Error("核算单价不能为空"));
                }
            }
            callback();
        };
        return {
            form: {
                settlementType: '',
                assignmentInfoId:'',
                longitude: '',
                latitude: '',
                taskName:'',
                taskId:'',
                workList: [],
                classifyName: '',
                classManager: '',
                startDateTime: '',
                startDateTime1: '',
                endDateTime: '',
                endDateTime1: '',
                customerNum: null,
                productionNum: null,
                unitPrice: {
                    dayPrice: null,
                    unit: 1,
                    priceList: [],
                    exceedPrice: {
                        num: null,
                        price: null,
                    },
                    valuationType: 1,
                    calculateType: 1,
                    calculatePrice: 1,
                    valuationPrice: null,
                    calculatePricePiece: null,
                    calculatePriceBag: null,
                    calculatePriceCar: null,
                    calculatePriceTon: null,
                    calculatePriceReal: null
                },
                officeHours: '',
                timeOutDate: 1,
                timeOut: '',
                cardType: 1,
                isFaceCard: 0,
                cardLimit: '2000',
                professionDemand: [],
                priceLimit: 2,
                needPriceCheck: 1,
                fullName: '',
                confirm: [],
                address: '',
                isGrab:'2',
                deposit:'',
            },
            thusWorkList: [],
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
                calculatePriceReal: null
            },
            professionDemandForm: {
                professionDemand: []
            },
            formRules: {
                alreadySelectWork: [
                    {validator: checkAlreadySelectWork, trigger: 'blur'}],
                classifyName: [{
                    required: true, message: '班务名称不能为空', trigger: 'blur'
                }, {validator: checkClassifyName, trigger: 'blur'}],
                startDateTime: [{
                    required: true, message: '开始日期不能为空', trigger: 'blur'
                }],
                startDateTime1: [{
                    required: true, message: '开始时间不能为空', trigger: 'blur'
                }],
                endDate: [{
                    required: true, message: '结束日期不能为空', trigger: 'blur'
                }],
                customerNum: [{
                    required: true, message: '客户核定人数不能为空', trigger: 'blur',
                },
                    {validator: checkCustomerNum, trigger: 'blur'},
                    {validator: checkInteger, trigger: 'blur'},
                    {validator: checkLimit10, trigger: 'blur'}

                ],
                productionNum: [{
                    required: true, message: '生产核定人数不能为空', trigger: 'blur'
                },
                    {validator: checkProductionNum, trigger: 'blur'},
                    {validator: checkInteger, trigger: 'blur'},
                    {validator: checkLimit10, trigger: 'blur'}
                ],
                unitPrice: [{
                    required: true, message: '核算单价不能为空', trigger: 'blur'
                }, {validator: checkUnitPrice, trigger: "blur"}],
                officeHours: [{
                    required: true, message: '上班时间不能为空', trigger: 'blur'
                }],
                timeOutDate: [{
                    required: true, message: '日期不能为空', trigger: 'blur'
                }],
                timeOut: [{
                    required: true, message: '下班时间不能为空', trigger: 'blur'
                }],
                address: [{
                    required: true, message: '打卡地点不能为空', trigger: 'blur'
                }],
                cardType: [{
                    required: true, message: '打卡方式不能为空', trigger: 'blur'
                }],
                isFaceCard: [{
                    required: true, message: '是否人脸打卡不能为空', trigger: 'blur'
                }],
                cardLimit: [{
                    required: true, message: '打卡范围不能为空', trigger: 'blur'
                },
                    {validator: checkNumer, trigger: 'blur'}
                    , {validator: checkInteger, trigger: 'blur'},
                    , {validator: checkLimit8, trigger: 'blur'},
                ],
                needPriceCheck: [{
                    required: true, message: '零工单价审核不能为空', trigger: 'blur'
                }],
                priceLimit: [{
                    required: true, message: '零工单价上限不能为空', trigger: 'blur'
                }],
                fullName: [{
                    required: true, message: '我方签署客户全称不能为空', trigger: 'blur'
                }],
                confirm: [{
                    required: true, message: '日常产量确认人不能为空', trigger: 'blur'
                }],
                professionDemand: [{
                    required: true, message: '工种要求不能为空', trigger: 'blur'
                },
                    {validator: checkProfessionDemand, trigger: "blur"}],
                depositProp:[
                    {
                        required: true, validator: checkdeposit, trigger: 'blur'
                    },
                    {validator: checkdeposit, trigger: 'change'}
                ],
                isGrab:[{
                    required: true, message: '发放方式不能为空', trigger: 'change'
                }],
                taskId:[{
                    required: true, message: '任务名称不能为空', trigger: 'blur'
                },{validator: checkTaskName, trigger: 'change'}]
            },
            priceFormRules: {
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
                calculatePricePiece: [{
                    required: true, message: '计量单价不能为空', trigger: 'blur'
                }, {validator: checkNumerZero, trigger: 'blur'},
                    {validator: checkPointValid, trigger: 'blur'},
                ],
                calculatePriceBag: [{
                    required: true, message: '计量单价不能为空', trigger: 'blur'
                }, {validator: checkNumerZero, trigger: 'blur'},
                    {validator: checkPointValid, trigger: 'blur'},
                ],
                calculatePriceCar: [{
                    required: true, message: '计量单价不能为空', trigger: 'blur'
                }, {validator: checkNumerZero, trigger: 'blur'},
                    {validator: checkPointValid, trigger: 'blur'},
                ],
                calculatePriceTon: [{
                    required: true, message: '计量单价不能为空', trigger: 'blur'
                }, {validator: checkNumerZero, trigger: 'blur'},
                    {validator: checkPointValid, trigger: 'blur'},
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
            professionDemandFormRules: {
                professionDemand: [{
                    required: true, message: '工种要求不能为空', trigger: 'blur'
                },
                    {validator: checkProfessionDemand, trigger: "blur"},
                ],
            }
        }
    },
    mounted() {
        this.handleGetTaskList();
        this.handleGetAllConfirm();
        this.handleGetByCodeAndLevelIndustry();
    },
    methods:{
        //获取未结束的任务
        async handleGetTaskList(){
            // let params = {
            //     belongTo:'',
            //     belongToType:'',
            //     settlementType:'',
            //     processStatus:1,
            //     pageNum:1,
            //     pageSize:0,
            //     taskName:''
            // };
            // let ls = [],lsTwo = [];
            // let res =await this.$api.getMyTaskList(params);
            // params['processStatus'] = 2;
            // let res2 =await this.$api.getMyTaskList(params);
            // if(res.data.respCode === 0){
            //     ls = res.data.data.list || []
            // }
            // if(res2.data.respCode === 0){
            //     lsTwo = res2.data.data.list || []
            // }
            // this.taskList = [...ls,...lsTwo];
            let res = await this.$api.myTaskListCanGrab({});
            if(res.respCode === 0){
                this.taskList = res.data || []
            }
            console.log(res)
        },
        //获取客户产量确认人
        handleGetAllConfirm() {
            this.$api.getAllConfirm().then(res => {
                this.allConfirmList = res.data || [];
            })
        },
        //获取工种
        handleGetByCodeAndLevelIndustry() {
            this.$api.getByCodeAndLevelIndustry().then(res => {
                this.typeWorkList = res.data;
                res.data.map(it => {
                    this.typeWorkMap = {
                        ...this.typeWorkMap,
                        [it.dicVal]: it.dicName
                    }
                });
            });
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
            } = price.price[0]
            switch (price.valuationType) {
                case 1:
                    $unitPrice = {
                        dayPrice: null,
                        unit: price.unit,
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
                        calculatePriceReal: null
                    }
                    this.priceForm = {
                        dayPrice: null,
                        calculateType: 1,
                        calculateUnit: price.unit,
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
                        calculatePriceReal: null
                    }
                    break;
                case 2:
                    $unitPrice = {
                        dayPrice: null,
                        unit: price.unit,
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
                        calculatePriceReal: countChe || countDai || countDun || countSettle
                    }
                    this.priceForm = {
                        dayPrice: null,
                        calculateType: 1,
                        calculateUnit: price.unit,
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
                        calculatePriceReal: countChe || countDai || countDun || countSettle
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
                        unit: price.unit,
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
                        calculatePriceReal: null
                    }
                    this.priceForm = {
                        dayPrice: null,
                        calculateType: 1,
                        calculateUnit: price.unit,
                        calculatePrice: 2,
                        valuationType: 2,
                        exceedLadder: ladderObj[ladderObj.length - 1].overUnit,
                        valuationPrice: null,
                        calculatePricePiece: null,
                        calculatePriceBag: null,
                        calculatePriceCar: null,
                        calculatePriceTon: null,
                        calculatePriceReal: null
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
                        calculatePriceReal: null
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
                        calculatePriceReal: null
                    }
                    break;
                case 5:
                    $unitPrice = {
                        dayPrice: null,
                        unit: price.unit,
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
                        calculatePriceReal: countChe || countDai || countDun || countSettle
                    }
                    this.priceForm = {
                        dayPrice: null,
                        calculateType: 1,
                        calculateUnit: price.unit,
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
                        calculatePriceReal: countChe || countDai || countDun || countSettle
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
                        unit: price.unit,
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
                        calculatePriceReal: null
                    }
                    this.priceForm = {
                        dayPrice: null,
                        calculateType: 1,
                        calculateUnit: price.unit,
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
                        calculatePriceReal: null
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
                        calculatePriceReal: null
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
                        calculatePriceReal: null
                    }
                    break;
                case 8:
                    $unitPrice = {
                        dayPrice: countFixed,
                        unit: price.unit,
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
                        calculateUnit: price.unit,
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
        handleSetEditData(editData) {
            const {
                managerId,
                classTaskName,
                startTime,
                endTime,
                cusAuthorizedNumber,
                authorizedNumber,
                price,
                workStartTime,
                endWorkType,
                workEndTime,
                punchWay,
                isRecognition,
                punchRange,
                longitude,
                latitude,
                workingPlace,
                classTaskConfirmVOList,
                classTaskPriceLimitVOList,
                signCustomerName,
                uppeLimit,
                needPriceCheck,
                settlementType,
                deposit,
                isGrab,
            } = editData;
            let $price = JSON.parse(price);
            this.thusWorkList = classTaskPriceLimitVOList.map(it => {
                let $price = JSON.parse(it.priceLimit).price[0];
                return {
                    type: it.industry + '',
                    hour: $price.countTime,
                    piece: $price.countSettle,
                    bag: $price.countDai,
                    car: $price.countChe,
                    ton: $price.countDun,
                    dayFixed: $price.countFixed
                }
            });
            //  this.form.address = `${poi.city}${poi.address}${poi.title}`;
            // this.form.latitude = poi.point.lat;
            // this.form.longitude = poi.point.lng;
            this.form = {
                isGrab,
                deposit,
                longitude,
                latitude,
                workList: classTaskPriceLimitVOList.map(it => {
                    let $price = JSON.parse(it.priceLimit).price[0];
                    return {
                        type: it.industry + '',
                        hour: $price.countTime,
                        piece: $price.countSettle,
                        bag: $price.countDai,
                        car: $price.countChe,
                        ton: $price.countDun,
                        dayFixed: $price.countFixed
                    }
                }),
                classifyName: classTaskName,
                classManager: managerId,
                startDateTime: startTime.split(' ')[0],
                startDateTime1: startTime.split(' ')[1],
                endDateTime: endTime ? endTime.split(' ')[0] : '',
                endDateTime1: endTime ? endTime.split(' ')[1].substring(0, endTime.split(' ')[1].length - 3) : '',
                // startDate:moment(startTime).format('YYYY-MM-DD HH:mm:ss'),
                // endDate:endTime?moment(endTime).format('YYYY-MM-DD HH:mm:ss'):'',
                customerNum: cusAuthorizedNumber,
                productionNum: authorizedNumber,
                unitPrice: {
                    ...this.hanldeSetEditPrice($price)
                },
                settlementType: settlementType ? String(settlementType) : '1',
                officeHours: workStartTime.substr(0, workStartTime.length - 3),
                timeOutDate: endWorkType,
                timeOut: workEndTime.substr(0, workEndTime.length - 3),
                cardType: punchWay,
                isFaceCard: isRecognition,
                cardLimit: punchRange,
                professionDemand: classTaskPriceLimitVOList.map(it => it.industry + ''),
                priceLimit: uppeLimit,
                needPriceCheck: needPriceCheck,
                fullName: signCustomerName,
                confirm: classTaskConfirmVOList.map(it => it.confirmId),
                address: workingPlace,
            }
            this.professionDemandForm = {
                professionDemand: classTaskPriceLimitVOList.map(it => it.industry + '')
            }

        },
    },
};

export default rules