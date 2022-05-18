import React from "react";
import { IProps } from "system/types/CommonTypes";
import classes from "./HorizontalLayout.module.css";

export default function HorizontalLayout(props: IProps) {
  return (
    <div className={`${classes.container} ${props.className}`}>
      {props.children}
    </div>
  );
}
