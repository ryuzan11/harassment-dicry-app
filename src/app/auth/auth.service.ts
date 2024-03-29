import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import { NavController, AlertController } from '@ionic/angular';
import { firebaseError } from './firebase.error';
import { Obj } from '../shared/models/obj';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    public navController: NavController,
    public alertController: AlertController
  ) { }

  async authSignUp(login: {email: string, password: string}): Promise<boolean> {
    return firebase.auth()
      .createUserWithEmailAndPassword(login.email, login.password)
      .then(() => this.navController.navigateForward('/'))
      .catch(async error => {
        this.alertError(error);
        throw error;
      });
  }

  async authSignIn(login: {email: string, password: string}): Promise<boolean> {
    return firebase.auth()
      .signInWithEmailAndPassword(login.email, login.password)
      .then(() => this.navController.navigateForward('/'))
      .catch(async error => {
        this.alertError(error);
        throw error;
      });
  }

  async authSignOut(): Promise<boolean> {
    return firebase.auth()
      .signOut()
      .then(() => this.navController.navigateForward('/home'))
      .catch(error => {
        throw error;
      });
  }

  async alertError(e: Obj<string>): Promise<void> {
    if (firebaseError.hasOwnProperty(e.code)) {
      e = firebaseError[e.code];
    }
    const alert = await this.alertController.create({
      header: e.code,
      message: e.message,
      buttons: ['閉じる']
    });
    await alert.present();
  }
}
