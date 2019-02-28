'use babel';

/* eslint-disable */

import {CompositeDisposable} from 'atom';
import {install} from 'atom-package-deps';
import logger from 'loglevel';

import {EventDispatcher} from './event';
import {
  AutoCompleteService, LintService,
  CompileService, NodeService, AccountService, ContractService
} from './service';
import {AutoCompleteProvider, LintProvider, AthenaIdeView, ConsoleView, NotificationView} from './view';

export default {

  eventDispatcher: null,
  services: {},
  views: {},
  subscriptions: null,

  // keep two provider as singleton since we can't control its view directly
  autoCompleteProvider: new AutoCompleteProvider(),
  lintProvider: new LintProvider(),

  activate(state) {
    install('athena-ide-atom').then(() => {
      logger.info("All dependeicies are installed");
    }).catch(err => {
      logger.error(err);
    });
    this.eventDispatcher = new EventDispatcher();
    this.services = this._buildServices(this.eventDispatcher);
    this.views = this._buildViews(this.services);
    this.eventDispatcher.setupListeners(this.views);
    this.subscriptions = this._buildSubscriptions();
  },

  deactivate() {
    this.eventDispatcher = null;
    Object.keys(this.views).forEach(key => this.views[key].distroy());
    this.views = null;
    this.services = null;
    this.subscriptions.dispose();
    this.subscriptions = null;
  },

  _buildServices(eventDispatcher) {
    const nodeService = new NodeService(eventDispatcher);
    const accountService = new AccountService(nodeService, eventDispatcher);
    return {
      autoCompleteService: new AutoCompleteService(eventDispatcher),
      lintService: new LintService(eventDispatcher),
      compileService: new CompileService(eventDispatcher),
      nodeService: nodeService,
      accountService: accountService,
      contractService: new ContractService(nodeService, accountService, eventDispatcher)
    };
  },

  _buildViews(services) {
    // two providers are considerd as view
    this.autoCompleteProvider.bindServices(services);
    this.lintProvider.bindServices(services);
    return {
      athenaIdeView: new AthenaIdeView(services),
      consoleView: new ConsoleView(),
      notificationView: new NotificationView()
    };
  },

  _buildSubscriptions() {
    const subscriptions = new CompositeDisposable();
    subscriptions.add(atom.commands.add('atom-text-editor', {
      'athena-ide:compile': () => {
        const absolutePath = atom.workspace.getActiveTextEditor().getBuffer().getPath();
        const pathInfo = atom.project.relativizePath(absolutePath);
        const projectRoot = pathInfo[0];
        const relativePath = pathInfo[1];
        this.services.compileService.compile(projectRoot, relativePath);
      }
    }));
    subscriptions.add(atom.commands.add('atom-workspace', {
      'athena-ide-view:show': () => {
        this.views.athenaIdeView.show();
        this.views.consoleView.show();
      }
    }));
    return subscriptions;
  },

  getProvider () {
    return this.autoCompleteProvider;
  },

  getLinter () {
    return this.lintProvider;
  },

};