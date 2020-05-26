import moment from 'moment';   
export default {
    install: function(Vue) {
        Object.defineProperty(Vue.prototype, 'Moment' , { value: moment });
    }	
}