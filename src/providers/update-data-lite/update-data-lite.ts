import { Injectable } from '@angular/core';
import { ToastController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import 'rxjs/add/operator/toPromise';

import { Rekening } from '../../class/rekening-class';
import { RekeningDetail } from '../../class/rekening-detail-class';
import { Transactions } from '../../class/transactions-class';

@Injectable()
export class UpdateDataLiteProvider {

	constructor(
		private sqlite: SQLite,
		private toastCtrl: ToastController)
	{}

	updateRekening(rek: Rekening): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				UPDATE\
					t_mr_rekening\
				SET\
					rekening_name = (?),\
					balance = (?),\
					remark = (?),\
					updated_by = (?),\
					updated_at = (?)\
				WHERE\
					id = (?)\
			", [rek.rekening_name, rek.balance, rek.remark, rek.updated_by, rek.updated_at, rek.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	updateRekeningBalance(rekDetail: RekeningDetail, balance: number): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				UPDATE\
					t_mr_rekening\
				SET\
					balance = (?),\
					updated_by = (?),\
					updated_at = (?)\
				WHERE\
					id = (?)\
			", [balance, rekDetail.updated_by, rekDetail.updated_at, rekDetail.rekening_id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	updateRekeningDetail(rekDetail: RekeningDetail): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				UPDATE\
					t_tr_rekening_detail\
				SET\
					amount = (?),\
					remark = (?),\
					updated_by = (?),\
					updated_at = (?)\
				WHERE\
					id = (?)\
			", [rekDetail.amount, rekDetail.remark, rekDetail.updated_by, rekDetail.updated_at, rekDetail.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	closeRekeningDetail(rekDetail: RekeningDetail): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				UPDATE\
					t_tr_rekening_detail\
				SET\
					status = (?),\
					updated_by = (?),\
					updated_at = (?)\
				WHERE\
					id = (?)\
			", [rekDetail.status, rekDetail.updated_by, rekDetail.updated_at, rekDetail.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	updateDailyTransaction(transct: Transactions): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				UPDATE\
					t_tr_transactions\
				SET\
					transaction_name = (?),\
					amount = (?),\
					remark = (?),\
					updated_by = (?),\
					updated_at = (?)\
				WHERE\
					id = (?)\
			", [transct.transaction_name, transct.amount, transct.remark, transct.updated_by, transct.updated_at, transct.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	closeDailyTransaction(transct: Transactions): Promise<any>
	{
		return this.sqlite.create({
			name 	: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
				UPDATE\
					t_tr_transactions\
				SET\
					status = (?),\
					updated_by = (?),\
					updated_at = (?)\
				WHERE\
					id = (?)\
			", [transct.status, transct.updated_by, transct.updated_at, transct.id])
			.then(rek => rek.json())
			.catch(this.handleError);
		})
		.catch((error) => {
			this.handleError(error);
		})
	}

	presentToast(msg)
	{
		let toast = this.toastCtrl.create({
			message 			: msg,
			duration 			: 4000,
			position 			: 'top',
			dismissOnPageChange	: true
		});

		toast.onDidDismiss(() => {
			// console.log('Dismissed toast');
		});

		toast.present();
	}

	private handleError(error: any): Promise<any>
	{
		this.presentToast('Data: ' + JSON.stringify(error));
		return Promise.reject(error.message || error);
	}

}
