import React,{Component} from "react";
import {Icon,IconProps,IconState} from "./_icon";

export default class Approach extends Component<IconProps,any>{
  constructor(props:IconProps){
    super(props);
  }
  render(){
    return <Icon {...this.props}>
      <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/>
    </Icon>
  }
}