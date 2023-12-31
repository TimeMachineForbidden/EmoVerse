# EmoVerse表情宇宙前端

## 一、技术说明

工具与框架介绍

+ Nodejs 一个让JavaScript运行在服务端的开发平台

+ NPM JavaScript的包管理工具

+ Vue.js 一个前端框架

+ Element Plus一个Vue3 UI框架

+ Axios 一个Js实现的用于发送http请求的库

模块结构介绍

本系统采用Vue的组建式开发，整个前端由若干个组件组成:

+ src: 包含项目的源代码文件。 

+ api: 存放与后端通信的API文件。 

+ assets: 存放静态资源，如图片、样式表等。 

+ components: 存放可复用的Vue组件。 

+ router: 存放路由配置文件。 

+ views: 存放页面级的Vue组件，通常与路由对应。 

+ App.vue: 项目的根组件，包含应用的整体结构和布局。 

+ main.js: 项目的入口文件，初始化Vue应用实例并加载所需的插件和组件。

+ public: 包含公共资源和静态文件。 

+ index.html: 项目的HTML模板文件。 

+ favicon.ico: 网站的图标文件。 

+ package.json: 项目的配置文件，包含项目依赖、脚本命令等信息。

## 二、开发说明

### 1.本地安装前端

在开始开发前，让我们先做一些准备工作。

首先要安装nodejs和npm

接下来我们只需要安装各种库即可，得益于NPM，这里只需执行一个非常简单的命令即可。

```
cd EmoVerse-FrontEnd
npm install 
```

安装完毕后可以执行如下命令来查看前端是否能运行。

```
npm run server
```

然后打开浏览器访问 localhost:8080 如果能看到页面，证明前端已成功安装。

 ### 2.编译并压缩

```
npm run build
```

# EmoVerse 表情宇宙后端

## 一、项目介绍

EmoVerse(表情宇宙)旨在提供一个表情包平台，用户可以自由地浏览、上传、搜索、下载表情包。本项目基于SpringBoot开发后端，实现了用户登录注册、表情包的浏览、上传、搜索、下载；同时实现了收藏、评论、消息推送的功能，可以说是一个生态比较丰富的平台。

项目访问地址：http://123.249.110.185

本项目主要的特色如下：

* 使用新版本开发。本项目不拘泥于传统的“你发任你发，我用Java8”，而是使用Java17与SpringBoot3，紧跟最新技术发展
* 功能丰富。本项目绝不止简单的CRUD，而是使用了大量的技术栈，业务逻辑具有一定的复杂度，实现了非常丰富的功能
* 可拓展性强。本项目在开发时充分考虑了模块的松耦合，便于各个模块的独立拓展，可以拆分成微服务，比如搜索服务、查询服务、消息服务等等。
* 提供完整文档。本项目的开发遵循软件工程规范，基于敏捷开发模型，历时四个周期完成。本项目提供开发时使用的文档，包括项目需求文档、需求分析文档、架构设计文档和测试文档。文档中内容丰富，包括User Case、类图、UML图、架构图等等。相关文档详见`doc`目录（Markdown文件中图片网页上可能无法显示，可以克隆至本地阅读，或直接阅读PDF）

本项目主要使用到的技术栈及其版本如下：

| 相关依赖       | 版本         |
| -------------- | ------------ |
| JDK            | 17           |
| SpringBoot     | 3.1.4        |
| MySQL          | 8.0.34       |
| Redis          | 7.0.12       |
| RabbitMQ       | 3-management |
| Elastic Search | 8.7..0       |
| AliOSS         | /            |

其他技术栈（例如MyBatis、Spring Security）均由Maven版本锁定，详情见`pom.xml`文件。

## 二、项目模块架构

* emoticons:整个项目的父工程
* emoji-pojo：普通Java对象模块，包含Entiy、DTO、VO
* emoji-common：公共模块，包含工具类、常量类、异常类、枚举类等公共类
* emoji-mapper：数据访问模块，基于MyBatis实现
* emoji-security：安全模块，基于RBAC模型与Spring Security实现
* emoji-server：服务模块，包含service层、controller层、切面类等等，项目启动类也在此模块

## 三、项目部署

项目部署分为常规部署和Docker部署。以下内容均以Ubuntu22.04操作系统为例

### 1.常规部署

#### （1）安装依赖

相关依赖安装的具体步骤不是项目部署的核心内容，此处不详细赘述。

* 安装JDK17

  必须安装不低于17的JDK版本，推荐使用JDK17(LTS版本)

* 安装MySQL

  安装好MySQL之后，需要建数据库表，运行`emoji-server/src/main/resources/sql/DDL.sql`和`emoji-server/src/main/resources/sql/DML.sql`

* 安装Redis

  安装好Redis之后，配置`requirepass`来设置密码，配置`bind`来设置允许的网络连接

* 安装RabbitMQ

  安装好RabbitMQ之后，需要新建5个queue，分别如下：

  `comment.queue`、`reply.queue`、`favorite.queue`、`es.post.queue`、`es.update.queue`

  前三个queue用于消息推送，后两个queue用于实现Elastic Search和MySQL的数据同步。

* 安装Elastic Search

  安装好Elastic Search之后，需要建立索引库。建议在此基础上安装Kibana进行可视化，在Dev Tools中发送PUT请求，请求路径为`/emoji`，具体的索引库结构，见`emoji-server/src/main/resources/es/index.json`。

  Elastic Search默认不支持中文分词，还需要安装IK分词器，可以在此处下载该插件：https://github.com/medcl/elasticsearch-analysis-ik 注意应下载与Elastic Search相同版本的IK分词器，以免出现版本错误。安装了IK分词器之后，可以配置扩展字典和扩展停止词字典，配置方式详见Git仓库`README.md`

* 注册阿里云OSS服务

  注册阿里云OSS服务之后，需要完成两件事：创建一个Bucket、生成accessKeyId和accessKeySecret，具体可查阅阿里云相关文档。

  如果使用其他的云存储服务，具体的操作可能不同，并且需要修改源代码，具体的修改如下：

  * `yml`配置文件中有关云存储的配置
  * `emoji-common`模块中`AliOSSPeoperties`类
  * `emoji-common`模块中`AliOSSUtils`类
  * `emoji-server`模块中`CommonController`类中的`upload()`方法

* 安装Python3

  本项目使用Python来实现相似表情包的计算，在后端通过定时任务来更新，所以还需要安装Python。为了与相关的`pip`软件包兼容，使用Python 3.8以上的版本。
  
  计算相似表情包的Python代码，在`update_similar_emoji`目录下，需要安装相关的软件包。切换到该目录，执行如下命令：
  
  ```
  pip install -r requirements.txt
  ```

#### （2）修改配置文件

在`emoji-server`模块下，有三个`yml`配置文件，`application.yml`是主配置文件，`application-dev.yml`是开发环境配置文件，`application-prod.yml`是生产环境配置文件。主配置文件引用另外两个配置文件。

在本地二次开发或部署时，需要修改`application-dev.yml`配置文件中的信息。对于MySQL、Redis、RabbitMQ、AliOSS、Elastic Search的配置均与安装的依赖项对应。`spring.task.command`与`spring.task.script-path`取决于具体机器上运行Python脚本的命令与Python脚本的路径。

在服务器上进行部署时，需要修改`application-dev.yml`配置文件中的信息。具体配置同上

#### （3）运行项目

在开发环境下运行项目，运行`emoji-server`下的主类即可。

在生产环境下运行项目，具体步骤如下：

* 打包。需要对项目父工程`emoticons`运行Maven命令：

```
mvn package
```

* 运行。将`emoji-server`模块下`target`目录中生成的`emo-verse.jar`上传到服务器，运行如下命令：

```
java -jar emoverse.jar
```

还可以在后台运行，对日志进行重定向：

```
nohup java -jar emoverse.jar >log.out 2>&1 &
```

至此，本项目的后端部署完成。

### 2.Docker部署

为了解决项目使用的服务的依赖兼容问题，同时减少对操作系统的侵入性，可以使用Docker部署本项目。

#### （1）使用Docker安装依赖

本项目使用的众多依赖，在DockerHub中均有镜像，可以拉取相关镜像并创建容器。

* MySQL：生产环境下不建议将MySQL放在Docker容器中，推荐仍在本地安装MySQL

* Redis

  第一步，拉取镜像：

  ```
  docker pull redis:7.0.12
  ```

  第二步，获取`redis.conf`配置文件

  可以在此处获得：[redis/redis.conf at 7.0 · redis/redis (github.com)](https://github.com/redis/redis/blob/7.0/redis.conf)

  获取之后，还需要配置`requirepass`和`bind`，同常规部署

  第三步，创建数据卷

  使用以下命令创建一个Docker数据卷，命名为redis:

  ```
  docker volume create redis
  ```

  一般情况下，数据卷目录将在`/var/lib/docker/volumes/redis/_data`。也可以使用如下命令查看数据卷详情：

  ```
  docker volume inspect redis
  ```

  第四步，上传配置文件

  将`redis.conf`配置文件上传到`/var/lib/docker/volumes/redis/_data`目录下

  第五步，创建容器并运行

  在这一步，需要注意进行数据卷的挂载，还要告知容器使用自定义配置，具体命令如下：

  ```
  docker run \
  -p 6379:6379 \
  --name redis \
  -v redis:/usr/local/etc/redis \
  -d redis:7.0.12 \
  redis-server /usr/local/etc/redis/redis.conf
  ```

  对于数据卷挂载以及自定义配置详情，可查阅DockerHub官网：[redis - Official Image | Docker Hub](https://hub.docker.com/_/redis)

* RabbitMQ

  第一步，拉取镜像：

  ```
  docker pull rabbitmq:3-management
  ```

  第二步，创建并运行容器：

  在这一步需要配置好RabbitMQ的用户名和密码

  ```
  docker run \
   -e RABBITMQ_DEFAULT_USER=user \
   -e RABBITMQ_DEFAULT_PASS=password \
   --name mq \
   --hostname mq \
   -p 15672:15672 \
   -p 5672:5672 \
   -d \
   rabbitmq:3-management
  ```

  运行成功之后，可访问该主机的15672端口，查看RabbitMQ可视化界面，同时创建5个queue

* Elastic Sraech

  第一步，如果需要在同一台主机上部署Elastic Search和Kibana，则需要先创建一个网络，使得两个容器互连；如果没有此需求，可跳过此步骤

  ```
  docker network create es-net
  ```

  第二步，拉取Elastic Search镜像

  ```
  docker pull elasticsearch:8.7.0
  ```

  第三步，创建相关数据卷

  为了方便操作，可以为Elastic Search的数据、插件和日志分别创建数据卷：

  ```
  docker volumn create es-data
  docker volumn create es-plugins
  docker volumn create es-logs
  ```

  创建好数据卷之后，需要将IK分词器上传到`/var/lib/docker/volumes/es-plugins/_data`目录下，配置方式同常规部署

  第四步，创建并运行Elastic Search容器
  
  ```
  docker run \
  -d \
  --name es \
  -e "ES_JAVA_OPTS=-Xms512m -Xmx512m" \
  -e "discovery.type=single-node" \
  -v es-data:/usr/share/elasticsearch/data \
  -v es-plugins:/usr/share/elasticsearch/plugins \
  -v es-logs:/usr/share/elasticsearch/logs \
  --privileged \
  --network es-net \
  -p 9200:9200 \
  -p 9300:9300 elasticsearch:8.7.0
  ```

  其中，`ES_JAVA_OPTS`属性可根据具体机器的配置来设置，是否配置`--network es-net`取决于第一步是否创建了网络。

#### （2）修改配置

`yml`配置文件的修改与常规部署相同，与安装的相关依赖保持对应即可。

#### （3）运行项目

本项目已经编写了Dockerfile，可以使用Docker创建镜像并运行容器。

第一步，打包项目代码，对项目父工程`emoticons`运行Maven命令：

```
mvn package
```

第二步，创建镜像

将项目文件夹放到某一目录下，使用如下命令创建镜像：

```
docker build -t emoverse:1.0 .
```

可以使用以下命令查看镜像是否成功创建：

```
docker images
```

第三步，创建容器并运行：

```
docker run --name emoverse -p 8080:8080 -d emoverse:1.0
```

此时后端已经成功启动，测试方式有三种：

* 访问http://ipaddress:8080/doc.html ，查看接口文档能否正常访问，还可以进行调试。其中`ipaddress`替换为自己的IP地址或域名
* 利用Postman等工具测试
* 运行前端，进行前后端联调测试