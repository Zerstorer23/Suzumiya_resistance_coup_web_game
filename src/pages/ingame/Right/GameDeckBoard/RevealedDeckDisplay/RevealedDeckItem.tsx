import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./RevealedDeckDisplay.module.css";
import getImage, { Images } from "resources/Resources";
import { IProps } from "App";
import { CardRole } from "system/cards/Card";
import { Deck } from "system/cards/Deck";

type Prop = IProps & { card: CardRole; deck: Deck };
export default function RevealedDeckItem(props: Prop): JSX.Element {
  const total = 3;
  var count = 1;
  var imgRes = Images.Asakura;

  return (
    <HorizontalLayout className={classes.itemContainer}>
      <img className={classes.itemImg} alt="card" src={`${getImage(imgRes)}`} />
      <p className={classes.itemDesc}>{`${"Duke"} ${count} / ${total}`}</p>
    </HorizontalLayout>
  );
}
