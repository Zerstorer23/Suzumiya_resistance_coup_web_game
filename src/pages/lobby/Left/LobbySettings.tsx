import {useContext} from "react";
import gc from "global.module.css";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./LobbySettings.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {Player} from "system/GameStates/GameTypes";
import {ReferenceManager} from "system/Database/RoomDatabase";
import {useTranslation} from "react-i18next";


const MAX_NAME_LENGTH = 16;
export default function LobbySettings() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();
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
        console.log(newName);
        myPlayer.name = newName;
        myRef.set(myPlayer);
    }

    function onClickHelp(e: any) {
        //TODO direct
    }

    function onClickCopy(e: any) {
        //TODO Copy links button

    }

    return (
        <div className={`${classes.container} ${gc.round_border}`}>
            <HorizontalLayout>
                <p className={classes.fieldType}>{t("_name")}</p>
                <input
                    className={classes.fieldType}
                    type="text"
                    onBlur={onFinishEditName}
                    defaultValue={myPlayer.name}
                ></input>
            </HorizontalLayout>
            <button className={classes.fieldType} onClick={onClickHelp}>{t("_help")}</button>
            <button className={classes.fieldType} onClick={onClickCopy}>{t("_copy_link")}</button>
            {/*<button className={classes.fieldType}>{t("_help")}</button>*/}
        </div>
    );
}
