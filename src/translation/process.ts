import * as 词典常量 from './consts'

let 词性_计算机 = "[计]";

export function 取按词性释义(中文释义: string): Map<string, string[]> {
  let 所有释义 = 中文释义.split('\\n');
  let 词性到释义 = new Map<string, string[]>();
  for (let i in 所有释义) {
    let 除去词性 = 所有释义[i];
    let 当前词性 = '';

    // TODO: 避免遍历所有词性
    let 所有词性 = 词典常量.词性
    for (let j in 所有词性) {
      let 词性 = 所有词性[j];
      if (除去词性.indexOf(词性) == 0) {
        当前词性 = 词性;
        除去词性 = 除去词性.substring(词性.length).trim();
        break;
      }
    }
    // 按逗号分隔词义
    // TODO: 也有分号分隔
    let 词义 = 除去词性.split(/[；;,]/);
    let 此词性的释义: string[] = []
    for (let 某词义 of 词义) {
      此词性的释义.push(某词义.trim());
    }
    词性到释义.set(当前词性, 此词性的释义);
  }
  return 词性到释义;
}

export function 首选(中文释义: string): string {
  if (!中文释义) {
    return;
  }
  let 首选词义 = "";
  let 词性到释义 = 取按词性释义(中文释义);
  //console.log(词性到释义);
  if (词性到释义.has(词性_计算机)) {
    首选词义 = 词性到释义.get(词性_计算机)[0];
  } else {
    // 取第一个词性的第一释义
    for (let [k, v] of 词性到释义) {
      首选词义 = v[0];
      break;
    }
  }
  首选词义 = 消除所有括号内容(首选词义);
  return 首选词义;
}

export function 取原型(词: string, 词形): string {
  if (词形) {
    let 原词 = 词;
    let 为复数形式 = false;
    for (let 某词形 of 词形) {
      if (某词形.类型 == "原型变换形式" && (某词形.变化.includes("名词复数形式") || 某词形.变化.includes("现在分词"))) {
        为复数形式 = true;
      }
      if (某词形.类型 == "原型") {
        原词 = 某词形.变化;
      }
    }
    if (为复数形式) {
      return 原词;
    }
  }
  return 词;
}

///////////////// 原文本处理


// 假设每个字段除了词, 其他都是非英文字符.
// 仅翻译无空格的片段
export function 取字段中所有词(字段文本: string): string[] {
  // 删去所有前后空格后再提取单词
  let 删除前后空格 = 字段文本.trim();
  // 确认无空格
  if (!删除前后空格.match(/^[^\s]+$/g)) {
    return [];
  }
  let 单词 = 删除前后空格.match(/[a-zA-Z]+/g);
  if (单词) {
    let 分词 = [];
    for (let 某单词 of 单词) {
      分词 = 分词.concat(拆分骆驼命名(某单词))
    }
    return 分词;
  }
  return [];
}

function 拆分骆驼命名(命名: string): string[] {
  // 参考: https://stackoverflow.com/a/46409373/1536803
  // Firefox仍不支持lookbehinds: https://stackoverflow.com/questions/49816707/firefox-invalid-regex-group
  // 不知为何结果中有空字符串, 暂时过滤即可
  return 命名.split(/([A-Z]+|[A-Z]?[a-z]+)(?=[A-Z]|\b)/).filter(词 => 词);
}

function 消除所有括号内容(中文释义: string): string {
   // 不确定是否存在多个括号的情况: 清理后.replace(/ *（[^）]*） */g, ""); //
  let 清理后 = 消除括号内容(中文释义, "（", "）");
  清理后 = 清理后.replace(/ *\([^)]*\) */g, "");
  清理后 = 清理后.replace(/ *\[[^)]*\] */g, "");
  return 清理后.trim();
}

function 消除括号内容(中文释义: string, 开括号: string, 闭括号: string): string {
  let 开括号位置 = 中文释义.indexOf(开括号);
  let 闭括号位置 = 中文释义.indexOf(闭括号);
  if (开括号位置 == -1 || 闭括号位置 == -1) {
    return 中文释义;
  }
  let 括号内容 = 中文释义.substring(开括号位置, 闭括号位置 + 1);
  return 中文释义.replace(括号内容, "");
}