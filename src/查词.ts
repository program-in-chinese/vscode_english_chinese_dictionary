import * as 释义处理 from './翻译/处理'
import * as 自定义词典 from './翻译/自定义词典'
import * as 模型 from './翻译/数据类型'
import * as 词典 from './加载词典'

const 词形_原型变换形式 = "原型变换形式"
const 词形类型 = Object.freeze({
  "p": "过去式", // past tense
  "d": "过去分词",
  "i": "现在分词", // -ing
  "3": "第三人称单数",
  "r": "形容词比较级", // -er
  "t": "形容词最高级", // -est
  "s": "名词复数形式",
  "0": "原型",
  "1": 词形_原型变换形式
});

export function 取释义(选中文本: string): 模型.字段释义 {
  let 所有词 = 释义处理.取字段中所有词(选中文本);
  let 所有词条 = [];
  for (let 单词 of 所有词) {
    let 处理后词 = 单词;

    if (处理后词 != 单词.toUpperCase()) {
      处理后词 = 单词.toLowerCase();
    } else {
      // 应付全大写词, 多见于常量, 如SHIPMENT
      if (!词典.词典数据[处理后词]) {
        处理后词 = 单词.toLowerCase();
      }
    }
    if (处理后词 in 自定义词典.不翻译) {
      所有词条.push({
        词: 处理后词,
        释义: 处理后词});
      continue;
    }

    // TODO: 重构
    // 仅在命名包含多词时取原型
    if (所有词.length > 1) {
      处理后词 = 释义处理.取原型(处理后词, 提取词形(词典.词形变化数据[处理后词]));
    }
    let 所有词形 = 提取词形(词典.词形变化数据[处理后词]);
    所有词条.push({
      词: 处理后词,
      释义: 词典.词典数据[处理后词],
      词形: 所有词形
    });
  }
  let 释义 = 选中文本;
  if (所有词条.length > 1) {
    let 首选释义 = 释义处理.选取释义(所有词条, 所有词);
    for (let 序号 = 0; 序号 < 所有词.length; 序号++) {
      释义 = 释义.replace(所有词[序号], 首选释义[序号])
    }
  } else if (所有词条.length == 1) {
    // TODO: 简化词条 (以适应状态栏宽度)
    释义 = 所有词条[0].释义;
  }
  return {
    原字段: 选中文本,
    释义: 释义,
    各词: 所有词条
  };
}

// 词形部分数据格式描述: https://github.com/skywind3000/ECDICT#%E8%AF%8D%E5%BD%A2%E5%8F%98%E5%8C%96
function 提取词形(原字符串: string): 模型.词形变化[] {
  let 变化 = [];
  if (!原字符串) {
    return 变化;
  }
  let 词形字段 = 原字符串.split("/");
  for (let 某字段 of 词形字段) {
    let 分段 = 某字段.split(":");

    let 类型 = 词形类型[分段[0]];
    let 原型变化形式 = [];
    if (类型 == 词形_原型变换形式) {
      for (let 变化形式 of 分段[1]) {
        原型变化形式.push(词形类型[变化形式]);
      }
    }
    // 如hyphen(vt): s:hyphens/p:hyphened/i:/3:hyphens/d:, i与d内容缺失, 用空字符串占位
    变化.push({
      类型: 类型,
      变化: 分段.length == 1 ? "" : (类型 == 词形_原型变换形式 ? 原型变化形式 : 分段[1])}
    );
  }
  return 变化;
}