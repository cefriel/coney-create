import { Control } from 'rete';
import Vue from 'vue';;

const VueMaxAnswControl = Vue.component('num', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<div class="m-0 row" style="position: relative;">
  <span class="input-group-text p-0" style="position: absolute;z-index: 1;left: 10px;top: 3px; color: #7c7c7c; padding-left: 1.5rem!important;"> 
  <input v-model="maxChecked" type="checkbox" @input="cbChanged()" id="maxAnsCheckbox" v-if="!readonly">
  Max answers </span>
  <input type="number" v-bind:class="{ 'force-white': maxChecked }" :disabled="!maxChecked || readonly" class="customInput" :value="value" 
  style="display: inline-block; text-align: right" @input="change($event)" min="0" />
</div>`,
  data() {
    return {
      value: 1,
      maxChecked: false
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
    },
    cbChanged(){
      if(this.maxChecked){
        this.value = 0;
      }  
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
    if(this.value == undefined){
      this.value = 0;
      this.update();
    } else if(this.value != 0){
      this.maxChecked = true;
    }
  }
})


export class MaxAnswControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    readonly = emitter.plugins.get('readonly').enabled;
    this.component = VueMaxAnswControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
