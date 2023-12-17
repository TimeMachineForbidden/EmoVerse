import { createApp, createElementBlock } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { Button } from 'vant';

// window.addEventListener('beforeunload', () => {
//     // 清除名为 'Authorization' 的 localStorage 项
//     localStorage.removeItem('Authorization');
//     localStorage.removeItem('ID');
// });

// 在需要检查退出时
const lastLoginTimestamp = localStorage.getItem('loginTimestamp');

if (lastLoginTimestamp) {
  const currentTime = new Date().getTime();
  const timeSinceLastLogin = currentTime - parseInt(lastLoginTimestamp, 10);

//检查时间为5分钟
if (timeSinceLastLogin > 5 * 60 * 1000) {
    // 在用户退出时清理 localStorage
    localStorage.removeItem('Authorization');
    localStorage.removeItem('ID');
    localStorage.removeItem('Password');
}
}
createApp(App).use(store).use(router).use(ElementPlus).use(Button).mount('#app')