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
    },

    // 차량 그리드 조회
    tbSrchKeyList(){
        return vhclApi.get('/tbSrchKeyList')
      .then(response => response.data)
      .catch(error => {
        console.error('tbSrchKeyList API Error:', error)
        throw error
      })
    },

    // Sub Grid 조회
    getMigDetail(params) {
      return axios.get("/vhcl/migDetail", { params }).then(res => res.data);
    }

};
