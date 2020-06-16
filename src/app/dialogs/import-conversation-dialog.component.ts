import { Component, Inject } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { MatDialogRef } from '@angular/material';
import { MAT_DIALOG_DATA } from '@angular/material';
import { Router } from '@angular/router';
import { ENUM_CHAT } from '../model/conversational.model';

@Component({
    selector: 'app-import-conversation-dialog',
    templateUrl: './import-conversation-dialog.component.html'
})

export class ImportConversationDialogComponent {

    conversationTitle = "";
    conversationJson: any;
    error = ""
    result: any;

    isLoading = false;

    constructor(@Inject(MAT_DIALOG_DATA) public data,
        private backend: BackendService,
        public dialogRef: MatDialogRef<ImportConversationDialogComponent>,
        private router: Router) { }

    //file upload
    onFileImported(event) {
        this.isLoading = true;
        let selectedFile = event.target.files[0];

        let fileReader = new FileReader();


        fileReader.readAsText(selectedFile, "UTF-8");
        fileReader.onload = () => {
           
            this.error = "";
            this.conversationTitle = "";
            if (selectedFile.type != "application/json") {
                //TODO print error
                this.error = "The file has to be of JSON format"
                console.log("not a json");
                this.isLoading = false;
                return;
            }

            const json = JSON.parse(JSON.parse(JSON.stringify(fileReader.result)));

            this.conversationTitle = json[ENUM_CHAT.TITLE];
            this.conversationJson = json;
            this.isLoading = false;
        }


        fileReader.onerror = () => {
            console.log('Error: ');
            this.isLoading = false;
        };
    }

    import() {
        if (this.conversationTitle != "" && this.conversationJson != undefined) {
            this.result = {
                title: this.conversationTitle,
                json: this.conversationJson
            }
            this.dialogRef.close(this.result);
        } else {
            this.error = "Unable to read the uploaded JSON";
        }
    }

    close() {
        this.dialogRef.close();
    }

}