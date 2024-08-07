import { Fragment, useEffect, useState } from 'react';
import { BomOutputEdit } from './BomOutputEdit';
import { BomInputEdit } from './BomInputEdit';
import { BomInputAddNew } from './BOMInputAddNew';

export const BomDetail = (props) => {
    const [keyRender, setKeyRender] = useState(0)

    useEffect(() => {
        let xx = keyRender + 1;
        setKeyRender(xx);
    }, [props.action, props.bomInputId, props.bomOutputId])

    const emitParent = (action) => {
        props.emitParent(action)
    }

    switch (props.action) {
        case "EditBomOutput":
            return (<BomOutputEdit bomOutputId={props.bomOutputId} action={props.action} emitParent={emitParent} />);
            break;
        case "EditBomInput":
            return (<BomInputEdit bomInputId={props.bomInputId} action={props.action} emitParent={emitParent} />);
            break;
        case "AddBomOutput":
            return (
                <BomOutputEdit
                    bomOutputId={""}
                    action={props.action}
                    emitParent={emitParent}
                    selectedProductId={props.selectedProductId}
                    measIdForAddBOM={props.measIdForAddBOM}
                    segmentIdForAddBOM={props.segmentIdForAddBOM}
                    productNameForAddBOM={props.productNameForAddBOM}
                />);
            break;
        case "AddBomInput":
            let mm
            mm = JSON.parse(props.bomInputId);
            return (<BomInputAddNew bomId={mm.bomId} action={props.action} emitParent={emitParent} />);
            break;
        default:
            return (
                <Fragment>
                    {/* <h4>Action: {props.action}</h4>
                    <h4>Bom Input ID: {props.bomInputId}</h4>
                    <h4>Bom Output ID: {props.bomOutputId}</h4> */}
                </Fragment>
            )
    }

}