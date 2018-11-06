const vscode = require('vscode');
const 查词 = require('./查词')

var 词典数据 = {};
var 词形变化数据 = {};
for (var 文件序号 = 0; 文件序号 < 16; 文件序号++) {
    let 数据 = require('./词典数据/词典' + 文件序号).数据;
    for (var 英文 in 数据) {
        词典数据[英文] = 数据[英文];
    }
}
let 词形变化源数据 = require('./词典数据/词形变化').数据
for (var 英文 in 词形变化源数据) {
    词形变化数据[英文] = 词形变化源数据[英文];
}

function activate(context) {
    const window = vscode.window;
    const StatusBarAlignment = vscode.StatusBarAlignment;
    const workspace = vscode.workspace;
    const commands = vscode.commands;

    const 状态框 = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    状态框.command = 'extension.selectedText';
    context.subscriptions.push(状态框);

    context.subscriptions.push(window.onDidChangeActiveTextEditor(e => 更新状态栏(状态框)));
    context.subscriptions.push(window.onDidChangeTextEditorSelection(e => 更新状态栏(状态框)));
    context.subscriptions.push(window.onDidChangeTextEditorViewColumn(e => 更新状态栏(状态框)));
    context.subscriptions.push(workspace.onDidOpenTextDocument(e => 更新状态栏(状态框)));
    context.subscriptions.push(workspace.onDidCloseTextDocument(e => 更新状态栏(状态框)));

    context.subscriptions.push(commands.registerCommand('extension.selectedText', () => {
        // TODO: 避免重复查询(状态框查询一次即可?)
        let 文本 = 取选中文本();
        if (文本) {
            window.showInformationMessage(显示词条(查询词条(文本), 1000));
        }
    }));

    更新状态栏(状态框);
}

function 更新状态栏(状态框) {
    let 文本 = 取选中文本();
    if (文本) {
        状态框.text = '$(megaphone) ' + 显示词条(查询词条(文本), 30);
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
    var 中文释义 = 查词.取释义(词典数据, 英文);
    if (!中文释义) {
        英文 = 英文.toLowerCase();
        中文释义 = 查词.取释义(词典数据, 英文);
    }
    if (!中文释义) {
        英文 = 英文.toUpperCase();
        中文释义 = 查词.取释义(词典数据, 英文);
    }
    return { "释义": 中文释义, "词形": 查词.提取词形(词形变化数据[英文]) };
}

function 显示词条(查词结果, 最大长度) {
    var 释义 = 查词结果.释义;
    var 词形 = 查词结果.词形;
    var 显示 = "";
    if (释义) {
        显示 = 释义.split('\\n').join(" ");
    }
    if (词形.length > 0) {
        var 词形显示 = "";
        for (var 某词形 of 词形) {
            词形显示 += 某词形.类型 + ": " + 某词形.变化 + "; ";
        }
        显示 += "  " + 词形显示;
    }
    return 显示.length > 最大长度 ? 显示.substring(0, 最大长度 - 1) + "..." : 显示;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;