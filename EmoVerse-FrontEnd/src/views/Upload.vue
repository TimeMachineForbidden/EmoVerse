<template>
    <div class="uploadpage">
        <div class="uploadheader">
            <h2>Upload</h2>
        </div>
        <div class="main-container">
            <div class="beforeupload" v-if="beforeuploaded">
                <div class="backward" @click="back1">
                    <el-icon>
                        <ArrowLeft />
                    </el-icon>
                    <span>Back</span>
                </div>
                <div class="uploadtips">
                    <h2 style="color: white;margin-top:10px">You can Upload here</h2>
                </div>
                <div class="uploadfield">
                    <el-upload class="upload-demo" drag action="http://123.249.110.185:8080/common/upload"
                        :headers="headers" multiple :on-success="successfn" :limit="1">
                        <el-icon class="el-icon--upload"><upload-filled /></el-icon>
                        <div class="el-upload__text">
                            Drop file here or <em>click to upload</em>
                        </div>
                        <template #tip>
                            <div class="el-upload__tip">
                                jpg/png files with a size less than 500kb
                            </div>
                        </template>
                    </el-upload>
                </div>
            </div>
            <div class="afterupload" v-else>
                <div class="leftpart">
                    <div class="backward" @click="back">
                        <el-icon>
                            <ArrowLeft />
                        </el-icon>
                        <span>Back</span>
                    </div>
                    <div class="displayimg">
                        <div class="imgintroduction">
                            <span>{{ imageName }}</span>
                        </div>
                        <img :src="imageUrl">
                    </div>
                </div>
                <div class="rightpart">
                    <div class="emoinfo">
                        <el-form ref="EmoticonFormRef" :model="EmoticonData" :rules="EmoticonFormRules" label-width="60px"
                            label-position='top'>
                            <el-form-item>
                                <el-row :gutter="70">
                                    <el-col :span="24">
                                        <p>Add Info</p>
                                    </el-col>
                                </el-row>
                            </el-form-item>
                            <el-form-item label="Emoticon name" prop="name"
                                style="margin-top:20px;margin-bottom: 30px;color: gray;font-family: 'Raleway', sans-serif;">
                                <el-input v-model="EmoticonData.name" placeholder="Name"
                                    input-style="font-family: 'Raleway', sans-serif;"></el-input>
                            </el-form-item>
                            <el-form-item label="Emoticon Description" prop="desciption"
                                style="margin-bottom: 20px;color: gray;font-family: 'Raleway', sans-serif;">
                                <el-input v-model="EmoticonData.description" placeholder="Description"
                                    input-style="font-family: 'Raleway', sans-serif;"></el-input>
                            </el-form-item>

                            <el-form-item label="labels" prop="lab"
                                style="margin-bottom: 20px;color: gray;font-family: 'Raleway', sans-serif;">
                                <el-button class="long-button" type="success" @click="addlabels"
                                    v-if="!haschosen">+Addlabels
                                </el-button>
                                <el-tag v-for="tag in dynamicTags" :key="tag.id" class="mx-1" v-if="haschosen">
                                    {{ tag.name }}
                                </el-tag>

                                <el-button @click="addlabels" v-if="haschosen" size="small"><el-icon>
                                        <Edit />
                                    </el-icon>Edit</el-button>
                            </el-form-item>
                            <el-form-item style="margin-top: 100px;">
                                <el-button class="long-button" type="primary" @click="uploademoji">Upload
                                </el-button>

                            </el-form-item>
                            <el-form-item>

                                <el-button class="long-button" type="danger" @click="back">Cancel </el-button>

                            </el-form-item>

                        </el-form>
                    </div>

                </div>
            </div>

        </div>
    </div>
    <client-only>
        <el-dialog v-model="tagDialogVisible" title="Add tags" width="50%" v-if="tagDialogVisible" destroy-on-close
            :show-close="false">
            <span>choose the tags you wanna add</span>
            <br />
            <span>chosen</span>
            <br />
            <el-tag v-for="tag in dynamicTags" :key="tag.id" class="mx-1" closable :disable-transitions="false"
                @close="handleClose(tag)">
                {{ tag.name }}
            </el-tag>
            <el-divider />
            <span>to choose</span>
            <div class="taggourp" v-for="(taggp, index) in choosetagslist" :key="index">
                <h2 style="margin-bottom: 3px;">{{ sectionname(index) }}</h2>
                <el-check-tag v-for="tag in taggp" :key="tag.id" class="mx-1" :checked="checked"
                    @change="onChange(true, tag, index)">
                    {{ tag.name }}
                </el-check-tag>
                <el-input class="input-new-tag" v-if="inputVisible(index)" v-model="inputValue"
                    :ref="`saveTagInput${index}`" size="small" @keyup.enter.native="handleInputConfirm(index)"
                    @blur="handleInputConfirm(index)">
                </el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput(index)">+ New Tag</el-button>
                <el-divider />
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="closelabels">Cancel</el-button>
                    <el-button type="primary" @click="handletagshandin">
                        Confirm
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </client-only>
</template>
<script setup>
import { UploadFilled, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';
import { ArrowLeft } from '@element-plus/icons-vue'
import Service from '@/utils/request';
</script>
<script>
import axios from 'axios';
export default {
    data() {
        return {
            imageUrl: '',
            imageName: '',
            headers: {
                Authorization: localStorage.getItem('Authorization')
            },
            beforeuploaded: true,
            EmoticonData: {
                name: '',
                description: ''
            },
            EmoticonFormRules: {
                name: [{
                    required: true, message: "input name", trigger: 'blur'
                },
                {
                    min: 4,
                    max: 100,
                    message: 'Emoticon name should be between 4 and 100',
                }
                ],
                description: [{
                    required: false, message: "input description", trigger: 'blur'
                },
                {
                    min: 6,
                    max: 100,
                    message: 'description name should be between 6 and 100',
                }
                ]
            },
            tagDialogVisible: false,
            choosetagslist: [],
            checked: false,
            dynamicTags: [],
            firstchoose: true,
            originallist: [],
            haschosen: false,
            inputValue: '',
            inputindex: -1,
        }
    },
    mounted() {
    },
    beforeDestroy() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    methods: {
        successfn(response, file, fileList) {
            this.imageName = file.name
            this.imageUrl = response.data
            this.beforeuploaded = false;
            ElMessage.success('Successfully upload!Now please add some information!')
        },
        back1() {
            this.$router.push('/')
        },
        back() {
            this.imageName = ''
            this.imageUrl = ''
            this.beforeuploaded = true;
        },
        uploademoji() {
            let _this = this;
            this.$refs.EmoticonFormRef.validate(valid => {
                if (!valid) {
                    return
                }
                else {
                    // console.log(localStorage.getItem('Authorization'))
                    axios.interceptors.request.use((config) => {
                        if (localStorage.getItem('Authorization')) {
                            config.headers.Authorization = localStorage.getItem('Authorization')
                        }
                        return config;
                    }, (error) => {
                        return Promise.reject(error);
                    });
                    axios.post('http://123.249.110.185:8080/emoji', {
                        name: this.EmoticonData.name,
                        description: this.EmoticonData.description,
                        url: this.imageUrl,
                        tags: this.dynamicTags.map(obj => obj.id)
                    }).then((response) => {
                        // console.log(response)

                        if (response.data.code === 1) {
                            ElMessage.success('Upload Completely!')
                            this.$router.push('/')
                        }
                        else {
                            ElMessage.error('Something went wrong!Please try again!')
                        }
                    }).catch(error => {
                        // console.log(error);
                    });
                }
            })
        },
        async addlabels() {
            this.tagDialogVisible = true;
            if (this.firstchoose) {
                // Service.get("/tag").then((response) => {
                //     // console.log(response.data)
                //     this.choosetagslist = response.data;
                //     this.originallist = response.data
                // })
                for (let i = 1; i <= 10; i++) {
                    await Service.get("/tag/groupList", {
                        params: {
                            groupId: i
                        }
                    }).then((response) => {
                        this.choosetagslist.push(response.data)
                    })
                }
                const lastThreeChars = this.imageName.slice(-3)
                const gifname = "gif"
                if (lastThreeChars === gifname) {
                    let giftag = this.choosetagslist[0][0]
                    this.choosetagslist[0] = this.choosetagslist[0].filter(item => item.id !== 1)
                    giftag.index = 0
                    this.dynamicTags.unshift(giftag)
                }
                else {
                    let statag = this.choosetagslist[0][1]
                    this.choosetagslist[0] = this.choosetagslist[0].filter(item => item.id !== 2)
                    statag.index = 0
                    this.dynamicTags.unshift(statag)
                }
                this.firstchoose = false
            }
        },
        closelabels() {
            this.tagDialogVisible = false;
        },
        onChange(status, tag, index) {
            console.log(tag)
            this.choosetagslist[index] = this.choosetagslist[index].filter(item => item.id !== tag.id)
            let dyntag = tag
            dyntag.index = index
            this.dynamicTags.unshift(dyntag)
        },
        handleClose(tag) {
            this.dynamicTags = this.dynamicTags.filter(item => item.id !== tag.id)
            this.choosetagslist[tag.index].unshift(tag)
        },
        handletagshandin() {
            this.tagDialogVisible = false;
            if (this.dynamicTags) {
                this.haschosen = true
            }
        },
        inputVisible(index) {
            return this.inputindex === index
        },
        showInput(index) {
            this.inputindex = index;
            console.log(index)
            this.$nextTick(_ => {
                this.$refs[`saveTagInput${index}`][0].focus();
            });
        },
        async handleInputConfirm(index) {
            let inputValue = this.inputValue;
            let realindex = index + 1
            if (inputValue) {
                let obj = { "name": inputValue, "groupid": 1 }
                Service.post("/tag",
                    {
                        name: inputValue,
                        groupId: realindex
                    }).then(response => {
                        // console.log(response)
                    }).catch(error => {
                        // console.log(error);
                        ElMessage.error('This operation is not allowed!')
                    });
            }
            this.inputindex = -1;
            this.inputValue = '';
            await Service.get("/tag/groupList", {
                params: {
                    groupId: realindex
                }
            }).then((response) => {
                console.log(response)
                this.choosetagslist[index] = response.data
            })
        },
        sectionname(index) {
            if (index === 0) {
                return "动静态"
            }
            if (index === 1) {
                return "动物"
            }
            if (index === 2) {
                return "精神状态"
            }
            if (index === 3) {
                return "网络热梗"
            }
            if (index === 4) {
                return "节日"
            }
            if (index === 5) {
                return "动作"
            }
            if (index === 6) {
                return "怼人"
            }
            if (index === 7) {
                return "人物"
            }
            if (index == 8) {
                return "风格"
            }
            return "其它"
        }


    },
}
</script>
<style scoped>
.uploadpage {
    height: 110vh;
    width: 100%;
    background-image: -moz-linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

    background-image: -webkit-linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));

    background-image: linear-gradient(180deg, rgb(156, 206, 252), rgb(117, 250, 170));
}

.uploadheader {
    background-color: none;
    /* 设置头部背景色为白色 */
    padding: 20px;
    /* 设置内边距 */
    text-align: center;
}


.main-container {
    width: 80%;
    /* 设置宽度为页面宽度的80% */
    margin: 0 auto;
    /* 居中对齐 */
    background-color: white;
    /* 设置中间大盒子背景色为白色 */
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

.main-container .backward {
    font-family: 'Oswald', sans-serif;
    cursor: pointer;
}

.main-container .uploadtips {
    text-align: center;
}

.main-container .uploadfield {
    width: 90%;
    margin: 0 auto;
    margin-top: 5%;
}

.main-container .afterupload {
    width: 100%;
    height: 80vh;
    display: flex;
    padding: 0;
    color: white;
}

.main-container .afterupload .leftpart {
    width: 50%;
    height: 100%;
    position: relative;
    border-radius: 5px;
}

.main-container .afterupload .leftpart .backward {
    position: absolute;
    cursor: pointer;
}

.backward span {
    font-size: 20px;
}

.displayimg {
    width: 95%;
    height: 70%;
    overflow: hidden;
    margin: 0 auto;
    margin-top: 70px;
}

.displayimg .imgintroduction {
    margin-bottom: 7px;
}

.displayimg img {
    width: 80%;
    display: block;
    margin: 0 auto;

}

.main-container .afterupload .rightpart {
    width: 50%;
    height: 100%;
    background-image: -moz-linear-gradient(90deg, rgb(62, 249, 233), rgb(157, 251, 245));

    background-image: -webkit-linear-gradient(90deg, rgb(62, 249, 233), rgb(157, 251, 245));

    background-image: linear-gradient(90deg, rgb(62, 249, 233), rgb(157, 251, 245));
    border-radius: 5px;
}

.emoinfo {
    width: 90%;
    padding-left: 10px;
}

.emoinfo p {
    font-size: 25px;
    font-family: 'Raleway', sans-serif;
}

.long-button {
    width: 80%;
    margin: 0 auto;
}


.button-new-tag {
    margin-left: 10px;
    height: 32px;
    line-height: 30px;
    padding-top: 0;
    padding-bottom: 0;
}

.input-new-tag {
    width: 90px;
    margin-left: 10px;
    vertical-align: bottom;
}
</style>
