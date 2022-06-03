import nagato from "resources/images/nagato2.png";
import asakura from "resources/images/asakura.png";
import kyon from "resources/images/kyon.png";
import haruhi from "resources/images/haruhi.png";
import koihime from "resources/images/koihime.png";
import coin from "resources/images/coin_ico.png";
import card from "resources/images/card_ico.png";
import unknown from "resources/images/unknown.png";
import nagato_dead from "resources/images/nagato_dead.png";
import mikuru_dead from "resources/images/mikuru_dead.png";
import kyonko from "resources/images/kyonko.png";
import kyonko_dead from "resources/images/kyonko_dead.png";
import kyon_dead from "resources/images/kyon_dead.png";
import koihime_dead from "resources/images/koihime_dead.png";
import haruhi_dead from "resources/images/haruhi_dead.png";
import asakura_dead from "resources/images/asakura_dead.png";
import mikuru from "resources/images/mikuru2.png";

/*
This file adds reference to all image files
when new images are added to folder,
add enum
and add switch in getImage
*/
export enum Images {
    Nagato,
    NagatoDead,
    Asakura,
    AsakuraDead,
    Kyon,
    KyonkoDead,
    KyonDead,
    Kyonko,
    Haruhi,
    HaruhiDead,
    KoihimeDead,
    Koihime,
    Mikuru,
    MikuruDead,
    UnknownCard,
    Coin,
    Card,
}

/*
Return corresponding image resources to the enum
*/
export default function getImage(res: Images): NodeModule {
    switch (res) {
        case Images.Mikuru:
            return mikuru;
        case Images.MikuruDead:
            return mikuru_dead;
        case Images.NagatoDead:
            return nagato_dead;
        case Images.AsakuraDead:
            return asakura_dead;
        case Images.KyonkoDead:
            return kyonko_dead;
        case Images.KyonDead:
            return kyon_dead;
        case Images.Kyonko:
            return kyonko;
        case Images.HaruhiDead:
            return haruhi_dead;
        case Images.KoihimeDead:
            return koihime_dead;
        case Images.UnknownCard:
            return unknown;
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
            return unknown;
    }
}
