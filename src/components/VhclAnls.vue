<template>
  <div class="wrap" ref="resultTop">

    <!-- Hero 영역 -->
    <section class="hero">
      <div class="hero-inner">
        <h1 class="title flicker">
          내 차, 객관적으로 평가해볼까?
        </h1>

        <p class="subtitle fade-up delay-1">
          차량번호만 입력하면 등록 정보 및 검사 정보와 AI 분석을 바로 보여드립니다.
        </p>

        <!-- 검색창 + 최근 검색 드롭다운 -->
        <div class="search-wrapper">
            <div class="plate-box fade-up delay-2">
                <input
                    v-model="carRegNo"
                    type="text"
                    placeholder="예: 12가 3456"
                    class="plate-input"
                    @keyup.enter="vhclBscInfo"
                    @focus="onInputFocus"
                    @blur="onInputBlur"
                />
                <button class="btn-search" @click="vhclBscInfo">조회</button>
            </div>
        
            <!-- 최근 검색 드롭다운 -->
            <div class="recent-dropdown" v-if="showRecent && recentList.length > 0">
                <div class="recent-header">
                    <span class="recent-title">최근 검색</span>
                    <button class="recent-clear" @click="onRecentClear">전체 삭제</button>
                </div>
                <ul class="recent-list">
                    <li
                        class="recent-item"
                        v-for="vhrno in recentList"
                        :key="vhrno"
                    >
                        <span class="recent-icon">🕐</span>
                        <span class="recent-vhrno" @click="onRecentClick(vhrno)">{{ vhrno }}</span>
                        <button class="recent-remove" @click.stop="onRecentRemove(vhrno)">✕</button>
                    </li>
                </ul>
            </div>
        </div>
      </div>
    </section>

    <!-- 로딩(기본정보 조회) -->
    <div v-if="loadingBsc" class="loading fade-up">
      차량 정보를 조회 중입니다...
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 결과 영역 -->
    <div v-if="!loadingBsc && (vhclInfo !== null || inspInfoList.length > 0 || isAnlsSkipped)" class="result-container fade-up delay-1">

      <!-- 차량 등록 정보 -->
      <div class="info-card">
        <div class="section-title-wrap">
          <div class="section-title">
              <span class="line"></span>
              차량 등록 정보
          </div>
          <button
              class="btn-favorite"
              v-if="vhclInfo !== null"
              @click="toggleFavorite"
              :class="{ active: favoriteFlag }"
          >
              {{ favoriteFlag ? '★ 즐겨찾기 해제' : '☆ 즐겨찾기 추가' }}
          </button>
      </div>

        <div v-if="vhclInfo !== null">
          <div class="info-table">
            <div class="info-row">
              <div class="info-key">차량관리번호</div>
              <div class="info-value">{{ vhclInfo.vhmno }}</div>
              <div class="info-key">차량번호</div>
              <div class="info-value">{{ vhclInfo.vhrno }}</div>
              <div class="info-key">본거지 법정동 코드</div>
              <div class="info-value">{{ vhclInfo.bsplLedoCd }}</div>
              <div class="info-key">소유자 구분</div>
              <div class="info-value">{{ vhclInfo.ownrSe }}</div>
              <div class="info-key">차종(등록정보)</div>
              <div class="info-value">{{ vhclInfo.vhcty }}</div>
              <div class="info-key">용도</div>
              <div class="info-value">{{ vhclInfo.purps }}</div>
              <div class="info-key">차대번호</div>
              <div class="info-value">{{ vhclInfo.vin }}</div>
              <div class="info-key">최초 등록 일자</div>
              <div class="info-value">{{ vhclInfo.fstRegDe }}</div>
              <div class="info-key">차량 연식</div>
              <div class="info-value">{{ vhclInfo.vhclYridnw }}</div>
              <div class="info-key">차량 제작 일자</div>
              <div class="info-value">{{ vhclInfo.vhclMnfctDe }}</div>
              <div class="info-key">배출가스 검사 유효 일자</div>
              <div class="info-value">{{ vhclInfo.emisInspEfctDe }}</div>
              <div class="info-key">제원관리번호</div>
              <div class="info-value">{{ vhclInfo.srcmnno }}</div>
              <div class="info-key">배출가스인증번호</div>
              <div class="info-value">{{ vhclInfo.emisCrtcno }}</div>
              <div class="info-key">배출가스등급</div>
              <div class="info-value">{{ vhclInfo.emisGrd }}</div>
              <div class="info-key">저공해조치 여부</div>
              <div class="info-value">{{ vhclInfo.lemYn }}</div>
              <div class="info-key">저공해조치 종류</div>
              <div class="info-value">{{ vhclInfo.lemKnd }}</div>
              <div class="info-key">차량 말소 여부</div>
              <div class="info-value">{{ vhclInfo.vhclErsrYn }}</div>
              <div class="info-key">취득일자</div>
              <div class="info-value">{{ vhclInfo.acqsDe }}</div>
              <div class="info-key">취득금액</div>
              <div class="info-value">{{ vhclInfo.acqsAmt }}</div>
              <div class="info-key">차명</div>
              <div class="info-value">{{ vhclInfo.vhcnm }}</div>
              <div class="info-key">차종(제원정보)</div>
              <div class="info-value">{{ vhclInfo.vhctyOg }}</div>
              <div class="info-key">차종 분류</div>
              <div class="info-value">{{ vhclInfo.vhctyCl }}</div>
              <div class="info-key">차종 유형</div>
              <div class="info-value">{{ vhclInfo.vhctyTy }}</div>
              <div class="info-key">자동차 형식</div>
              <div class="info-value">{{ vhclInfo.carFrm }}</div>
              <div class="info-key">제작사명</div>
              <div class="info-value">{{ vhclInfo.mkrNm }}</div>
              <div class="info-key">연료</div>
              <div class="info-value">{{ vhclInfo.fuel }}</div>
              <div class="info-key">엔진형식</div>
              <div class="info-value">{{ vhclInfo.eginty }}</div>
              <div class="info-key">총중량</div>
              <div class="info-value">{{ vhclInfo.totWght }}</div>
              <div class="info-key">적재 중량</div>
              <div class="info-value">{{ vhclInfo.cryngWght }}</div>
              <div class="info-key">엔진출력</div>
              <div class="info-value">{{ vhclInfo.eginpwr }}</div>
              <div class="info-key">배기량</div>
              <div class="info-value">{{ vhclInfo.dsplvl }}</div>
              <div class="info-key">승차 인원</div>
              <div class="info-value">{{ vhclInfo.tkcarNmpr }}</div>
              <div class="info-key">차량 길이</div>
              <div class="info-value">{{ vhclInfo.vhclLt }}</div>
              <div class="info-key">차량 너비</div>
              <div class="info-value">{{ vhclInfo.vhclWh }}</div>
              <div class="info-key">차량 높이</div>
              <div class="info-value">{{ vhclInfo.vhclHg }}</div>
              <div class="info-key">원산지명</div>
              <div class="info-value">{{ vhclInfo.plorNm }}</div>
              <div class="info-key">삭제 여부</div>
              <div class="info-value">{{ vhclInfo.deleYn }}</div>
              <div class="info-key">승인 일자</div>
              <div class="info-value">{{ vhclInfo.cnfrmDe }}</div>
              <div class="info-key">구동 형식</div>
              <div class="info-value">{{ vhclInfo.drvFrm }}</div>
              <div class="info-key">변속기 종류</div>
              <div class="info-value">{{ vhclInfo.gearboxKnd }}</div>
            </div>
          </div>
        </div>

        <!-- 차량 등록정보 조회 결과 없음 -->
        <div v-if="vhclInfo == null" class="empty-msg">
          차량 등록 정보를 찾을 수 없습니다.
        </div>
      </div>

      <!-- 차량 검사 정보 -->
      <div class="info-card">
        <div class="section-title">
          <span class="line"></span>
          차량 검사 정보
        </div>

        <div v-if="inspInfoList.length > 0">
          <!-- 스크롤 영역 -->
          <div class="insp-scroll-wrapper">

            <div class="insp-table">
              <!-- 테이블 헤더 -->
              <div class="cell th">정밀검사소명</div>
              <div class="cell th">정밀검사일자</div>
              <div class="cell th">정밀검사종류</div>
              <div class="cell th">정밀검사접수번호</div>
              <div class="cell th">차량번호</div>
              <div class="cell th">차대번호</div>
              <div class="cell th">차량형식번호</div>
              <div class="cell th">차명</div>
              <div class="cell th">차종</div>
              <div class="cell th">차량용도</div>
              <div class="cell th">차량연식</div>
              <div class="cell th">차량연료</div>
              <div class="cell th">주행거리</div>
              <div class="cell th">차량길이</div>
              <div class="cell th">차량너비</div>
              <div class="cell th">차량높이</div>
              <div class="cell th">엔진형식</div>
              <div class="cell th">원동기배기량</div>
              <div class="cell th">엔진출력</div>
              <div class="cell th">차량중량</div>
              <div class="cell th">총중량</div>
              <div class="cell th">정원</div>
              <div class="cell th">비고</div>
              <div class="cell th">최초등록일</div>
              <div class="cell th">정밀검사유효기간</div>
              <div class="cell th">관능검사판정</div>
              <div class="cell th">관능검사부적합내용</div>
              <div class="cell th">정밀검사측정방법</div>
              <div class="cell th">무부하매연측정치1</div>
              <div class="cell th">무부하매연허용치1</div>
              <div class="cell th">무부하매연판정1</div>
              <div class="cell th">무부하매연측정치2</div>
              <div class="cell th">무부하매연허용치2</div>
              <div class="cell th">무부하매연판정2</div>
              <div class="cell th">무부하매연측정치3</div>
              <div class="cell th">무부하매연허용치3</div>
              <div class="cell th">무부하매연판정3</div>
              <div class="cell th">무부하매연측정치4</div>
              <div class="cell th">무부하매연허용치4</div>
              <div class="cell th">무부하매연판정4</div>
              <div class="cell th">무부하매연측정치5</div>
              <div class="cell th">무부하매연허용치5</div>
              <div class="cell th">무부하매연판정5</div>
              <div class="cell th">무부하매연측정치6</div>
              <div class="cell th">무부하매연허용치6</div>
              <div class="cell th">무부하매연판정6</div>
              <div class="cell th">이산화탄소값</div>
              <div class="cell th">최대출력허용치</div>
              <div class="cell th">최대출력측정값</div>
              <div class="cell th">산소값</div>
              <div class="cell th">공기온도</div>
              <div class="cell th">공기압력</div>
              <div class="cell th">정밀검사판정</div>
              <div class="cell th">재검사기간</div>
              <div class="cell th">정밀검사유효기간2</div>
              <div class="cell th">관능검사등록자</div>
              <div class="cell th">정밀검사등록자</div>
              <div class="cell th">정밀검사소대표명</div>
              <div class="cell th">기타내용1</div>
              <div class="cell th">기타내용2</div>
              <div class="cell th">기타내용3</div>
              <div class="cell th">기타내용4</div>
              <div class="cell th">기타내용5</div>
              <div class="cell th">원본대장테이블</div>
              <div class="cell th">정밀검사시간정보</div>
              <div class="cell th">통합접수번호</div>
              <div class="cell th">데이터생성일자</div>
              <div class="cell th">제작등록일자</div>

              <!-- 테이블 바디 -->
              <div
                v-for="(item, idx) in inspInfoList"
                :key="idx"
                class="insp-row"
              >
                <div class="cell">{{ item.smoChkOrgNm }}</div>
                <div class="cell">{{ item.smoChkDate }}</div>
                <div class="cell">{{ item.smoChkType }}</div>
                <div class="cell">{{ item.smoChkRegNo }}</div>
                <div class="cell">{{ item.carRegNo }}</div>
                <div class="cell">{{ item.carSerNo }}</div>
                <div class="cell">{{ item.carSpecRegNo }}</div>
                <div class="cell">{{ item.carNm }}</div>
                <div class="cell">{{ item.carTypeNm }}</div>
                <div class="cell">{{ item.carUsage }}</div>
                <div class="cell">{{ item.carYear }}</div>
                <div class="cell">{{ item.carFuelNm }}</div>
                <div class="cell">{{ item.carMile }}</div>
                <div class="cell">{{ item.carLength }}</div>
                <div class="cell">{{ item.carWidth }}</div>
                <div class="cell">{{ item.carHeight }}</div>
                <div class="cell">{{ item.engineType }}</div>
                <div class="cell">{{ item.engineCapacity }}</div>
                <div class="cell">{{ item.enginePower }}</div>
                <div class="cell">{{ item.carWeight }}</div>
                <div class="cell">{{ item.totWeight }}</div>
                <div class="cell">{{ item.carPassenger }}</div>
                <div class="cell">{{ item.cont }}</div>
                <div class="cell">{{ item.firstRegDate }}</div>
                <div class="cell">{{ item.smoChkExpDate }}</div>
                <div class="cell">{{ item.smoFunChkJudgeYn }}</div>
                <div class="cell">{{ item.smoFunChkFailItem }}</div>
                <div class="cell">{{ item.smoChkMethod }}</div>
                <div class="cell">{{ item.unloadSmoVal1 }}</div>
                <div class="cell">{{ item.unloadSmoLim1 }}</div>
                <div class="cell">{{ item.unloadSmoJudge1 }}</div>
                <div class="cell">{{ item.unloadSmoVal2 }}</div>
                <div class="cell">{{ item.unloadSmoLim2 }}</div>
                <div class="cell">{{ item.unloadSmoJudge2 }}</div>
                <div class="cell">{{ item.unloadSmoVal3 }}</div>
                <div class="cell">{{ item.unloadSmoLim3 }}</div>
                <div class="cell">{{ item.unloadSmoJudge3 }}</div>
                <div class="cell">{{ item.unloadSmoVal4 }}</div>
                <div class="cell">{{ item.unloadSmoLim4 }}</div>
                <div class="cell">{{ item.unloadSmoJudge4 }}</div>
                <div class="cell">{{ item.unloadSmoVal5 }}</div>
                <div class="cell">{{ item.unloadSmoLim5 }}</div>
                <div class="cell">{{ item.unloadSmoJudge5 }}</div>
                <div class="cell">{{ item.unloadSmoVal6 }}</div>
                <div class="cell">{{ item.unloadSmoLim6 }}</div>
                <div class="cell">{{ item.unloadSmoJudge6 }}</div>
                <div class="cell">{{ item.co2Val }}</div>
                <div class="cell">{{ item.engineTorLim }}</div>
                <div class="cell">{{ item.engineTorVal }}</div>
                <div class="cell">{{ item.o2Val }}</div>
                <div class="cell">{{ item.airTemperature }}</div>
                <div class="cell">{{ item.airPressure }}</div>
                <div class="cell">{{ item.smoChkJudgeYn }}</div>
                <div class="cell">{{ item.reInsDate2 }}</div>
                <div class="cell">{{ item.smoChkExpDate2 }}</div>
                <div class="cell">{{ item.smoFunChkRecNm }}</div>
                <div class="cell">{{ item.smoChkRecNm }}</div>
                <div class="cell">{{ item.smoChkOrgOwnerNm }}</div>
                <div class="cell">{{ item.etcCont1 }}</div>
                <div class="cell">{{ item.etcCont2 }}</div>
                <div class="cell">{{ item.etcCont3 }}</div>
                <div class="cell">{{ item.etcCont4 }}</div>
                <div class="cell">{{ item.etcCont5 }}</div>
                <div class="cell">{{ item.srcTbl }}</div>
                <div class="cell">{{ item.smoClockInfo }}</div>
                <div class="cell">{{ item.cmbSmoChkRegNo }}</div>
                <div class="cell">{{ item.jobDate }}</div>
                <div class="cell">{{ item.makeRegDate }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 차량 검사정보 조회 결과 없음 -->
        <div v-if="inspInfoList.length === 0" class="empty-msg">
          등록된 차량 검사 정보가 없습니다.
        </div>
      </div>

      <!-- 검사 데이터 -->
      <div class="info-card" v-if="inspSummary.length > 0">
        <div class="section-title">
          <span class="line"></span>
          차량 검사 이력 요약
        </div>

        <div class="insp-scroll-wrapper">
          <div class="insp-table insp-summary-table">

            <!-- 헤더 -->
            <div class="cell th">검사년도</div>
            <div class="cell th">주행거리</div>

            <div class="cell th">ASM CO 값</div>
            <div class="cell th">ASM CO 기준</div>
            <div class="cell th">ASM HC 값</div>
            <div class="cell th">ASM HC 기준</div>
            <div class="cell th">ASM NOX 값</div>
            <div class="cell th">ASM NOX 기준</div>

            <div class="cell th">IDLE CO 값</div>
            <div class="cell th">IDLE CO 기준</div>
            <div class="cell th">IDLE HC 값</div>
            <div class="cell th">IDLE HC 기준</div>

            <div class="cell th">람다 값</div>

            <!-- 바디 -->
            <div
              v-for="(row, idx) in inspSummary"
              :key="idx"
              class="insp-row"
            >
              <div class="cell">{{ row.year }}</div>
              <div class="cell">{{ row.mileage }}</div>

              <div class="cell">{{ row.asm.co.val }}</div>
              <div class="cell">{{ row.asm.co.lim }}</div>
              <div class="cell">{{ row.asm.hc.val }}</div>
              <div class="cell">{{ row.asm.hc.lim }}</div>
              <div class="cell">{{ row.asm.nox.val }}</div>
              <div class="cell">{{ row.asm.nox.lim }}</div>

              <div class="cell">{{ row.idle.co.val }}</div>
              <div class="cell">{{ row.idle.co.lim }}</div>
              <div class="cell">{{ row.idle.hc.val }}</div>
              <div class="cell">{{ row.idle.hc.lim }}</div>

              <div class="cell">{{ row.idle.lambda.val }}</div>
            </div>

          </div>
        </div>
      </div>

      <div class="info-card" v-if="metricCharts.length > 0">
        <div class="section-title">
          <span class="line"></span>
          차트
        </div>
        <MetricBarChart
          v-for="item in metricCharts"
          :key="item.metric"
          :metricData="item"
        />
      </div>

      <!-- AI 리포트 -->
      <div class="info-card">
        <div class="section-title">
          <span class="line"></span>
          AI 차량 분석 리포트
        </div>

        <!-- 차량 분석조회 로딩 -->
        <div v-if="loadingAnls" class="loading-anls">
          <div class="spinner"></div>
          <p class="loading-text">AI가 차량 상태를 분석 중입니다...</p>
        </div>  

        <!-- 분석 미수행(검사결과 없음) -->
        <div v-else-if="isAnlsSkipped" class="empty-msg">
          검사정보가 없어 AI 차량분석을 수행할 수 없습니다.
        </div>

        <div v-else-if="apiInfo != null && apiInfo.userMsg">
        <!-- <div v-else-if="apiInfo && apiInfo.anlsMsg"> -->
          <textarea class="apiText" v-model="systemMsg" rows="10"></textarea>
          <textarea class="apiText" v-model="userMsg" rows="6"></textarea>

          <div class="btn-api-wrap">
            <button class="btn-api" @click="callApiTest">
            API 호출
            </button>
          </div>

          <!-- API 호출 결과 (최종 분석) -->
          <div v-if="anlsMsg !== ''" class="ai-result" style="white-space: pre-wrap; line-height: 1.6;margin-top:20px">
            <!-- <div class="info-key" style="font-size:18px">· AI 분석결과</div>
            {{ anlsMsg }} -->
            <div v-html="toHtml(anlsMsg.ovrlEvl)"></div>
            <div v-html="toHtml(anlsMsg.ovrlGrd)"></div>
            <div v-html="toHtml(anlsMsg.expcChg)"></div>
            <div v-html="toHtml(anlsMsg.mntn)"></div>
            <div v-html="toHtml(anlsMsg.emisAnls)"></div>
            <div v-html="toHtml(anlsMsg.ageExpln)"></div>
            <RadarChart :graphExpln="anlsMsg.graphExpln" />
            <div v-html="toHtml(anlsMsg.graphExpln)"></div>
            <div v-html="toHtml(anlsMsg.rmnVal)"></div>
            <div style="margin-top:70px;font-weight:bold;text-align:center">*** {{ anlsMsg.notice }} ***</div>
          </div>
        </div>
        
        <div v-else-if="apiInfo != null && !apiInfo.userMsg" class="empty-msg">
          현재 AI 분석 미지원 연료 차량입니다.
        </div>

        <!-- 분석 결과 없음 -->
        <div v-else class="empty-msg">
          API 분석 결과가 없습니다.
        </div>
      </div>
    </div>

    <!-- 조회 전 안내 -->
    <div v-if="!loadingBsc && vhclInfo === null && inspInfoList.length === 0 && !isAnlsSkipped" class="placeholder fade-up delay-1">
      차량번호를 입력하면 차량 등록 정보 및 검사 정보와 AI 분석 내용을 확인할 수 있습니다.
    </div>

  </div>
</template>



<script>
import vhclApi from '../services/vhclApi'
import MetricBarChart from '@/components/charts/MetricBarChart.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import storageUtil from '../services/storageUtil'
import { marked } from 'marked'

// marked 옵션 설정 (표 지원 활성화)
marked.setOptions({
    breaks: true,    // \n을 <br>로 자동 변환
    gfm: true        // GitHub Flavored Markdown 활성화 (표 지원 포함)
})

export default {
  name: "VhclAnls",
  components: {
    MetricBarChart,
    RadarChart
  },
  data() {
    return {
      carRegNo: "",
      loadingBsc: false,  // 로딩 - 등록정보, 검사정보
      loadingAnls: false,   // 로딩 - 분석(API)
      isAnlsSkipped: false, // 차량분석 여부 (검사정보가 없으면 분석 수행 안함)
      error: null,

      // 데이터 (!!변수 정리 필요)
      vhclInfo: null,     // 차량 등록정보
      inspInfoList: [],   // 차량 검사정보 (리스트)
      apiInfo: null,      // GPT 결과
      anlsMsg: "",        // GPT 분석 결과

      // !!API 호출 전 호출메시지 확인용
      systemMsg: "",      // GPT 결과 - 시스템 메시지
      userMsg: "",        // GPT 결과 - 사용자 메시지

      // 차트용
      metricCharts: [],

      // 최근 검색, 즐겨찾기
      recentList: [],         // 최근 검색 목록
      showRecent: false,      // 최근 검색 드롭다운 표시 여부
      favoriteFlag: false,    // 현재 조회 차량 즐겨찾기 여부
    }
  },

  watch: {
    '$route.query.vhrno': function(newVhrno, oldVhrno) {
        // 차량번호 값이 바뀔 때만 실행 (같은 값이면 무시)
        if (newVhrno && newVhrno !== oldVhrno) {
            this.carRegNo = newVhrno
            this.vhclBscInfo()
        }
    }
  },

  mounted() {
    const vhrno = this.$route.query.vhrno;

    if (vhrno) {
      this.carRegNo = vhrno;
      this.$nextTick(() => {
        this.vhclBscInfo();
      });
    }
  },

  methods: {
    async vhclBscInfo() {
      if (!this.carRegNo.trim()) {
        alert("차량번호를 입력하세요.");
        return
      }
      // 차량번호 형식 체크
      if(!this.validationCarRegNo(this.carRegNo)){
        alert("차량번호 형식이 올바르지 않습니다.");
        return;
      }
      
      // 등록정보, 검사정보 조회
      this.resetData(); // 조회전 데이터 초기화
      this.loadingBsc = true;
      this.loadingAnls = false;

      try {
        const res = await vhclApi.vhclBscInfo(this.carRegNo);

        storageUtil.addRecent(this.carRegNo.replace(/\s+/g, ''))  // 최근 검색 저장

        // 조회결과         
        this.vhclInfo = res.data.vhclInfo; // 등록정보
        this.inspInfoList = res.data.inspInfoList; // 검사정보

        this.checkFavorite()  // 즐겨찾기 여부 체크

        // 분석DB로 넘겨줄 차량정보 값 셋팅
        const vhclInfoParam = this.vhclInfo;

        // 검사정보가 없는 경우 분석DB 조회, 차트 조회 제외
        if(!this.inspInfoList || this.inspInfoList.length === 0){
          this.isAnlsSkipped = true;
          this.metricCharts = [];
          return;
        }

        // 차트용
        this.fetchMetricCharts({
          vhrno: this.vhclInfo.vhrno,
          fuel: this.vhclInfo.fuel
        });

        this.vhclAnlsInfo(vhclInfoParam);   // 분석DB조회 및 API 호출

      } catch (error) {
        this.error = '차량 조회에 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error creating todo:', error)
        return;

      } finally {
        this.loadingBsc = false;

        this.$nextTick(() => {
          this.$refs.resultTop?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      }
    },
    async vhclAnlsInfo(vhclInfoParam) {
      this.isAnlsSkipped = false
      this.apiInfo = null
      this.loadingAnls = true

      try {
        const res = await vhclApi.vhclAnlsInfo(vhclInfoParam);
        
        this.apiInfo = res.data;
        this.systemMsg = res.data.systemMsg;
        this.userMsg = res.data.userMsg;

      } catch (e) {
        console.error(e);
        this.apiInfo = null;
      } finally {
        this.loadingAnls = false;
      }
    },

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

    // !!API 호출 테스트 - 추후 변경
    async callApiTest(){
      this.anlsMsg = null;
      this.loadingAnls = true;

      try {
        const res = await vhclApi.callApiTest(this.systemMsg, this.userMsg);
        this.anlsMsg = res.data;

        //@@테스트용 결과
        // this.anlsMsg = {
        //   emisAnls: "이번 분석은 아반떼(AVANTE) 차량의 배출가스를 분석하였습니다.\n\n- **부하 검사(ASM)**:\n  - ASM CO: 0.52 (기준: 0.52) → 기준에 적합\n  - ASM HC: 42.00 (기준: 42.00) → 기준에 적합\n  - ASM NOx: 690.00 (기준: 690.00) → 기준에 적합\n\n- **무부하 검사(IDLE)**:\n  - IDLE CO: 1.00 (기준: 1.00) → 기준에 적합\n  - IDLE HC: 120.00 (기준: 120.00) → 기준에 적합\n\n- 차량의 배출가스 수치는 기준값에 부합하므로, 배출가스 기준에서 합격한 상태입니다.",
        //   ageEstmt: "이번 차량의 실질연식을 배출가스 검사 결과에 기반하여 분석하였습니다.\n\n- **배출가스 기반 실질연식**:\n  - ASM CO: r = (0.52/0.52) × 100 → 100% (하위 그룹)\n  - ASM HC: r = (42/42) × 100 → 100% (하위 그룹)\n  - ASM NOx: r = (690/690) × 100 → 100% (하위 그룹)\n  - 평균적으로 실질연식 증가 경향이 있지만 완전히 적합한 상태입니다.\n\n- **주행거리 기반 산정**:\n  - 예상 주행거리 = 20,000 km × 16년 = 320,000 km\n  - 실제 주행거리 = 340,000 km → 연식손실 -1년\n\n- **운행차 연식지표**:\n  - 배출가스 기반 실질연식: 16년\n  - 주행거리 기반 실질연식: 17년 → 평균: 16.5년 = \n  - 실제 대비 '다소 노후' 상태입니다.",
        //   ovrlGrd: "이번 차량의 종합 품질등급은 B로 평가됩니다. \n\n- 허용 기준 50% 이하로 적당한 배출가스 수치를 기록하고 있으며,\n- 전반적으로 안정적인 상태로 판단됩니다.",
        //   mntn: "다음 항목에 대한 점검을 권장합니다.\n\n- 점화플러그 상태 점검\n- 흡기 및 스로틀바디 점검\n- 인젝터 상태 점검",
        //   rmnVal: "잔존가치는 주행거리와 연식 손실 등을 고려하여 다음과 같이 해석됩니다. \n\n- 기준가격이 명시되지 않았지만,\n- 중고차 시장에서 동급 대비 +5~10% 수준의 가격 형성이 예상됩니다.\n\n본 분석은 통계 기반 개념적 해석이며 실제 중고차 거래가격의 기준이 아닙니다.",
        //   notice: "본 분석은 통계 기반 개념적 해석이며, 법적 판정 또는 실제 중고차 거래가격의 직접 기준이 아닙니다."
        // };

        // this.anlsMsg = {
        //   emisAnls: {
        //     무부하: {
        //       "ASM CO": { 값: 0.0, "상대 위치": "상위", 비율: "0.00% 이하" },
        //       "ASM HC": { 값: 4.0, "상대 위치": "상위", 비율: "3.33% 이하" },
        //       "ASM NOX": { 값: 0.0, "상대 위치": "상위", 비율: "0.00% 이하" }
        //     },
        //     부하: {
        //       "IDLE CO": { 값: 0.0, "상대 위치": "상위", 비율: "0.00% 이하" },
        //       "IDLE HC": { 값: 0.0, "상대 위치": "상위", 비율: "0.00% 이하" }
        //     }
        //   },

        //   ageEstmt: {
        //     "배출가스 기반 실질연식": "7년",
        //     "주행거리 기반 실질연식": "3년",
        //     평균연식지표: "젊음"
        //   },

        //   ovrlGrd: {
        //     등급: "A",
        //     근거:
        //       "ASM과 IDLE 검사 결과가 모두 허용 기준보다 훨씬 우수하며, 연식이득이 있어 상대적으로 젊은 상태임."
        //   },

        //   mntn: "기본 관리(오일, 필터, 연료첨가제).",

        //   rmnVal: {
        //     기준가격: "base_price 가정 시 연식이득 +3년 → +10~15%",
        //     상대가격: "동급 대비 +5~10%"
        //   },

        //   notice:
        //     "본 분석은 통계 기반 개념적 해석이며, 법적 판정 또는 실제 중고차 거래가격의 직접 기준이 아닙니다."
        // };


      } catch(e) {
        console.error(e);
      } finally {
        this.loadingAnls = false;
      }
    },
    // 차량번호 형식 정규식 검사
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
    },

    // 최근 검색 목록 불러오기
    loadRecentList() {
        this.recentList = storageUtil.getRecentList()
    },
    
    // 최근 검색 드롭다운 열기
    onInputFocus() {
        this.loadRecentList()
        if (this.recentList.length > 0) {
            this.showRecent = true
        }
    },
    
    // 최근 검색 드롭다운 닫기 (입력창 포커스 아웃 시)
    onInputBlur() {
        setTimeout(() => {
            this.showRecent = false
        }, 200)
    },
    
    // 최근 검색 항목 클릭 -> 해당 차량번호로 조회
    onRecentClick(vhrno) {
        this.carRegNo = vhrno
        this.showRecent = false
        this.vhclBscInfo()
    },
    
    // 최근 검색 특정 항목 삭제
    onRecentRemove(vhrno) {
        storageUtil.removeRecent(vhrno)
        this.loadRecentList()
        if (this.recentList.length === 0) {
            this.showRecent = false
        }
    },
    
    // 최근 검색 전체 삭제
    onRecentClear() {
        storageUtil.clearRecent()
        this.recentList = []
        this.showRecent = false
    },
    
    // 즐겨찾기 토글 (추가/제거)
    toggleFavorite() {
        if (!this.vhclInfo) return
        const vhrno = this.vhclInfo.vhrno
        const vhcnm = this.vhclInfo.vhcnm
    
        if (this.favoriteFlag) {
            storageUtil.removeFavorite(vhrno)
            this.favoriteFlag = false
        } else {
            storageUtil.addFavorite(vhrno, vhcnm)
            this.favoriteFlag = true
        }
    },
    
    // 즐겨찾기 여부 체크 (조회 후 호출)
    checkFavorite() {
        if (!this.vhclInfo) return
        this.favoriteFlag = storageUtil.isFavorite(this.vhclInfo.vhrno)
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
    toHtml() {
      return function(text) {
          if (!text) return ''
          return marked(String(text))
      }
    }
  }
}
</script>


<style scoped>
@import '../assets/css/vhclAnls.css';

/* 검색창 래퍼 (드롭다운 기준점) */
.search-wrapper {
    position: relative;
    width: 100%;
    z-index: 10;
}
 
/* 최근 검색 드롭다운 */
.recent-dropdown {
    position: absolute;
    top: calc(100% + 4px);
    left: 22px;
    right: 22px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
    z-index: 1000;
    overflow: hidden;
}
 
.recent-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px 6px;
    border-bottom: 1px solid #f0f0f0;
}
 
.recent-title {
    font-size: 12px;
    font-weight: 600;
    color: #888;
}
 
.recent-clear {
    font-size: 12px;
    color: #bbb;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0;
}
 
.recent-clear:hover {
    color: #e05;
}
 
.recent-list {
    list-style: none;
    padding: 6px 0;
    margin: 0;
}
 
.recent-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 14px;
    cursor: pointer;
    transition: background 0.15s;
}
 
.recent-item:hover {
    background: #f5f9ff;
}
 
.recent-icon {
    font-size: 13px;
    color: #bbb;
}
 
.recent-vhrno {
    flex: 1;
    font-size: 15px;
    color: #333;
    font-weight: 500;
    letter-spacing: 1px;
}
 
.recent-remove {
    font-size: 11px;
    color: #ccc;
    background: none;
    border: none;
    cursor: pointer;
    padding: 2px 4px;
    border-radius: 4px;
    transition: 0.15s;
}
 
.recent-remove:hover {
    color: #e05;
    background: #fff0f0;
}
 
/* 즐겨찾기 버튼 */
.section-title-wrap {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
}
 
/* section-title 에서 margin-bottom 제거 (wrap이 대신 처리) */
.section-title-wrap .section-title {
    margin-bottom: 0;
}
 
.btn-favorite {
    padding: 6px 14px;
    font-size: 13px;
    border-radius: 20px;
    border: 1px solid #ddd;
    background: #fff;
    color: #aaa;
    cursor: pointer;
    transition: 0.2s;
    font-weight: 500;
}
 
.btn-favorite:hover {
    border-color: #f5a623;
    color: #f5a623;
}
 
.btn-favorite.active {
    background: #fff8e7;
    border-color: #f5a623;
    color: #f5a623;
}

/* marked 마크다운 렌더링 스타일 */
:deep(table) {
    border-collapse: collapse;
    width: 100%;
    margin: 12px 0;
    font-size: 14px;
}
:deep(th), :deep(td) {
    border: 1px solid #ddd;
    padding: 8px 12px;
    text-align: left;
}
:deep(th) {
    background: #f1f6fc;
    font-weight: 600;
}
:deep(tr:hover) {
    background: #f9fbff;
}
:deep(strong) {
    font-weight: 700;
    color: #1b2638;
}
:deep(p) {
    margin: 6px 0;
    line-height: 1.7;
}
</style>
