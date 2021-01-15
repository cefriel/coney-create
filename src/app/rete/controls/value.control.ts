import { Control } from 'rete';
import Vue from 'vue';;

const VueValueControl = Vue.component('num', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `
  
  <div style="width: 100%; position: relative" class="row m-0 checkbox">
                  <span class="input-group-text p-0" style="position: absolute; z-index: 1; left: 32px; top: 3px; color: #7c7c7c"> Map Value </span>
                  <input v-model="valueChecked" type="checkbox" @input="manageValue()" id="otherCheckbox">
                  <input type="number" :disabled="!valueChecked" :readonly="readonly" :value="value"  class="customInput col-12"
                      style="padding-left: 36px; text-align: right; padding-right: 2px;" @input="change($event)" min="0"  id="otherInput" placeholder="">
    </div>`,
  data() {
    return {
      value: 0,
      valueChecked : false
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
    manageValue(){
      if(this.valueChecked){
        this.value = 0;
      } else {
        this.value = this.emitter.selected.list[0].data.sort;
      }
    }
  },
  mounted() {
    this.value = this.getData(this.ikey);
    if(this.value == undefined){
      this.value = 0;
      this.update();
    }
  }
})


export class ValueControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    readonly = emitter.plugins.get('readonly').enable;
    this.component = VueValueControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
