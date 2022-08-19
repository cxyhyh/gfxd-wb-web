import axios from 'axios'
import config from '../config/config'
// 环境的切换
axios.defaults.baseURL = config.baseURL
axios.defaults.timeout = 30000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8;multipart/form-data'

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function get(url, params) {
  return new Promise((resolve, reject) => {

    axios.get(url, {
      params: params
    }).then(res => {

      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}
/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function post(url, params) {
  return new Promise((resolve, reject) => {
    axios.post(url, params)
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function postForm(url, params) {
  return new Promise((resolve, reject) => {
    axios.post({
      url,
      params,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
      }
    })
      .then(res => {
        resolve(res.data)
      })
      .catch(err => {
        reject(err.data)
      })
  })
}
export function getFile(url, params) {
  return new Promise((resolve, reject) => {

    axios({
      url,
      params,
      method: 'get',
      responseType: 'blob',
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {

      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function postFile(url, params) {
  return new Promise((resolve, reject) => {

    axios({
      url,
      params,
      method:"post",
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    }).then(res => {

      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}

export function postExportFile(url, params) {
  return new Promise((resolve, reject) => {

    axios({
      url,
      params,
      method: 'post',
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      },
      responseType: 'blob',
    }).then(res => {
      resolve(res.data)
    }).catch(err => {
      reject(err.data)
    })
  })
}



