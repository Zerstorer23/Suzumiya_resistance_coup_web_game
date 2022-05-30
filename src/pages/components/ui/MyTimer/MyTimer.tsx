import { useContext } from "react";
import { Fragment, useEffect } from "react";
import { useTimer } from "react-timer-hook";
import LocalContext, {
  LocalField,
} from "system/context/localInfo/local-context";
import {
  IProps,
  SolvingState,
  TimerReturnType,
} from "system/types/CommonTypes";

type Props = IProps & {
  durationInSec: number;
};
export function MyTimer(props: Props): JSX.Element {
  const expiryTimestamp = new Date();
  const localCtx = useContext(LocalContext);
  // REACTION_MAX_SEC
  /**
   *Behavoir when this element is removed
   *
   */
  expiryTimestamp.setSeconds(
    expiryTimestamp.getSeconds() + props.durationInSec
  ); // 10 minutes timer
  const timer: TimerReturnType = useTimer({
    expiryTimestamp,
    onExpire: () => {
      localCtx.setVal(LocalField.Solver, SolvingState.Finished);
    },
  });
  const state = localCtx.getVal(LocalField.Solver);
  useEffect(() => {
    if (state === SolvingState.TriggerWait) {
      localCtx.setVal(LocalField.Solver, SolvingState.Waiting);
      timer.restart(expiryTimestamp, true);
    }
  }, [state]);

  return <Fragment>{timer.seconds}</Fragment>;
}
