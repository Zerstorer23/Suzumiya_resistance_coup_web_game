import {Fragment, useContext} from "react";
import {ChallengeSolvingState, IProps} from "system/types/CommonTypes";
import {Card, CardRole} from "system/cards/Card";
import RoomContext from "system/context/room-context";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import {DeckManager} from "system/cards/DeckManager";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import {BoardState} from "system/GameStates/States";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {TransitionAction} from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import {ChallengedStateInfo, GameAction, TurnState} from "system/GameStates/GameTypes";

export type Props = IProps & {
    playerId: string,
    cards: CardRole[],
    onCardSelected: (index: number) => void,
}

export default function DiscardCardPanel(props: IProps) {
    //Displayed on Coup Target
    //Or Assassinate Target
    //Or Challenge Loser
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const deck: CardRole[] = ctx.room.game.deck;
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const myCards: CardRole[] = DeckManager.peekCards(deck, myPlayer.icard, 2);


    function onMakeAction(index: number) {
        //If coup, change state
        //If Assassinate Accept, change state
        ActionManager.prepareAndPushState(ctx, (newAction: GameAction, newState: TurnState) => {
            const originalCard = deck[index];
            DeckManager.killCardAt(deck, index);
            const board = ctx.room.game.state.board;
            switch (board) {
                case BoardState.CalledCoup:
                    newState.board = BoardState.CoupAccepted;
                    //TODO fill action param with CardRole
                    newAction.param = originalCard;
                    return TransitionAction.Success;
                case BoardState.DukeBlocksChallenged:
                case BoardState.StealBlockChallenged:
                case BoardState.ContessaChallenged:
                case BoardState.GetThreeChallenged:
                case BoardState.AmbassadorChallenged:
                case BoardState.StealChallenged:
                case BoardState.AssassinateChallenged:
                    //TODO update action state
                    const challengeInfo = newAction.param as ChallengedStateInfo;
                    challengeInfo.selected = originalCard;
                    challengeInfo.state = ChallengeSolvingState.Solved;
                    newAction.param = challengeInfo;
                    return TransitionAction.Success;
            }
            return TransitionAction.Abort;
        });
    }

    return <Fragment>
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
                            onMakeAction(myPlayer.icard + index);
                        }}
                    />
                );
            })}
        </div>
    </Fragment>;
}
