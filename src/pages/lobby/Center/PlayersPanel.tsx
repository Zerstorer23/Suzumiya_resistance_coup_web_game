import React, { Fragment } from "react";
import { IProps } from "../../../App";
import classes from "./PlayersPanel.module.css";
import VerticalLayout from "../../components/ui/VerticalLayout";
import PlayerListItem from "./PlayerListItem";
import { useHistory } from "react-router-dom";

export default function PlayersPanel() {
  const history = useHistory();
  const onClickStart = () => {
    history.push("/game");
  };
  //props: IProps
  let currPlayer = 1;
  const playerList = [
    "ㅇㅇ(39.7)",
    "ㅇㅇ(122.42)",
    "ㅇㅇ(47.1)",
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
    `Lorem ipsum dolor sit amet consectetur adipisicing elit. Velit iusto, sint voluptates quidem nihil dolore consequuntur soluta, corporis vitae ducimus nesciunt minima itaque cumque quibusdam asperiores, iure eum magni fugiat?`,
  ];
  return (
    <VerticalLayout className={`${classes.container} `}>
      <div className={classes.headerContainer}>
        <p className={classes.headerTitle}>Hamang No.6</p>
        <p className={classes.headerPlayerNum}>{`${currPlayer}/20`}</p>
      </div>
      <VerticalLayout className={classes.list}>
        {playerList.map((item) => (
          <PlayerListItem
            key={Math.random().toString()}
            value={item}
          ></PlayerListItem>
        ))}
      </VerticalLayout>
      <button className={classes.buttonStart} onClick={onClickStart}>
        start
      </button>
    </VerticalLayout>
  );
}
