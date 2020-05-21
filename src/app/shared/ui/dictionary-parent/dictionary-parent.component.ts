import { Component, OnInit } from '@angular/core';
import { NavParams } from '@ionic/angular';
import { DictionaryChildrenComponent } from '../dictionary-children/dictionary-children.component';

@Component({
  selector: 'ls-dictionary-parent',
  templateUrl: './dictionary-parent.component.html',
  styleUrls: ['./dictionary-parent.component.scss'],
})
export class DictionaryParentComponent implements OnInit {
  categories: {[key: string]: any} = {};
  nextPage = DictionaryChildrenComponent;

  constructor(private navParams: NavParams) { }

  ngOnInit() {
    this.categories = this.navParams.data;
  }

}