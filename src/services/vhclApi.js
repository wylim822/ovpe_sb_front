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

    // 차트용
    vhclAnlsMetricDist(param) {
      return vhclApi.post('/vhclAnlsMetricDist', param);
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
    },

    // 공통코드 목록 조회 (selectbox)
    commonCodeList(codeType){
      return vhclApi.get("/commonCodeList", { params: { codeType } });
    },

    // 제작사 목록 조회 (selectbox)
    makerList(){
      return vhclApi.get("/makerList")
    },

    // 모델 목록 조회 (selectbox)
    modelList(makerId){
      return vhclApi.get("/modelList", { params: { makerId } })
    },

    // 세부모델 목록 조회 (selectbox)
    detailModelList(modelId){
      return vhclApi.get("/detailModelList", { params: { modelId } })
    },

    // 등급 목록 조회 (selectbox)
    trimList(detailId){
      return vhclApi.get("/trimList", { params: { detailId } })
    },

    // 차량정보, 검사정보 입력 -> 부가정보 조회
    vhclExtraInfo(params){
      return vhclApi.post('/vhclExtraInfo', params);
    },

    // 차량정보, 검사정보 입력 -> 차량분석
    vhclInputAnls(params){
      return vhclApi.post('/vhclInputAnls', params)
    }
};
