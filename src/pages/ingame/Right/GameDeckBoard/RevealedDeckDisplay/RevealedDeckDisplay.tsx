import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./RevealedDeckDisplay.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import RevealedDeckItem from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/RevealedDeckItem";
import { CardRole } from "system/cards/Card";
import { Deck } from "system/cards/Deck";
import { IProps } from "system/types/CommonTypes";

type Props = IProps & { deck: string };
export default function RevealedDeckDisplay(props: Props): JSX.Element {
  //TODO iterate and aggregate DEAD
  return (
    <VerticalLayout className={classes.container}>
      <RevealedDeckItem card={CardRole.Duke} deck={new Deck()} />
      <RevealedDeckItem card={CardRole.Captain} deck={new Deck()} />
      <RevealedDeckItem card={CardRole.Assassin} deck={new Deck()} />
      <RevealedDeckItem card={CardRole.Contessa} deck={new Deck()} />
      <RevealedDeckItem card={CardRole.Ambassador} deck={new Deck()} />
    </VerticalLayout>
  );
}
