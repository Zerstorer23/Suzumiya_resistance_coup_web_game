import classes from "./MyBoard.module.css";
import gc from "global.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import MyCardComponent from "pages/ingame/Left/MyBoard/MyCardComponent/MyCardComponent";
import CoinDisplayComponent from "pages/ingame/Left/MyBoard/CoinDisplayComponent/CoinDisplayComponent";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {Player} from "system/GameStates/GameTypes";
import RoomContext from "system/context/roomInfo/room-context";
import {CursorState} from "system/context/localInfo/LocalContextProvider";
import {useTranslation} from "react-i18next";
import getImage, {Images} from "resources/Resources";
import {formatInsert} from "lang/i18nHelper";
import {TurnManager} from "system/GameStates/TurnManager";
import {BoardState} from "system/GameStates/States";
import animClasses from "animation.module.css";

export default function MyBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [showRuleCard, setShow] = useState(false);
    useEffect(() => {
        if (!isMyTurn || ctx.room.game.state.board !== BoardState.ChoosingBaseAction) {
            localCtx.setVal(LocalField.TutorialSelector, CursorState.Idle);
        }
    }, [ctx.room.game.state]);
    const {t} = useTranslation();
    const myId: string = localCtx.getVal(LocalField.Id);
    const myPlayer: Player | undefined = ctx.room.playerMap.get(myId);
    if (myPlayer === undefined) return <Fragment/>;
    const myCoin = myPlayer.coins;
    const tutorialKey = localCtx.getVal(LocalField.TutorialSelector);
    const showCards = tutorialKey === CursorState.Idle;
    const isMyTurn = TurnManager.isMyTurn(ctx, localCtx);

    function onMouseOver(e: any) {
        setShow(true);
    }

    function onMouseOut(e: any) {
        setShow(false);
    }

    return (
        <div className={`${gc.round_border} ${gc.borderColor} ${classes.container}`}>
            {showRuleCard && <img className={`${classes.ruleCard} ${animClasses.fadeIn}`} alt={"cardInfo"}
                                  src={`${getImage(Images.RuleCard)}`}/>}
            <VerticalLayout>
                <div className={classes.infoContainer}>
                    <div className={`${classes.cardsContiner} ${(showCards) ? animClasses.show : animClasses.gone}`}>
                        <div className={classes.headerContainer}>
                            <p className={classes.header}>{t("_my_cards")}</p>
                            <button className={classes.ruleHelper}
                                    onMouseOver={onMouseOver}
                                    onMouseOut={onMouseOut}>
                                {t("_rules")}
                            </button>
                        </div>
                        <MyCardComponent offset={0}/>
                        <MyCardComponent offset={1}/>
                    </div>
                    {!showCards &&
                        <div className={classes.infoContainer}>{formatInsert(t, tutorialKey)}</div>
                    }
                </div>
                <CoinDisplayComponent className={classes.coinContainer} coins={myCoin}/>
            </VerticalLayout>
        </div>
    );
}
