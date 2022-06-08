import classes from "./MyCardComponent.module.css";
import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import {useTranslation} from "react-i18next";
import {useContext} from "react";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import RoomContext from "system/context/roomInfo/room-context";
import {CardPool} from "system/cards/CardPool";
import useAnimFocus, {AnimType} from "system/hooks/useAnimFocus";

type Props = IProps & {
    offset: number
};


export default function MyCardComponent(props: Props): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const [myId, myPlayer] = TurnManager.getMyInfo(ctx, localCtx);
    const card = CardPool.getCard(ctx.room.game.deck[myPlayer.icard + props.offset]);
    const {t} = useTranslation();
    const isDead = card.isDead();
    /*
        const cardRef = usePrevious<CardRole>(card.cardRole);
        const [anim, setAnim] = useState("");
        useEffect(() => {
            console.log("Card changed " + card.cardRole + " /prev " + cardRef);
            if (cardRef === card.cardRole) return;
            setAnim(classes.invisible);
            setTimeout(() => {
                setAnim(classes.fadeIn);
            }, 100);
        }, [card.cardRole]);*/
    const anim = useAnimFocus(card.cardRole, AnimType.FadeIn);

    return (
        <HorizontalLayout className={classes.container}>
            <img
                className={`${classes.characterIcon} ${anim}`}
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
