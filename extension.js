const vscode = require('vscode');
const 查词 = require('./查词')

function activate(context) {
    const window = vscode.window;
    const StatusBarAlignment = vscode.StatusBarAlignment;
    const workspace = vscode.workspace;
    const commands = vscode.commands;

    const 状态框 = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    状态框.command = 'extension.翻译选中文本';
    context.subscriptions.push(状态框);

    context.subscriptions.push(window.onDidChangeActiveTextEditor(e => 更新状态栏(状态框)));
    context.subscriptions.push(window.onDidChangeTextEditorSelection(e => 更新状态栏(状态框)));
    context.subscriptions.push(window.onDidChangeTextEditorViewColumn(e => 更新状态栏(状态框)));
    context.subscriptions.push(workspace.onDidOpenTextDocument(e => 更新状态栏(状态框)));
    context.subscriptions.push(workspace.onDidCloseTextDocument(e => 更新状态栏(状态框)));

    context.subscriptions.push(commands.registerCommand('extension.翻译选中文本', () => {
        // TODO: 避免重复查询(状态框查询一次即可?)
        let 文本 = 取选中文本();
        if (文本) {
            var 显示 = 显示字段信息(查询词条(文本));
            window.showInformationMessage(显示词条(显示, 1000));
        }
    }));

    更新状态栏(状态框);
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

function 取选中文本() {
    const 当前编辑器 = vscode.window.activeTextEditor;
    const 选中部分 = 当前编辑器.selection;
    return 当前编辑器.document.getText(选中部分);
}

function 查询词条(英文) {
    return 查词.取释义(英文);
}

function 显示词条(显示, 最大长度) {
    return 显示.length > 最大长度 ? 显示.substring(0, 最大长度 - 1) + "..." : 显示;
}

// {"原字段": 原字段, "释义": 翻译, "各词": [{"词": 英文, "释义": 单词释义, "词形": [所有变形]}]};
function 显示简要信息(查字段结果) {
    if (!查字段结果.释义) {
        return "查无结果: " + 查字段结果.原字段;
    }
    if (查字段结果.各词.length == 1) {
        return 取单词条信息(查字段结果.各词[0], false);
    } else {
        return 查字段结果.释义;
    }
}

// {"原字段": 原字段, "释义": 翻译, "各词": [{"词": 英文, "释义": 单词释义, "词形": [所有变形]}]};
function 显示字段信息(查字段结果) {
    // 长度必大于0
    if (查字段结果.各词.length == 1) {
        return 取单词条信息(查字段结果.各词[0], true);
    } else {
        var 翻译 = "";
        for (单词结果 of 查字段结果.各词) {
            翻译 += 取单词条信息(单词结果, true, false);
        }
    }
    return 翻译;
}

// {"词": 英文, "释义": 单词释义, "词形": [所有变形]}
function 取单词条信息(查词结果, 显示原词 = false, 显示词形 = true) {
    var 显示 = 显示原词 ? "【" + 查词结果.词 + "】" : "";
    var 释义 = 查词结果.释义;
    if (释义) {
        显示 += " " + 释义.split('\\n').join(" ");
    }

    var 词形 = 查词结果.词形;
    if (显示词形 && 词形.length > 0) {
        var 词形显示 = "";
        for (var 某词形 of 词形) {
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