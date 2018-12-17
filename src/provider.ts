'use strict';

import * as vscode from 'vscode';

export default class Provider implements vscode.TextDocumentContentProvider{

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
		["divisor", "被除数"]
	]);

	dispose() {
	}

	provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
		var 新内容 = vscode.window.activeTextEditor.document.getText();
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
	return vscode.Uri.parse(`${Provider.scheme}:test.java?${query}#${seq++}`);
}
