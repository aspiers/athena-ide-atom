'use babel';

import React from 'react'
import PropTypes from 'prop-types';
import { Row, Button, InputBox } from '../atoms';

export default class AbiCalls extends React.Component {

  static get propTypes() {
    return {
      abi: PropTypes.object,
      onAbiExec: PropTypes.func,
      onAbiQuery: PropTypes.func
    };
  }

  constructor(props) {
    super(props);

    // FIXME : acktsap's hack to refresh input value
    this.argsRefs = [];
  }

  cleanArgsValue() {
    this.argsRefs.forEach(r => {
      if (r.current) {
        r.current.cleanValue()
      }
    });
  }

  render() {
    const abiFunctions = this.props.abi.functions;
    const onAbiExec = this.props.onAbiExec;
    const onAbiQuery = this.props.onAbiQuery;

    if (typeof abiFunctions === "undefined") {
      return <div></div>;
    }

    this.argsRefs = [];
    return abiFunctions.filter(f => "constructor" !== f.name)
      .map((abiFunction, index) => {
        const argsRef = React.createRef();
        this.argsRefs.push(argsRef);

        const args = abiFunction.arguments;
        const inputPlaceHolder = args.length === 0 ? "No argument" : args.map(a => a.name).join(", ");

        let buttonStyle = 'btn-warning';
        let callback = onAbiExec;
        if (abiFunction.view) {
          buttonStyle = 'btn-error';
          callback = onAbiQuery;
        }
        return (
          <Row key={index} >
            <Button
              name={abiFunction.name}
              class={['component-btn-runner', 'component-description', buttonStyle]}
              onClick={() => callback(argsRef, abiFunction.name)}
            />
            <InputBox type='text' class='component-inputbox-text'
              ref={argsRef}
              defaultValue=""
              placeHolder={inputPlaceHolder}
            />
          </Row>
        );
      });
  }

}