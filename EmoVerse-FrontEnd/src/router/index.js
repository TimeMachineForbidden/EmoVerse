import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '../views/Login.vue'
import Upload from '../views/Upload.vue'
import icon from '../components/icon.vue'
import Trend from '../views/HomeSons/Trend.vue'
import New from '../views/HomeSons/New.vue'
import Animated from '../views/HomeSons/Animated.vue'
import Static from '../views/HomeSons/Static.vue'
import User from '../views/User.vue'
import UserStar from '../views/UserSons/UserStar.vue'
import UserSettings from '../views/UserSons/UserSettings.vue'
import UserUpload from '../views/UserSons/UserUpload.vue'
import Author from '../views/Author.vue'
import AuthorCreate from '../views/AuthorSons/AuthorCreate.vue'
import AuthorStar from '../views/AuthorSons/AuthorStar.vue'
import Emoji from '../views/HomeSons/Emoji.vue'
import Search from '../views/HomeSons/Search.vue'
const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    redirect: '/trend',
    children: [
      {
        path: '/trend',
        name: 'trend',
        component: Trend
      },
      {
        path: '/new',
        name: 'new',
        component: New
      },
      {
        path: '/animated',
        name: 'animated',
        component: Animated
      },
      {
        path: '/static',
        name: 'static',
        component: Static
      },
      {
        path:'/emoji',
        name:'emoji',
        component:Emoji,
      },
      {
        path:'/search',
        name:'search',
        component:Search
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path:'/user',
    name:'user',
    component: User,
    redirect: '/userupload',
    children:[
      {
        path:"/userstar",
        name:'userstar',
        component:UserStar,
      },
      {
        path:"/userupload",
        name:'userupload',
        component:UserUpload,
      },
      {
        path:"/usersettings",
        name:'usersettings',
        component:UserSettings,
      }
    ]
  },
  {
    path: "/icon",
    name: 'icon',
    component: icon
  }, 
  {
    path: '/upload',
    name: 'upload',
    component: Upload
  },
  {
    path:"/author",
    name:'author',
    component:Author,
    redirect:'/authorcreate',
    children:[
      {
        path:"/authorstar",
        name:'authorstar',
        component:AuthorStar,
      },
      {
        path:"/authorcreate",
        name:'authorcreate',
        component:AuthorCreate,
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// router.beforeEach((to, from, next) => {
//   if (to.path === '/login') {
//     next();
//   } else {
//     if (to.path === '/aaa') {
//       let token = localStorage.getItem('Authorization');
//       console.log(token + 'token aaaa')
//       if (token === null || token === '') {
//         console.log(token)
//         next('/login');
//       } else {
//         next();
//       }
//     }
//     else {
//       next();
//     }
//   }
// });
export default router
