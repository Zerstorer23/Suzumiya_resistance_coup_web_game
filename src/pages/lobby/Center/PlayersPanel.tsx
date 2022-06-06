import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import {PlayerMap} from "system/GameStates/GameTypes";
import {useContext, useRef} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {setStartingRoom} from "system/GameStates/RoomGenerator";
import gc from "global.module.css";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";
import useKeyListener, {KeyCode} from "system/hooks/useKeyListener";
import {InputCursor} from "system/context/localInfo/LocalContextProvider";

export default function PlayersPanel() {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const amHost = TurnManager.amHost(ctx, localCtx);
    const startBtnRef = useRef<HTMLButtonElement>(null);

    useKeyListener([KeyCode.Space], onKey);

    function onKey(keyCode: KeyCode) {
        console.log("Key " + keyCode + " s" + KeyCode.Space);
        if (localCtx.getVal(LocalField.InputFocus) === InputCursor.Chat) return;
        if (keyCode === KeyCode.Space) {
            onClickStart();
        }
    }

    function onClickStart() {
        if (!amHost) return;
        const room = ctx.room;
        setStartingRoom(room);
    }


    const playerMap: PlayerMap = ctx.room.playerMap;
    const currPlayer = playerMap.size;

    const playerList = ctx.room.playerList;
    return (
        <VerticalLayout className={`${gc.round_border} ${classes.container} `}>
            <div className={classes.headerContainer}>
                <p className={classes.headerTitle}>Hamang No.6</p>
                <p className={classes.headerPlayerNum}>{`${currPlayer} connected`}</p>
            </div>
            <VerticalLayout className={classes.list}>{
                playerList.map((id, index, array) => {
                    return <PlayerListItem key={id} player={playerMap.get(id)!}
                                           isHost={id === ctx.room.header.hostId}/>;
                })
            }</VerticalLayout>
            <button ref={startBtnRef} className={classes.buttonStart} onClick={onClickStart}>
                {(amHost) ? "start" : "Waiting for host to start"}
            </button>
        </VerticalLayout>
    );
}
