import {useContext, useState} from "react";
import gc from "global.module.css";
import classes from "./LobbySettings.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {Player} from "system/GameStates/GameTypes";
import {ReferenceManager} from "system/Database/RoomDatabase";
import {useTranslation} from "react-i18next";
import {formatInsert} from "lang/i18nHelper";
import animClasses from "animation.module.css";

const MAX_NAME_LENGTH = 16;
export default function LobbySettings() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();
    const [flashCss, setCss] = useState("");
    const myId: string | null = localCtx.getVal(LocalField.Id);
    if (myId === null) {
        return <p>Need to reload</p>;
    }
    const myPlayer: Player = ctx.room.playerMap.get(myId)!;
    const myRef = ReferenceManager.getPlayerReference(myId);

    async function onFinishEditName(event: any) {
        let newName: string = event.target.value;
        if (newName.length <= 1) return;
        if (newName.length > MAX_NAME_LENGTH) {
            newName = newName.substring(0, MAX_NAME_LENGTH);
        }
        myPlayer.name = newName;
        myRef.set(myPlayer);
    }


    function onClickCopy(e: any) {
        //TODO Copy links button
        const myUrl = window.location.href;
        /* Copy the text inside the text field */
        navigator.clipboard.writeText(myUrl);
        /* Alert the copied text */
        setCss(animClasses.flash);
        setTimeout(() => {
            setCss("");
        }, 100);
    }

    return (
        <div className={`${classes.container} ${gc.round_border}`}>
            <div className={classes.settingsContainer}>
                <p className={classes.nameHeader}>{t("_name")}</p>
                <input
                    className={classes.fieldType}
                    type="text"
                    onBlur={onFinishEditName}
                    defaultValue={myPlayer.name}
                ></input>
                <button className={`${classes.fieldType} ${flashCss}`}
                        onClick={onClickCopy}>{t("_copy_link")}</button>
            </div>
            <div className={classes.creditsContainer}>
                <p>{formatInsert(t, "_rule_three_lines")}</p>
                <p>{formatInsert(t, "_credits")}</p>
            </div>
        </div>
    );
}
