import * as Promise from "bluebird";
import React,{Component} from "react";
import RemoveConfirmation from "./remove-confirmation";

export interface ItemProps{
  name : string;
  edit : () => any;
  remove : () => any;
}

export interface ItemState{
  toRemove : boolean
}

export class Item extends Component<ItemProps, ItemState>{
  constructor(props:ItemProps){
    super(props);
    this.state = this.initialState;
  }

  get initialState():any{
    return {
      toRemove : false
    };
  }

  render(){
    const removeConfirmation = this.renderRemoveConfirmation();
    
    return <div className="list-item">
      <div className="list-item-header">
        <div className="item-name" onClick={this.props.edit}>{this.props.name}</div>
        <div className="remove-item">
          <button>削除</button>
        </div>
      </div>
      <div className="list-item-body">{this.props.children}</div>
      {removeConfirmation}
    </div>
  }

  renderRemoveConfirmation(){
    return this.state.toRemove ? <RemoveConfirmation 
      name={this.props.name} 
      remove={this.props.remove}
      cancel={this.handleCancelRemove.bind(this)}/> : [];
  }

  handleRemove(){
    this.setState({ toRemove : true });
  }

  handleCancelRemove(){
    this.setState({ toRemove : false });
  }
}