import {Component, Input, Output} from 'rete';
import { QuestionAnswerType, TalkType } from '../sockets';
import {ENUM_RETE_COMPONENT} from '../../../model/conversational.model';
import { PointsFieldControl } from '../controls/points-field.control';
import VueRender from 'rete-vue-render-plugin';
import { OptionalControl } from '../controls/optional.control';

var CustomNode = {
  template: `<div class="node answerNode" :class="[selected(), node.name] | kebab">
    <div class="title">
    <h4 class="m-0">{{node.data.type}}</h4>
    <small style="color: #777">open</small>
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

export class AnswerSingleComponent extends Component {
  data: any;
  constructor() {
    super(ENUM_RETE_COMPONENT.ANSWER_OPEN);
    this.data.component = CustomNode;

    
  }

  builder(node) {

    node.data.type = "Answer";
    node.data.subtype = "single";
    
    const in1 = new Input('in', 'Question', QuestionAnswerType, true);
    const out1 = new Output('out', 'Talk/Question', TalkType, false);
    return node.addInput(in1)
    .addControl(new OptionalControl(this.editor, "optional"))
    //.addControl(new PointsFieldControl(this.editor, "points"))
    .addOutput(out1);
  }

  worker(node, inputs, outputs) { }

}
