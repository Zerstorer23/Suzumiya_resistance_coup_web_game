import { Redirect, Route, Switch } from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/components/ui/DataLoader/DataLoader";
import Lobby from "pages/lobby/Lobby";
import MusicModule from "pages/components/ui/MusicModule/MusicModule";
import LoadingPage from "pages/components/ui/LoadingPage/LoadingPage";
import { IP } from "IPAddress/IPAddress";

export enum Navigation {
  Loading = "/suzumiya/loading",
  Lobby = "/suzumiya/",
  InGame = "/suzumiya/game",
  vidPlayer = "/suzumiya/video",
}

export default function App(): JSX.Element {
  return (
    <DataLoader>
      <MusicModule />
      <Switch>
        <Route path={Navigation.Loading} exact>
          <LoadingPage />
        </Route>
        <Route path={Navigation.Lobby} exact>
          <Lobby />
          {/* <IP /> */}
        </Route>
        <Route path={Navigation.InGame} exact>
          <InGame />
        </Route>
        <Route path="*">
          <Redirect to={Navigation.Loading} />
        </Route>
      </Switch>
    </DataLoader>
  );
}
