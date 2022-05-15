import { IProps } from "App";

export type ItemPair = {
  key: string;
  label: string;
  value: string;
};
export type FlexPair = {
  element: JSX.Element;
  flex: number;
};
export type LinearParam = IProps & { elements: FlexPair[] };
