import { Control } from 'rete';
import Vue from 'vue';;

const VueOptionalControl = Vue.component('num', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<div class="m-0 row justify-content-center">
        <input @dblclick.stop="" @pointerdown.stop="" @pointermove.stop="" v-model="value" @input="checkChange()" type="checkbox" class="mr-2" style="margin-top: .35rem!important;"> 
        <span class="op-label"> Optional</span>
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
      console.log(this.value + " -> " + this.optional);
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
      console.log("post: " + this.value + " -> " + this.optional);
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
    this.component = VueOptionalControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
