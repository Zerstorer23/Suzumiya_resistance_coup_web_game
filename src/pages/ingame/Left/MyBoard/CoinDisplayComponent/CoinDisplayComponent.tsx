import { IProps } from "App";
import HorizontalLayout from "pages/components/ui/HorizontalLayout";
import getImage, { Images } from "resources/Resources";
import classes from "./CoinDisplayComponent.module.css";

type Props = IProps & { coins: number };
const numMax = 10; // Or something else
export default function CoinDisplayComponent(props: Props) {
  const numCoins = props.coins;
  return (
    <HorizontalLayout className={classes.container}>
      <p className={classes.display}>
        Coins:
        {numCoins}
      </p>

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
