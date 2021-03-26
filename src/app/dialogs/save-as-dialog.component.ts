import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-save-as-dialog',
  templateUrl: './save-as-dialog.component.html'
})

export class SaveAsDialogComponent implements OnInit {

  oldTitle = '';
  oldProject = '';
  oldLanguage = '';
  titleValue = '';
  titleFieldEmpty = false;
  projectFieldEmpty = false;
  languageFieldEmpty = false;

  showProject = environment.enterprise;

  projectValue = { projectName: "", accessLevel: 0 };
  errorMessage = "All fields are required";
  projects = [];
  levels = [ { value: 1, tag: "project" }, { value: 2, tag: "restricted" }, { value: 3, tag: "confidential" }];
  languageValue: any;
  languages = [{ lang: "Afrikaans", tag: "af" }, { lang: "Albanian ", tag: "sp" }, { lang: "Arabic", tag: "ar" }, { lang: "Basque", tag: "eu" },
  { lang: "Byelorussian ", tag: "be" }, { lang: "Bulgarian", tag: "bg" }, { lang: "Catalan", tag: "va" }, { lang: "Croatian", tag: "hr" }, { lang: "Czech", tag: "cs" },
  { lang: "Danish", tag: "da" }, { lang: "Dutch", tag: "nl" }, { lang: "English", tag: "en" }, { lang: "Esperanto", tag: "eo" }, { lang: "Estonian", tag: "et" },
  { lang: "Finnish", tag: "fi" }, { lang: "Faronese", tag: "fo" }, { lang: "French", tag: "fr" },
  { lang: "Galician", tag: "gl" }, { lang: "German", tag: "de" }, { lang: "Greek", tag: "el" }, { lang: "Hebrew", tag: "he" }, { lang: "Hungarian", tag: "hu" },
  { lang: "Icelandic", tag: "is" }, { lang: "Italian", tag: "it" }, { lang: "Irish", tag: "ga" }, { lang: "Japanese", tag: "ja" }, { lang: "Korean", tag: "ko" },
  { lang: "Latvian", tag: "lv" }, { lang: "Macedonian", tag: "mk" }, { lang: "Maltese", tag: "mt" }, { lang: "Norwegian", tag: "nb" },
  { lang: "Polish", tag: "pl" }, { lang: "Portuguese", tag: "pt" }, { lang: "Romanian", tag: "ro" },
  { lang: "Russian", tag: "ru" }, { lang: "Scottish", tag: "gd" }, { lang: "Slovak", tag: "sk" }, { lang: "Slovenian", tag: "sl" },
  { lang: "Serbian", tag: "sr" }, { lang: "Spanish", tag: "es" }, { lang: "Swedish", tag: "sv" }, { lang: "Turkish", tag: "tr" }, { lang: "Ukranian", tag: "uk" }];


  constructor(private backend: BackendService, public dialogRef: MatDialogRef<SaveAsDialogComponent>, @Inject(MAT_DIALOG_DATA) public data) {
    this.titleValue = data.title;
    this.oldTitle = data.title;
    this.oldProject = data.project;
    this.oldLanguage = data.language;

    var index = this.languages.findIndex(x => x.tag == this.oldLanguage);
    this.languageValue = this.languages[index];
    console.log(this.languageValue);
  }


  ngOnInit() {
    if (environment.enterprise) {
      this.getProjects();
    }
    console.log("enterprise: " + this.showProject);
  }

  getProjects() {
    this.projectValue = { projectName: "", accessLevel: 0 };
    let endpoint = '/create/getCustomerProjects';
    this.backend.getRequest(endpoint).subscribe(res => {
      const json = JSON.parse(res);
      for(var i = 0; i<json.length; i++){
        if(json[i].accessLevel == 3){
          this.projects.push(json[i]);
        }
      }
      this.projectValue = this.projects[0];
    }, err => {
      console.log("No projects found");
    });
  }

  changed() {
    this.projectFieldEmpty = false;
    this.titleFieldEmpty = false;
  }

  save() {

    this.titleFieldEmpty = this.titleValue === '';
    this.languageFieldEmpty = this.languageValue.tag === '';

    if (environment.enterprise) {

      this.projectFieldEmpty = this.projectValue.projectName === "";

      if (!this.titleFieldEmpty && !this.projectFieldEmpty && !this.languageFieldEmpty) {
        var resEnterprise = {
          title: this.titleValue, 
          projectName: this.projectValue.projectName,
          overwrite: false, 
          lang: this.languageValue.tag
        };
        console.log(this.oldTitle);
        console.log(this.titleValue);
        console.log(this.oldProject);
        console.log(this.projectValue.projectName);

        if (this.oldTitle == this.titleValue && this.oldProject == this.projectValue.projectName) { 
          resEnterprise.overwrite = true; 
        }
        this.dialogRef.close(resEnterprise);
      }

    } else {

      if (!this.titleFieldEmpty && !this.languageFieldEmpty) {
        var resPublic = { title: this.titleValue, overwrite: false, lang: this.languageValue.tag };
        if (this.oldTitle == this.titleValue) { resPublic.overwrite = true; }
        this.dialogRef.close(resPublic);
      }

    }

  }

}
