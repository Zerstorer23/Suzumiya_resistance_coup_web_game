import {Redirect, Route, Switch} from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/components/ui/DataLoader/DataLoader";
import MusicModule from "pages/components/ui/MusicModule/MusicModule";
import LoadingPage from "pages/components/ui/LoadingPage/LoadingPage";
import Lobby from "pages/lobby/Lobby";
import GameOverPage from "pages/gameOver/GameOverPage";
import {useEffect} from "react";
import {connect} from "pages/components/ui/ChatModule/ChatRelay";

export enum Navigation {
    Loading = "/loading",
    Lobby = "/",
    InGame = "/game",
    Finished = "/finish",
    vidPlayer = "/video",
}

export default function App(): JSX.Element {
    useEffect(() => {
        connect();
    }, []);

    return (
        <DataLoader>
            <MusicModule/>
            <Switch>
                <Route path={Navigation.Loading} exact>
                    <LoadingPage/>
                </Route>
                <Route path={Navigation.Lobby} exact>
                    <Lobby/>
                </Route>
                <Route path={Navigation.InGame} exact>
                    <InGame/>
                </Route>
                <Route path={Navigation.Finished} exact>
                    <GameOverPage/>
                </Route>
                <Route path="*">
                    <Redirect to={Navigation.Loading}/>
                </Route>
            </Switch>
        </DataLoader>
    );
}
