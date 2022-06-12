import {IProps} from "system/types/CommonTypes";
import classes from "./ImagePage.module.css";
import getImage, {Images} from "resources/Resources";
import {useTranslation} from "react-i18next";
import gc from "global.module.css";


type Props = IProps & {
    imgSrc: Images
    titleKey?: string
}

export default function ImagePage(props: Props) {
    const {t} = useTranslation();
    const key = (props.titleKey !== undefined) ? props.titleKey : "_loading";
    return <div className={`${classes.container} ${gc.panelBackground}`}>
        <img className={classes.image} src={`${getImage(props.imgSrc)}`} alt={"ld"}/>
        <p className={classes.text}>{t(key)}</p>
    </div>;
}