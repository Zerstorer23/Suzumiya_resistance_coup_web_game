import classes from "./MyCardComponent.module.css";
import {IProps} from "system/types/CommonTypes";
import {Card} from "system/cards/Card";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {useTranslation} from "react-i18next";

type Props = IProps & { card: Card };

export default function MyCardComponent(props: Props): JSX.Element {
    const card = props.card;
    const isDead = card.isDead();
    const {t} = useTranslation();
    return (
        <HorizontalLayout className={classes.container}>
            <img
                className={`${classes.characterIcon}`}
                src={`${card.getImage()}`}
                alt="card"
            />
            {isDead ? (
                <div className={`${classes.descPanel} `}>
                    <p className={classes.deadPanel}>{t("_dead")}</p>
                </div>
            ) : (
                <div className={`${classes.descPanel} `}>
                    <p>{card.getDesc(t)}</p>
                </div>
            )}
        </HorizontalLayout>
    );
}
