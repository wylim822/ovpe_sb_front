/**
 * storageUtil.js
 * 최근 검색 / 즐겨찾기 로컬스토리지 유틸
 * 저장 구조 (JSON 문자열로 저장):
 *   localStorage['ovpe_recent']    = ["12가3456", "34나5678", ...]  // 최근 검색 (최대 5개)
 *   localStorage['ovpe_favorites'] = [{ vhrno, vhcnm, savedAt }, ...]  // 즐겨찾기
 */

const RECENT_KEY = 'ovpe_recent'        // 최근 검색 키
const FAVORITE_KEY = 'ovpe_favorites'   // 즐겨찾기 키
const RECENT_MAX = 5                    // 최근 검색 최대 저장 개수

// =====================
// 최근 검색
// =====================

/**
 * 최근 검색 목록 조회
 * @returns {string[]} 차량번호 배열 (최신순)
 */
function getRecentList() {
    var raw = localStorage.getItem(RECENT_KEY)
    if (!raw) return []
    try {
        return JSON.parse(raw)
    } catch (e) {
        return []
    }
}

/**
 * 최근 검색에 차량번호 추가
 * - 이미 있으면 맨 앞으로 이동
 * - 최대 5개 초과 시 가장 오래된 항목 제거
 * @param {string} vhrno 차량번호
 */
function addRecent(vhrno) {
    if (!vhrno) return
    var list = getRecentList()

    // 이미 있으면 제거 (중복 방지)
    list = list.filter(function(item) { return item !== vhrno })

    // 맨 앞에 추가
    list.unshift(vhrno)

    // 최대 개수 초과 시 마지막 제거
    if (list.length > RECENT_MAX) {
        list = list.slice(0, RECENT_MAX)
    }

    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
}

/**
 * 최근 검색 특정 항목 삭제
 * @param {string} vhrno 차량번호
 */
function removeRecent(vhrno) {
    var list = getRecentList().filter(function(item) { return item !== vhrno })
    localStorage.setItem(RECENT_KEY, JSON.stringify(list))
}

/**
 * 최근 검색 전체 삭제
 */
function clearRecent() {
    localStorage.removeItem(RECENT_KEY)
}

// =====================
// 즐겨찾기
// =====================

/**
 * 즐겨찾기 목록 조회
 * @returns {{ vhrno: string, vhcnm: string, savedAt: string }[]}
 */
function getFavoriteList() {
    var raw = localStorage.getItem(FAVORITE_KEY)
    if (!raw) return []
    try {
        return JSON.parse(raw)
    } catch (e) {
        return []
    }
}

/**
 * 즐겨찾기 추가
 * @param {string} vhrno 차량번호
 * @param {string} vhcnm 차명 (사이드바 표시용)
 */
function addFavorite(vhrno, vhcnm) {
    if (!vhrno) return
    var list = getFavoriteList()

    // 이미 있으면 추가 안 함
    var exists = list.some(function(item) { return item.vhrno === vhrno })
    if (exists) return

    list.unshift({
        vhrno: vhrno,
        vhcnm: vhcnm || vhrno,  // 차명 없으면 차량번호로 대체
        savedAt: new Date().toLocaleDateString('ko-KR')  // 저장일자 (표시용)
    })

    localStorage.setItem(FAVORITE_KEY, JSON.stringify(list))
}

/**
 * 즐겨찾기 삭제
 * @param {string} vhrno 차량번호
 */
function removeFavorite(vhrno) {
    var list = getFavoriteList().filter(function(item) { return item.vhrno !== vhrno })
    localStorage.setItem(FAVORITE_KEY, JSON.stringify(list))
}

/**
 * 즐겨찾기 여부 확인
 * @param {string} vhrno 차량번호
 * @returns {boolean}
 */
function isFavorite(vhrno) {
    return getFavoriteList().some(function(item) { return item.vhrno === vhrno })
}

export default {
    // 최근 검색
    getRecentList,
    addRecent,
    removeRecent,
    clearRecent,
    // 즐겨찾기
    getFavoriteList,
    addFavorite,
    removeFavorite,
    isFavorite
}