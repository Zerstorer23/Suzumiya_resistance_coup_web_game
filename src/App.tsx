import Lobby from "./pages/lobby/Lobby";
import { Route, Switch } from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/DataLoader/DataLoader";
import MyTimer from "pages/testings/Timer";

export default function App(): JSX.Element {
  return (
    <DataLoader>
      <Switch>
        <Route path="/suzumiya/" exact>
          <p>Loading...</p>
        </Route>
        <Route path="/suzumiya/lobby" exact>
          <Lobby />
        </Route>
        <Route path="/suzumiya/game" exact>
          <InGame />
        </Route>
        <Route path="/suzumiya/timer" exact>
          <MyTimer />
        </Route>
        <Route path="/suzumiya/tutorial" exact>
          <p>Tutorial page</p>
        </Route>
        <Route path="/suzumiya/finished" exact>
          <p>Winner page</p>
        </Route>
        <Route path="*">
          <p>Not found</p>
        </Route>
      </Switch>
    </DataLoader>
  );
}
