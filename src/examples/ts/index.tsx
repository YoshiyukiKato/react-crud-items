import React,{Component} from "react";
import ReactDOM from "react-dom"; 
import {Items, ItemsProps} from "../../ts/items";
import {Item, ItemProps} from "../../ts/item";
import {ItemForm, ItemFormProps} from "../../ts/item-form";
import colors from "./util/colors";

interface SamplesState{
  items : SampleItemProps[],
  isFormOpen : boolean,
  formItem? : SampleItemProps
  api? : any
}

export default class Samples extends Component<any, SamplesState>{
  constructor(props:any){
    super(props);
    this.state = this.initialState;
  }
  
  get initialState():SamplesState{
    return {
      items : [],
      isFormOpen : false,
      formItem : undefined
    };
  }

  private indexItems(items:SampleItemProps[]):SampleItemProps[]{
    return items.map((item, index) => {
      item.index = index;
      return item;
    });
  }

  render(){
    return <div id="samples">
      <Items defaultItem={{ name : "", description : "" }}
        Form={this.renderForm.bind(this)}
        Item={this.renderItem.bind(this)}/>
    </div>
  }

  renderItem(props:SampleItemProps){
    return <SampleItem {...props}/>
  }

  renderForm(props:SampleFormProps){
    return <SampleForm {...props}/>
  }
}

interface SampleItemProps extends ItemProps{
  index? : number;
  id? : string;
  user_id? : string;
  name : string;
  description : string;
}

class SampleItem extends Component<SampleItemProps, any>{
  constructor(props:SampleItemProps){
    super(props);
  }

  render(){
    return <Item {...this.props}>
      <div className="list-item-body">
        <div className="approach-description">{this.props.description}</div>
      </div>
    </Item>
  }

  handleRemove(){}
}

interface SampleFormProps extends SampleItemProps{
  save : (props:any) => any;
  close : () => any;
}

class SampleForm extends Component<SampleFormProps, any>{
  constructor(props:SampleFormProps){
    super(props);
    this.state = Object.assign(this.initialState, props);
  }

  get initialState():any{
    return {
      name : "",
      description : ""
    }
  }

  componentDidMount(){
    if(!this.props.id) return;
  }

  render(){
    return <ItemForm save={this.save.bind(this)} close={this.props.close}>
      <div id="approach-inputs" className="form-section form-inputs">
        <input className="input" placeholder="名前" value={this.state.name}
          onChange={this.handleChangeName}/>
        <input className="input" placeholder="説明" value={this.state.description}
          onChange={this.handleChangeDescription}/>
      </div>
    </ItemForm>
  }

  handleChangeName = this.handleChangeInput.bind(this, "name");
  handleChangeDescription = this.handleChangeInput.bind(this, "description");

  handleChangeInput(stateKey:string, evt:any){
    const nextState:any = {};
    nextState[stateKey] = evt.target.value;
    this.setState(nextState);
  }

  handleChangeEditor(code:string, evt:any){
    this.setState({ code : code });
  }

  save(){
    this.props.save({
      index : this.props.index,
      id : this.state.id,
      name : this.state.name,
      description : this.state.description
    });
  }
}

ReactDOM.render(<Samples/> ,document.querySelector("#wrapper"));
