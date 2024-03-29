import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { AngularFirestore, AngularFirestoreCollection, QueryDocumentSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { Story, BestAnswer } from '../models/story';
import { User } from '../models/i-user';
import { AngularFireFunctions } from '@angular/fire/functions';

@Injectable({
  providedIn: 'root'
})
export class StoryService {
  _passStory: Story;
  storyCollection: AngularFirestoreCollection<Story>;

  get passStory() {
    return this._passStory;
  }
  set passStory(story: Story) {
    this._passStory = story;
  }

  constructor(
    private af: AngularFirestore,
    private functions: AngularFireFunctions
  ) {
    this.storyCollection = this.af.collection<Story>('story', ref => ref.where('state', '==', 'public').orderBy('created_at', 'desc'));
  }

  getCollectionQuery(nextQueryAfter: QueryDocumentSnapshot<Story>): AngularFirestoreCollection<Story> {
    if (nextQueryAfter) {
      return this.af.collection<Story>('story', ref =>
        ref.where('state', '==', 'public')
          .orderBy('created_at', 'desc')
          .startAfter(nextQueryAfter)
          .limit(5));
    } else {
      return this.af.collection<Story>('story', ref =>
      ref.where('state', '==', 'public')
        .orderBy('created_at', 'desc')
        .limit(5));
    }
  }

  initStory(): Observable<Story[]> {
    return this.storyCollection.valueChanges({idField: 'storyId'});
  }

  getStory(id: string): Promise<any> {
    return this.storyCollection.doc(id).get()
      .pipe(first())
      .toPromise(Promise);
  }

  getUserStories(uid: string): Observable<Story[]> {
    return this.af.collection<Story>('story', ref => ref.where('user.uid', '==', uid))
      .valueChanges({idField: 'storyId'});
  }

  addUserDelete(uid: string) {
    this.af.collection<Story>('story', ref => ref.where('user.uid', '==', uid)).get().subscribe(snapshot => {
      snapshot.docs.forEach(async res => {
        await res.ref.update({userDeletedAt: firebase.firestore.FieldValue.serverTimestamp()});
      });
    }, err => {
      console.error(err);
    }, () => {
      this.af.collectionGroup('answers', ref => ref.where('user.uid', '==', uid)).get().subscribe(snapshot => {
        snapshot.docs.forEach(async res => {
          await res.ref.update({userDeletedAt: firebase.firestore.FieldValue.serverTimestamp()});
        });
      }, err => { console.error(err); });
    });
  }

  addStory(story: Story) {
    // story.deadline = new Date().setDate(new Date().getDate() + 7);
    story.deadline = new Date().setMinutes(new Date().getMinutes() + 5);
    story.created_at = firebase.firestore.FieldValue.serverTimestamp();
    return this.storyCollection.add(story);
  }

  updateStory(story: Story, id: string): Promise<void> {
    story.updated_at = firebase.firestore.FieldValue.serverTimestamp();
    return this.storyCollection.doc(id).update(story);
  }

  updateDecideAnswer(sid: string, a: {answerId: string, answer: string, answerUser: User}): Promise<void> {
    const aRef = this.af.firestore.doc('story/' + sid).collection('answers').doc(a.answerId);
    const answer: BestAnswer = Object.assign(a, {created_at: firebase.firestore.FieldValue.serverTimestamp(), answerRef: aRef});
    return this.storyCollection.doc<Story>(sid).update({bestAnswer: answer});
  }

  async deleteStory(id: string): Promise<any> {
    const deleteFn = this.functions.httpsCallable('recursiveDelete');
    return deleteFn({ path: 'story/' + id }).toPromise(Promise);
    // return this.storyCollection.doc(id).delete().then(() => {
    //   return '削除しました';
    // }).catch((error) => {
    //   return error;
    // });
  }

  upCount(storyId: string) {
    this.af.firestore.doc('story/' + storyId).update({
      listCount: firebase.firestore.FieldValue.increment(1),
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

  downCount(storyId: string) {
    this.af.firestore.doc('story/' + storyId).update({
      listCount: firebase.firestore.FieldValue.increment(-1),
      updated_at: firebase.firestore.FieldValue.serverTimestamp()
    });
  }

}
