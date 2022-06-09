import React from "react";
import classes from "./PlayerListItem.module.css";
import {Player} from "system/GameStates/GameTypes";
import {IProps} from "system/types/CommonTypes";
import animClasses from "animation.module.css";
import {useTranslation} from "react-i18next";

type Prop = IProps & {
    player: Player;
    isHost: boolean;
};


export default function PlayerListItem(props: Prop) {
    const name = props.player.name;
    const hostCss = props.isHost ? classes.isHost : "";
    const {t} = useTranslation();

    let tagElem: JSX.Element;
    if (props.isHost) {
        tagElem = <div className={`${classes.hostPanel}`}>{t("_is_host")}</div>;
    } else if (props.player.isReady) {
        tagElem = <div className={`${classes.readyPanel} ${animClasses.slideDown}`}>{t("_is_ready")}</div>;
    } else {
        tagElem = <div className={`${classes.readyPanel} ${animClasses.invisible}`}/>;
    }

    return (
        <div className={`${classes.item} ${animClasses.fadeIn}`}>
            {tagElem}
            <p className={`${hostCss} ${classes.namePanel}`}>{name}</p>
        </div>
    );
}
