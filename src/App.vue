<template>
  <div id="app">
    <!--<TodoList />-->
    <VhclRpt/>
  </div>
</template>

<script>
//import TodoList from './components/TodoList.vue'
import VhclRpt from './components/VhclRpt.vue'

export default {
  name: 'App',
  components: {
    //TodoList
    VhclRpt
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

#app {
  min-height: 100vh;
}
</style>
