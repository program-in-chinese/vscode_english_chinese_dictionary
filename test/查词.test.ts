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

    assert.deepEqual(
      {
        "原字段": "eventListener",
        "释义": "事件监听器",
        "各词": [
          {
            "词": "event", "释义": "n. 事件, 结果, 事情的进程, 竞赛项目\\n[计] 事件",
            "词形": [
              {
                "变化": "events",
                "类型": "名词复数形式"
              }
            ]
          },
          {
            "词": "listener", "释义": "n. 收听者, 听众",
            "词形": [
              {
                "变化": "listeners",
                "类型": "名词复数形式"
              }
            ]
          }
        ]
      },
      查词.取释义("eventListener")
    );

    检查释义("execPath", "执行路径");

    检查释义("string_decoder", "字符串_译码器");
    检查释义("NUMBER_ACCOUNT", "数字_帐户");
    检查释义("_NUMBER_ACCOUNT", "_数字_帐户");
    检查释义("number_account_0", "数字_帐户_0");
    检查释义("number_account0", "数字_帐户0");

    // 对于仅有一个单词且有其他字符的命名, 忽略其他字符, 按照单词查询释义
    // 检查释义("account0", "帐户0");

    检查释义("getSeconds", "获取秒");
    检查释义("useColors", "使用颜色");

    检查释义("fsPath", "fs路径");

    // 取现在分词原型
    检查释义("gettingGoods", "获取货物")

    // 词性搭配
    // 形容词+名词
    检查释义("BasicCalculator", "基本的计算器");
    // 副词+及物动词
    // 检查释义("deepEqual", "深入地等于")
    // 同时有以上两种组合
    检查释义("lastSteps", "最后的步骤");

    // 忽略常见单词
    检查释义("is_decoder", "为_译码器");

    // 获取常用命名
    检查释义("eventListener", "事件监听器");

    // 使用自定义短语释义
    检查释义("gettingStarted", "启动");

    // 将...替换为后续内容
    检查释义("beforeRedesign", "在...之前重新设计");
    检查释义("afterRedesignMobile", "在...之后重新设计移动的");

    // 优先查询短语
    检查释义("lastName", "姓");
    检查释义("firstName", "名");
    检查释义("ACCOUNT_NUMBER", "帐号");
    检查释义("firstSteps", "首要步骤");

  });

  function 检查释义(原词语, 释义) {
    assert.equal(释义, 查词.取释义(原词语).释义);
  }
});