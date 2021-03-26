import { Control } from 'rete';
import Vue from 'vue';;

const VueIframeAreaControl = Vue.component('txt-area', {
  props: ['readonly', 'emitter', 'ikey', 'getData', 'putData'],
  template: `<textarea class="txtarea-control customTextarea" v-bind:id="areaId" 
  :value="text"
  :readonly="readonly" 
  v-on:keyup="resize($event)" 
  @input="change($event)" 
  @dblclick.stop="" 
  @pointermove.stop=""></textarea>`,
  data() {
    return {
      text: '',
      parsed: '',
      areaId: "iframearea-" + Math.floor((Math.random() * 100000) + 10000),
    }
  },
  methods: {
    change(e) {
      console.log(e);
      this.text = e.target.value.replace("\"", "'");
      var escapeHTML = this.text.replace(/[&<>'"]/g, 
      tag => ({
          '&': '&amp;',
          '<': '&lt;',
          '>': '&gt;',
          "'": '&#39;',
          '"': '&quot;'
        }[tag]));
        this.parsed = escapeHTML;
      this.update();
    },
    update() {
      if (this.ikey) {
        this.putData(this.ikey, this.text.replace("\"", "'"));
      }
      this.emitter.trigger('process');

      if(this.emitter.selected.list.length == 0){
        return;
      }
      var n = this.emitter.selected.list[0];
      return new Promise(resolve => {
        setTimeout(() => {
          this.emitter.view.updateConnections({ node: n });
        }, 10);
      });
    },
    resize(event){
      event.srcElement.style.height = "1px";
      event.srcElement.style.height = (10+event.srcElement.scrollHeight)+"px";
    }
  },
  mounted() {
    this.text = this.getData(this.ikey);

    this.$nextTick(function () {
    var el = document.getElementById(this.areaId);
    el.style.height = "1px";
    el.style.height = (10+el.scrollHeight)+"px";
    })
  }
})

export class IframeAreaControl extends Control {
  component: any;
  props: any;
  vueContext: any;

  constructor(public emitter, public key, readonly = false) {
    super(key);
    
    readonly = emitter.plugins.get('readonly').enabled;

    this.component = VueIframeAreaControl;
    this.props = { emitter, ikey: key, readonly };
  }

  setValue(val) {
    this.vueContext.value = val;
  }
}
