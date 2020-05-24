import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalController, IonContent, AlertController, ToastController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { FirestoreService } from '../../shared/api/firestore.service';
import { StoryService } from '../../shared/api/story.service';
import { ProfilePage } from 'src/app/shared/ui/profile/profile.page';
import { IUser } from '../../shared/models/i-user';
import { Story } from '../../shared/models/story';
import { StoryPostPage } from 'src/app/shared/ui/story-post/story-post.page';


@Component({
  selector: 'app-timeline',
  templateUrl: 'timeline.page.html',
  styleUrls: ['timeline.page.scss']
})
export class TimelinePage implements OnInit {
  uid: string;
  user: IUser;
  stories: Observable<Story[]>;

  @ViewChild(IonContent, { static: true})
  content: IonContent;

  constructor(
    public modalController: ModalController,
    public alertController: AlertController,
    public toastController: ToastController,
    public auth: AuthService,
    public storyService: StoryService,
    public firestore: FirestoreService
  ) {}

  async ngOnInit() {
    const user = await this.firestore.userInit(this.auth.getUserId());
    if (!user) {
      const modal = await this.modalController.create({
        component: ProfilePage
      });
      await modal.present();
      modal.onDidDismiss().then(()  => this.ionViewWillEnter());
    }
    this.stories = this.storyService.storyInit();
  }

  async ionViewWillEnter() {
    this.uid = this.auth.getUserId();
    this.user = await this.firestore.userInit(this.uid);
  }

  trackByFn(index, item) {
    return item.storyId;
  }

  async openStoryPost() {
    const modal = await this.modalController.create({
      component: StoryPostPage,
      componentProps: {
        content: this.content,
        uid: this.uid,
        user: this.user,
      }
    });
    await modal.present();
    modal.onWillDismiss().then(() => this.content.scrollToTop(100));
  }

  async openStoryEdit(story: Story, id: string) {
    const modal = await this.modalController.create({
      component: StoryPostPage,
      componentProps: {
        content: this.content,
        storyId: id,
        preStory: story
      }
    });
    await modal.present();
    modal.onWillDismiss().then(() => this.content.scrollToTop(100));
  }

  async openStoryDelete(id: string) {
    const alert = await this.alertController.create({
      header: '削除してよろしいですか？',
      message: '削除すると復元できなくなります。',
      buttons: [
        {
          text: 'キャンセル',
          role: 'cansel',
          cssClass: 'secondary'
        }, {
          text: '削除',
          cssClass: 'danger',
          handler: () => {
            this.storyService.storyDelete(id).then(result => {
              this.presentToast(result);
            });
          }
        }
      ]
    });
    await alert.present();
  }

  async presentToast(text) {
    const toast = await this.toastController.create({
      message: text,
      duration: 2000
    });
    toast.present();
  }

}