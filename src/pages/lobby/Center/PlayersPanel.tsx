import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import {PlayerMap} from "system/GameStates/GameTypes";
import {IProps} from "system/types/CommonTypes";
import {useContext, useEffect, useRef} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {setStartingRoom} from "system/GameStates/RoomGenerator";
import gc from "global.module.css";
import LocalContext from "system/context/localInfo/local-context";
import {TurnManager} from "system/GameStates/TurnManager";

export default function PlayersPanel(props: IProps) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const amHost = TurnManager.amHost(ctx, localCtx);

    const onClickStart = () => {
        if (!amHost) return;
        const room = ctx.room;
        setStartingRoom(room);
    };
    const startBtnRef = useRef<HTMLButtonElement>(null);

    ///====Key listener====///
    useEffect(() => {
        document.addEventListener('keydown', onKeyDown);
        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    function onKeyDown(event: any) {
        // console.log(`Key: ${event.key} with keycode ${event.keyCode} has been pressed`);
        if (event.keyCode === 32) {
            onClickStart();
        }
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
                start
            </button>
        </VerticalLayout>
    );
}
