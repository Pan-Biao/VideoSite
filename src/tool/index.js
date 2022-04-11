import Time from "time.js/time";
import Cookies from "js-cookie";
import axios from './axios'


function time(number, mode) {
    //1 xxxx年xx月xx日 xx时xx分
    //2 yyyy-MM-dd  hh:mm:ss
    //3 xxxx年xx月xx日 xx时xx分xx秒
    //默认 yyyy-MM-dd  hh:mm
    //小于三天显示 。。。前

    //时区偏差时间戳 秒
    let offset = new Date().getTimezoneOffset() * 60
    //现在时区时间戳 秒
    let currentTime = new Date().getTime() / 1000
    let tempTime = currentTime + offset
    //判断
    let temp = (tempTime - number)
    let day3 = 86400 * 3
    let year1 = 31536000
    if (temp > day3 && temp < year1) {
        //大于三天小于一年
        switch (mode) {
            case 1:
                return Time(number, "%M月%d日 %h时%m分")
            case 2:
                return Time(number, "%M-%d %h:%m:%s")
            case 3:
                return Time(number, "%M月%d日 %h时%m分%s秒")
            default:
                return Time(number, "%M-%d %h:%m")
        }
    } else if (temp > 31536000000) {
        //大于一年
        switch (mode) {
            case 1:
                return Time(number, "%y年%M月%d日 %h时%m分")
            case 2:
                return Time(number, "%y-%M-%d %h:%m:%s")
            case 3:
                return Time(number, "%y年%M月%d日 %h时%m分%s秒")
            default:
                return Time(number, "%y-%M-%d %h:%m")
        }
    } else {
        //小于三天
        return Time.ago(number)
    }
}

export {
    time, axios, Cookies
}
