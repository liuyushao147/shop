import axios from 'axios'
import { Dialog, Toast } from 'vant';

// create an axios instance
const service = axios.create({
  baseURL: 'http://huanhui.payxly.com', // api 的 base_url
  timeout: 5000 // request timeout
})

// request interceptor
service.interceptors.request.use(
    config => {
    if (!config.headers['X-Litemall-Token']) {
      config.headers['X-Litemall-Token'] = `${window.localStorage.getItem(
        'Authorization'
      ) || ''}`;
    }
    return config;
  },
  err => Promise.reject(err)
)

// response interceptor
service.interceptors.response.use(
  response => {
    const res = response.data;
    if(res.code === 200){
      return response
    }
    if (res.code === 501) {
        Toast.fail('请登录');
        setTimeout(() => {
          window.location = '#/login/'
        }, 1500)
      return Promise.reject('error')
    } else if (res.code === 502) {
        Toast.fail('网站内部错误，请联系网站维护人员')
      return Promise.reject('error')
    } if (res.code === 401) {
      Toast.fail('参数不对');
      return Promise.reject('error')
    } if (res.code === 402) {
      Toast.fail('参数值不对');
      return Promise.reject('error')
    } else if (!res.hasOwnProperty('data')) {
      // 非5xx的错误属于业务错误，留给具体页面处理
      return Promise.reject(response)
    } else {
      return response
    }
  }, error => {
    console.log('err' + error)// for debug
    Dialog.alert({
        title: '警告',
        message: '登录连接超时'
      });
    return Promise.reject(error)
  })

export default service