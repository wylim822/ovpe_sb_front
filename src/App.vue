<template>
  <div id="app">
    <!-- 상단 헤더 -->
    <header class="topbar">
      <button class="menu_btn" @click="toggleSidebar">☰</button>
      <router-link to="/" class="logo-link">
        <h3 class="logo">차자바 ｜ 운행차 차량평가</h3>
      </router-link>
    </header>
 
    <!-- 사이드바 (슬라이드 방식) -->
    <aside class="sidebar" :class="{ open: isSidebarOpen }" ref="sidebar">
 
      <nav class="nav-list">
 
        <router-link to="/" class="nav-item" exact @click.native="handleMenuClick">
          <i class="ri-brain-line"></i>
          <span>차량 AI 분석</span>
        </router-link>
 
        <router-link to="/vhclSrch" class="nav-item" @click.native="handleMenuClick">
          <i class="ri-search-line"></i>
          <span>차량번호 검색</span>
        </router-link>
 
      </nav>
 
    </aside>
 
    <!-- 본문 -->
    <main class="content">
      <router-view />
    </main>
 
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      isSidebarOpen: false,   // 사이드바 오픈 상태
      isMobile: window.innerWidth <= 900
    };
  },
 
  methods: {
    toggleSidebar() {
      this.isSidebarOpen = !this.isSidebarOpen;
    },
 
    // 사이드바 닫음
    closeSidebar() {
      this.isSidebarOpen = false;
    },
 
    handleMenuClick() {
      // 메뉴 클릭 시 사이드바 닫음
      this.closeSidebar();
    },
 
    handleClickOutside(event) {
      // 사이드바가 열려있을 때 사이드바 이외의 영역 클릭 시 사이드바 닫음
      if (
        this.isSidebarOpen && this.$refs.sidebar && !this.$refs.sidebar.contains(event.target) && !event.target.closest('.menu_btn')
      ) {
        this.closeSidebar();
      }
    },
 
    handleResize() {
      this.isMobile = window.innerWidth <= 900;
    }
  },
 
  mounted() {
    window.addEventListener("resize", this.handleResize);
    document.addEventListener("click", this.handleClickOutside);  // 이벤트 리스너 추가
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleResize);
    document.removeEventListener("click", this.handleClickOutside); // 이벤트 리스너 제거
  }
};
</script>
 
<style>
/* 전체 레이아웃 */
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  color: #333;
}
 
/* 상단 헤더 */
.topbar {
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px;
  background: #fff;
  border-bottom: 1px solid #e5e5e5;
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 2000;
}
 
.menu_btn {
  background: none;
  border: none;
  font-size: 22px;
  cursor: pointer;
  margin-right: 15px;
}
 
.logo-link {
  text-decoration: none;
  color: inherit;
  display: block;
}
 
/* 사이드바 */
.sidebar {
  position: fixed;
  top: 48px;
  left: -260px;
  width: 240px;
  height: calc(100vh - 48px);
  background: #f9f9f9;
  box-sizing: border-box;
  padding: 12px;
  transition: left 0.25s ease;
  z-index: 1500;
}
 
/* open 상태 - 슬라이드 인 */
.sidebar.open {
  left: 0;
}
 
.nav-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 5px;
}
 
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 6px;
  text-decoration: none;
  color: #333;
  font-size: 16px;
  font-weight: 500;
  transition: background 0.2s ease;
}
 
.nav-item:hover {
  background: #efefef;
}
 
/* 활성화된 메뉴 hover */
.nav-item.router-link-active:hover {
    background: #cce5ff;
}
 
/* 활성화된 메뉴 */
.nav-item.router-link-active {
  background: #e0f2ff; 
  color: #007bff;
  font-weight: 700;
}
 
.nav-item.router-link-active i {
  color: #007bff;
}
 
/* 본문 */
.content {
  flex: 1;
  padding: 10px;
  margin-top: 30px;
  position: relative; /* 사이드바 오버레이용 */
}
 
/* 오버레이 스타일 (사이드바가 열렸을 때만 적용) */
#app:has(.sidebar.open) .content::before {
  content: '';
  position: fixed;
  top: 48px; /* 헤더 높이 제외 */
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000; /* 사이드바 (1500)보다 낮고 본문보다 높게 */
  pointer-events: auto; /* 클릭 가능하게 설정 */
}
</style>