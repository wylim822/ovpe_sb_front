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
    },

    // ============ 차량 카테고리 관리 ============
    // 제조사 신규 추가 행 insert
    async insertMaker(paramList) {
      return vhclApi.post('/ctgryMng/insertMaker', paramList).then(res => res.data);
    },
    // 제조사 기존 행 update
    async updateMaker(paramList) {
      return vhclApi.put('/ctgryMng/updateMaker', paramList).then(res => res.data);
    },
    // 제조사 기존 행 delete
    async deleteMaker(params) {
      return vhclApi.delete('/ctgryMng/deleteMaker',{ data: { params } });
    },

    // 모델 신규 추가 행 insert
    async insertModel(paramList){
      return vhclApi.post('/ctgryMng/insertModel', paramList).then(res => res.data);
    },
    // 모델 기존 행 update
    async updateModel(paramList) {
      return vhclApi.put('/ctgryMng/updateModel', paramList).then(res => res.data);
    },
    // 모델 기존 행 delete
    async deleteModel(params) {
      return vhclApi.delete('/ctgryMng/deleteModel',{ data: { params } });
    },

    // 세부모델 신규 추가 행 insert
    async insertDetail(paramList){
      return vhclApi.post('/ctgryMng/insertDetail', paramList).then(res => res.data);
    },
    // 세부모델 기존 행 update
    async updateDetail(paramList) {
      return vhclApi.put('/ctgryMng/updateDetail', paramList).then(res => res.data);
    },
    // 세부모델 기존 행 delete
    async deleteDetail(params) {
      return vhclApi.delete('/ctgryMng/deleteDetail',{ data: { params } });
    },

    // 등급 신규 추가 행 insert
    async insertTrim(paramList){
      return vhclApi.post('/ctgryMng/insertTrim', paramList).then(res => res.data);
    },
    // 등급 기존 행 update
    async updateTrim(paramList) {
      return vhclApi.put('/ctgryMng/updateTrim', paramList).then(res => res.data);
    },
    // 등급 기존 행 delete
    async deleteTrim(params) {
      return vhclApi.delete('/ctgryMng/deleteTrim',{ data: { params } });
    }

    // ============ 차량 카테고리 관리 ============
};
