import { resourceUsage } from "process";
import IMG_NAGATO from "resources/images/nagato2.png";
import IMG_CARD from "resources/images/card_ico.png";
import IMG_COIN from "resources/images/coin_ico.png";

import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./PlayerItem.module.css";
import { IProps } from "system/types/CommonTypes";
import { Player, PlayerEntry } from "system/GameStates/GameTypes";

type Props = IProps & {
  player: Player;
};
export default function PlayerItem(props: Props): JSX.Element {
  //const player = props.player;
  return (
    <HorizontalLayout className={`${classes.container} ${classes.selectable}`}>
      <img
        src={IMG_NAGATO}
        alt="nagato"
        className={`${classes.characterIcon}`}
      />
      <div className={`${classes.namePanel} `}>
        <p>{props.player.name}</p>
        {}
      </div>
      <div className={`${classes.iconPanel} `}>
        <img alt="" src={IMG_CARD} className={classes.icon} />
        <p className={classes.iconText}>{2}</p>
        {/* TODO: calculate the number of cards left*/}
      </div>
      <div className={`${classes.iconPanel} `}>
        <img alt="" src={IMG_COIN} className={classes.icon} />
        <div className={classes.iconText}>{props.player.coins}</div>
        {}
      </div>
    </HorizontalLayout>
  );
}
