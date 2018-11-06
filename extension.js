// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
function activate(context) {
    const window = vscode.window;
    const StatusBarAlignment = vscode.StatusBarAlignment;
    const workspace = vscode.workspace;
    const commands = vscode.commands;

    const status = window.createStatusBarItem(StatusBarAlignment.Right, 100);
    status.command = 'extension.selectedText';
    context.subscriptions.push(status);

    context.subscriptions.push(window.onDidChangeActiveTextEditor(e => updateStatus(status)));
    context.subscriptions.push(window.onDidChangeTextEditorSelection(e => updateStatus(status)));
    context.subscriptions.push(window.onDidChangeTextEditorViewColumn(e => updateStatus(status)));
    context.subscriptions.push(workspace.onDidOpenTextDocument(e => updateStatus(status)));
    context.subscriptions.push(workspace.onDidCloseTextDocument(e => updateStatus(status)));

    context.subscriptions.push(commands.registerCommand('extension.selectedText', () => {
        window.showInformationMessage(getSelectedText());
    }));

    updateStatus(status);
}

function updateStatus(status) {
    let text = getSelectedText();
    if (text) {
        status.text = '$(megaphone) ' + text;
    }

    if (text) {
        status.show();
    } else {
        status.hide();
    }
}

function getSelectedText() {
    const editor = vscode.window.activeTextEditor
    const selection = editor.selection
    const text = editor.document.getText(selection)

    return text;
}

exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {
}
exports.deactivate = deactivate;