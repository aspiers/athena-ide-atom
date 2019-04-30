import React from 'react';
import Popup from 'reactjs-popup';
import {inject, observer} from 'mobx-react';
import PropTypes from 'prop-types';
import logger from 'loglevel';

import {Row, Title, Description, InputBox, Button} from '../../atoms';

@inject('contractStore')
@observer
export default class NewNodeModal extends React.Component {

  static get propTypes() {
    return {
      contractStore: PropTypes.any,
      trigger: PropTypes.element
    };
  }

  constructor(props) {
    super(props);
    this.contractInputRef = React.createRef();
  }

  _onConfirm() {
    logger.debug("Add node button clicked");
    const contract = this.contractInputRef.current.value;
    this.props.contractStore.addContract(contract);
  }

  render() {
    return (
      <Popup modal trigger={this.props.trigger}>
        {close =>
          <atom-panel class='modal'>
            <div>
              <Row>
                <Title title='Enter contract address' />
              </Row>
              <Row>
                <Description description='Contract' />
                <InputBox ref={this.contractInputRef} type='text'
                    placeHolder='eg. Amg6TQrTd6f7dE67PBzv6vbVDnxpEnzKpRfRbV46NNNDhjqmdk77'/>
              </Row>
              <Row class='components-row-button'>
                <Button name='Cancel' onClick={close}/>
                <Button name='Ok' class='component-btn-rightmost' onClick={() => { this._onConfirm(); close(); }} />
              </Row>
            </div>
          </atom-panel>
        }
      </Popup>
    );
  }

}
