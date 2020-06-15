import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ProfilePage } from '../ui/profile/profile.page';
import { CategoryParentComponent } from './category-parent/category-parent.component';
import { CategoryChildComponent } from './category-child/category-child.component';
import { StoryPostPage } from '../ui/story-post/story-post.page';
import { ActionListPage } from './action-list/action-list.page';
import { EditableTextPage } from './editable-text/editable-text.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
  ],
  entryComponents: [
    ProfilePage,
    CategoryParentComponent,
    CategoryChildComponent,
    StoryPostPage,
    ActionListPage,
    EditableTextPage
  ],
  declarations: [
    ProfilePage,
    CategoryParentComponent,
    CategoryChildComponent,
    StoryPostPage,
    ActionListPage,
    EditableTextPage
  ],
  exports: [
    EditableTextPage
  ]
})
export class UiModule { }
