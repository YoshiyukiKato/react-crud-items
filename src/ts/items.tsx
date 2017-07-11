import * as Promise from "bluebird";
import React,{Component} from "react";
import * as Icon from "./icons";
import RemoveConfirmation from "./remove-confirmation";
import * as colors from "./colors";

export interface ItemsProps{
  api? : {
    all : () => Promise<{ Items : any[] }>;
    find : (id:string) => Promise<any>
    create : (item:any) => Promise<any>;
    update : (id:string, item:any) => Promise<any>;
    delete : (id:string) => Promise<any>;
  };
  defaultItem : any;
  Item : () => Component<any, any>;
  Form : () => Component<any, any>;
}

export interface ItemsState{
  items : any[];
  isFormOpen : boolean;
  formItem? : any;
}

export class Items extends Component<ItemsProps, ItemsState>{
  constructor(props:any){
    super(props);
    this.state = this.initialState;
  }
  
  get initialState():ItemsState{
    return {
      items : [],
      isFormOpen : false,
      formItem : undefined
    };
  }

  private indexItems(items:any[]):any[]{
    return items.map((item, index) => {
      item.index = index;
      return item;
    });
  }

  componentDidMount(){
    const allAsync = this.props.api ? this.props.api.all() : Promise.resolve({ Items : [] });
    allAsync.then((result:{ Items : any[] }) => {
      const items = this.indexItems(result.Items);
      this.setState({ items : items });
    });
  }

  render(){
    const itemList = this.renderItems();
    const itemForm = this.renderForm();

    return <div className="items">
      <button id="new-item" className="btn btn-create" onClick={this.newItem.bind(this)}>新規作成</button>
      <div className="item-list list">
        {...itemList}
      </div>
      {itemForm}
    </div>
  }

  renderItems(){
    const ItemComponent = this.props.Item;
    return this.state.items.map((item:any, index:number) => {
      return <ItemComponent {...item}
              key={`item-${index}`}
              edit={this.editItem.bind(this, index)}
              remove={this.removeItem.bind(this, index)}/>
    });
  }

  renderForm(){
    const FormComponent = this.props.Form;
    if(this.state.isFormOpen){
      const formItem = this.state.formItem || this.props.defaultItem;
      return <div id="approach-form-wrapper" className="modal-wrapper">
        <FormComponent {...formItem} 
          save={this.saveItem.bind(this)} 
          close={this.closeForm.bind(this)}/>
      </div>
    }else{
      return [];
    }
  }

  openForm(formItem?:any){
    this.setState({ 
      isFormOpen : true,
      formItem : formItem
    });
  }

  closeForm(){
    this.setState({ isFormOpen : false });
  }

  newItem(){
    this.openForm(this.props.defaultItem);
  }
  
  editItem(index:number){
    const formItem = this.state.items[index];
    this.openForm(formItem);
  }

  saveItem(item:any){
    const itemIndex = item.index;
    if(itemIndex !== undefined){
      const updateAsync = !!this.props.api ? this.props.api.create(item) : Promise.resolve(item);
      updateAsync.then((item:any) => {
        this.state.items[itemIndex] = item;
        this.setState(this.state);
      }).catch(console.log); //TODO: ハンドリング
    }else{
      const createAsync = !!this.props.api ? this.props.api.create(item) : Promise.resolve(item);
      createAsync.then((item:any) => {
        item.index = this.state.items.length;
        this.state.items.push(item);
        this.setState(this.state);
      }).catch(console.log); //TODO: ハンドリング
    }
  }

  removeItem(index:number){
    const itemId = this.state.items[index].id;
    if(!!this.props.api && !itemId) return;
    const deleteAsync = !!this.props.api ? this.props.api.delete(itemId) : Promise.resolve();
    deleteAsync.then(() => {
      this.state.items.splice(index, 1);
      this.setState(this.state);
    });
  }
}

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
          <Icon.Remove 
            width="24"
            height="24"
            color={colors.grey["500"]}
            hoverColor={colors.red["800"]}
            cursor="pointer"
            onClick={this.handleRemove.bind(this)}/>
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