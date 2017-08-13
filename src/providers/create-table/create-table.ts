import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class CreateTableProvider {

	constructor(
		private sqlite: SQLite)
	{}

	private handleError(error: any): Promise<any>
	{
		return Promise.reject(error.message || error);
	}

	tabelMasterUser()
	{
		this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				CREATE TABLE IF NOT EXISTS\
					t_mr_user (\
						username TEXT,\
						password TEXT,\
						created_by TEXT,\
						updated_by TEXT,\
						created_at TEXT,\
						updated_at TEXT\
					)", {})
			.then(() => {})
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	tabelMasterRekening()
	{
		this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				CREATE TABLE IF NOT EXISTS\
					t_mr_rekening (\
						id INTEGER PRIMARY KEY AUTOINCREMENT,\
						rekening_name TEXT,\
						balance TEXT,\
						remark TEXT,\
						created_by TEXT,\
						updated_by TEXT,\
						created_at TEXT,\
						updated_at TEXT\
					)", {})
			.then(() => {})
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	tabelRekeningDetail()
	{
		this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				CREATE TABLE IF NOT EXISTS\
					t_tr_rekening_detail (\
						id INTEGER PRIMARY KEY AUTOINCREMENT,\
						rekening_id INTEGER,\
						amount INTEGER,\
						type TEXT,\
						remark TEXT,\
						status TEXT,\
						created_by TEXT,\
						updated_by TEXT,\
						created_at TEXT,\
						updated_at TEXT\
					)", {})
			.then(() => {})
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	tabelTransaction()
	{
		this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				CREATE TABLE IF NOT EXISTS\
					t_tr_transactions (\
						id INTEGER PRIMARY KEY AUTOINCREMENT,\
						transaction_name TEXT,\
						amount INTEGER,\
						remark TEXT,\
						status TEXT,\
						created_by TEXT,\
						updated_by TEXT,\
						created_at TEXT,\
						updated_at TEXT\
					)", {})
			.then(() => {})
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

}
