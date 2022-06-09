import Lobby from "./pages/lobby/Lobby";
import { Route, Switch } from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import DataLoader from "pages/DataLoader/DataLoader";
import { VideoPlayer } from "videoPlayer/videoPlayer";

export enum Navigation {
  Loading = "/suzumiya/loading",
  Lobby = "/suzumiya/",
  InGame = "/suzumiya/game",
  vidPlayer = "/suzumiya/video",
}

export default function App(): JSX.Element {
  return (
    <DataLoader>
      <Switch>
        <Route path={Navigation.Loading} exact>
          <p>Loading...</p>
        </Route>
        <Route path={Navigation.Lobby} exact>
          {/* <Lobby/> */}
          <VideoPlayer />
        </Route>
        <Route path={Navigation.InGame} exact>
          <InGame />
        </Route>
        <Route path={Navigation.vidPlayer} exact>
          <VideoPlayer />
        </Route>
        <Route path="*">
          <p>Not found</p>
        </Route>
      </Switch>
    </DataLoader>
  );
}
