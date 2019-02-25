'use babel';

/* eslint-disable */

import React from 'react';
import ReactDOM from 'react-dom';
import logger from 'loglevel';

import AthenaIdeViewRoot from './react';

export default class AtheneIdeView {

  constructor(services) {
    this.element = document.createElement('atom-panel');
    this.element.appendChild(this._buildRoot());
    this.context = this._buildContext(services);
  }

  _buildRoot() {
    let rootNode = document.createElement('div');
    let attribute = document.createAttribute('id');
    attribute.value = 'athena-ide-panel-root';
    rootNode.setAttributeNode(attribute);
    rootNode.setAttribute('tabindex', '-1');
    return rootNode;
  }

  _buildContext(services) {
    // TODO : refactor those into model
    return {
      current: {
        file: "",
        node: {
          url: "localhost:7845",
          height: "unknown"
        },
        account: {
          accountAddress: "",
          balance: "",
          nonce: "",
        },
        contract: {
          fee: {
            price: "",
            limit: ""
          },
          contractAddress: ""
        }
      },
      store: {
        file2CompiledResult: new Map(),
        nodeUrls: new Set(["localhost:7845", "testnet.aergo.io:7845"]),
        addresses: new Set(),
        contract2Abi: new Map()
      },
      services: services
    };
  }

  getElement() {
    return this.element;
  }

  getTitle() {
    return 'Athena Ide';
  }

  getPath() {
    return 'athena-ide-view';
  }

  getUri() {
    return `particle-dev://editor/${this.getPath()}`;
  }

  getDefaultLocation() {
    return 'right';
  }

  show() {
    atom.workspace.getRightDock().show();
    logger.debug("Show ide view, context:", this.context);
    atom.workspace.open(this, {activatePane: false}).then(() => {
      ReactDOM.render(
        <AthenaIdeViewRoot context={this.context}/>,
        document.getElementById('athena-ide-panel-root')
      );
    });
  }

  distroy() {
    // TODO : remove view from the bottom dock
  }

  newCompileInfo(compileResult) {
    logger.debug("Update view with new compile result", compileResult);
    const file = compileResult.file;
    this.context.store.file2CompiledResult.set(file, compileResult);
    this.selectFile(file);
  }

  selectFile(file) {
    logger.debug("Update view with selected file", file);
    this.context.current.file = file;
    this.show();
  }

  selectNode(node) {
    logger.debug("Update view with selected node", node);
    const url = node.url;
    if (!this.context.store.nodeUrls.has(url)) {
      this.context.store.nodeUrls.add(url);
    }
    this.context.current.node = node;
    this.show();
  }

  selectAccount(account) {
    logger.debug("Update view with selected account", account);
    const accountAddress = account.accountAddress;
    const balance = account.balance;
    const nonce = account.nonce;
    if (!this.context.store.addresses.has(accountAddress)) {
      this.context.store.addresses.add(accountAddress);
    }
    this.context.current.account = {
      accountAddress: accountAddress,
      balance: balance,
      nonce: nonce
    }
    this.show();
  }

}