import { Control } from 'rete';
import Vue from 'vue';
import Sortable from 'sortablejs/modular/sortable.complete.esm.js';

/*
 <div class="m-0 mt-1 row" style="position: relative;" v-if="noOpChecked">
    <span class="input-group-text p-0"
        style="position: absolute;z-index: 1;left: 10px;top: 3px; color: #7c7c7c"> Value of no answer </span>
    <input @input="manageNone()" id="noneValue" type="number" class="customInput" :readonly="readonly"
        style="display: inline-block; text-align: right" min="0" v-model="noOpValue" />
</div> 

v-on:keyup.enter="addRow('enter')"
*/ 
const VueCheckboxListControl = Vue.component('text', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<div class="input-group mt-2" @dblclick.stop="" @pointerdown.stop="" @pointermove.stop="">
              <ul v-bind:id="listid" style="padding: 0px 0px 0px 5px!important; list-style: none; position: relative; width: 100%;">
                <li v-for="(value, index) in values" v-if="value.type != 'other' && value.type != 'none'">
                <div class="col-12 p-0" >
                  <textarea rows="2" class="pr-2 checkboxInput" :id="index" @input="update()" type="text"
                      placeholder="Add answer" v-model="value.v"  v-on:keyup="resize($event)"
                      maxlength="100"></textarea>
                  <button class="del-cb-line-btn" @click="deleteRow(index)">X</button>
                  <div v-bind:class="cbmid" v-on:drop="updateList()">
                  ➖
                  </div>
                </div>
                </li>
              </ul>
              <div id="inline-checkbox-controls" class="col-12 mb-2 pr-0 text-right">
                <button class="add-checkbox" @click="addRow(undefined)">
                    +
                </button>
              </div>
              <div style="width: 100%; position: relative" class="row my-0 mt-0 mb-2 checkbox">
                  <input v-model="noOpChecked" type="checkbox" @input="manageNone()" id="noneCheckbox">
                  <input v-model="noOpText" :disabled="!noOpChecked"  v-on:blur="manageNone()" class="customInput col-12"
                      style="padding-left: 36px;" maxlength="30" type="text" id="noneInput" placeholder="Add 'none of the above'">
              </div>
          
              <div style="width: 100%; position: relative" class="row m-0 checkbox">
                  <input v-model="otherChecked" type="checkbox" @input="manageOther()" id="otherCheckbox">
                  <input v-model="otherText" :disabled="!otherChecked" v-on:blur="manageOther()" class="customInput col-12"
                      style="padding-left: 36px;" maxlength="30" type="text" id="otherInput" placeholder="Add 'other'">
              </div>
            </div>`,
  data() {
    
    
    return {
      noOpText: "",
      noOpChecked: false,
      otherChecked: false,
      otherText: "",
      listid: "list-"+Math.floor((Math.random() * 100000) + 10000),
      cbmid: "cb-move-"+Math.floor((Math.random() * 100000) + 10000),
      values: [],
      sortable: Sortable
    };
  },
  methods: {
    change() {
      
    },
    resize(event){
      event.srcElement.style.height = "1px";
      event.srcElement.style.height = (5+event.srcElement.scrollHeight)+"px";
    },
    update() {

      if (this.ikey) {
        this.putData(this.ikey, this.values);
      }
      this.emitter.trigger('process');

      var n = this.emitter.selected.list[0];
      return new Promise(resolve => {
        setTimeout(() => {
          this.emitter.view.updateConnections({ node: n });
        }, 10);
      });

     
    },
    addRow(e) {

      if(this.values.length == 15){
        return;
      }
      this.values.push({ v: "", order:98, type: "normal" });
      this.updateList();
      if (e == undefined) {
        return;
      }
      var index = this.values.length - 1;

      

      var n = this.emitter.selected.list[0];
      return new Promise(resolve => {
        setTimeout(() => {
          var x = document.getElementById(index + "");
          if (x != undefined) {
            document.getElementById(index + "").focus();
          } else {
            index--;
            document.getElementById(index + "").focus();
          }
          this.emitter.view.updateConnections({ node: n });
        }, 10);
      });
     
    },
    deleteRow(index) {
      if (this.values.length > 1) {
        this.values.splice(index, 1);

        var n = this.emitter.selected.list[0];
        return new Promise(resolve => {
          setTimeout(() => {
            this.emitter.view.updateConnections({ node: n });
          }, 10);
        });
      }
    },
    insertData() {
      for (var i = 0; i < this.values.length; i++) {
        if (this.values[i].type == "none") {
         this.noOpChecked = true;
         this.noOpText = this.values[i].v;

        }
        if (this.values[i].type == "other") {
          this.otherChecked = true;
          this.otherText = this.values[i].v;
 
         }
      }
    },
    manageNone() {
      this.updateList();

      return new Promise(resolve => {
        setTimeout(() => {

          if(this.otherChecked){
            this.otherChecked = false;
          }

          var text = this.noOpText;
          if (this.noOpText == "") {
            text = "None of the above";
          } 
    
          var isPresent = false;
          var position = 0;
          for (var i = 0; i < this.values.length; i++) {
            if (this.values[i].type == "none") {
              isPresent = true;
              position = i;
              this.values[i].v = text;
            }
          }
    
          if (isPresent && !this.noOpChecked) {
            this.values.splice(position, 1);
          }
          if (!isPresent && this.noOpChecked) {
            var it = { v: this.noOpText, order:99, type:"none" };
            this.values.push(it);
          }
        }, 20);
      });

    },
    manageOther() {

      this.updateList();

      return new Promise(resolve => {
        setTimeout(() => {

          if(this.noOpChecked){
            this.noOpChecked = false;
          }

          var text = this.otherText;
          if (this.otherText == "") {
            text = "None of the above";
          } 
    
          var isPresent = false;
          var position = 0;
          for (var i = 0; i < this.values.length; i++) {
            if (this.values[i].type == "other") {
              isPresent = true;
              position = i;
              this.values[i].v = text;
            }
          }
    
          if (isPresent && !this.otherChecked) {
            this.values.splice(position, 1);
          }
          if (!isPresent && this.otherChecked) {
            var it = { v: this.other, order:99, type: "other" };
            this.values.push(it);
          }
        }, 20);
      });

    },
    updateList(){
      console.log("updating");
      var listElements = this.sortable.el.children;
      for(var z = 0; z<listElements.length; z++){
        var liEl = listElements[z];
        var content = liEl.firstChild.firstChild.value;
        var index = this.values.findIndex(obj => obj.v == content)
        if(index != -1){
          this.values[index].order = z+1;
        }
      }
  
      //this.values.sort((a, b) => (a.order > b.order) ? 1 : -1)
    }
  },
  mounted() {

   
    this.values = this.getData(this.ikey);
    if (this.values == undefined) {
      this.values = [];
      this.values.push({ v: "", order:98, type: "normal" });
    }

    this.values.sort((a, b) => (a.order > b.order) ? 1 : -1)
    
    this.insertData();

    //ponly after view is rendered
    this.$nextTick(function () {
      console.log("mounted");
      var el = document.getElementById(this.listid);

      this.sortable = Sortable.create(el, {
        handle: "."+this.cbmid,animation: 150
      });    
     
    })

   

  }
})


export class CheckboxListControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    this.component = VueCheckboxListControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.values = val;
  }
}
