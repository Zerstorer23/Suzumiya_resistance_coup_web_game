import VerticalLayout from "pages/components/ui/VerticalLayout";
import TableItem from "pages/ingame/Center/MainTableBoard/TableItem/TableItem";
import gc from "../../../../global.module.css";
import classes from "./MainTableBoard.module.css";

export default function MainTableBoard(): JSX.Element {
  return (
    <div className={`${gc.round_border} ${classes.container}`}>
      <VerticalLayout>
        <TableItem className={classes.topContainer} />
        <TableItem />
      </VerticalLayout>
    </div>
  );
}
