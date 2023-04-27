import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import remFixer from "./remFixer"

remFixer()
createApp(App).use(router).mount('#app')
