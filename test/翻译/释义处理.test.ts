import * as assert from 'assert';
import * as 释义处理 from '../../src/翻译/处理'
import * as 词典常量 from '../../src/翻译/词典相关常量'

suite("释义处理测试", () => {

  test("取字段中所有词", () => {
    assert.deepEqual(["test"],
      释义处理.取字段中所有词("test"));
    assert.deepEqual(["China"],
      释义处理.取字段中所有词("China"));
    assert.deepEqual(["ACCOUNT"],
      释义处理.取字段中所有词("ACCOUNT"));

    assert.deepEqual(["Exec", "Path"],
      释义处理.取字段中所有词("ExecPath"));
    assert.deepEqual(["test", "OK"],
      释义处理.取字段中所有词("testOK"));

    assert.deepEqual(["string", "decoder"],
      释义处理.取字段中所有词("string_decoder"));
    assert.deepEqual(["ACCOUNT", "NUMBER"],
      释义处理.取字段中所有词("ACCOUNT_NUMBER"));
    assert.deepEqual(["ACCOUNT", "NUMBER"],
      释义处理.取字段中所有词("_ACCOUNT_NUMBER"));
  });

  test("首选", () => {
    assert.equal("甲", 释义处理.首选("n. 甲", 词典常量.词性_计算机));
    assert.equal("甲", 释义处理.首选("n. 甲\\nvt. 乙", 词典常量.词性_计算机));
    assert.equal("乙", 释义处理.首选("n. 甲\\n[计] 乙", 词典常量.词性_计算机));

    assert.equal("甲", 释义处理.首选("n. 甲(补充)", 词典常量.词性_计算机));
    assert.equal("甲", 释义处理.首选("n. 甲[补充]", 词典常量.词性_计算机));
    assert.equal("甲", 释义处理.首选("n. 甲（补充）", 词典常量.词性_计算机));

    assert.equal("形容词释义", 释义处理.首选("n. 甲\\na. 形容词释义", 词典常量.词性_形容词));
    assert.equal("名词释义", 释义处理.首选("a. 形容词释义\\nn. 名词释义", 词典常量.词性_名词));
  })

  test("取原型", () => {
    assert.equal("second", 释义处理.取原型("seconds",
      [{"类型": "原型变换形式", "变化": "名词复数形式"}, {"类型": "原型", "变化": "second"}]));
    assert.equal("get", 释义处理.取原型("getting",
      [{"类型": "原型变换形式", "变化": "现在分词"}, {"类型": "原型", "变化": "get"}]));
  })

  test("取按词性释义", () => {
    assert.deepEqual(["名词释义1", "名词释义2"], 释义处理.取按词性释义("n. 名词释义1, 名词释义2\\nadj. 形容词释义").get(词典常量.词性_名词));
    assert.deepEqual(["形容词释义"], 释义处理.取按词性释义("n. 名词释义1, 名词释义2\\na. 形容词释义").get(词典常量.词性_形容词));
  })
});