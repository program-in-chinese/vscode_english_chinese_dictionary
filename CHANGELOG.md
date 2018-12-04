## 各版本更新说明

### 0.0.7

中文编程[知乎专栏](https://zhuanlan.zhihu.com/codeInChinese)文章: [VS Code英汉词典插件v0.0.7-尝试词性搭配](https://zhuanlan.zhihu.com/p/51525136)
- 优先形容词+名词组合: 如命名中包含两个词, 前一个有形容词义, 后一个有名词义, 这两个词义优先. 如"BasicCalculator", 原为"基本原理计算器". 现为"基本的计算器"
- 如命名中包含现在分词, 取原型的释义

### 0.0.6

中文编程[知乎专栏](https://zhuanlan.zhihu.com/codeInChinese)文章: [VS Code英汉词典插件v0.0.6-改为TS实现, 加测试](https://zhuanlan.zhihu.com/p/51243255)
- 如命名中包含复数词汇, 取原型的释义. 如useColors, colors意为"国旗", 现改为取'color'释义.

### 0.0.5
- 上个版本不能查询大写词, 如 SHIPMENT, ACCOUNT. 此版本可正确查询.
- 保留下划线, 如"string_decoder", 上个版本翻译结果为"字符串译码器", 此版本为"字符串_译码器"
- 如多单词命名中有未查到的词, 显示原词, 如'fsPath'为'fs路径'
- 如无编辑器, 不报错

### 0.0.4

中文编程[知乎专栏](https://zhuanlan.zhihu.com/codeInChinese)文章: [VS Code英汉词典插件v0.0.4-驼峰下划线命名](https://zhuanlan.zhihu.com/p/49133480)

### 0.0.3
- 对驼峰和下划线命名中所有单词进行直译
- 查词无结果时提示

### 0.0.2
- 限制状态栏中最大显示长度

### 0.0.1

中文编程[知乎专栏](https://zhuanlan.zhihu.com/codeInChinese)文章: [Visual Studio Code插件-英汉词典初版发布](https://zhuanlan.zhihu.com/p/48791726)