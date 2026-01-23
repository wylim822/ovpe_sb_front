<template>
  <div class="wrap" ref="resultTop">

    <!-- Hero 영역 -->
    <section class="hero">
        <div class="hero-inner fade-up">
            <h1 class="title flicker">
            내 차, 객관적으로 평가해볼까?
            </h1>

            <p class="subtitle fade-up delay-1">
                차량정보와 검사정보를 입력하시면 AI 차량 분석을 해드립니다!
            </p>

            <!-- 차량정보 selectbox -->
            <section class="search-panel">
                <div class="field">
                <label>[ 제작사 ]</label>
                <select v-model="maker" @change="onChangeMaker" style="width:200px">
                    <option value="">제작사를 선택하세요</option>
                    <option v-for="m in makerList" :key="m.makerId" :value="m.makerId">{{ m.makerName }}</option>
                </select>
                </div>

                <div class="field">
                <label>[ 모델 ]</label>
                <select v-model="model" @change="onChangeModel" :disabled="!maker">
                    <template v-if="modelList.length === 0">
                        <option value="">
                        제조사를 선택하세요
                        </option>
                    </template>

                    <template v-else>
                        <option value="">모델</option>
                        <option v-for="m in modelList" :key="m.modelId" :value="m.modelId">{{ m.modelName }}</option>
                    </template>
                </select>
                </div>

                <div class="field">
                <label>[ 세부모델 ]</label>
                <select v-model="detailModel" @change="onChangeDetailModel" :disabled="!model">
                    <template v-if="detailModelList.length === 0">
                        <option value="">
                        모델을 선택하세요
                        </option>
                    </template>

                    <template v-else>
                        <option value="">세부모델</option>
                        <option v-for="d in detailModelList" :key="d.detailId" :value="d">{{ d.detailName }}</option>
                    </template>
                </select>
                </div>

                <div class="field">
                <label>[ 등급 ]</label>
                <select v-model="trim" @change="onChangeTrim" :disabled="!detailModel">
                    <template v-if="trimList.length === 0">
                        <option value="">
                        세부모델을 선택하세요
                        </option>
                    </template>

                    <template v-else>
                        <option value="">등급</option>
                        <option v-for="t in trimList" :key="t.trimId" :value="t">{{ t.trimName }}</option>
                    </template>
                </select>
                </div>
            </section>     

            <!-- 차량정보&검사정보 input -->
            <section class="info-card input-panel">
              <div class="section-title">
                <span class="line"></span>
                  차량정보 입력
                </div>
                
              <!-- hidden input -->
              <input type="hidden" v-model="vhclInput.trimId" />
              
              <span style="font-size:14px;float:left;color:red;margin-bottom:5px">※ * 표시 항목은 필수값입니다.</span>
              <table class="input-table">
                <colgroup>
                  <col style="width:7%">
                  <col style="width:18%">
                  <col style="width:7%">
                  <col style="width:18%">
                  <col style="width:7%">
                  <col style="width:18%">
                  <col style="width:7%">
                  <col style="width:18%">
                </colgroup>
                <tbody>
                  <tr>
                    <th>차량번호 <span class="required">*</span></th>
                    <td><input v-model="vhclInput.carRegNo" placeholder="예: 11가1111" ref="carRegNoInput"/></td>
                    <th>차명 <span class="required">*</span></th>
                    <td><input v-model="vhclInput.carName" ref="carNameInput" /></td>
                    <th>엔진형식 <span class="required">*</span></th>
                    <td><input v-model="vhclInput.engine" ref="engineInput" /></td>
                    <th>연식 <span class="required">*</span></th>
                    <td><input type="number" v-model="vhclInput.manufactureYear" placeholder="예: 2020" ref="manufactureYearInput"/></td>
                  </tr>
                  <tr>
                    <th>차종</th>
                    <td>
                        <select v-model="vhclInput.carType">
                            <option value="">차종 선택</option>
                        </select>
                    </td>
                    <th>연료 <span class="required">*</span></th>
                    <td>
                        <select v-model="vhclInput.fuelType" ref="fuelTypeInput">
                            <option value="">연료 선택</option>
                            <option v-for="f in fuelList" :key="f.codeValue" :value="f.codeValue">{{ f.codeName }}</option>
                        </select>
                    </td>
                    <th>주행거리 <span class="required">*</span></th>
                    <td><input type="number" v-model="vhclInput.totalMileage" ref="totalMileageInput"/></td>
                    <th>검사일자 <span class="required">*</span></th>
                    <td><input type="date" v-model="vhclInput.inspectionDate" ref="inspectionDateInput"/></td>
                  </tr>
                  </tbody>
              </table>
                
              <div class="section-title" style="margin-top:25px">
                <span class="line"></span>
                검사정보 입력
              </div>

              <table class="input-table">
                <colgroup>
                  <col style="width:8%">
                  <col style="width:12%">
                  <col style="width:40%">
                  <col style="width:40%">
                </colgroup>
                <tbody>
                    <tr>
                      <th colspan="2">검사방법 <span class="required">*</span></th>
                      <td colspan="2">
                        <select v-model="vhclInput.inspectionMethod" style="width:30%" ref="inspectionMethodInput">
                          <option value="">검사방법 선택</option>
                          <option value="부하검사(ASM-Idling)">부하검사(ASM-Idling)</option>
                          <option value="무부하검사(정지가동)">무부하검사(정지가동)</option>
                          <option value="부하검사(ASM2525)">부하검사(ASM2525)</option>
                          <option value="무부하검사(TSI)">무부하검사(TSI)</option>
                          <option value="무부하검사(급가속)">무부하검사(급가속)</option>
                          <option value="부하검사(LUG DOWN)">부하검사(LUG DOWN)</option>
                          <option value="부하검사(KD-147)">부하검사(KD-147)</option>
                          <option value="etc">기타/알 수 없음</option>
                        </select>
                        <span style="width:60%;margin-left:15px;color:red;">※검사방법이 '기타/알 수 없음'인 경우, 검사 항목 입력값을 기반으로 추정한 AI 분석 결과가 보여집니다.</span>
                      </td>
                    </tr>
                    <tr>
                      <th>연료구분</th>
                      <th>항목</th>  
                      <th>기준값</th>
                      <th>측정값</th>
                    </tr>
                    <!-- 휘발유 -->
                    <tr class="fuelG">
                      <th rowspan="4">휘발유/가스</th>
                      <th>일산화탄소(CO)</th>
                      <td>
                        <input type="number" v-model="vhclInput.coLimit1" style="width:40%" :readonly="isReadonly('coLimit1')" :class="{ disabled: isReadonly('coLimit1') }" /> / 
                        <input type="number" v-model="vhclInput.coLimit2" style="width:40%" :readonly="isReadonly('coLimit2')" :class="{ disabled: isReadonly('coLimit2') }" />
                      </td>
                      <td>
                        <input type="number" v-model="vhclInput.coValue1" style="width:40%" :readonly="isReadonly('coValue1')" :class="{ disabled: isReadonly('coValue1') }" /> / 
                        <input type="number" v-model="vhclInput.coValue2" style="width:40%" :readonly="isReadonly('coValue2')" :class="{ disabled: isReadonly('coValue2') }" />
                      </td>
                    </tr>
                    <tr class="fuelG">
                      <th>탄화수소(HC)</th>
                      <td>
                        <input type="number" v-model="vhclInput.hcLimit1" style="width:40%" :readonly="isReadonly('hcLimit1')" :class="{ disabled: isReadonly('hcLimit1') }" /> / 
                        <input type="number" v-model="vhclInput.hcLimit2" style="width:40%" :readonly="isReadonly('hcLimit2')" :class="{ disabled: isReadonly('hcLimit2') }" />
                      </td>
                      <td>
                        <input type="number" v-model="vhclInput.hcValue1" style="width:40%" :readonly="isReadonly('hcValue1')" :class="{ disabled: isReadonly('hcValue1') }" /> / 
                        <input type="number" v-model="vhclInput.hcValue2" style="width:40%" :readonly="isReadonly('hcValue2')" :class="{ disabled: isReadonly('hcValue2') }" />
                      </td>
                    </tr>
                    <tr class="fuelG">
                      <th>질소산화물(NOx)</th>
                      <td>
                        <input type="number" v-model="vhclInput.noxLimit1" style="width:40%" :readonly="isReadonly('noxLimit1')" :class="{ disabled: isReadonly('noxLimit1') }" /> / 
                        <input type="number" v-model="vhclInput.noxLimit2" style="width:40%" :readonly="isReadonly('noxLimit2')" :class="{ disabled: isReadonly('noxLimit2') }" />
                      </td>
                      <td>
                        <input type="number" v-model="vhclInput.noxValue1" style="width:40%" :readonly="isReadonly('noxValue1')" :class="{ disabled: isReadonly('noxValue1') }" /> / 
                        <input type="number" v-model="vhclInput.noxValue2" style="width:40%" :readonly="isReadonly('noxValue2')" :class="{ disabled: isReadonly('noxValue2') }" />
                      </td>
                    </tr>
                    <tr class="fuelG">
                      <th>공기과잉률(λ)</th>
                      <td>
                        <input type="number" v-model="vhclInput.lambdaLimit1" style="width:40%" :readonly="isReadonly('lambdaLimit1')" :class="{ disabled: isReadonly('lambdaLimit1') }" /> / 
                        <input type="number" v-model="vhclInput.lambdaLimit2" style="width:40%" :readonly="isReadonly('lambdaLimit2')" :class="{ disabled: isReadonly('lambdaLimit2') }" />
                      </td>
                      <td>
                        <input type="number" v-model="vhclInput.lambdaValue1" style="width:40%" :readonly="isReadonly('lambdaValue1')" :class="{ disabled: isReadonly('lambdaValue1') }" /> / 
                        <input type="number" v-model="vhclInput.lambdaValue2" style="width:40%" :readonly="isReadonly('lambdaValue2')" :class="{ disabled: isReadonly('lambdaValue2') }" />
                      </td>
                    </tr>

                    <!-- 경유 -->
                    <tr class="fuelD">
                      <th rowspan="3">경유</th>
                      <th>매연</th>
                      <td>
                        <input type="number" v-model="vhclInput.smokeLimit1" style="width:25%" :readonly="isReadonly('smokeLimit1')" :class="{ disabled: isReadonly('smokeLimit1') }" /> / 
                        <input type="number" v-model="vhclInput.smokeLimit2" style="width:25%" :readonly="isReadonly('smokeLimit2')" :class="{ disabled: isReadonly('smokeLimit2') }" /> / 
                        <input type="number" v-model="vhclInput.smokeLimit3" style="width:25%" :readonly="isReadonly('smokeLimit3')" :class="{ disabled: isReadonly('smokeLimit3') }" />
                      </td>
                      <td>
                        <input type="number" v-model="vhclInput.smokeValue1" style="width:25%" :readonly="isReadonly('smokeValue1')" :class="{ disabled: isReadonly('smokeValue1') }" /> / 
                        <input type="number" v-model="vhclInput.smokeValue2" style="width:25%" :readonly="isReadonly('smokeValue2')" :class="{ disabled: isReadonly('smokeValue2') }" /> / 
                        <input type="number" v-model="vhclInput.smokeValue3" style="width:25%" :readonly="isReadonly('smokeValue3')" :class="{ disabled: isReadonly('smokeValue3') }" />
                      </td>
                    </tr>
                    <!-- !!아래 검사 항목 사용 여부 확인 필요 -->
                    <!-- <tr class="fuelD">
                      <th>최대출력</th>
                      <td><input type="number" v-model="vhclInput.smokeLimit2" /></td>
                      <td><input type="number" v-model="vhclInput.smokeValue2" /></td>
                    </tr>
                    <tr class="fuelD">
                      <th>엔진회전수</th>
                      <td><input type="number" v-model="vhclInput.smokeLimit3" /></td>
                      <td><input type="number" v-model="vhclInput.smokeValue3" /></td>
                    </tr> -->
                </tbody>
              </table>
            </section>

            <button class="btn-search" @click="onClickAnls">차량 AI 분석</button>
        </div>
    </section>

    <!-- 로딩(부가정보 조회) -->
    <div v-if="loadingExtra" class="loading-anls fade-up">
      <div class="spinner"></div>
      <p class="loading-text">차량 정보를 조회 중입니다...</p>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 부가정보 영역 -->
    <div v-if="!loadingExtra && extraLoaded" ref="extraInfoSection" class="result-container fade-up delay-1">
      <div class="info-card">
        <div class="section-title">
          <span class="line"></span>
          차량 부가정보
        </div>

        <ul class="extra-list">
          <li class="extra-item">
            <div class="extra-title">• 침수차량 정보</div>

            <div v-if="extraInfo.floodedInfo && extraInfo.floodedInfo.exists">
              <p class="danger">⚠ 침수 이력 있음</p>
              <p>- 침수 발생 일시 : {{ extraInfo.floodedInfo.acdnOccrDtm }}</p>
              <p>- 침수 유형 : {{ extraInfo.floodedInfo.acdnKindNm }}</p>
            </div>

            <div v-else>
              <p class="safe">✔ 침수 이력 없음</p>
            </div>
          </li>
        </ul>

      </div>
    </div>

    <!-- 차량 분석조회 로딩 -->
    <div v-if="loadingAnls" class="loading-anls">
      <div class="spinner"></div>
      <p class="loading-text">AI가 차량 상태를 분석 중입니다...</p>
    </div>

    <!-- 분석결과 영역 -->
    <div v-else-if="!loadingAnls && anlsRslt.supportedFuel === false" class="empty-msg">
      현재 AI 분석 미지원 연료 차량입니다. (**휘발유, 경유만 지원**)
    </div>

    <div v-else-if="!loadingAnls && anlsRslt.hasRslt && renderedAnlsRslt" class="result-container fade-up delay-1" style="margin-top: 20px">
      <div class="info-card">
        <!-- <div class="section-title">
          <span class="line"></span>
          AI 차량 분석 리포트
        </div> -->

        <report-section title="종합평가">
          <div class="ai-md" v-html="renderedAnlsRslt.ovrlEvl"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="종합등급">
          <div class="ai-md" v-html="renderedAnlsRslt.ovrlGrd"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="향후 5년 운행 시 예상 변화">
          <div class="ai-md" v-html="renderedAnlsRslt.expcChg"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="정비·관리 권장사항">
          <div class="ai-md" v-html="renderedAnlsRslt.mntn"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="배출가스 분석">
          <div class="ai-md" v-html="renderedAnlsRslt.emisAnls"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="실질연식 및 연식이득">
          <div class="ai-md" v-html="renderedAnlsRslt.ageExpln"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="방사형 그래프 해석">
          <div class="ai-md" v-html="renderedAnlsRslt.graphExpln"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="잔존가치 해석">
          <div class="ai-md" v-html="renderedAnlsRslt.rmnVal"></div>
        </report-section>
      </div>
      <div class="info-card">
        <report-section title="중요 고지문">
          <div class="ai-md" v-html="renderedAnlsRslt.notice"></div>
        </report-section>
      </div>
    </div>

    <div v-else-if="!loadingAnls && !anlsRslt.hasRslt && anlsRslt.supportedFuel" class="empty-msg">
      AI 분석 결과가 없습니다.
    </div>

    <!-- 조회 전 안내 (!!사용여부 미정) -->
    <!-- <div v-if="!loadingAnls && !renderedAnlsRslt" class="placeholder fade-up delay-1">
        차량 검사정보를 입력하시면 AI 차량 분석 내용을 확인할 수 있습니다.
    </div> -->

  </div>
</template>


<script>
//import { matrix_d } from 'echarts/types/dist/shared';
//import { TabGuardClassNames } from 'ag-grid-community';
import vhclApi from '../services/vhclApi'
//import MetricBarChart from '@/components/charts/MetricBarChart.vue'
import MarkdownIt from 'markdown-it';
import DOMPurify from 'dompurify';

// 검사방법별 입력 필요 검사항목 정의
const INSPECTION_FIELD_MAP = {
  '부하검사(ASM-Idling)': [
    'coValue1', 'coLimit1',
    'hcValue1', 'hcLimit1',
    'noxValue1', 'noxLimit1',
    'coValue2', 'coLimit2',
    'hcValue2', 'hcLimit2',
    'lambdaValue1', 'lambdaLimit1'
  ],
  '무부하검사(정지가동)': [
    'coValue1', 'coLimit1',
    'hcValue1', 'hcLimit1',
    'lambdaValue1', 'lambdaLimit1'
  ],
  '부하검사(ASM2525)': [
    'coValue1', 'coLimit1',
    'hcValue1', 'hcLimit1',
    'noxValue1', 'noxLimit1'
  ],
  '무부하검사(TSI)': [
    'coValue1', 'coLimit1',
    'hcValue1', 'hcLimit1',
    'lambdaValue1', 'lambdaLimit1',
    'coValue2', 'coLimit2',
    'hcValue2', 'hcLimit2',
    'lambdaValue2', 'lambdaLimit2'
  ],
  '무부하검사(급가속)': [
    'smokeValue1', 'smokeLimit1'
  ],
  '부하검사(KD-147)': [
    'smokeValue1', 'smokeLimit1'
  ],
  '부하검사(LUG DOWN)': [
    'smokeValue1', 'smokeLimit1',
    'smokeValue2', 'smokeLimit2',
    'smokeValue3', 'smokeLimit3'
  ],
  'etc': 'ALL'
};

export default {
  name: "VhclAnls",
  components: {
    //MetricBarChart
  },

  data() {
    return {
      // 입력용 차량정보 selectbox
      maker: '',
      model: '',
      detailModel: '',
      trim: '',

      makerList: [],
      modelList: [],
      detailModelList: [],
      trimList: [],

      // 입력용 차량정보 & 검사정보 input
      fuelList: [],
      vhclInput: {
          carRegNo: '',
          carName: '',
          fuelType: '',
          carType: '',
          engine: '',
          manufactureYear: '',
          totalMileage: '',
          inspectionDate: '',
          inspectionMethod: '',
          trimId: '',
          coLimit1: '', coLimit2: '', coValue1: '', coValue2: '',
          hcLimit1: '', hcLimit2: '', hcValue1: '', hcValue2: '',
          noxLimit1: '', noxLimit2: '', noxValue1: '', noxValue2: '',
          lambdaLimit1: '', lambdaLimit2: '', lambdaValue1: '', lambdaValue2: '',
          smokeLimit1: '', smokeLimit2: '', smokeLimit3: '',
          smokeValue1: '', smokeValue2: '', smokeValue3: ''
      },

      //carRegNo: "",
      loadingExtra: false,  // 로딩 - 부가정보
      loadingAnls: false,   // 로딩 - 분석(API)
      //isAnlsSkipped: false, // 차량분석 여부 (검사정보가 없으면 분석 수행 안함)
      error: null,

      // 데이터 (!!변수 정리 필요)
      // 부가정보
      extraInfo: {
        // 침수차량 정보
        floodedInfo: {
          exists : false
        }
      }, 
      extraLoaded: false,   // 부가정보 조회 완료 여부   

      // GPT 분석 결과
      anlsRslt: {
        supportedFuel: null,  // 지원 연료 여부
        hasRslt: null,        // 분석 결과 유무
        apiRslt: null         // 최종 분석 결과
      },     
      // 마크다운
      md: new MarkdownIt({
        html: false,
        linkify: true,
        breaks: true
      })

      // !!API 호출 전 호출메시지 확인용
      //systemMsg: "",      // GPT 결과 - 시스템 메시지
      //userMsg: "",        // GPT 결과 - 사용자 메시지

      // 차트용
      //metricCharts: []
    }
  },

  mounted() {
    // selectbox
    this.initSelectbox();

    const vhrno = this.$route.query.vhrno;

    if (vhrno) {
      this.carRegNo = vhrno;
      this.$nextTick(() => {
        this.vhclBscInfo();
      });
    }
  },

  methods: {
    // 제작사, 연료 selectbox 초기값 조회
    async initSelectbox(){
        try {
            const[ makerRes, fuelRes ] = await Promise.all([
                vhclApi.makerList(),
                vhclApi.commonCodeList('유종')
            ]);

            this.makerList = makerRes.data;
            this.fuelList = fuelRes.data;
            
            // if(this.fuelList.length > 0){
            //     this.vhclInput.fuelType = this.fuelList[0].codeValue;
            // }
        } catch(e) {
            console.error('selectbox 초기화 실패', e);
        }
    },

    // 제작사 selectbox 클릭 이벤트
    async onChangeMaker(){
        this.model = '';
        this.detaiModel = '';
        this.trim = '';

        this.modelList = [];
        this.detailModelList = [];
        this.trimList = [];

        const res = await vhclApi.modelList(this.maker);
        this.modelList = res.data;
    },

    // 모델 selectbox 클릭 이벤트
    async onChangeModel(){
        this.detailModel = '';
        this.trim = '';
        
        this.detialModelList = [];
        this.trimList = [];

        const res = await vhclApi.detailModelList(this.model);
        this.detailModelList = res.data;
    },

    // 세부모델 selectbox 클릭 이벤트
    async onChangeDetailModel(){
        this.trim = '';
        this.trimList = [];

        const res = await vhclApi.trimList(this.detailModel.detailId);
        this.trimList = res.data;

        // 차명 input 값 지정
        this.vhclInput.carName = this.detailModel.detailName;
    },

    // 등급 selectbox 클릭 이벤트
    async onChangeTrim(){
        // trimId input 값 지정 (hidden)
        this.vhclInput.trimId = this.trim.trimId;

        // 연료, 엔진형식 input 값 지정
        // this.vhclInput.engine = this.trim.engine;
        // this.vhclInput.fuelType = this.trim.fuel;
    },

    // 차량 AI 분석 버튼 이벤트
    async onClickAnls() {
      // input 유효성 체크
      if (!this.validateInput()) return;
      
      // 1. 부가정보 조회
      await this.vhclExtraInfo();

      // 2. 분석 API 호출
      await this.vhclInputAnls();

      // !!차량부가정보 위치로 스크롤 자동 이동 처리 필요
    },

    // input 유효성 체크
    validateInput() {
      // 차량번호
      if (!this.vhclInput.carRegNo) {
        alert('차량번호를 입력하세요.');
        this.$refs.carRegNoInput.focus();
        return false;
      }

      // 차명
      if (!this.vhclInput.carName) {
        alert('차명을 입력하세요.');
        this.$refs.carNameInput.focus();
        return false;
      }

      // 엔진형식
      if (!this.vhclInput.engine) {
        alert('엔진형식을 입력하세요.');
        this.$refs.engineInput.focus();
        return false;
      }

      // 연식
      if (!this.vhclInput.manufactureYear) {
        alert('연식을 입력하세요.');
        this.$refs.manufactureYearInput.focus();
        return false;
      }

      // 연료
      if (!this.vhclInput.fuelType || this.vhclInput.fuelType === '') {
        alert('연료를 선택하세요.');
        this.$refs.fuelTypeInput.focus();
        return false;
      }

      // 주행거리
      if (!this.vhclInput.totalMileage) {
        alert('주행거리를 입력하세요.');
        this.$refs.totalMileageInput.focus();
        return false;
      }

      // 검사일자
      if (!this.vhclInput.inspectionDate) {
        alert('검사일자를 입력하세요.');
        this.$refs.inspectionDateInput.focus();
        return false;
      }

      // 검사방법
      if (!this.vhclInput.inspectionMethod || this.vhclInput.inspectionMethod === '') {
        this.$refs.inspectionMethodInput.focus();
        alert('검사방법을 선택하세요.');
        return false;
      }

      return true;
    },

    // 검사방법 -> 검사항목 input readolny 처리
    isReadonly (field) {
      const method = this.vhclInput.inspectionMethod;

      // 검사방법 미선택
      if (!method) return true;
      
      // 검사방법 : 기타/알 수 없음
      if (INSPECTION_FIELD_MAP[method] === 'ALL') return false;

      // 해당 검사방법에 포함된 필드만 활성화
      return !INSPECTION_FIELD_MAP[method]?.includes(field);
    },

    // 차량정보, 검사정보 입력값 -> 부가정보 조회 (연계 데이터)
    async vhclExtraInfo() {
      this.extraLoaded = false;
      this.loadingExtra = true;

      try {
        const res = await vhclApi.vhclExtraInfo(this.vhclInput);
        this.extraInfo = res.data;

      } catch(e) {
        console.error('차량 부가정보 조회 실패', e);
        return;

      } finally {
        this.loadingExtra = false;
        this.extraLoaded = true;

        // 조회결과 부분으로 스크롤 이동
        await this.$nextTick();

        if(this.$refs.extraInfoSection) {
          this.$refs.extraInfoSection.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      }
    },

    // 차량정보, 검사정보 입력값 -> 차량분석 (ChatGPT API 호출)
    async vhclInputAnls(){
      this.anlsRslt = {
        supportedFuel: null,
        hasRslt: null,
        apiRslt: null
      };
      this.loadingAnls = true;

      try {
        const res = await vhclApi.vhclInputAnls(this.vhclInput);
        this.anlsRslt = res.data;

      } catch(e) {
          console.error('AI 분석 요청 실패', e);
      } finally {
        this.loadingAnls = false;
      }
    },

    // 미사용
    // async vhclBscInfo() {
    //   if (!this.carRegNo.trim()) {
    //     alert("차량번호를 입력하세요.");
    //     return
    //   }
    //   // 차량번호 형식 체크
    //   if(!this.validationCarRegNo(this.carRegNo)){
    //     alert("차량번호 형식이 올바르지 않습니다.");
    //     return;
    //   }
      
    //   // 등록정보, 검사정보 조회
    //   this.resetData(); // 조회전 데이터 초기화
    //   this.loadingBsc = true;
    //   this.loadingAnls = false;

    //   try {
    //     const res = await vhclApi.vhclBscInfo(this.carRegNo);

    //     // 조회결과         
    //     this.vhclInfo = res.data.vhclInfo; // 등록정보
    //     this.inspInfoList = res.data.inspInfoList; // 검사정보

    //     // 분석DB로 넘겨줄 차량정보 값 셋팅
    //     const vhclInfoParam = this.vhclInfo;

    //     // 검사정보가 없는 경우 분석DB 조회, 차트 조회 제외
    //     if(!this.inspInfoList || this.inspInfoList.length === 0){
    //       this.isAnlsSkipped = true;
    //       this.metricCharts = [];
    //       return;
    //     }

    //     // 차트용
    //     this.fetchMetricCharts({
    //       vhrno: this.vhclInfo.vhrno,
    //       fuel: this.vhclInfo.fuel
    //     });

    //     this.vhclAnlsInfo(vhclInfoParam);   // 분석DB조회 및 API 호출

    //   } catch (error) {
    //     this.error = '차량 조회에 실패했습니다: ' + (error.message || '알 수 없는 오류')
    //     console.error('Error creating todo:', error)
    //     return;

    //   } finally {
    //     this.loadingBsc = false;

    //     this.$nextTick(() => {
    //       this.$refs.resultTop?.scrollIntoView({
    //         behavior: "smooth",
    //         block: "start"
    //       });
    //     });
    //   }

    // },
    // 미사용
    // async vhclAnlsInfo(vhclInfoParam) {
    //   this.isAnlsSkipped = false
    //   this.apiInfo = null
    //   this.loadingAnls = true

    //   try {
    //     const res = await vhclApi.vhclAnlsInfo(vhclInfoParam);
        
    //     this.apiInfo = res.data;
    //     this.systemMsg = res.data.systemMsg;
    //     this.userMsg = res.data.userMsg;

    //   } catch (e) {
    //     console.error(e);
    //     this.apiInfo = null;

    //   } finally {
    //     this.loadingAnls = false;
    //   }
    // },

    // 차트용
    async fetchMetricCharts(param) {
      try {
        const res = await vhclApi.vhclAnlsMetricDist(param);
        this.metricCharts = res.data.metricCharts || [];
        console.log(this.metricCharts);
      } catch (e) {
        console.error('차트 데이터 조회 실패', e);
        this.metricCharts = [];
      }
    },

    // !!API 호출 테스트 - 미사용
    async callApiTest(){
      this.anlsMsg = null;
      this.loadingAnls = true;

      try {
        const res = await vhclApi.callApiTest(this.systemMsg, this.userMsg);
        this.anlsMsg = res.data;

      } catch(e) {
        console.error(e);
      } finally {
        this.loadingAnls = false;
      }
    },
    // 차량번호 형식 정규식 검사 - 미사용
    validationCarRegNo(val){
        val = val.replace(/\s+/g, "");
        const pattern = /(^[0-9]{2,3}[가-힣]{1}[0-9]{4}$)|(^[가-힣]{2}[0-9]{1,2}[가-힣]{1}[0-9]{4}$)/;

        return pattern.test(val);
    },
    // 데이터 초기화
    resetData() {
      this.error = null;

      this.vhclInfo = null;
      this.inspInfoList = [];
      this.apiInfo = null;
      
      this.isAnlsSkipped = false;
      this.systemMsg = "";
      this.userMsg = "";

      this.anlsMsg = "";

      this.metricCharts = []
    }
  },
  computed: {
    inspSummary() {
      if (!this.inspInfoList || this.inspInfoList.length === 0) {
        return [];
      }

      return this.inspInfoList
        .map(item => {
          const year = item.smoChkExpDate
            ? item.smoChkExpDate.substring(0, 4)
            : "";

          return {
            year,
            mileage: item.carMile,

            asm: {
              co:   { val: item.unloadSmoVal1, lim: item.unloadSmoLim1 },
              hc:   { val: item.unloadSmoVal2, lim: item.unloadSmoLim2 },
              nox:  { val: item.unloadSmoVal3, lim: item.unloadSmoLim3 }
            },

            idle: {
              co:     { val: item.unloadSmoVal4, lim: item.unloadSmoLim4 },
              hc:     { val: item.unloadSmoVal5, lim: item.unloadSmoLim5 },
              lambda: { val: item.unloadSmoVal6 }
            }
          };
        })
        // ✅ 검사년도 오름차순 정렬
        .sort((a, b) => a.year.localeCompare(b.year));
    },

    // API 호출 결과(anlsRslt.apiRslt) -> markdown 변환
    renderedAnlsRslt() {
      if (!this.anlsRslt.apiRslt) return null;

      const render = (text) =>
        DOMPurify.sanitize(this.md.render(text || ''));

      return {
        ovrlEvl: render(this.anlsRslt.apiRslt.ovrlEvl),
        ovrlGrd: render(this.anlsRslt.apiRslt.ovrlGrd),
        expcChg: render(this.anlsRslt.apiRslt.expcChg),
        mntn: render(this.anlsRslt.apiRslt.mntn),
        emisAnls: render(this.anlsRslt.apiRslt.emisAnls),
        ageExpln: render(this.anlsRslt.apiRslt.ageExpln),
        graphExpln: render(this.anlsRslt.apiRslt.graphExpln),
        rmnVal: render(this.anlsRslt.apiRslt.rmnVal),
        notice: render(this.anlsRslt.apiRslt.notice)
      };
    }
  },

  watch: {
    // 검사방법 selectbox 선택에 따라 검사항목 값 초기화
    'vhclInput.inspectionMethod'(newVal) {
      if (!newVal) return;

      const activeFields =
        INSPECTION_FIELD_MAP[newVal] === 'ALL' ? null : INSPECTION_FIELD_MAP[newVal];
      
      Object.keys(this.vhclInput).forEach(key => {
        
        if (!key.includes('Value') && !key.includes('Limit')) {
          return;
        }
        // 기타/알 수 없음 -> 초기화 X
        if (!activeFields) return;

        // 새 검사방법에서 사용하지 않는 검사항목만 초기화
        if (!activeFields.includes(key)) {
          this.vhclInput[key] = '';
        }
      });
    }
  }
}
</script>


<style scoped>
/* ===============================
   기본 레이아웃
================================*/
.wrap {
  /* max-width: 1080px; */
  margin: 0 auto;
  /* padding-bottom: 60px; */
  width: 70%;
}

/* ===============================
   HERO 영역
================================*/
.hero {
  /* background: linear-gradient(to bottom, rgba(12,12,12,1) 50%, rgba(12,12,12,0.0) 100%); */
  color: #fff;
  padding: 40px 20px 80px;
  text-align: center;
  overflow: hidden;
}

.hero-inner {
  /* max-width: 900px; */
  margin: 0 auto;
}

.title {
  font-size: 38px;
  font-weight: 700;
  margin-bottom: 20px;
  letter-spacing: -0.5px;
  color: #333;
}

.flicker {
  animation: flicker 2.5s ease-out forwards;
}

@keyframes flicker {
  0% { opacity: 0; transform: translateY(20px); }
  15% { opacity: 1; transform: translateY(0); }
  40% { opacity: 0.9; }
  100% { opacity: 1; }
}

.subtitle {
  font-size: 17px;
  opacity: 0.85;
  margin-bottom: 40px;
  color: #333;
}

/* ===============================
   번호판 박스
================================*/
.plate-box {
  display: flex;
  gap: 10px;
  /*background: #141414;*/
  padding: 22px;
  border-radius: 14px;
  align-items: center;
  /*box-shadow: 0 0 40px rgba(0, 180, 255, 0.15);*/
  animation: glow 3s infinite alternate;
}

@keyframes glow {
  0% { box-shadow: 0 0 20px rgba(50, 150, 255, 0.1); }
  100% { box-shadow: 0 0 40px rgba(50, 150, 255, 0.25); }
}

.plate-input {
  flex: 1;
  padding: 18px;
  font-size: 20px;
  border-radius: 10px;
  border: 1px solid #ddd;
  background: #fff;
  transition: 0.25s ease;
}

.plate-input:focus {
  box-shadow: 0 0 10px rgba(70, 170, 255, 0.4);
  transform: scale(1.02);
}

.btn-search {
  background: #1e90ff;
  color: white;
  padding: 14px 28px;
  font-size: 18px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  transition: 0.2s;
}
.btn-search:hover {
  background: #1878d8;
}


/* ===============================
   페이드 애니메이션
================================*/
.fade-up {
  opacity: 0;
  transform: translateY(20px);
  animation: fadeUp 0.9s forwards;
}

.delay-1 { animation-delay: 0.3s; }
.delay-2 { animation-delay: 0.6s; }

@keyframes fadeUp {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ===============================
   결과 카드
================================*/
.result-container {
  margin-top: -40px;
  padding: 0 20px;
}

.info-card {
  background: #fff;
  padding: 30px 24px;
  border-radius: 16px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.08);
  margin-bottom: 32px;
  min-width: 0;
}

/* 제목 */
.section-title {
  font-size: 20px;
  font-weight: 700;
  margin-bottom: 22px;
  display: flex;
  align-items: center;
  gap: 12px;
}

.section-title .line {
  width: 4px;
  height: 20px;
  background: #1e90ff;
  border-radius: 4px;
}

/* ===============================
   차량 등록 정보 테이블
================================*/
.info-table {
  display: grid;
  grid-template-columns: 180px 1fr 180px 1fr;  /* 4열 구조 */
  row-gap: 10px;
  column-gap: 22px;
  padding: 8px 0 4px;
  border-top: 1px solid #e8eef4;
}

.info-table.grid-4 {
  display: grid;
  grid-template-columns: 180px 1fr 180px 1fr;  /* 4열 구조 */
  column-gap: 22px;
  row-gap: 14px;
  padding: 8px 0 4px;
}

.info-row {
  display: contents;
}

.info-key {
  font-weight: 600;
  color: #1b2638; /* 더 차분한 파란빛 그레이 */
  font-size: 15px;
  padding: 6px 0;
  align-items: center;
  border-bottom: 1px solid #f3f5f7;
}

.info-value {
  padding: 6px 0;
  align-items:center;
  border-bottom: 1px solid #f3f5f7;
}

/* 줄 사이를 구분하는 subtle hover 효과 */
/*.info-row:hover .info-key,
.info-row:hover .info-value {
  background: #f9fbff;
}*/

/* ===============================
   기타 정보
================================*/
.ai-report {
  white-space: pre-line;
  line-height: 1.6;
}

/* Placeholder */
.placeholder {
  padding: 40px 20px;
  text-align: center;
  color: #888;
  font-size: 17px;
}

/* 반응형 */
@media (max-width: 600px) {
  .title { font-size: 28px; }
  .plate-input { font-size: 16px; padding: 14px; }
  .info-table { grid-template-columns: 1fr; }
}

/* ===============================
   차량 검사 정보 스크롤 테이블
================================*/
.insp-scroll-wrapper {
  overflow-x: auto;
  overflow-y: auto;
  max-height: 280px;
  border: 1px solid #e5ecf3;
  border-radius: 10px;
}

/* 공통 테이블 */
.insp-table {
  display: grid;
  grid-template-columns: repeat(68, minmax(120px, max-content));
  min-width: max-content;
}

/* 테이블 헤더 */
.insp-table .th {
  background: #f1f6fc;
  font-weight: 700;
  position: sticky;
  top: 0;
  z-index: 2;
}

/* 테이블 셀 공통 */
.insp-table .cell {
  padding: 12px 10px;
  font-size: 14px;
  border-bottom: 1px solid #eef2f6;
  border-right: 1px solid #eef2f6;
  white-space: nowrap;
}

.insp-table .cell:last-child {
  border-right: none;
}

.insp-row {
  display: contents;
  grid-template-columns: repeat(68, minmax(120px, max-content));
}

.insp-row:hover .cell {
  background: #f5f9ff;
  transition: 0.15s;
}

.empty-msg {
  padding: 20px;
  text-align: center;
  color: #888;
  font-size: 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.apiText {
  width: 100%;
  resize: vertical;
  font-size: 15px;
  font-family: inherit;
  line-height: 1.5;
  border-radius: 6px;
  border: 1px solid #dcdcdc;
  background: #fff;
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

/* AI 분석 로딩 */
.spinner {
  width: 58px;
  height: 58px;
  border: 6px solid #ccc;
  border-top-color: #1e90ff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

.loading-anls {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  color: #555;
}

.loading-text {
  margin-top: 16px;
  font-size: 16px;
  font-weight: 500;
}

/* ===============================
   배출가스 분석 결과 테이블
================================*/
.emis-table {
  display: grid;
  grid-template-columns: 140px 180px 100px 160px 140px;
  width: fit-content;
  margin: 0 auto;
  padding-top: 10px
}

.emis-table .insp-row {
  display: contents;
}

.emis-table .cell {
  padding: 10px 8px;
  font-size: 14px;
  border-bottom: 1px solid #eef2f6;
  border-right: 1px solid #eef2f6;
}

.emis-table .cell:last-child {
  border-right: none;
}

.emis-table .th {
  background: #f1f6fc;
  font-weight: 700;
}
/* ===============================
   차량 검사 이력 요약 테이블
================================*/
.insp-summary-table {
  grid-template-columns:
    100px   /* 검사년도 */
    120px   /* 주행거리 */
    repeat(11, minmax(120px, max-content));
}

/* ===============================
   selectbox input
================================*/
/* 조회 패널 */
.search-panel {
  display: flex;
  align-items: flex-end;
  justify-content: center;
  flex-wrap: wrap;
  gap: 30px;
  padding: 22px;
  background: #fff;
  border-radius: 12px;
  margin-bottom: 28px;
  box-shadow: 0 4px 14px rgba(0,0,0,0.07);
}
.field {
  display: flex;
  flex-direction: column;
}
.field label {
  font-size: 14px;
  margin-bottom: 6px;
  color: #333;
}
.field input,
.field select {
  padding: 10px 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
}
  
/* .btn-search {
  padding: 8px 26px;
  background: #1e90ff;
  border: none;
  color: #fff;
  border-radius: 10px;
  font-size: 16px;
  cursor: pointer;
}
.btn-search:hover {
  background: #1878d8;
} */

/* ===============================
   차량정보&검사정보 입력 input
================================*/
.input-panel {
  margin-top: 28px;
  color: #333;
}

.input-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 10px;
}

.input-table th,
.input-table td {
  border: 1px solid #e5ecf3;
  padding: 10px;
  font-size: 14px;
  text-align: center;
}

.input-table th {
  background: #f1f6fc;
  font-weight: 700;
}

.input-table input, select {
  width: 90%;
  padding: 6px 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 13px;
}

.required {
  color: #d93025;
}

/* 검사항목 readonly */
input[readonly],
input.disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
}

/* ===============================
   API 호출 결과 출력용
================================*/
.ai-md :deep(h1) {
  font-size: 20px;
  font-weight: 600;
  margin: 12px 0 6px;
  color: #1a73e8; /* 강조 색상 추가 */
}

.ai-md :deep(h2), 
.ai-md :deep(h3) {
  font-size: 18px;
  font-weight: 600;
  margin: 15px 0 8px;
}

.ai-md :deep(p) {
  margin: 10px 0;
  line-height: 1.7;
}

.ai-md :deep(ul) {
  margin: 14px 0;
  padding-left: 0;
  list-style: none;
}

.ai-md :deep(li) {
  position: relative;
  padding-left: 20px;
  margin-bottom: 8px;
}

.ai-md :deep(li::before) {
  content: "•";
  position: absolute;
  left: 0;
  top: 0;
  color: #1e90ff;
  font-size: 14px;
}

/* 표 스타일 수정 */
.ai-md :deep(table) {
  border-collapse: separate;
  border-spacing: 0;
  width: 100%;
  margin: 18px 0;
  font-size: 14px;
  border: 1px solid #e5ecf3;
  border-radius: 8px;
  overflow: hidden;
}

.ai-md :deep(th) {
  background: #f1f6fc;
  font-weight: 700;
  padding: 10px;
  border-bottom: 1px solid #e5ecf3;
  border-right: 1px solid #e5ecf3;
}

.ai-md :deep(td) {
  padding: 10px;
  border-bottom: 1px solid #e5ecf3;
  border-right: 1px solid #e5ecf3;
}

/* 마지막 열/행의 보더 제거 */
.ai-md :deep(th:last-child), 
.ai-md :deep(td:last-child) {
  border-right: none;
}

.ai-md :deep(tr:last-child td) {
  border-bottom: none;
}

.ai-md :deep(strong) {
  color: #d93025;
  font-weight: 700;
}

/* ===============================
   부가정보 출력
================================*/
.extra-list {
  list-style: none;
  padding: 0;
  margin-top: 16px;
}

.extra-item {
 padding: 5px 0;
}

.extra-title {
  font-weight: 600;
  margin-bottom: 6px;
  font-size: 18px;
}

.extra-item p {
  margin: 4px 20px;
  line-height: 1.4;
}

.safe {
  color: #2e7d32;
}

.danger {
  color: #c62828;
}
</style>
