import { Control } from 'rete';
import Vue from 'vue';;

const VueNumControl = Vue.component('num', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<div class="m-0 row" style="position: relative;">
      <span class="input-group-text" style="position: absolute;z-index: 1;left: 10px;top: 7px; color: #7c7c7c"> Order </span>
      <input @dblclick.stop=""  @pointermove.stop="" :readonly="readonly" type="number" class="customInput" :value="value" 
      style="display: inline-block; text-align: right" @input="change($event)" min="1" max="10" />
    </div>`,
  
  data() {
    return {
      value: 1
    };
  },
  methods: {
    change(e) {
      this.value = +e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.value);
      }
      this.emitter.trigger('process');
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
    if(this.value == undefined){
      this.value = 0;
    }
  }
})


export class NumControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    readonly = emitter.plugins.get('readonly').enabled;
    this.component = VueNumControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
