## 内置功能

1.  菜单管理：配置系统菜单，操作权限，按钮权限标识、后端接口权限等。
2.  部门管理：配置系统组织机构（公司、部门、角色）。
3.  角色管理：角色菜单权限分配、数据权限分配、设置角色按部门进行数据范围权限划分。
4.  按钮权限权限：授权角色的按钮权限和接口权限,可做到每一个接口都能授权数据范围。
5.  字段权限权限：授权页面的字段显示权限。
5.  用户管理：用户是系统操作者，该功能主要完成系统用户配置。
6.  接口白名单：配置不需要进行权限校验的接口。
7.  字典管理：对系统中经常使用的一些较为固定的数据进行维护。
8.  地区管理：对省市县区域进行管理。
9.  附件管理：对平台上所有文件、图片等进行统一管理。
10. 操作日志：系统正常操作日志记录和查询；系统异常信息日志记录和查询。

## 准备工作
~~~
Python >= 3.8.0 (推荐3.8+版本)
nodejs >= 14.0 (推荐最新)
Mysql >= 5.7.0 (可选，默认数据库sqlite3，推荐8.0版本)
Redis(可选，最新版)
~~~

## 前端

```bash
# 进入项目目录
cd web

# 安装依赖
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
# 浏览器访问 http://localhost:8080
# .env.development 文件中可配置启动端口等参数
# 构建生产环境
# npm run build
```

## 后端

~~~bash
1. 进入项目目录 cd backend
2. 创建数据库 knowledge
	mysql数据库版本建议：8.0
	mysql数据库字符集：utf8mb4
	create database knowledge default character set utf8mb4;
3. 在env.py 中配置数据库信息
	DATABASE_NAME = 'knowledge' # mysql 时使用
4. 安装依赖环境
	pip install -r requirements.txt
5. 执行迁移命令：
	python manage.py makemigrations
	python manage.py migrate
6. 初始化数据
	python manage.py init
7. 初始化省市县数据:
	python manage.py init_area
8. 启动项目
	python manage.py runserver 0.0.0.0:8000
~~~

### 访问项目

- 访问地址：[http://localhost:8080](http://localhost:8080) (默认为此地址，如有修改请按照配置文件)
- 账号：`superadmin` 密码：`admin123456`

### docker-compose 运行

~~~shell
# 先安装docker-compose (自行百度安装),执行此命令等待安装，如有使用celery插件请打开docker-compose.yml中celery 部分注释
docker-compose up -d
# 初始化后端数据(第一次执行即可)
docker exec -ti dvadmin-django bash
python manage.py makemigrations 
python manage.py migrate
python manage.py init_area
python manage.py init
exit

前端地址：http://127.0.0.1:8080
后端地址：http://127.0.0.1:8080/api

# 在服务器上请把127.0.0.1 换成自己公网ip
账号：superadmin 密码：admin123456

# docker-compose 停止
docker-compose down
#  docker-compose 重启
docker-compose restart
#  docker-compose 启动时重新进行 build
docker-compose up -d --build
~~~