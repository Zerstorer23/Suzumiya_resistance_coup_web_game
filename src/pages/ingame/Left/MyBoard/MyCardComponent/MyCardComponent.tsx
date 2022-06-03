import classes from "./MyCardComponent.module.css";
import {IProps} from "system/types/CommonTypes";
import {Card} from "system/cards/Card";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";

type Props = IProps & { card: Card };

export default function MyCardComponent(props: Props): JSX.Element {
    const card = props.card;
    const isDead = card.isDead();
    return (
        <HorizontalLayout className={classes.container}>
            <img
                className={`${classes.characterIcon}`}
                src={`${card.getImage()}`}
                alt="card"
            />
            {isDead ? (
                <div className={`${classes.descPanel} `}>
                    <p className={classes.deadPanel}>DEAD</p>
                </div>
            ) : (
                <div className={`${classes.descPanel} `}>
                    <p>{card.getDesc()}</p>
                </div>
            )}
        </HorizontalLayout>
    );
}
