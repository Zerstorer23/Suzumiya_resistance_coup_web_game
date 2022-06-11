import {ActionType} from "system/GameStates/States";
import {Fragment, useContext} from "react";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard/BaseBoard.module.css";
import BaseActionButton from "pages/ingame/Center/ActionBoards/Boards/ActionButtons/BaseActionButton";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {PlayerMap} from "system/GameStates/GameTypes";
import MiniPlayerItem from "pages/ingame/Center/ActionBoards/Boards/PlayerItem/MiniPlayerItem";
import {useTranslation} from "react-i18next";
import {IProps} from "system/types/CommonTypes";
import RoomContext from "system/context/roomInfo/room-context";

type AProps = IProps & {
    actions: ActionType[];
    onMakeAction: (action: ActionType) => void;
}

export function ActionPanel(props: AProps): JSX.Element {
    const {t} = useTranslation();
    return <Fragment>
        <div className={classes.header}>{t("_do_my_action")}</div>
        <div className={classes.container}>
            {props.actions.map((action: ActionType, index: number) => {
                return (
                    <BaseActionButton
                        key={index}
                        index={index}
                        isCardRole={false}
                        param={action}
                        onClickButton={() => {
                            props.onMakeAction(action);
                        }}
                    />
                );
            })}
        </div>
    </Fragment>;

}

type TProps = IProps & { onPlayerSelected: (id: string) => void; }

export function TargetPlayerPanel(props: TProps): JSX.Element {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const {t} = useTranslation();
    const playerList: string[] = ctx.room.playerList;
    const playerMap: PlayerMap = ctx.room.playerMap;
    const myId = localCtx.getVal(LocalField.Id);
    return <Fragment>
        <div className={classes.header}>{t("_do_my_action")}</div>
        <div className={classes.playersContainer}>
            {playerList.map((playerId, index) => {
                if (playerId === myId) return <Fragment key={playerId}/>;
                return <MiniPlayerItem
                    key={playerId}
                    index={index}
                    playerId={playerId}
                    player={playerMap.get(playerId)!}
                    onSelect={props.onPlayerSelected}
                />;
            })}
        </div>
    </Fragment>;
}
