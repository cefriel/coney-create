import { Control } from 'rete';
import Vue from 'vue';;

const VueTextAreaLimitedControl = Vue.component('txt-area', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: '<textarea class="txtarea-control" :value="text" @input="change($event)"  v-on:keyup="resize($event)" maxlength="150"' +
    'style="width:100%; max-height:200px!important; min-height:80px!important; border-radius: 4px; font-size: 18px; outline-width: 0; padding: 5px"></textarea>',
  data() {
    return {
      text: ''
    }
  },
  methods: {
    change(e) {
      this.text = e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.text);
      }
      this.emitter.trigger('process');
    },
    resize(event){
      event.srcElement.style.height = "1px";
      event.srcElement.style.height = (25+event.srcElement.scrollHeight)+"px";
    }
  },
  mounted() {
    this.text = this.getData(this.ikey);
  }
})

export class TextAreaLimitedControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);

    this.component = VueTextAreaLimitedControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
