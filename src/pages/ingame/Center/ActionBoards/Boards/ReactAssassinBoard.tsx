import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {Fragment, useContext} from "react";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import RoomContext from "system/context/room-context";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {DeckManager} from "system/cards/DeckManager";
import {Card, CardRole} from "system/cards/Card";
import {TurnManager} from "system/GameStates/TurnManager";

const baseActions = [
    ActionType.IsALie,
    ActionType.ContessaBlocksAssassination,
];
export default function ReactAssassinBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const deck = ctx.room.game.deck;
    const myCards = DeckManager.peekCards(deck, myPlayer.icard, 2);

    function onSelectedCard(index: number) {
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            newState.board = BoardState.AssissinateAccepted;
            newAction.param = index;
            return TransitionAction.Success;
        });
    }

    function onMakeAction(action: ActionType) {
        if (action === ActionType.IsALie) {
            ActionManager.pushIsALieState(ctx, myId);
            return;
        }
        //Contessa Action
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
            newState.board = BoardState.AssassinBlocked;
            return TransitionAction.Success;
        });
        //TODO WHen Accept assassin show Doscard Panel together

    }

    return (
        <Fragment>
            <h1>Tsukomi</h1>
            <div className={classes.halfContainer}>
                {baseActions.map((action: ActionType, index: number) => {
                    const baseIndex = index + 1;
                    const cssName = classes[`cell${baseIndex}`];
                    return (
                        <BaseActionButton
                            key={index}
                            className={`${cssName}`}
                            param={new ActionInfo(action)}
                            onClickButton={() => {
                                onMakeAction(action);
                            }}
                        />
                    );
                })}
            </div>
            <h1>Yarikomi</h1>
            <div className={classes.halfContainer}>
                {myCards.map((role: CardRole, index: number) => {
                    const baseIndex = index + 1;
                    const cssName = classes[`cell${baseIndex}`];
                    return (
                        <BaseActionButton
                            key={index}
                            className={`${cssName}`}
                            param={new Card(role)}
                            onClickButton={() => {
                                onSelectedCard(myPlayer.icard + index);
                            }}/>
                    );
                })}
            </div>
        </Fragment>
    );
}
