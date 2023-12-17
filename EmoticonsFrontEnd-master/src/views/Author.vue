<template>
    <div class="home">
        <div class="authorheader">
            <h2>Author</h2>
        </div>
        <div class="main-container">
            <div class="backhome" @click="backhome">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
                <span>Back</span>
            </div>
            <div class="AuthorInformation">
                <div class="left">
                    <a><img :src="authordata.profilePhoto" alt=""></a>
                </div>
                <div class="right">
                    <h2>name:{{ authordata.username }}</h2>
                    <div>signature:{{ authordata.signature }}</div>
                </div>
            </div>
            <div class="data">
                <a>{{ authordata.uploadCount }} uploads</a>
                <a>{{ authordata.favoriteCount }} stars</a>
            </div>
            <div class="labels">
                <a @click="authorupload(authorId)" style="cursor: pointer;">Upload</a>
                <a @click="authorstar(authorId)" style="cursor: pointer;">Star</a>
            </div>
            <div class="page-content">
                <!-- 页面内容 -->
                <router-view></router-view>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
</script >
<script>
import axios from 'axios';
import Service from '@/utils/request';
export default {
    data() {
        return {
            authorId: '',
            authordata: {
                createTime: '',
                email: '',
                gender: '',
                id: '',
                isOfficial: '',
                profilePhoto: '',
                signature: '',
                authorname: '',
                uploadCount: '',
                favoriteCount: ''
            }
        }
    },
    mounted() {
        this.getauthordata();
    },
    created() {
        this.getParams()
    },
    methods: {
        getParams() {
            const routerParams = this.$route.query.id
            this.authorId = routerParams
        },
        getauthordata() {
            axios.interceptors.request.use((config) => {
                if (localStorage.getItem('Authorization')) {
                    config.headers.Authorization = localStorage.getItem('Authorization')
                }
                return config;
            }, (error) => {
                return Promise.reject(error);
            });
            Service.get('/user/' + this.authorId).then((response) => {
                // console.log(response);
                if (response.code === 1) {
                    this.authordata = response.data;
                    // console.log(this.authordata)
                }
            }).catch(error => {
                // console.log(error);
            });
        },
        backhome() {
            this.$router.go(-1);
        },
        authorupload(id) {
            this.$router.push({
                path: '/authorcreate',
                query: { id: id }
            });
        },
        authorstar(id) {
            this.$router.push({
                path: '/authorstar',
                query: { id: id }
            });
        }
    }
}
</script>

<style scoped>
@import url('https://fonts.font.im/css?family=Quattrocento+Sans');
@import url('https://fonts.font.im/css?family=Oswald');

.home {
    min-height: 110vh;
    width: 100%;
    background-image: -moz-linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

    background-image: -webkit-linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

    background-image: linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));
}

.authorheader {
    padding: 20px;
    /* 设置内边距 */
    text-align: center;
}

.main-container {
    width: 80%;
    /* 设置宽度为页面宽度的80% */
    margin: 0 auto;
    /* 居中对齐 */
    padding: 10px;
    /* 设置内边距 */
    min-height: 80vh;
    /* 设置最小高度为110视窗高度（vh） */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
    border-radius: 10px;
    background-image: -moz-linear-gradient(125deg, rgb(0, 255, 255), rgb(240, 155, 253));

    background-image: -webkit-linear-gradient(125deg, rgb(0, 255, 255), rgb(240, 155, 253));

    background-image: linear-gradient(125deg, rgb(0, 255, 255), rgb(240, 155, 253));
}

.main-container .AuthorInformation {
    margin-left: 8%;
    display: flex;
    height: 10vh;
    justify-content: left;
}

.main-container .AuthorInformation .left {
    margin-right: 1.5%;
    width: 10vh;
}

.main-container .AuthorInformation .right {
    /* font-family: 'Quattrocento Sans', sans-serif; */
    font-family: 'Oswald', sans-serif;
    display: grid;
    align-content: flex-end;
}

.main-container .AuthorInformation .btn {
    flex-wrap: wrap;
    display: flex;
    align-content: flex-end;
    float: right;
}

.main-container .AuthorInformation .left a {
    width: 10vh;
    height: 10vh;
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

.main-container .AuthorInformation .left a img {
    position: absolute;
    border-radius: 50%;
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

.labels {
    margin-top: 10px;
    margin-left: 8%;
    font-family: 'Oswald';
}

.labels a {

    display: inline-block;
    height: 50px;
    padding: 0 35px;
    margin-right: 8px;
    font-size: 20px;
    color: black;
    text-decoration: none;
    line-height: 40px;
    border-bottom: 5px solid purple;
}

.labels a:hover {
    background-image: -moz-linear-gradient(45deg, rgb(153, 255, 245), rgb(173, 255, 201));

    background-image: -webkit-linear-gradient(45deg, rgb(153, 255, 245), rgb(173, 255, 201));

    background-image: linear-gradient(45deg, rgb(153, 255, 245), rgb(173, 255, 201));
    transition: all .2s;
}

.page-content {
    margin-top: 0px;
}

.main-container .data {
    margin-top: 10px;
    display: flex;
    font-family: 'Oswald';
    margin-left: 8%;
}

.main-container .data a {
    margin-right: 25px;
}

.main-container .backhome {
    font-family: 'Oswald';
    cursor: pointer;
    top: 10px
}

.backhome span {
    font-size: 20px;
}
</style>