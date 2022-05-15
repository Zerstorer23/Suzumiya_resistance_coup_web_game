import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./RemainingDeckDisplay.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import getImage, { Images } from "resources/Resources";

export default function RemainingDeckDisplay(): JSX.Element {
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
