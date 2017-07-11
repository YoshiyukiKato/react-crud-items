import React,{Component} from "react";

interface RemoveConfirmationProps{
  name : string;
  remove : () => any;
  cancel : () => any;
}

interface RemoveConfirmationState{
  confirmName : string;
}

export default class RemoveConfirmation extends Component<RemoveConfirmationProps, RemoveConfirmationState>{
  constructor(props:RemoveConfirmationProps){
    super(props);
    this.state = this.initialState;
  }

  get initialState():RemoveConfirmationState{
    return {
      confirmName : ""
    }
  }

  render(){
    const isRemoveConfirmed = this.props.name === this.state.confirmName;
    return <div className="modal-wrapper">
      <div className="remove-confirmation modal-content">
        <div className="item-form-section">
          <p><b>{this.props.name}</b>を削除しようとしています。削除したものは復元できません。</p>
          <p>この操作を続ける場合、フォームに「<b>{this.props.name}</b>」と入力して<span className="btn btn-delete btn-intext">削除する</span>ボタンを押してください。</p>
          <p>この操作をやめる場合、<span className="btn btn-intext">キャンセル</span>ボタンを押してください。</p>
        </div>
        <div className="item-form-section">
          <input className="input" value={this.state.confirmName} onChange={this.handleChangeConfirmName}/>
        </div>
        <div className="item-form-section">
          <button className="btn btn-delete"
            disabled={!isRemoveConfirmed}
            onClick={this.props.remove}>削除する</button>
          <button className="btn" onClick={this.props.cancel}>キャンセル</button>
        </div>
      </div>
    </div>
  }

  handleChangeConfirmName = this.handleChangeInput.bind(this, "confirmName");
  handleChangeInput(stateKey:string, evt:any){
    const nextState:any = {};
    nextState[stateKey] = evt.target.value;
    this.setState(nextState);
  }
}