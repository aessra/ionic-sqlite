import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import 'rxjs/add/operator/toPromise';

import { Rekening } from '../../class/rekening-class';
import { RekeningDetail } from '../../class/rekening-detail-class';
import { Transactions } from '../../class/transactions-class';

@Injectable()
export class DeleteDataLiteProvider {

	constructor(
		private sqlite: SQLite)
	{}

	deleteRekening(rek: Rekening): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				DELETE FROM\
					t_mr_rekening\
				WHERE\
					id = (?)\
			", [rek.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	deleteRekeningDetail(rekDetail: RekeningDetail)
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				DELETE FROM\
					t_tr_rekening_detail\
				WHERE\
					id = (?)\
			", [rekDetail.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	deleteTransaction(transaction: Transactions)
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				DELETE FROM\
					t_tr_transactions\
				WHERE\
					id = (?)\
			", [transaction.id])
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
