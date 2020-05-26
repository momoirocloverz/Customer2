<template>
    <div class="priceSetCon">
        <div>
            <div>
                <span>工种</span>
                <span class="red">{{info.industryName}}</span>
            </div>
        </div>
            <div class="formCon" v-show="firstPageShow">
                <el-form class="speFormStyle" ref="speForm" :rules="speRules"  label-position="left" :model="speForm" label-width="120px">
                    <div class="main1 main">
                        <div class="mainTitle">月结</div>
                        <div class="itemCon">
                            <el-form-item label="计价方式" class="addRequireFixBug">
                                <el-select v-model="speForm.valuationTypeMonth" @change="clearValidate" placeholder="请选择">
                                    <el-option v-for="(item,index) in measureList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="男工计时单价" key="maleMonthCountTimeProp" prop="maleMonthCountTimeProp" class="addRequireFixBug" v-if="(speForm.valuationTypeMonth == 1)||(speForm.valuationTypeMonth == 3)  ">
                                    <div class="flexItem">
                                    <el-input v-model="speForm.maleMonthCountTime" maxlength = "10"></el-input>
                                    <div class="setUnitWidth">元/小时</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="女工计时单价" key="femaleMonthCountTimeProp"  prop="femaleMonthCountTimeProp" class="addRequireFixBug" v-if="(speForm.valuationTypeMonth == 1)||(speForm.valuationTypeMonth == 3)  ">
                                    <div class="flexItem">
                                    <el-input v-model="speForm.femaleMonthCountTime" maxlength = "10"></el-input>
                                    <div class="setUnitWidth">元/小时</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="计量方式" class="addRequireFixBug" v-if="(speForm.valuationTypeMonth == 2) || (speForm.valuationTypeMonth == 3) ">
                                <el-radio-group v-model="speForm.unitModeMonth">
                                    <el-radio label="1">单一计量</el-radio>
                                    <el-radio label="2">组合计量</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-if="speForm.unitModeMonth == 1">
                                <el-form-item label="计量单位" class="addRequireFixBug" v-if="(speForm.valuationTypeMonth == 2) || (speForm.valuationTypeMonth == 3) ">
                                    <el-select v-model="speForm.measureUnitMonth" placeholder="请选择" >
                                        <el-option v-for="(item,index) in unitList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="addRequireFixBug" v-if="(speForm.valuationTypeMonth == 2) || (speForm.valuationTypeMonth == 3) ">
                                    <el-radio-group v-model="speForm.ladderModeMonth">
                                        <el-radio label="1">固定计价</el-radio>
                                        <el-radio label="2">阶梯计价</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <div class="manGo" @click="popEdit( 2,'male' )" v-if="( (speForm.ladderModeMonth == 2)&&( (speForm.valuationTypeMonth == 2) || (speForm.valuationTypeMonth == 3) ) )">设置男工单价<i class="el-icon-arrow-right"></i></div>
                                <div class="womanGo" @click="popEdit(2,'female')" v-if="( (speForm.ladderModeMonth == 2)&&( (speForm.valuationTypeMonth == 2) || (speForm.valuationTypeMonth == 3) ) )">设置女工单价<i class="el-icon-arrow-right"></i></div>                                
                            </div>
                            <div v-if="( (speForm.unitModeMonth == 2)&&( (speForm.valuationTypeMonth == 2) || (speForm.valuationTypeMonth == 3) ) )">
                                    <div>
                                        <div>男工单价</div>
                                        <el-form-item prop="countSettleMaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model="speForm.countSettleMaleMonth" 
                                                      maxlength="10" ></el-input>
                                                <div class="setUnitWidth">元/件</div>
                                            </div>                                            
                                        </el-form-item>
                                        <el-form-item prop="countDaiMaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDaiMaleMonth" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/袋</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countCheMaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countCheMaleMonth" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/车</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countDunMaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDunMaleMonth" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/吨</div>
                                            </div> 
                                        </el-form-item>
                                    </div>  
                                    <div>
                                        <div>女工单价</div>
                                        <el-form-item prop="countSettleFemaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countSettleFemaleMonth" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/件</div>
                                            </div>                                            
                                        </el-form-item>
                                        <el-form-item prop="countDaiFemaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDaiFemaleMonth" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/袋</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countCheFemaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countCheFemaleMonth" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/车</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countDunFemaleMonth">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDunFemaleMonth"
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/吨</div>
                                            </div> 
                                        </el-form-item>
                                    </div>
                                </div>
                            <el-form-item label="男工单价" prop="onlyOneMaleMonthProp"  v-if="( (speForm.valuationTypeMonth == 8) || (speForm.unitModeMonth == 1)&&(speForm.ladderModeMonth == 1)&&(speForm.valuationTypeMonth != 1)  )"  class="addRequireFixBug">
                                    <div class="flexItem">
                                        <el-input v-model.trim="speForm.onlyOneMaleMonth" maxlength = "10"></el-input>
                                        <div class="setUnitWidth">
                                            元/{{ speForm.valuationTypeMonth == 8 ? '天' : matchChinese[speForm.measureUnitMonth] }}
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="女工单价" prop="onlyOneFemaleMonthProp" v-if="( (speForm.valuationTypeMonth == 8) || (speForm.unitModeMonth == 1)&&(speForm.ladderModeMonth == 1)&&(speForm.valuationTypeMonth != 1)   )" class="addRequireFixBug">
                                    <div class="flexItem">
                                        <el-input v-model.trim="speForm.onlyOneFemaleMonth" maxlength = "10"></el-input>
                                        <div class="setUnitWidth">
                                            元/{{ speForm.valuationTypeMonth == 8 ? '天' : matchChinese[speForm.measureUnitMonth] }}
                                        </div>
                                    </div>
                                </el-form-item>
                            
                            
                            
                            
                        </div>
                    </div>
                    <div class="main2 main">
                        <div class="mainTitle">周结</div>
                        <div class="itemCon">
                            <el-form-item label="计价方式" class="addRequireFixBug">
                                <el-select v-model="speForm.valuationTypeWeek" placeholder="请选择">
                                    <el-option v-for="(item,index) in measureList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="男工计时单价" key="maleWeekCountTimeCheck"  class="addRequireFixBug" v-if="(speForm.valuationTypeWeek == 1)||(speForm.valuationTypeWeek == 3)  " prop="maleWeekCountTimeCheck" >
                                    <div class="flexItem">
                                    <el-input v-model="speForm.maleWeekCountTime"></el-input>
                                    <div class="setUnitWidth">元/小时</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="女工计时单价" prop="femaleWeekCountTimeProp" key="femaleWeekCountTimeProp" class="addRequireFixBug" v-if="(speForm.valuationTypeWeek == 1)||(speForm.valuationTypeWeek == 3)  ">
                                    <div class="flexItem">
                                    <el-input v-model="speForm.femaleWeekCountTime"></el-input>
                                    <div class="setUnitWidth">元/小时</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="计量方式" class="addRequireFixBug" v-if="(speForm.valuationTypeWeek == 2) || (speForm.valuationTypeWeek == 3) ">
                                <el-radio-group v-model="speForm.unitModeWeek">
                                    <el-radio label="1">单一计量</el-radio>
                                    <el-radio label="2">组合计量</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-if="speForm.unitModeWeek == 1">
                                <el-form-item label="计量单位" class="addRequireFixBug" v-if="(speForm.valuationTypeWeek == 2) || (speForm.valuationTypeWeek == 3) ">
                                    <el-select v-model="speForm.measureUnitWeek" placeholder="请选择" >
                                        <el-option v-for="(item,index) in unitList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="addRequireFixBug" v-if="(speForm.valuationTypeWeek == 2) || (speForm.valuationTypeWeek == 3) ">
                                    <el-radio-group v-model="speForm.ladderModeWeek">
                                        <el-radio label="1">固定计价</el-radio>
                                        <el-radio label="2">阶梯计价</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <div class="manGo" @click="popEdit(4,'male')" v-if="( (speForm.ladderModeWeek == 2)&&( (speForm.valuationTypeWeek == 2) || (speForm.valuationTypeWeek == 3) ) )">设置男工单价<i class="el-icon-arrow-right"></i></div>
                                <div class="womanGo" @click="popEdit(4,'female')" v-if="( (speForm.ladderModeWeek == 2)&&( (speForm.valuationTypeWeek == 2) || (speForm.valuationTypeWeek == 3) ) )">设置女工单价<i class="el-icon-arrow-right"></i></div>                                
                            </div>
                            <div v-if="( (speForm.unitModeWeek == 2)&&( (speForm.valuationTypeWeek == 2) || (speForm.valuationTypeWeek == 3) ) )">
                                    <div>
                                        <div>男工单价</div>
                                        <el-form-item prop="countSettleMaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countSettleMaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/件</div>
                                            </div>                                            
                                        </el-form-item>
                                        <el-form-item prop="countDaiMaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDaiMaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/袋</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countCheMaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countCheMaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/车</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countDunMaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDunMaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/吨</div>
                                            </div> 
                                        </el-form-item>
                                    </div>  
                                    <div>
                                        <div>女工单价</div>
                                        <el-form-item prop="countSettleFemaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countSettleFemaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/件</div>
                                            </div>                                            
                                        </el-form-item>
                                        <el-form-item prop="countDaiFemaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDaiFemaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/袋</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countCheFemaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countCheFemaleWeek" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/车</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countDunFemaleWeek">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDunFemaleWeek"
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/吨</div>
                                            </div> 
                                        </el-form-item>
                                    </div>
                                </div>
                            <el-form-item label="男工单价" key="onlyOneMaleWeekProp" prop="onlyOneMaleWeekProp"  v-if="( (speForm.valuationTypeWeek == 8) || (speForm.unitModeWeek == 1)&&(speForm.ladderModeWeek == 1)&&(speForm.valuationTypeWeek != 1)  )"  class="addRequireFixBug">
                                    <div class="flexItem">
                                        <el-input v-model="speForm.onlyOneMaleWeek" @input="$forceUpdate()"></el-input>
                                        <div class="setUnitWidth">
                                            元/{{ speForm.valuationTypeWeek == 8 ? '天' : matchChinese[speForm.measureUnitWeek] }}
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="女工单价" key="onlyOneFemaleWeekProp" prop="onlyOneFemaleWeekProp"  v-if="( (speForm.valuationTypeWeek == 8) || (speForm.unitModeWeek == 1)&&(speForm.ladderModeWeek == 1)&&(speForm.valuationTypeWeek != 1)   )" class="addRequireFixBug">
                                    <div class="flexItem">
                                        <el-input v-model="speForm.onlyOneFemaleWeek" ></el-input>
                                        <div class="setUnitWidth">
                                            元/{{ speForm.valuationTypeWeek == 8 ? '天' : matchChinese[speForm.measureUnitWeek] }}
                                        </div>
                                    </div>
                                </el-form-item>
                            
                            
                            
                            
                        </div>
                        
                        
                        
                        
                        
                        
                    </div>
                    <div class="main3 main">
                        <div class="mainTitle">日结</div>
                        
                        
                        <div class="itemCon">
                            <el-form-item label="计价方式" class="addRequireFixBug">
                                <el-select v-model="speForm.valuationTypeDay" placeholder="请选择">
                                    <el-option v-for="(item,index) in measureList" :key="index" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="男工计时单价" prop="maleDayCountTime" key="maleDayCountTime" class="addRequireFixBug" v-if="(speForm.valuationTypeDay == 1)||(speForm.valuationTypeDay == 3)  ">
                                    <div class="flexItem">
                                    <el-input v-model="speForm.maleDayCountTime"></el-input>
                                    <div class="setUnitWidth">元/小时</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="女工计时单价" prop="femaleDayCountTime" key="femaleDayCountTime" class="addRequireFixBug" v-if="(speForm.valuationTypeDay == 1)||(speForm.valuationTypeDay == 3)  ">
                                    <div class="flexItem">
                                    <el-input v-model="speForm.femaleDayCountTime"></el-input>
                                    <div class="setUnitWidth">元/小时</div>
                                </div>
                            </el-form-item>
                            <el-form-item label="计量方式" class="addRequireFixBug" v-if="(speForm.valuationTypeDay == 2) || (speForm.valuationTypeDay == 3) ">
                                <el-radio-group v-model="speForm.unitModeDay">
                                    <el-radio label="1">单一计量</el-radio>
                                    <el-radio label="2">组合计量</el-radio>
                                </el-radio-group>
                            </el-form-item>
                            <div v-if="speForm.unitModeDay == 1">
                                <el-form-item label="计量单位" class="addRequireFixBug" v-if="(speForm.valuationTypeDay == 2) || (speForm.valuationTypeDay == 3) ">
                                    <el-select v-model="speForm.measureUnitDay" placeholder="请选择" >
                                        <el-option v-for="(item,index) in unitList" :key="index" :label="item.label" :value="item.value"></el-option>
                                    </el-select>
                                </el-form-item>
                                <el-form-item class="addRequireFixBug" v-if="(speForm.valuationTypeDay == 2) || (speForm.valuationTypeDay == 3) ">
                                    <el-radio-group v-model="speForm.ladderModeDay">
                                        <el-radio label="1">固定计价</el-radio>
                                        <el-radio label="2">阶梯计价</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <div class="manGo" @click="popEdit(1,'male')" v-if="( (speForm.ladderModeDay == 2)&&( (speForm.valuationTypeDay == 2) || (speForm.valuationTypeDay == 3) ) )">设置男工单价<i class="el-icon-arrow-right"></i></div>
                                <div class="womanGo" @click="popEdit(1,'female')" v-if="( (speForm.ladderModeDay == 2)&&( (speForm.valuationTypeDay == 2) || (speForm.valuationTypeDay == 3) ) )">设置女工单价<i class="el-icon-arrow-right"></i></div>                                
                            </div>
                            <div v-if="( (speForm.unitModeDay == 2)&&( (speForm.valuationTypeDay == 2) || (speForm.valuationTypeDay == 3) ) )">
                                    <div>
                                        <div>男工单价</div>
                                        <el-form-item prop="countSettleMaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countSettleMaleDay" 
                                                      maxlength="10" ></el-input>
                                                <div class="setUnitWidth">元/件</div>
                                            </div>                                            
                                        </el-form-item>
                                        <el-form-item prop="countDaiMaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDaiMaleDay" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/袋</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countCheMaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countCheMaleDay" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/车</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countDunMaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDunMaleDay" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/吨</div>
                                            </div> 
                                        </el-form-item>
                                    </div>  
                                    <div>
                                        <div>女工单价</div>
                                        <el-form-item prop="countSettleFemaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countSettleFemaleDay" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/件</div>
                                            </div>                                            
                                        </el-form-item>
                                        <el-form-item prop="countDaiFemaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDaiFemaleDay" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/袋</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countCheFemaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countCheFemaleDay" 
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/车</div>
                                            </div> 
                                        </el-form-item>
                                        <el-form-item prop="countDunFemaleDay">
                                            <div class="flexItem">
                                                <el-input size="medium" v-model.trim="speForm.countDunFemaleDay"
                                                      maxlength="10"></el-input>
                                                <div class="setUnitWidth">元/吨</div>
                                            </div> 
                                        </el-form-item>
                                    </div>
                                </div>
                            <el-form-item label="男工单价" prop="onlyOneMaleDayProp"  key="onlyOneMaleDayProp" v-if="( (speForm.valuationTypeDay == 8) || (speForm.unitModeDay == 1)&&(speForm.ladderModeDay == 1)&&(speForm.valuationTypeDay != 1)  )"  class="addRequireFixBug">
                                    <div class="flexItem">
                                        <el-input v-model="speForm.onlyOneMaleDay"></el-input>
                                        <div class="setUnitWidth">
                                            元/{{ speForm.valuationTypeDay == 8 ? '天' : matchChinese[speForm.measureUnitDay] }}
                                        </div>
                                    </div>
                                </el-form-item>
                                <el-form-item label="女工单价" prop="onlyOneFemaleDayProp" key="onlyOneFemaleDayProp"  v-if="( (speForm.valuationTypeDay == 8) || (speForm.unitModeDay == 1)&&(speForm.ladderModeDay == 1)&&(speForm.valuationTypeDay != 1)   )" class="addRequireFixBug">
                                    <div class="flexItem">
                                        <el-input v-model="speForm.onlyOneFemaleDay"></el-input>
                                        <div class="setUnitWidth">
                                            元/{{ speForm.valuationTypeDay == 8 ? '天' : matchChinese[speForm.measureUnitDay] }}
                                        </div>
                                    </div>
                                </el-form-item>
                        </div>
                    </div>
                </el-form>
                <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="submitForm('speForm')">确认</el-button>
                        <el-button @click="resetForm('speForm')">取消</el-button>
                    </div>
            </div>
            <div v-show="!firstPageShow" class="secondPage">
                <div>设置{{ innerGender }}工单价</div>
                
                <div class="ladderlimitWidth">
                    <el-form  class="speFormStyle" ref="forLadderArr"  label-position="left" :model="forLadderArr" label-width="100px">
                    <div class="loopCon" v-for="(item, index) in forLadderArr.ladderObj" :key="index">
                        <div class="delImgOuter">
                            <img class="delIconImg" :src="delIconSrc" v-if="index != 0" @click="deleteLadder(index)">
                            <span class="level">第{{index+1}}档：</span>
                        </div>  
                        <div class="flexThisItem">
                            <el-form-item class="subCon" :prop="`ladderObj.${index}.count`" :rules="ladderObj.count">
                                <el-input size="medium"  v-model.trim="item.count" maxlength="10" class="short-input"></el-input>
                            </el-form-item>
                            <div class="divideWidthText">{{matchChinese[speForm.uniformUnit]}}</div>
                        </div>
                        <div class="flexThisItem">
                            <el-form-item class="subCon" :prop="`ladderObj.${index}.unit`" :rules="ladderObj.unit">
                                <el-input size="medium" v-model.trim="item.unit" maxlength="10"  class="short-input"></el-input>
                            </el-form-item>
                            <div class="divideWidthText">元/{{matchChinese[speForm.uniformUnit]}}</div>
                        </div>
                    </div>
                        <div>
                            <el-button round size="medium" class="addBtn" @click="addLadder">添加阶梯</el-button>
                        </div>
                        <el-form-item prop="ladderObj.overUnitProp" :rules="ladderObj.overUnitProp">
                            <span>超过第{{forLadderArr.ladderObj.length || 0}}档时，</span>
                            <div class="flexThisItem">
                                <el-input size="medium" class="subConSet" v-model.trim="overForm.overUnit"   maxlength="10"></el-input>
                                <span>元/{{matchChinese[speForm.uniformUnit]}}</span>
                            </div>
                            <div>{{forLadderArr.ladderObj[0].count || ''}}{{matchChinese[speForm.uniformUnit]}}以下（含），{{forLadderArr.ladderObj[0].unit || ''}}元/{{matchChinese[speForm.uniformUnit]}}</div>   
                            <div v-for="(item, index) in forLadderArr.ladderObj" :key="index">
                                <div v-if="index != 0">{{Number((forLadderArr.ladderObj[index-1].count)) +
                                    1}}至{{item.count}}{{matchChinese[speForm.uniformUnit]}}（含），{{item.unit}}元/{{matchChinese[speForm.uniformUnit]}}
                                </div>
                            </div>
                            <div>{{forLadderArr.ladderObj[forLadderArr.ladderObj.length-1].count || ''}}{{matchChinese[speForm.uniformUnit]}}以上，{{overForm.overUnit || ''}}元/{{matchChinese[speForm.uniformUnit]}}</div>
                        </el-form-item>
                        <div class="flexHere">
                            <el-button type="primary" @click="jumpConfirm('forLadderArr')">确认</el-button>
<!--                            <el-button @click="jumpCancel('forLadderArr')">取消</el-button>-->
                        </div>
                    </el-form>                            
                </div>
            </div>
    </div>
</template>
<script>
export default {
    name: "priceSet",
    props:{
        info:{
            type: Object,
            required: true
        },
        confirmAdjust:Function,
        cancelAdjust:Function,
    },
    data() {
        var onlyOneMaleDayProp  = (rule, value, callback)=>{
            if( (this.speForm.valuationTypeDay == 8) || (this.speForm.unitModeDay == 1)&&(this.speForm.ladderModeDay == 1)&&(this.speForm.valuationTypeDay != 1)  ){
                     if (!this.speForm.onlyOneMaleDay) {
                         this.fixMaleOneForDay = false;
                         callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.onlyOneMaleDay);
                        console.log('numberFormat',numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.onlyOneMaleDay = '';
                            this.fixMaleOneForDay = false;
                        }
                        if (isNan) {
                            this.speForm.onlyOneMaleDay = '';
                            this.fixMaleOneForDay = false;
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.onlyOneMaleDay == 0 ){
                                    this.speForm.onlyOneMaleDay  = '';
                                    this.fixMaleOneForDay = false;
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.onlyOneMaleDay = Math.abs(this.speForm.onlyOneMaleDay);
                                    this.fixMaleOneForDay = true;
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.onlyOneMaleDay).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.onlyOneMaleDay = Math.abs(process);
                                }
                                this.fixMaleOneForDay = true;
                                callback();
                            }
                        }
                    }
            }else{
                this.fixMaleOneForDay = true;
            }
        }
        var onlyOneFemaleDayProp  = (rule, value, callback)=>{
            if( (this.speForm.valuationTypeDay == 8) || (this.speForm.unitModeDay == 1)&&(this.speForm.ladderModeDay == 1)&&(this.speForm.valuationTypeDay != 1)  ){
                     if (!this.speForm.onlyOneFemaleDay) {
                         this.fixFemaleOneForDay = false;
                         callback(new Error("单价不能为空"));                         
                    } else {
                        let numberFormat = Number(this.speForm.onlyOneFemaleDay);
                        console.log('numberFormat', numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.fixFemaleOneForDay = false;
                            this.speForm.onlyOneFemaleDay = '';
                        }
                        if (isNan) {
                            this.speForm.onlyOneFemaleDay = '';
                            this.fixFemaleOneForDay = false;
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.onlyOneFemaleDay == 0 ){
                                    this.speForm.onlyOneFemaleDay  = '';
                                    this.fixFemaleOneForDay = false;
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.onlyOneFemaleDay = Math.abs(this.speForm.onlyOneFemaleDay);
                                    this.fixFemaleOneForDay = true;
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.onlyOneFemaleDay).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.onlyOneFemaleDay = Math.abs(process);
                                }
                                this.fixFemaleOneForDay = true;
                                callback();
                            }
                        }
                    }
            }else{
                this.fixFemaleOneForDay = true;
            }
        }
        var maleDayCountTime = (rule, value, callback)=>{
            if((this.speForm.valuationTypeDay == 1)||(this.speForm.valuationTypeDay == 3)  ){
                 if (!this.speForm.maleDayCountTime) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.maleDayCountTime);
                        console.log('numberFormat', this.speForm.maleDayCountTime, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.maleDayCountTime = '';
                        }
                        if (isNan) {
                            this.speForm.maleDayCountTime = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.maleDayCountTime == 0 ){
                                    this.speForm.maleDayCountTime  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.maleDayCountTime = Math.abs(this.speForm.maleDayCountTime);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.maleDayCountTime).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.maleDayCountTime = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
            }
        }
        var femaleDayCountTime = (rule, value, callback)=>{
            if((this.speForm.valuationTypeDay == 1)||(this.speForm.valuationTypeDay == 3)  ){
                 if (!this.speForm.femaleDayCountTime) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.femaleDayCountTime);
                        console.log('numberFormat', this.speForm.femaleDayCountTime, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.femaleDayCountTime = '';
                        }
                        if (isNan) {
                            this.speForm.femaleDayCountTime = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.femaleDayCountTime == 0 ){
                                    this.speForm.femaleDayCountTime  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.femaleDayCountTime = Math.abs(this.speForm.femaleDayCountTime);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.femaleDayCountTime).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.femaleDayCountTime = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
            }
        }
        var onlyOneFemaleWeekProp = (rule, value, callback)=>{
            console.log( 'fasda' );
            if( (this.speForm.valuationTypeWeek == 8) || (this.speForm.unitModeWeek == 1)&&(this.speForm.ladderModeWeek == 1)&&(this.speForm.valuationTypeWeek != 1)  ){
                 if (!this.speForm.onlyOneFemaleWeek) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.onlyOneFemaleWeek);
                        console.log('numberFormat', this.speForm.onlyOneFemaleWeek, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.onlyOneFemaleWeek = '';
                        }
                        if (isNan) {
                            this.speForm.onlyOneFemaleWeek = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.onlyOneFemaleWeek == 0 ){
                                    this.speForm.onlyOneFemaleWeek  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.onlyOneFemaleWeek = Math.abs(this.speForm.onlyOneFemaleWeek);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.onlyOneFemaleWeek).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.onlyOneFemaleWeek = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
            }
        }
        var onlyOneMaleWeekProp = (rule, value, callback)=>{
            console.log( 'fasda' );
            if( (this.speForm.valuationTypeWeek == 8) || (this.speForm.unitModeWeek == 1)&&(this.speForm.ladderModeWeek == 1)&&(this.speForm.valuationTypeWeek != 1)  ){
                
                
                 if (!this.speForm.onlyOneMaleWeek) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.onlyOneMaleWeek);
                        console.log('numberFormat', this.speForm.onlyOneMaleWeek, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.onlyOneMaleWeek = '';
                        }
                        if (isNan) {
                            this.speForm.onlyOneMaleWeek = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.onlyOneMaleWeek == 0 ){
                                    this.speForm.onlyOneMaleWeek  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.onlyOneMaleWeek = Math.abs(this.speForm.onlyOneMaleWeek);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.onlyOneMaleWeek).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.onlyOneMaleWeek = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
                
                
                
                
                
            }
            
        }
        
        var maleWeekCountTimeCheck = (rule, value, callback)=>{
            if((this.speForm.valuationTypeWeek == 1)||(this.speForm.valuationTypeWeek == 3)){
                if (!this.speForm.maleWeekCountTime) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.maleWeekCountTime);
                        console.log('numberFormat', this.speForm.maleWeekCountTime, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.maleWeekCountTime = '';
                        }
                        if (isNan) {
                            this.speForm.maleWeekCountTime = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.maleWeekCountTime == 0 ){
                                    this.speForm.maleWeekCountTime  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.maleWeekCountTime = Math.abs(this.speForm.maleWeekCountTime);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.maleWeekCountTime).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.maleWeekCountTime = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
                
            }
            
        };
        var femaleWeekCountTimeProp = (rule, value, callback)=>{
            
            console.log('das');
            
            if((this.speForm.valuationTypeWeek == 1)||(this.speForm.valuationTypeWeek == 3)){
                if (!this.speForm.femaleWeekCountTime) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.femaleWeekCountTime);
                        console.log('numberFormat', this.speForm.femaleWeekCountTime, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.femaleWeekCountTime = '';
                        }
                        if (isNan) {
                            this.speForm.femaleWeekCountTime = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.femaleWeekCountTime == 0 ){
                                    this.speForm.femaleWeekCountTime  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.femaleWeekCountTime = Math.abs(this.speForm.femaleWeekCountTime);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.femaleWeekCountTime).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.femaleWeekCountTime = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
                
            }
            
            
        };
        
        
        
        
        
        
        let monthEightProp  = (rule, value, callback)=>{
            if( (this.speForm.unitModeMonth == 2)&&( (this.speForm.valuationTypeMonth == 2) || (this.speForm.valuationTypeMonth == 3) ) ){ 

                 let numberFormat = Number(this.speForm[rule.field]);
                        console.log('numberFormat', numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
//                        if (numberFormat === 0) {
//                            callback(new Error("单价不能为空"));
//                            this.speForm[rule.field] = '';
//                        }
                        if (isNan) {
                            this.speForm[rule.field] = '';
                        } else {
                            if (isInteger) {
                                if( this.speForm[rule.field] == 0 ){
                                    this.speForm[rule.field]  = '';
                                }else{
                                    this.speForm[rule.field] = Math.abs(this.speForm[rule.field]);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm[rule.field]).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm[rule.field] = Math.abs(process);
                                }
                                callback();
                            }
                        }
                
            }
        };
        
        let dayEightProp  = (rule, value, callback)=>{
            if( (this.speForm.unitModeDay == 2)&&( (this.speForm.valuationTypeDay == 2) || (this.speForm.valuationTypeDay == 3) ) ){ 
                 let numberFormat = Number(this.speForm[rule.field]);
                        console.log('numberFormat', numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
//                        if (numberFormat === 0) {
//                            callback(new Error("单价不能为空"));
//                            this.speForm[rule.field] = '';
//                        }
                        if (isNan) {
                            this.speForm[rule.field] = '';
                        } else {
                            if (isInteger) {
                                if( this.speForm[rule.field] == 0 ){
                                    this.speForm[rule.field]  = '';
                                }else{
                                    this.speForm[rule.field] = Math.abs(this.speForm[rule.field]);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm[rule.field]).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm[rule.field] = Math.abs(process);
                                }
                                callback();
                            }
                        }
            }
        };
        
        let weekEightProp  = (rule, value, callback)=>{
            if( (this.speForm.unitModeWeek == 2)&&( (this.speForm.valuationTypeWeek == 2) || (this.speForm.valuationTypeWeek == 3) ) ){ 
                 let numberFormat = Number(this.speForm[rule.field]);
                        console.log('numberFormat', numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
//                        if (numberFormat === 0) {
//                            callback(new Error("单价不能为空"));
//                            this.speForm[rule.field] = '';
//                        }
                        if (isNan) {
                            this.speForm[rule.field] = '';
                        } else {
                            if (isInteger) {
                                if( this.speForm[rule.field] == 0 ){
                                    this.speForm[rule.field]  = '';
                                }else{
                                    this.speForm[rule.field] = Math.abs(this.speForm[rule.field]);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm[rule.field]).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm[rule.field] = Math.abs(process);
                                }
                                callback();
                            }
                        }
            }
        };
        
        let onlyOneFemaleMonthProp = (rule, value, callback)=>{
             if ( (this.speForm.valuationTypeMonth == 8) || (this.speForm.unitModeMonth == 1)&&(this.speForm.ladderModeMonth == 1)&&(this.speForm.valuationTypeMonth != 1)  ){
                if (!this.speForm.onlyOneFemaleMonth) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.onlyOneFemaleMonth);
                        console.log('numberFormat', this.speForm.onlyOneFemaleMonth, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.onlyOneFemaleMonth = '';
                        }
                        if (isNan) {
                            this.speForm.onlyOneFemaleMonth = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.onlyOneFemaleMonth == 0 ){
                                    this.speForm.onlyOneFemaleMonth  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.onlyOneFemaleMonth = Math.abs(this.speForm.onlyOneFemaleMonth);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.onlyOneFemaleMonth).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.onlyOneFemaleMonth = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
           }
        };
        let onlyOneMaleMonthProp = (rule, value, callback)=>{
            console.log('value',this.speForm.onlyOneMaleMonth)
           if ( (this.speForm.valuationTypeMonth == 8) || (this.speForm.unitModeMonth == 1)&&(this.speForm.ladderModeMonth == 1)&&(this.speForm.valuationTypeMonth != 1)  ){
                if (!this.speForm.onlyOneMaleMonth) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.onlyOneMaleMonth);
                        console.log('numberFormat', this.speForm.onlyOneMaleMonth, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.onlyOneMaleMonth = '';
                        }
                        if (isNan) {
                            this.speForm.onlyOneMaleMonth = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.onlyOneMaleMonth == 0 ){
                                    this.speForm.onlyOneMaleMonth  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.onlyOneMaleMonth = Math.abs(this.speForm.onlyOneMaleMonth);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.onlyOneMaleMonth).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.onlyOneMaleMonth = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
           }
        };
        let maleMonthCountTimeProp = (rule, value, callback)=>{            
            if(  (this.speForm.valuationTypeMonth == 1)||(this.speForm.valuationTypeMonth == 3)  ){
                if (!this.speForm.maleMonthCountTime) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.maleMonthCountTime);
                        console.log('numberFormat', this.speForm.maleMonthCountTime, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.maleMonthCountTime = '';
                        }
                        if (isNan) {
                            this.speForm.maleMonthCountTime = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.maleMonthCountTime == 0 ){
                                    this.speForm.maleMonthCountTime  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.maleMonthCountTime = Math.abs(this.speForm.maleMonthCountTime);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.maleMonthCountTime).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.maleMonthCountTime = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
            }
        };
        let femaleMonthCountTimeProp = (rule, value, callback)=>{
            console.log(this.speForm.femaleMonthCountTime);
            if(  (this.speForm.valuationTypeMonth == 1)||(this.speForm.valuationTypeMonth == 3)  ){
                 if (!this.speForm.femaleMonthCountTime) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.speForm.femaleMonthCountTime);
                        console.log('numberFormat', this.speForm.femaleMonthCountTime, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.speForm.femaleMonthCountTime = '';
                        }
                        if (isNan) {
                            this.speForm.femaleMonthCountTime = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.speForm.femaleMonthCountTime == 0 ){
                                    this.speForm.femaleMonthCountTime  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.speForm.femaleMonthCountTime = Math.abs(this.speForm.femaleMonthCountTime);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.speForm.femaleMonthCountTime).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.speForm.femaleMonthCountTime = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
                
                
            }
        };
        
        let checkOverUnit = (rule, value, callback) => {
                console.log(rule);
                    if (this.overForm.overUnit.length == 0) {
                        callback(new Error("单价不能为空"));
                    } else {
                        let numberFormat = Number(this.overForm.overUnit);
                        console.log('numberFormat', this.overForm.overUnit, numberFormat);
                        let isNan = Number.isNaN(numberFormat);
                        let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                        if (numberFormat === 0) {
                            callback(new Error("单价不能为0"));
                            this.overForm.overUnit = '';
                        }
                        if (isNan) {
                            this.overForm.overUnit = '';
                            callback(new Error("请填写正确的单价"));
                        } else {
                            if (isInteger) {
                                if( this.overForm.overUnit == 0 ){
                                    this.overForm.overUnit  = '';
                                    callback(new Error("单价不能为0"));
                                }else{
                                    this.overForm.overUnit = Math.abs(this.overForm.overUnit);
                                    callback();
                                }
                            } else {
                                let floatLength = String(this.overForm.overUnit).split('.')[1].length;
                                if (floatLength >= 4) {
                                    let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                    this.overForm.overUnit = Math.abs(process);
                                }
                                callback();
                            }
                        }
                    }
            };
        let checkLadderCount = (rule, value, callback) => {
                let checkIndex = Number(rule.field.split('.')[1]);
                if (value.length == 0) {
                    callback(new Error(`${this.matchChinese[this.speForm.uniformUnit]}数不能为空`));
                } else {
                    let numberFormat = Number(value);
                    let isNan = Number.isNaN(numberFormat);
                    let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                    if (numberFormat === 0) {
                        this.forLadderArr.ladderObj[checkIndex].count = '';
                        callback(new Error(`${this.matchChinese[this.speForm.uniformUnit]}数不能为0`));
                    }
                    console.log('isNan', isNan);
                    if (isNan) {
                        this.forLadderArr.ladderObj[checkIndex].count = '';
                        callback(new Error(`${this.matchChinese[this.speForm.uniformUnit]}数为正整数`));
                    } else {
//                        console.log('isInteger', isInteger);
                        if (isInteger) {
                            if( this.forLadderArr.ladderObj[checkIndex].count == 0 ){
                                    this.forLadderArr.ladderObj[checkIndex].count  = '';
                                    callback(new Error(`${this.matchChinese[this.speForm.uniformUnit]}数不能为0`));
                                }else{
                                    this.forLadderArr.ladderObj[checkIndex].count = Math.abs(+this.forLadderArr.ladderObj[checkIndex].count);
                                    callback();
                                }
                        } else {
                            this.forLadderArr.ladderObj[checkIndex].count = '';
                            callback(new Error(`${this.matchChinese[this.speForm.uniformUnit]}数为正整数`));
                        }
                    }
                }
            };
            let checkLadderUnit = (rule, value, callback) => {
                let checkIndex = Number(rule.field.split('.')[1]);
                console.log('checkIndex价钱', rule,checkIndex);
                if (value.length === 0) {
                    callback(new Error(`单价不能为空`));
                } else {
                    let numberFormat = Number(value);
                    console.log('numberFormat', value, numberFormat);
                    let isNan = Number.isNaN(numberFormat);
                    let isInteger = Number.parseInt(numberFormat, 10) === numberFormat;
                    if (numberFormat === 0) {
                        this.forLadderArr.ladderObj[checkIndex].unit = '';
                        callback(new Error(`单价不能为0`));
                    }
                    if (isNan) {
                        this.forLadderArr.ladderObj[checkIndex].unit = '';
                        callback(new Error(`单价格式错误`));
                    } else {
                        if (isInteger) {
                                if( this.forLadderArr.ladderObj[checkIndex].unit == 0 ){
                                    this.forLadderArr.ladderObj[checkIndex].unit  = '';
                                    callback(new Error(`单价不能为0`));
                                }else{
                                    this.forLadderArr.ladderObj[checkIndex].unit = Math.abs( this.forLadderArr.ladderObj[checkIndex].unit );
                                    callback();
                                }
                        } else {
                            let floatLength = String(value).split('.')[1].length;
                            if (floatLength >= 4) {
                                let process = (Math.round(+numberFormat + 'e' + 4) / Math.pow(10, 4)).toFixed(4);
                                this.forLadderArr.ladderObj[checkIndex].unit = Math.abs(+process);
                            }
                            callback();
                        }
                    }
                }
            };
        
        return {
            ladderObj: {
                    count: [{
                        trigger: "blur",
                        validator: checkLadderCount
                    }],
                    unit: [{
                        trigger: "blur",
                        validator: checkLadderUnit
                    }],
                    overUnitProp: [{
                        validator: checkOverUnit,
                        trigger: "blur",
                    }],
                },
            speRules:{
                maleMonthCountTimeProp:[
                    {
                        trigger: "blur",
                        validator: maleMonthCountTimeProp
                    }
                ],
                femaleMonthCountTimeProp:[
                    {
                        trigger: "blur",
                        validator: femaleMonthCountTimeProp
                    }
                ],
                onlyOneMaleMonthProp:[
                    {
                        trigger: "blur",
                        validator: onlyOneMaleMonthProp
                    }
                ],
                onlyOneFemaleMonthProp:[
                    {
                        trigger: "blur",
                        validator: onlyOneFemaleMonthProp
                    }
                ],
                countSettleMaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                        
                    }
                ],
                countDaiMaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                countCheMaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                countDunMaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                countSettleFemaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                countDaiFemaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                countCheFemaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                countDunFemaleMonth:[
                    {
                        trigger: "blur",
                        validator: monthEightProp
                    }
                ],
                maleWeekCountTimeCheck:[
                    {
                        trigger: "blur",
                        validator: maleWeekCountTimeCheck
                    }
                ],
                femaleWeekCountTimeProp:[
                     {
                        trigger: "blur",
                        validator: femaleWeekCountTimeProp
                    }
                ],
                onlyOneMaleWeekProp:[
                    {
                        trigger: "blur",
                        validator: onlyOneMaleWeekProp
                    }
                ],
                onlyOneFemaleWeekProp:[
                    {
                        trigger: "blur",
                        validator: onlyOneFemaleWeekProp
                    }
                ],
                
                countSettleMaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countDaiMaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countCheMaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countDunMaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countSettleFemaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countDaiFemaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countCheFemaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countDunFemaleWeek:[
                     {
                        trigger: "blur",
                        validator: weekEightProp
                    }
                ],
                countSettleMaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countDaiMaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countCheMaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countDunMaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countSettleFemaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countDaiFemaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countCheFemaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                countDunFemaleDay:[
                    {
                        trigger: "blur",
                        validator: dayEightProp
                    }
                ],
                maleDayCountTime:[
                     {
                        trigger: "blur",
                        validator: maleDayCountTime
                    }
                ],
                femaleDayCountTime:[
                     {
                        trigger: "blur",
                        validator: femaleDayCountTime
                    }
                ],
                onlyOneMaleDayProp:[
                      {
                        trigger: "blur",
                        validator: onlyOneMaleDayProp
                    }
                ],
                onlyOneFemaleDayProp:[
                      {
                        trigger: "blur",
                        validator: onlyOneFemaleDayProp
                    }
                ],
            },
            innerGender:'男',
            firstPageShow:true,
            delIconSrc:require('@/assets/images/delete_ladder.png'),
            overForm:{overUnit:'' },
            forLadderArr:{
                ladderObj:[ 
                    { unit:'',count:'' },
                ],
            },
            ladderSource:'',
            alladderArr:{
                maleLadderMonth:[],
                maleOverMonth:0,
                
                femaleLadderMonth:[],
                femaleOverMonth:0,
                
                maleLadderWeek:[],
                maleOverWeek:0,
                
                femaleLadderWeek:[],
                femaleOverWeek:0,
                
                maleLadderDay:[],
                maleOverDay:0,
                
                femaleLadderDay:[],
                femaleOverDay:0,
            },
            speForm:{
                uniformUnit:1,
                
                valuationTypeMonth:'1',
                valuationTypeWeek:'1',
                valuationTypeDay:'1',
                
                maleMonthCountTime:'',
                femaleMonthCountTime:'',
                measureUnitMonth:'1',
                unitModeMonth:'1',
                ladderModeMonth:'1',
                countSettleMaleMonth:'',
                countDaiMaleMonth:'',
                countCheMaleMonth:'',
                countDunMaleMonth:'',
                countSettleFemaleMonth:'',
                countDaiFemaleMonth:'',
                countCheFemaleMonth:'',
                countDunFemaleMonth:'',
                onlyOneMaleMonth:'',
                onlyOneFemaleMonth:'',
                
                onlyOneMaleWeek:'',
                onlyOneFemaleWeek:'',
                countDunFemaleWeek:'',
                countSettleMaleWeek:'',
                countDaiMaleWeek:'',
                countCheMaleWeek:'',
                countDunMaleWeek:'',
                countSettleFemaleWeek:'',
                countDaiFemaleWeek:'',
                countCheFemaleWeek:'',
                maleWeekCountTime:'',
                femaleWeekCountTime:'',
                unitModeWeek:'1',
                measureUnitWeek:'1',
                ladderModeWeek:'1',
                
                onlyOneMaleDay:'',
                onlyOneFemaleDay:'',
                countDunFemaleDay:'',
                countSettleMaleDay:'',
                countDaiMaleDay:'',
                countCheMaleDay:'',
                countDunMaleDay:'',
                countSettleFemaleDay:'',
                countDaiFemaleDay:'',
                countCheFemaleDay:'',
                maleDayCountTime:'',
                femaleDayCountTime:'',
                unitModeDay:'1',
                measureUnitDay:'1',
                ladderModeDay:'1',
            },
            matchChinese:{
                1:'件',
                2:'袋',
                3:'车',
                4:'吨'
            },
            unitList: [
                {
                    label: '件',
                    value: '1'
                },
                {
                    label: '袋',
                    value: '2'
                },
                {
                    label: '车',
                    value: '3'
                },
                {
                    label: '吨',
                    value: '4'
                },
            ],
            innerLadderFlag:true,
            measureList:[
                {
                    label: '计时',
                    value: '1'
                },
                {
                    label: '计量',
                    value: '2'
                },
                {
                    label: '计时 + 计量',
                    value: '3'
                },
                {
                      label: '日固定',
                      value: '8'
                },
            ],
            fixMaleOneForDay:true,
            fixFemaleOneForDay:true,
        }
    },    
    mounted(){
        this.analyseInfo();
    },
    methods: {
        clearValidate(){
//            this.$refs['speForm'].validateField();
        },
        jumpConfirm(){
            this.innerLadderFlag = true  // 检查阶梯计价
                if (!(this.overForm.overUnit)) {
                    this.innerLadderFlag = false
                    return this.$message.error('请检查阶梯件数！')
                }
            let ladderLength = this.forLadderArr.ladderObj.length;
            console.log( 'ladderLength',ladderLength );
            if (ladderLength > 1) {
                for (let i = 0; i < ladderLength - 1; i++) {
                    if (Number(this.forLadderArr.ladderObj[i+1].count) <= Number(this.forLadderArr.ladderObj[i].count)) {
                        this.$refs['forLadderArr'].validate((valid) => {
                            console.log('valid',valid);
                        });
                        this.innerLadderFlag = false
                        return this.$message.error('请检查阶梯件数！')
                    }
                }
            }else{
                this.$refs['forLadderArr'].validate((valid) => {
                    if (valid) {
                        this.innerLadderFlag = true;
                        console.log('submit!');
                    } else {
                        console.log('error submit!!');
                        this.innerLadderFlag = false;
                        return false;
                    }
                });
            }            
            if (!this.innerLadderFlag) {
                return;
            }else{
                console.log( this.innerLadderFlag );
                switch(this.ladderSource){
                    case 'maleMonth':
                            this.alladderArr.maleOverMonth = this.overForm.overUnit;   
                            this.alladderArr.maleLadderMonth = [  ...this.forLadderArr.ladderObj,{ overUnit: this.overForm.overUnit}  ];
                        break;

                    case 'femaleMonth':
                            this.alladderArr.femaleLadderMonth = [  ...this.forLadderArr.ladderObj,{ overUnit: this.overForm.overUnit}  ];
                            this.alladderArr.femaleOverMonth = this.overForm.overUnit;
                        break;

                    case 'maleWeek':
                            this.alladderArr.maleLadderWeek = [  ...this.forLadderArr.ladderObj,{ overUnit: this.overForm.overUnit}  ];                    
                            this.alladderArr.maleOverWeek = this.overForm.overUnit;
                        break;

                    case 'femaleWeek':
                            this.alladderArr.femaleLadderWeek = [  ...this.forLadderArr.ladderObj,{ overUnit: this.overForm.overUnit}  ];  
                            this.alladderArr.femaleOverWeek = this.overForm.overUnit;
                        break;                    
                    case 'maleDay':
                            this.alladderArr.maleLadderDay = [  ...this.forLadderArr.ladderObj,{ overUnit: this.overForm.overUnit}  ];
                            this.alladderArr.maleOverDay = this.overForm.overUnit;
                        break;
                    case 'femaleDay':
                            this.alladderArr.femaleLadderDay = [  ...this.forLadderArr.ladderObj,{ overUnit: this.overForm.overUnit}  ];
                            this.alladderArr.femaleOverDay = this.overForm.overUnit;
                        break;
                }
                console.log(this.alladderArr.maleOverMonth,this.alladderArr.maleLadderMonth);
                this.firstPageShow = true;
            }
        },
        jumpCancel(){
            this.overForm = {overUnit:'' };
            this.forLadderArr = {
                ladderObj:[ 
                    { unit:'',count:'' },
                ],
            };
            this.firstPageShow = true;
        },
        deleteLadder(index){
            this.forLadderArr.ladderObj.splice(index, 1);
        },
        addLadder(){            
            let objShort = this.forLadderArr.ladderObj;
                if (objShort[objShort.length - 1].count && objShort[objShort.length - 1].unit) {
                    this.forLadderArr.ladderObj.push({
                        count: "",
                        unit: "",
                    });
                        if (objShort.length >= 3) {
                            console.log(objShort,objShort.length);
                            console.log( objShort[objShort.length - 3].count );
                            console.log( objShort[objShort.length - 2].count );
                            if (+objShort[objShort.length - 3].count >= +objShort[objShort.length - 2].count) {
                                this.$message.error('请检查阶梯件数')
                                this.$nextTick(()=>{
                                    this.forLadderArr.ladderObj.splice(objShort.length - 1);
                                });
                            }
                        }
                    
                } else {
                    this.$message.error('请填写完整');
                }
            
        },
        popEdit(num,str){
            this.firstPageShow = false;
            switch (num){
                case 2:                    
                    if(str == 'male'){
                        this.ladderSource = 'maleMonth';
                        this.innerGender = '男';
                        this.speForm.uniformUnit = this.speForm.measureUnitMonth;
                        let temp1  = Object.assign([],this.alladderArr.maleLadderMonth)
                        let temp2 = temp1.filter(ele=>{
                            if(ele.unit){
                                return ele
                            }
                        })
                        if(temp2.length){
                            this.forLadderArr.ladderObj = temp2;
                            this.overForm.overUnit = this.alladderArr.maleOverMonth;        
                        }else{
                            this.forLadderArr.ladderObj =[{ unit:'',count:'' }];
                            this.overForm = {overUnit:'' };
                        }                      
                    }
                    if(str == 'female'){
                        this.ladderSource = 'femaleMonth';
                        this.innerGender = '女';
                        this.speForm.uniformUnit = this.speForm.measureUnitMonth;
                        let temp1  = Object.assign([],this.alladderArr.femaleLadderMonth)
                        let temp2 = temp1.filter(ele=>{
                            if(ele.unit){
                                return ele
                            }
                        })
                        if( temp2.length ){
                            this.forLadderArr.ladderObj = temp2;
                            this.overForm.overUnit = this.alladderArr.femaleOverMonth;  
                        }else{
                            this.forLadderArr.ladderObj =[{ unit:'',count:'' }];
                            this.overForm = {overUnit:'' };
                        }                
                    }
                    break;
                case 4:                    
                    if(str == 'male'){
                        this.ladderSource = 'maleWeek';
                        this.innerGender = '男';                        
                        this.speForm.uniformUnit = this.speForm.measureUnitWeek;
                        let temp1  = Object.assign([],this.alladderArr.maleLadderWeek)
                        let temp2 = temp1.filter(ele=>{
                            if(ele.unit){
                                return ele
                            }
                        })
                        if( temp2.length ){
                            this.forLadderArr.ladderObj = temp2;
                            this.overForm.overUnit = this.alladderArr.maleOverWeek; 
                        }else{
                            this.forLadderArr.ladderObj =[{ unit:'',count:'' }];
                            this.overForm = {overUnit:'' };
                        }
                    }
                    if(str == 'female'){   
                        this.innerGender = '女';
                        this.ladderSource = 'femaleWeek';
                        this.speForm.uniformUnit = this.speForm.measureUnitWeek;
                        let temp1  = Object.assign([],this.alladderArr.femaleLadderWeek)
                        let temp2 = temp1.filter(ele=>{
                            if(ele.unit){
                                return ele
                            }
                        })
                        if( temp2.length ){
                            this.forLadderArr.ladderObj = temp2;
                            this.overForm.overUnit = this.alladderArr.femaleOverWeek;    
                        }else{
                            this.forLadderArr.ladderObj =[{ unit:'',count:'' }];
                            this.overForm = {overUnit:'' };
                        }                
                    }                    
                    break;
                case 1:                    
                    if(str == 'male'){
                        this.innerGender = '男';
                        this.ladderSource = 'maleDay';
                        this.speForm.uniformUnit = this.speForm.measureUnitDay;
                        let temp1  = Object.assign([],this.alladderArr.maleLadderDay)
                        let temp2 = temp1.filter(ele=>{
                            if(ele.unit){
                                return ele
                            }
                        })
                        if( temp2.length ){
                            this.forLadderArr.ladderObj = temp2;
                            this.overForm.overUnit = this.alladderArr.maleOverDay; 
                        }else{
                            this.forLadderArr.ladderObj =[{ unit:'',count:'' }];
                            this.overForm = {overUnit:'' };
                        }
                    }
                    if(str == 'female'){
                        this.innerGender = '女';
                        this.ladderSource = 'femaleDay';
                        this.speForm.uniformUnit = this.speForm.measureUnitDay;
                        let temp1  = Object.assign([],this.alladderArr.femaleLadderDay)
                        let temp2 = temp1.filter(ele=>{
                            if(ele.unit){
                                return ele
                            }
                        })
                        if( temp2.length ){
                            this.forLadderArr.ladderObj = temp2;
                            this.overForm.overUnit = this.alladderArr.femaleOverDay; 
                        }else{
                            this.forLadderArr.ladderObj =[{ unit:'',count:'' }];
                            this.overForm = {overUnit:'' };
                        }
                    }
                    break;
            }     
        },
        analyseInfo(){
            
            let salaryStr = this.info.salary;
            let generateArr = JSON.parse(salaryStr) ;
            console.log(generateArr);
            let dayGroup = generateArr.find(ele=>{
                return ele.settlementType == '1';
            })
            let weekGroup = generateArr.find(ele=>{
                return ele.settlementType == '4';
            })
            let monthGroup = generateArr.find(ele=>{
                return ele.settlementType == '2';
            })
//            console.log( 'monthGroup',monthGroup );
//            console.log( 'weekGroup',weekGroup );
//            console.log( 'monthGroup',monthGroup );            
            let matchMap = {
                1:'1',
                2:'2',
                3:'2',
                4:'2',
                5:'3',
                6:'3',
                7:'3',
                8:'8',
            };
            this.speForm.valuationTypeMonth = matchMap[monthGroup.valuationType];
            this.speForm.valuationTypeWeek = matchMap[weekGroup.valuationType];
            this.speForm.valuationTypeDay = matchMap[dayGroup.valuationType];            
            console.log( monthGroup.valuationType );            
//            1.计时 2.固定计量 3.阶梯计量 4.组合计量 5.计时+固定计量 6.计时+阶梯计量 7.计时+组合计量 8.日固定
            switch( +monthGroup.valuationType ){
                case 1:
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    this.monthModeProcessor(1,monthGroup);                    
                    break;
                case 2:
                    this.monthModeProcessor(2,monthGroup);
                    break;
                case 3:
                    this.monthModeProcessor(3,monthGroup);
                    break;
                case 4:
                    this.monthModeProcessor(4,monthGroup);
                    break;
                case 5:
                    this.monthModeProcessor(5,monthGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 6:
                    this.monthModeProcessor(6,monthGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 7:
                    this.monthModeProcessor(7,monthGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 8:
                    this.monthModeProcessor(8,monthGroup);
                    break;
            }
            
            
             switch( +weekGroup.valuationType ){
                case 1:
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                     this.weekModeProcessor(1,weekGroup);
                    break;
                case 2:
                     this.weekModeProcessor(2,weekGroup);
                    break;
                case 3:
                     this.weekModeProcessor(3,weekGroup);
                    break;
                case 4:
                     this.weekModeProcessor(4,weekGroup);
                    break;
                case 5:
                     this.weekModeProcessor(5,weekGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 6:
                     this.weekModeProcessor(6,weekGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 7:
                     this.weekModeProcessor(7,weekGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 8:
                     this.weekModeProcessor(8,weekGroup);
                    break;
            }
            
             switch( +dayGroup.valuationType ){
                case 1:
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                     this.dayModeProcessor(1,dayGroup);
                    break;
                case 2:
                     this.dayModeProcessor(2,dayGroup);
                    break;
                case 3:
                     this.dayModeProcessor(3,dayGroup);
                    break;
                case 4:
                     this.dayModeProcessor(4,dayGroup);
                    break;
                case 5:
                     this.dayModeProcessor(5,dayGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 6:
                     this.dayModeProcessor(6,dayGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 7:
                     this.dayModeProcessor(7,dayGroup);
                    this.countTimePriceProcessor(monthGroup,weekGroup,dayGroup);
                    break;
                case 8:
                     this.dayModeProcessor(8,dayGroup);
                    break;
            }            
        },
        monthModeProcessor(val,monthGroup){
//            console.log( 'monthGroup',val,monthGroup );
            //            1.计时 2.固定计量 3.阶梯计量 4.组合计量 5.计时+固定计量 6.计时+阶梯计量 7.计时+组合计量 8.日固定
            switch( +val ){
                case 1:
                    this.speForm.unitModeMonth = '1';
                    this.speForm.ladderModeMonth = '1';
                    break;
                case 2:
                    this.speForm.unitModeMonth = '1';
                    this.speForm.ladderModeMonth = '1';                    
                    let analyseUnit = monthGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitMonth = '1';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countSettle;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countSettle;
                            break;
                         case 2:
                            this.speForm.measureUnitMonth = '2';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDai;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDai;
                            break;
                        case 3:
                            this.speForm.measureUnitMonth = '3';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countChe;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countChe;
                            break;
                        case 4:
                            this.speForm.measureUnitMonth = '4';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDun;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDun;
                            break;
                    }
                    break;
                case 3:
                    this.speForm.unitModeMonth = '1';
                    this.speForm.ladderModeMonth = '2';  
                    
                        this.alladderArr.maleLadderMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj;
                    
                        this.alladderArr.maleOverMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj[ this.alladderArr.maleLadderMonth.length - 1 ].overUnit;
                    
                        this.alladderArr.femaleLadderMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj;
                    
                        this.alladderArr.femaleOverMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj[ this.alladderArr.femaleLadderMonth.length - 1 ].overUnit;
                    
                                        
                    
                    analyseUnit = monthGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitMonth = '1';
                            break;
                         case 2:
                            this.speForm.measureUnitMonth = '2';
                            break;
                        case 3:
                            this.speForm.measureUnitMonth = '3';
                            break;
                        case 4:
                            this.speForm.measureUnitMonth = '4';
                            break;
                    }
                    break;
                case 4:
                    this.speForm.unitModeMonth = '2';
                    
                    this.speForm.countDunMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDun;
                    this.speForm.countSettleMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countSettle;
                    this.speForm.countDaiMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDai;
                    this.speForm.countCheMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countChe;
                    
                    this.speForm.countDunFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDun;
                    this.speForm.countSettleFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countSettle;
                    this.speForm.countDaiFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDai;
                    this.speForm.countCheFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countChe;     
                    
                    break;
                case 5:
                    this.speForm.unitModeMonth = '1';
                    this.speForm.ladderModeMonth = '1';
                    
                    analyseUnit = monthGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitMonth = '1';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countSettle;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countSettle;
                            break;
                         case 2:
                            this.speForm.measureUnitMonth = '2';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDai;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDai;
                            break;
                        case 3:
                            this.speForm.measureUnitMonth = '3';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countChe;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countChe;
                            break;
                        case 4:
                            this.speForm.measureUnitMonth = '4';
                            this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDun;
                            this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDun;
                            break;
                    }
                    
                    
                    break;
                case 6:
                    this.speForm.unitModeMonth = '1';
                    this.speForm.ladderModeMonth = '2';
                    
                    this.alladderArr.maleLadderMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj;
                    
                        this.alladderArr.maleOverMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj[ this.alladderArr.maleLadderMonth.length - 1 ].overUnit;
                    
                        this.alladderArr.femaleLadderMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj;
                    
                        this.alladderArr.femaleOverMonth = monthGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj[ this.alladderArr.femaleLadderMonth.length - 1 ].overUnit;
                    
                                        
                    
                    analyseUnit = monthGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitMonth = '1';
                            break;
                         case 2:
                            this.speForm.measureUnitMonth = '2';
                            break;
                        case 3:
                            this.speForm.measureUnitMonth = '3';
                            break;
                        case 4:
                            this.speForm.measureUnitMonth = '4';
                            break;
                    }
                    
                    break;
                case 7:
                    this.speForm.unitModeMonth = '2';
                    
                    this.speForm.countDunMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDun;
                    this.speForm.countSettleMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countSettle;
                    this.speForm.countDaiMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDai;
                    this.speForm.countCheMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countChe;
                    
                    this.speForm.countDunFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDun;
                    this.speForm.countSettleFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countSettle;
                    this.speForm.countDaiFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDai;
                    this.speForm.countCheFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countChe;  
                    
                    break;
                case 8:
                    this.speForm.onlyOneMaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countFixed;
                    this.speForm.onlyOneFemaleMonth = monthGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countFixed;
                    break;
            }         
        },
        weekModeProcessor(val,weekGroup){
            console.log( 'weekGroup',weekGroup );
//            1.计时 2.固定计量 3.阶梯计量 4.组合计量 5.计时+固定计量 6.计时+阶梯计量 7.计时+组合计量 8.日固定
            switch( +val ){
                case 1:
                    this.speForm.unitModeWeek = '1';
                    this.speForm.ladderModeWeek = '1';
                    break;
                case 2:
                    this.speForm.unitModeWeek = '1';
                    this.speForm.ladderModeWeek = '1';                    
                    let analyseUnit = weekGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitWeek = '1';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countSettle;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countSettle;
                            break;
                         case 2:
                            this.speForm.measureUnitWeek = '2';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDai;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDai;
                            break;
                        case 3:
                            this.speForm.measureUnitWeek = '3';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countChe;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countChe;
                            break;
                        case 4:
                            this.speForm.measureUnitWeek = '4';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDun;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDun;
                            break;
                    }
                    break;
                case 3:
                    this.speForm.unitModeWeek = '1';
                    this.speForm.ladderModeWeek = '2';
                    
                    this.alladderArr.maleLadderWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj;
                        this.alladderArr.maleOverWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj[ this.alladderArr.maleLadderWeek.length - 1 ].overUnit;
                    
                        this.alladderArr.femaleLadderWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj;
                    
                        this.alladderArr.femaleOverWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj[ this.alladderArr.femaleLadderWeek.length - 1 ].overUnit;
                    
                    
                    
                    
                    
                    
                    analyseUnit = weekGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitWeek = '1';
                            break;
                         case 2:
                            this.speForm.measureUnitWeek = '2';
                            break;
                        case 3:
                            this.speForm.measureUnitWeek = '3';
                            break;
                        case 4:
                            this.speForm.measureUnitWeek = '4';
                            break;
                    }
                    break;
                case 4:
                    this.speForm.unitModeWeek = '2';
                    
                    this.speForm.countDunMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDun;
                    this.speForm.countSettleMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countSettle;
                    this.speForm.countDaiMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDai;
                    this.speForm.countCheMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countChe;
                    
                    this.speForm.countDunFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDun;
                    this.speForm.countSettleFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countSettle;
                    this.speForm.countDaiFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDai;
                    this.speForm.countCheFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countChe;  
                    
                    
                    
                    
                    break;
                case 5:
                    this.speForm.unitModeWeek = '1';
                    this.speForm.ladderModeWeek = '1';
                    
                    analyseUnit = weekGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitWeek = '1';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countSettle;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countSettle;
                            break;
                         case 2:
                            this.speForm.measureUnitWeek = '2';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDai;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDai;
                            break;
                        case 3:
                            this.speForm.measureUnitWeek = '3';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countChe;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countChe;
                            break;
                        case 4:
                            this.speForm.measureUnitWeek = '4';
                            this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDun;
                            this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDun;
                            break;
                    }
                    
                    break;
                case 6:
                    this.speForm.unitModeWeek = '1';
                    this.speForm.ladderModeWeek = '2';
                    
                    this.alladderArr.maleLadderWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj;
                        this.alladderArr.maleOverWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj[ this.alladderArr.maleLadderWeek.length - 1 ].overUnit;
                    
                        this.alladderArr.femaleLadderWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj;
                    
                        this.alladderArr.femaleOverWeek = weekGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj[ this.alladderArr.femaleLadderWeek.length - 1 ].overUnit;
                    
                    analyseUnit = weekGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitWeek = '1';
                            break;
                         case 2:
                            this.speForm.measureUnitWeek = '2';
                            break;
                        case 3:
                            this.speForm.measureUnitWeek = '3';
                            break;
                        case 4:
                            this.speForm.measureUnitWeek = '4';
                            break;
                    }
                    
                    break;
                case 7:
                    this.speForm.unitModeWeek = '2';
                    
                    this.speForm.countDunMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDun;
                    this.speForm.countSettleMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countSettle;
                    this.speForm.countDaiMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDai;
                    this.speForm.countCheMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countChe;
                    
                    this.speForm.countDunFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDun;
                    this.speForm.countSettleFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countSettle;
                    this.speForm.countDaiFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDai;
                    this.speForm.countCheFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countChe;  
                    
                    break;
                case 8:
                    this.speForm.onlyOneMaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countFixed;
                    this.speForm.onlyOneFemaleWeek = weekGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countFixed;
                    break;
            }   
        },
        dayModeProcessor(val,dayGroup){
//            console.log( 'dayGroup',dayGroup );
            
//                1.计时 2.固定计量 3.阶梯计量 4.组合计量 5.计时+固定计量 6.计时+阶梯计量 7.计时+组合计量 8.日固定
            switch( +val ){
                case 1:
                    this.speForm.unitModeDay = '1';
                    this.speForm.ladderModeDay = '1';
                    break;
                case 2:
                    this.speForm.unitModeDay = '1';
                    this.speForm.ladderModeDay = '1';                    
                    let analyseUnit = dayGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitDay = '1';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countSettle;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countSettle;
                            break;
                         case 2:
                            this.speForm.measureUnitDay = '2';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDai;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDai;
                            break;
                        case 3:
                            this.speForm.measureUnitDay = '3';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countChe;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countChe;
                            break;
                        case 4:
                            this.speForm.measureUnitDay = '4';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDun;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDun;
                            break;
                    }
                    break;
                case 3:
                    this.speForm.unitModeDay = '1';
                    this.speForm.ladderModeDay = '2';
                    this.alladderArr.maleLadderDay = dayGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj;
                        this.alladderArr.maleOverDay = dayGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj[ this.alladderArr.maleLadderDay.length - 1 ].overUnit;                    
                        this.alladderArr.femaleLadderDay = dayGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj;
                        this.alladderArr.femaleOverDay = dayGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj[ this.alladderArr.femaleLadderDay.length - 1 ].overUnit;
                    analyseUnit = dayGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitDay = '1';
                            break;
                         case 2:
                            this.speForm.measureUnitDay = '2';
                            break;
                        case 3:
                            this.speForm.measureUnitDay = '3';
                            break;
                        case 4:
                            this.speForm.measureUnitDay = '4';
                            break;
                    }
                    break;
                case 4:
                    this.speForm.unitModeDay = '2';
                    this.speForm.countDunMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDun;
                    this.speForm.countSettleMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countSettle;
                    this.speForm.countDaiMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDai;
                    this.speForm.countCheMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countChe;
                    this.speForm.countDunFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDun;
                    this.speForm.countSettleFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countSettle;
                    this.speForm.countDaiFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDai;
                    this.speForm.countCheFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countChe;  
                    
                    break;
                case 5:
                    this.speForm.unitModeDay = '1';
                    this.speForm.ladderModeDay = '1';
                    
                    analyseUnit = dayGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitDay = '1';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countSettle;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countSettle;
                            break;
                         case 2:
                            this.speForm.measureUnitDay = '2';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDai;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDai;
                            break;
                        case 3:
                            this.speForm.measureUnitDay = '3';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countChe;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countChe;
                            break;
                        case 4:
                            this.speForm.measureUnitDay = '4';
                            this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '1'; 
                            }).countDun;
                            this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                                return ele.sex == '2'; 
                            }).countDun;
                            break;
                    }
                    
                    break;
                case 6:
                    this.speForm.unitModeDay = '1';
                    this.speForm.ladderModeDay = '2';
                    
                    this.alladderArr.maleLadderDay = dayGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj;
                        this.alladderArr.maleOverDay = dayGroup.price.find(ele=>{
                            return ele.sex == '1'; 
                        }).ladderObj[ this.alladderArr.maleLadderDay.length - 1 ].overUnit;
                        this.alladderArr.femaleLadderDay = dayGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj;
                        this.alladderArr.femaleOverDay = dayGroup.price.find(ele=>{
                            return ele.sex == '2'; 
                        }).ladderObj[ this.alladderArr.femaleLadderDay.length - 1 ].overUnit;
                    analyseUnit = dayGroup.unit;
                    switch( +analyseUnit ){
                        case 1:
                            this.speForm.measureUnitDay = '1';
                            break;
                         case 2:
                            this.speForm.measureUnitDay = '2';
                            break;
                        case 3:
                            this.speForm.measureUnitDay = '3';
                            break;
                        case 4:
                            this.speForm.measureUnitDay = '4';
                            break;
                    }
                    break;
                case 7:
                    this.speForm.unitModeDay = '2';
                    this.speForm.countDunMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDun;
                    this.speForm.countSettleMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countSettle;
                    this.speForm.countDaiMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countDai;
                    this.speForm.countCheMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countChe;
                    this.speForm.countDunFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDun;
                    this.speForm.countSettleFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countSettle;
                    this.speForm.countDaiFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countDai;
                    this.speForm.countCheFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countChe; 
                    break;
                case 8:
                    this.speForm.onlyOneMaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '1'; 
                    }).countFixed;
                    this.speForm.onlyOneFemaleDay = dayGroup.price.find(ele=>{
                        return ele.sex == '2'; 
                    }).countFixed;
                    break;
            }   
        },
        countTimePriceProcessor(monthGroup,weekGroup,dayGroup){
            this.speForm.maleMonthCountTime = monthGroup.price.find(ele=>{
                return ele.sex == '1'; 
            }).countTime;
            this.speForm.femaleMonthCountTime = monthGroup.price.find(ele=>{
                return ele.sex == '2'; 
            }).countTime;
            this.speForm.maleWeekCountTime = weekGroup.price.find(ele=>{
                return ele.sex == '1'; 
            }).countTime;
            this.speForm.femaleWeekCountTime = weekGroup.price.find(ele=>{
                return ele.sex == '2'; 
            }).countTime;
            this.speForm.maleDayCountTime = dayGroup.price.find(ele=>{
                return ele.sex == '1'; 
            }).countTime;
            this.speForm.femaleDayCountTime = dayGroup.price.find(ele=>{
                return ele.sex == '2'; 
            }).countTime;
        },
        submitForm(name){
            let finalPart1 = {};
            let finalPart2 = {};
            let finalPart3 = {};
            let flag1 = this.getMonthValuationType();
            let flag2 = this.getWeekValuationType();
            let flag3 = this.getDayValuationType();
            if( flag1 == 3 ){
                finalPart1 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:this.alladderArr.maleLadderMonth,
                        },
                        {
                            sex:'2',
                            ladderObj:this.alladderArr.femaleLadderMonth,
                        }
                    ],
                    unit:this.speForm.measureUnitMonth,
                    settlementType: "2",
                    valuationType: '3',
                };
            }
            if( flag1 == 6 ){
                
                finalPart1 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:this.alladderArr.maleLadderMonth,
                            countTime:this.speForm.maleMonthCountTime
                        },
                        {
                            sex:'2',
                            ladderObj:this.alladderArr.femaleLadderMonth,
                            countTime:this.speForm.femaleMonthCountTime
                        }
                    ],
                    unit:this.speForm.measureUnitMonth,
                    settlementType: "2",
                    valuationType: '6',
                };
                
            }
            if( flag1 == 1 ){
                finalPart1 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countTime:this.speForm.maleMonthCountTime,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countTime:this.speForm.femaleMonthCountTime,
                        }
                    ],
                    unit:'1',
                    settlementType: "2",
                    valuationType: '1',
                };
            }
            
            if( flag1 == 8 ){
                finalPart1 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countFixed:this.speForm.onlyOneMaleMonth,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countFixed:this.speForm.onlyOneFemaleMonth,
                        }
                    ],
                    unit:'1',
                    settlementType: "2",
                    valuationType: '8'
                };
            }
            
            
            if( flag1 == 5 ){
                switch ( +this.speForm.measureUnitMonth){
                    case 1:
                            finalPart1 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneMaleMonth,
                                        countTime:this.speForm.maleMonthCountTime,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneFemaleMonth,
                                        countTime:this.speForm.femaleMonthCountTime,
                                    }
                                ],
                                unit:'1',
                                settlementType: "2",
                                valuationType: '5',
                            };
                            break;
                         case 2:
                            finalPart1 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneMaleMonth,
                                        countTime:this.speForm.maleMonthCountTime,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneFemaleMonth,
                                        countTime:this.speForm.femaleMonthCountTime,
                                    }
                                ],
                                unit:'2',
                                settlementType: "2",
                                valuationType: '5',
                            };
                            break;
                        case 3:
                            finalPart1 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneMaleMonth,
                                            countTime:this.speForm.maleMonthCountTime,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneFemaleMonth,
                                            countTime:this.speForm.femaleMonthCountTime,
                                        }
                                    ],
                                    unit:'3',
                                    settlementType: "2",
                                    valuationType: '5',
                                };
                        
                        
                            break;
                        case 4:
                            finalPart1 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneMaleMonth,
                                            countTime:this.speForm.maleMonthCountTime,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneFemaleMonth,
                                            countTime:this.speForm.femaleMonthCountTime,
                                        }
                                    ],
                                    unit:'4',
                                    settlementType: "2",
                                    valuationType: '5',
                                };
                            break;
                }
            }
            
            if( flag1 == 4 ){
                finalPart1 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countDun:this.speForm.countDunMaleMonth,
                            countChe:this.speForm.countCheMaleMonth,
                            countSettle:this.speForm.countSettleMaleMonth,
                            countDai:this.speForm.countDaiMaleMonth,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countDun:this.speForm.countDunFemaleMonth,
                            countChe:this.speForm.countCheFemaleMonth,
                            countSettle:this.speForm.countSettleFemaleMonth,
                            countDai:this.speForm.countDaiFemaleMonth,
                        }
                    ],
                    unit:'1',
                    settlementType: "2",
                    valuationType: '4',
                };
            }
            
            
            if( flag1 == 2 ){
                switch ( +this.speForm.measureUnitMonth){
                    case 1:
                            finalPart1 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneMaleMonth,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneFemaleMonth,
                                    }
                                ],
                                unit:'1',
                                settlementType: "2",
                                valuationType: '2',
                            };
                            break;
                         case 2:
                            finalPart1 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneMaleMonth,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneFemaleMonth,
                                    }
                                ],
                                unit:'2',
                                settlementType: "2",
                                valuationType: '2',
                            };
                            break;
                        case 3:
                            finalPart1 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneMaleMonth,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneFemaleMonth,
                                        }
                                    ],
                                    unit:'3',
                                    settlementType: "2",
                                    valuationType: '2',
                                };
                        
                        
                            break;
                        case 4:
                            finalPart1 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneMaleMonth,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneFemaleMonth,
                                        }
                                    ],
                                    unit:'4',
                                    settlementType: "2",
                                    valuationType: '2',
                                };
                            break;
                }
            }
            
            if( flag1 == 7 ){
                finalPart1 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countDun:this.speForm.countDunMaleMonth,
                            countChe:this.speForm.countCheMaleMonth,
                            countSettle:this.speForm.countSettleMaleMonth,
                            countDai:this.speForm.countDaiMaleMonth,
                            countTime:this.speForm.maleMonthCountTime,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countDun:this.speForm.countDunFemaleMonth,
                            countChe:this.speForm.countCheFemaleMonth,
                            countSettle:this.speForm.countSettleFemaleMonth,
                            countDai:this.speForm.countDaiFemaleMonth,
                            countTime:this.speForm.femaleMonthCountTime,
                        }
                    ],
                    unit:'1',
                    settlementType: "2",
                    valuationType: '7',
                };
            }
            
            if( flag2 == 3 ){
                finalPart2 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:this.alladderArr.maleLadderWeek,
                        },
                        {
                            sex:'2',
                            ladderObj:this.alladderArr.femaleLadderWeek,
                        }
                    ],
                    unit:this.speForm.measureUnitWeek,
                    settlementType: "4",
                    valuationType: '3',
                };
            }
            if( flag2 == 6 ){
                
                finalPart2 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:this.alladderArr.maleLadderWeek,
                            countTime:this.speForm.maleWeekCountTime
                        },
                        {
                            sex:'2',
                            ladderObj:this.alladderArr.femaleLadderWeek,
                            countTime:this.speForm.femaleWeekCountTime
                        }
                    ],
                    unit:this.speForm.measureUnitWeek,
                    settlementType: "4",
                    valuationType: '6',
                };
                
            }
            if( flag2 == 1 ){
                finalPart2 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countTime:this.speForm.maleWeekCountTime,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countTime:this.speForm.femaleWeekCountTime,
                        }
                    ],
                    unit:'1',
                    settlementType: "4",
                    valuationType: '1',
                };
            }
            
             if( flag2 == 8 ){
                finalPart2 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countFixed:this.speForm.onlyOneMaleMonth,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countFixed:this.speForm.onlyOneFemaleMonth,
                        }
                    ],
                    unit:'1',
                    settlementType: "4",
                    valuationType: '8',
                };
            }
            
            if( flag2 == 2 ){
                switch ( +this.speForm.measureUnitWeek){
                    case 1:
                            finalPart2 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneMaleWeek,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneFemaleWeek,
                                    }
                                ],
                                unit:'1',
                                settlementType: "4",
                                valuationType: '2',
                            };
                            break;
                         case 2:
                            finalPart2 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneMaleWeek,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneFemaleWeek,
                                    }
                                ],
                                unit:'2',
                                settlementType: "4",
                                valuationType: '2',
                            };
                            break;
                        case 3:
                            finalPart2 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneMaleWeek,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneFemaleWeek,
                                        }
                                    ],
                                    unit:'3',
                                    settlementType: "4",
                                    valuationType: '2',
                                };
                            break;
                        case 4:
                            finalPart2 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneMaleWeek,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneFemaleWeek,
                                        }
                                    ],
                                    unit:'4',
                                    settlementType: "4",
                                    valuationType: '2',
                                };
                            break;
                }
            } 
            
            if( flag2 == 4 ){
                finalPart2 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countDun:this.speForm.countDunMaleWeek,
                            countChe:this.speForm.countCheMaleWeek,
                            countSettle:this.speForm.countSettleMaleWeek,
                            countDai:this.speForm.countDaiMaleWeek,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countDun:this.speForm.countDunFemaleWeek,
                            countChe:this.speForm.countCheFemaleWeek,
                            countSettle:this.speForm.countSettleFemaleWeek,
                            countDai:this.speForm.countDaiFemaleWeek,
                        }
                    ],
                    unit:'1',
                    settlementType: "4",
                    valuationType: '4'
                };
            }
            
              if( flag2 == 7 ){
                finalPart2 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countDun:this.speForm.countDunMaleWeek,
                            countChe:this.speForm.countCheMaleWeek,
                            countSettle:this.speForm.countSettleMaleWeek,
                            countDai:this.speForm.countDaiMaleWeek,
                            countTime:this.speForm.maleWeekCountTime,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countDun:this.speForm.countDunFemaleWeek,
                            countChe:this.speForm.countCheFemaleWeek,
                            countSettle:this.speForm.countSettleFemaleWeek,
                            countDai:this.speForm.countDaiFemaleWeek,
                            countTime:this.speForm.femaleWeekCountTime,
                        }
                    ],
                    unit:'1',
                    settlementType: "4",
                    valuationType: '7',
                };
            }
            
            if( flag2 == 5 ){
                switch ( +this.speForm.measureUnitWeek){
                    case 1:
                            finalPart2 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneMaleWeek,
                                        countTime:this.speForm.maleWeekCountTime,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneFemaleWeek,
                                        countTime:this.speForm.femaleWeekCountTime,
                                    }
                                ],
                                unit:'1',
                                settlementType: "4",
                                valuationType: '5',
                            };
                            break;
                         case 2:
                            finalPart2 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneMaleWeek,
                                        countTime:this.speForm.maleWeekCountTime,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneFemaleWeek,
                                        countTime:this.speForm.femaleWeekCountTime,
                                    }
                                ],
                                unit:'2',
                                settlementType: "4",
                                valuationType: '5',
                            };
                            break;
                        case 3:
                            finalPart2 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneMaleWeek,
                                            countTime:this.speForm.maleWeekCountTime,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneFemaleWeek,
                                            countTime:this.speForm.femaleWeekCountTime,
                                        }
                                    ],
                                    unit:'3',
                                    settlementType: "4",
                                    valuationType: '5',
                                };
                            break;
                        case 4:
                            finalPart2 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneMaleWeek,
                                            countTime:this.speForm.maleWeekCountTime,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneFemaleWeek,
                                            countTime:this.speForm.femaleWeekCountTime,
                                        }
                                    ],
                                    unit:'4',
                                    settlementType: "4",
                                    valuationType: '5',
                                };
                            break;
                }
            } 
        if( flag3 == 3 ){
                finalPart3 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:this.alladderArr.maleLadderDay,
                        },
                        {
                            sex:'2',
                            ladderObj:this.alladderArr.femaleLadderDay,
                        }
                    ],
                    unit:this.speForm.measureUnitDay,
                    settlementType: "1",
                    valuationType: '3',
                };
            }
            if( flag3 == 6 ){
                
                finalPart3 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:this.alladderArr.maleLadderDay,
                            countTime:this.speForm.maleDayCountTime
                        },
                        {
                            sex:'2',
                            ladderObj:this.alladderArr.femaleLadderDay,
                            countTime:this.speForm.femaleDayCountTime
                        }
                    ],
                    unit:this.speForm.measureUnitDay,
                    settlementType: "1",
                    valuationType: '6',
                };
                
            }
            if( flag3 == 1 ){
                finalPart3 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countTime:this.speForm.maleDayCountTime,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countTime:this.speForm.femaleDayCountTime,
                        }
                    ],
                    unit:'1',
                    settlementType: "1",
                    valuationType: '1',
                };
            }
             if( flag3 == 8 ){
                finalPart3 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countFixed:this.speForm.onlyOneMaleDay,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countFixed:this.speForm.onlyOneFemaleDay,
                        }
                    ],
                    unit:'1',
                    settlementType: "1",
                    valuationType: '8'
                };
            }
            if( flag3 == 2 ){
                switch ( +this.speForm.measureUnitDay){
                    case 1:
                            finalPart3 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneMaleDay,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneFemaleDay,
                                    }
                                ],
                                unit:'1',
                                settlementType: "1",
                                valuationType: '2',
                            };
                            break;
                         case 2:
                            finalPart3 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneMaleDay,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneFemaleDay,
                                    }
                                ],
                                unit:'2',
                                settlementType: "1",
                                valuationType: "2",
                            };
                            break;
                        case 3:
                            finalPart3 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneMaleDay,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneFemaleDay,
                                        }
                                    ],
                                    unit:'3',
                                    settlementType: "1",
                                    valuationType: "2",
                                };
                            break;
                        case 4:
                            finalPart3 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneMaleDay,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneFemaleDay,
                                        }
                                    ],
                                    unit:'4',
                                    settlementType: "1",
                                    valuationType: "2",
                                };
                            break;
                }
            }
            if( flag3 == 4 ){
                finalPart3 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countDun:this.speForm.countDunMaleDay,
                            countChe:this.speForm.countCheMaleDay,
                            countSettle:this.speForm.countSettleMaleDay,
                            countDai:this.speForm.countDaiMaleDay,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countDun:this.speForm.countDunFemaleDay,
                            countChe:this.speForm.countCheFemaleDay,
                            countSettle:this.speForm.countSettleFemaleDay,
                            countDai:this.speForm.countDaiFemaleDay,
                        }
                    ],
                    unit:'1',
                    settlementType: "1",
                    valuationType: "4",
                };
            }
            
            if( flag3 == 5 ){
                switch ( +this.speForm.measureUnitDay){
                    case 1:
                            finalPart3 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneMaleDay,
                                        countTime:this.speForm.maleDayCountTime,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countSettle:this.speForm.onlyOneFemaleDay,
                                        countTime:this.speForm.femaleDayCountTime,
                                    }
                                ],
                                unit:'1',
                                settlementType: "1",
                                valuationType: '5',
                            };
                            break;
                         case 2:
                            finalPart3 = {
                                price:[
                                    {
                                        sex:'1',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneMaleDay,
                                        countTime:this.speForm.maleDayCountTime,
                                    },
                                    {
                                        sex:'2',
                                        ladderObj:[],
                                        countDai:this.speForm.onlyOneFemaleDay,
                                        countTime:this.speForm.femaleDayCountTime,
                                    }
                                ],
                                unit:'2',
                                settlementType: "1",
                                valuationType: '5',
                            };
                            break;
                        case 3:
                            finalPart3 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneMaleDay,
                                            countTime:this.speForm.maleDayCountTime,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countChe:this.speForm.onlyOneFemaleDay,
                                            countTime:this.speForm.femaleDayCountTime,
                                        }
                                    ],
                                    unit:'3',
                                    settlementType: "1",
                                    valuationType: '5',
                                };
                            break;
                        case 4:
                            finalPart3 = {
                                    price:[
                                        {
                                            sex:'1',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneMaleDay,
                                            countTime:this.speForm.maleDayCountTime,
                                        },
                                        {
                                            sex:'2',
                                            ladderObj:[],
                                            countDun:this.speForm.onlyOneFemaleDay,
                                            countTime:this.speForm.femaleDayCountTime,
                                        }
                                    ],
                                    unit:'4',
                                    settlementType: "1",
                                    valuationType: '5',
                                };
                            break;
                }
            }
             if( flag3 == 7 ){
                finalPart3 = {
                    price:[
                        {
                            sex:'1',
                            ladderObj:[],
                            countDun:this.speForm.countDunMaleDay,
                            countChe:this.speForm.countCheMaleDay,
                            countSettle:this.speForm.countSettleMaleDay,
                            countDai:this.speForm.countDaiMaleDay,
                            countSettle:this.speForm.onlyOneMaleDay,
                        },
                        {
                            sex:'2',
                            ladderObj:[],
                            countDun:this.speForm.countDunFemaleDay,
                            countChe:this.speForm.countCheFemaleDay,
                            countSettle:this.speForm.countSettleFemaleDay,
                            countDai:this.speForm.countDaiFemaleDay,
                            countSettle:this.speForm.onlyOneFemaleDay,
                        }
                    ],
                    unit:'1',
                    settlementType: "1",
                    valuationType: '7',
                };
            }
            let final = [ finalPart1,finalPart2,finalPart3  ];
            
            let checkEveryLadderValidate = true;
            if( (finalPart1.valuationType == 3)||(finalPart1.valuationType == 6) ){
                 checkEveryLadderValidate = finalPart1.price.every(ele=>{
                    return ele.ladderObj.length
                })
            }
            if( (finalPart2.valuationType == 3)||(finalPart2.valuationType == 6) ){
                checkEveryLadderValidate = finalPart2.price.every(ele=>{
                    return ele.ladderObj.length
                })
            }
            if( (finalPart3.valuationType == 3)||(finalPart3.valuationType == 6) ){
                checkEveryLadderValidate = finalPart3.price.every(ele=>{
                    return ele.ladderObj.length
                })
            }
            console.log( '阶梯计价验证结果',checkEveryLadderValidate );
            let combine1Pass = true;
            if( (this.speForm.unitModeMonth == 2)&&( (this.speForm.valuationTypeMonth == 2) || (this.speForm.valuationTypeMonth == 3) )  ){                
                if( 
                    !(this.speForm.countSettleMaleMonth || this.speForm.countDaiMaleMonth || this.speForm.countCheMaleMonth || this.speForm.countDunMaleMonth || this.speForm.countSettleFemaleMonth || this.speForm.countDaiFemaleMonth || this.speForm.countCheFemaleMonth || this.speForm.countDunFemaleMonth)
                ){
                    this.combine1Pass = false;
                    return this.$message.error('月结组合计量男女单价不能为空。');
                }
                if( (this.speForm.countSettleMaleMonth)&&( !this.speForm.countSettleFemaleMonth ) ){                   
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }
                if( (!this.speForm.countSettleMaleMonth)&&( this.speForm.countSettleFemaleMonth ) ){
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }
                if( (!this.speForm.countDaiMaleMonth)&&( this.speForm.countDaiFemaleMonth ) ){
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }
                if( (this.speForm.countDaiMaleMonth)&&( !this.speForm.countDaiFemaleMonth ) ){
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }
                 if( (!this.speForm.countCheMaleMonth)&&( this.speForm.countCheFemaleMonth ) ){
                    this.combine1Pass = false;
                     return this.$message.error('请检查月结组合计量男女单价。');
                }
                if( (this.speForm.countCheMaleMonth)&&( !this.speForm.countCheFemaleMonth ) ){
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }                
                if( (!this.speForm.countDunMaleMonth)&&( this.speForm.countDunFemaleMonth ) ){
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }                
                if( (this.speForm.countCheMaleMonth)&&( !this.speForm.countCheFemaleMonth ) ){
                    this.combine1Pass = false;
                    return this.$message.error('请检查月结组合计量男女单价。');
                }                
            }            
            let combine2Pass = true;
            if( (this.speForm.unitModeWeek == 2)&&( (this.speForm.valuationTypeWeek == 2) || (this.speForm.valuationTypeWeek == 3) )  ){
                
                if( 
                    !(this.speForm.countSettleMaleWeek || this.speForm.countDaiMaleWeek || this.speForm.countCheMaleWeek || this.speForm.countDunMaleWeek || this.speForm.countSettleFemaleWeek || this.speForm.countDaiFemaleWeek || this.speForm.countCheFemaleWeek || this.speForm.countDunFemaleWeek)
                ){                    
                    this.combine2Pass = false;
                    return this.$message.error('周结组合计量男女单价不能为空。');
                }
                if( (this.speForm.countSettleMaleWeek)&&( !this.speForm.countSettleFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }
                if( (!this.speForm.countSettleMaleWeek)&&( this.speForm.countSettleFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }
                if( (!this.speForm.countDaiMaleWeek)&&( this.speForm.countDaiFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }
                if( (this.speForm.countDaiMaleWeek)&&( !this.speForm.countDaiFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }                
                if( (!this.speForm.countCheMaleWeek)&&( this.speForm.countCheFemaleWeek ) ){
                    this.combine2Pass = false;
                     return this.$message.error('请检查周结组合计量男女单价。');
                }
                if( (this.speForm.countCheMaleWeek)&&( !this.speForm.countCheFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }
                if( (!this.speForm.countDunMaleWeek)&&( this.speForm.countDunFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }
                if( (this.speForm.countCheMaleWeek)&&( !this.speForm.countCheFemaleWeek ) ){
                    this.combine2Pass = false;
                    return this.$message.error('请检查周结组合计量男女单价。');
                }
            }
            let combine3Pass = true;
            if( (this.speForm.unitModeDay == 2)&&( (this.speForm.valuationTypeDay == 2) || (this.speForm.valuationTypeDay == 3) )  ){
                if( 
                    !(this.speForm.countSettleMaleDay || this.speForm.countDaiMaleDay || this.speForm.countDaiMaleDay || this.speForm.countDunMaleDay || this.speForm.countSettleFemaleDay || this.speForm.countDaiFemaleDay || this.speForm.countCheFemaleDay || this.speForm.countDunFemaleDay)
                ){
                    this.combine3Pass = false;
                    return this.$message.error('日结组合计量男女单价不能为空。');
                }
                if( (this.speForm.countSettleMaleDay)&&( !this.speForm.countSettleFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (!this.speForm.countSettleMaleDay)&&( this.speForm.countSettleFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (!this.speForm.countDaiMaleDay)&&( this.speForm.countDaiFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (this.speForm.countDaiMaleDay)&&( !this.speForm.countDaiFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (!this.speForm.countDaiMaleDay)&&( this.speForm.countCheFemaleDay ) ){
                    this.combine3Pass = false;
                     return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (this.speForm.countDaiMaleDay)&&( !this.speForm.countCheFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (!this.speForm.countDunMaleDay)&&( this.speForm.countDunFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
                if( (this.speForm.countDaiMaleDay)&&( !this.speForm.countCheFemaleDay ) ){
                    this.combine3Pass = false;
                    return this.$message.error('请检查日结组合计量男女单价。');
                }
            }
            let formValidate = true;  
            this.$refs.speForm.validate((valid) => {
                formValidate = valid;  
            });     
            if( (!this.fixMaleOneForDay)||(!this.fixFemaleOneForDay) ){
                formValidate = false;
            }
            console.log( '抵消表单验证回调函数内部bug所添加的标示1',this.fixFemaleOneForDay );
            console.log( '抵消表单验证回调函数内部bug所添加的标示2',this.fixMaleOneForDay );
            console.log( '表单自身验证结果',formValidate );            
            if( combine3Pass&&combine2Pass&&combine1Pass&& formValidate&&checkEveryLadderValidate){
                 let param = {
                        id:this.info.id,
                        salary:JSON.stringify(final)
                    };
                    console.log( 'param',param );
                    this.$api.schedulingSettingUpdate(param).then(res=>{
                        console.log('res',res);
                        let { data:layer1 } = res;
                        let { respCode } = layer1;
                        if( respCode == 0 ){
                            this.$message({
                              message: '修改成功',
                              type: 'success'
                            });
                        }
                    }).catch(err=>{
                        console.log('err',err);
                    })
                    this.$emit('confirmAdjust');
            }else{
                if( !checkEveryLadderValidate ){
                     this.$message.error('请检查男工女工阶梯计价单价设置。');
                }
            }
        },
        getMonthValuationType(){
            let waitingOut1 = '1';
            if( this.speForm.valuationTypeMonth == 1 ){
                waitingOut1 ='1';
            }else if(  this.speForm.valuationTypeMonth == 2 ){
                if( (this.speForm.unitModeMonth == 1)&&(this.speForm.ladderModeMonth == 1) ){
                    waitingOut1 ='2';
                }else if( (this.speForm.unitModeMonth == 1)&&(this.speForm.ladderModeMonth == 2) ){
                    waitingOut1 ='3';
                }else {
                    waitingOut1 ='4';
                } 
            }else if(  this.speForm.valuationTypeMonth == 3 ){
                if( (this.speForm.unitModeMonth == 1)&&(this.speForm.ladderModeMonth == 1) ){
                    waitingOut1 ='5';
                }else if( (this.speForm.unitModeMonth == 1)&&(this.speForm.ladderModeMonth == 2) ){
                    waitingOut1 ='6';
                }else {
                    waitingOut1 ='7';
                } 
            }else if(  this.speForm.valuationTypeMonth == 8 ){
                waitingOut1 ='8';
            }
            return waitingOut1;
        },
        getWeekValuationType(){
            let waitingOut1 = '1';
            if( this.speForm.valuationTypeWeek == 1 ){
                waitingOut1 ='1';
            }else if(  this.speForm.valuationTypeWeek == 2 ){
                if( (this.speForm.unitModeWeek == 1)&&(this.speForm.ladderModeWeek == 1) ){
                    waitingOut1 ='2';
                }else if( (this.speForm.unitModeWeek == 1)&&(this.speForm.ladderModeWeek == 2) ){
                    waitingOut1 ='3';
                }else {
                    waitingOut1 ='4';
                } 
            }else if(  this.speForm.valuationTypeWeek == 3 ){
                if( (this.speForm.unitModeWeek == 1)&&(this.speForm.ladderModeWeek == 1) ){
                    waitingOut1 ='5';
                }else if( (this.speForm.unitModeWeek == 1)&&(this.speForm.ladderModeWeek == 2) ){
                    waitingOut1 ='6';
                }else {
                    waitingOut1 ='7';
                } 
            }else if(  this.speForm.valuationTypeWeek == 8 ){
                waitingOut1 ='8';
            }
            return waitingOut1;
        },
        getDayValuationType(){
            let waitingOut1 = '1';
            if( this.speForm.valuationTypeDay == 1 ){
                waitingOut1 ='1';
            }else if(  this.speForm.valuationTypeDay == 2 ){
                if( (this.speForm.unitModeDay == 1)&&(this.speForm.ladderModeDay == 1) ){
                    waitingOut1 ='2';
                }else if( (this.speForm.unitModeDay == 1)&&(this.speForm.ladderModeDay == 2) ){
                    waitingOut1 ='3';
                }else {
                    waitingOut1 ='4';
                } 
            }else if(  this.speForm.valuationTypeDay == 3 ){
                if( (this.speForm.unitModeDay == 1)&&(this.speForm.ladderModeDay == 1) ){
                    waitingOut1 ='5';
                }else if( (this.speForm.unitModeDay == 1)&&(this.speForm.ladderModeDay == 2) ){
                    waitingOut1 ='6';
                }else {
                    waitingOut1 ='7';
                } 
            }else if(  this.speForm.valuationTypeDay == 8 ){
                waitingOut1 ='8';
            }
            return waitingOut1;      
        },
        resetForm(name){
            this.$emit('cancelAdjust');
        },
    },
};
</script>
<style scoped lang="scss">  
    .manGo {
        height: 40px;
        line-height: 40px;
        width: 200px;
        margin-bottom: 10px;
        cursor: pointer;
    }
    .womanGo {
        width: 200px;
        height: 40px;
        line-height: 40px;
        cursor: pointer;
    }
    .flexThisItem {
        display: flex;
        justify-content: flex-start;
        align-content: center;
        align-items: center;
        .subCon {
            width: 400px;
        }
        .subConSet {
            width: 300px;
            margin-right: 10px;
        }
    }
    .red {
        margin-left: 20px;
        color: #e84518;
    }
    .formCon {
        box-sizing: border-box;
        margin-top: 10px;
        height: 520px;
        .main {
            border: 1px solid #E4E7ED;
            box-sizing: border-box;
            padding: 20px;
            .mainTitle {
                border-bottom: 1px solid #E4E7ED;
                padding-bottom: 10px;
                margin-bottom: 10px;
            }
        }
        .main1 {
        }
        .main2 {
            margin-bottom: 20px;
            margin-top: 20px;
        }
        .main3 {
        }
        .flexItem {
            display: flex;
            justify-content:flex-start;
            align-content: center;
            align-items: center;
        }
        .setUnitWidth {
            width: 120px;
            margin-left: 20px;
        }
    }
    .ladderlimitWidth {
        .delImgOuter {
            padding-left: 30px;
            box-sizing: border-box;
        }
        .divideWidthText {
            margin-left: 7px;
            height: 36px;
            line-height: 36px;
            margin-bottom: 22px;
        }
    }    
    .speFormStyle {
        height: 510px;
        padding-top: 20px;
        padding-bottom: 20px;
        box-sizing: border-box;
        margin-bottom: 10px;
        overflow-y: scroll;
        border-bottom: 1px solid #E4E7ED;
        border-top: 1px solid #E4E7ED;
    }
    .flexHere {
        display: flex;
        justify-content: center;
    }
    .priceSetCon {
        height: 580px;
    }
</style>
<style lang="scss">
   .priceSetCon {
       .formCon {
           .el-form-item__content {
               width: 70% !important;
           }
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