import React from "react";
import ReactDOM from "react-dom";
import {Items} from "./items";

export default Items;
export function webRender(){
  ReactDOM.render(<Items defaultItem={} Form={} Item={}/>, document.querySelector("#wrapper"));
}
