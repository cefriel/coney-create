import { Control } from 'rete';
import Vue from 'vue';;
import { SearchTagDialogComponent } from '../../dialogs/search-tag-dialog.component';
import { MatDialog } from '@angular/material/dialog';

var dialog: MatDialog;

const VueTagFieldControl = Vue.component('txt-field', {
    props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
    template: `<div :disabled="readonly"><div v-if="text!=\'\' && text!=undefined" id="results" @click="deleteOne($event)">
    <span> {{ text }} </span></div>
    <button v-if="displayBtn" id="tagsIn" class="tag-btn" @click="openTagDialog($event)" :disabled="readonly">TAG</button></div>`,
    data() {
        return {
            text: "",
            displayBtn : true
        }
    },
    methods: {
        deleteOne(e: any) {
            var el = e.toElement;
            if (el.tagName.toLowerCase() != "span") {
                return;
            }
            el.textContent = "";
            this.text = "";
            this.displayBtn = true;
            this.update();
        },
        change(e) {
        },
        update() {
            if (this.ikey) {
                this.putData(this.ikey, this.text);
            }
            this.emitter.trigger('process');
            var n = this.emitter.selected.list[0];
            return new Promise(resolve => {
                setTimeout(() => {
                    this.emitter.view.updateConnections({ node: n });
                }, 10);
            });  
        },
        openTagDialog(e: any) {
            
            if(this.text == undefined || this.text == ""){
                this.text = "";
            }
            const dialogRef = dialog.open(SearchTagDialogComponent, {
                width: '500px',
                maxHeight: '80vh',
                data: this.text
            });

            dialogRef.afterClosed().subscribe(selectedTag => {
                if (selectedTag !== undefined) {
                    this.text = selectedTag;
                    this.displayBtn = false;
                } else {
                    this.displayBtn = true;
                }

                this.update();
            });
        }
    },
    mounted() { 
        this.text = this.getData(this.ikey);
        if(this.text == undefined || this.text == ""){
            this.displayBtn = true;
        } else {
            this.displayBtn = false;
        }
    }
});

export class TagFieldControl extends Control {
    component: any;
    props: any;
    vueContext: any;

    constructor(public emitter, public key, public dialogMod: MatDialog, readonly = false) {
        super(key);
        readonly = emitter.plugins.get('readonly').enabled;
        dialog = dialogMod;
        this.component = VueTagFieldControl;
        this.props = { emitter, ikey: key, readonly };
    }

    setValue(val) {
        this.vueContext.value = val;
    }
}
