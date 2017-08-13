import { Component } from '@angular/core';
import { IonicPage, NavController, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import * as momentjs from 'moment';

import { AddDataLiteProvider } from '../../providers/add-data-lite/add-data-lite';
import { UpdateDataLiteProvider } from '../../providers/update-data-lite/update-data-lite';
import { DeleteDataLiteProvider } from '../../providers/delete-data-lite/delete-data-lite';

import { Transactions } from '../../class/transactions-class';

@IonicPage()
@Component({
	selector: 'page-dashboard',
	templateUrl: 'dashboard.html',
})
export class DashboardPage {

	transaction: Transactions;

	transactions: any;
	loading: any;
	sum: number = 0;
	cash: number = 0;
	sumTr: number = 0;

	moment = {
		dateValue : momentjs().format('YYYY-MM-DD'),
		timeValue : momentjs().format('HH:mm:ss')
	}

	constructor(
		public navCtrl: NavController,
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController,
		private sqlite: SQLite,
		private addData: AddDataLiteProvider,
		private updateData: UpdateDataLiteProvider,
		private deleteData: DeleteDataLiteProvider)
	{
		this.getDataTransaction();
	}

	newTransaction()
	{
		let prompt = this.alertCtrl.create({
			message: 'Add Transaction.',
			inputs: [
				{
					name 		: 'transaction_name',
					placeholder : 'Transaction Name'
				},
				{
					name 		: 'amount',
					id 			: 'amount',
					placeholder : 'Amount',
					type 		: 'number'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					handler: data => {}
				},
				{
					text: 'Save',
					handler: data => {
						this.transaction = data;

						this.transaction.remark		= '-';
						this.transaction.status		= 'open';
						this.transaction.created_by	= '-'; // localStorage.getItem('username');
						this.transaction.updated_by	= '-'; // localStorage.getItem('username');
						this.transaction.created_at	= this.moment.dateValue +' '+ this.moment.timeValue;
						this.transaction.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;
						
						this.save();
					}
				}
			]
		});
		prompt.present();
	}

	save()
	{
		if (Number(this.transaction.amount) > Number(this.cash))
		{
			this.presentToast('Amount can not be greater than cash.');

		} else
		{
			this.showLoader('Saving data...');
			this.addData
				.addTransaction(this.transaction)
				.then((data) => {
					this.loading.dismiss();
					this.getDataTransaction();
					this.transaction = null;
				}, (err) => {
					this.loading.dismiss();
					this.presentToast('Error: '+ err);
				});
		}
	}

	edit(params: Transactions, premount: any)
	{
		let prompt = this.alertCtrl.create({
			message: 'Edit Transaction.',
			inputs: [
				{
					name 		: 'transaction_name',
					id 			: 'transaction_name',
					placeholder : 'Transaction Name',
					value 		: params.transaction_name
				},
				{
					name 		: 'amount',
					id 			: 'amount',
					placeholder : 'Amount',
					value 		: params.amount.toString(),
					type 		: 'number'
				}
			],
			buttons: [
				{
					text: 'Cancel',
					handler: data => {}
				},
				{
					text: 'Update',
					handler: data => {
						this.transaction = data;

						this.transaction.id 		= params.id
						this.transaction.remark		= params.remark;
						this.transaction.updated_by	= '-'; // localStorage.getItem('username');
						this.transaction.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.update(premount);
					}
				}
			]
		});
		prompt.present();
	}

	update(premount: any)
	{
		this.showLoader('Updating data...');
		this.updateData
			.updateDailyTransaction(this.transaction)
			.then(() => {
				this.loading.dismiss();
				this.getDataTransaction();
					this.transaction = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	remark(params: Transactions)
	{
		let prompt = this.alertCtrl.create({
			message: 'Update Remark.',
			inputs: [
				{
					name 		: 'remark',
					id 			: 'remark',
					placeholder : 'Remark',
					value 		: params.remark
				}
			],
			buttons: [
				{
					text: 'Cancel',
					handler: data => {}
				},
				{
					text: 'Update',
					handler: data => {
						this.transaction = data;

						this.transaction.id 		= params.id
						this.transaction.transaction_name	= params.transaction_name
						this.transaction.amount		= params.amount
						this.transaction.updated_by	= '-'; // localStorage.getItem('username');
						this.transaction.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.updateRemark();
					}
				}
			]
		});
		prompt.present();
	}

	updateRemark()
	{
		this.showLoader('Updating remark...');
		this.updateData
			.updateDailyTransaction(this.transaction)
			.then(() => {
				this.loading.dismiss();
				this.getDataTransaction();
					this.transaction = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	delete(params: Transactions)
	{
		let confirm = this.alertCtrl.create({
			title: 'Are you sure to delete this transaction?',
			buttons: [
				{
					text: 'No',
					handler: () => {}
				},
				{
					text: 'Yes',
					handler: () => {
						this.transaction = params;
						this.confirmDelete();
					}
				}
			]
		});
		confirm.present();
	}

	confirmDelete()
	{
		this.showLoader('Deleting data...');
		this.deleteData
			.deleteTransaction(this.transaction)
			.then((data) => {
				this.loading.dismiss();
				this.getDataTransaction();
					this.transaction = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	closeTransaction(params: Transactions)
	{
		let confirm = this.alertCtrl.create({
			title: 'Are you sure to close this transaction?',
			buttons: [
				{
					text: 'No',
					handler: () => {}
				},
				{
					text: 'Yes',
					handler: () => {
						this.transaction	= params;

						this.transaction.status		= 'close';
						this.transaction.updated_by	= '-'; // localStorage.getItem('username');
						this.transaction.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.confirmClose();
					}
				}
			]
		});
		confirm.present();
	}

	confirmClose()
	{
		this.showLoader('Close transaction...');
		this.updateData
			.closeDailyTransaction(this.transaction)
			.then(() => {
				this.loading.dismiss();
				this.getDataTransaction();
					this.transaction = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	getDataTransaction()
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							id,\
							transaction_name,\
							amount,\
							remark,\
							status,\
							created_by,\
							updated_by,\
							created_at,\
							updated_at\
						FROM\
							t_tr_transactions\
						WHERE\
							status = (?)\
						ORDER BY\
							id DESC", ['open'])
				.then((data) => {
					let transaction = [];
					this.sum = 0;
					
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							transaction.push({
								id 				: data.rows.item(i).id,
								transaction_name: data.rows.item(i).transaction_name,
								amount			: data.rows.item(i).amount,
								remark			: data.rows.item(i).remark,
								status			: data.rows.item(i).status,
								created_by		: data.rows.item(i).created_by,
								updated_by		: data.rows.item(i).updated_by,
								created_at		: data.rows.item(i).created_at,
								updated_at		: data.rows.item(i).updated_at
							});

							this.sum += data.rows.item(i).amount;
						}
					}
					if (data.rows.length == 0)
					{
						transaction = null;
						this.sum = 0;
					}

					this.getAllDataTransaction();

					this.transactions = transaction;

				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
				})
		});
	}

	getWithdraw(sumTr: number)
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							SUM(amount) AS sumWD,\
							type,\
							status\
						FROM\
							t_tr_rekening_detail\
						WHERE\
							type = (?)", ['withdraw'])
				.then((data) => {
					if (data.rows.length > 0)
					{
						this.cash = Number(data.rows.item(0).sumWD) - Number(sumTr);
					} else
					{
						this.cash = 0;
					}
				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
				})
		});
	}

	doRefresh(refresher)
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							id,\
							transaction_name,\
							amount,\
							remark,\
							status,\
							created_by,\
							updated_by,\
							created_at,\
							updated_at\
						FROM\
							t_tr_transactions\
						WHERE\
							status = (?)\
						ORDER BY\
							id DESC", ['open'])
				.then((data) => {
					let transaction = [];
					this.sum = 0;
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							transaction.push({
								id 				: data.rows.item(i).id,
								transaction_name: data.rows.item(i).transaction_name,
								amount			: data.rows.item(i).amount,
								remark			: data.rows.item(i).remark,
								status			: data.rows.item(i).status,
								created_by		: data.rows.item(i).created_by,
								updated_by		: data.rows.item(i).updated_by,
								created_at		: data.rows.item(i).created_at,
								updated_at		: data.rows.item(i).updated_at
							});

							this.sum += data.rows.item(i).amount;
						}
					}
					if (data.rows.length == 0)
					{
						transaction = null;
						this.sum = 0;
					}

					this.getAllDataTransaction();

					this.transactions = transaction;

					refresher.complete();
				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
					refresher.complete();
				})
		});
	}

	getAllDataTransaction()
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							amount,\
							status\
						FROM\
							t_tr_transactions\
						ORDER BY\
							id DESC", [])
				.then((data) => {
					this.sumTr = 0;
					
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							this.sumTr += data.rows.item(i).amount;
						}
					}
					if (data.rows.length == 0)
					{
						this.sumTr = 0;
					}
					this.getWithdraw(this.sumTr);
				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
				})
		});
	}

	calculator()
	{
		this.presentToast('Underconstuction..^^');
	}

	showLoader(msg)
	{
		this.loading = this.loadingCtrl.create({
			content: msg,
		});

		this.loading.present();
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
}
