import VerticalLayout from "pages/components/ui/VerticalLayout";
import gc from "global.module.css";
import classes from "./MainTableBoard.module.css";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {useTranslation} from "react-i18next";
import PierItem from "pages/ingame/Center/MainTableBoard/TableItem/Pier/PierItem";
import TargetItem from "pages/ingame/Center/MainTableBoard/TableItem/Target/TargetItem";
import ChallengerItem from "pages/ingame/Center/MainTableBoard/TableItem/Challenger/ChallengerItem";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import animClasses from "animation.module.css";
import {useContext, useEffect} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {StateManager} from "system/GameStates/States";
import {AudioFile, audioPool} from "resources/AudioManager";

export default function MainTableBoard(): JSX.Element {
    const {t} = useTranslation();
    const ctx = useContext(RoomContext);
    const board = ctx.room.game.state.board;
    useEffect(() => {
        if (StateManager.isChallenged(board)) {
            audioPool.play(AudioFile.Objection);
        }
    }, [board]);

    return (
        <div className={`${gc.round_border} ${gc.borderColor} ${classes.container}`}>
            <VerticalLayout>
                <p className={classes.timer}>
                    <MyTimer/>{t("_seconds_remaining")}
                </p>
                <PierItem className={`${classes.pierContainer} ${animClasses.slideDown} ${gc.borderBottom}`}/>
                <HorizontalLayout className={classes.horizontalContainer}>
                    <TargetItem className={`${classes.targetContainer} ${gc.borderRight} ${animClasses.slideUp}`}/>
                    <ChallengerItem className={`${classes.challengerContainer} ${animClasses.slideUp}`}/>
                </HorizontalLayout>
            </VerticalLayout>
        </div>
    );
}
