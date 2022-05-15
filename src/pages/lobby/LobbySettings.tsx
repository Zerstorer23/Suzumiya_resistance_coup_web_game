import React from "react";
import gc from "../../global.module.css";
import { ItemPair } from "../../system/types/CommonTypes";
import Dropdown from "../components/ui/Dropdown";
import HorizontalLayout from "../components/ui/HorizontalLayout";
import classes from "./LobbySettings.module.css";
export const networkOptions: ItemPair[] = [
  { key: "1", label: "Normal", value: "100" },
  { key: "2", label: "Slow", value: "500" },
];
export default function LobbySettings() {
  const [networkCondition, setNetworkCondition] = React.useState("Normal");

  const onChangeNetworkCondition = (event: any) => {
    setNetworkCondition(event.target.value);
  };
  //TODO useEffect to listen to change.

  return (
    <div className={`${classes.container} ${gc.round_border}`}>
      <HorizontalLayout>
        <p>Name</p>
        <input type="text"></input>
      </HorizontalLayout>
      <HorizontalLayout>
        <p>Net ping</p>
        <Dropdown
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
