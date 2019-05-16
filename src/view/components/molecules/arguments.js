import React from 'react'
import PropTypes from 'prop-types';
import logger from 'loglevel';
import { Amount } from '@herajs/client';

import { ArgumentRow, Foldable, ArgumentName, InputBox, SelectBox, TextBox } from '../atoms';

const noArgumentsDisplay = "No arguments provided";
const units = [ "aer", "gaer", "aergo" ];

export default class Arguments extends React.Component {

  static get propTypes() {
    return {
      payable: PropTypes.bool,
      args: PropTypes.array.isRequired,
    };
  }

  constructor(props) {
    super(props);
    this.state = {
      args: new Array(props.args.length).fill(""),
      amount: "",
      unit: "aer"
    };

    this._onArgumentValueChange = this._onArgumentValueChange.bind(this);
    this._onAmountChange = this._onAmountChange.bind(this);
    this._onUnitChange = this._onUnitChange.bind(this);
  }

  get values() {
    return this.state.args;
  }

  get amount() {
    return new Amount(this.state.amount, this.state.unit).toUnit("aer").toString();
  }

  _onArgumentValueChange(e, index) {
    const newValue = e.target.value;
    const newArgs = this.state.args.map((oldValue, i) => {
      return index === i ? newValue : oldValue;
    });
    logger.debug("new arguments", index, newValue, newArgs);
    this.setState({ args: newArgs });
  }

  _onAmountChange(e) {
    const newValue = e.target.value;
    this.setState({ amount: newValue.toString() });
  }

  _onUnitChange(target) {
    const newValue = target.value;
    this.setState({ unit: newValue });
  }

  _generateArgsDisplay() {
    let argumentDisplay = noArgumentsDisplay;

    if (this.state.args.map(a => a.trim())
          .filter(a => "" !== a)
          .length > 0) {
      argumentDisplay = "[" + this.state.args.join(", ") + "]";
    }

    return argumentDisplay;
  }

  _generateAmountDisplay() {
    return "" !== this.state.amount ? (this.state.amount + " " + this.state.unit) : "";
  }

  render() {
    const argumentDisplay = this._generateArgsDisplay();
    const amountDisplay = this._generateAmountDisplay();

    const argumentComponents = this.props.args.map((arg, index) => {
      return (
        <ArgumentRow key={index}>
          <ArgumentName name={arg} />
          <InputBox
            class='component-inputbox-argument'
            onChange={e => this._onArgumentValueChange(e, index)}
            defaultValue=""
          />
        </ArgumentRow>
      );
    });

    if (this.props.payable) {
      argumentComponents.push((
        <ArgumentRow>
          <ArgumentName name="Amount" />
          <InputBox
            type="number"
            class='component-inputbox-argument'
            onChange={this._onAmountChange}
            defaultValue=""
          />
          <SelectBox
            class='component-selectbox-unit'
            value={this.state.unit}
            options={units}
            onChange={this._onUnitChange}
          />
        </ArgumentRow>
      ));
    }

    const argumentsTextBoxClass = argumentDisplay === noArgumentsDisplay ?
      'component-textbox-no-arguments' : 'component-textbox-arguments';
    const trigger = (
      <div>
        <TextBox class={argumentsTextBoxClass} text={argumentDisplay} />
        <TextBox class='component-textbox-amount' text={amountDisplay} />
      </div>
    );

    return (
      <Foldable
        isOpen={false}
        transitionTime={1}
        trigger={trigger}
      >
        {argumentComponents}
      </Foldable>
    );
  }

}