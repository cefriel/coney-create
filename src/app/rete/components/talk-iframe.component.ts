import { Component, Input, Output } from 'rete';
import { TalkType } from '../sockets';
import { UrlFieldControl } from '../controls/url-field.control';
import { ENUM_RETE_COMPONENT } from '../../model/conversational.model';
import VueRender from 'rete-vue-render-plugin';
import { IframeAreaControl } from '../controls/iframe-area.control';

var CustomNode = {
  template: `<div class="node talkNode" :class="[selected(), node.name] | kebab">
  <div class="title">
  <h6 class="m-0">Message</h6>
  <small style="color: #777">{{node.label}}</small>
  </div>
  <!-- Inputs-->
    <div class="input" v-for="input in inputs()" :key="input.key">
      <Socket v-socket:input="input" type="input" :socket="input.socket"></Socket>
      <div class="input-title" v-show="!input.showControl()">{{input.name}}</div>
      <div class="input-control" v-show="input.showControl()" v-control="input.control"></div>
    </div>

    <!-- Outputs-->
    <div class="output" v-for="output in outputs()" :key="output.key">
      <div class="output-title">{{output.name}}</div>
      <Socket v-socket:output="output" type="output" :socket="output.socket"></Socket>
    </div>
    <!-- Controls-->
    <div class="control" v-for="control in controls()" v-control="control"></div>
    
</div>`,
  mixins: [VueRender.mixin],
  components: {
    Socket: VueRender.Socket
  }
}

export class TalkIframeComponent extends Component {
  data: any;
  constructor() {
    super(ENUM_RETE_COMPONENT.TALK_IFRAME);
    this.data.component = CustomNode;
  }

  builder(node) {

    node.type = "Talk";
    node.subtype = "iframe";
    node.label = "iframe [beta]";


    const in1 = new Input('in', 'Talk/Answer', TalkType, true);
    const out1 = new Output('out', 'Talk/Question', TalkType, false);
    return node
      .addInput(in1)
      .addControl(new IframeAreaControl(this.editor, 'text'))
      .addOutput(out1);
  }

  worker(node, inputs, outputs) { }
}
