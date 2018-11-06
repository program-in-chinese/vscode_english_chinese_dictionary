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
        let 文本 = 取选中文本();
        let 显示 = "";
        if (文本) {
            显示 = 查词.取释义(词典数据, 文本);
            if (词形变化数据[文本]) {
                显示 += "    " + JSON.stringify(查词.提取词形(词形变化数据[文本]))
            }
        }
        window.showInformationMessage(显示);
    }));

    更新状态栏(状态框);
}

// TODO: 改正: 如选中'constructor', 显示'function()...'
function 更新状态栏(状态框) {
    let 文本 = 取选中文本();
    console.log(文本);
    if (文本) {
        状态框.text = '$(megaphone) ' + 查词.取释义(词典数据, 文本); // TODO: 显示简要释义
    }

    if (文本) {
        console.log("显示");
        状态框.show();
    } else {
        console.log("隐藏");
        状态框.hide();
    }
}

function 取选中文本() {
    const 当前编辑器 = vscode.window.activeTextEditor;
    const 选中部分 = 当前编辑器.selection;
    return 当前编辑器.document.getText(选中部分);
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;