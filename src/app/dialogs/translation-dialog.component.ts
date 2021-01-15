import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from '../services/backend.service';
import { saveAs } from 'file-saver';
import { Papa } from 'ngx-papaparse';
import { CSVRecord } from '../model/CSVModel';
import { UtilsService } from '../services/utils.service';

@Component({
  selector: 'translation-dialog',
  templateUrl: './translation-dialog.component.html'
})

export class TranslationDialogComponent {

  @ViewChild('fileImportInput', { static: false }) fileImportInput: any;

  selectedLanguage: any;
  

  availableLanguages = [];
  activeData = [];
  activeTitle = "";
  activeLanguage = "";
  activeIntroText = "";
  activePrivacyLink = "";

  displayedLanguage = "";
  defaultlanguage:any = {lang:"none", tag: "none"};
  languageInTranslation = undefined;
  languages = [];

  displayScreen = "search";

  isLoading = false;
  isBeingConfirmed = false;
  emptyFields = false;
  uploadButtonEnabled = false;
  areTranslationsPresent = false;
  errorMessage = "All fields are required";
  conversationId = "";
  conversationTitle = "";
  translatedTitle = "";
  translatedIntroText = "";
  translatedPrivacyLink = "";
  csvContent: string;
  updateSuccessful = false;
  jsonToReturn: any;
  public csvRecords: any[] = [];

  constructor(private backend: BackendService,
    private utils: UtilsService,
    private papa: Papa,
    public dialogRef: MatDialogRef<TranslationDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data) {

    
    this.defaultlanguage = {lang:"none", tag: "none"};
    this.conversationId = data.conversationId;
    this.conversationTitle = data.conversationTitle;

    this.defaultlanguage = this.utils.getLanguageFromTag(data.defaultLanguage);
    
    this.languages = utils.getLanguageArray();
    
    this.getLanguagesOfConversation();

  }

  getLanguagesOfConversation() {
    this.availableLanguages = [];
    this.backend.getRequest("/chat/getLanguagesOfConversation?conversationId=" + this.conversationId).subscribe(json => { // /create

      var lan: [any] = JSON.parse(json);
      for (var i = 0; i < lan.length; i++) {
        if(lan[i].language == this.defaultlanguage.tag){
          console.log("skipping default: "+lan[i].language); continue;}

        var lang = this.utils.getLanguageFromTag(lan[i].language);
        
        if (lang != undefined) {

          var tmpL = {
            tag: lang.tag,
            lang: lang.lang,
            introText: lan[i].introText,
            privacyLink: lan[i].privacyLink,
            title: lan[i].title
          }

          this.availableLanguages.push(tmpL);
        }
      }
      console.log(this.availableLanguages);
    });
  }

  //CSV UPLOAD METHOD
  fileChangeListener($event: any): void {

    var encoding = "utf-8";
    if (this.selectedLanguage.tag == "it") {
      encoding = "ansi_x3.4-1968";
    }

    this.emptyFields = false;
    var files = $event.srcElement.files;
    if (this.isCSVFile(files[0])) {

      this.papa.parse(files[0], {
        encoding: encoding,
        complete: (result) => {
          let headersRow = result.data[0];
          if (!this.isHeaderValid(headersRow)) {
            this.emptyFields = true;
            this.errorMessage = "The CSV header format is not supported";
            this.fileReset();
            return;
          }

          this.csvRecords = this.getDataRecordsArrayFromCSVFile(result.data, headersRow.length);
          this.uploadButtonEnabled = true;
        }

      });
    } else {
      alert("Please import valid .csv file.");
      this.fileReset();
    }
  }

  getHeaderArray(csvRecordsArr: any) {
    let headers = csvRecordsArr[0].split(",");
    let headerArray = [];

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }
    return headerArray;
  }

  getDataRecordsArrayFromCSVFile(csvRecordsArray: any, headerLength: any) {
    let dataArr = [];

    for (let i = 1; i < csvRecordsArray.length; i++) {

      let row = csvRecordsArray[i];
      if (row.length == headerLength) {
        let blockRecord: any = {};
        //btoa(string);
        console.log(row[3])
        blockRecord.block_id = row[0].trim().replace(/"/g, ""),
          blockRecord.translation = row[3].trim().replace(/"/g, "")

        if (blockRecord.translation != "") {
          this.areTranslationsPresent = true;
        }
        dataArr.push(blockRecord);
      }
    }
    return dataArr;
  }

  isHeaderValid(header: any) {
    return header[0] == "block_id" && header[1] == "type" && header[2] == "text"
      && header[3] == "translation";
  }

  isCSVFile(file: any) {
    return file.name.endsWith(".csv");
  }

  fileReset() {
    this.fileImportInput.nativeElement.value = "";
    this.csvRecords = [];
    this.areTranslationsPresent = false;
    this.isLoading = false;
    this.isBeingConfirmed = false;
    this.uploadButtonEnabled = false;
  }

  selectSelChanged() {
    this.emptyFields = false;
  }

  updateTranslation(){

    if(this.activeTitle == null){
      this.activeTitle = "";
    }

    this.jsonToReturn = {
      conversationId: this.conversationId,
      language: this.activeLanguage,
      title: this.activeTitle,
      introText: this.activeIntroText,
      privacyLink: this.activePrivacyLink,
      blocks: this.activeData
    }
    this.sendData(false);
  }

  uploadCSV() {
    if (this.selectedLanguage == undefined || this.translatedTitle == "" || this.selectedLanguage.tag == undefined || this.csvRecords.length == 0) {
      this.errorMessage = "All fields are required";
      this.emptyFields = true;
      return;
    } else if (!this.areTranslationsPresent) {
      this.emptyFields = true;
      this.errorMessage = "No translated blocks were found";
      return;
    }

    this.jsonToReturn = {
      conversationId: this.conversationId,
      language: this.selectedLanguage.tag,
      title: this.translatedTitle,
      introText: this.translatedIntroText,
      privacyLink: this.translatedPrivacyLink,
      blocks: this.csvRecords
    };

    this.emptyFields = false;
    this.isBeingConfirmed = true;
  }

  goBack() {
    this.isBeingConfirmed = false;
  }

  sendData(reset) {

    this.isLoading = true;
    var json = JSON.parse(JSON.stringify(this.jsonToReturn));
    console.log(json);

    let endpoint = '/create/uploadTranslation';

    this.backend.postJson(endpoint, json).subscribe(
      (res) => {

        var r: boolean = (JSON.stringify(res) == "true");
        if (r) {
          this.updateSuccessful = true;

          var index = this.languages.findIndex(x => x.tag == json.language);
          var index2 = this.availableLanguages.findIndex(x => x.tag == json.language);
          if(index!=-1 && index2==-1){
            this.availableLanguages.push(this.languages[index]);
          }
          //this.dismissDialog();
        } else {
          this.updateSuccessful = false;
        }
        this.isLoading = false;
        if(reset){
          this.changeDisplay('search');
          this.getLanguagesOfConversation();
        }
      }, err => {
        this.isLoading = false;
      }
    );
  }

  changeDisplay(change: string) {
    console.log(change);
    console.log(this.languageInTranslation);
    if(change == 'display' && this.languageInTranslation == undefined){
      change = 'search';
    }
    this.displayScreen = change;
  }

  downloadCSV(operation, language) {

    this.isLoading = true;

    var strt = "translation_";
    let endpoint = '/create/getTranslationCSV';
    endpoint = endpoint + '?conversationId=' + this.conversationId;
    console.log(operation);
    

    if (operation == "display" && language != undefined) {
      this.languageInTranslation = language;
      this.changeDisplay(operation);
      endpoint = endpoint + '&language=' + language;

      //find title
      var index = this.availableLanguages.findIndex(obj => obj.tag == language);
      if(index!=-1){
        this.activeTitle = this.availableLanguages[index].title;
        this.activeLanguage = this.availableLanguages[index].tag;
        this.activeIntroText = this.availableLanguages[index].introText;
        this.activePrivacyLink = this.availableLanguages[index].privacyLink;
        this.displayedLanguage = this.availableLanguages[index].lang;
        console.log(this.activeTitle);
      } else {
        this.activeLanguage = language;
        this.displayedLanguage = this.utils.getLanguageFromTag(language).lang;
        this.activeIntroText = "";
        this.activePrivacyLink = "";
      }
      
      
    }

    this.backend.getRequest(endpoint).subscribe(
      (res) => {

        if (operation == "save") {

          console.log("saving file...");
          const blob = new Blob([res], { type: 'text/plain' });
          saveAs(blob, strt + this.conversationTitle + ".csv");

        } else {
          this.getTranslatedRecordsArrayFromCSVFile(res);
        }

        this.isLoading = false;
      }, err => {
        this.isLoading = false;
      }
    );
  }

  dismissDialog() {
    this.dialogRef.close("translation_uploaded");
  }

  getTranslatedRecordsArrayFromCSVFile(csvData: any) {

    let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);

    let headers = (<string>csvRecordsArray[0]).split(',');
    let headerArray = [];

    for (let j = 0; j < headers.length; j++) {
      headerArray.push(headers[j]);
    }

    let csvArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      var currentRecord = (<string>csvRecordsArray[i]).split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);
      if (currentRecord.length == headerArray.length) {
        let csvRecord: CSVRecord = new CSVRecord();
        csvRecord.block_id = currentRecord[headerArray.findIndex(x => x == "block_id")].trim().replace(/['"]+/g, '');
        csvRecord.type = currentRecord[headerArray.findIndex(x => x == "type")].trim().replace(/["]+/g, '');
        csvRecord.text = currentRecord[headerArray.findIndex(x => x == "text")].trim().replace(/"/g, "");
        csvRecord.translation = currentRecord[headerArray.findIndex(x => x == "translation")].trim().replace(/["]+/g, '');
        csvArr.push(csvRecord);
      }
    }

    this.activeData = csvArr;
  }
}
