import Lobby from "./pages/lobby/Lobby";
import {Route, Switch} from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/DataLoader/DataLoader";
import getImage, {Images} from "resources/Resources";

export enum Navigation {
    Loading = "/suzumiya/loading",
    Lobby = "/suzumiya/",
    InGame = "/suzumiya/game",
}

export default function App(): JSX.Element {
    return (
        <DataLoader>
            <Switch>
                <Route path={Navigation.Loading} exact>
                    <p>로딩중...</p>
                    <img src={`${getImage(Images.LoadingImg)}`} alt={"ld"}/>
                </Route>
                <Route path={Navigation.Lobby} exact>
                    <Lobby/>
                </Route>
                <Route path={Navigation.InGame} exact>
                    <InGame/>
                </Route>
                <Route path="*">
                    <p>로딩중...</p>
                    <img src={`${getImage(Images.LoadingImg)}`} alt={"ld"}/>
                </Route>
            </Switch>
        </DataLoader>
    );
}
