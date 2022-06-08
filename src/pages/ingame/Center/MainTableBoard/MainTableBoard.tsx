import VerticalLayout from "pages/components/ui/VerticalLayout";
import gc from "global.module.css";
import classes from "./MainTableBoard.module.css";
import {MyTimer} from "pages/components/ui/MyTimer/MyTimer";
import {useTranslation} from "react-i18next";
import PierItem from "pages/ingame/Center/MainTableBoard/TableItem/Pier/PierItem";
import TargetItem from "pages/ingame/Center/MainTableBoard/TableItem/Target/TargetItem";
import ChallengerItem from "pages/ingame/Center/MainTableBoard/TableItem/Challenger/ChallengerItem";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import animClasses from "animation.module.css";

export default function MainTableBoard(): JSX.Element {
    const {t} = useTranslation();
    return (
        <div className={`${gc.round_border} ${classes.container}`}>
            <VerticalLayout>
                <p className={classes.timer}>
                    <MyTimer/>{t("_seconds_remaining")}
                </p>
                <PierItem className={`${classes.pierContainer} ${animClasses.slideUp}`}/>
                <HorizontalLayout className={classes.horizontalContainer}>
                    <TargetItem className={`${classes.targetContainer} ${animClasses.slideUp}`}/>
                    <ChallengerItem className={`${classes.challengerContainer} ${animClasses.slideUp}`}/>
                </HorizontalLayout>
            </VerticalLayout>
        </div>
    );
}
