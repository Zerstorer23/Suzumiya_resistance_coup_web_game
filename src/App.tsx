import Lobby from "./pages/lobby/Lobby";
import {Route, Switch} from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/DataLoader/DataLoader";
import {db} from "system/Database/Firebase";
import MyTimer from "pages/testings/Timer";

export default function App(): JSX.Element {
    // const time =firebase.database.ServerValue.TIMESTAMP;
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
                <Route path="*">
                    <p>Not found</p>
                </Route>
            </Switch>
        </DataLoader>
    );
}
