(function(params) {
    var data = params.data;

    var serverComboBox = Cla.ui.ciCombo({
        name: 'server',
        role: 'Server',
        fieldLabel: _('Server'),
        value: data.server || '',
        allowBlank: false,
        width: 400,
        with_vars: 1
    });
    
    var groovyPathTextField = Cla.ui.textField({
        name: 'groovyPath',
        fieldLabel: _('Groovy path'),
        value: params.data.groovyPath || '',
    });

    var argumentsTextField = Cla.ui.arrayGrid({
        name: 'groovyArgs',
        fieldLabel: _('Groovy parameters'),
        value: params.data.groovyArgs,
        description: _('Groovy parameters'),
        default_value: '.',
    });

    var groovyCodeEditor = Cla.ui.codeEditor({
        name: 'code',
        fieldLabel: _('Code Editor'),
        value: params.data.code || '',
        mode: 'Groovy',
        height: 500,
        anchor: '100%'
    });

    var remoteTempPathTextField = Cla.ui.textField({
        name: 'remoteTempPath',
        fieldLabel: _('Remote temp path'),
        value: params.data.remoteTempPath || '',
        allowBlank: false
    });

    var errorBox = Cla.ui.errorManagementBox({
        errorTypeName: 'errors',
        errorTypeValue: params.data.errors || 'fail',
        rcOkName: 'rcOk',
        rcOkValue: params.data.rcOk,
        rcWarnName: 'rcWarn',
        rcWarnValue: params.data.rcWarn,
        rcErrorName: 'rcError',
        rcErrorValue: params.data.rcError,
        errorTabsValue: params.data
    });

    var panel = Cla.ui.panel({
        layout: 'form',
        items: [
            serverComboBox,
            groovyPathTextField,
            argumentsTextField,
            remoteTempPathTextField,
            groovyCodeEditor,
            errorBox
        ]
    });


    return panel;
})