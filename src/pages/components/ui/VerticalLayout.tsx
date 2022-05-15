import React from "react";
import { IProps } from "../../../App";
import classes from "./VerticalLayout.module.css";

export default function VerticalLayout(props: IProps) {
  return (
    <div className={`${classes.container} ${props.className} `}>
      {props.children}
    </div>
  );
}
