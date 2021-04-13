import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-add-quick-question-dialog',
  templateUrl: './add-quick-question-dialog.component.html'
})

export class AddQuickQuestionDialogComponent {

  pickedType: string;
  types: string[] = ['star', 'slider', 'options', 'emoji', 'select'];
  public answersAmount = 1;
  public content = "";
  radioText = true;
  showCustom = false;

  stdAnswers = [
    {
      type: "Interest",
      answers: "Very uninterested - Somewhat uninterested - Neutral - Somewhat interested -  Very interested",
      icon: "./assets/icons/ic_interest.png"
    }, 
    {
      type: "Agreement",
      answers: "Strongly Disagree - Disagree - Neutral - Agree - Strongly Agree",
      icon: "./assets/icons/ic_agreement.png"
    }, 
    {
      type: "Frequency",
      answers: "Never - Rarely - Occasionally - Frequently - Very Frequently",
      icon: "./assets/icons/ic_frequency.png" 
    }, 
    {
      type: "Importance",
      answers: "Not important at all - Slightly important - Moderately important - Very important - Extremely important",
      icon: "./assets/icons/ic_importance.png"
    }, 
    {
      type: "Relevance",
      answers: "Not relevant at all - Slightly relevant - Moderately relevant - Very relevant - Extremely relevant",
      icon: "./assets/icons/ic_relevance.png"
    }
  ]
  stdValue: any;

  constructor(public dialogRef: MatDialogRef<AddQuickQuestionDialogComponent>, @Inject(MAT_DIALOG_DATA) public data, ) {
    this.stdValue = this.stdAnswers[0];
  }

  stdSelected($event){

    if($event == "nps"){
      this.answersAmount = 10;
      this.pickedType = "star";
      this.content = "";
      this.save();
    } else if($event == "custom"){
      this.showCustom = true;
    } else {
      this.answersAmount = 5;
      this.content = $event;
      this.pickedType = "slider";
      this.save();
    }
  }

  async onPaste(event: any) {
    this.content = "";
    let clipboardData = event.clipboardData ||  event.originalEvent.clipboardData;
    let pastedText = clipboardData.getData('text');
    let temp = pastedText.replace(/\r/gm, '-');
    let count = 0;
    count = (temp.match(new RegExp("-", "g")) || []).length;
    setTimeout(() => { 
      this.content = "";
      this.content = temp.replace(/[\n\r]/g, '');
      this.answersAmount = count;
      console.log(count);
     }, 1000);
    
    
  }

  save() {

   

    var result = { type: "", num: 0, content: "" };
    result.type = this.pickedType;
    result.content = this.content;
    result.num = this.answersAmount;
    if(this.answersAmount > 15){
      result.type = "select";
    }


    this.dialogRef.close(result);
  }

  discard() {
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
