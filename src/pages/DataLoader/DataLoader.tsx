import {useHistory} from "react-router-dom";
import {Fragment, useContext, useEffect, useState} from "react";
import RoomContext, {UpdateType} from "system/context/roomInfo/room-context";
import {initialiseRoom, joinLobby, loadRoom, ReferenceManager, registerListeners,} from "system/Database/RoomDatabase";
import {
    IProps,
    LISTEN_CHILD_ADDED,
    LISTEN_CHILD_CHANGED,
    LISTEN_CHILD_REMOVED,
    LISTEN_VALUE,
    Listeners,
    ListenerTypes,
    LoadStatus,
    Snapshot,
} from "system/types/CommonTypes";
import {GameAction, Player, Room, RoomHeader,} from "system/GameStates/GameTypes";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";

export default function DataLoader(props: IProps) {
    const [isLoaded, setStatus] = useState(LoadStatus.init);
    const context = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const history = useHistory();
    ///====LOAD AND LISTEN DB===///
    //https://firebase.google.com/docs/reference/node/firebase.database.Reference#on
    function checkNull<T>(snapshot: Snapshot): [boolean, T] {
        const data: T = snapshot.val();
        return [data !== null, data];
    }

    function updateField<T>(listenerType: ListenerTypes, snapshot: Snapshot) {
        const [valid, data] = checkNull<T>(snapshot);
        if (!valid) return;
        context.onUpdateField(listenerType, data);
    }

    function onUpdatePlayer(snapshot: Snapshot) {
        const [valid, player] = checkNull<Player>(snapshot);
        if (!valid) return;
        context.onUpdatePlayer({id: snapshot.key!, player}, UpdateType.Update);
    }

    function onAddPlayer(snapshot: Snapshot) {
        const [valid, player] = checkNull<Player>(snapshot);
        if (!valid) return;
        context.onUpdatePlayer({id: snapshot.key!, player}, UpdateType.Insert);
    }

    function onRemovePlayer(snapshot: Snapshot) {
        const [valid, player] = checkNull<Player>(snapshot);
        if (!valid) return;
        context.onUpdatePlayer({id: snapshot.key!, player}, UpdateType.Delete);
    }

    function onUpdateGameAction(snapshot: Snapshot) {
        updateField<GameAction>(ListenerTypes.gameAction, snapshot);
    }

    function onUpdateDeck(snapshot: Snapshot) {
        updateField<string>(ListenerTypes.Deck, snapshot);
    }

    function onUpdateState(snapshot: Snapshot) {
        updateField<number>(ListenerTypes.State, snapshot);
    }

    function onUpdateHeader(snapshot: Snapshot) {
        updateField<RoomHeader>(ListenerTypes.Header, snapshot);
    }

    function setListeners(listeners: Listeners) {
        const playerListRef = listeners.get(ListenerTypes.PlayerList)!;
        playerListRef.on(LISTEN_CHILD_CHANGED, onUpdatePlayer);
        playerListRef.on(LISTEN_CHILD_ADDED, onAddPlayer);
        playerListRef.on(LISTEN_CHILD_REMOVED, onRemovePlayer);
        //Add game listener
        listeners.get(ListenerTypes.Deck)!.on(LISTEN_VALUE, onUpdateDeck);
        listeners
            .get(ListenerTypes.gameAction)!
            .on(LISTEN_VALUE, onUpdateGameAction);
        listeners.get(ListenerTypes.State)!.on(LISTEN_VALUE, onUpdateState);
        //Add Header listener
        listeners.get(ListenerTypes.Header)!.on(LISTEN_VALUE, onUpdateHeader);
    }

    ///////////////END LISTENER--////////////////////////
    function onDisconnectCleanUp(id: string) {
        localCtx.setVal(LocalField.Id, id);
        const myRef = ReferenceManager.getPlayerReference(id);
        myRef.onDisconnect().remove();
    }

    async function setUpRoom() {
        const myId = await initialiseRoom();
        onDisconnectCleanUp(myId);
    }

    async function playerJoin() {
        const myId = await joinLobby();
        onDisconnectCleanUp(myId);
    }

    function joinPlayer() {
        const idField = localCtx.map.get(LocalField.Id);
        if (context.room.playerMap.size === 0) {
            //Join as host
            console.log("Join as host");
            setUpRoom();
        } else {
            if (idField?.val !== null && context.room.playerMap.has(idField?.val)) {
                console.log("Already connected");
            } else {
                console.log("Join as client");
                playerJoin();
            }
            //Join as client
        }
    }

    useEffect(() => {
        switch (isLoaded) {
            case LoadStatus.init:
                loadRoom().then((room: Room) => {
                    context.onRoomLoaded(room);
                    setStatus(LoadStatus.loaded);
                });
                break;
            case LoadStatus.loaded:
                const listeners = registerListeners();
                setListeners(listeners);
                setStatus(LoadStatus.listening);
                break;
            case LoadStatus.listening:
                joinPlayer();
                setStatus(LoadStatus.joined);
                break;
            case LoadStatus.joined:
                //Wait for my id to be set
                break;
            case LoadStatus.outerSpace:
                break;
        }
    }, [isLoaded]);

    const myId = localCtx.getVal(LocalField.Id);
    useEffect(() => {
        if (myId === null) return;
        if (context.room.game.state.turn < 0) {
            history.replace("/lobby");
            // return <Redirect push to="/lobby" />;
        } else {
            history.replace("/lobby");
            // return <Redirect push to="/game" />;
        }
        setStatus(LoadStatus.outerSpace);
    }, [myId]);

    useEffect(() => {
        const playerMap = context.room.playerMap;
        console.log("Room size changed " + playerMap.size);
        console.log(context.room);
    }, [context.room.playerMap.size]);
    return <Fragment>{props.children}</Fragment>;
}
