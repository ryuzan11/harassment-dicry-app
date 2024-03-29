import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { User } from './i-user';
import { DocumentReference } from '@angular/fire/firestore/interfaces';

export interface Story {
  type: '相談' | '解決済み' | '閲覧のみ';
  state: 'public' | 'private';
  story: string;
  prefecture: string;
  category: string;
  harassment: string;
  listCount?: number;
  reportCount: number;
  bestAnswer?: BestAnswer;
  deadline?: number;
  created_at?: firebase.firestore.FieldValue;
  updated_at?: firebase.firestore.FieldValue;
  user: User;
}

export interface Answer {
  answerId?: string;
  answer: string;
  storyId: string;
  story: string;
  user: User;
  reportCount: number;
  created_at: firebase.firestore.FieldValue;
  updated_at?: firebase.firestore.FieldValue;
}

export interface BestAnswer {
  answerId: string;
  answer: string;
  answerUser: User;
  answerRef: DocumentReference;
  created_at: firebase.firestore.FieldValue;
}
