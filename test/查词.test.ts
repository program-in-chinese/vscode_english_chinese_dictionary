import * as assert from 'assert'

import * as 查词 from '../src/查词'

suite("查词测试", () => {

  test("取释义", () => {
    assert.deepEqual(
      {
        "原字段": "shipment",
        "释义": "n. 装船, 出货\\n[经] 运送, 运送(寄出)货物, 装载",
        "各词": [
          {
            "词": "shipment", "释义": "n. 装船, 出货\\n[经] 运送, 运送(寄出)货物, 装载",
            "词形": [
              { "类型": "名词复数形式", "变化": "shipments" }
            ]
          }
        ]
      },
      查词.取释义("shipment")
    );
    assert.deepEqual(
      {
        "原字段": "ACCOUNT",
        "释义": "n. 报告, 解释, 估价, 理由, 利润, 算账, 帐目\\nvi. 报帐, 解释, 导致, 报偿, 占, 杀死\\nvt. 认为\\n[计] 帐户, 帐号",
        "各词": [
          {
            "词": "account", "释义": "n. 报告, 解释, 估价, 理由, 利润, 算账, 帐目\\nvi. 报帐, 解释, 导致, 报偿, 占, 杀死\\nvt. 认为\\n[计] 帐户, 帐号",
            "词形": [
              { "变化": "accounts", "类型": "名词复数形式" },
              { "变化": "accounted", "类型": "过去分词" },
              { "变化": "accounting", "类型": "现在分词" },
              { "变化": "accounts", "类型": "第三人称单数" },
              { "变化": "accounted", "类型": "过去式" }
            ]
          }
        ]
      },
      查词.取释义("ACCOUNT")
    );
    assert.deepEqual(
      {
        "原字段": "seconds",
        "释义": "n. 次级品, 二等品",
        "各词": [
          {
            "词": "seconds", "释义": "n. 次级品, 二等品",
            "词形": [
              {
                "变化": [
                  "名词复数形式",
                  "第三人称单数"
                ],
                "类型": "原型变换形式"
              },
              { "类型": "原型", "变化": "second" }
            ]
          }
        ]
      },
      查词.取释义("seconds")
    );

    assert.equal("执行路径", 查词.取释义("execPath").释义);

    assert.equal("字符串_译码器", 查词.取释义("string_decoder").释义);
    assert.equal("帐户_数字", 查词.取释义("ACCOUNT_NUMBER").释义);
    assert.equal("帐户数字", 查词.取释义("_ACCOUNT_NUMBER").释义);

    assert.equal("取得指令秒", 查词.取释义("getSeconds").释义);
    assert.equal("使用颜色", 查词.取释义("useColors").释义);

    assert.equal("fs路径", 查词.取释义("fsPath").释义);

    // 取现在分词原型
    检查释义("gettingStarted", "取得指令出发");

    // 词性搭配
    // 形容词+名词
    检查释义("BasicCalculator", "基本的计算器");
    // 副词+及物动词
    // 检查释义("deepEqual", "深入地等于")
    // 同时有以上两种组合
    检查释义("firstSteps", "第一的步骤");
  });

  function 检查释义(原词语, 释义) {
    assert.equal(释义, 查词.取释义(原词语).释义);
  }
});