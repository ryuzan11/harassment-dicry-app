import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { NavParams, ModalController, AlertController, IonSelect } from '@ionic/angular';
import { StoryService } from '../../api/story.service';
import { PrefecturesService } from '../../service/prefectures.service';
import { CategoriesService } from '../../service/categories.service';
import { Story } from '../../models/story';
import { HarassmentsService } from '../../service/harassments.service';

@Component({
  selector: 'app-story-post',
  templateUrl: './story-post.page.html',
  styleUrls: ['./story-post.page.scss'],
})
export class StoryPostPage implements OnInit {
  harassments: string[];
  navData: {[key: string]: any};
  editMode: boolean;
  postData: Story = {
    type: '閲覧のみ',
    state: 'public',
    story: null,
    prefecture: null,
    category: null,
    harassment: null,
    reportCount: 0,
    user: {
      uid: null,
      displayName: null,
      photoDataUrl: null,
      gender: null,
      age: null,
      prefecture: null
    }
  };

  // @ViewChild('ionSelect', {read: IonSelect, static: false})
  // private ionSelect?: IonSelect;

  get prefectures() {
    return this.prefecturesService.prefectures;
  }

  get categories() {
    return this.categoriesService.standardCategories;
  }

  constructor(
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private navParams: NavParams,
    public storyService: StoryService,
    public categoriesService: CategoriesService,
    public harassmentsService: HarassmentsService,
    public prefecturesService: PrefecturesService,
    // private el: ElementRef
  ) { }

  ngOnInit() {
    this.navData = this.navParams.data;
    this.editMode = this.navParams.data.preStory ? true : false;
    if (this.editMode) {
      this.postData = this.navParams.data.preStory;
    } else {
      const {profile, reportCount, report, ...other} = this.navData.user;
      this.postData.user = {uid: this.navData.uid, ...other};
    }
    if (this.postData.category !== null) { this.setHarassmentsFromName(this.postData.category); }
  }

  // ngAfterView() {
  //   if (this.el.nativeElement.querySelector('.custom-options')) {
  //     this.ionSelect.interfaceOptions = {cssClass: 'my-custom-interface'};
  //   }
  // }

  setHarassmentsFromName(name: string) {
    this.harassments = this.harassmentsService.getHarassmentsFromCategoryName(name);
  }

  resetHarassment() {
    this.postData.harassment = null;
  }

  modalDismiss(): void {
    this.modalCtrl.dismiss();
  }

  postStory() {
    if (!this.navParams.data.user && !this.navParams.data.preStory) {
      alert('プロフィール登録が必要です');
      return;
    }
    const sid = this.navParams.data.storyId;
    this.editMode ? this.storyService.updateStory(this.postData, sid) : this.storyService.addStory(this.postData);
    this.modalCtrl.dismiss();
  }

  async openAlertHarassments() {
    if (this.harassments) { return; }
    const alert = await this.alertCtrl.create({
      // header: '所在地について',
      message: 'カテゴリーを選択してください。',
      buttons: [
        {
          text: '閉じる',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}
