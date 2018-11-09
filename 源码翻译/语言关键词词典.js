// TODO: 并非所有编程语言都有.
// !! 而且会影响命名翻译?
var 通用关键词 = {
  "abstract": "抽象",
  "and": "且",
  "as": "as",
  "assert": "断言",
  "break": "跳出",
  "boolean": "布尔",
  "byte": "字节",
  "char": "字节",
  "const": "const",
  "case": "分支",
  "class": "类别",
  "catch": "接住",
  "continue": "继续",
  "default": "默认",
  "do": "执行",
  "double": "双浮点",
  "else": "否则",
  "enum": "枚举",
  "extends": "扩展",
  "extern": "外部",
  "false": "假",
  "final": "最终",
  "finally": "善后",
  "float": "单浮点",
  "for": "对于",
  "function": "函数",
  "global": "全局",
  "goto": "goto",
  "if": "如果",
  "implements": "实现",
  "import": "导入",
  "in": "在",
  "include": "包括",
  "instanceof": "为实例",
  "int": "整数",
  "interface": "接口",
  "is": "为",
  "long": "长整数",
  "native": "native",
  "new": "新",
  "null": "空",
  "or": "或",
  "package": "包",
  "private": "私有",
  "protected": "保护",
  "public": "公有",
  "return": "返回",
  "short": "短整数",
  "signed": "有符号",
  "sizeof": "大小",
  "static": "静态",
  "struct": "结构",
  "super": "父类",
  "switch": "岔",
  "synchronized": "同步",
  "this": "本身",
  "throw": "抛出",
  "throws": "会抛出",
  "transient": "transient",
  "true": "真",
  "try": "尝试",
  "typedef": "类型定义",
  "union": "联合",
  "unsigned": "无符号",
  "void": "无值",
  "volatile": "volatile",
  "while": "每当",
  "with": "with",
  "yield": "产出"
}

var 专用关键词 = {
  // https://msdn.microsoft.com/en-us/library/befeaky0.aspx
  "c": {
    "auto": "auto",
    "register": "register"
  },
  // http://php.net/manual/en/reserved.keywords.php
  "php": {
    // array()
    "callable": "可调用",
    "clone": "克隆",
    "const": "const",
    "declare": "声明",
    // die()
    "echo": "回响",
    "elseif": "否则如果",
    // empty()
    "enddeclare": "结束声明",
    "endfor": "结束for",
    "endforeach": "结束foreach",
    "endif": "结束if",
    "endswitch": "结束switch",
    "endwhile": "结束while",
    // eval()
    // exit()
    "foreach": "对每个",
    "implements": "实现",
    "include_once": "包括_单次",
    "instanceof": "为实例",
    "insteadof": "insteadof",
    "interface": "接口",
    // isset()
    // list()
    "namespace": "命名空间",
    "print": "打印",
    "require": "需要",
    "require": "需要_单次",
    "trait": "trait",
    // unset()
    "use": "use",
    "var": "var",
    "xor": "异或"
  },
  "javascript": {
    "arguments": "参数",
    "await": "等待",
    "debugger": "调试器",
    "delete": "删除",
    "eval": "eval",
    "export": "导出",
    "let": "让",
    "typeof": "为类型",
    "var": "变量"
  },
  /*
  参考 http://zetcode.com/lang/python/keywords/
  import keyword
  print("Python keywords: ", keyword.kwlist)
  */
  "python": {
    "False": "假",
    "None": "空",
    "True": "真",
    "def": "定义",
    "del": "删除",
    "elif": "否则如果",
    "except": "except",
    "from": "从",
    "lambda": "lambda",
    "nonlocal": "nonlocal",
    "not": "不",
    "pass": "轮空",
    "raise": "抛出",
  },
  // 参考 https://docs.oracle.com/javase/tutorial/java/nutsandbolts/_keywords.html
  "java": {
    "strictfp": "strictfp"
  }
}

const JavaScript关键词 = [
"abstract",
"break",
"char",
"debugger",
"double",
"export",
"finally",
"goto",
"in",
"let",
"null",
"public",
"super",
"throw",
"try",
"volatile",
"arguments",
"byte",
"class",
"default",
"else",
"extends",
"float",
"if",
"instanceof",
"long",
"package",
"return",
"switch",
"throws",
"typeof",
"while",
"await",
"case",
"const",
"delete",
"enum",
"false",
"for",
"implements",
"int",
"native",
"private",
"short",
"synchronized",
"transient",
"var",
"with",
"boolean",
"catch",
"continue",
"do",
"eval",
"final",
"function",
"import",
"interface",
"new",
"protected",
"static",
"this",
"true",
"void",
"yield"
];

// 仅用于控制台下运行, 将通用关键词剔除后, 再加入专用关键词词典
function 取专有关键词(所有关键词) {
  var 非通用关键词 = [];
  所有关键词.sort();
  for (词 of 所有关键词) {
    if (!(词 in 通用关键词)) {
      非通用关键词.push(词);
    }
  }
  console.log(非通用关键词);
}

function 取所有关键词(编程语言) {
  var 该语言关键词 = 专用关键词[编程语言];
  return 该语言关键词 ? Object.assign(该语言关键词, 通用关键词) : 通用关键词;
}
