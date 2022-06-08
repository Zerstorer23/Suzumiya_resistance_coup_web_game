import classes from "./MyBoard.module.css";
import gc from "global.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import MyCardComponent from "pages/ingame/Left/MyBoard/MyCardComponent/MyCardComponent";
import CoinDisplayComponent from "pages/ingame/Left/MyBoard/CoinDisplayComponent/CoinDisplayComponent";
import {Fragment, useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {Player} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import {CursorState} from "system/context/localInfo/LocalContextProvider";
import {useTranslation} from "react-i18next";

export default function MyBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();
    const myId: string = localCtx.getVal(LocalField.Id);
    const myPlayer: Player = ctx.room.playerMap.get(myId)!;
    const myCoin = myPlayer.coins;
    const showCards =
        localCtx.getVal(LocalField.TutorialSelector) === CursorState.Idle;
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <VerticalLayout>
                <div className={classes.infoContainer}>
                    {showCards && (
                        <Fragment>
                            <p>{t("_my_cards")}</p>
                            <MyCardComponent offset={0}/>
                            <MyCardComponent offset={1}/>
                        </Fragment>
                    )}
                    {!showCards && (
                        <div className={classes.infoContainer}>{t("_tutorial_board")}</div>
                    )}
                </div>
                <CoinDisplayComponent className={classes.coinContainer} coins={myCoin}/>
            </VerticalLayout>
        </div>
    );
}
