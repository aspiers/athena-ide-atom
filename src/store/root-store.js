import logger from 'loglevel';

import AccountStore from './account-store';
import ConsoleStore from './console-store';
import ContractStore from './contract-store';
import DeployTargetStore from './deploy-target-store';
import NodeStore from './node-store';
import NotificationStore from './notification-store';

export default class RootStore {

  constructor() {
    this.stores = {
      accountStore: new AccountStore(this),
      consoleStore: new ConsoleStore(this),
      contractStore: new ContractStore(this),
      deployTargetStore: new DeployTargetStore(this),
      nodeStore: new NodeStore(this),
      notificationStore: new NotificationStore(this),
    };
  }

  serialize() {
    const rawSerialized = Object.keys(this.stores).map(key => this.stores[key].serialize());
    const data = JSON.parse(JSON.stringify(rawSerialized));
    logger.debug("Serialize", data);
    return data;
  }

  deserialize({data}) {
    logger.debug("Deserialize", data);
    Object.keys(this.stores).map((key, index) => this.stores[key].deserialize(data[index]));
  }

  get accountStore() {
    return this.stores.accountStore;
  }

  get consoleStore() {
    return this.stores.consoleStore;
  }

  get contractStore() {
    return this.stores.contractStore;
  }

  get deployTargetStore() {
    return this.stores.deployTargetStore;
  }

  get nodeStore() {
    return this.stores.nodeStore;
  }

  get notificationStore() {
    return this.stores.notificationStore;
  }

}
