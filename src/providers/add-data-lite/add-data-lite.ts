import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import 'rxjs/add/operator/toPromise';

import { Rekening } from '../../class/rekening-class';
import { RekeningDetail } from '../../class/rekening-detail-class';
import { Transactions } from '../../class/transactions-class';

@Injectable()
export class AddDataLiteProvider {

	constructor(
		private sqlite: SQLite)
	{}

	addRekening(rek: Rekening): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				INSERT INTO\
					t_mr_rekening (\
						rekening_name,\
						balance,\
						remark,\
						created_by,\
						updated_by,\
						created_at,\
						updated_at\
					)\
				VALUES (\
					?,\
					?,\
					?,\
					?,\
					?,\
					?,\
					?\
				)\
			", [rek.rekening_name, rek.balance, rek.remark, rek.created_by, rek.updated_by, rek.created_at, rek.updated_at])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	addRekeningDetail(rekDetail: RekeningDetail): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				INSERT INTO\
					t_tr_rekening_detail (\
						rekening_id,\
						amount,\
						type,\
						remark,\
						status,\
						created_by,\
						updated_by,\
						created_at,\
						updated_at\
					)\
				VALUES (\
					?,\
					?,\
					?,\
					?,\
					?,\
					?,\
					?,\
					?,\
					?\
				)\
			", [rekDetail.rekening_id, rekDetail.amount, rekDetail.type, rekDetail.remark, rekDetail.status, rekDetail.created_by, rekDetail.updated_by, rekDetail.created_at, rekDetail.updated_at])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	addTransaction(dailyTr: Transactions): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				INSERT INTO\
					t_tr_transactions (\
						transaction_name,\
						amount,\
						remark,\
						status,\
						created_by,\
						updated_by,\
						created_at,\
						updated_at\
					)\
				VALUES (\
					?,\
					?,\
					?,\
					?,\
					?,\
					?,\
					?,\
					?\
				)\
			", [dailyTr.transaction_name, dailyTr.amount, dailyTr.remark, dailyTr.status, dailyTr.created_by, dailyTr.updated_by, dailyTr.created_at, dailyTr.updated_at])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	private handleError(error: any): Promise<any>
	{
		return Promise.reject(error.message || error);
	}
}