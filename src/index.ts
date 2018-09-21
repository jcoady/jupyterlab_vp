import {
  IDisposable, DisposableDelegate
} from '@phosphor/disposable';

import {
  JupyterLab, JupyterLabPlugin
} from '@jupyterlab/application';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';

import {
  NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';



/**
 * The plugin registration information.
 */
const plugin: JupyterLabPlugin<void> = {
  activate,
  id: 'jupyterlab_vp',
  autoStart: true
};

/**
 * A notebook extension to support VPython in Jupyterlab
 */
export
class VPythonExtension implements DocumentRegistry.IWidgetExtension<NotebookPanel, INotebookModel> {
  /**
   * Create a new extension object.
   */
  createNew(panel: NotebookPanel, context: DocumentRegistry.IContext<INotebookModel>): IDisposable {

    Promise.all([panel.revealed, panel.session.ready, context.ready]).then(function() {
		const session = context.session;
		const kernelInstance = session.kernel;
		(<any>window).JLab_VPython = true;
				
		kernelInstance.registerCommTarget('glow', (comm) => {
			// Use Dynamic import() Expression to import glowcomm when comm is opened
			import("./glowcomm").then(glowcomm => {
				glowcomm.comm = comm
			    comm.onMsg = glowcomm.onmessage
			});
			
			comm.onClose = (msg) => {console.log("comm onClose");};
		});
		
    });
	
    return new DisposableDelegate(() => {
    });

  }
}

/**
 * Activate the extension.
 */
function activate(app: JupyterLab) {
  app.docRegistry.addWidgetExtension('Notebook', new VPythonExtension());
};



/**
 * Export the plugin as default.
 */
export default plugin;