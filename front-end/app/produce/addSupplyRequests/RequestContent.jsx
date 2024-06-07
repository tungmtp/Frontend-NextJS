import { RequestDetail } from "./RequestDetail";
import { NewRequest } from "./NewRequest";

export const RequestContent = (props) => {
    switch (props.action) {
        case "RequestDetail":
            return (
                <RequestDetail requestDate={props.requestDate} orderID={props.orderID} />
            )
            break;
        case "NewRequest":
            return (
                <NewRequest requestDate={props.requestDate} orderID={props.orderID} />
            )
            break;
        default:
            return (
                <div>{props.action + " " + props.requestDate + " " + props.orderID}</div>
            )
            break;
    }
}