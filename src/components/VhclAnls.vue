<template ref="resultTop">
  <div class="wrap">

    <!-- Hero 영역 -->
    <section class="hero">
      <div class="hero-inner fade-up">

        <h1 class="title flicker">
          내 차, 객관적으로 평가해볼까?
        </h1>

        <p class="subtitle fade-up delay-1">
          차량번호만 입력하면 등록 정보 및 검사 정보와 AI 분석을 바로 보여드립니다.
        </p>

        <div class="plate-box fade-up delay-2">
          <input
            v-model="carRegNo"
            type="text"
            placeholder="예: 12가 3456"
            class="plate-input"
            @keyup.enter="anlsCarRegNo"
          />
          <button class="btn-search" @click="anlsCarRegNo">조회</button>
        </div>
      </div>
    </section>

    <!-- 로딩 -->
    <div v-if="loading" class="loading fade-up">
      조회 중입니다...
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- 결과 영역 -->
    <div v-if="result" class="result-container fade-up delay-1">

      <!-- 차량 등록 정보 -->
      <div class="info-card">
        <div class="section-title">
          <span class="line"></span>
          차량 등록 정보
        </div>

        <div v-if="vhclInfo != null">
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

        <!-- 조회 결과 없음 -->
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

        <!-- 조회 결과 없음 -->
        <div v-if="inspInfoList.length === 0" class="empty-msg">
          등록된 차량 검사 정보가 없습니다.
        </div>
      </div>

      <!-- AI 리포트 -->
      <div class="info-card">
        <div class="section-title">
          <span class="line"></span>
          AI 차량 분석 리포트
        </div>

        <div v-if="apiInfo && Object.keys(apiInfo).length > 0">
          <textarea
            class="apiText"
            v-model="systemMsg"
            rows="10"
            readonly
          ></textarea>

          <textarea
            class="apiText"
            v-model="userMsg"
            rows="6"
            readonly
          ></textarea>
          
          <div class="btn-api-wrap">
            <button class="btn-api" @click="callApiTest">
            API 호출
            </button>
          </div>

          <!-- !!API 호출 결과 (추후 사용) -->
          <!-- <p class="ai-report">
            {{ apiInfo }}
          </p> -->
        </div>
         
        <!-- 분석 결과 없음 -->
        <div v-if="!apiInfo || Object.keys(apiInfo).length === 0" class="empty-msg">
          API 분석 결과가 없습니다.
        </div>
      </div>
    </div>

    <!-- 조회 전 안내 -->
    <div v-if="!result && !loading" class="placeholder fade-up delay-1">
      차량번호를 입력하면 차량 등록 정보 및 검사 정보와 AI 분석 내용을 확인할 수 있습니다.
    </div>

  </div>
</template>



<script>
import vhclApi from '../services/vhclApi'

export default {
  name: "VhclAnls",
  data() {
    return {
      carRegNo: "",
      loading: false,
      result: null,
      error: null,

      vhclInfo: null,     // 차량 등록정보
      inspInfoList: [],   // 차량 검사정보 (리스트)
      apiInfo: {},        // GPT 결과

      // @@API 호출 전 호출메시지 확인용
      systemMsg: "",      // GPT 결과 - 시스템 메시지
      userMsg: "",        // GPT 결과 - 사용자 메시짖
    }
  },

  mounted() {
    const vhrno = this.$route.query.vhrno;

    if (vhrno) {
      this.carRegNo = vhrno;
      this.$nextTick(() => {
        this.anlsCarRegNo();
      });
    }
  },

  methods: {
    async anlsCarRegNo() {
      if (!this.carRegNo.trim()) {
        alert("차량번호를 입력하세요.");
        return
      }
      // 차량번호 형식 체크
      if(!this.validationCarRegNo(this.carRegNo)){
        alert("차량번호 형식이 올바르지 않습니다.");
        return;
      }
      
      this.loading = true;
      this.error = null;
      this.result = null;

      try {
        const response = await vhclApi.anlsCarRegNo(this.carRegNo);
        
        this.result = response.data;
        // 차량정보 조회 결과
        this.vhclInfo = response.data.vhclInfo;
        // 검사정보 조회 결과
        this.inspInfoList = response.data.inspInfoList;
        // API 호출 결과 (!!작업필요)
        this.apiInfo = response.data.apiInfo;

        //this.systemMsg = response.data.apiInfo.systemMsg ? JSON.stringify(response.data.apiInfo.systemMsg, null, 2) : "";
        this.systemMsg = response.data.apiInfo.systemMsg;
        this.userMsg = response.data.apiInfo.userMsg;

        //console.log("@@1: " + JSON.stringify(this.vhclInfo) + " / 2: " + JSON.stringify(this.inspInfoList) + " / 3: " + JSON.stringify(this.apiInfo));
        
      } catch (error) {
        this.error = '차량 조회에 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error creating todo:', error)

      } finally {
        this.loading = false;

        this.$nextTick(() => {
          this.$refs.resultTop.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        });
      }
    },
    // !!API 호출 테스트 - 추후 변경
    async callApiTest(){
      try {
        // systemMsg = this.systemMsg;
        // userMsg = this.userMsg;
      } catch(e) {
        console.error(e);
      }
    },
    // 차량번호 형식 정규식 검사
    validationCarRegNo(val){
        val = val.replace(/\s+/g, "");
        const pattern = /(^[0-9]{2,3}[가-힣]{1}[0-9]{4}$)|(^[가-힣]{2}[0-9]{1,2}[가-힣]{1}[0-9]{4}$)/;

        return pattern.test(val);
    }
  }
}
</script>


<style scoped>
/* ===============================
   기본 레이아웃
================================*/
.wrap {
  max-width: 1080px;
  margin: 0 auto;
  padding-bottom: 60px;
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
  max-width: 900px;
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

.btn-api-wrap {
  margin-top: 10px;
  text-align: right;
}

.btn-api {
  background: #1e90ff;
  color: #fff;
  padding: 8px 14px;
  font-size: 14px;
  border-radius: 8px;
  border: none;
  cursor: pointer;
  transition: 0.2s ease;
}
.btn-api:hover {
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

/* Loading */
.loading {
  text-align: center;
  padding: 40px;
  font-size: 18px;
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
</style>
