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
    // 차량번호 정보 조회 (등록정보, 검사정보)
    vhclBscInfo(carRegNo){
        return vhclApi.post('/vhclBscInfo', {carRegNo})
    },
    
    // 차량 분석 조회
    vhclAnlsInfo(vhclInfoParam){
      return vhclApi.post('/vhclAnlsInfo', vhclInfoParam)
    },

    // API 호출 테스트 (!!추후 정리 필요)
    callApiTest(systemMsg, userMsg){
      return vhclApi.post('/callApiTest', {systemMsg, userMsg})
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
