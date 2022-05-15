import { IProps } from "../../../App";
import { ItemPair } from "../../../system/types/CommonTypes";

type Props = IProps & {
  label: string | null;
  value: string;
  options: ItemPair[];
  onChange: any;
};
export default function Dropdown(props: Props) {
  return (
    <div>
      <label>
        {props.label != null && props.label}
        <select value={props.value} onChange={props.onChange}>
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
