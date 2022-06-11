import {IProps} from "system/types/CommonTypes";
import {Fragment, useContext, useEffect, useState} from "react";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField} from "system/context/localInfo/local-context";
import {useHistory} from "react-router-dom";
import {Navigation} from "App";
import {TurnManager} from "system/GameStates/TurnManager";
import {DbFields, ReferenceManager} from "system/Database/ReferenceManager";

export default function Sanitizer(props: IProps) {
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    const myId = localCtx.getVal(LocalField.Id);
    const turns = ctx.room.game.state.turn;
    const amHost = TurnManager.amHost(ctx, localCtx);
    const myEntry = TurnManager.getMyInfo(ctx, localCtx);

    function checkSanity(): boolean {
        if (!amHost) return false;
        ReferenceManager.updateReference(
            DbFields.GAME_action,
            ctx.room.game.action
        );
        ReferenceManager.updateReference(
            DbFields.GAME_state,
            ctx.room.game.state
        );
        ReferenceManager.updateReference(DbFields.HEADER_hostId, myEntry.id);
        return true;
    }

    useEffect(() => {
        checkSanity();
    }, [ctx.room.playerMap.size, amHost]);

    const [valid, setValid] = useState(false);
    useEffect(() => {
        if (myId === null) {
            setValid(false);
            history.replace(Navigation.Loading);
            return;
        }
        if (!ctx.room.playerMap.has(myId)) {
            setValid(false);
            localCtx.setVal(LocalField.Id, null);
            history.replace(Navigation.Loading);
            return;
        }
        setValid(true);
        if (turns >= 0) {
            history.replace(Navigation.InGame);
            return;
        }
    }, [turns, myId]);
    return <Fragment>
        {(valid) &&
            props.children
        }
    </Fragment>;
}