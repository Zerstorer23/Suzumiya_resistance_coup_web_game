import classes from "./PlayersPanel.module.css";
import VerticalLayout from "pages/components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import { useHistory } from "react-router-dom";
import { PlayerMap } from "system/GameStates/GameTypes";
import { IProps } from "system/types/CommonTypes";

type Props = IProps & {
  playerMap: PlayerMap;
};
export default function PlayersPanel(props: Props) {
  const history = useHistory();
  const onClickStart = () => {
    history.replace("/game");
  };
  const elemList: JSX.Element[] = [];
  const playerMap: PlayerMap = props.playerMap;
  const currPlayer = playerMap.size;
  playerMap.forEach((player, key) => {
    const elem = <PlayerListItem key={key} player={player} />;
    elemList.push(elem);
  });

  //props: IProps

  return (
    <VerticalLayout className={`${classes.container} `}>
      <div className={classes.headerContainer}>
        <p className={classes.headerTitle}>Hamang No.6</p>
        <p className={classes.headerPlayerNum}>{`${currPlayer}/20`}</p>
      </div>
      <VerticalLayout className={classes.list}>{elemList}</VerticalLayout>
      <button className={classes.buttonStart} onClick={onClickStart}>
        start
      </button>
    </VerticalLayout>
  );
}
