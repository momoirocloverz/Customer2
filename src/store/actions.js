//actions 注册事件处理函数，当这个函数被触发时，将状态提交到 mutaions中处理
import request from '@/api/api'
// 该客户下所有绑定或已解绑或解绑中的项目经理
export const getPmList = ({
  commit
}, m) => {
  request
    .getAllPmListCus()
    .then(response => {
      commit('setPmList', response.data)
    })
    .catch(error => {
      console.log(error);
    });
}


// 该客户所属行业对应的全部工种
export const getIndustryList = ({
  commit
}, m) => {
  request
    .getAllIndustryList()
    .then(response => {
      commit('setIndustryList', response.data)
    })
    .catch(error => {
      console.log(error);
    });
}
export const getTaskMarket = async ({commit},target)=>{
  let taskNumber,workNumber,noSetNumber,dataNoSet,total;
  if(target.type == 1){
    workNumber = target.workNumber || 0;
  }else if(target.type == 2){
    taskNumber = target.taskNumber || 0;
  }else if(target.type == 3){
    dataNoSet = await request.unSetAspeCount({pageNum:1,pageSize:0,});
  }else{
    let dataTask = await request.toBeConfirmTaskList({pageNum:1,pageSize:0,});
    let dataWork = await request.toBeConfirmWorkList({pageNum:1,pageSize:0,});
    dataNoSet = await request.unSetAspeCount({pageNum:1,pageSize:0,});
    if(dataTask.data.respCode === 0){
      taskNumber = dataTask.data.data.total || 0
    }
    if(dataWork.data.respCode === 0){
      workNumber = dataWork.data.data.total || 0
    }
  }
  if(dataNoSet.data.respCode === 0){
    noSetNumber = dataNoSet.data.data || 0
  }
  console.log(dataNoSet,noSetNumber);
  commit('setTaskMarketInfo',{
    taskNumber:taskNumber,
    noSetNumber:noSetNumber,
    workNumber:workNumber,
    type:target.type
  });
}
export const getAddressId =({commit},target)=>{
  commit('SET_ADDRESS_ID',target);
}
export const gerBillInfoId =({commit},target)=>{
  commit('SET_BILLINFO_ID',target);
}

export const getCount = ({commit},target)=>{
  commit('SET_COUNT',target);
}

export const getInvoiceType = ({commit},target)=>{
  commit('SET_INVOICE_TYPE',target);
}

export const getRecordId =({commit},target) =>{
  commit('SET_RECORD_ID',target);
}

export const getPoint = ({commit},target)=>{
  commit('SET_POINT',target);
}
export const clearState = ({commit},target) =>{
  commit('CLEAR_STATE',target);
}

export const getClassFormState = ({commit},target)=>{
  commit('SET_CLASS_FORM_STATE',target);
}

export const clearClassFormState = ({commit},target)=>{
  commit('CLEAR_CLASS_FORM_STATE');
}

export const getclassListLen = ({commit},target)=>{
  commit('SET_CLASS_LIST_LEN');
}

export const getTaskName = ({commit},target)=>{
  commit('SET_TASK_NAME');
}