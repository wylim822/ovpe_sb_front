import axios from 'axios'

//const API_BASE_URL = 'http://localhost:3002/vhcl'
const API_BASE_URL = '/vhcl'

const vhclApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
    // 차량번호 분석
    anlsCarRegNo(carRegNo){
        return vhclApi.post('/anlsCarRegNo', {carRegNo})
    }
}
