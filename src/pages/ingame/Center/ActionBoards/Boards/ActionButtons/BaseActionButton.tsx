import {IProps} from "system/types/CommonTypes";
import {ActionType} from "system/GameStates/States";
import classes from "pages/ingame/Center/ActionBoards/Boards/BaseBoard.module.css";
import {ActionInfo} from "system/GameStates/ActionInfo";
import {Fragment} from "react";
import {Card} from "system/cards/Card";

type Prop = IProps & {
    param: Card | ActionInfo;
    onClickButton: () => void;
};
export default function BaseActionButton(props: Prop) {
    let name = "";
    const param = props.param;
    if (param instanceof Card) {
        name = param.cardRole;
        //Card case
    } else {
        //ActionInfo Case
        if (param.actionType === ActionType.None) {
            return <Fragment/>;
        }
        name = param.getName();
    }

    return (
        <button
            className={`${classes.cell} ${props.className}`}
            onClick={props.onClickButton}
        >
            <div>{/* <img src={IMG_NAGATO} alt="d" /> */}</div>
            <p>{name}</p>
            <p>{/* [Lie] */}</p>
        </button>
    );
}
