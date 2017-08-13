import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SQLite } from '@ionic-native/sqlite';

import { MyApp } from './app.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { CreateTableProvider } from '../providers/create-table/create-table';
import { AddDataLiteProvider } from '../providers/add-data-lite/add-data-lite';
import { DeleteDataLiteProvider } from '../providers/delete-data-lite/delete-data-lite';
import { UpdateDataLiteProvider } from '../providers/update-data-lite/update-data-lite';

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			preloadModules: true
		}),
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		StatusBar,
		SplashScreen,
		{
			provide: ErrorHandler,
			useClass: IonicErrorHandler
		},
		SQLite,
	    CreateTableProvider,
	    AddDataLiteProvider,
	    DeleteDataLiteProvider,
	    UpdateDataLiteProvider
	]
})
export class AppModule {}
