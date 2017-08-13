import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, ToastController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite';

import { CreateTableProvider } from '../providers/create-table/create-table';

import { Rekening } from '../class/rekening-class';

@Component({
	selector: 'app',
	templateUrl: 'app.html'
})
export class MyApp {
	@ViewChild(Nav) nav: Nav;

	rootPage: any = 'DashboardPage';
	rekenings: any;

	// pages: Array<{title: string, component: any}>;

	constructor(
		public platform: Platform,
		public statusBar: StatusBar,
		public splashScreen: SplashScreen,
		private sqlite: SQLite,
		private crTable: CreateTableProvider,
		private toastCtrl: ToastController)
	{
		this.initializeApp();

		this.crTable.tabelMasterUser();
		this.crTable.tabelMasterRekening();
		this.crTable.tabelRekeningDetail();
		this.crTable.tabelTransaction();

		this.getDataRekening();
	}

	initializeApp()
	{
		this.platform.ready().then(() => {
			this.statusBar.styleDefault();
			this.splashScreen.hide();
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
								updated_at		: data.rows.item(i).updated_at,
								component		: 'RekeningPage'
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
								updated_at		: data.rows.item(i).updated_at,
								component		: 'RekeningPage'
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

	openPage(params: Rekening)
	{
		this.nav.setRoot(params.component, {'params': params});
	}

	dashboardPage()
	{
		this.nav.setRoot('DashboardPage');
	}

	settingPage()
	{
		this.nav.setRoot('SettingPage');
	}

	logout()
	{
		// this.nav.setRoot('LoginPage');
		this.presentToast('Underconstrution..^^');
	}
}
