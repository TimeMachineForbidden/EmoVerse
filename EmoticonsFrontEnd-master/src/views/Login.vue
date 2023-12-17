<template>
    <div class="login">
        <div class="loginmain">
            <div class="backward" @click="back">
                <el-icon>
                    <ArrowLeft />
                </el-icon>
                <span>Back</span>
            </div>
            <h1>EmoVerse</h1>
            <p style="font-size:20px">What's your emoji?</p>
            <div class="form-box">
                <div class="button-box">
                    <div v-color="color1" id="btn" ref="slidingbtn" v-width="width"></div>
                    <button type="button" class="toggle-btn" @click="leftClick()">Log in</button>
                    <button type="button" class="toggle-btn btnright" @click="rightClick()"> Sign Up</button>
                </div>
            </div>
            <div class="logininput" v-if="showlogin">
                <el-form ref="loginFormRef" :model="loginData" :rules="loginFormRules">
                    <el-form-item prop="username" style="margin-top:20px;margin-bottom: 30px;">
                        <el-input v-model="loginData.username" placeholder="Username" :suffix-icon="User"
                            input-style="font-family: 'Raleway', sans-serif;"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" style="margin-bottom: 20px;">
                        <el-input v-model="loginData.password" type="password" placeholder="Password" :suffix-icon="Lock"
                            input-style="font-family: 'Raleway', sans-serif;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="long-button" type="primary" @click="login">Login </el-button>

                    </el-form-item>
                    <!-- <el-form-item>
                        <el-button class="long-button lwg" type="info" @click="loginwithgoogle">Login with Google
                        </el-button>

                    </el-form-item>
                    <el-form-item>
                        <el-button class="long-button lww" type="info" @click="loginwithwechat">Login with Wechat
                        </el-button>
                    </el-form-item> -->
                    <div class="forget" @click="forget">Forget password?</div>
                    <div class="forget" @click="forget">Contact us!</div>
                    <el-form-item class="elpolicy">
                        <el-row>
                            <el-col style="text-align: center;margin-top: 6px;">
                                <span>Resources come from the internet, please contact us if there is any infringement.
                                </span>
                            </el-col>
                        </el-row>
                    </el-form-item>

                </el-form>
            </div>
            <div class="registerinput" v-else>
                <el-form ref="registerFormRef" :model="registerData" :rules="registerFormRules">
                    <el-form-item prop="username" style="margin-top:20px;margin-bottom: 30px;">
                        <el-input v-model="registerData.username" placeholder="Username"
                            input-style="font-family: 'Raleway', sans-serif;" :suffix-icon="User"></el-input>
                    </el-form-item>
                    <el-form-item prop="password" style="margin-bottom: 20px;">
                        <el-input v-model="registerData.password" type="password" placeholder="Password"
                            input-style="font-family: 'Raleway', sans-serif;" :suffix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item prop="confirmpassword" style="margin-bottom: 20px;">
                        <el-input v-model="registerData.confirmpassword" type="password" placeholder="Comfirm your password"
                            input-style="font-family: 'Raleway', sans-serif;" :suffix-icon="Lock"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button class="long-button" type="primary" @click="handleregister">Sign Up </el-button>

                    </el-form-item>
                </el-form>

            </div>
        </div>
        <div class="emopic" ref="emopicContainer">
            <video ref="myVideo" style="width:100%" :controls="false" :muted="true">
                <source :src="videoSource" type="video/mp4">
            </video>
        </div>
    </div>
</template>
<script setup>
import { User, Lock } from '@element-plus/icons-vue'
import axios from 'axios';
import { ArrowLeft } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import Service from '@/utils/request';
const registerFormRef = ref('')
const registerData = reactive({
    username: '',
    password: '',
    confirmpassword: ''
})
const validateConfirmPassword = (rule, value, callback) => {
    if (value !== registerData.password) {
        callback(new Error('Passwords do not match'));
    } else {
        callback();
    }
};
const validateUsername = (rule, value, callback) => {
    // 使用正则表达式校验用户名，不能包含"/"和"\"
    const pattern = /^[^\/\\]+$/;
    if (pattern.test(value)) {
        callback();
    } else {
        callback(new Error('Username cannot contain "/"and"\\"'));
    }
};
const registerFormRules = reactive({
    username: [
        { required: true, message: 'Please input username', trigger: 'blur' },
        { min: 4, max: 100, message: 'Length should be 4 to 100', trigger: 'blur' },
        { validator: validateUsername, trigger: 'blur' },
    ],
    password: [
        { required: true, message: 'Please input password', trigger: 'blur' },
        { min: 6, max: 100, message: 'Length should be 6 to 100', trigger: 'blur' },
        { validator: validateUsername, trigger: 'blur' },
    ],
    confirmpassword: [
        { required: true, message: 'Please input confirmpassword', trigger: 'blur' },
        { min: 4, max: 100, message: 'Length should be 4 to 100', trigger: 'blur' },
        { validator: validateConfirmPassword, trigger: 'blur' }, // 添加自定义验证函数
    ],
});
const router = useRouter()
const reloadPage = async () => {
    ElMessage.success('Successfully register!');

    // 等待一段时间，例如3秒
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 隐藏消息提示框
    ElMessage.closeAll();

    // 刷新页面
};
const handleregister = () => {
    registerFormRef.value.validate((valid) => {
        if (valid) {
            Service.post("/user/register", {
                username: registerData.username,
                password: registerData.password
            }).then(res => {
                // console.log(res.data)
                if (res.data === null) {
                    registerData.username = ''
                    registerData.password = ''
                    registerData.confirmpassword = ''
                    ElMessage.error('Username already exists!')
                }
                else if (res.data.msg === '注册成功!') {
                    location.reload();
                    reloadPage();
                    registerData.username = ''
                    registerData.password = ''
                    registerData.confirmpassword = ''
                }
                // else {
                //     registerData.username = ''
                //     registerData.password = ''
                //     registerData.confirmpassword = ''
                //     ElMessage.error('Username already exists!')
                // }
            }).catch(error => {
                // console.log(error);
            })
        }
        else {
            return
        }
    })
}
</script >

<script>
import axios from 'axios';
import Service from '@/utils/request';
import { mapMutations } from 'vuex';
export default {
    data() {
        return {
            videoSource: require('@/assets/1.mp4'),
            loginData: {
                username: '',
                password: ''
            },
            loginFormRules: {
                username: [{
                    required: true, message: "input username", trigger: 'blur'
                },
                {
                    min: 4,
                    max: 100,
                    message: 'username name should be between 4 and 100',
                },
                { validator: this.validateUsername, trigger: 'blur' }
                ],
                password: [{
                    required: true, message: "input password", trigger: 'blur'
                },
                {
                    min: 6,
                    max: 100,
                    message: 'password name should be between 6 and 100',
                },
                { validator: this.validateUsername, trigger: 'blur' }
                ]
            },
            userToken: '',
            userID: '',
            showlogin: true,
            registerFormRef: ref(''),
            registerData: reactive({
                username: '',
                password: '',
                confirmpassword: ''
            }),
            width: '120px',
            color1: 'linear-gradient(135deg, rgb(11, 72, 239), rgb(17, 197, 149))',
            color2: 'rgb(255, 167, 69)',
            state: 'left'
        };
    },
    mounted() {
        // 添加窗口大小改变事件监听器
        window.addEventListener("resize", this.updateWidth);

        // 在这里调用一次确保组件已经渲染
        this.$nextTick(() => {
            this.updateWidth();
        });

        this.adjustVideoPosition();
        // 监听窗口大小变化，以便在窗口大小变化时重新调整视频位置
        window.addEventListener('resize', this.adjustVideoPosition);

        const video = this.$refs.myVideo;

        // 监听视频播放结束事件
        video.addEventListener('ended', () => {
            // 当视频结束时，将当前播放时间设置为0，以实现循环播放
            video.currentTime = 0;
            video.play();
        });

        setTimeout(() => {
            video.play();
        }, 1000); // 这里的延迟时间可以根据实际情况调整

    },
    destroyed() {
        // 组件销毁时移除窗口大小变化的监听器
        window.removeEventListener('resize', this.adjustVideoPosition);
    },
    beforeDestroy() {
        // 在组件销毁前移除事件监听器，以防止内存泄漏
        window.removeEventListener("resize", this.updateWidth);
    },
    methods: {
        ...mapMutations(['changeLogin']),
        leftClick() {
            this.state = 'left'
            const slidingbtn = this.$refs.slidingbtn;
            slidingbtn.style.left = '0'
            this.color1 = 'linear-gradient(135deg, rgb(11, 72, 239), rgb(17, 197, 149))'
            this.showlogin = true
        },
        rightClick() {
            this.state = 'right'
            const slidingbtn = this.$refs.slidingbtn;
            slidingbtn.style.left = String(this.width) + 'px'
            this.color1 = 'linear-gradient(180deg, rgb(255, 107, 144), rgb(252, 217, 156))'
            this.showlogin = false
        },
        updateWidth() {
            // 检查 $refs.slidingbtn 是否存在
            const slidingbtn = this.$refs.slidingbtn;
            if (slidingbtn) {

                // 更新宽度
                if (window.innerWidth >= 800) {
                    this.width = window.innerWidth * 0.3 * 0.6 * 0.5;
                }
                else {
                    this.width = window.innerWidth * 0.6 * 0.5;
                }
                // 更新样式
                slidingbtn.style.width = `${this.width}px`;
                if (this.state == 'left') {
                    this.leftClick()
                }
                else {
                    this.rightClick()
                }
            }
        },
        adjustVideoPosition() {
            const emopicContainer = this.$refs.emopicContainer;
            const myVideo = this.$refs.myVideo;

            if (emopicContainer && myVideo) {
                const heightDifference = emopicContainer.clientHeight - myVideo.clientHeight;
                // 设置视频的上边距为高度差，使其最底端对齐容器的最底端
                myVideo.style.marginTop = heightDifference + 'px';
            }
        },
        login() {
            let _this = this;
            this.$refs.loginFormRef.validate(valid => {
                if (!valid) {
                    return
                }
                else {
                    Service.post("/user/login", {
                        username: this.loginData.username,
                        password: this.loginData.password
                    }).then((response) => {
                        // console.log(response)
                        if (response.code === 1) {
                            _this.userToken = 'Token ' + response.data.token;
                            _this.userID = response.data.id;
                            _this.changeLogin({ Authorization: _this.userToken, ID: _this.userID, Password: this.loginData.password });
                            _this.$router.push('/');
                            ElMessage.success('Successfully login!')
                        }
                        else {
                            ElMessage.error('Incorrect username or password!')
                        }
                    }).catch(error => {
                        // console.log(error);
                    });
                }
            })
        },
        validateUsername(rule, value, callback) {
            // 使用正则表达式校验用户名，不能包含"/"和"\"
            const pattern = /^[^\/\\]+$/;
            if (pattern.test(value)) {
                callback();
            } else {
                callback(new Error('用户名不能包含"/"和"\''));
            }
        },
        back() {
            this.$router.push('/')
        },
        forget() {
            ElMessage.error('Please add WeChat dj15039782515')
        }
    },
    directives: {
        color: {
            created(el, binding) {
                // console.log(el, binding.value)
                el.style.background = binding.value
            },
            updated(el, binding) {
                el.style.background = binding.value

            },
        }
    }

}
</script>
<style scoped>
@import url('https://fonts.font.im/css2?family=Open+Sans&family=PT+Serif:ital@1&family=Play:wght@700&family=Satisfy&family=Space+Grotesk&family=Ubuntu:ital@1&display=swap');

@import url('https://fonts.font.im/css2?family=Croissant+One&family=Fuggles&family=Open+Sans&family=PT+Serif:ital@1&family=Play:wght@700&family=Roboto+Mono:ital,wght@0,200;1,100&family=Satisfy&family=Space+Grotesk&family=Ubuntu:ital@1&display=swap');


@import url('https://fonts.font.im/css2?family=Martian+Mono:wght@300&display=swap');


@import url('https://fonts.font.im/css2?family=Signika+Negative&display=swap');


@import url('https://fonts.font.im/css2?family=Raleway:ital,wght@1,300&display=swap');

@import url('https://fonts.font.im/css2?family=JetBrains+Mono:wght@600&display=swap');

.login {
    width: 100vw;
    height: 100vh;
    display: flex;
    /* 或设置为固定的值，以适应子容器 */
    overflow: auto;
    background-image: -moz-linear-gradient(45deg, rgb(206, 250, 117), rgb(97, 77, 249));

    background-image: -webkit-linear-gradient(45deg, rgb(206, 250, 117), rgb(97, 77, 249));

    background-image: linear-gradient(45deg, rgb(206, 250, 117), rgb(97, 77, 249));
}

.loginmain {
    min-height: 100vh;
    position: static;
    left: 0;
    width: 30%;
}

.backward {
    padding: 20px;
    font-family: 'Oswald', sans-serif;
    cursor: pointer;

}

.backward span {
    font-size: 20px;
}

.loginmain h1 {
    font-family: 'Open Sans', sans-serif;
    color: white;
    font-size: 55px;
    margin-top: 27%;
    text-align: center;
    /* 水平居中对齐 */
}

.loginmain p {
    font-family: 'Croissant One', cursive;
    text-align: center;
    background-image:
        linear-gradient(90deg,
            #673ab7,
            #e91e63);
    background-clip: text;
    -webkit-background-clip: text;
    /* background-clip: text;需要 */
    -webkit-text-fill-color: transparent;
    background-image:
        linear-gradient(90deg,
            rgb(255, 167, 69),
            rgb(254, 134, 159),
            rgb(239, 122, 200),
            rgb(160, 131, 237),
            rgb(67, 174, 255),
            rgb(160, 131, 237),
            rgb(239, 122, 200),
            rgb(254, 134, 159),
            rgb(255, 167, 69));
    background-size: 200%;
}

.loginmain p {
    animation: streamer 2s linear infinite;
}

.loginmain .forget {
    margin-top: 5px;
    text-align: center;
    font-size: 12px;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    cursor: pointer;
}

@keyframes streamer {
    0% {
        background-position: 0%;
    }

    100% {
        background-position: 200%;
    }
}

.logininput {
    margin-top: 20px;
}

.emopic {
    position: absolute;
    right: 0;
    width: 70%;
    height: 100vh;
    background-image: -moz-linear-gradient(0deg, rgb(238, 17, 72), rgb(15, 134, 189));

    background-image: -webkit-linear-gradient(0deg, rgb(238, 17, 72), rgb(15, 134, 189));

    background-image: linear-gradient(0deg, rgb(238, 17, 72), rgb(15, 134, 189));
}

.emopic video {
    position: absolute;
    bottom: 0;
    width: 100%;
    /* 设置视频的最小高度，可以根据需要调整 */
    min-height: 100%;
    object-fit: cover;
    /* 保持视频比例并填充容器 */
}

.button-box {
    width: 60%;
    /* margin: 10px auto; */
    margin-left: 20%;
    margin-top: 10px;
    position: relative;
    border-radius: 30px;
    background: #715050;
    text-align: center;
}

.toggle-btn {
    cursor: pointer;
    background: transparent;
    border: 0;
    outline: none;
    position: relative;
    text-align: center;
    font-family: 'Martian Mono', monospace;
    font-weight: 800;
    font-size: 12px;
    color: white;
    width: 50%;
    height: 50px;
}


#btn {
    left: 0;
    top: 0;
    position: absolute;
    height: 100%;
    border-radius: 30px;
    transition: 0.5s;
}

.el-form {
    font-size: 30px !important;
}



.el-form .elres .el-form-item__content {
    margin-left: 0 !important;
}

.el-form-item {
    margin-left: 0 !important;
}

.logininput {
    margin-left: 20%;
    width: 60%;

}

.long-button {
    width: 100%;

}

.lww {
    background-color: black;

}

.lwg {
    background-color: black;
}

.registerinput {
    margin-left: 20%;
    width: 60%;
}

@media (max-width: 800px) {
    .emopic {
        display: none;
    }

    .login {
        height: 150%;
    }

    .loginmain {
        width: 100%;
        /* 或者根据需要设置合适的宽度 */
    }
}
</style>