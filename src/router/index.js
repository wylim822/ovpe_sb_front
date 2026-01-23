import Vue from 'vue'
import Router from 'vue-router'

// 사용할 컴포넌트 import
import VhclAnls from '../components/VhclAnlsNew.vue';   // 차량분석
import VhclSrch from '../components/VhclSrch.vue';      // 차량번호 검색
import VhclAnlsOld from '../components/VhclAnls.vue';   // 차량분석(old)

// Vue에 Router 플러그인 등록
Vue.use(Router)

export default new Router({
  mode: 'history',  // # 없이 URL 동작
  base: '/',
  routes: [
    {
      path: '/',
      name: 'vhclAnls',
      component: VhclAnls
    },
    {
      path: '/vhclSrch',
      name: 'vhclSrch',
      component: VhclSrch
    },
    {
      path: '/vhclAnlsOld',
      name: 'vhclAnlsOld',
      component: VhclAnlsOld
    }
  ]
})