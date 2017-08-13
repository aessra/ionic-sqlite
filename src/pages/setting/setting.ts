import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController, LoadingController } from 'ionic-angular';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import * as momentjs from 'moment';

import { AddDataLiteProvider } from '../../providers/add-data-lite/add-data-lite';
import { UpdateDataLiteProvider } from '../../providers/update-data-lite/update-data-lite';
import { DeleteDataLiteProvider } from '../../providers/delete-data-lite/delete-data-lite';

import { Rekening } from '../../class/rekening-class';


@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html',
})
export class SettingPage {

	rek: Rekening;
	rekenings: any;

	loading: any;

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
		this.getDataRekening();
	}

	addRekening()
	{
		let prompt = this.alertCtrl.create({
			title: 'Add Bank Acc.',
			inputs: [
				{
					name 		: 'rekening_name',
					id 			: 'rekening_name',
					placeholder : 'Rekening Name',
				},
				{
					name 		: 'balance',
					id 			: 'balance',
					placeholder : 'Balance',
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
						this.rek = data;

						this.rek.remark		= '-';
						this.rek.created_by	= '-'; // localStorage.getItem('username');
						this.rek.updated_by	= '-'; // localStorage.getItem('username');
						this.rek.created_at	= this.moment.dateValue +' '+ this.moment.timeValue;
						this.rek.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.save();
					}
				}
			]
		});
		prompt.present();
	}

	save()
	{
		this.showLoader('Saving data...');
		this.addData
			.addRekening(this.rek)
			.then((data) => {
				this.loading.dismiss();
				this.getDataRekening();
				this.rek = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	edit(params: Rekening)
	{
		let prompt = this.alertCtrl.create({
			message: 'Edit Bank Acc.',
			inputs: [
				{
					name 		: 'rekening_name',
					id 			: 'rekening_name',
					placeholder : 'Rekening Name',
					value 		: params.rekening_name
				},
				{
					name 		: 'balance',
					id 			: 'balance',
					placeholder : 'Balance',
					value 		: params.balance.toString(),
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
						this.rek = data;

						this.rek.id 		= params.id
						this.rek.remark		= params.remark;
						this.rek.updated_by	= '-'; // localStorage.getItem('username');
						this.rek.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

						this.update();
					}
				}
			]
		});
		prompt.present();
	}

	update()
	{
		this.showLoader('Updating data...');
		this.updateData
			.updateRekening(this.rek)
			.then((data) => {
				this.loading.dismiss();
				this.getDataRekening();
				this.rek = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	remark(params: Rekening)
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
						this.rek = data;

						this.rek.id 		= params.id;
						this.rek.rekening_name = params.rekening_name;
						this.rek.balance	= params.balance;
						this.rek.updated_by	= '-'; // localStorage.getItem('username');
						this.rek.updated_at	= this.moment.dateValue +' '+ this.moment.timeValue;

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
			.updateRekening(this.rek)
			.then(() => {
				this.loading.dismiss();
				this.getDataRekening();
				this.rek = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	delete(params: Rekening)
	{
		let confirm = this.alertCtrl.create({
			title: 'Are you sure to delete ' + params.rekening_name + '?',
			buttons: [
				{
					text: 'No',
					handler: () => {}
				},
				{
					text: 'Yes',
					handler: () => {
						this.rek = params;
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
			.deleteRekening(this.rek)
			.then((data) => {
				this.loading.dismiss();
				this.getDataRekening();
				this.rek = null;
			}, (err) => {
				this.loading.dismiss();
				this.presentToast('Error: '+ err);
			});
	}

	getDataRekening()
	{
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							id,\
							rekening_name,\
							balance,\
							remark,\
							created_by,\
							updated_by,\
							created_at,\
							updated_at\
						FROM\
							t_mr_rekening\
						ORDER BY\
							id DESC", [])
				.then((data) => {
					let rekening = [];
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							rekening.push({
								id 				: data.rows.item(i).id,
								rekening_name	: data.rows.item(i).rekening_name,
								balance			: data.rows.item(i).balance,
								remark			: data.rows.item(i).remark,
								created_by		: data.rows.item(i).created_by,
								updated_by		: data.rows.item(i).updated_by,
								created_at		: data.rows.item(i).created_at,
								updated_at		: data.rows.item(i).updated_at
							});
						}
					}
					if (data.rows.length == 0)
					{
						rekening = null;
					}

					this.rekenings = rekening;
				}, (err) => {
					this.presentToast('Error: ' + JSON.stringify(err));
				})
		});
	}
	
	doRefresh(refresher) {
		this.sqlite.create({
			name: 'data_ae.db',
			location: 'default'
		})
		.then((db: SQLiteObject) => {
			db.executeSql("\
						SELECT\
							id,\
							rekening_name,\
							balance,\
							remark,\
							created_by,\
							updated_by,\
							created_at,\
							updated_at\
						FROM\
							t_mr_rekening\
						ORDER BY\
							id DESC", [])
				.then((data) => {
					let rekening = [];
					if (data.rows.length > 0)
					{
						for (let i = 0; i < data.rows.length; i++)
						{
							rekening.push({
								id 				: data.rows.item(i).id,
								rekening_name	: data.rows.item(i).rekening_name,
								balance			: data.rows.item(i).balance,
								remark			: data.rows.item(i).remark,
								created_by		: data.rows.item(i).created_by,
								updated_by		: data.rows.item(i).updated_by,
								created_at		: data.rows.item(i).created_at,
								updated_at		: data.rows.item(i).updated_at
							});
						}
					}
					if (data.rows.length == 0)
					{
						rekening = null;
					}

					this.rekenings = rekening;
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
