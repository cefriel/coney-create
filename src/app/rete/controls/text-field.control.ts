import { Control } from 'rete';
import Vue from 'vue';

const VueTextFieldControl = Vue.component('txt-field', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: '<input :value="text" class="customInput pl-2" style="outline-width: 0; width:100%;" @dblclick.stop="" @pointermove.stop="" :readonly="readonly"' +
    '@input="change($event)" placeholder="Displayed text" maxlength="30"/>',
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

      var n = this.emitter.selected.list[0];
      return new Promise(resolve => {
        setTimeout(() => {
          this.emitter.view.updateConnections({ node: n });
        }, 10);
      });
    }
  },
  mounted() {
    this.text = this.getData(this.ikey);
  }
});

export class TextFieldControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    readonly = emitter.plugins.get('readonly').enable;
    this.component = VueTextFieldControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
