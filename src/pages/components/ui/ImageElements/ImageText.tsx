import {IProps} from "system/types/CommonTypes";
import classes from "pages/components/ui/ImageElements/ImageText.module.css";
import React from "react";

type Props = IProps & {
    src: string;
}
export default function ImageText(props: Props) {
    return (
        <div className={`${classes.container} ${props.className} `}>
            <img src={props.src} className={classes.image}/>
            <div className={classes.text}>
                {props.children}
            </div>
        </div>
    );
}