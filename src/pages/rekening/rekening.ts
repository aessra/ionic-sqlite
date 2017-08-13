import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import * as momentjs from 'moment';

import { AddDataLiteProvider } from '../../providers/add-data-lite/add-data-lite';
import { UpdateDataLiteProvider } from '../../providers/update-data-lite/update-data-lite';
import { DeleteDataLiteProvider } from '../../providers/delete-data-lite/delete-data-lite';

import { Rekening } from '../../class/rekening-class';
import { RekeningDetail } from '../../class/rekening-detail-class';

@IonicPage()
@Component({
	selector: 'page-rekening',
	templateUrl: 'rekening.html',
})
export class RekeningPage {

	rek: Rekening;
	rekDetail: RekeningDetail;

	rekeningDetails: any;
	loading: any;
	sumD: number = 0;
	sumC: number = 0;
	sumBA: number = 0;
	sumBB: number = 0;
	total: number = 0;
	balance: number = 0;

	moment = {
		dateValue : momentjs().format('YYYY-MM-DD'),
		timeValue : momentjs().format('HH:mm:ss')
	}

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		private sqlite: SQLite,
		private alertCtrl: AlertController,
		private toastCtrl: ToastController,
		private loadingCtrl: LoadingController,
		private addData: AddDataLiteProvider,
		private updateData: UpdateDataLiteProvider,
		private deleteData: DeleteDataLiteProvider)
	{

		this.rek = navParams.get('params');
		this.getDataRekeningDetail();
	}

	addTransaction(params: any)
	{
		let prompt = this.alertCtrl.create({
			title: params.title + '.',
			inputs: [
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
						this.rekDetail = data;

						this.rekDetail.rekening_id	= params.rekening_id;
						this.rekDetail.remark		= '-';
						this.rekDetail.type 		= params.type;
						this.rekDetail.status		= 'open';
						this.rekDetail.created_by	= '-'; // localStorage.getItem('username');
						this.rekDetail.updated_by	= '-'; // localStorage.getItem('username');
						this.rekDetail.created_at	= this.moment.dateValue +' '+ this.moment.timeValue;
						this.rekDetail.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.save();
					}
				}
			]
		});
		prompt.present();
	}

	save()
	{
		if (this.rekDetail.type == 'withdraw' || this.rekDetail.type == 'bank_transfer' || this.rekDetail.type == 'bank_administration')
		{
			if (Number(this.rekDetail.amount) > Number(this.balance))
			{
				this.presentToast('Amount can not be greater than balance.');
				return;

			}

			if (Number(this.rekDetail.amount) <= Number(this.balance))
			{
				this.showLoader('Saving data...');
				this.addData
					.addRekeningDetail(this.rekDetail)
					.then(() => {
						let newBalance: number = 0;
						newBalance = Number(this.balance) - Number(this.rekDetail.amount);
						this.updateRekeningBalance(newBalance);
						
					}, (err) => {
						this.loading.dismiss();
						this.presentToast('Error: '+ err);
					});
			}
		}

		if (this.rekDetail.type == 'deposite' || this.rekDetail.type == 'bank_bonus')
		{
			this.showLoader('Saving data...');
				this.addData
					.addRekeningDetail(this.rekDetail)
					.then(() => {
						let newBalance: number = 0;
						newBalance = Number(this.balance) + Number(this.rekDetail.amount);
						this.updateRekeningBalance(newBalance);
					}, (err) => {
						this.loading.dismiss();
						this.presentToast('Error: '+ err);
					});
		}
	}

	edit(params: RekeningDetail, premount: any)
	{
		let title;
		if (params.type == 'withdraw')
		{
			title = 'Withdraw';
		}
		if (params.type == 'deposite')
		{
			title = 'Deposite';
		}
		if (params.type == 'bank_administration')
		{
			title = 'Administration';
		}
		if (params.type == 'bank_bonus')
		{
			title = 'Bonus';
		}
		if (params.type == 'bank_transfer')
		{
			title = 'Transfer';
		}

		let prompt = this.alertCtrl.create({
			title: title + '.',
			inputs: [
				{
					name 		: 'amount',
					id 			: 'amount',
					placeholder : 'Amount',
					type 		: 'number',
					value 		: params.amount.toString()
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
						this.rekDetail = data;

						this.rekDetail.id 			= params.id;
						this.rekDetail.rekening_id	= params.rekening_id;
						this.rekDetail.remark		= '-';
						this.rekDetail.type 		= params.type;
						this.rekDetail.remark		= params.remark;
						this.rekDetail.updated_by	= '-'; // localStorage.getItem('username');
						this.rekDetail.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.update(premount);
					}
				}
			]
		});
		prompt.present();
	}

	update(premount: any)
	{
		if (this.rekDetail.type == 'withdraw' || this.rekDetail.type == 'bank_transfer' || this.rekDetail.type == 'bank_administration')
		{
			// Validation
			let amountValidation: number = 0;
			if (Number(premount.premount) >= Number(this.rekDetail.amount))
			{
				amountValidation = Number(premount.premount) - Number(this.rekDetail.amount);
			}

			if (Number(premount.premount) < Number(this.rekDetail.amount))
			{
				amountValidation = Number(this.rekDetail.amount) - Number(premount.premount);
			}
			
			if (Number(amountValidation) > Number(this.balance))
			{
				this.presentToast('Amount can not be greater than balance.');
				return;
			}

			if (Number(amountValidation) <= Number(this.balance))
			{
				this.showLoader('Updating data...');
				this.updateData
					.updateRekeningDetail(this.rekDetail)
					.then(() => {
						let newBalance: number = 0;
						if (Number(premount.premount) >= Number(this.rekDetail.amount))
						{
							newBalance = Number(this.balance) + (Number(premount.premount) - Number(this.rekDetail.amount));
						}

						if (Number(premount.premount) < Number(this.rekDetail.amount))
						{
							newBalance = Number(this.balance) - (Number(this.rekDetail.amount) - Number(premount.premount));
						}
						this.updateRekeningBalance(newBalance);
					}, (err) => {
						this.loading.dismiss();
						this.presentToast('Error: '+ err);
					});
			}
		}

		if (this.rekDetail.type == 'deposite' || this.rekDetail.type == 'bank_bonus')
		{
			this.showLoader('Updating data...');
			this.updateData
				.updateRekeningDetail(this.rekDetail)
				.then(() => {
					let newBalance: number = 0;
					if (Number(premount.premount) >= Number(this.rekDetail.amount))
					{
						newBalance = Number(this.balance) - (Number(premount.premount) - Number(this.rekDetail.amount));
					}

					if (Number(premount.premount) < Number(this.rekDetail.amount))
					{
						newBalance = Number(this.balance) + (Number(this.rekDetail.amount) - Number(premount.premount));
					}
					this.updateRekeningBalance(newBalance);
				}, (err) => {
					this.loading.dismiss();
					this.presentToast('Error: '+ err);
				});
		}

	}

	remark(params: RekeningDetail)
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
						this.rekDetail = data;

						this.rekDetail.id 			= params.id;
						this.rekDetail.amount		= params.amount;
						this.rekDetail.type 		= params.type;
						this.rekDetail.updated_by	= '-'; // localStorage.getItem('username');
						this.rekDetail.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

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
			.updateRekeningDetail(this.rekDetail)
			.then(() => {
				this.loading.dismiss();
				this.getDataRekeningDetail();
				this.rekDetail = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	delete(params: RekeningDetail)
	{
		let confirm = this.alertCtrl.create({
			title: 'Are you sure to delete transaction?',
			buttons: [
				{
					text: 'No',
					handler: () => {}
				},
				{
					text: 'Yes',
					handler: () => {
						this.rekDetail = params;
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
			.deleteRekeningDetail(this.rekDetail)
			.then((data) => {
				let newBalance: number = 0;

				if (this.rekDetail.type == 'withdraw' || this.rekDetail.type == 'bank_transfer' || this.rekDetail.type == 'bank_administration')
				{
					newBalance = Number(this.balance) + Number(this.rekDetail.amount);
				}

				if (this.rekDetail.type == 'deposite' || this.rekDetail.type == 'bank_bonus')
				{
					newBalance = Number(this.balance) - Number(this.rekDetail.amount);
				}
				
				this.updateRekeningBalance(newBalance);
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	closeTransaction(params: RekeningDetail)
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
						this.rekDetail	= params;

						this.rekDetail.status		= 'close';
						this.rekDetail.updated_by	= '-'; // localStorage.getItem('username');
						this.rekDetail.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

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
			.closeRekeningDetail(this.rekDetail)
			.then(() => {
				this.loading.dismiss();
				this.getDataRekeningDetail();
				this.rekDetail = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	updateRekeningBalance(balance: number)
	{
		this.updateData
			.updateRekeningBalance(this.rekDetail, balance)
			.then((data) => {
				this.loading.dismiss();
				this.getDataRekeningDetail();
				this.rekDetail = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	getInitialBalance()
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							balance\
						FROM\
							t_mr_rekening\
						WHERE\
							id = (?)", [this.rek.id])
				.then((data) => {
					if (data.rows.length > 0)
					{
						this.balance = data.rows.item(0).balance;
					}

					if (data.rows.length == 0)
					{
						this.balance = 0;
					}
				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
				})
		});
	}

	getDataRekeningDetail()
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							id,\
							rekening_id,\
							amount,\
							type,\
							remark,\
							status,\
							created_by,\
							updated_by,\
							created_at,\
							updated_at\
						FROM\
							t_tr_rekening_detail\
						WHERE\
							rekening_id = (?)\
						ORDER BY\
							id DESC", [this.rek.id])
				.then((data) => {
					let rekeningDetail = [];
					this.sumD = 0;
					this.sumC = 0;
					this.sumBA = 0;
					this.sumBB = 0;
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							rekeningDetail.push({
								id 				: data.rows.item(i).id,
								rekening_id		: data.rows.item(i).rekening_id,
								amount			: data.rows.item(i).amount,
								type			: data.rows.item(i).type,
								remark			: data.rows.item(i).remark,
								status			: data.rows.item(i).status,
								created_by		: data.rows.item(i).created_by,
								updated_by		: data.rows.item(i).updated_by,
								created_at		: data.rows.item(i).created_at,
								updated_at		: data.rows.item(i).updated_at
							});

							if ((data.rows.item(i).type == 'withdraw' || data.rows.item(i).type == 'bank_transfer') && data.rows.item(i).status == 'open')
							{
								this.sumD += data.rows.item(i).amount;
							}

							if (data.rows.item(i).type == 'deposite' && data.rows.item(i).status == 'open')
							{
								this.sumC += data.rows.item(i).amount;
							}

							if (data.rows.item(i).type == 'bank_administration' && data.rows.item(i).status == 'open')
							{
								this.sumBA += data.rows.item(i).amount;
							}

							if (data.rows.item(i).type == 'bank_bonus' && data.rows.item(i).status == 'open')
							{
								this.sumBB += data.rows.item(i).amount;
							}
						}
						
					} else
					{
						rekeningDetail = null;
						this.sumD = 0;
						this.sumC = 0;
						this.sumBA = 0;
						this.sumBB = 0;
					}

					this.total = Number(this.sumD) + Number(this.sumC) + Number(this.sumBA) + Number(this.sumBB);

					this.rekeningDetails = rekeningDetail;
					
					this.getInitialBalance();

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
							rekening_id,\
							amount,\
							type,\
							remark,\
							status,\
							created_by,\
							updated_by,\
							created_at,\
							updated_at\
						FROM\
							t_tr_rekening_detail\
						WHERE\
							rekening_id = (?)\
						ORDER BY\
							id DESC", [this.rek.id])
				.then((data) => {
					let rekeningDetail = [];
					this.sumD = 0;
					this.sumC = 0;
					this.sumBA = 0;
					this.sumBB = 0;
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							rekeningDetail.push({
								id 				: data.rows.item(i).id,
								rekening_id		: data.rows.item(i).rekening_id,
								amount			: data.rows.item(i).amount,
								type			: data.rows.item(i).type,
								remark			: data.rows.item(i).remark,
								status			: data.rows.item(i).status,
								created_by		: data.rows.item(i).created_by,
								updated_by		: data.rows.item(i).updated_by,
								created_at		: data.rows.item(i).created_at,
								updated_at		: data.rows.item(i).updated_at
							});
							

							if ((data.rows.item(i).type == 'withdraw' || data.rows.item(i).type == 'bank_transfer') && data.rows.item(i).status == 'open')
							{
								this.sumD += data.rows.item(i).amount;
							}

							if (data.rows.item(i).type == 'deposite' && data.rows.item(i).status == 'open')
							{
								this.sumC += data.rows.item(i).amount;
							}

							if (data.rows.item(i).type == 'bank_administration' && data.rows.item(i).status == 'open')
							{
								this.sumBA += data.rows.item(i).amount;
							}

							if (data.rows.item(i).type == 'bank_bonus' && data.rows.item(i).status == 'open')
							{
								this.sumBB += data.rows.item(i).amount;
							}
						}
						
					} else
					{
						rekeningDetail = null;
						this.sumD = 0;
						this.sumC = 0;
						this.sumBA = 0;
						this.sumBB = 0;
					}

					this.total = Number(this.sumD) + Number(this.sumC) + Number(this.sumBA) + Number(this.sumBB);

					this.rekeningDetails = rekeningDetail;
					
					this.getInitialBalance();

					refresher.complete();
				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
					refresher.complete();
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