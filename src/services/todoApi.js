import axios from 'axios'

const API_BASE_URL = 'http://localhost:7070/todos'

const todoApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

export default {
  // 모든 Todo 조회
  getAllTodos() {
    return todoApi.get('/')
  },

  // Todo 생성
  createTodo(todo) {
    return todoApi.post('/', todo)
  },

  // Todo 수정
  updateTodo(id, todo) {
    return todoApi.put(`/${id}`, todo)
  },

  // Todo 삭제
  deleteTodo(id) {
    return todoApi.delete(`/${id}`)
  },

  // Todo 완료 상태 토글
  toggleTodoStatus(id) {
    return todoApi.put(`/${id}/toggle`)
  }
}

