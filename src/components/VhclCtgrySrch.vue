<template>
  <div class="wrap" >

    <!-- 검색 영역 -->
    <main class="content">
      <h1 class="page-title">차량 카테고리 조회</h1>

      <div class="filter-card">
        <div class="filter-box">

          <!-- 제조사 -->
          <div class="filter-item">
            <label class="filter-label">제조사</label>
            <select class="filter-select" v-model="selectedMakerId" @change="onMakerChange">
              <option value="">선택하세요</option>
              <option v-for="maker in makerList" :key="maker.makerId" :value="maker.makerId">
                {{ maker.makerName }}
              </option>
            </select>
          </div>

          <!-- 모델 -->
          <div class="filter-item">
            <label class="filter-label">모델</label>
            <select class="filter-select" v-model="selectedModelId" @change="onModelChange" :disabled="!selectedMakerId">
              <option value="">선택하세요</option>
              <option v-for="model in modelList" :key="model.modelId" :value="model.modelId">
                {{ model.modelName }}
              </option>
            </select>
          </div>

          <!-- 세부모델 -->
          <div class="filter-item">
            <label class="filter-label">세부모델</label>
            <select class="filter-select" v-model="selectedDetailId" @change="onDetailChange" :disabled="!selectedModelId">
              <option value="">선택하세요</option>
              <option v-for="detail in detailList" :key="detail.detailId" :value="detail.detailId">
                {{ detail.detailName }}
              </option>
            </select>
          </div>

          <!-- 트림(등급) -->
          <div class="filter-item">
            <label class="filter-label">트림(등급) <span class="optional">(선택)</span></label>
            <select class="filter-select" v-model="selectedTrimId" :disabled="!selectedDetailId">
              <option value="">전체</option>
              <option v-for="trim in trimList" :key="trim.trimId" :value="trim.trimId">
                {{ trim.trimName }}
              </option>
            </select>
          </div>

          <!-- 검색 버튼 -->
          <div class="filter-item btn-item">
            <button class="btn-search" @click="searchCars" :disabled="!selectedDetailId">
              검색
            </button>
          </div>

        </div>
      </div>

      <!-- 로딩 -->
      <div v-if="loading" class="loading">
        차량 목록을 조회 중입니다...
      </div>

      <!-- 에러 -->
      <div v-if="error" class="error-msg">{{ error }}</div>

      <!-- 검색 결과 -->
      <div v-if="!loading && searched">

        <!-- 결과 헤더 -->
        <div class="result-header">
          <span class="result-count">
            총 <strong>{{ totalCount.toLocaleString() }}</strong>대
          </span>
          <span class="result-label">{{ currentFilterLabel }}</span>
        </div>

        <!-- 결과 없음 -->
        <div v-if="carList.length === 0" class="empty-msg">
          검색 조건에 해당하는 차량이 없습니다.
        </div>

        <!-- 차량 카드 목록 -->
        <div v-else class="car-grid">
          <div
            class="car-card"
            v-for="(car, idx) in carList"
            :key="idx"
            @click="goToAnls(car.vhrno)"
          >
            <!-- 차량번호 + 배지 -->
            <div class="card-top">
              <span class="car-regno">{{ car.vhrno }}</span>
              <span class="badge badge-ersr" v-if="car.vhclErsrYn === 'Y'">말소</span>
              <span class="badge badge-emis" v-if="car.emisGrd && car.emisGrd !== 'X'">{{ car.emisGrd }}등급</span>
            </div>

            <!-- 차명 -->
            <div class="car-name">{{ car.vhcnm }}</div>

            <!-- 핵심 정보 -->
            <div class="card-info-grid">
              <div class="card-info-item">
                <span class="info-label">연식</span>
                <span class="info-val">{{ car.vhclYridnw }}년</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">연료</span>
                <span class="info-val">{{ car.fuel || '-' }}</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">배기량</span>
                <span class="info-val">{{ car.dsplvl ? car.dsplvl + 'cc' : '-' }}</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">엔진출력</span>
                <span class="info-val">{{ car.eginpwr ? car.eginpwr + 'ps' : '-' }}</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">변속기</span>
                <span class="info-val">{{ car.gearboxKnd || '-' }}</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">구동</span>
                <span class="info-val">{{ car.drvFrm || '-' }}</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">승차인원</span>
                <span class="info-val">{{ car.tkcarNmpr ? car.tkcarNmpr + '인' : '-' }}</span>
              </div>
              <div class="card-info-item">
                <span class="info-label">최초등록</span>
                <span class="info-val">{{ formatDate(car.fstRegDe) }}</span>
              </div>
            </div>

            <!-- 제원번호 + 분석하기 -->
            <div class="card-bottom">
              <span class="srcmnno">{{ car.srcmnno }}</span>
              <span class="go-btn">분석하기 →</span>
            </div>
          </div>
        </div>

        <!-- 페이지네이션 -->
        <div class="pagination" v-if="totalPages > 1">
            <!-- 맨 앞으로 -->
            <button class="page-btn" @click="changePage(1)" :disabled="currentPage === 1">&lt;&lt;</button>
            <!-- 이전 블록 첫 페이지로 -->
            <button class="page-btn" @click="changePage(currentBlock * 5)" :disabled="!hasPrevBlock">&lt;</button>

            <!-- 페이지 번호 (블록 고정) -->
            <button
                class="page-btn"
                v-for="page in pageNumbers"
                :key="page"
                :class="{ active: page === currentPage }"
                @click="changePage(page)"
            >{{ page }}</button>

            <!-- 다음 블록 첫 페이지로 -->
            <button class="page-btn" @click="changePage((currentBlock + 1) * 5 + 1)" :disabled="!hasNextBlock">&gt;</button>
            <!-- 맨 뒤로 -->
            <button class="page-btn" @click="changePage(totalPages)" :disabled="currentPage === totalPages">&gt;&gt;</button>
        </div>

      </div>

      <!-- 조회 전 안내 -->
      <div v-if="!loading && !searched" class="placeholder">
        제조사, 모델, 세부모델을 선택한 후 검색 버튼을 눌러주세요.
      </div>

    </main>
  </div>
</template>

<script>
import vhclApi from '../services/vhclApi'

export default {
  name: 'VhclCtgrySrch',
  data() {
    return {
      // 드롭다운 선택값
      selectedMakerId: '',
      selectedModelId: '',
      selectedDetailId: '',
      selectedTrimId: '',

      // 드롭다운 목록
      makerList: [],
      modelList: [],
      detailList: [],
      trimList: [],

      // 검색 결과
      carList: [],
      totalCount: 0,
      searched: false,

      // 페이지네이션
      currentPage: 1,
      pageSize: 20,
      totalPages: 1,

      // 결과 헤더 라벨
      currentFilterLabel: '',

      // 상태
      loading: false,
      error: null
    }
  },

  computed: {
     currentBlock() {
        return Math.floor((this.currentPage - 1) / 5)
    },

    // 현재 블록에 해당하는 페이지 번호 목록 (최대 5개)
    pageNumbers() {
        var blockStart = this.currentBlock * 5 + 1          // 블록 시작 페이지
        var blockEnd = Math.min(blockStart + 4, this.totalPages) // 블록 끝 페이지
        var pages = []
        for (var i = blockStart; i <= blockEnd; i++) {
            pages.push(i)
        }
        return pages
    },

    // 이전 블록 존재 여부
    hasPrevBlock() {
        return this.currentBlock > 0
    },

    // 다음 블록 존재 여부
    hasNextBlock() {
        return (this.currentBlock + 1) * 5 < this.totalPages
    }
  },

  mounted() {
    this.fetchMakerList()
  },

  methods: {

    // =====================
    // 드롭다운 목록 조회
    // =====================

    async fetchMakerList() {
      try {
        const res = await vhclApi.makerList()
        this.makerList = res.data
      } catch (e) {
        console.error('제조사 목록 조회 실패', e)
      }
    },

    async fetchModelList(makerId) {
      try {
        const res = await vhclApi.modelList(makerId)
        this.modelList = res.data
      } catch (e) {
        console.error('모델 목록 조회 실패', e)
      }
    },

    async fetchDetailList(modelId) {
      try {
        const res = await vhclApi.detailModelList(modelId)
        this.detailList = res.data
      } catch (e) {
        console.error('세부모델 목록 조회 실패', e)
      }
    },

    async fetchTrimList(detailId) {
      try {
        const res = await vhclApi.trimList(detailId)
        this.trimList = res.data
      } catch (e) {
        console.error('트림 목록 조회 실패', e)
      }
    },

    // =====================
    // 드롭다운 변경 이벤트
    // =====================

    onMakerChange() {
      // 하위 드롭다운 초기화
      this.selectedModelId = ''
      this.selectedDetailId = ''
      this.selectedTrimId = ''
      this.modelList = []
      this.detailList = []
      this.trimList = []
      this.resetResult()

      if (this.selectedMakerId) {
        this.fetchModelList(this.selectedMakerId)
      }
    },

    onModelChange() {
      this.selectedDetailId = ''
      this.selectedTrimId = ''
      this.detailList = []
      this.trimList = []
      this.resetResult()

      if (this.selectedModelId) {
        this.fetchDetailList(this.selectedModelId)
      }
    },

    onDetailChange() {
      this.selectedTrimId = ''
      this.trimList = []
      this.resetResult()

      if (this.selectedDetailId) {
        this.fetchTrimList(this.selectedDetailId)
      }
    },

    // =====================
    // 차량 검색
    // =====================

    async searchCars() {
      if (!this.selectedDetailId) {
        alert('세부모델까지 선택해주세요.')
        return
      }
      this.currentPage = 1
      await this.fetchCarList()
      this.updateFilterLabel()
    },

    async fetchCarList() {
      this.loading = true
      this.error = null

      try {
        const res = await vhclApi.carSearch({
          detailId: this.selectedDetailId,
          trimId: this.selectedTrimId || '',
          page: this.currentPage,
          pageSize: this.pageSize
        })

        this.carList = res.data.list
        this.totalCount = res.data.totalCount
        this.totalPages = Math.ceil(this.totalCount / this.pageSize)
        this.searched = true

      } catch (e) {
        console.error('차량 검색 실패', e)
        this.error = '차량 목록 조회에 실패했습니다.'
      } finally {
        this.loading = false
      }
    },

    // 페이지 이동
    async changePage(page) {
      if (page < 1 || page > this.totalPages) return
      this.currentPage = page
      await this.fetchCarList()
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },

    // =====================
    // 차자바 분석 페이지 이동
    // =====================

    goToAnls(vhrno) {
      // VhclAnls.vue의 mounted()에서 this.$route.query.vhrno 로 받아서 자동 조회
      this.$router.push({ path: '/vhclAnlsOld', query: { vhrno: vhrno } })
    },

    // =====================
    // 유틸
    // =====================

    // 날짜 포맷 (20230101 → 2023.01.01)
    formatDate(val) {
      if (!val || val.length !== 8) return '-'
      return val.substring(0, 4) + '.' + val.substring(4, 6) + '.' + val.substring(6, 8)
    },

    // 결과 헤더 라벨 업데이트
    updateFilterLabel() {
      var self = this
      var maker = this.makerList.find(function(m) { return m.makerId == self.selectedMakerId })
      var model = this.modelList.find(function(m) { return m.modelId == self.selectedModelId })
      var detail = this.detailList.find(function(d) { return d.detailId == self.selectedDetailId })
      var trim = this.trimList.find(function(t) { return t.trimId == self.selectedTrimId })

      var parts = []
      if (maker) parts.push(maker.makerName)
      if (model) parts.push(model.modelName)
      if (detail) parts.push(detail.detailName)
      if (trim) parts.push(trim.trimName)

      this.currentFilterLabel = parts.join(' > ')
    },

    // 검색 결과 초기화
    resetResult() {
      this.carList = []
      this.totalCount = 0
      this.searched = false
      this.error = null
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.wrap {
  margin: 0 auto;
  width: 90%;
}
.content {
  padding: 0px 40px 30px 40px;
}
.page-title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 28px;
}

/* ===============================
   필터 카드
================================*/
.filter-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  padding: 24px;
  margin-bottom: 28px;
}

.filter-box {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  align-items: flex-end;
}

.filter-item {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
  min-width: 150px;
}

.btn-item {
  flex: 0 0 auto;
  min-width: auto;
}

.filter-label {
  font-size: 13px;
  font-weight: 600;
  color: #555;
}

.optional {
  font-weight: 400;
  color: #aaa;
  font-size: 12px;
}

.filter-select {
  padding: 10px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: border-color 0.2s, box-shadow 0.2s;
}

.filter-select:focus {
  outline: none;
  border-color: #1e90ff;
  box-shadow: 0 0 0 3px rgba(30, 144, 255, 0.1);
}

.filter-select:disabled {
  background: #f5f5f5;
  color: #bbb;
  cursor: not-allowed;
}

.btn-search {
  padding: 10px 28px;
  background: #1e90ff;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
  white-space: nowrap;
}

.btn-search:hover:not(:disabled) {
  background: #1878d8;
}

.btn-search:disabled {
  background: #b0c8e8;
  cursor: not-allowed;
}

/* ===============================
   결과 헤더
================================*/
.result-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.result-count {
  font-size: 15px;
  color: #555;
}

.result-count strong {
  color: #1e90ff;
  font-size: 17px;
}

.result-label {
  font-size: 13px;
  color: #888;
  background: #f0f6ff;
  padding: 3px 12px;
  border-radius: 20px;
}

/* ===============================
   차량 카드 그리드
================================*/
.car-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  margin-bottom: 28px;
}

.car-card {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.07);
  padding: 20px;
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  position: relative;
}

.car-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(30, 144, 255, 0.13);
}

/* 카드 상단: 차량번호 + 배지 */
.card-top {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.car-regno {
  font-size: 14px;
  font-weight: 700;
  color: #1e90ff;
  letter-spacing: 1px;
}

.badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 600;
}

.badge-ersr {
  background: #ffe4e4;
  color: #c0392b;
}

.badge-emis {
  background: #e0f0ff;
  color: #1565c0;
  border: 1px solid #b3d4f5;
}

/* 차명 */
.car-name {
  font-size: 16px;
  font-weight: 700;
  color: #222;
  margin-bottom: 14px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* 핵심 정보 그리드 */
.card-info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px 14px;
  margin-bottom: 14px;
}

.card-info-item {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.info-label {
  font-size: 11px;
  color: #aaa;
}

.info-val {
  font-size: 13px;
  color: #333;
  font-weight: 500;
}

/* 카드 하단 */
.card-bottom {
  padding-top: 12px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.srcmnno {
  font-size: 11px;
  color: #bbb;
  font-family: monospace;
}

.go-btn {
  font-size: 12px;
  color: #1e90ff;
  font-weight: 600;
  opacity: 0;
  transform: translateX(-4px);
  transition: opacity 0.15s ease, transform 0.15s ease;
}

.car-card:hover .go-btn {
  opacity: 1;
  transform: translateX(0);
}

/* ===============================
   페이지네이션
================================*/
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  margin-bottom: 20px;
}

.page-btn {
  min-width: 36px;
  height: 36px;
  padding: 0 10px;
  border-radius: 8px;
  border: 1px solid #ddd;
  background: #fff;
  font-size: 14px;
  cursor: pointer;
  color: #555;
  transition: 0.15s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1e90ff;
  color: #1e90ff;
}

.page-btn.active {
  background: #1e90ff;
  color: #fff;
  border-color: #1e90ff;
  font-weight: 700;
}

.page-btn:disabled {
  color: #ccc;
  cursor: not-allowed;
}

/* ===============================
   공통
================================*/
.loading {
  text-align: center;
  padding: 40px;
  font-size: 15px;
  color: #777;
}

.error-msg {
  text-align: center;
  padding: 16px;
  color: #e74c3c;
  font-size: 14px;
}

.empty-msg {
  padding: 40px;
  text-align: center;
  color: #888;
  font-size: 14px;
  background: #fafafa;
  border-radius: 8px;
  border: 1px solid #eee;
}

.placeholder {
  padding: 60px 20px;
  text-align: center;
  color: #aaa;
  font-size: 15px;
}

/* ===============================
   반응형
================================*/
@media (max-width: 768px) {
  .content { padding: 0 16px 30px; }
  .filter-item { min-width: 100%; }
  .car-grid { grid-template-columns: 1fr; }
}
</style>