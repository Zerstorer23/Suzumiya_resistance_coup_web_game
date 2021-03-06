import {Fragment, useContext, useRef} from "react";
import gc from "global.module.css";
import classes from "./LobbySettings.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {useTranslation} from "react-i18next";
import {formatInsert} from "lang/i18nHelper";
import {TurnManager} from "system/GameStates/TurnManager";
import {DbFields, PlayerDbFields, ReferenceManager} from "system/Database/ReferenceManager";
import {setFishName} from "system/Database/Inalytics";
import {ChatFormat, sendChat} from "pages/components/ui/ChatModule/chatInfo/ChatContextProvider";

const MAX_NAME_LENGTH = 16;
export default function LobbySettings() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const expansionCheckRef = useRef<HTMLInputElement>(null);
    const amHost = TurnManager.amHost(ctx, localCtx);
    if (myEntry.id === null || myEntry.player === undefined) {
        return <p>연결이 잘못됨. 새로고침해주세요.</p>;
    }

    async function onFinishEditName(event: any) {
        let newName: string = event.target.value;
        if (newName.length <= 1) return;
        if (myEntry.player.isReady) return;
        if (newName.length > MAX_NAME_LENGTH) {
            newName = newName.substring(0, MAX_NAME_LENGTH);
        }
        const myNameRef = ReferenceManager.getPlayerFieldReference(myEntry.id, PlayerDbFields.PLAYER_name);
        myNameRef.set(newName);
        setFishName(newName);
    }


    function onClickCopy(e: any) {
        const myUrl = window.location.href;
        navigator.clipboard.writeText(myUrl);
    }

    function onChecked(e: any) {
        if (!amHost) return;
        const setttings = ctx.room.header.settings;
        setttings.expansion = !setttings.expansion;
        ReferenceManager.updateReference(DbFields.HEADER_settings, setttings);
        sendChat(ChatFormat.announcement, "", t((setttings.expansion) ?
            "_announce_expansion_on"
            : "_announce_expansion_off"));
    }

    return (
        <div className={`${classes.container} ${gc.round_border} ${gc.borderColor}`}>
            <div className={`${classes.settingsContainer} ${gc.borderBottom}`}>
                <p className={classes.nameHeader}>{t("_name")}</p>
                <textarea
                    className={`${classes.fieldType} ${classes.nameTextArea} ${myEntry.player.isReady && classes.isDisabled}`}
                    onBlur={onFinishEditName}
                    defaultValue={myEntry.player.name}
                ></textarea>
                <button className={`${classes.fieldType}`}
                        onClick={onClickCopy}>{t("_copy_link")}</button>
                {amHost && <Fragment>
                    <br/>
                    <br/>
                    <input type="checkbox" id="expansion" ref={expansionCheckRef}
                           onChange={onChecked}
                           checked={(ctx.room.header.settings.expansion)}/>
                    <label htmlFor="expansion"> {t("_check_expansion")}</label>
                    <br/>
                    <br/>
                </Fragment>
                }
                <a href={"https://gall.dcinside.com/mgallery/board/view/?id=haruhiism&no=142721"} target={"_blank"}>
                    룰 북 (새탭)</a>
                <br/>
                <a href={"https://chat.haruhi.boats/"} target={"_blank"}>중계기</a>
                <br/>
                {/*     <a href={"https://docs.google.com/forms/d/e/1FAIpQLSexSyVua158WXfLUVat-pFZOL8wLl3Tyu_Y8_ZAJ-R16ZJWOg/viewform?usp=sf_link"}
                   target={"_blank"}>설문</a>*/}
                <p>모바일 유저는 데스크탑보기모드 꼭 켜주라!</p>
            </div>
            <div className={classes.creditsContainer}>
                <p>{formatInsert(t, "_rule_three_lines")}</p>
                <p>{formatInsert(t, "_credits")}</p>
            </div>
        </div>
    );
}
