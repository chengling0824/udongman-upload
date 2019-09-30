代码打包构建方法：
安装node环境在udongman目录下执行    node tools/r.js -o tools/build.js

生成build打包文件

本地dev环境需要将 js/commonConfig.js  路径配置为js下的引用路径；
test和product环境 配置为 build路径

例如：
dev环境：'shareJs': '../../js/lib/share',
test和product环境： 'shareJs': '../../build/lib/share',