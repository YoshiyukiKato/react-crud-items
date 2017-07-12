import * as Promise from "bluebird";
import React,{Component} from "react";
import RemoveConfirmation from "./remove-confirmation";

import {ItemForm, ItemFormProps} from "./item-form";

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