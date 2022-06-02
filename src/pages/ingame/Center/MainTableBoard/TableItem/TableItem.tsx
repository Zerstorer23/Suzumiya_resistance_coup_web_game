import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import getImage, {Images} from "resources/Resources";
import classes from "./TableItem.module.css";
import LocalContext from "system/context/localInfo/local-context";
import RoomContext from "system/context/roomInfo/room-context";
import {Fragment, useContext} from "react";
import {Player} from "system/GameStates/GameTypes";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {StateManager} from "system/GameStates/States";
import {TurnManager} from "system/GameStates/TurnManager";

type Props = {
    isPier: boolean;
} & IProps;
export default function TableItem(props: Props) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const lastChar = getImage(Images.Haruhi);
    const [pier, target, challenger] = TurnManager.getShareholders(ctx);
    console.log("Load table item");
    const sortedList = ctx.room.playerList;
    console.log(sortedList);
    console.log("turn " + ctx.room.game.state.turn);
    console.log(ctx.room.playerMap);
    let player: Player = ctx.room.playerMap.get(sortedList[ctx.room.game.state.turn])!;
    console.log("Player found ? ");
    console.log(player);
    const hasClient = target !== null || challenger !== null;
    if (!props.isPier && !hasClient) {
        return <Fragment/>;
    }
    const stateElem: JSX.Element = StateManager.inferStateInfo(
        ctx,
        localCtx,
        props.isPier
    );
    if (!props.isPier) {
    }

    return (
        <HorizontalLayout className={`${props.className} ${classes.container}`}>
            <div className={classes.profileContainer}>
                <img
                    src={`${lastChar}`}
                    alt="lastchar"
                    className={classes.imgLastUsed}
                />
                <p className={classes.textLastClaim}>Last claim: Spy</p>
                <p className={classes.playerName}>{player.name}</p>
            </div>
            <div className={classes.actionContainer}>
                <p className={classes.textMainAction}>{stateElem}</p>
                {props.isPier && (
                    <p className={classes.textSideAction}>
                        <MyTimer/> seconds remaining...
                    </p>
                )}
            </div>
        </HorizontalLayout>
    );
}
