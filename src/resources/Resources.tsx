import nagato from "resources/images/nagato2.png";
import asakura from "resources/images/asakura.png";
import kyon from "resources/images/kyon.png";
import haruhi from "resources/images/haruhi.png";
import koihime from "resources/images/koihime.png";
import coin from "resources/images/coin_ico.png";
import card from "resources/images/emptyCard.png";
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
import loadingImg from "resources/images/large/loading.png";
import ruleCardImg from "resources/images/ruleCard.png";
import ruleCardExpansion from "resources/images/ruleCardExpansion.png";
import asakuraMikuruWin from "resources/images/large/asakura_mikuru_win.png";
import asakuraMikuruWin2 from "resources/images/large/asakura_mikuru_win2.png";
import asakuraWin from "resources/images/large/asakura_win.png";
import haruhiKyonWin from "resources/images/large/haruhi_kyon_win.png";
import haruhiKyonWin2 from "resources/images/large/haruhi_kyon_win2.png";
import haruhiMikuruWin from "resources/images/large/haruhi_mikuru_win.png";
import haruhiMikuruWin2 from "resources/images/large/haruhi_mikuru_win2.png";
import haruhiNagatoWin from "resources/images/large/haruhi_nagato_win.png";
import haruhiNagatoWin2 from "resources/images/large/haruhi_nagato_win2.png";
import haruhiWin from "resources/images/large/haruhi_win.png";
import itsukiWin from "resources/images/large/itsuki_win.png";
import kyonkoNagatoWin from "resources/images/large/kyon_nagato_win.png";
import kyonkoNagatoWin2 from "resources/images/large/kyon_nagato_win2.png";
import kyonkoItsukiWin from "resources/images/large/kyonko_itsuki.png";
import kyonkoWin from "resources/images/large/kyonko_win.png";
import mikuruMikuruWin from "resources/images/large/mikuru_mikuru_win.png";
import mikuruWin from "resources/images/large/mikuru_win.png";
import mikuruWin2 from "resources/images/large/mikuru_win2.png";
import nagatoWin from "resources/images/large/nagato_win.png";
import nagatoWin2 from "resources/images/large/nagato_win2.png";

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
    LoadingImg,
    RuleCard,
    RuleCardExpansion,
    WinAsakuraMikuru,
    WinAsakuraMikuru2,
    WinAsakura,
    WinHaruhi,
    WinHaruhiKyon,
    WinHaruhiKyon2,
    WinHaruhiMikuru,
    WinHaruhiMikuru2,
    WinHaruhiNagato,
    WinHaruhiNagato2,
    WinItsuki,
    WinKyonNagato,
    WinKyonNagato2,
    WinKyonkoItsuki,
    WinKyonko,
    WinMikuruMikuru,
    WinMikuru,
    WinMikuru2,
    WinNagato,
    WinNagato2,


}

/*
Return corresponding image resources to the enum
*/
export default function getImage(res: Images): NodeModule {
    switch (res) {
        case Images.WinAsakuraMikuru:
            return asakuraMikuruWin;
        case Images.WinAsakuraMikuru2:
            return asakuraMikuruWin2;
        case Images.WinAsakura:
            return asakuraWin;
        case Images.WinHaruhi:
            return haruhiWin;
        case Images.WinHaruhiKyon:
            return haruhiKyonWin;
        case Images.WinHaruhiKyon2:
            return haruhiKyonWin2;
        case Images.WinHaruhiMikuru:
            return haruhiMikuruWin2;
        case Images.WinHaruhiMikuru2:
            return haruhiMikuruWin;
        case Images.WinHaruhiNagato:
            return haruhiNagatoWin;
        case Images.WinHaruhiNagato2:
            return haruhiNagatoWin2;
        case Images.WinItsuki:
            return itsukiWin;
        case Images.WinKyonNagato:
            return kyonkoNagatoWin;
        case Images.WinKyonNagato2:
            return kyonkoNagatoWin2;
        case Images.WinKyonkoItsuki:
            return kyonkoItsukiWin;
        case Images.WinKyonko:
            return kyonkoWin;
        case Images.WinMikuruMikuru:
            return mikuruMikuruWin;
        case Images.WinMikuru:
            return mikuruWin;
        case Images.WinMikuru2:
            return mikuruWin2;
        case Images.WinNagato:
            return nagatoWin;
        case Images.WinNagato2:
            return nagatoWin2;
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
        case Images.LoadingImg:
            return loadingImg;
        case Images.RuleCard:
            return ruleCardImg;
        case Images.RuleCardExpansion:
            return ruleCardExpansion;

        default:
            return unknown;
    }
}
