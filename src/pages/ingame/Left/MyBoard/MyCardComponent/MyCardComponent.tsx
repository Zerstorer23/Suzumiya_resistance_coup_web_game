import classes from "./MyCardComponent.module.css";
import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {useTranslation} from "react-i18next";
import {useContext} from "react";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import gc from "global.module.css";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";
import {Card} from "system/cards/Card";

type Props = IProps & {
    offset: number
};


export default function MyCardComponent(props: Props): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);
    const card = (ctx.room.game.deck[myEntry.player.icard + props.offset]);
    const {t} = useTranslation();
    const isDead = Card.isDead(card);
    const anim = useAnimFocus(card, AnimType.FadeIn);

    return (
        <HorizontalLayout className={classes.container}>
            <img
                className={`${classes.characterIcon} ${anim}`}
                src={`${Card.getImage(card)}`}
                alt="card"
            />
            {isDead ? (
                <div className={`${classes.descPanel} ${gc.borderLeft}`}>
                    <p className={classes.deadPanel}>{t("_dead")}</p>
                </div>
            ) : (
                <div className={`${classes.descPanel} ${gc.borderLeft}`}>
                    <p>{Card.getDesc(t, card)}</p>
                </div>
            )}
        </HorizontalLayout>
    );
}
