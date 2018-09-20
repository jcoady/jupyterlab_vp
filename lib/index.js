"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var disposable_1 = require("@phosphor/disposable");
/**
 * The plugin registration information.
 */
var plugin = {
    activate: activate,
    id: 'jupyterlab_vp',
    autoStart: true
};
/**
 * A notebook extension to support VPython in Jupyterlab
 */
var VPythonExtension = /** @class */ (function () {
    function VPythonExtension() {
    }
    /**
     * Create a new extension object.
     */
    VPythonExtension.prototype.createNew = function (panel, context) {
        Promise.all([panel.revealed, panel.session.ready, context.ready]).then(function () {
            var session = context.session;
            var kernelInstance = session.kernel;
            window.JLab_VPython = true;
            kernelInstance.registerCommTarget('glow', function (comm) {
                // Use Dynamic import() Expression to import glowcomm when comm is opened
                Promise.resolve().then(function () { return require("./glowcomm"); }).then(function (glowcomm) {
                    glowcomm.comm2 = comm;
                    comm.onMsg = glowcomm.onmessage;
                });
                comm.onClose = function (msg) { console.log("comm onClose"); };
            });
        });
        return new disposable_1.DisposableDelegate(function () {
        });
    };
    return VPythonExtension;
}());
exports.VPythonExtension = VPythonExtension;
/**
 * Activate the extension.
 */
function activate(app) {
    app.docRegistry.addWidgetExtension('Notebook', new VPythonExtension());
}
;
/**
 * Export the plugin as default.
 */
exports.default = plugin;
