import {IProps} from "system/types/CommonTypes";
import classes from "pages/components/ui/ImageElements/ImageText.module.css";
import React from "react";

type Props = IProps & {
    src: string;
}
export default function ImageButton(props: Props) {
    return (
        <div className={`${classes.container} ${props.className} `}>
            <img src={props.src} className={classes.image}/>
            <button>{props.children}</button>
        </div>
    );
}