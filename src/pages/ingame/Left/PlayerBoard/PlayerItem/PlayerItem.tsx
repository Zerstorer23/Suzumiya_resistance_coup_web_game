import { resourceUsage } from "process";
import IMG_NAGATO from "resources/images/nagato2.png";
import IMG_CARD from "resources/images/card_ico.png";
import IMG_COIN from "resources/images/coin_ico.png";

import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import gc from "global.module.css";
import classes from "./PlayerItem.module.css";

export default function PlayerItem(): JSX.Element {
  return (
    <HorizontalLayout className={`${classes.container} ${classes.selectable}`}>
      <img
        src={IMG_NAGATO}
        alt="nagato"
        className={`${classes.characterIcon}`}
      />
      <div className={`${classes.namePanel} `}>
        <p>ㅇㅇ(39.7)</p>
      </div>
      <div className={`${classes.iconPanel} `}>
        <img alt="" src={IMG_CARD} className={classes.icon} />
        <p className={classes.iconText}>2</p>
      </div>
      <div className={`${classes.iconPanel} `}>
        <img alt="" src={IMG_COIN} className={classes.icon} />
        <div className={classes.iconText}>1</div>
      </div>
    </HorizontalLayout>
  );
}
