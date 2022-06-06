import classes from "./PopUp.module.css";
import {Fragment, useContext} from "react";
import ReactDOM from "react-dom";
import {IProps} from "system/types/CommonTypes";
import {Player} from "system/GameStates/GameTypes";
import {CardPool} from "system/cards/CardPool";
import {CardRole} from "system/cards/Card";
import RoomContext from "system/context/roomInfo/room-context";

function Backdrop(props: IProps) {
    return <div className={classes.backdrop}
        //            onClick={props.onClickBackdrop}
    />;
}

/*function ModalOverlay(props: IProps) {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>{props.children}</div>

        </div>
    );
}*/

type GOprops = IProps & {
    player?: Player,
    card1?: CardRole,
    card2?: CardRole,
}

function GameOverWindow(props: GOprops) {
    return (
        <div className={classes.modal}>
            <div className={classes.content}>
                <p>Game Winner: {props.player?.name}</p>
                <p>{`Used cards:${CardPool.getCard(props.card1!)} , ${CardPool.getCard(props.card1!)}`}</p>
                <p>Return to lobby in ....</p>
            </div>
        </div>
    );
}


export default function GameOverPopUp() {
    const home = document.getElementById("overlays") as HTMLElement;
    const ctx = useContext(RoomContext);
    //TODO find winner, and his card roles.
    return (
        <Fragment>
            {ReactDOM.createPortal(<Backdrop/>, home)}
            {ReactDOM.createPortal(<GameOverWindow/>, home)}
            {/*{ReactDOM.createPortal(<ModalOverlay>{props.children}</ModalOverlay>, home)}*/}
        </Fragment>
    );
}
