import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import { Fragment, useContext, useEffect, useState } from "react";
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

  const [firstCardPicked, setFirstCardPicked] = useState<number>(-1);
  //TODO: Dead Card
  useEffect(() => {
    if (DeckManager.playerCardNum(deck, myPlayer.icard) === 1) {
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

  function onMakeAction(index: number) {
    if (firstCardPicked === -1) {
      setFirstCardPicked(index);
    } else if (firstCardPicked !== -1) {
      if (firstCardPicked === 1) {
        DeckManager.swap(myPlayer!.icard + 1, myPlayer!.icard, deck);
      } else if (firstCardPicked === 2) {
        DeckManager.swap(topIndex, myPlayer!.icard, deck);
        if (index === 0) {
          DeckManager.swap(topIndex, myPlayer!.icard + 1, deck);
        }
      } else if (firstCardPicked === 3) {
        DeckManager.swap(topIndex + 1, myPlayer!.icard, deck);
        if (index === 0) {
          DeckManager.swap(topIndex + 1, myPlayer!.icard + 1, deck);
        }
      }

      switch (index) {
        case 2:
          DeckManager.swap(topIndex, myPlayer!.icard + 1, deck);
          break;
        case 3:
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
      <p>mine</p>
      <div className={classes.quarterContainer}>
        {cardArr.map((action: Card, index: number) => {
          console.log(index);
          if (firstCardPicked === index) {
            return <Fragment />;
          }
          if (index > 1) {
            return <Fragment key={index} />;
          }

          const baseIndex = index + 1;
          const cssName = classes[`cell${baseIndex}`];
          return (
            <BaseActionButton
              key={index}
              className={`${cssName}`}
              param={action}
              onClickButton={() => {
                onMakeAction(index);
              }}
            />
          );
        })}
      </div>
      <p>deck</p>

      <div className={classes.quarterContainer}>
        {cardArr.map((action: Card, index: number) => {
          if (firstCardPicked === index) {
            return <Fragment />;
          }
          if (index < 2) {
            return <Fragment key={index} />;
          }
          const baseIndex = index - 1;
          const cssName = classes[`cell${baseIndex}`];
          return (
            <BaseActionButton
              key={index}
              className={`${cssName}`}
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
