import classes from "./MyBoard.module.css";
import gc from "global.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import MyCardComponent from "pages/ingame/Left/MyBoard/MyCardComponent/MyCardComponent";
import {Card} from "system/cards/Card";
import CoinDisplayComponent from "pages/ingame/Left/MyBoard/CoinDisplayComponent/CoinDisplayComponent";
import {Fragment, useContext} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {Player} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import {DeckManager} from "system/cards/DeckManager";
import {CursorState} from "system/context/localInfo/LocalContextProvider";
import {useTranslation} from "react-i18next";

export default function MyBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId: string = localCtx.getVal(LocalField.Id);
    const myPlayer: Player = ctx.room.playerMap.get(myId)!;
    const cardIndex = myPlayer.icard;
    const myCoin = myPlayer.coins;
    const deck = ctx.room.game.deck;
    let firstChar = deck[cardIndex];
    let secondChar = deck[cardIndex + 1];
    let charArr = [firstChar, secondChar];
    const {t} = useTranslation();
    const cardArr: Card[] = charArr.map((val) => {
        return DeckManager.getCardFromChar(val);
    });

    const showCards =
        localCtx.getVal(LocalField.TutorialSelector) === CursorState.Idle;
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <VerticalLayout>
                <div className={classes.infoContainer}>
                    {showCards && (
                        <Fragment>
                            <p>{t("_my_cards")}</p>
                            <MyCardComponent card={cardArr[0]}/>
                            <MyCardComponent card={cardArr[1]}/>
                        </Fragment>
                    )}
                    {!showCards && (
                        <div className={classes.tutorialContainer}>{t("_tutorial_board")}</div>
                    )}
                </div>
                <CoinDisplayComponent coins={myCoin}/>
            </VerticalLayout>
        </div>
    );
}
