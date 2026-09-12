import * as assert from 'assert';
import { commands, extensions, Hover, MarkdownString, Position, Selection, window, workspace } from 'vscode';

suite('状态栏详情回归测试', function () {
    this.timeout(15000);
    const 原消息函数 = window.showInformationMessage;
    let 原悬停配置: boolean;
    let 消息: string[];

    suiteSetup(async () => {
        原悬停配置 = workspace.getConfiguration('EnglishChineseDictionary').inspect<boolean>('enableHover').globalValue;
        await workspace.getConfiguration('EnglishChineseDictionary').update('enableHover', false, true);
        await extensions.getExtension('CodeInChinese.EnglishChineseDictionary').activate();
    });

    setup(() => {
        消息 = [];
        // 只拦截显示出口；命令、文档选择及扩展激活均在真实扩展宿主中运行。
        window.showInformationMessage = <any>((内容: string) => {
            assert.strictEqual(typeof 内容, 'string', '消息 API 只能接收字符串');
            消息.push(内容);
            return Promise.resolve(undefined);
        });
    });

    teardown(async () => {
        window.showInformationMessage = 原消息函数;
        await commands.executeCommand('workbench.action.closeAllEditors');
    });

    suiteTeardown(async () => {
        await workspace.getConfiguration('EnglishChineseDictionary').update('enableHover', 原悬停配置, true);
    });

    async function 选择并翻译(内容: string, 选择长度 = 内容.length): Promise<void> {
        const 文档 = await workspace.openTextDocument({ content: 内容, language: 'plaintext' });
        const 编辑器 = await window.showTextDocument(文档);
        编辑器.selection = new Selection(new Position(0, 0), new Position(0, 选择长度));
        await commands.executeCommand('extension.翻译选中文本');
    }

    test('关闭 hover 后，驼峰词仍显示各词详情和未转义的分类括号', async () => {
        assert.strictEqual(workspace.getConfiguration('EnglishChineseDictionary').get('enableHover'), false);
        await 选择并翻译('eventListener');
        assert.strictEqual(消息.length, 1);
        assert.ok(消息[0].indexOf('【event】') >= 0);
        assert.ok(消息[0].indexOf('【listener】') >= 0);
        assert.ok(消息[0].indexOf('[计] 事件') >= 0);
        assert.strictEqual(消息[0].indexOf('\\[计\\]'), -1);
    });

    test('下划线常量保留每个单词的详情', async () => {
        await 选择并翻译('ACCOUNT_NUMBER');
        assert.strictEqual(消息.length, 1);
        assert.ok(消息[0].indexOf('【account】') >= 0);
        assert.ok(消息[0].indexOf('【number】') >= 0);
    });

    test('单词保留释义和词形信息', async () => {
        await 选择并翻译('shipment');
        assert.strictEqual(消息.length, 1);
        assert.ok(消息[0].indexOf('【shipment】') >= 0);
        assert.ok(消息[0].indexOf('名词复数形式: shipments') >= 0);
    });

    test('不额外过滤单字母的详情', async () => {
        await 选择并翻译('a');
        assert.strictEqual(消息.length, 1);
        assert.ok(消息[0].indexOf('【a】') >= 0);
    });

    test('未收录词仍以原词显示', async () => {
        await 选择并翻译('qzxvqw');
        assert.deepEqual(消息, ['【qzxvqw】']);
    });

    test('空选择不弹出消息', async () => {
        await 选择并翻译('eventListener', 0);
        assert.deepEqual(消息, []);
    });

    test('多词长详情沿用现有截断规则', async () => {
        await 选择并翻译('event_'.repeat(100) + 'listener');
        assert.strictEqual(消息.length, 1);
        assert.ok(消息[0].length <= 1002);
        assert.ok(消息[0].endsWith('...'));
    });

    test('开启 hover 后仍返回安全的 Markdown 详情', async () => {
        await workspace.getConfiguration('EnglishChineseDictionary').update('enableHover', true, true);
        try {
            await 选择并翻译('eventListener');
            const 文档 = window.activeTextEditor.document;
            const 悬停 = await commands.executeCommand<Hover[]>('vscode.executeHoverProvider', 文档.uri, new Position(0, 3));
            const 详情 = 悬停.reduce<MarkdownString[]>((全部, 项) => 全部.concat(<MarkdownString[]>项.contents), [])
                .find(项 => typeof 项.value === 'string' && 项.value.indexOf('【event】') >= 0);
            assert.ok(详情, '应有词典提供的 Markdown 详情');
            assert.ok(详情.value.indexOf('【listener】') >= 0);
            assert.notStrictEqual(详情.isTrusted, true);
            assert.strictEqual(消息.length, 1);
        } finally {
            await workspace.getConfiguration('EnglishChineseDictionary').update('enableHover', false, true);
        }
    });
});
