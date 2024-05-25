import { Fragment, useEffect, useState } from 'react';
import { BomOutputEdit } from './BomOutputEdit';
import { BomInputEdit } from './BomInputEdit';

export const BomDetail = (props) => {
    const [keyRender, setKeyRender] = useState(0)

    useEffect(() => {
        let xx = keyRender + 1;
        setKeyRender(xx);
    }, [props.action, props.bomInputId, props.bomOutputId])

    switch (props.action) {
        case "EditBomOutput":
            return (<BomOutputEdit bomOutputId={props.bomOutputId} action={props.action} />);
            break;
        case "EditBomInput":
            return (<BomInputEdit bomInputId={props.bomInputId} action={props.action} />);
            break;
        case "AddBomOutput":
            return (<BomOutputEdit bomOutputId={""} action={props.action} />);
            break;
        case "AddBomInput":
            return (<BomInputEdit action={props.action} />);
            break;
        default:
            return (
                <Fragment>
                    <h4>Action: {props.action}</h4>
                    <h4>Bom Input ID: {props.bomInputId}</h4>
                    <h4>Bom Output ID: {props.bomOutputId}</h4>
                </Fragment>
            )
    }

}