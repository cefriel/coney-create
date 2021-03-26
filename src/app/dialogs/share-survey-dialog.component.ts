import { Component, ChangeDetectorRef } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Inject } from '@angular/core';
import { UtilsService } from '../services/utils.service';

@Component({
    selector: 'app-share-survey-dialog',
    templateUrl: './share-survey-dialog.component.html'
})
export class ShareSurveyDialogComponent {

    genericLink = "";

    constructor(public dialogRef: MatDialogRef<ShareSurveyDialogComponent>, 
        @Inject(MAT_DIALOG_DATA) data,
        private utilsService: UtilsService){
        if(data!=undefined){
            this.genericLink = data;
        }
    }

    copyText(){
        let selBox = document.createElement('textarea');
          selBox.style.position = 'fixed';
          selBox.style.left = '0';
          selBox.style.top = '0';
          selBox.style.opacity = '0';
          selBox.value = this.genericLink;
          document.body.appendChild(selBox);
          selBox.focus();
          selBox.select();
          document.execCommand('copy');
          document.body.removeChild(selBox);
    
          this.utilsService.feedbackMessage("info", "Copied to clipboard!");
      }

    close(){
        this.dialogRef.close();
    }
    
}