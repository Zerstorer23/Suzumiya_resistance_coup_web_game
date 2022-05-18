import { IProps, ItemPair } from "system/types/CommonTypes";
import classes from "./Dropdown.module.css";
type Props = IProps & {
  label: string | null;
  value: string;
  options: ItemPair[];
  onChange: any;
};
export default function Dropdown(props: Props) {
  return (
    <div className={props.className}>
      <label className={classes.container}>
        {props.label != null && props.label}
        <select
          className={classes.container}
          value={props.value}
          onChange={props.onChange}
        >
          {props.options.map((option) => (
            <option key={option.key} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}
