import nagato from "resources/images/nagato2.png";
import asakura from "resources/images/asakura.png";
import kyon from "resources/images/kyon.png";
import haruhi from "resources/images/haruhi.png";
import koihime from "resources/images/koihime.png";
import coin from "resources/images/coin_ico.png";
import card from "resources/images/card_ico.png";
/*
This file adds reference to all image files
when new images are added to folder,
add enum
and add switch in getImage
*/
export enum Images {
  Nagato,
  Asakura,
  Kyon,
  Haruhi,
  Koihime,
  Coin,
  Card,
}
/*
Return corresponding image resources to the enum
*/
export default function getImage(res: Images): NodeModule {
  switch (res) {
    case Images.Nagato:
      return nagato;
    case Images.Asakura:
      return asakura;
    case Images.Kyon:
      return kyon;
    case Images.Koihime:
      return koihime;
    case Images.Haruhi:
      return haruhi;
    case Images.Card:
      return card;
    case Images.Coin:
      return coin;
    default:
      return nagato;
  }
}
