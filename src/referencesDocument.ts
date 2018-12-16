/*---------------------------------------------------------
 * Copyright (C) Microsoft Corporation. All rights reserved.
 *--------------------------------------------------------*/
'use strict';

import * as vscode from 'vscode';

export default class ReferencesDocument {

	private _uri: vscode.Uri;
	private _emitter: vscode.EventEmitter<vscode.Uri>;
	private _locations: vscode.Location[];

	private _lines: string[];
	private _links: vscode.DocumentLink[];
	private _join: Thenable<this>;

	constructor(uri: vscode.Uri, locations: vscode.Location[], emitter: vscode.EventEmitter<vscode.Uri>) {
		this._uri = uri;
		this._locations = locations;

		// The ReferencesDocument has access to the event emitter from
		// the containg provider. This allows it to signal changes
		this._emitter = emitter;

		// Start with printing a header and start resolving
		this._lines = [`本文 ${this._locations.length} references`];
	}

	get value() {
		return this._lines.join('\n');
	}

	get links() {
		return this._links;
	}

	join(): Thenable<this> {
		return this._join;
	}

}
