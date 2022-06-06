import {IProps} from "system/types/CommonTypes";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import getImage, {Images} from "resources/Resources";
import classes from "./CoinDisplayComponent.module.css";
import {useTranslation} from "react-i18next";
import {insert} from "lang/i18nHelper";

type Props = IProps & { coins: number };
const numMax = 10; // Or something else
export default function CoinDisplayComponent(props: Props) {
    const numCoins = props.coins;
    const {t} = useTranslation();
    return (
        <HorizontalLayout className={classes.container}>
            <p className={classes.display}>{insert(t, "_coin_count", numCoins)}</p>

            <div className={classes.coinBox}>
                {[...Array(numMax)].map((_, index) => {
                    return (
                        <img
                            key={index}
                            src={`${getImage(Images.Coin)}`}
                            className={`${classes.coin} ${
                                index + 1 > numCoins && classes.invisible
                            }`}
                            alt="coin"
                        />
                    );
                })}
            </div>
        </HorizontalLayout>
    );
}
