import Vue from "vue";
import Vuex from "vuex";
import * as getters from './getters'
import * as actions from './actions'
import * as mutations from './mutations'
import VuexPersistence from 'vuex-persist'

const vuexLocal = new VuexPersistence({
    storage: window.localStorage
})
Vue.use(Vuex);

const state = {
    pmList:[],
    industryList: [],
    addressId: null,
    billInfoId: null,
    outPayAddress: null,
    outPayParams: [],
    outPayInfo: null,
    selectName: null,
    count: null,
    invoiceType: 1,
    recordId: [],
    point: null,
    classFormState: null,
    outClassFormState: null,
    classListLen: 0,
    outClassListLen: 0,
    taskName: '',
    outaskName: '',
    thusTaskDetail: null,
    outThusTaskDetail: null,
    transactionTypeObj: null,
    selectClass: null,
    selectProfit: null,
    selectClassList:[],
    selectProfitList:[],
    selectClassTotal:0,
    selectProfitTotal:0,
    xfdParams: null,
    htParams: null,
    xfdManagerParams: null,
    rainParams: null,
    shortCutIndex: 1,
    shortCutIndexOut: 1,
    auditStage: 1,
    ifHavePayOwn:0,
    taskMarketInfo:{
        taskNumber:0,
        workNumber:0,
        noSetNumber:0,
    },
}
const store = new Vuex.Store({
    state,
    getters,
    actions,
    mutations,
    plugins: [vuexLocal.plugin]
})
export default store