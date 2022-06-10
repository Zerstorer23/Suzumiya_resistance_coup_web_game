import ImagePage from "pages/components/ui/ImagePage/ImagePage";
import {Images} from "resources/Resources";
import {useContext, useEffect} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {Navigation} from "App";
import {useHistory} from "react-router-dom";
import classes from "pages/lobby/Lobby.module.css";
import gc from "global.module.css";

export default function LoadingPage() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const turns = ctx.room.game.state.turn;
    useEffect(() => {
        if (myId === null || turns === undefined) return;
        if (turns >= 0) {
            history.replace(Navigation.InGame);
        } else {
            history.replace(Navigation.Lobby);
        }
    }, [turns, myId]);

    return <div className={`${classes.container} ${gc.panelBackground}`}>
        <ImagePage imgSrc={Images.LoadingImg} titleKey={"_loading"}/>;

    </div>
}