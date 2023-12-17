<template>
    <div class="home">
        <div class="main-container">
            <div class="backhome" @click="backhome">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
                <span>Back</span>
            </div>
            <div class="emoji">
                <div class="image"><img :src="url" alt="">
                    <div class="operate">
                        <a @click="starEmoji(emojiID)"><el-icon>
                                <Star />
                            </el-icon> {{ favorites }}</a>
                        <a @click="downloadEmoji(url, emojiID)"><el-icon>
                                <Download />
                            </el-icon> {{ downloads }}</a>
                    </div>
                    <el-divider></el-divider>
                    <div class="discussion" v-infinite-scroll="loadcomment">
                        <div class="wrapper">
                            <i class="avatar" v-bind:style="{ backgroundImage: 'url(' + userdata.profilePhoto + ')' }"></i>
                            <textarea id="tx" ref="tx" placeholder="Send a friendly comment" rows="2" maxlength="50"
                                @focus="handlefocus" @blur="handleblur" @input="handleinput"
                                @keyup.enter="handlekeyup()"></textarea>
                            <button @click="handlekeyup">Send</button>
                        </div>
                        <div class="wrapper">
                            <span class="total" ref="total">0/50字</span>
                        </div>
                        <div class="list" v-for="(comment, cindex) in commentlist" :key="comment.id">
                            <div class="item" ref="item" style="display: block;">
                                <i class="avatar" v-bind:style="{ backgroundImage: 'url(' + comment.profilePhoto + ')' }"
                                    style="display: block;float: left;"></i>
                                <div class="info">
                                    <p class="name">{{ comment.username }}</p>
                                    <p class="text" ref="text">{{ comment.content }}</p>
                                    <span class="time">{{ comment.createTime }}</span>
                                    <span class="replybutton" @click="handlesubreply(comment.id)">reply</span>
                                </div>
                                <div class="sublist" v-for="subreply in comment.subreplylist">
                                    <div class="item" ref="item" style="display: block;">
                                        <i class="avatar"
                                            v-bind:style="{ backgroundImage: 'url(' + subreply.profilePhoto + ')' }"></i>
                                        <div class="info">
                                            <p class="name">{{ subreply.username }}</p>
                                            <p class="text" ref="text">{{ subreply.content }}</p>
                                            <span class="time">{{ subreply.createTime }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="pagination-block">
                                    <el-pagination v-if="ifsubpig(comment)" layout="prev, pager, next"
                                        v-model:current-page="defaultsubpage[cindex]" v-model:page-size="defaultsubreplyPS"
                                        :total="getTotalsubreply(comment)" :background="false" small
                                        @current-change="(val) => handleSubreplyCurrentChange(cindex, comment, val)"
                                        class="subreplypagination" />
                                </div>
                                <div class="replytext" style="display:block" v-if="comment.replying">
                                    <i class="avatar" style="display: block;"
                                        v-bind:style="{ backgroundImage: 'url(' + userdata.profilePhoto + ')' }"></i>
                                    <textarea ref="subtx" id="subtx" placeholder="Send a friendly comment" rows="2"
                                        maxlength="50" v-model="subreplytext"></textarea>
                                    <button @click="submitsubreply(comment.id, comment)">Send</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <el-divider direction="vertical" style="height: auto;"></el-divider>
                <div class="AuthorInformation">
                    <div class="information">
                        <div class="left" @click="navigateToAuthorProfile(authordata.id)">
                            <a><img :src="authordata.profilePhoto" alt=""></a>
                        </div>
                        <div class="right">
                            <h style="font-size:1.5vw">name:{{ authordata.username }}</h>
                            <div>signature:{{ authordata.signature }}</div>
                        </div>
                        <el-divider></el-divider>
                        <div>You may like:</div>
                        <div class="relatedemoji">
                            <a v-for="(item, index) in dataList" :key="index"><img @click="getemojidata(item.id)"
                                    :src="item.url">
                            </a>
                        </div>
                    </div>
                </div>
                <div></div>
            </div>
        </div>
    </div>
</template>
<script setup>
import { ArrowLeft } from '@element-plus/icons-vue'
import { Star } from '@element-plus/icons-vue';
import { Download } from '@element-plus/icons-vue';
import { ElMessage } from 'element-plus';
</script >
<script>
import axios from 'axios';
import Service from '@/utils/request';
export default {
    data() {
        return {
            emojiID: '',
            createUser: '',
            url: '',
            favorites: '',
            downloads: '',
            similarList: '',
            dataList: [], // 存储返回的数据
            lastScrollTime: '',
            authordata: {
                createTime: '',
                email: '',
                gender: '',
                id: '',
                isOfficial: '',
                profilePhoto: '',
                signature: '',
                username: '',
                hits: '',
            },
            userdata: '',
            commentlist: [],
            commenttotal: 0,
            subreplytext: '',
            defaultsubpage: [],
            defaultsubreplyPS: 3,
            commentPageSize: 5,
            allcomment: []
        }
    },
    mounted() {
        this.getuserdata()
        this.getemojiInformation()
            .then(() => this.getauthordata())
            .then(() => this.getsimilaremoji());
        this.getcommentlist();
        window.scrollTo(0, 0);
    },
    watch: {
        '$route.query.id'(newId, oldId) {
            if (newId !== oldId && newId !== undefined) {
                // 路由参数变化时的处理逻辑
                window.scrollTo(0, 0);
                this.emojiID = newId;
                this.getemojiInformation()
                    .then(() => this.getauthordata())
                    .then(() => this.getsimilaremoji());
                this.getcommentlist()
            }
        },

    },
    created() {
        this.getParams()
    },
    methods: {
        getParams() {
            const routerParams = this.$route.query.id
            this.emojiID = routerParams
            // console.log(this.emojiID)
        },
        async getemojiInformation() {
            return new Promise((resolve, reject) => {
                Service.get('/emoji/' + this.emojiID)
                    .then((response) => {
                        // console.log(response);
                        if (response.code === 1) {
                            this.url = response.data.url;
                            // console.log(this.url)
                            this.favorites = response.data.favorite;
                            this.downloads = response.data.downloads;
                            this.hits = response.data.hits;
                            this.createUser = response.data.createUser;
                            this.similarList = response.data.similarList
                            resolve(); // 操作成功时，调用 resolve() 来完成 Promise
                        } else {
                            reject('获取表情信息时发生错误'); // 操作失败时，调用 reject() 并提供错误信息
                        }
                    })
                    .catch((error) => {
                        reject(error); // 捕获到错误时，调用 reject() 并提供错误信息
                    });
            });
        },
        initsubreplypage() {
            for (let i = 0; i < this.commentlist.length; i++) {
                this.defaultsubpage[i] = 1
            }
        },
        async getuserdata() {
            this.ID = localStorage.getItem('ID')
            // console.log(this.ID)
            await Service.get('/user/' + this.ID).then((response) => {
                // console.log(response);
                if (response.code === 1) {
                    this.userdata = response.data;
                    // console.log(this.userdata)
                }
            }).catch(error => {
                // console.log(error);
            });
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
            Service.get('/user/' + this.createUser).then((response) => {
                // console.log(response);
                if (response.code === 1) {
                    this.authordata = response.data;
                    // console.log(this.userdata)
                }
            }).catch(error => {
                // console.log(error);
            });
        },
        backhome() {
            this.$router.go(-1);
        },
        getemojidata(id) {
            this.$router.push({
                path: '/emoji',
                query: { id: id }
            });

        },
        async getsimilaremoji() {
            // 使用axios获取数据
            await Service.get('/emoji/similar', {
                params: {
                    similarList: this.similarList
                }
            }).then(response => {
                // console.log(response)
                if (response.code === 1) {
                    this.dataList = response.data;
                } else {
                    // 处理错误情况
                    // console.error('请求失败：' + response.msg);
                }
            }).catch(error => {
                // console.error('请求出错：' + error);
            });
        },
        starEmoji(id) {
            axios.interceptors.request.use((config) => {
                if (localStorage.getItem('Authorization')) {
                    config.headers.Authorization = localStorage.getItem('Authorization')
                }
                return config;
            }, (error) => {
                return Promise.reject(error);
            });
            Service.post(`/favorite?emojiId=${id}`).then((response) => {
                // console.log(response)
                if (response.code === 1) {
                    this.favorites += 1;
                    // console.log(this.favorites);
                    ElMessage.success('Successfully star!')
                } else {
                    // 处理错误情况
                    ElMessage.error('You have already stared the emoji!')
                }
            }).catch(error => {
                ElMessage.error('Please login first!')
            });

        },
        downloadEmoji(url, id) {
            if (localStorage.getItem('Authorization')) {
                axios.interceptors.request.use((config) => {
                    if (localStorage.getItem('Authorization')) {
                        config.headers.Authorization = localStorage.getItem('Authorization')
                    }
                    return config;
                }, (error) => {
                    return Promise.reject(error);
                });
                Service.put(`/emoji/download?emojiId=${id}`
                ).then((response) => {
                    // console.log(response)
                    if (response.code == 1) {
                        this.downloads += 1;
                    }
                })
                const link = document.createElement('a');
                link.href = url;
                link.download = 'emoji_image'; // 下载文件的默认名称
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
            else {
                ElMessage.error('Please login first!')
            }
        },
        navigateToAuthorProfile(id) {
            this.$router.push({
                path: '/author',
                query: { id: id }
            });
        },
        handlefocus() {
            this.$refs.total.style.opacity = 1;
            for (let i = 0; i < this.commentlist.length; i++) {
                this.commentlist[i].replying = false
            }
        },
        handleblur() {
            this.$refs.total.style.opacity = 0;
        },
        handleinput() {
            this.$refs.total.innerHTML = `${this.$refs.tx.value.length}/50字`
        },
        handlekeyup() {
            if (localStorage.getItem('Authorization') == null) {
                ElMessage.error('Please login first!')
            }
            else {
                if (this.$refs.tx.value.trim()) {
                    // console.log(this.$refs.tx.value)
                    Service.post('/comment', {
                        emojiId: this.emojiID,
                        content: this.$refs.tx.value
                    }).then((response) => {
                        ElMessage.success('comment successfully')
                        this.getcommentlist()
                    }).catch(error => {
                        // console.log(error)
                    })

                }
                // 等按下回车，结束，清空文本域
                this.$refs.tx.value = ''
                // 按下回车之后，就要把 字符统计 复原
                this.$refs.total.innerHTML = '0/50字'
            }

        },
        async getcommentlist() {
            await Service.get('/comment/' + this.emojiID, {
                params: {
                    page: 1,
                    pageSize: this.commentPageSize
                }

            }).then(response => {
                if (response.code === 1) {

                    this.commentlist = response.data.records
                    this.commenttotal = response.data.total
                    for (let i = 0; i < this.commentlist.length; i++) {
                        this.commentlist[i].replying = false;
                    }
                    this.initsubreplypage()
                    this.getsubreply()
                } else {

                }
                // }).catch(error => {
                //     console.error('请求出错：' + error);
            });
        },
        async getsubreply() {
            for (let i = 0; i < this.commentlist.length; i++) {
                const comment = this.commentlist[i]
                await Service.get('/comment/reply/' + comment.id, {
                    params: {
                        page: this.defaultsubpage[i],
                        pageSize: this.defaultsubreplyPS
                    }
                }).then((response) => {
                    if (response.data.records) {
                        this.commentlist[i].subreplylist = response.data.records
                        this.commentlist[i].subreplytotal = response.data.total
                    }
                    else {
                        this.commentlist[i].subreplylist = []
                        this.commentlist[i].subreplytotal = 0
                    }
                })
            }
        },
        async changesubreplypage(index, page_, pageSize_) {
            // console.log(this.commentlist[index])
            await Service.get('/comment/reply/' + this.commentlist[index].id, {
                params: {
                    page: page_,
                    pageSize: pageSize_
                }
            }).then((response) => {
                if (response.data.records) {
                    this.commentlist[index].subreplylist = response.data.records
                    this.commentlist[index].subreplytotal = response.data.total
                }
                else {
                    this.commentlist[index].subreplylist = []
                    this.commentlist[index].subreplytotal = 0
                }
            })
        },
        handlesubreply(commentID) {
            for (let i = 0; i < this.commentlist.length; i++) {
                this.commentlist[i].replying = commentID === this.commentlist[i].id
            }
        },
        submitsubreply(commentID, comment) {
            if (localStorage.getItem('Authorization') == null) {
                ElMessage.error('Please login first!')
            }
            else {
                if (this.subreplytext.trim()) {
                    // console.log(this.subreplytext)
                    Service.post('/comment/reply', {
                        emojiId: this.emojiID,
                        commentId: commentID,
                        content: this.subreplytext
                    }).then((response) => {
                        ElMessage.success('comment successfully')
                    }).catch(error => {
                        // console.log(error)
                    })

                }
                this.subreplytext = ''

                this.getcommentlist()
            }
        },
        getTotalsubreply(comment) {
            return comment.subreplytotal
        },
        ifsubpig(comment) {
            if (comment.subreplytotal === 0) {
                return false
            }
            return true
        },
        handleSubreplyCurrentChange(cindex, comment, val) {
            this.defaultsubpage[cindex] = val
            this.changesubreplypage(cindex, val, this.defaultsubreplyPS)
        },
        async appendcomment() {
            for (let i = 1; i > 0; i--) {
                if (this.commentPageSize + i <= this.commenttotal) {
                    await Service.get('/comment/' + this.emojiID, {
                        params: {
                            page: this.commentPageSize + i,
                            pageSize: 1
                        }

                    }).then(response => {
                        if (response.code === 1) {
                            this.commentlist.push(...response.data.records)
                            for (let i = 0; i < this.commentlist.length; i++) {
                                this.commentlist[i].replying = false;
                            }
                            this.initsubreplypage()
                            const currentcommentindex = this.commentlist.length - 1
                            const currentcomment = this.commentlist[currentcommentindex]
                            Service.get('/comment/reply/' + currentcomment.id, {
                                params: {
                                    page: this.defaultsubpage[currentcommentindex],
                                    pageSize: this.defaultsubreplyPS
                                }
                            }).then((response) => {
                                if (response.data.records) {
                                    this.commentlist[currentcommentindex].subreplylist = response.data.records
                                    this.commentlist[currentcommentindex].subreplytotal = response.data.total
                                }
                                else {
                                    this.commentlist[currentcommentindex].subreplylist = []
                                    this.commentlist[currentcommentindex].subreplytotal = 0
                                }
                            })
                        } else {
                        }
                    }).catch(error => {
                        // console.error('请求出错：' + error);
                    });
                }
            }

        },
        async loadcomment() {
            if (this.commentPageSize < this.commenttotal) {
                this.appendcomment()
                this.commentPageSize += 1;
                //this.getcommentlist()
            }
        }
    }
}
</script>
<style scoped>
* {
    font-family: 'Oswald', sans-serif;
}

.home {
    font-family: 'Oswald', sans-serif;
    /* min-height: 110vh; */
    width: 100%;
    display: flex;
    background-image: -moz-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

    background-image: -webkit-linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));

    background-image: linear-gradient(135deg, rgb(134, 134, 249), rgb(255, 247, 87));
}

.main-container {
    width: 84%;
    /* 设置宽度为页面宽度的80% */
    margin: 0 auto;
    /* 居中对齐 */
    padding: 10px;
    /* 设置内边距 */
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    /* 添加阴影效果 */
    border-radius: 10px;
    background-image: -moz-linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

    background-image: -webkit-linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

    background-image: linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

}

.main-container .emoji {
    min-height: 150vh;
    display: flex;
}

/* .main-container .emoji .image {
    margin-top: 20px;
    width: 50vw;
    height: 40vw;
}

.main-container .emoji .image img {
    width: 60%;
    height: 100%;
    display: block;
    margin: 0 auto;
} 
*/
.main-container .emoji .image {
    margin-top: 20px;
    width: 50vw;
    /* 设置固定宽度 */

    position: relative;
    /* 让内部元素相对于此容器定位 */
}

.main-container .emoji .image img {
    width: 60%;
    /* 图像宽度占满容器 */

    height: auto;
    /* 高度自适应 */

    display: block;
    /* 确保图像是块级元素 */

    /* position: absolute; */
    /* 绝对定位，相对于父容器 */

    top: 0;
    left: 0;
    /* 将图像定位在容器的左上角 */

    bottom: 0;
    right: 0;
    /* 将图像的底部和右侧与容器的底部和右侧对齐 */
    margin: 0 auto;
}


.main-container .emoji .AuthorInformation .information {
    width: 30vw;
    margin-top: 20px;
    /* min-height: 100vh; */
    /* display: flex; */
    justify-content: left;
}

.main-container .emoji .AuthorInformation .information .left {
    margin-right: 1.5%;
    width: 10vh;
    cursor: pointer;
}

.main-container .emoji .AuthorInformation .information .right {
    /* width: 5vw; */
    display: grid;
    font-family: 'Oswald';
}

.main-container .emoji .AuthorInformation .information .left a {
    width: 5vw;
    height: 5vw;
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

.main-container .emoji .AuthorInformation .information .left a img {
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

.main-container .emoji .AuthorInformation .data {
    margin-top: 10px;
}

.main-container .emoji .AuthorInformation .data a {
    margin-right: 20px;
}

.operate {
    margin-left: 20%;
    display: flex;
    font-size: 15px;
    /* margin-top: 10px; */
}

.operate a {
    cursor: pointer;
    margin-top: 20px;
    margin-right: 4%;
}

.main-container .backhome {
    cursor: pointer;
    top: 10px
}

.backhome span {
    font-size: 20px;
}

.relatedemoji {
    margin-top: 10px;
    display: flex;
    flex-wrap: wrap;
    width: 100%;
}

.relatedemoji a {
    width: 20vw;
    height: 24vh;
    margin-top: 15px;
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

.relatedemoji a:hover {
    transform: translateY(-8px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.relatedemoji a img {
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


@media (max-width: 800px) {
    .AuthorInformation {
        display: none;
    }

    .el-divider--vertical {
        display: none;
    }

    .discussion {
        display: none;
    }

    .image {
        width: 100vw !important;
        height: 45vw !important;
    }
}

.wrapper {
    min-width: 400px;
    max-width: 800px;
    display: flex;
    justify-content: flex-end;
}

.avatar {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    overflow: hidden;
    background: no-repeat center / cover;
    margin-right: 20px;
}

.wrapper textarea {
    outline: none;
    border-color: transparent;
    resize: none;
    background: #f5f5f5;
    border-radius: 4px;
    flex: 1;
    padding: 10px;
    transition: all 0.5s;
    height: 60px;
}

.wrapper textarea:focus {
    border-color: #e4e4e4;
    background: #fff;
    height: 80px;
}

.wrapper button {
    background: #00aeec;
    color: #fff;
    border: none;
    border-radius: 4px;
    margin-left: 10px;
    width: 70px;
    cursor: pointer;
}

.wrapper .total {
    margin-right: 80px;
    color: #999;
    margin-top: 5px;
    opacity: 0;
    transition: all 0.5s;
}

.list {
    min-width: 400px;
    max-width: 800px;
    display: flex;
}

.list .item {
    width: 100%;
    display: flex;
}

.list .item .info {
    flex: 1;
    border-bottom: 1px dashed #e4e4e4;
    padding-bottom: 10px;
}

.list .item p {
    margin: 0;
}

.list .item .name {
    color: #FB7299;
    font-size: 14px;
    font-weight: bold;
}

.list .item .text {
    color: #333;
    padding: 10px 0;
}

.list .item .time {
    color: #999;
    font-size: 12px;
}

.list .item .replybutton {
    padding-left: 10px;
    color: #999;
    font-size: 14px;
    cursor: pointer;
}

.replytext {
    padding-left: 70px;
    min-width: 300px;
    max-width: 600px;
    display: flex;
    justify-content: flex-end;
}

.replytext .avatar {
    display: block;
    float: left;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    background: no-repeat center / cover;
    margin-right: 20px;
}

.replytext textarea {
    outline: none;
    border-color: transparent;
    resize: none;
    background: #f5f5f5;
    border-radius: 4px;
    min-width: 400px;
    max-width: 600px;
    flex: 1;
    padding: 10px;
    transition: all 0.5s;
    height: 50px;
}

.replytext textarea:focus {
    border-color: #e4e4e4;
    background: #fff;
}

.replytext button {
    background: #00aeec;
    color: #fff;
    border: none;
    border-radius: 4px;
    margin-left: 10px;
    min-height: 40px;
    max-height: 60px;
    float: right;
    margin-top: 5px;
    width: 60px;
    cursor: pointer;
}

.replytext .total {
    margin-right: 80px;
    color: #999;
    margin-top: 5px;
    opacity: 0;
    transition: all 0.5s;
}

.sublist {
    min-width: 300px;
    max-width: 400px;
    padding-left: 70px;
    display: flex;
}

.sublist .avatar {
    display: block;
    float: left;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    overflow: hidden;
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    margin-right: 20px;
}

.sublist .item {
    width: 100%;
    display: flex;
    margin-top: 5px;
}

.sublist .item .info {
    flex: 1;
    border-bottom: 1px dashed #e4e4e4;
    padding-bottom: 10px;
}

.sublist .item p {
    margin: 0;
}

.sublist .item .name {
    color: #FB7299;
    font-size: 14px;
    font-weight: bold;
}

.sublist .item .text {
    color: #333;
    padding: 10px 0;
}

.sublist .item .time {
    color: #999;
    font-size: 12px;
}

.subreplypagination {
    padding-left: 70px;
}

::v-deep .el-select-dropdown__item li {
    background-color: transparent !important;
}

::v-deep .el-pagination .btn-next,
::v-deep .el-pagination .btn-prev {
    background: transparent !important;
    background-color: transparent !important;
}

::v-deep .el-pagination button:disabled {
    background-color: transparent !important;
}

::v-deep .el-pager li {
    background-color: transparent !important;
}

::v-deep .el-pager li.active {
    color: #267aff !important;
}
</style>