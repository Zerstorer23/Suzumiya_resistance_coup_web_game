import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./RevealedDeckDisplay.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import RevealedDeckItem from "pages/ingame/Right/GameDeckBoard/RevealedDeckDisplay/RevealedDeckItem";
import { CardRole } from "system/cards/Card";
import { IProps } from "system/types/CommonTypes";

type Props = IProps & {};
export default function RevealedDeckDisplay(props: Props): JSX.Element {
  //TODO iterate and aggregate DEAD
  return (
    <VerticalLayout className={classes.container}>
      <RevealedDeckItem card={CardRole.Duke} />
      <RevealedDeckItem card={CardRole.Captain} />
      <RevealedDeckItem card={CardRole.Assassin} />
      <RevealedDeckItem card={CardRole.Contessa} />
      <RevealedDeckItem card={CardRole.Ambassador} />
    </VerticalLayout>
  );
}
