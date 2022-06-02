import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import { Fragment, useContext, useState } from "react";
import LocalContext from "system/context/localInfo/local-context";
import { DeckManager } from "system/cards/DeckManager";
import { Card, CardRole } from "system/cards/Card";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import { TurnManager } from "system/GameStates/TurnManager";
import * as ActionManager from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";
import { TransitionAction } from "pages/ingame/Center/ActionBoards/StateManagers/TransitionManager";

export default function AmbassadorBoard(): JSX.Element {
  const ctx = useContext(RoomContext);
  const playerMap = ctx.room.playerMap;
  const deck: CardRole[] = ctx.room.game.deck;
  const localCtx = useContext(LocalContext);
  const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
  //get 2 cards from top of the deck
  const topIndex = DeckManager.peekTopIndex(ctx);

  /**************************************************************
   * Handle the case where deck only has 0 ~ 2 cards available  *
   **************************************************************/
  let charArr = [
    ...DeckManager.peekCards(deck, myPlayer.icard, 2),
    ...DeckManager.peekCards(deck, topIndex, 2),
  ];

  const cardArr: Card[] = charArr.map((val) => {
    return DeckManager.getCardFromChar(val);
  });

  const [firstCardPicked, setFirstCardPicked] = useState<boolean>(false);

  //TODO: Player with 1 card can only coose 1 card
  /***
   * How the swap works
   * prompt max 4 choices
   * user can pick max 2
   * First click
   *      -Put the selected card in icard 0
   *          -Original icard goes to selected.
   *       Second Click
   *         -    Same thing
   *        END STATE. END TURN.
   *        (push the deck)
   * @param action
   */
  function onMakeAction(action: Card) {
    if (!firstCardPicked) {
      setFirstCardPicked(true);
      switch (action.cardRole) {
        case deck[myPlayer!.icard + 1]:
          DeckManager.swap(myPlayer!.icard + 1, myPlayer!.icard, deck);
          break;
        case deck[topIndex]:
          DeckManager.swap(topIndex, myPlayer!.icard, deck);
          break;
        case deck[topIndex + 1]:
          DeckManager.swap(topIndex + 1, myPlayer!.icard, deck);
          break;
      }
      DeckManager.pushDeck(ctx, deck);
      console.log(DeckManager.playerCardNum(deck, myPlayer.icard));
      if (DeckManager.playerCardNum(deck, myPlayer.icard) === 1) {
        ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
          return TransitionAction.EndTurn;
        });
      }
    } else if (firstCardPicked) {
      setFirstCardPicked(false);
      switch (action.cardRole) {
        case deck[topIndex]:
          DeckManager.swap(topIndex, myPlayer!.icard + 1, deck);
          break;
        case deck[topIndex + 1]:
          DeckManager.swap(topIndex + 1, myPlayer!.icard + 1, deck);
          break;
      }
      DeckManager.pushDeck(ctx, deck);
      ActionManager.prepareAndPushState(ctx, (newAction, newState) => {
        return TransitionAction.EndTurn;
      });
    }
  }

  //ADD SELCETED CSS STYLE
  return (
    <Fragment>
      <div className={classes.header}>
        Choose 2 cards that you want to keep...
      </div>
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
    </Fragment>
  );
}
