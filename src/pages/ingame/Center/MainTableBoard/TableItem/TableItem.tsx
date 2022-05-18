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
        <p className={classes.textLastClaim}>마지막 주장:간첩</p>
        <p className={classes.playerName}>ㅇㅇ</p>
      </div>
      <div className={classes.actionContainer}>
        <p className={classes.textMainAction}>ㅇㅇ님이 턴을 진행중...</p>
        <p className={classes.textSideAction}>5초 남았습니다...</p>
      </div>
    </HorizontalLayout>
  );
}
