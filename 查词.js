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

exports.取释义 = function(词典数据, 选中文本) {
  var 英文 = 选中文本.trim();
  console.log(词典数据[英文]);
  return 词典数据[英文];
}

// 词形部分数据格式描述: https://github.com/skywind3000/ECDICT#%E8%AF%8D%E5%BD%A2%E5%8F%98%E5%8C%96
exports.提取词形 = function(原字符串) {
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