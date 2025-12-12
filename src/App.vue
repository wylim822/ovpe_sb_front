<template>
  <div id="app">
    <!-- 상단 헤더 -->
    <header class="topbar">
      <button class="menu_btn" @click="toggleSidebar">☰</button>
      <router-link to="/" class="logo-link">
        <h3 class="logo">차자바 ｜ 운행차 차량평가</h3>
      </router-link>
    </header>

    <!-- 사이드 메뉴 -->
    <nav class="sidebar" :class="{ open: isMenuOpen }">
      <ul>
        <li>
          <router-link to="/" @click.native="closeMenu">차량 AI 분석</router-link>
        </li>
        <li>
          <router-link to="/vhclSrch" @click.native="closeMenu">차량번호 검색</router-link>
        </li>
      </ul>
    </nav>

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
        isMenuOpen: false
      }
    },
    methods: {
      toggleMenu() {
        this.isMenuOpen = !this.isMenuOpen;
      },
      closeMenu() {
        this.isMenuOpen = false;
      }
    }
  }
</script>
 
<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
  background: #f0f2f5;
  color: #2c3e50;
}

/* 전체 레이아웃 */
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* 헤더 */
.header {
  display: flex;
  align-items: center;
  color: white;
  padding: 5px;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 2000;
}

.menu-btn {
  font-size: 20px;
  font-weight: 500;
  background: transparent;
  color: 333;
  border: none;
  cursor: pointer;
  margin-left: 20px;
  margin-top: 10px;
}

.title {
  font-size: 18px;
}

/* 사이드바 */
.sidebar {
  position: fixed;
  top: 0;
  left: -240px;
  width: 220px;
  height: 100%;
  color: #333;
  padding-top: 60px;
  transition: left 0.3s ease;
  z-index: 1000;
  margin-left: 10px;
}

.sidebar.open {
  left: 0;
}

.sidebar ul {
  list-style: none;
  padding: 0;
}

.sidebar li {
  padding: 8px 20px;
}

.sidebar li a {
  color: #333;
  text-decoration: none;
  font-size: 16px;
  font-weight: 500;
  transition: color 0.2s ease, text-decoration 0.2s ease;
  display: block;          /* 클릭 영역 확대 */
}

.sidebar li a:hover {
  color: #1e90ff;
  text-decoration: underline;
}

/* 본문 */
.content {
  flex: 1;
}
</style>