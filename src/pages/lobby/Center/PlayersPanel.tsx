import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import {PlayerMap} from "system/GameStates/GameTypes";
import {IProps} from "system/types/CommonTypes";
import {useContext} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import {setStartingRoom} from "system/GameStates/RoomGenerator";


export default function PlayersPanel(props: IProps) {
    const ctx = useContext(RoomContext);
    const onClickStart = () => {
        const room = ctx.room;
        setStartingRoom(room);
    };
    const elemList: JSX.Element[] = [];
    const playerMap: PlayerMap = ctx.room.playerMap;
    const currPlayer = playerMap.size;
    playerMap.forEach((player, key) => {
        const elem = <PlayerListItem key={key} player={player}/>;
        elemList.push(elem);
    });
    return (
        <VerticalLayout className={`${classes.container} `}>
            <div className={classes.headerContainer}>
                <p className={classes.headerTitle}>Hamang No.6</p>
                <p className={classes.headerPlayerNum}>{`${currPlayer} connected`}</p>
            </div>
            <VerticalLayout className={classes.list}>{elemList}</VerticalLayout>
            <button className={classes.buttonStart} onClick={onClickStart}>
                start
            </button>
        </VerticalLayout>
    );
}
