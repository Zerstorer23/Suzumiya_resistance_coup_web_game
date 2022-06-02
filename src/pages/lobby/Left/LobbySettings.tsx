import {useContext, useState} from "react";
import gc from "global.module.css";
import {ItemPair} from "system/types/CommonTypes";
import Dropdown from "pages/components/ui/Dropdown";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import classes from "./LobbySettings.module.css";
import RoomContext from "system/context/roomInfo/room-context";
import LocalContext, {LocalField,} from "system/context/localInfo/local-context";
import {Player} from "system/GameStates/GameTypes";
import {ReferenceManager} from "system/Database/RoomDatabase";

export const networkOptions: ItemPair[] = [
    {key: "1", label: "Normal", value: "100"},
    {key: "2", label: "Slow", value: "500"},
];
const MAX_NAME_LENGTH = 16;
export default function LobbySettings() {
    const [networkCondition, setNetworkCondition] = useState("100");
    const ctx = useContext(RoomContext);
    const localCtx = useContext(LocalContext);
    const myId: string | null = localCtx.getVal(LocalField.Id);
    if (myId === null) {
        return <p>Need to reload</p>;
    }
    const myPlayer: Player = ctx.room.playerMap.get(myId)!;
    const myRef = ReferenceManager.getPlayerReference(myId);

    const onChangeNetworkCondition = (event: any) => {
        console.log(event.target.value);
        setNetworkCondition(event.target.value.value);
    };
    
    async function onFinishEditName(event: any) {
        let newName: string = event.target.value;
        if (newName.length <= 1) return;
        if (newName.length > MAX_NAME_LENGTH) {
            newName = newName.substring(0, MAX_NAME_LENGTH);
        }
        console.log(newName);
        myPlayer.name = newName;
        myRef.set(myPlayer);
    }

    return (
        <div className={`${classes.container} ${gc.round_border}`}>
            <HorizontalLayout>
                <p>Name</p>
                <input
                    className={classes.inputName}
                    type="text"
                    onBlur={onFinishEditName}
                    defaultValue={myPlayer.name}
                ></input>
            </HorizontalLayout>
            <HorizontalLayout>
                <p>Net ping</p>
                <Dropdown
                    className={classes.pingDropdown}
                    label={null}
                    options={networkOptions}
                    value={networkCondition}
                    onChange={onChangeNetworkCondition}
                />
            </HorizontalLayout>
            <button className={classes.helpButton}>Help</button>
            <button className={classes.helpButton}>Settings</button>
        </div>
    );
}
