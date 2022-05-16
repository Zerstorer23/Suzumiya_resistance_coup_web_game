import React from "react";
import Lobby from "./pages/lobby/Lobby";
import { Route, Switch } from "react-router-dom";
import InGame from "./pages/ingame/InGame";
import LoadingHome from "pages/LoadingHome/LoadingHome";
export type IProps = {
  className?: string;
  children?: JSX.Element[] | JSX.Element;
};

export default function App(): JSX.Element {
  return (
    <Switch>
      <Route path="/" exact>
        <LoadingHome />
      </Route>
      <Route path="/lobby" exact>
        <Lobby />
      </Route>
      <Route path="/game" exact>
        <InGame />
      </Route>
      <Route>
        <p>Not found</p>
      </Route>
    </Switch>
  );
}
