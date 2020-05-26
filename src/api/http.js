import axios from 'axios';
import router from '../router';
import {
    Message
} from 'element-ui'
import util from '../common/util'
/* eslint-disable */

require('es6-promise').polyfill();
let notify;
let message;
let CancelToken = axios.CancelToken
const axiosInstance = axios.create({
    withCredentials: true,
    timeout: 60000,
});

axiosInstance.interceptors.request.use(config => {
    let localToken = util.getLocalStorage('token')
    if (localToken) {
        if (config.url != 'http://upload.qiniu.com/putb64/-1/') {
            config.headers['Authorization'] = `Bearer ${localToken}`;
        }
    }
    // 得到参数中的 requestName 字段，用于决定下次发起请求，取消对应的 相同字段的请求
    // 如果没有 requestName 就默认添加一个 不同的时间戳
//  console.log(config)
    let url
    if (config.method === 'post') {
        if (config.data && config.url) {
            url = config.url
//      console.log(url)
        }
    }

    // 判断，如果这里拿到的参数中的 requestName 在上一次请求中已经存在，就取消上一次的请求
    if (url) {
//    console.log(axiosInstance[url])
        if (axiosInstance[url] && axiosInstance[url].cancel) {
            axiosInstance[url].cancel()
        }
        config.cancelToken = new CancelToken(c => {
            axiosInstance[url] = {}
            axiosInstance[url].cancel = c
        })
    }
    return config
}, error => {
    return Promise.reject(error)
})

axiosInstance.interceptors.response.use(
    response => {
        switch (response.data.respCode) {
            case -1:
                if (response.data.errorCode == 90055) {

                } else if (response.data.errorCode == 50009) {

                } else if (response.data.errorCode == 110004) {

                } else if (response.data.errorCode == 110005) {

                } else if (response.data.errorCode == 90055) {

                } else if (response.data.errorCode == 20007) {

                } else if (response.data.errorCode == 170002) {

                } else {
                    message = Message.error(response.data.errorMsg)
                }

                break;
            case -2:
                sessionStorage.removeItem('token')
                localStorage.removeItem('token')
                router.push({
                    path: '/login',
                })
                message = Message.error(response.data.errorMsg)

                break;

        }
        if (response.headers.status == 1) {
            sessionStorage.setItem("token", response.headers.authorization);
            util.setLocalStorage('token', response.headers.authorization);
        }
        return response;
    },
    error => {
        if (error.response.status == 401) {
            message = Message.error(error.response.data.errorMsg)
        }
        // if (error.toString() === 'Error: Network Error') {
        //   // message = Message.error("网络错误！")
        // }
        return Promise.reject(error);
    }
);


export default axiosInstance;

export function get(url, params) {
    let localToken = util.getLocalStorage('token')
    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${localToken}`,
                'Accept': 'application/json',
            }
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}

export function deletes(url, params) {
    let localToken = util.getLocalStorage('token')

    return new Promise((resolve, reject) => {
        axiosInstance.delete(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${localToken}`
            }
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });

}

router.beforeEach((to, from, next) => {
    if (to.meta.breadName) {
        document.title = to.meta.breadName + '-万才网经理人后台'
    } else {
        document.title = '万才网经理人后台'
    }
    let logintype = localStorage.getItem('logintype');
    let localToken = util.getLocalStorage('token')
    if (logintype == 2) {
        if (to.meta.isRequireAuth === false && false) { // 全部页面都需要登录后才能查看
            next()
        } else {
            if (localToken) {
                next();
            } else {
                if (to.path === '/login') { //这就是跳出循环的关键
                    next()
                } else {
                    router.push({
                        path: '/login'
                    })
                }
            }
        }
    } else {
        if (to.meta.isRequireAuth === false && false) { // 全部页面都需要登录后才能查看
            next()
        } else {
            if (localToken) {
                next();
            } else {
                if (to.path === '/login') { //这就是跳出循环的关键
                    next()
                } else {
                    router.push({
                        path: '/login'
                    })
                }
            }
        }
    }
})

export function gets(url, params) {
    let localToken = util.getLocalStorage('token')
    return new Promise((resolve, reject) => {
        axiosInstance.get(url, {
            params: params,
            headers: {
                'Authorization': `Bearer ${localToken}`
            }
        }).then(res => {
            resolve(res.data);
        }).catch(err => {
            reject(err.data)
        })
    });
}