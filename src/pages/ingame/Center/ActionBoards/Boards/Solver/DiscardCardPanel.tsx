import {Fragment, useContext, useEffect, useState} from "react";
import {IProps} from "system/types/CommonTypes";
import {Card, CardRole} from "system/cards/Card";
import {DeckManager} from "system/cards/DeckManager";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {GameAction, Player, TurnState} from "system/GameStates/GameTypes";
import {GameManager} from "system/GameStates/GameManager";
import {BoardState} from "system/GameStates/States";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {solveDiscard} from "pages/ingame/Center/ActionBoards/Boards/Solver/DiscardSolver";
import {TurnManager} from "system/GameStates/TurnManager";

export type Props = IProps & {
    player: Player,
    deck: CardRole[],
    onCardSelected: (index: number) => void,
}

function MyCardsPanel(props: Props): JSX.Element {
    const myCards: CardRole[] = DeckManager.peekCards(props.deck, props.player.icard, 2);
    return (<Fragment>
        <div className={classes.header}>Choose 2 cards that you want to keep...</div>
        <div className={classes.container}>
            {myCards.map((role: CardRole, index: number) => {
                const baseIndex = index + 1;
                const cssName = classes[`cell${baseIndex}`];
                return (
                    <BaseActionButton
                        key={index}
                        className={`${cssName}`}
                        param={new Card(role)}
                        onClickButton={() => {
                            props.onCardSelected(props.player.icard + index);
                        }}
                    />
                );
            })}
        </div>
    </Fragment>);
}

export default function DiscardCardPanel(): JSX.Element {
    //Displayed on Coup Target
    //Or Assassinate Target
    //Or Challenge Loser
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const board = ctx.room.game.state.board;
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const deck = ctx.room.game.deck;

    const [jsxElem, setJSX] = useState<JSX.Element>(<Fragment/>);
    useEffect(() => {
        const e = solveDiscard(ctx, localCtx);
    }, [board]);

    function onMakeAction(index: number) {
        const removedCard = GameManager.createRemovedCard(index, myId);
        DeckManager.killCardAt(deck, index);
        ActionManager.prepareAndPushState(ctx, (newAction: GameAction, newState: TurnState) => {
            newAction.param = removedCard;
            newState.board = BoardState.DiscardingCard;
            return TransitionAction.Success;
        });
    }


    return jsxElem;
}
