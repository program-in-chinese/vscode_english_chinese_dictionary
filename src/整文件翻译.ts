'use strict';

import * as vscode from 'vscode';

export default class 整文件翻译 implements vscode.TextDocumentContentProvider{

	static scheme = 'references';
	private _演示字典: Map<String, String> = new Map([
		["BasicCalculator", "基本的计算器"],
		["Calculator", "计算器类"],
		["calculator", "计算器"],
		["add", "加"],
		["subtract", "減"],
		["multiply", "乘"],
		["divide", "除"],
		["first", "第一"],
		["second", "第二"],
		["number", "数"],
		["divisor", "除数"]
	]);

	dispose() {
	}

	provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
		// TODO: 如果没有档期活跃编辑器, 返回空
		let textEditor = vscode.window.activeTextEditor;
		vscode.commands.executeCommand<vscode.DocumentSymbol[]>('vscode.executeDocumentSymbolProvider', textEditor.document.uri)
			.then(
				(symbols: Array<vscode.DocumentSymbol>) => {
					console.log(symbols.length);
					for (var 标识符 of symbols) {
						console.log(标识符.name);
						for (var 子标识符 of 标识符.children) {
							console.log(子标识符.name);
						}
					}
				}
			);
		// vscode.SymbolInformation[] | 
		// vscode.SymbolInformation | 
		
		var 新内容 = textEditor.document.getText();
		for (var 原命名 of this._演示字典.keys()) {
		  新内容 = this._replaceAll(新内容, 原命名, this._演示字典.get(原命名));
		}
		return 新内容;
	}

	private _replaceAll(str, find, replace) {
    return str.replace(new RegExp(find, 'g'), replace);
  }
}

let seq = 0;

export function encodeLocation(uri: vscode.Uri, pos: vscode.Position): vscode.Uri {
	const query = JSON.stringify([uri.toString(), pos.line, pos.character]);
	return vscode.Uri.parse(`${整文件翻译.scheme}:test.java?${query}#${seq++}`);
}
