import React from "react";
import classes from "./PlayerListItem.module.css";
import {Player} from "system/GameStates/GameTypes";
import {IProps} from "system/types/CommonTypes";
import animClasses from "animation.module.css";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";
import gc from "global.module.css";

type Prop = IProps & {
    player: Player;
    isHost: boolean;
};


export default function PlayerListItem(props: Prop) {
    const hostCss = props.isHost ? classes.isHost : "";
    const {t} = useTranslation();
    const name = (props.player.wins === 0) ? props.player.name :
        insert(t, "_name_with_wins", props.player.name, props.player.wins);
    let tagElem: JSX.Element;
    if (props.isHost) {
        tagElem = <div className={`${classes.hostPanel}`}>{t("_is_host")}</div>;
    } else if (props.player.isReady) {
        tagElem = <div className={`${classes.readyPanel} ${animClasses.slideDown}`}>{t("_is_ready")}</div>;
    } else {
        tagElem = <div className={`${classes.readyPanel} ${animClasses.invisible}`}/>;
    }
    return (
        <div className={`${classes.item} ${gc.borderBottom} ${animClasses.fadeIn}`}>
            {tagElem}
            <p className={`${hostCss} ${classes.namePanel}`}>{name}</p>
        </div>
    );
}
