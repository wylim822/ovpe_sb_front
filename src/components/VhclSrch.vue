<template>
  <div class="vhcl-srch-wrap">

    <main class="content">
      <h1 class="page-title">차량정보 DB조회</h1>

      <!-- 조회 패널 -->
      <section class="search-panel">
        <div class="field">
          <label>차명</label>
          <input type="text" v-model="filter.model" placeholder="예: 아반떼" @keyup.enter="!loading && searchMainGrid()"/>
        </div>

        <div class="field">
          <label>연료</label>
          <select v-model="filter.fuel" @keyup.enter="!loading && searchMainGrid()">
            <option value="">전체</option>
            <option v-for="f in fuelTypes" :key="f" :value="f">{{ f }}</option>
          </select>
        </div>

        <div class="field">
          <label>차량 연식</label>
          <select v-model="filter.year" @keyup.enter="!loading && searchMainGrid()">
            <option value="">전체</option>
            <option v-for="y in yearList" :key="y" :value="y">{{ y }}</option>
          </select>
        </div>

        <button class="btn-search" @click="searchMainGrid" :disabled="loading">
          {{ loading ? "조회 중..." : "조회" }}
        </button>
        <button class="btn-reset" @click="resetFilter" :disabled="loading">초기화</button>
      </section>

      <!-- 조회 전 안내 -->
      <div v-if="!searched && !loading" class="empty-hint">
        조건을 입력한 후 조회 버튼을 눌러주세요.
      </div>

      <div v-if="searched && !loading && mainGridData.length === 0" class="empty-hint">
        조회 조건에 해당하는 결과가 없습니다.
      </div>

      <!-- 로딩 UI -->
      <div v-if="loading" class="loading-overlay" role="status" aria-live="polite">
        <div class="spinner"></div>
      </div>

      <!-- 메인 Grid -->
      <section class="grid-section" v-show="mainGridData.length > 0">
        <div class="grid-card">
          <div class="grid-card-header">
            <h2 class="grid-title">차량 조회</h2>
          </div>

          <div class="grid-card-body">
            <div class="ag-theme-alpine grid-box">
              <ag-grid-vue
                class="main-grid"
                :gridOptions="mainGridOptions"
                :columnDefs="mainColDefs"
                :rowData="mainGridData"
                :rowSelection="single"
                :pagination="true"
                :paginationPageSize="mainPageSize"
                @rowClicked="onMainRowClick"
                @grid-ready="onMainGridReady"
                style="width: 100%; height: 100%;"
              />
            </div>
          </div>
        </div>
      </section>

      <!-- 서브 Grid -->
      <section class="grid-section" v-show="subGridData.length > 0" ref="subGridSection">
        <div class="grid-card">
          <div class="grid-card-header">
            <h2 class="grid-title">선택 차량 상세 정보</h2>
             <span v-if="selectedMainRow" class="sub-title-hint">
              ({{ selectedMainRow.vnmEng }} / {{ selectedMainRow.vmyAll }}년식)
            </span>
          </div>

          <div class="grid-card-body">
            <div class="ag-theme-alpine grid-box">
              <ag-grid-vue
                class="sub-grid"
                :gridOptions="subGridOptions"
                :columnDefs="subColDefs"
                :rowData="subGridData"
                :pagination="true"
                :paginationPageSize="mainPageSize"
                @rowClicked="onSubRowClick"
                @grid-ready="onSubGridReady"
                style="width: 100%; height: 100%;"
              />
            </div>
          </div>
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

// 숫자 콤마 포맷터 (공통)
const numberFormatter = params => {
  if (params.value === null || params.value === undefined) return "-";
  return Number(params.value).toLocaleString();
};

export default {
  name: "VhclSrch",
  components: { AgGridVue },

  data() {
    return {
      loading: false,
      searched: false,
      selectedMainRow: null,
      selectedMainRowIndex: null,
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

      yearList: [],
      mainPageSize: 20,
      mainGridData: [],
      subGridData: [],

      defaultColDef: {
        resizable: true,
        sortable: true,
        cellStyle: {
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }
      },

      mainGridOptions: {
        defaultColDef: undefined
      },
      subGridOptions: {
        defaultColDef: undefined
      },

      mainColDefs: [],
      subColDefs: []
    };
  },

  created() {
    this.initYearList();
    this.mainGridOptions.defaultColDef = this.defaultColDef;
    this.subGridOptions.defaultColDef = this.defaultColDef;

    this.mainColDefs = [
      { headerName: "차명", field: "vnmEng", minWidth: 120, cellClass: "wrap-cell" },
      { headerName: "연료", field: "vfulEng", minWidth: 100 },
      { headerName: "엔진형식", field: "engtEng", minWidth: 120 },
      { headerName: "연식별 차량대수", field: "cntvmyEng", minWidth: 140, valueFormatter: numberFormatter },
      { headerName: "차량 총 대수", field: "sntEng", minWidth: 120, valueFormatter: numberFormatter },
      { headerName: "연식", field: "vmyAll", minWidth: 90 },
      { headerName: "해당연식 차량대수", field: "sntAll", minWidth: 140, valueFormatter: numberFormatter }
    ];

    this.subColDefs = [
      { headerName: "차량관리번호", field: "vhmno", minWidth: 120 },
      { headerName: "차량등록번호", field: "vhrno", minWidth: 120 },
      { headerName: "본거지 법정도 코드", field: "bsplLedoCd", minWidth: 120 },
      { headerName: "소유자 구분", field: "ownrSe", minWidth: 100 },
      { headerName: "차종(등록정보)", field: "vhcty", minWidth: 120 },
      { headerName: "용도", field: "purps", minWidth: 100 },
      { headerName: "차대번호", field: "vin", minWidth: 160 },
      { headerName: "최초등록일", field: "fstRegDe", minWidth: 120 },
      { headerName: "차량연식", field: "vhclYridnw", minWidth: 100 },
      { headerName: "차량제작일자", field: "vhclMnfctDe", minWidth: 120 },
      { headerName: "배출가스 검사 유효일자", field: "emisInspEfctDe", minWidth: 140 },
      { headerName: "제원관리번호", field: "srcmnno", minWidth: 120 },
      { headerName: "배출가스 인증번호", field: "emisCrtcno", minWidth: 140 },
      { headerName: "배출가스 등급", field: "emisGrd", minWidth: 100 },
      { headerName: "저공해조치 YN", field: "lemYn", minWidth: 100 },
      { headerName: "저공해조치 종류", field: "lemKnd", minWidth: 120 },
      { headerName: "차량말소 YN", field: "vhclErsrYn", minWidth: 100 },
      { headerName: "취득일자", field: "acqsDe", minWidth: 120 },
      { headerName: "취득금액", field: "acqsAmt", minWidth: 120 },
      { headerName: "차명", field: "vhcnm", minWidth: 130 },
      { headerName: "차종(제원정보)", field: "vhctyOg", minWidth: 120 },
      { headerName: "차종 분류", field: "vhctyCl", minWidth: 110 },
      { headerName: "차종 유형", field: "vhctyTy", minWidth: 110 },
      { headerName: "자동차 형식", field: "carFrm", minWidth: 130 },
      { headerName: "제작사명", field: "mkrNm", minWidth: 130 },
      { headerName: "연료", field: "fuel", minWidth: 90 },
      { headerName: "엔진형식", field: "eginty", minWidth: 110 },
      { headerName: "총중량", field: "totWght", minWidth: 100 },
      { headerName: "적재중량", field: "cryngWght", minWidth: 100 },
      { headerName: "엔진출력", field: "eginpwr", minWidth: 100 },
      { headerName: "배기량", field: "dsplvl", minWidth: 90 },
      { headerName: "승차인원", field: "tkcarNmpr", minWidth: 90 },
      { headerName: "차량길이", field: "vhclLt", minWidth: 90 },
      { headerName: "차량너비", field: "vhclWh", minWidth: 90 },
      { headerName: "차량높이", field: "vhclHg", minWidth: 90 },
      { headerName: "원산지명", field: "plorNm", minWidth: 110 },
      { headerName: "삭제 YN", field: "deleYn", minWidth: 80 },
      { headerName: "승인 일자", field: "cnfrmDe", minWidth: 100 },
      { headerName: "구동 형식", field: "drvFrm", minWidth: 100 },
      { headerName: "변속기 종류", field: "gearboxKnd", minWidth: 120 }
    ];
  },

  methods: {
    initYearList() {
      const currentYear = new Date().getFullYear();
      const startYear = 1936;

      this.yearList = [];
      for (let y = currentYear; y >= startYear; y--) {
        this.yearList.push(y);
      }
    },

    onMainGridReady(params) {
      this.mainGridApi = params.api;
      this.safeAutoSizeMain();
    },

    onSubGridReady(params) {
      this.subGridApi = params.api;   
      this.safeAutoSizeSub();
    },

    safeAutoSizeMain() {
      if (!this.mainColumnApi) return;
      
     try {
        this.mainGridApi.autoSizeAllColumns();
        this.mainGridApi.sizeColumnsToFit();
      } catch (e) {
        this.mainGridApi.sizeColumnsToFit();
      }

    },

    safeAutoSizeSub() {
      if (!this.subColumnApi) return;
      
      try {
        this.subGridApi.autoSizeAllColumns(false);
      } catch (e) {
        this.subGridApi.sizeColumnsToFit();
      }
    },

    // 메인 조회
    async searchMainGrid() {
      this.loading = true;
      this.searched = true;
      this.mainGridData = [];
      this.subGridData = [];

      try {
        const data = await vhclApi.tbSrchKeyList();

        this.mainGridData = data.filter(row => {
          return (
            (!this.filter.model || (row.vnmEng && row.vnmEng.includes(this.filter.model))) &&
            (!this.filter.fuel || row.vfulEng === this.filter.fuel) &&
            (!this.filter.year || row.vmyAll === String(this.filter.year))
          );
        });

        // 데이터 바인딩 직후 컬럼 자동조정 (필수)
        this.$nextTick(() => {
          this.safeAutoSizeMain();
        });
      } catch (e) {
        console.error("조회 오류:", e);
        alert("조회 중 오류가 발생했습니다.");
      } finally {
        this.loading = false;
      }
    },

     // ✅ 필터 초기화
    resetFilter() {
      this.filter = { model: "", fuel: "", year: "" };
      this.mainGridData = [];
      this.subGridData = [];
      this.selectedMainRow = null;
      this.searched = false;
    },

    // 메인 행 클릭 → 서브 조회
    async onMainRowClick(params) {
      // 선택 상태 강제 고정
      params.node.setSelected(true, true);
      this.selectedMainRow = params.data;
      this.selectedMainRowIndex = params.node.rowIndex;

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

        this.subGridData = result || [];

        this.$nextTick(() => {
          // 선택한 메인 그리드 row 가운데로 스크롤 이동
          if (this.selectedMainRowIndex !== null) {
            this.mainGridApi.ensureIndexVisible(
              this.selectedMainRowIndex,
              "middle"
            );
          }

          // 서브 그리드로 스크롤 이동
          if (this.$refs.subGridSection) {
            this.$refs.subGridSection.scrollIntoView({
              behavior: "smooth",
              block: "start"
            });
          }
        });
      } catch (e) {
        console.error("상세 조회 오류:", e);
        alert("상세 조회 중 오류가 발생했습니다.");
      } finally {
        this.loading = false;
      }
    },

    onSubRowClick(params) {
      const vhrno = params.data.vhrno;
      if (!vhrno) return;

      const routeUrl = this.$router.resolve({
        path: "/",
        query: { vhrno }
      }).href;

      window.open(routeUrl, "_blank");
    }

  }
  
};
</script>

<style scoped>

/* grid 하단 radius */
.ag-theme-alpine {
  border-radius: 0 0 16px 16px;
}

/* 기본 레이아웃 */
.vhcl-srch-wrap {
  background: #f4f6fb;
  min-height: 100vh;
}

.content {
  padding: 32px 40px;
  padding-left: 260px;
  max-width: 100%;
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
}

/* 초기화 버튼 */
.btn-reset {
  padding: 8px 22px;
  background: #f1f3f5;
  border: 1px solid #dcdfe3;
  color: #333;
  border-radius: 10px;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-reset:hover {
  background: #e6e8eb;
}

.btn-reset:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.empty-hint {
  padding: 60px 20px;
  text-align: center;
  color: #888;
  font-size: 17px;
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
  height: 420px;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  overflow: hidden;
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
  --ag-header-height: 40px;
  --ag-row-height: 36px;
  --ag-border-color: transparent;
  --ag-secondary-border-color: transparent;
  --ag-header-background-color: #f3f4f6; /* 연한 회색 */
  --ag-header-foreground-color: #333;
  --ag-row-border-color: #eef0f3;
  border-radius: 0 0 16px 16px;
}

/* grid 외곽선 제거 */
.ag-theme-alpine .ag-root-wrapper {
  border: none !important;
}

:deep(.ag-theme-alpine .ag-header-cell-label) {
  justify-content: center !important;

}

:deep(.ag-theme-alpine .ag-header-cell-text) {
  text-align: center !important;
  width: 100%;
}

:deep(.wrap-cell) {
  white-space: normal !important;
  line-height: 1.3;
  justify-content: flex-start !important; /* 가독성 ↑ */
  text-align: left !important;
}

.ag-theme-alpine .ag-cell {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}
.ag-theme-alpine .ag-row-hover {
  background-color: #f5f8ff !important;
}

.ag-theme-alpine .ag-row-selected {
  background-color: #e8efff !important;
}

/* Grid Card 공통 */
.grid-card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0,0,0,0.08);
  overflow: hidden;
}

/* 카드 헤더 */
.grid-card-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 18px 22px;
  background: #ffffff;
  border-bottom: 1px solid #eef0f3;
}

.grid-card-header .grid-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

/* 카드 바디 */
.grid-card-body {
  padding: 0;
}

.sub-title-hint {
  font-size: 14px;
  font-weight: 500;
  color: #555;
  margin-left: 8px;
}

</style>
