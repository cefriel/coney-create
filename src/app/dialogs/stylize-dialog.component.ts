import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';

@Component({
    selector: 'app-stylize-dialog',
    templateUrl: './stylize-dialog.component.html'
})

export class StylizeDialogComponent {


    privacyLink = "https://www.cefriel.com/en/privacy";
    imageLink = "https://coney.cefriel.com/app/chat/assets/icons/ic_logo.svg";
    text = "Please take a moment to review our policy prior to answering the survey questions";

    primaryColor: any = "#2d3c76";
    primaryColorBackup: any = "#2d3c76";
    secondaryColor: any = "#ffc107";
    secondaryColorBackup: any = "#ffc107";
    textColor: any = "#ffffff";
    textColorBackup: any = "#ffffff";

    currentFont: any = "Euclid Circular A";
    fontToSend: any = "Euclid Circular A";

    fonts = ["Euclid Circular A", "Open Sans", "Lato", "Roboto", "Segoe UI", "Quicksand"];

    canPress = true;

    constructor(private backend: BackendService,
        public dialogRef: MatDialogRef<StylizeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data) { 
            this.getStyle();
        }

    fontChanged(event) {
        this.fontToSend = "'" + this.currentFont + "'";
    }

    getStyle(){
        this.backend.getRequest('/create/getChatStyle?conversationId='+this.data.conversationId).subscribe(
            res => {
                console.log(res);
                var jsonTmp = JSON.parse(res);
                if(jsonTmp.chat_primary_color!='' && jsonTmp.chat_primary_color!=null){
                    this.primaryColor = this.primaryColorBackup = jsonTmp.chat_primary_color;
                }
                if(jsonTmp.chat_secondary_color!='' && jsonTmp.chat_secondary_color!=null){
                    this.secondaryColor = this.secondaryColorBackup = jsonTmp.chat_secondary_color;
                }
                if(jsonTmp.chat_text_color!='' && jsonTmp.chat_text_color!=null){
                    this.textColor = this.textColorBackup = jsonTmp.chat_text_color;
                }
                if(jsonTmp.chat_font_family!='' && jsonTmp.chat_font_family!=null){
                    this.currentFont = jsonTmp.chat_font_family.substr(1, jsonTmp.chat_font_family.length-2);
                }
                if(jsonTmp.chat_intro_text!='' && jsonTmp.chat_intro_text!=null){
                    this.text = jsonTmp.chat_intro_text;
                }
                if(jsonTmp.chat_privay_notice!='' && jsonTmp.chat_privay_notice!=null){
                    this.privacyLink = jsonTmp.chat_privay_notice;
                }
                if(jsonTmp.chat_image!='' && jsonTmp.chat_image!=null){
                    this.imageLink = jsonTmp.chat_image;
                }
                

            }, err => {
                console.error(err);
            }
        );
    }

    update() {

        let toSend: any = {};
        toSend.conversationId = this.data.conversationId;

        toSend.chatImage = this.imageLink;
        toSend.chatPrivacyNotice = this.privacyLink;
        toSend.chatIntroText = this.text;

        toSend.chatPrimaryColor = this.primaryColor;
        toSend.chatSecondaryColor = this.secondaryColor;
        toSend.chatTextColor = this.textColor;

        toSend.chatFontFamily = this.fontToSend;


        this.canPress = false;
        this.backend.postJson('/create/updateStyle', toSend).subscribe(
            res => {
                this.dialogRef.close(res);
                this.canPress = true;
            }, err => {
                this.dialogRef.close(err.status);
                this.canPress = true;
            }
        );
    }

    close() {
        this.dialogRef.close();
    }
}
