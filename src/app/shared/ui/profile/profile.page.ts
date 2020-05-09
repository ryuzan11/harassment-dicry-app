import { Component, OnInit } from '@angular/core';
import { Plugins, CameraResultType } from '@capacitor/core';
import { ModalController } from '@ionic/angular';
import { AuthService } from '../../../auth/auth.service';
import { FirestoreService} from '../../api/firestore.service';
import { IUser } from '../../models/i-user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  uid: string;
  user: IUser = {
    displayName: null,
    photoDataUrl: null,
    gender: null,
    profile: null
  };
  photo: string;

  constructor(
    public modalController: ModalController,
    public auth: AuthService,
    public firestore: FirestoreService
  ) { }

  ngOnInit() {
  }

  modalDismiss(): void {
    this.modalController.dismiss();
  }

  async ionViewWillEnter() {
    this.uid = this.auth.getUserId();
    const user = await this.firestore.userInit(this.uid);
    if (user) {
      this.user = user;
    }
  }

  async updateProfile() {
    if (this.photo) {
      this.user.photoDataUrl = this.photo;
    }
    await this.firestore.userSet(this.user);
    this.modalController.dismiss();
  }

  async takePicture(): Promise<void> {
    const image = await Plugins.Camera.getPhoto({
      quality: 100,
      resultType: CameraResultType.DataUrl
    });
    this.photo = image && image.dataUrl;
  }

}
