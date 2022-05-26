import { Redirect, useHistory } from "react-router-dom";
import { Fragment, useContext, useEffect, useState } from "react";
import { ActionPerformer, UpdateType } from "system/context/room-context";
import {
  DB_PLAYERS,
  initialiseRoom,
  joinLobby,
  loadRoom,
  registerListeners,
} from "system/Database/RoomDatabase";
import {
  IProps,
  Listeners,
  ListenerTypes,
  LISTEN_CHILD_ADDED,
  LISTEN_CHILD_CHANGED,
  LISTEN_CHILD_REMOVED,
  LISTEN_VALUE,
  LoadStatus,
  Snapshot,
} from "system/types/CommonTypes";
import {
  GameAction,
  Player,
  Room,
  RoomHeader,
} from "system/GameStates/GameTypes";
import RoomContext from "system/context/room-context";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import { db } from "system/Database/Firebase";
import { getSortedListFromMap } from "system/GameStates/RoomGenerator";

export default function DataLoader(props: IProps) {
  const [isLoaded, setStatus] = useState(LoadStatus.init);
  const context = useContext(RoomContext);
  const localCtx = useContext(LocalContext);
  const history = useHistory();
  console.log("Loading Status = " + isLoaded);
  ///====LOAD AND LISTEN DB===///
  //https://firebase.google.com/docs/reference/node/firebase.database.Reference#on
  function checkNull<T>(snapshot: Snapshot): [boolean, T] {
    const data: T = snapshot.val();
    // if (isLoaded === LoadStatus.loaded) return [false, data];
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
    context.onUpdatePlayer({ id: snapshot.key!, player }, UpdateType.Update);
  }
  function onAddPlayer(snapshot: Snapshot) {
    const [valid, player] = checkNull<Player>(snapshot);
    if (!valid) return;
    context.onUpdatePlayer({ id: snapshot.key!, player }, UpdateType.Insert);
  }
  function onRemovePlayer(snapshot: Snapshot) {
    const [valid, player] = checkNull<Player>(snapshot);
    if (!valid) return;
    context.onUpdatePlayer({ id: snapshot.key!, player }, UpdateType.Delete);
  }
  function onUpdateClient(snapshot: Snapshot) {
    updateField<GameAction>(ListenerTypes.Client, snapshot);
  }
  function onUpdatePier(snapshot: Snapshot) {
    updateField<GameAction>(ListenerTypes.Pier, snapshot);
  }
  function onUpdateDeck(snapshot: Snapshot) {
    updateField<string>(ListenerTypes.Deck, snapshot);
  }
  function onUpdateTurn(snapshot: Snapshot) {
    updateField<number>(ListenerTypes.Turn, snapshot);
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
    listeners.get(ListenerTypes.Client)!.on(LISTEN_VALUE, onUpdateClient);
    listeners.get(ListenerTypes.Pier)!.on(LISTEN_VALUE, onUpdatePier);
    listeners.get(ListenerTypes.Turn)!.on(LISTEN_VALUE, onUpdateTurn);
    //Add Header listener
    listeners.get(ListenerTypes.Header)!.on(LISTEN_VALUE, onUpdateHeader);
  }

  ///////////////END LISTENER--////////////////////////
  function onDisconnectCleanUp(id: string) {
    localCtx.setVal(LocalField.Id, id);
    const rootRef = db.ref(`${DB_PLAYERS}/${id}`);
    rootRef.onDisconnect().remove();
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
    if (context.room.playerMap.size === 0) {
      //Join as host
      console.log("Join as host");
      setUpRoom();
    } else {
      //Join as client
      console.log("Join as client");
      playerJoin();
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
        console.log("Outer space");
        break;
    }
  }, [isLoaded]);

  const myId = localCtx.getVal(LocalField.Id);
  useEffect(() => {
    if (myId === null) return;
    if (context.room.game.currentTurn < 0) {
      console.log("is joined, redirect lobby");
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
    const sortedList = getSortedListFromMap(playerMap);
    localCtx.setVal(LocalField.SortedList, sortedList);
    console.log("New sorted list: ");
    console.log(sortedList);
  }, [context.room.playerMap.size]);
  return <Fragment>{props.children}</Fragment>;
}
