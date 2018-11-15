const 释义处理 = require('./translation/process')
const 词典常量 = require('./translation/consts')
const 常用词典 = require('./translation/common')
const 词典 = require('./加载词典')

var 词形类型 = Object.freeze({
  "p": "过去式", // past tense
  "d": "过去分词",
  "i": "现在分词", // -ing
  "3": "第三人称单数",
  "r": "形容词比较级", // -er
  "t": "形容词最高级", // -est
  "s": "名词复数形式",
  "0": "原型",
  "1": "原型变换形式"
});

// {"原字段": 原字段, "释义": 翻译, "各词": [{"词": 英文, "释义": 单词释义, "词形": [所有变形]}]};
// TODO: 测试!!!!!!
exports.取释义 = function (选中文本) {
  var 所有词 = 释义处理.取字段中所有词(选中文本);
  var 所有词条 = [];
  for (单词 of 所有词) {
    var 处理后词 = 单词;

    // TODO: 避免两次处理大小写
    /*var 中文释义 = 查词.取释义(词典数据, 英文).释义;
    if (!中文释义) {
        英文 = 英文.toLowerCase();
        中文释义 = 查词.取释义(词典数据, 英文).释义;
    }
    if (!中文释义) {
        英文 = 英文.toUpperCase();
    }*/
    if (处理后词 != 单词.toUpperCase()) {
      处理后词 = 单词.toLowerCase();
    } else {
      // 应付全大写词, 多见于常量, 如SHIPMENT
      if (!词典.词典数据[处理后词]) {
        处理后词 = 单词.toLowerCase();
      }
    }
    if (处理后词 in 常用词典.不翻译) {
      所有词条.push({"词": 处理后词, "释义": 处理后词});
      continue;
    }

    // TODO: 演示用
    处理后词 = 释义处理.取复数原型(处理后词);
    var 所有词形 = 提取词形(词典.词形变化数据[处理后词]);
    所有词条.push({"词": 处理后词, "释义": 词典.词典数据[处理后词], "词形": 所有词形});
  }
  var 释义 = "";
  if (所有词条.length > 1) {

    // 对下划线分隔的命名, 仍保留下划线
    // TODO: 应付下划线前缀/后缀
    var 下划线个数 = (选中文本.match(/_/g) || []).length
    var 分隔 = (下划线个数 > 0 && 下划线个数 == 所有词条.length - 1)
      ? "_"
      : "";
    var 所有释义 = [];
    for (词条 of 所有词条) {
      所有释义.push(释义处理.首选(词条.释义, 词典常量.词性));
    }
    释义 = 所有释义.join(分隔);
  } else if (所有词条.length == 1) {
    // TODO: 简化词条 (以适应状态栏宽度)
    释义 = 所有词条[0].释义;
  }
  return {"原字段": 选中文本, "释义": 释义, "各词": 所有词条};
}

// 词形部分数据格式描述: https://github.com/skywind3000/ECDICT#%E8%AF%8D%E5%BD%A2%E5%8F%98%E5%8C%96
function 提取词形(原字符串) {
  var 变化 = [];
  if (!原字符串) {
    return 变化;
  }
  var 词形字段 = 原字符串.split("/");
  for (var 某字段 of 词形字段) {
    var 分段 = 某字段.split(":");

    var 类型 = 词形类型[分段[0]];
    var 原型变化形式 = [];
    if (类型 == "原型变换形式") {
      for (var 变化形式 of 分段[1]) {
        原型变化形式.push(词形类型[变化形式]);
      }
    }
    // 如hyphen(vt): s:hyphens/p:hyphened/i:/3:hyphens/d:, i与d内容缺失, 用空字符串占位
    变化.push({
      "类型": 类型,
      "变化": 分段.length == 1 ? "" : (类型 == "原型变换形式" ? 原型变化形式 : 分段[1])
    }
    );
  }
  return 变化;
}