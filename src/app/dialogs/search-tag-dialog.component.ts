import { Component, ChangeDetectorRef } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { ENUM_OPERATION_FEEDBACK, ENUM_ERROR } from '../model/conversational.model';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'app-search-tag-dialog',
  templateUrl: './search-tag-dialog.component.html'
})
export class SearchTagDialogComponent {

  tags = [];
  initial_tags = [];
  tagsFound = true;

  tagsAdded = false;
  currentTag = "";
  tagToAdd = "";

  constructor(private cd : ChangeDetectorRef, 
    private backend: BackendService, 
    public dialogRef: MatDialogRef<SearchTagDialogComponent>, 
    private utilsService: UtilsService, @Inject(MAT_DIALOG_DATA) data) {
    this.startSearch();
    if(data!=undefined && data != ""){
      this.tagToAdd = data;
      this.tagsAdded = true;
    }
  }

  startSearch() {

    let endpoint = '/create/searchTags';
    this.backend.getRequest(endpoint).subscribe(json => {
    this.tags = JSON.parse(json);

    this.tags.sort(function(a, b) {
      return a.text.toLowerCase().localeCompare(b.text.toLowerCase());
    });

    for(var i = 0; i< this.tags.length; i++){
      this.tags[i].text = this.tags[i].text.toLowerCase();
    }

    this.initial_tags = this.tags;
    
    if (this.tags.length > 0) {
      this.tagsFound = true;
    } else {
      this.tagsFound = false;
    }
   }, err => {
    if (err.status === 409) {
      this.utilsService.feedbackMessage(ENUM_OPERATION_FEEDBACK.ERROR, ENUM_ERROR.RES_409);
    } else {
      this.utilsService.feedbackMessage(ENUM_OPERATION_FEEDBACK.ERROR, ENUM_ERROR.GENERIC);
    }
  });
  }

  //search bot filter (REEEEAALLY NOT OPTIMIZED)
  filterTags(e){
    this.tags = this.initial_tags.filter(x => x.text.includes(e.toLowerCase()));
    this.cd.detectChanges();
  }

  //deletes tag box and removes the tag from the returned list
  deleteOne(e: MouseEvent) {
    this.tagToAdd = "";
    this.tagsAdded = false;
  }

  //tag is added by the selectable one
  //if it is not already there
  addTag(tag: string) {
    

    var tmpTag = "";
    if(tag==undefined){
      tmpTag = this.currentTag.toLowerCase();
    } else {
      tmpTag = tag.toLowerCase();
    }
    this.tagToAdd = tmpTag;
    if(this.tagToAdd != "" && this.tagToAdd!=undefined){
      this.tagsAdded = true;
    }

  }

  //tag is added from input box
  /*if it is not already there
  change(e) {
    if(this.tagToAdd != e.target.value){
      this.tagsAdded = true;
      this.tagToAdd = e.target.value.toLowerCase();
    }
    e.target.value="";
    this.tags = this.initial_tags;
  }*/
 
  //closes the dialog
  tagsSelected(e: MouseEvent) {
    this.dialogRef.close(this.tagToAdd);
  }

  discard() {
    this.dialogRef.close();
  }
}
