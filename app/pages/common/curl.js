const md5 = require('md5');
import { ElMessage } from 'element-plus';

const curl = ({
    url, // 请求地址
    method = 'get', // 请求方法
    headers = {}, // 请求头
    query = {}, // url query
    data = {}, // post body
    responseType = 'json', // response data type
    timeout = 60000, // timeout
    errorMessage = '网络异常'
}) => {
    // 接口签名处理
    const signKey = 'gdgg412ffsfafgafgdadadagagfhhdadw34';
    const st = Date.now();

    const dtoHeaders = {
        ...headers,
        s_sign: md5(`${signKey}_${st}`),
        s_t: st
    };
    if (url.indexOf('/api/proj/') > -1 && window.projKey) {
        dtoHeaders.proj_key = window.projKey;
    }

    // 构造请求参数(把参数转为 axios 参数)
    const ajaxSettings = {
        url,
        method,
        params: query,
        data,
        responseType,
        timeout,
        headers: dtoHeaders
    };

    return axios.request(ajaxSettings).then(response => {
        const resData = response.data;

        const { success } = resData;

        // 失败
        if (!success) {
            const { message, code } = resData;
            if (code === 442) {
                ElMessage.error('请求参数异常');
            } else if (code === 445) {
                ElMessage.error('请求不合法');
            } else if (code === 446) {
                ElMessage.error('项目参数不完整');
            } else if (code === 50000) {
                ElMessage.error(errorMessage);
            } else {
                ElMessage.error(message);
            }

            return Promise.resolve({ success, message, code });
        }

        // 成功
        const { data, metadata } = resData;
        return Promise.resolve({ success, metadata, data });
    }).catch(err => {
        const { message } = err;

        if (message.match(/timeout/)) {
            return Promise.resolve({
                message: 'Request Timeout',
                code: 504
            });
        }

        return Promise.resolve(err);
    });
};

export default curl;