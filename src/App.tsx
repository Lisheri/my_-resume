import { defineComponent } from 'vue'
import { RouterView } from 'vue-router'
import './App.css'
// import './styles/icon.css'

export default defineComponent({
  name: 'App',
  setup() {
    return () => (
      <div id="app">
        <RouterView />
      </div>
    )
  }
}) 