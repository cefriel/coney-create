import { Component } from '@angular/core';
import { BackendService } from '../services/backend.service';
import { MatDialogRef, MatDialog } from '@angular/material/dialog';
import { ENUM_CONV_STATUS } from '../model/conversational.model';
import { environment } from 'src/environments/environment';
import { ImportConversationDialogComponent } from './import-conversation-dialog.component';

@Component({
  selector: 'app-search-conv-dialog',
  templateUrl: './search-conv-dialog.component.html'
})

export class SearchConvDialogComponent {

  titleValue = '';

  selectedStatus = "all";
  selectedProject = "all";

  projects = ["all"];
  conversations = [];
  noTitleChats = [];
  statuses = ["all", "saved", "published", "unpublished"];
  initialChats = [];
  conversationsFound = true;
  isLoading = false;
  showProject = environment.enterprise;

  constructor(private backend: BackendService, public dialogRef: MatDialogRef<SearchConvDialogComponent>, 
    public dialog: MatDialog,) {
    this.isLoading = true;
    this.startSearch();
  }


  selectionChanged(){

    if (this.selectedProject !== undefined && this.selectedProject !== "" && this.selectedProject!== 'all') {
      this.noTitleChats = this.initialChats.filter(x => x.projectName.toLowerCase() == this.selectedProject.toLowerCase());
    } else {
      this.noTitleChats = this.initialChats;
    }

    if (this.selectedStatus !== undefined && this.selectedStatus !== "" && this.selectedStatus!== 'all') {
      this.noTitleChats = this.noTitleChats.filter(x => x.status.toLowerCase() == this.selectedStatus.toLowerCase());
    } 

    this.conversations = this.noTitleChats;
    this.titleSelectionChanged();
    
  }

  titleSelectionChanged() {
    if (this.titleValue !== "") {
      this.conversations = this.noTitleChats.filter(x => x.conversationTitle.toLowerCase().includes(this.titleValue.toLowerCase()));
    } else {
      this.conversations = this.noTitleChats;
    }
  }

  startSearch() {
    let endpoint = '/create/searchConversation?';

    this.backend.getRequest(endpoint).subscribe(json => {
      
      this.isLoading = false;
      this.conversations = [];
      var tmpJson = JSON.parse(json);

      for(var i = 0; i<tmpJson.length; i++){
        if(tmpJson[i].accessLevel == 3){
          this.conversations.push(tmpJson[i]);
        }
      }
      console.log(this.conversations);

      this.conversations.sort(function(a, b) {
        return a.conversationTitle.toLowerCase().localeCompare(b.conversationTitle.toLowerCase());
      });

      if (this.conversations.length > 0) {
        this.conversationsFound = true;
        this.initialChats = this.conversations;
        this.noTitleChats = this.conversations;
        if(this.showProject){
          this.getProjects();
        }
      } else {
        this.conversationsFound = false;
      }
    });
  }

  getProjects(){
    for(var i = 0; i<this.conversations.length; i++){
      var pr = this.conversations[i].projectName;
      if(!this.projects.includes(pr)){
        this.projects.push(pr);
      }
    }
  }

  chatSelected(chat: JSON) {
    this.dialogRef.close(chat);
  }

  importButtonPressed(){
    console.log("import");

    const dialogRef = this.dialog.open(ImportConversationDialogComponent, {
      width: '400px',
      height: '500px',
      data: {
      }
    });

    dialogRef.afterClosed().subscribe(res => {
      if(res!=undefined && res.json!=undefined && res.title != undefined && res.title!=""){
        var output =  JSON.parse(JSON.stringify(res));
        output["import"]=true;
        
        console.log("importing json file")
        this.dialogRef.close(output);
      }
    });
  }
}
