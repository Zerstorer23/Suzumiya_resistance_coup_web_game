import { IProps } from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import getImage, { Images } from "resources/Resources";
import classes from "./TableItem.module.css";

export default function TableItem(props: IProps) {
  const lastChar = getImage(Images.Haruhi);

  return (
    <HorizontalLayout className={`${props.className} ${classes.container}`}>
      <div className={classes.profileContainer}>
        <img
          src={`${lastChar}`}
          alt="lastchar"
          className={classes.imgLastUsed}
        />
        <p className={classes.textLastClaim}>Last claim: Spy</p>
        <p className={classes.playerName}>ㅇㅇ</p>
      </div>
      <div className={classes.actionContainer}>
        <p className={classes.textMainAction}>ㅇㅇ is doing the turn...</p>
        <p className={classes.textSideAction}>5 seconds remaining...</p>
      </div>
    </HorizontalLayout>
  );
}
