'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "ts-gen-1-1-16-yo-2-0" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.翻译选中文本', () => {
        // The code you place here will be executed every time your command is executed

        var 编辑器 = vscode.window.activeTextEditor;
        if (!编辑器) {
            return; // 无打开的编辑器
        }
        
        var 选中部分 = 编辑器.selection;
        var 文本 = 编辑器.document.getText(选中部分);
        
        // 显示信息框
        vscode.window.showInformationMessage('选中字符数: ' + 文本.length);
    });

    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}