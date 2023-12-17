<template>
  <div class="home">
    <div :class="fixedHeaderClass">
      <div class="nav">
        <div class="icon">
          <myicon></myicon>
        </div>
        <div class="labels" v-if="!isFixed">
          <router-link to="/trend">Trend</router-link>
          <router-link to="/new">New</router-link>
          <router-link to="/animated">Live</router-link>
          <router-link to="/static">Static</router-link>
        </div>
        <div class="loginbtn" v-if="!isFixed">
          <el-button type="primary" class="navbtn" size="large" @click="upload"
            style="font-family: 'Oswald', sans-serif;font-weight: 800;width: 80px;margin-left: 12px;">Upload</el-button>
          <el-button type="primary" class="navbtn" size="large" @click="login"
            style="font-family: 'Oswald', sans-serif;font-weight: 800;width: 80px;">{{ LoginState }}</el-button>
        </div>
      </div>
      <div class="search-container" :class="{ 'fixed': isFixed }">
        <el-input @keyup.enter="search" v-model="searchcontent" placeholder="Please input" class="search-input"
          input-style="font-family: 'Oswald', sans-serif; ">
          <template #append>
            <el-button type="primary" :icon="Search" @click="search">
            </el-button>
          </template>
        </el-input>
      </div>
    </div>
    <!-- 此处放置页面内容 -->
    <div class="page-content">
      <!-- 页面内容 -->
      <router-view></router-view>
    </div>
  </div>
</template>
<script setup>
import { Search } from '@element-plus/icons-vue'
</script >

<script>
import myicon from '../components/icon.vue'
import Service from '@/utils/request';
import { ElMessage } from 'element-plus';
export default {
  components: {
    myicon
  },
  data() {
    return {
      isFixed: false,
      currentPath: '',
      kind: 1,
      searchcontent: '',
      isButtonDown: false, // 用于按钮移动特效
      LoginState: 'Login',
    };
  },
  computed: {
    fixedHeaderClass() {
      return {
        'fixed-header': this.isFixed,
        'initial-header': !this.isFixed
      };
    }
  },
  mounted() {
    window.addEventListener('scroll', this.handleScroll);
    this.isLogin();
  },
  beforeDestroy() {
    window.removeEventListener('scroll', this.handleScroll);
  },
  created() {
    // 在组件创建时获取当前路由路径并保存到data中
    this.currentPath = this.$route.path;
  },
  watch: {
    // 监听路由的变化，更新currentPath
    $route(to, from) {
      this.currentPath = to.path;
      // console.log(this.currentPath)
      if (this.currentPath == '/trend') {
        this.kind = 1
      }
      else if (this.currentPath == '/new') {
        this.kind = 4
      }
      else if (this.currentPath == '/animated') {
        this.kind = 2
      }
      else if (this.currentPath == '/static') {
        this.kind = 3
      }
    }
  },
  methods: {
    handleScroll() {
      // 检查页面滚动位置，然后更新isFixed属性来切换样式
      this.isFixed = window.scrollY > 20;
      this.isButtonDown = this.isFixed; // 根据 isFixed 更新按钮特效
    },
    search() {
      this.$router.push({
        path: '/search',
        query: {
          kind: this.kind,
          searchcontent: this.searchcontent
        }
      });
    },
    login() {
      if (localStorage.getItem('ID') == null) {
        this.$router.push('/login')
      }
      else {
        this.$router.push('/user')
      }
    },
    upload() {
      if (localStorage.getItem('ID') == null) {
        ElMessage.error('Please login first!')
      }
      else {
        this.$router.push('/upload')
      }
    },
    isLogin() {
      if (localStorage.getItem('ID') != null) {
        this.LoginState = 'User'
      }
    }
  }
};
</script>

<style scoped>
@import url('https://fonts.font.im/css2?family=Oswald&display=swap');

.home {
  font-family: 'Oswald', sans-serif;
  background-image: -moz-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

  background-image: -webkit-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

  background-image: linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));
  min-height: 150vh;
}

.fixed-header {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-image: -moz-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

  background-image: -webkit-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

  background-image: linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));
  padding: 12px 20px;
  padding-left: 8%;
  padding-right: 8%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.initial-header {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: left;
  background-image: -moz-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

  background-image: -webkit-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

  background-image: linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));
  padding: 10px 20px;
  padding-left: 8%;
  padding-right: 8%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
}

.nav {
  display: flex;
  align-items: center;
  justify-content: left;
}

.nav .labels {
  margin-left: 10px;
}

.nav .labels a {
  display: inline-block;
  height: 50px;
  padding: 0 20px;
  margin-right: 8px;
  font-size: 20px;
  color: rgb(251, 238, 238);
  text-decoration: none;
  line-height: 40px;
  border-bottom: 5px solid purple;
}

.nav .labels a:hover {
  background-image: -moz-linear-gradient(90deg, rgb(183, 16, 244), rgb(12, 188, 233));

  background-image: -webkit-linear-gradient(90deg, rgb(183, 16, 244), rgb(12, 188, 233));

  background-image: linear-gradient(90deg, rgb(183, 16, 244), rgb(12, 188, 233));
  border-top: 1px solid blue;
  transition: all .2s;
}

.nav .nav .loginbtn {
  position: absolute;
}

.search-container {
  flex-grow: 1;
  margin-top: 5px;
  transition: margin-top 0.3s ease, height 0.3s ease;
  /* 添加搜索框的过渡效果 */
  height: 60px;
  /* 初始高度 */
}



.search-container.fixed {
  padding-top: 0;
  margin-top: 0;
  margin-left: 8px;
  /* 移动到顶部时的样式 */
  height: 40px;
  /* 收缩高度 */
}

.search-container .search-input {
  border-radius: 5px;
  outline: none;
  height: 60px;
  font-family: 'Oswald', sans-serif !important;
  font-size: 19px;
}

.search-container.fixed .search-input {
  width: 100%;
  border-radius: 5px;
  outline: none;
  height: 40px;
  font-family: 'Oswald', sans-serif !important;
  font-size: 14px;
}

.page-content {
  margin-top: 0px;
  /* 保证内容不被固定头部遮挡 */
  /* 其他页面内容的样式 */
  display: flex;
  justify-content: center;
  flex-wrap: wrap;

}

@media (max-width: 800px) {

  /* .icon {
    display: none;
  } */

  .nav .labels a {
    display: inline-block;
    height: 35px;
    padding: 0 8px;
    margin-right: 4px;
    font-size: 16px;
    color: rgb(251, 238, 238);
    text-decoration: none;
    line-height: 30px;
    border-bottom: 5px solid purple;
    font-family: 'Oswald', sans-serif;
  }
}
</style>