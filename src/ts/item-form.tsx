import * as Promise from "bluebird";
import React,{Component} from "react";

export interface ItemFormProps{
  save : () => any;
  close : () => any;
}

export class ItemForm extends Component<ItemFormProps, any>{
  constructor(props:ItemFormProps){
    super(props);
  }

  render(){
    return <div id="item-form" className="modal-content">
      {this.props.children}
      <div className="item-form-action form-section">
        <div className="save-item">
          <a className="btn btn-submit" onClick={this.handleSave.bind(this)}>保存する</a>
        </div>
        <div className="close-item-form">
          <a className="btn" onClick={this.handleClose.bind(this)}>閉じる</a>
        </div>
      </div>
    </div>
  }

  handleSave(){
    this.props.save();
  }

  handleClose(){
    this.props.close();
  }
}