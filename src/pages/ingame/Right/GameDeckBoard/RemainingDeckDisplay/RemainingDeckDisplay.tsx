import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./RemainingDeckDisplay.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import getImage, { Images } from "resources/Resources";
import { IProps } from "system/types/CommonTypes";
//TODO pass prop remaining
export default function RemainingDeckDisplay(): JSX.Element {
  //TODO calc remaining deck
  //Compare last living player index vs last DEAD card index
  const remaining = 3;

  return (
    <VerticalLayout className={classes.container}>
      <p className={classes.textHeader}>Remaining cards in deck</p>
      <p className={classes.textCounter}>{remaining}</p>
      <img
        className={classes.deckImg}
        src={`${getImage(Images.Asakura)}`}
        alt="deck img"
      />
    </VerticalLayout>
  );
}
