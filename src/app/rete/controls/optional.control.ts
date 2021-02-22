import { Control } from 'rete';
import Vue from 'vue';;

const VueOptionalControl = Vue.component('num', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<div class="m-0 row px-1 mb-2" style="min-width:200px">
        <input @dblclick.stop="" @pointermove.stop="" :readonly="readonly" v-model="value" @input="checkChange()" type="checkbox" class="mr-2" style="margin-top: .35rem!important;"> 
        <span class="op-label">Make optional</span>
    </div>`,
  
  data() {
    return {
      value: false,
      optional: 0
    };
  },
  methods: {
    change(e) {
      this.value = +e.target.value;
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.optional);
      }
      this.emitter.trigger('process');
    },
    checkChange(){
      if(!this.value){
        this.optional = 1;
      } else {
        this.optional = 0;
      }
      this.update();
    }
  },
  mounted() {
    this.optional = this.getData(this.ikey);
    if(this.optional == undefined){
      this.optional = 0;
    } else if (this.optional == 1){
      this.value = true;
    }
    this.update();
  }
})


export class OptionalControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    readonly = emitter.plugins.get('readonly').enabled;
    this.component = VueOptionalControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
