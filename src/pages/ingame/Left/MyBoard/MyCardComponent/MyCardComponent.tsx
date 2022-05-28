import classes from "./MyCardComponent.module.css";
import gc from "global.module.css";
import { IProps } from "system/types/CommonTypes";
import { Card } from "system/cards/Card";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
type Props = IProps & { card: Card };

export default function MyCardComponent(props: Props): JSX.Element {
  const card = props.card;
  const isAlive = card.isDead;
  return (
    <HorizontalLayout className={classes.container}>
      <img
        className={`${classes.characterIcon}`}
        src={`${card.getImage()}`}
        alt="card"
      />
      {isAlive ? (
        <div className={`${classes.descPanel} `}>
          <p>{card.getDesc()}</p>
        </div>
      ) : (
        <div className={`${classes.deadPanel} `}>
          <p>is Dead!!</p>
        </div>
      )}
    </HorizontalLayout>
  );
}
