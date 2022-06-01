import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {ActionType, StateManager} from "system/GameStates/States";
import RoomContext from "system/context/room-context";
import {useContext} from "react";
import LocalContext, {
    LocalField,
} from "system/context/localInfo/local-context";
import {DeckManager} from "system/cards/DeckManager";
import {Card, CardRole} from "system/cards/Card";
import {GameManager} from "system/GameStates/GameManager";
import {proceedTurn} from "./Solver/Solver";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";

export default function AmbassadorBoard(): JSX.Element {
    const ctx = useContext(RoomContext);
    const playerMap = ctx.room.playerMap;
    const deck = ctx.room.game.deck;
    const localCtx = useContext(LocalContext);
    const myId: string = localCtx.getVal(LocalField.Id);
    let arr = deck.split(",");
    const myPlayer = playerMap.get(myId);
    //get 2 cards from top of the deck
    const topIndex = DeckManager.peekTopIndex(ctx, localCtx);

    let charArr = [
        arr[myPlayer!.icard],
        arr[myPlayer!.icard + 1],
        arr[topIndex],
        arr[topIndex + 1],
    ];

    const cardArr: Card[] = charArr.map((val) => {
        return DeckManager.getCardFromChar(val);
    });

    let thisIsFirstCard: boolean = true;

    function onMakeAction(action: Card) {
        if (thisIsFirstCard && arr[myPlayer!.icard] !== action.cardRole) {
            thisIsFirstCard = false;
            switch (action.cardRole) {
                case arr[myPlayer!.icard + 1]:
                    DeckManager.swap(myPlayer!.icard + 1, myPlayer!.icard, arr);
                    break;
                case arr[topIndex]:
                    DeckManager.swap(topIndex, myPlayer!.icard, arr);
                    break;
                case arr[topIndex + 1]:
                    DeckManager.swap(topIndex + 1, myPlayer!.icard, arr);
                    break;
            }
        } else if (
            !thisIsFirstCard &&
            arr[myPlayer!.icard + 1] !== action.cardRole
        ) {
            thisIsFirstCard = true;
            switch (action.cardRole) {
                case arr[topIndex]:
                    DeckManager.swap(topIndex, myPlayer!.icard + 1, arr);
                    break;
                case arr[topIndex + 1]:
                    DeckManager.swap(topIndex + 1, myPlayer!.icard + 1, arr);
                    break;
            }
            proceedTurn();
        }

        DeckManager.changeDeck(ctx, arr);
    }

    return (
        <div className={classes.container}>
            {cardArr.map((action: Card, index: number) => {
                const baseIndex = index + 1;
                const cssName = classes[`cell${baseIndex}`];
                return (
                    <BaseActionButton
                        key={index}
                        className={`${cssName}`}
                        param={action}
                        onClickButton={() => {
                            onMakeAction(action);
                        }}
                    />
                );
            })}
        </div>
    );
}
