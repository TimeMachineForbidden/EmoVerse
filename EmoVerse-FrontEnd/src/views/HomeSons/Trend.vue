<template>
    <div class="trendcontent">
        <a v-for="(item, index) in dataList" :key="index"><img @click="getemojidata(item.id)" :src="item.url" alt="">
            <span>
                <div class="author" @click="navigateToAuthorProfile(item.createUser)">author</div>
                <el-icon @click="navigateToAuthorProfile(item.createUser)" style=" top: 4.6px; color: white;">
                    <User />
                </el-icon>
                <div class="star" @click="starEmoji(item.id)"> star</div>
                <el-icon @click="starEmoji(item.id)" style=" top: 4.6px; color: white;">
                    <Star />
                </el-icon>
                <div class="download" @click="downloadEmoji(item.url)"> download </div>
                <el-icon @click="downloadEmoji(item.url)" style="top: 4.6px; color: white;">
                    <Download />
                </el-icon>
            </span>
        </a>
    </div>
</template>
<script setup>
import { Star } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
import { Download } from '@element-plus/icons-vue';
import { User } from '@element-plus/icons-vue';
</script>
<script>
import Service from '@/utils/request';
import axios from 'axios';
export default {
    data() {
        return {
            page: 1,
            dataList: [], // 存储返回的数据
            lastScrollTime: '',
        };
    },
    mounted() {
        this.getfirstemoji();
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        getfirstemoji() {
            Service.get('/query/popular', {
                params: {
                    page: 1,
                    pageSize: 20
                }

            }).then(response => {
                if (response.code === 1) {
                    this.dataList = response.data.records;
                } else {
                    // 处理错误情况
                    // console.error('请求失败：' + response.msg);
                }
            }).catch(error => {
                // console.error('请求出错：' + error);
            });
        },
        getnextemoji() {
            Service.get('/query/popular', {
                params: {
                    page: this.page,
                    pageSize: 10
                }

            }).then(response => {
                // console.log(response)
                if (response.code === 1) {
                    this.dataList = this.dataList.concat(response.data.records);
                    // console.log(this.dataList.length)
                } else {
                    // 处理错误情况
                    // console.error('请求失败：' + response.msg);
                }
            }).catch(error => {
                // console.error('请求出错：' + error);
            });
        },
        handleScroll() {
            const scrollY = window.scrollY;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const scrollPercentage = (scrollY / (documentHeight - windowHeight)) * 100;
            if (scrollPercentage >= 95) {
                const currentTime = new Date().getTime();
                if (!this.lastScrollTime || (currentTime - this.lastScrollTime) > 500) {
                    this.page++;
                    // 滚动到底部，执行返回操作
                    this.getnextemoji();

                    window.scrollTo(0, windowHeight * ((this.page - 2) * 10 + 20 / (this.page - 1) * 10 + 20));

                    this.lastScrollTime = currentTime;
                }
            }
        },
        navigateToAuthorProfile(id) {
            this.$router.push({
                path: '/author',
                query: { id: id }
            });
        },
        getemojidata(id) {
            this.$router.push({
                path: '/emoji',
                query: { id: id }
            });

        },
        starEmoji(id) {
            axios.interceptors.request.use((config) => {
                if (localStorage.getItem('Authorization')) {
                    config.headers.authorization = localStorage.getItem('Authorization')
                }
                return config;
            }, (error) => {
                return Promise.reject(error);
            });
            Service.post(`/favorite?emojiId=${id}`).then((response) => {
                // console.log(response)
                if (response.code === 1) {
                    ElMessage.success('Successfully star!')
                } else {
                    // 处理错误情况
                    ElMessage.error('You have already stared the emoji!')
                }
            }).catch(error => {
                ElMessage.error('Please login first!')
            });

        },
        downloadEmoji(url) {
            if (localStorage.getItem('Authorization')) {
                const link = document.createElement('a');
                link.href = url;
                // console.log(url);
                link.download = 'emoji_image'; // 下载文件的默认名称
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            else {
                ElMessage.error('Please login first!')
            }
        }
    },
}
</script>
<style scoped>
* {
    font-family: 'Oswald', sans-serif;
}

.trendcontent {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 84%;
    background-color: white;
}

.trendcontent a {
    width: 260px;
    height: 25vh;
    margin: 15px;
    background-color: rgb(247, 247, 198);
    transition-property: transform, box-shadow;
    transition-duration: .3s, .3s;
    text-decoration: none;
    position: relative;
    /* 设置父容器为相对定位，以容纳绝对定位的图像 */
    display: block;
    /* 确保锚点元素作为块级元素显示 */
    overflow: hidden;
    /* 隐藏超出容器的内容 */
}

.trendcontent a:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.trendcontent a img {
    position: absolute;
    cursor: pointer;
    /* 图像绝对定位，相对于父容器 */
    top: 0;
    left: 0;
    width: 100%;
    /* 图像宽度填充容器 */
    height: 100%;
    /* 图像高度填充容器 */
    object-fit: cover;
    /* 以覆盖方式截取和填充图像 */
}

.trendcontent a span {
    display: none;
    position: absolute;
    height: 15%;
    width: 100%;
    top: 80%;
    left: 10px;
    background-color: rbga(0, 0, 0, .4);
    text-align: left;
    color: chartreuse;
    cursor: pointer;
    /* display: flex;
    padding: 10px; */
}

.trendcontent a:hover span {
    display: flex;
}

.trendcontent a:hover span .star {
    margin-left: 10%;
}

.trendcontent a:hover span .download {
    margin-left: 10%;
}
</style>
