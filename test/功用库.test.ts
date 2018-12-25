import * as assert from 'assert'

import * as 功用库 from '../src/util'

suite("测试", () => {

  test("取文件名", () => {
    assert.equal("甲.java", 功用库.取文件名("/a/b/c/甲.java"));
  });
});