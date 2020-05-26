export const setPmList = (state, m) => {
  state.pmList = m
}
export const setIndustryList = (state, m) => {
  state.industryList = m
}
export const OUT_PAY_ADDRESS = (state, m) => {
  state.outPayAddress = m
}
export const SELECT_NAME = (state, m) => {
  state.selectName = m
}
export const OUT_PAY_PARAMS = (state, m) => {
  state.outPayParams = m
}
export const OUT_PAY_INFO = (state, m) => {
  state.outPayInfo = m
}
export const HT_PARAMS = (state, m) => {
  state.htParams = m
}
export const XFD_PARAMS = (state, m) => {
  state.xfdParams = m
}
export const XFD_MANAGER_PARAMS = (state, m) => {
  state.xfdManagerParams = m
}
export const RAIN_PARAMS = (state, m) => {
    state.rainParams = m
}
export const SET_ADDRESS_ID = (state,target)=>{
  console.log(target)
  if(target){
    state.addressId = target;
  }
}


export const SET_BILLINFO_ID = (state,target)=>{
  if(target){
    state.billInfoId = target;
  }
}

export const SET_COUNT = (state,target)=>{
  if(target){
    state.count = target;
  }
}

export const SET_INVOICE_TYPE = (state,target)=>{
  if(target){
    state.invoiceType = target;
  }
}
export const SET_RECORD_ID =(state,target)=>{
  if(target){
    state.recordId = target;
  }
}
export const SET_POINT = (state,target)=>{
  if(target){
    state.point = target
  }
}
export const CLEAR_STATE = (state,target)=>{
    state.count=null;
    state.invoiceType=1;
    state.recordId=[];
    state.point=null;
}

export const SET_CLASS_FORM_STATE = (state,target)=>{
  if(target){
    state.classFormState = target;
  }
}
export const outSET_CLASS_FORM_STATE = (state,payload)=>{
  if(payload){
    state.outClassFormState = payload;
  }
}
export const CLEAR_CLASS_FORM_STATE = (state,target)=>{
  state.classFormState = null;
}
export const outCLEAR_CLASS_FORM_STATE = (state,target)=>{
  state.outClassFormState = null;
}

export const SET_CLASS_LIST_LEN = (state,target) =>{
  state.classListLen = target;
}
    export const outSET_CLASS_LIST_LEN = (state,payload) =>{
        state.outClassListLen = payload;
    }
export const SET_TASK_NAME = (state,target)=>{
  state.taskName = target;
}
    export const outSET_TASK_NAME = (state,payload)=>{
        state.outaskName = payload;
    }
export const SET_THUS_TASK_DETAIL = (state,target)=>{
  state.thusTaskDetail = target;
}
    export const outSET_THUS_TASK_DETAIL = (state,payload)=>{
        state.outThusTaskDetail = payload;
    }
export const CLEAR_THUS_TASK_DETAIL = (state,target)=>{
  state.thusTaskDetail = null;
}

export const SET_TYPE_OBJ = (state,target)=>{
  state.transactionTypeObj = target;
}

export const SET_SELECT_CLASS = (state,target)=>{
  state.selectClass = target
}
export const SET_SELECT_PROFIT = (state,target)=>{
    state.selectProfit = target
}
export const SET_SELECT_CLASS_LIST = (state,target)=>{
    state.selectClassList = target
}
export const SET_SELECT_CLASS_TOTAL = (state,target)=>{
    state.selectClassTotal = target
}
export const SET_SELECT_PROFIT_LIST = (state,target)=>{
    state.selectProfitList = target
}
export const SET_SELECT_PROFIT_TOTAL = (state,target)=>{
    state.selectProfitTotal = target
}
export const CLEAR_SELECT_CLASS = (state,target)=>{
  state.selectClass = null;
}
export const setShortCutIndex = (state,target)=>{
  state.shortCutIndex = target;
}
    export const setShortCutIndexOut = (state,payload)=>{
        state.shortCutIndexOut = payload;
    }
export const setAuditStage = (state,target)=>{
  state.auditStage = target;
}
export const IFHAVEPAYOWM = (state,target)=>{
    state.ifHavePayOwn = target;
}
export const setTaskMarketInfo = (state,target)=>{
    if(target.type == 1){
//        console.log('1')
        state.taskMarketInfo.workNumber = target.workNumber;
    }else if(target.type == 2){
//        console.log('2')
        state.taskMarketInfo.taskNumber = target.taskNumber;
    }else if(target.type == 3){
        state.taskMarketInfo.noSetNumber = target.noSetNumber;
    }else{
//        console.log('0')
        state.taskMarketInfo = target;
    }
}