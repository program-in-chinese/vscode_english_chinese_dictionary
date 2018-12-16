'use strict';

import * as vscode from 'vscode';

export default class Provider implements vscode.TextDocumentContentProvider{

	static scheme = 'references';

	private _onDidChange = new vscode.EventEmitter<vscode.Uri>();
	private _editorDecoration = vscode.window.createTextEditorDecorationType({ textDecoration: 'underline' });
	private _subscriptions: vscode.Disposable;

	constructor() {
	}

	dispose() {
		this._subscriptions.dispose();
		this._editorDecoration.dispose();
		this._onDidChange.dispose();
	}

	// Expose an event to signal changes of _virtual_ documents
	// to the editor
	get onDidChange() {
		return this._onDidChange.event;
	}

	// Provider method that takes an uri of the `references`-scheme and
	// resolves its content by (1) running the reference search command
	// and (2) formatting the results
	provideTextDocumentContent(uri: vscode.Uri): string | Thenable<string> {
		return "class BasicCalculator {}";
		// Decode target-uri and target-position from the provided uri and execute the
		// `reference provider` command (http://code.visualstudio.com/docs/extensionAPI/vscode-api-commands).
		// From the result create a references document which is in charge of loading,
		// printing, and formatting references
		/*const [target, pos] = decodeLocation(uri);
		return vscode.commands.executeCommand<vscode.Location[]>('vscode.executeReferenceProvider', target, pos).then(locations => {

			// sort by locations and shuffle to begin from target resource
			let idx = 0;
			locations.sort(Provider._compareLocations).find((loc, i) => loc.uri.toString() === target.toString() && (idx = i) && true);
			locations.push(...locations.splice(0, idx));

			// create document and return its early state
			let document = new ReferencesDocument(uri, locations, this._onDidChange);
			this._documents.set(uri.toString(), document);
			return document.value;
		});*/
	}
}

let seq = 0;

export function encodeLocation(uri: vscode.Uri, pos: vscode.Position): vscode.Uri {
	const query = JSON.stringify([uri.toString(), pos.line, pos.character]);
	return vscode.Uri.parse(`${Provider.scheme}:test.java?${query}#${seq++}`);
}

export function decodeLocation(uri: vscode.Uri): [vscode.Uri, vscode.Position] {
	let [target, line, character] = <[string, number, number]>JSON.parse(uri.query);
	return [vscode.Uri.parse(target), new vscode.Position(line, character)];
}
