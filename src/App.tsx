import Lobby from "./pages/lobby/Lobby";
import {Route, Switch} from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/DataLoader/DataLoader";
import MyTimer from "pages/testings/Timer";

export default function App(): JSX.Element {
    return (
        <DataLoader>
            <Switch>
                <Route path="/" exact>
                    <p>Loading...</p>
                </Route>
                <Route path="/lobby" exact>
                    <Lobby/>
                </Route>
                <Route path="/game" exact>
                    <InGame/>
                </Route>
                <Route path="/timer" exact>
                    <MyTimer/>
                </Route>
                <Route path="/tutorial" exact>
                    <p>Tutorial page</p>
                </Route>
                <Route path="/finished" exact>
                    <p>Winner page</p>
                </Route>
                <Route path="*">
                    <p>Not found</p>
                </Route>
            </Switch>
        </DataLoader>
    );
}
