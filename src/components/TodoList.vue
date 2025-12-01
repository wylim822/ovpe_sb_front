<template>
  <div class="todo-container">
    <h1>Todo List</h1>
    
    <!-- Todo 추가 폼 -->
    <div class="todo-form">
      <input
        v-model="newTodo.title"
        type="text"
        placeholder="할 일 제목을 입력하세요"
        class="todo-input"
        @keyup.enter="addTodo"
      />
      <textarea
        v-model="newTodo.description"
        placeholder="설명을 입력하세요 (선택사항)"
        class="todo-textarea"
      ></textarea>
      <button @click="addTodo" class="btn-add">추가</button>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading">로딩 중...</div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="error">{{ error }}</div>

    <!-- Todo 목록 -->
    <div class="todo-list">
      <div
        v-for="todo in todos"
        :key="todo.id"
        :class="['todo-item', { completed: todo.completed }]"
      >
        <div class="todo-content">
          <button
            @click="toggleTodo(todo.id, $event)"
            class="btn-complete"
            :class="{ 'btn-completed': todo.completed }"
          >
            {{ todo.completed ? '완료취소' : '완료' }}
          </button>
          <div class="todo-text">
            <h3 :class="{ 'todo-title-completed': todo.completed }">
              {{ todo.title }}
            </h3>
            <p v-if="todo.description" class="todo-description">
              {{ todo.description }}
            </p>
            <small class="todo-date">
              생성: {{ formatDate(todo.createdAt) }}
              <span v-if="todo.updatedAt && todo.updatedAt !== todo.createdAt">
                | 수정: {{ formatDate(todo.updatedAt) }}
              </span>
            </small>
          </div>
        </div>
        <div class="todo-actions">
          <button @click="editTodo(todo)" class="btn-edit">수정</button>
          <button @click="deleteTodo(todo.id)" class="btn-delete">삭제</button>
        </div>
      </div>
      
      <div v-if="todos.length === 0 && !loading" class="empty-message">
        할 일이 없습니다. 새로운 할 일을 추가해보세요!
      </div>
    </div>

    <!-- 수정 모달 -->
    <div v-if="editingTodo" class="modal-overlay" @click="cancelEdit">
      <div class="modal-content" @click.stop>
        <h2>Todo 수정</h2>
        <input
          v-model="editingTodo.title"
          type="text"
          placeholder="할 일 제목"
          class="todo-input"
        />
        <textarea
          v-model="editingTodo.description"
          placeholder="설명"
          class="todo-textarea"
        ></textarea>
        <div class="modal-actions">
          <button @click="saveEdit" class="btn-save">저장</button>
          <button @click="cancelEdit" class="btn-cancel">취소</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import todoApi from '../services/todoApi'

export default {
  name: 'TodoList',
  data() {
    return {
      todos: [],
      newTodo: {
        title: '',
        description: ''
      },
      editingTodo: null,
      loading: false,
      error: null
    }
  },
  mounted() {
    this.fetchTodos()
  },
  methods: {
    async fetchTodos() {
      this.loading = true
      this.error = null
      try {
        const response = await todoApi.getAllTodos()
        this.todos = response.data
      } catch (error) {
        this.error = 'Todo 목록을 불러오는데 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error fetching todos:', error)
      } finally {
        this.loading = false
      }
    },
    async addTodo() {
      if (!this.newTodo.title.trim()) {
        alert('제목을 입력해주세요.')
        return
      }

      try {
        const response = await todoApi.createTodo({
          title: this.newTodo.title,
          description: this.newTodo.description,
          completed: false
        })
        this.todos.push(response.data)
        this.newTodo = { title: '', description: '' }
      } catch (error) {
        this.error = 'Todo 추가에 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error creating todo:', error)
      }
    },
    async toggleTodo(id, event) {
      // 이벤트 기본 동작 방지 (체크박스 자동 토글 방지)
      event.preventDefault()
      
      // 즉시 화면에 반영
      const index = this.todos.findIndex(todo => todo.id === id)
      if (index === -1) return
      
      const originalCompleted = this.todos[index].completed
      // 즉시 상태 변경 - Vue의 반응성 시스템이 즉시 화면을 업데이트
      this.$set(this.todos[index], 'completed', !originalCompleted)
      
      try {
        // 서버에 상태 변경 요청 (비동기로 처리)
        const response = await todoApi.toggleTodoStatus(id)
        // 서버 응답으로 최종 상태 업데이트
        this.$set(this.todos, index, response.data)
      } catch (error) {
        // 실패 시 원래 상태로 되돌림
        this.$set(this.todos[index], 'completed', originalCompleted)
        this.error = '상태 변경에 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error toggling todo:', error)
        alert('상태 변경에 실패했습니다. 다시 시도해주세요.')
      }
    },
    editTodo(todo) {
      this.editingTodo = {
        id: todo.id,
        title: todo.title,
        description: todo.description || '',
        completed: todo.completed
      }
    },
    async saveEdit() {
      if (!this.editingTodo.title.trim()) {
        alert('제목을 입력해주세요.')
        return
      }

      try {
        const response = await todoApi.updateTodo(this.editingTodo.id, {
          title: this.editingTodo.title,
          description: this.editingTodo.description,
          completed: this.editingTodo.completed
        })
        const index = this.todos.findIndex(todo => todo.id === this.editingTodo.id)
        if (index !== -1) {
          this.todos[index] = response.data
        }
        this.editingTodo = null
      } catch (error) {
        this.error = 'Todo 수정에 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error updating todo:', error)
      }
    },
    cancelEdit() {
      this.editingTodo = null
    },
    async deleteTodo(id) {
      if (!confirm('정말 삭제하시겠습니까?')) {
        return
      }

      try {
        await todoApi.deleteTodo(id)
        this.todos = this.todos.filter(todo => todo.id !== id)
      } catch (error) {
        this.error = 'Todo 삭제에 실패했습니다: ' + (error.message || '알 수 없는 오류')
        console.error('Error deleting todo:', error)
      }
    },
    formatDate(dateString) {
      if (!dateString) return ''
      const date = new Date(dateString)
      return date.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }
}
</script>

<style scoped>
.todo-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

h1 {
  text-align: center;
  color: #2c3e50;
  margin-bottom: 30px;
}

.todo-form {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.todo-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.todo-textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  min-height: 80px;
  margin-bottom: 10px;
  resize: vertical;
  box-sizing: border-box;
  font-family: inherit;
}

.btn-add {
  background: #42b983;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background 0.3s;
}

.btn-add:hover {
  background: #35a372;
}

.loading {
  text-align: center;
  padding: 20px;
  color: #666;
}

.error {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 4px;
  margin-bottom: 20px;
  border: 1px solid #fcc;
}

.todo-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.todo-item {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.todo-item:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.todo-item.completed {
  opacity: 0.7;
  background: #f5f5f5;
}

.todo-content {
  display: flex;
  gap: 15px;
  flex: 1;
}

.btn-complete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: bold;
  transition: all 0.3s;
  background: #42b983;
  color: white;
  white-space: nowrap;
}

.btn-complete:hover {
  background: #35a372;
}

.btn-complete.btn-completed {
  background: #95a5a6;
}

.btn-complete.btn-completed:hover {
  background: #7f8c8d;
}

.todo-text {
  flex: 1;
}

.todo-text h3 {
  margin: 0 0 8px 0;
  color: #2c3e50;
  font-size: 18px;
}

.todo-title-completed {
  text-decoration: line-through;
  color: #999;
}

.todo-description {
  color: #666;
  margin: 8px 0;
  line-height: 1.5;
}

.todo-date {
  color: #999;
  font-size: 12px;
}

.todo-actions {
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s;
}

.btn-edit {
  background: #3498db;
  color: white;
}

.btn-edit:hover {
  background: #2980b9;
}

.btn-delete {
  background: #e74c3c;
  color: white;
}

.btn-delete:hover {
  background: #c0392b;
}

.empty-message {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 16px;
}

/* 모달 스타일 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
}

.modal-content h2 {
  margin-top: 0;
  margin-bottom: 20px;
  color: #2c3e50;
}

.modal-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
  margin-top: 20px;
}

.btn-save {
  background: #42b983;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-save:hover {
  background: #35a372;
}

.btn-cancel {
  background: #95a5a6;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
}

.btn-cancel:hover {
  background: #7f8c8d;
}
</style>

