import axios from 'axios'
import router from '@/router'

const http = axios.create({
  baseURL: 'http://localhost:8080',
  timeout: 30000
})

// 请求拦截器：自动附加 Token
http.interceptors.request.use(config => {
  const token = resultToken(localStorage.getItem('token'))
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器：统一错误处理
http.interceptors.response.use(
  res => {
    if (res.data.code !== 200) {
      return Promise.reject(res.data)
    }
    return res.data
  },
  err => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

function resultToken(rawToken) {

    const decodedOuter = rawToken;

    const SEPARATOR = '|#|';
    if(decodedOuter == null){
        console.log("错误");
        return null;
    }
    const parts = decodedOuter.split(SEPARATOR);

    if (parts.length !== 3) {
      throw new Error(`Token 格式错误：期望 3 个部分，实际得到 ${parts.length}`);
    }

    return parts[0]+"|#|"+parts[1];
}

export default http
