import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext, useEffect, useState} from "react";
import LocalContext from "system/context/localInfo/local-context";
import {DeckManager} from "system/cards/DeckManager";
import {Card, CardRole} from "system/cards/Card";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {TurnManager} from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {useShortcutEffect} from "system/hooks/useShortcut";
import {useTranslation} from "react-i18next";

export default function AmbassadorBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const deck: CardRole[] = ctx.room.game.deck;
    const {t} = useTranslation();
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    //get 2 cards from top of the deck
    const topIndex = DeckManager.peekTopIndex(ctx);
    const [firstCardPicked, setFirstCardPicked] = useState<number>(-1);
    const [cardArr, setCardArr] = useState<Card[]>(
        [
            ...DeckManager.peekCards(deck, myPlayer.icard, 2),
            ...DeckManager.peekCards(deck, topIndex, 2),
        ].map((val) => {
            return DeckManager.getCardFromChar(val);
        })
    );
    const keyInfo = useShortcutEffect(cardArr.length);
    useEffect(() => {
        const idx = keyInfo.index;
        //TODO
        if (idx !== -1) onMakeAction(idx);
    }, [keyInfo]);

    /**************************************************************
     * Handle the case where deck only has 0 ~ 2 cards available  *
     **************************************************************/

    //TODO: Dead Card
    useEffect(() => {
        if (DeckManager.playerAliveCardNum(deck, myPlayer.icard) === 1) {
            console.log("one card alive");
            //swap
            if (firstCardPicked === 1) {
                DeckManager.swap(myPlayer!.icard + 1, myPlayer!.icard, deck);
            } else if (firstCardPicked === 2) {
                DeckManager.swap(topIndex, myPlayer!.icard, deck);
            } else if (firstCardPicked === 3) {
                DeckManager.swap(topIndex + 1, myPlayer!.icard, deck);
            }
            ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
                DeckManager.pushDeck(ctx, deck);
                return TransitionAction.EndTurn;
            });
        }
    }, [firstCardPicked]);

    const [count, setCount] = useState<number>(0);
    const [secondCardPicked, setSecondCardPicked] = useState<number>(-1);

    //test
    useEffect(() => {
        if (count < 2) return;
        if (secondCardPicked === firstCardPicked) return;
        console.log("swapping");
        if (firstCardPicked === 1) {
            DeckManager.swap(myPlayer!.icard + 1, myPlayer!.icard, deck);
        } else if (firstCardPicked === 2) {
            DeckManager.swap(topIndex, myPlayer!.icard, deck);
            if (secondCardPicked === 0) {
                DeckManager.swap(topIndex, myPlayer!.icard + 1, deck);
            }
        } else if (firstCardPicked === 3) {
            DeckManager.swap(topIndex + 1, myPlayer!.icard, deck);
            if (secondCardPicked === 0) {
                DeckManager.swap(topIndex + 1, myPlayer!.icard + 1, deck);
            }
        }

        switch (secondCardPicked) {
            case 2:
                DeckManager.swap(topIndex, myPlayer!.icard + 1, deck);
                break;
            case 3:
                DeckManager.swap(topIndex + 1, myPlayer!.icard + 1, deck);
                break;
        }
        DeckManager.pushDeck(ctx, deck);
        console.log("ending turn");
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            return TransitionAction.EndTurn;
        });
    }, [firstCardPicked, secondCardPicked]);

    const onMakeAction = (index: number) => {
        console.log("index: ", index);
        console.log("count: ", count);
        if (count === 0) setFirstCardPicked(index);
        if (count !== 0) setSecondCardPicked(index);
        setCount((count: number) => {
            return count + 1;
        });
    };

    //ADD SELCETED CSS STYLE
    return (
        <Fragment>
            <div className={classes.header}>
                Choose 2 cards that you want to keep...
            </div>
            <p className={classes.centerText}>{t("_my_card_pool")}</p>
            <div className={classes.quarterContainer}>
                {cardArr.map((action: Card, index: number) => {
                    if (firstCardPicked === index) {
                        return <Fragment/>;
                    }
                    if (index > 1) {
                        return <Fragment key={index}/>;
                    }

                    return (
                        <BaseActionButton
                            key={index}
                            index={index}
                            param={action}
                            onClickButton={() => {
                                onMakeAction(index);
                            }}
                        />
                    );
                })}
            </div>
            <p className={classes.centerText}>{t("_deck_card_pool")}</p>
            <div className={classes.singleContainer}>
                {cardArr.map((action: Card, index: number) => {
                    if (firstCardPicked === index) {
                        return <Fragment/>;
                    }
                    if (index < 2) {
                        return <Fragment key={index}/>;
                    }
                    return (
                        <BaseActionButton
                            key={index}
                            index={index}
                            cssIndex={index - 1}
                            param={action}
                            onClickButton={() => {
                                onMakeAction(index);
                            }}
                        />
                    );
                })}
            </div>
        </Fragment>
    );
}
