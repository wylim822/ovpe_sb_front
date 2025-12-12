<template>
  <div class="vhcl-srch-wrap">

    <main class="content">
      <h1 class="page-title">차량정보 DB조회</h1>

      <!-- 조회 패널 -->
      <section class="search-panel">
        <div class="field">
          <label>차명</label>
          <input type="text" v-model="filter.model" placeholder="예: 아반떼" />
        </div>

        <div class="field">
          <label>연료</label>
          <select v-model="filter.fuel">
            <option value="">전체</option>
            <option v-for="f in fuelTypes" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>

        <div class="field">
          <label>차량 연식</label>
          <select v-model="filter.year">
            <option value="">전체</option>
            <option v-for="y in yearList" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <button class="btn-search" @click="searchMainGrid" :disabled="loading">
          {{ loading ? "조회 중..." : "조회" }}
        </button>
      </section>

      <!-- 로딩 UI -->
      <div v-if="loading" class="loading-overlay">
        <div class="spinner"></div>
      </div>

      <!-- 메인 Grid -->
      <section class="grid-section" v-if="mainGridData.length > 0">
        <h2 class="grid-title">차량 조회</h2>

        <div class="ag-theme-alpine grid-box">
          <ag-grid-vue
            class="main-grid"
            :columnDefs="mainColDefs"
            :rowData="mainGridData"
            rowSelection="single"
            :pagination="true"
            :paginationPageSize="mainPageSize"
            @rowClicked="onMainRowClick"
            style="width: 100%; height: 100%;"
          ></ag-grid-vue>
        </div>

      </section>

      <!-- 서브 Grid -->
      <section class="grid-section" v-if="subGridData.length > 0">
        <h2 class="grid-title">선택된 차량 상세 정보</h2>

        <div class="ag-theme-alpine grid-box">
          <ag-grid-vue
            class="sub-grid"
            :columnDefs="subColDefs"
            :rowData="subGridData"
            :pagination="true"
            :paginationPageSize="mainPageSize"
            style="width: 100%; height: 100%;"
          ></ag-grid-vue>
        </div>

      </section>

    </main>
  </div>
</template>

<script>
import { AgGridVue } from "ag-grid-vue";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";

import vhclApi from "../services/vhclApi";

export default {
  name: "VhclSrch",
  components: { AgGridVue },

  data() {
    return {
      loading: false,
      filter: { model: "", fuel: "", year: "" },

      fuelTypes: [
        "휘발유",
        "경유",
        "휘발유 하이브리드",
        "경유 하이브리드",
        "LPG 하이브리드",
        "LPG(액화석유가스)",
        "CNG(압축천연가스)"
      ],

      yearList: (() => {
        const cur = new Date().getFullYear();
        return Array.from({ length: 15 }, (_, i) => cur - i);
      })(),

      /* 그리드 데이터 */
      mainGridData: [],
      subGridData: [],

      /* 컬럼 정의 */
      mainColDefs: [
        { headerName: "차명", field: "vnmEng", width: 180 },
        { headerName: "연료", field: "vfulEng", width: 100 },
        { headerName: "엔진형식", field: "engtEng", width: 100 },
        { headerName: "연식별 차량대수", field: "cntvmyEng", width: 140 },
        { headerName: "차량 총 대수", field: "sntEng", width: 130 },
        { headerName: "연식", field: "vmyAll", width: 100 },
        { headerName: "해당연식 차량대수", field: "sntAll", width: 150 }
      ],

      subColDefs: [
        { headerName: "차량관리번호", field: "vhmno", width: 140 },
        { headerName: "차량등록번호", field: "vhrno", width: 140 },
        { headerName: "본거지 법정도 코드", field: "bsplLedoCd", width: 150 },
        { headerName: "소유자 구분", field: "ownrSe", width: 120 },
        { headerName: "차종(등록정보)", field: "vhcty", width: 120 },
        { headerName: "용도", field: "purps", width: 100 },
        { headerName: "차대번호(VIN)", field: "vin", width: 180 },
        { headerName: "최초등록일", field: "fstRegDe", width: 130 },
        { headerName: "차량연식", field: "vhclYridnw", width: 110 },
        { headerName: "차량제작일자", field: "vhclMnfctDe", width: 130 },
        { headerName: "배출가스 검사 유효일자", field: "emisInspEfctDe", width: 160 },
        { headerName: "제원관리번호", field: "srcmnno", width: 130 },
        { headerName: "배출가스 인증번호", field: "emisCrtcno", width: 150 },
        { headerName: "배출가스 등급", field: "emisGrd", width: 120 },
        { headerName: "저공해조치 YN", field: "lemYn", width: 120 },
        { headerName: "저공해조치 종류", field: "lemKnd", width: 130 },
        { headerName: "차량말소 YN", field: "vhclErsrYn", width: 110 },
        { headerName: "취득일자", field: "acqsDe", width: 120 },
        { headerName: "취득금액", field: "acqsAmt", width: 120 },
        { headerName: "차명", field: "vhcnm", width: 150 },
        { headerName: "차종(제원정보)", field: "vhctyOg", width: 130 },
        { headerName: "차종 분류", field: "vhctyCl", width: 120 },
        { headerName: "차종 유형", field: "vhctyTy", width: 120 },
        { headerName: "자동차 형식", field: "carFrm", width: 140 },
        { headerName: "제작사명", field: "mkrNm", width: 140 },
        { headerName: "연료", field: "fuel", width: 100 },
        { headerName: "엔진형식", field: "eginty", width: 130 },
        { headerName: "총중량", field: "totWght", width: 110 },
        { headerName: "적재중량", field: "cryngWght", width: 110 },
        { headerName: "엔진출력", field: "eginpwr", width: 110 },
        { headerName: "배기량", field: "dsplvl", width: 100 },
        { headerName: "승차인원", field: "tkcarNmpr", width: 110 },
        { headerName: "차량길이", field: "vhclLt", width: 100 },
        { headerName: "차량너비", field: "vhclWh", width: 100 },
        { headerName: "차량높이", field: "vhclHg", width: 100 },
        { headerName: "원산지명", field: "plorNm", width: 120 },
        { headerName: "삭제 YN", field: "deleYn", width: 90 },
        { headerName: "승인 일자", field: "cnfrmDe", width: 120 },
        { headerName: "구동 형식", field: "drvFrm", width: 110 },
        { headerName: "변속기 종류", field: "gearboxKnd", width: 130 }
      ]
    };
  },

  methods: {
    async searchMainGrid() {
      this.loading = true;
      this.mainGridData = [];
      this.subGridData = [];

      try {
        const data = await vhclApi.tbSrchKeyList();

        this.mainGridData = data.filter(row => {
          return (
            (!this.filter.model || row.vnmEng.includes(this.filter.model)) &&
            (!this.filter.fuel || row.vfulEng === this.filter.fuel) &&
            (!this.filter.year || row.vmyAll === String(this.filter.year))
          );
        });

      } catch (e) {
        console.error("조회 오류:", e);
        alert("조회 중 오류가 발생했습니다.");
      } finally {
        this.loading = false;
      }
    },

    async onMainRowClick(params) {
      const row = params.data;

      const vhcnm = row.vnmAll || row.vnmEng;
      const vhclYridnw = row.vmyAll;
      const eginty = row.engtAll || row.engtEng;
      const fuel = row.vfulAll || row.vfulEng;

      this.loading = true;
      try {
        const result = await vhclApi.getMigDetail({
          vhcnm,
          vhclYridnw,
          eginty,
          fuel
        });

        this.subGridData = result;

      } catch (e) {
        console.error("상세 조회 오류:", e);
        alert("상세 조회 중 오류가 발생했습니다.");
      } finally {
        this.loading = false;
      }
    }
  },
  computed: {
    mainPageSize() {
      return 20;
    }
  }
};
</script>

<style scoped>
  /* 기본 레이아웃 */
  .vhcl-srch-wrap {
    background: #f4f6fb;
    min-height: 100vh;
  }

  .content {
    padding: 32px 40px;
    padding-left: 260px;
    max-width: 1400px;
    margin: 0 auto;
  }

  .page-title {
    font-size: 26px;
    font-weight: 700;
    margin-bottom: 28px;
  }

  /* 조회 패널 */
  .search-panel {
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 20px;
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
    width: 180px;
  }

  .btn-search {
    padding: 12px 26px;
    background: #1e90ff;
    border: none;
    color: #fff;
    border-radius: 10px;
    font-size: 16px;
    cursor: pointer;
  }
  .btn-search:hover {
    background: #1878d8;
  }

  /* 그리드 영역 */
  .grid-section {
    margin-bottom: 30px;
  }
  .grid-title {
    font-size: 20px;
    font-weight: 600;
    margin-bottom: 12px;
  }

  .grid-box {
    width: 100%;
    height: 350px;
    border-radius: 8px;
    overflow: hidden;
  }

  .rows-selector {
    position: absolute;
    right: 0;
    font-size: 14px;
  }

  .rows-selector select {
    padding: 6px 8px;
    border-radius: 6px;
    margin-left: 6px;
  }

  /* 로딩 오버레이 */
  .loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.6);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 2000;
  }

  .spinner {
    width: 58px;
    height: 58px;
    border: 6px solid #ccc;
    border-top-color: #1e90ff;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .ag-theme-alpine {
    --ag-font-size: 14px;
    --ag-header-height: 38px;
    --ag-row-height: 36px;
  }
</style>
