const vscode = require('vscode');
import { workspace, languages, window, commands, ExtensionContext, Disposable, StatusBarAlignment, TextDocument, Position, Hover} from 'vscode';
import 内容提供器, { encodeLocation } from './整文件翻译';
import * as 模型 from './翻译/数据类型'
import * as 查词 from './查词';

function activate(context: ExtensionContext) {

    const 提供器 = new 内容提供器();

    const 提供器注册 = Disposable.from(
		workspace.registerTextDocumentContentProvider(内容提供器.scheme, 提供器)
    );

	const 命令注册 = commands.registerTextEditorCommand('editor.批量翻译标识符', 编辑器 => {
		const uri = encodeLocation(编辑器.document.uri, 编辑器.selection.active);
		return workspace.openTextDocument(uri).then(代码文件 => window.showTextDocument(代码文件, 编辑器.viewColumn + 1));
    });

    const 状态框 = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    状态框.command = 'extension.翻译选中文本';
    context.subscriptions.push(
        提供器,
        命令注册,
        提供器注册,
        状态框
    );

    context.subscriptions.push(window.onDidChangeActiveTextEditor(e => 更新状态栏(状态框)));
    context.subscriptions.push(window.onDidChangeTextEditorSelection(e => 更新状态栏(状态框)));
    context.subscriptions.push(window.onDidChangeTextEditorViewColumn(e => 更新状态栏(状态框)));
    context.subscriptions.push(workspace.onDidOpenTextDocument(e => 更新状态栏(状态框)));
    context.subscriptions.push(workspace.onDidCloseTextDocument(e => 更新状态栏(状态框)));

    context.subscriptions.push(commands.registerCommand('extension.翻译选中文本', () => {
        // TODO: 避免重复查询(状态框查询一次即可?)
        let 文本 = 取选中文本();
        if (文本) {
            let 显示 = 显示字段信息(查询词条(文本));
            window.showInformationMessage(显示词条(显示, 1000));
        }
    }));

    更新状态栏(状态框);

    // 读取配置，是否启用hover显示
    const 启用悬停配置 = 'EnglishChineseDictionary.enableHover';
    let 启用悬停 = workspace.getConfiguration().get(启用悬停配置)
    context.subscriptions.push(workspace.onDidChangeConfiguration((事件) => {
      if (事件.affectsConfiguration(启用悬停配置)) {
        启用悬停 = workspace.getConfiguration().get(启用悬停配置)
      }
    }))
    // 注册hover提供器
    context.subscriptions.push(languages.registerHoverProvider({
      pattern: '**',
    }, {
      provideHover: (文档: TextDocument, 位置: Position) => {
        if (启用悬停) {
          const 文本 = 文档.getText(文档.getWordRangeAtPosition(位置)).trim();
          const 翻译结果 = 显示字段信息(查询词条(文本))
          return new Hover(翻译结果)
        }
      }
    }))
}

function 更新状态栏(状态框) {
    let 文本 = 取选中文本();
    if (文本) {
        状态框.text = "$(megaphone) " + 显示词条(显示简要信息(查询词条(文本)), 30);
        状态框.show();
    } else {
        状态框.hide();
    }
}

function 取选中文本(): string {
    const 当前编辑器 = window.activeTextEditor;
    if (当前编辑器) {
        const 选中部分 = 当前编辑器.selection;
        return 当前编辑器.document.getText(选中部分);
    }
}

function 查询词条(英文: string): 模型.字段释义 {
    return 查词.取释义(英文);
}

function 显示词条(显示, 最大长度: number): string {
    return 显示.length > 最大长度 ? 显示.substring(0, 最大长度 - 1) + "..." : 显示;
}

function 显示简要信息(查字段结果: 模型.字段释义): string {
    if (!查字段结果.释义) {
        return "查无结果: " + 查字段结果.原字段;
    }
    if (查字段结果.各词.length == 1) {
        return 取单词条信息(查字段结果.各词[0], false);
    } else {
        return 查字段结果.释义;
    }
}

function 显示字段信息(查字段结果: 模型.字段释义): string {
    // 长度必大于0
    if (查字段结果.各词.length == 1) {
        return 取单词条信息(查字段结果.各词[0], true);
    } else {
        const 翻译结果 = 查字段结果.各词.map(单词结果 => 取单词条信息(单词结果, true, false))
        const 结果模版 = new vscode.MarkdownString();
        翻译结果.forEach(单词结果 => 结果模版.appendText(`${单词结果}\n`));
        return 结果模版
    }
}

function 取单词条信息(查词结果: 模型.单词条, 显示原词: boolean = false, 显示词形: boolean = true): string {
    let 显示 = 显示原词 ? "【" + 查词结果.词 + "】" : "";
    let 释义 = 查词结果.释义;
    if (释义) {
        显示 += " " + 释义.split('\\n').join(" ");
    }

    let 词形 = 查词结果.词形;
    if (显示词形 && 词形.length > 0) {
        let 词形显示 = "";
        for (let 某词形 of 词形) {
            词形显示 += 某词形.类型 + ": " + 某词形.变化 + "; ";
        }
        显示 += "  " + 词形显示;
    }
    return 显示;
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;
