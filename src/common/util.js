import moment from 'moment';
export default {
  formatDate(time) {
  //   var date = new Date(time)
  //   const dateNumFun = (num) => num < 10 ? `0${num}` : num
  //   const [Y, M, D, h, m, s] = [
  //     date.getFullYear(),
  //     dateNumFun(date.getMonth() + 1),
  //     dateNumFun(date.getDate()),
  //     dateNumFun(date.getHours()),
  //     dateNumFun(date.getMinutes()),
  //     dateNumFun(date.getSeconds())
  //   ]
    // return `${Y}-${M}-${D}`
    return moment(time).format("YYYY-MM-DD");
  },
  fullDate(time) {
    if (!time) { // 当时间是null或者无效格式时我们返回空
      return ' '
    } else {
      // const date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘100
      // const dateNumFun = (num) => num < 10 ? `0${num}` : num // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
      // // 这是es6的解构赋值。
      // const [Y, M, D, h, m, s] = [
      //   date.getFullYear(),
      //   dateNumFun(date.getMonth() + 1),
      //   dateNumFun(date.getDate()),
      //   dateNumFun(date.getHours()),
      //   dateNumFun(date.getMinutes()),
      //   dateNumFun(date.getSeconds())
      // ]
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    }
  },
  onlyDate(time) {
    if (!time) { // 当时间是null或者无效格式时我们返回空
      return ' '
    } else {
      // const date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘100
      // const dateNumFun = (num) => num < 10 ? `0${num}` : num // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
      // // 这是es6的解构赋值。
      // const [Y, M, D, h, m, s] = [
      //   date.getFullYear(),
      //   dateNumFun(date.getMonth() + 1),
      //   dateNumFun(date.getDate()),
      //   dateNumFun(date.getHours()),
      //   dateNumFun(date.getMinutes()),
      //   dateNumFun(date.getSeconds())
      // ]
      // return `${Y}-${M}-${D}` // 一定要注意是反引号，否则无效。
      return moment(time).format("YYYY-MM-DD");
    }
  },
  minDate(time) {
    if (!time) { // 当时间是null或者无效格式时我们返回空
      return ' '
    } else {
      // const date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘100
      // const dateNumFun = (num) => num < 10 ? `0${num}` : num // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
      // // 这是es6的解构赋值。
      // const [Y, M, D, h, m, s] = [
      //   date.getFullYear(),
      //   dateNumFun(date.getMonth() + 1),
      //   dateNumFun(date.getDate()),
      //   dateNumFun(date.getHours()),
      //   dateNumFun(date.getMinutes()),
      //   dateNumFun(date.getSeconds())
      // ]
      // return `${Y}-${M}-${D} ${h}:${m}` // 一定要注意是反引号，否则无效。
      return moment(time).format("YYYY-MM-DD HH:mm");
    }
  },
  onlyTime(time) {
    if (!time) { // 当时间是null或者无效格式时我们返回空
      return ' '
    } else {
      // const date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘100
      // const dateNumFun = (num) => num < 10 ? `0${num}` : num // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
      // // 这是es6的解构赋值。
      // const [Y, M, D, h, m, s] = [
      //   date.getFullYear(),
      //   dateNumFun(date.getMonth() + 1),
      //   dateNumFun(date.getDate()),
      //   dateNumFun(date.getHours()),
      //   dateNumFun(date.getMinutes()),
      //   dateNumFun(date.getSeconds())
      // ]
      // return `${h}:${m}` // 一定要注意是反引号，否则无效。
      return moment(time).format("HH:mm");
    }
  },
  dayTime(time) {
    if (!time) { // 当时间是null或者无效格式时我们返回空
      return ' '
    } else {
      // const date = new Date(time) // 时间戳为10位需*1000，时间戳为13位的话不需乘100
      // const dateNumFun = (num) => num < 10 ? `0${num}` : num // 使用箭头函数和三目运算以及es6字符串的简单操作。因为只有一个操作不需要{} ，目的就是数字小于10，例如9那么就加上一个0，变成09，否则就返回本身。
      // // 这是es6的解构赋值。
      // const [Y, M, D, h, m, s] = [
      //   date.getFullYear(),
      //   dateNumFun(date.getMonth() + 1),
      //   dateNumFun(date.getDate()),
      //   dateNumFun(date.getHours()),
      //   dateNumFun(date.getMinutes()),
      //   dateNumFun(date.getSeconds())
      // ]
      // return `${Y}-${M}-${D}` // 一定要注意是反引号，否则无效。
      return moment(time).format("YYYY-MM-DD");
    }
  },
  formatPieceSize(data) {
    let datas = JSON.parse(data)
    let content = (datas.jian == '' || datas.jian == '0' || !datas.jian ? '' : datas.jian + '件') +
      (datas.dai == '' || datas.dai == '0' || !datas.dai ? '' : datas.dai + '袋,') +
      (datas.che == '' || datas.che == '0' || !datas.che ? '' : datas.che + '车,') +
      (datas.dun == '' || datas.dun == '0' || !datas.dun ? '' : datas.dun + '吨,')
    return content || '无'
  },
  price(data) {
    console.log(data)
    let price = data.price[0]
    let content = ''
    if (data.valuationType == 1) {
      content = `${price.countTime}元/小时`
    } else if (data.valuationType == 2) {
      if (data.unit == 1) {
        content = `${price.countSettle}元/件`
      } else if (data.unit == 2) {
        content = `${price.countDai}元/袋`
      } else if (data.unit == 3) {
        content = `${price.countChe}元/车`
      } else {
        content = `${price.countDun}元/吨`
      }
    } else if (data.valuationType == 3) {
      let varUnit
      if (data.unit == 1) {
        varUnit = '件'
      } else if (data.unit == 2) {
        varUnit = '袋'
      } else if (data.unit == 3) {
        varUnit = '车'
      } else {
        varUnit = '吨'
      }
      content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
      for (let i in price.ladderObj) {
        if (i > 0 && i != (price.ladderObj.length - 1)) {
          content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`

        }
      }
      content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
    } else if (data.valuationType == 4) {
      if (price.countSettle) {
        content += `${price.countSettle}元/件,`
      }
      if (price.countDai) {
        content += `${price.countDai}元/袋,`
      }
      if (price.countChe) {
        content += `${price.countChe}元/车,`
      }
      if (price.countDun) {
        content += `${price.countDun}元/吨`
      }
    } else if (data.valuationType == 5) {
      content += `${price.countTime}元/小时,`
      if (data.unit == 1) {
        content += `${price.countSettle}元/件`
      } else if (data.unit == 2) {
        content += `${price.countDai}元/袋`
      } else if (data.unit == 3) {
        content += `${price.countChe}元/车`
      } else {
        content += `${price.countDun}元/吨`
      }
    } else if (data.valuationType == 6) {
      content += `${price.countTime}元/小时,`
      let varUnit
      if (data.unit == 1) {
        varUnit = '件'
      } else if (data.unit == 2) {
        varUnit = '袋'
      } else if (data.unit == 3) {
        varUnit = '车'
      } else {
        varUnit = '吨'
      }
      content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
      for (let i in price.ladderObj) {
        if (i > 0 && i != (price.ladderObj.length - 1)) {
          content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`

        }
      }
      content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
    } else {
      content += `${price.countTime}元/小时,`
      if (price.countSettle) {
        content += `${price.countSettle}元/件,`
      }
      if (price.countDai) {
        content += `${price.countDai}元/袋,`
      }
      if (price.countChe) {
        content += `${price.countChe}元/车,`
      }
      if (price.countDun) {
        content += `${price.countDun}元/吨`
      }
    }
    return content
  },
  getTime() {
    //获取当前时间
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }
    return year + "-" + month + "-" + day;
  },
  setLocalStorage(key, value) {
    var curtime = new Date().getTime(); // 获取当前时间 ，转换成JSON字符串序列
    var valueDate = JSON.stringify({
      val: value,
      timer: curtime
    });
    try {
      localStorage.setItem(key, valueDate);
    } catch (e) {
      /*if(e.name === 'QUOTA_EXCEEDED_ERR' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
          console.log("Error: 本地存储超过限制");
          localStorage.clear();
      } else {
          console.log("Error: 保存到本地存储失败");
      }*/
      // 兼容性写法
      if (isQuotaExceeded(e)) {
        console.log("Error: 本地存储超过限制");
        localStorage.clear();
      } else {
        console.log("Error: 保存到本地存储失败");
      }
    }
  },

  isQuotaExceeded(e) {
    var quotaExceeded = false;
    if (e) {
      if (e.code) {
        switch (e.code) {
          case 22:
            quotaExceeded = true;
            break;
          case 1014: // Firefox
            if (e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
              quotaExceeded = true;
            }
            break;
        }
      } else if (e.number === -2147024882) { // IE8
        quotaExceeded = true;
      }
    }
    return quotaExceeded;
  },

  getLocalStorage(key) {
    var exp = 60 * 60 * 12 * 1000; // 一天的秒数
    if (localStorage.getItem(key)) {
      var vals = localStorage.getItem(key); // 获取本地存储的值
      var dataObj = JSON.parse(vals); // 将字符串转换成JSON对象
      // 如果(当前时间 - 存储的元素在创建时候设置的时间) > 过期时间
      var isTimed = (new Date().getTime() - dataObj.timer) > exp;
      if (isTimed) {
        console.log("存储已过期");
        localStorage.removeItem(key);
        return null;
      } else {
        var newValue = dataObj.val;
      }
      return newValue;
    } else {
      return null;
    }
  },
    /**
     * 取四舍五入n位小数的字符串
     * @param n 小数位数
     * @returns {*} 保留之后的字符串
     */
   toFixedNum (x,n) {
        var f = parseFloat(x);
        if (isNaN(f)) {
            return false;
        }
        var f = Math.round(x*100)/100;
        var s = f.toString();
        var rs = s.indexOf('.');
        if (rs < 0) {
            rs = s.length;
            s += '.';
        }
        while (s.length <= rs + 2) {
            s += '0';
        }
        return s;
    }
}