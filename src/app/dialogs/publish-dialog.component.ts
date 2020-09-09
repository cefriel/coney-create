import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';
import { BackendService } from '../services/backend.service';

@Component({
  selector: 'app-publish-dialog',
  templateUrl: './publish-dialog.component.html'
})

export class PublishDialogComponent {

  canPress = true;

  privacyActive=false;
  imageActive=false;
  textActive=false;

  privacyLink="";
  imageLink="";
  text="";

  constructor(private backend: BackendService,
    public dialogRef: MatDialogRef<PublishDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) { }

  publish() {

  
    let toSend = this.data.conversation;
   
    if(this.imageActive){
      toSend.chatImage = this.imageLink;
    }
    if(this.privacyActive){
      toSend.chatPrivacyNotice = this.privacyLink;
    }
    if(this.textActive){
      toSend.chatIntroText = this.text;
    }
    
    document.getElementById("publishBtn").innerHTML = "uploading...";
    this.canPress = false;
    this.backend.postJson('/create/publishConversation', toSend).subscribe(
      res => {
        this.dialogRef.close(res);
        this.canPress = true;
        document.getElementById("publishBtn").innerHTML = "done";
      }, err => {
        this.dialogRef.close(err.status);
        this.canPress = true;
        document.getElementById("publishBtn").innerHTML = "done";
      }
    );
  }

  close() {
    this.dialogRef.close();
  }
}
