var reg = require("cla/reg");

reg.register('service.groovy.run', {
    name: _('Run Groovy Code'),
    icon: '/plugin/cla-groovy-plugin/icon/groovy.svg',
    form: '/plugin/cla-groovy-plugin/form/groovy-form.js',
    roles: ["EsxiVmware"],
    handler: function(ctx, config) {

        var ci = require("cla/ci");
        var log = require("cla/log");
        var fs = require("cla/fs");
        var path = require('cla/path');
        var reg = require('cla/reg');
        var proc = require("cla/process");
        var CLARIVE_BASE = proc.env('CLARIVE_BASE');
        var CLARIVE_TEMP = proc.env('TMPDIR');
        var filePath;
        var errors = config.errors;
        var server = config.server;
        var response;
        var remoteTempPath = config.remoteTempPath;
        var isJob = ctx.stash("job_dir");
        var groovyPath = config.groovyPath;

        function remoteCommand(params, command, server, errors) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Groovy execute'),
                config: {
                    errors: errors,
                    server: server,
                    path: command,
                    output_error: params.output_error,
                    output_warn: params.output_warn,
                    output_capture: params.output_capture,
                    output_ok: params.output_ok,
                    meta: params.meta,
                    rc_ok: params.rcOk,
                    rc_error: params.rcError,
                    rc_warn: params.rcWarn
                }
            });
            return output;
        }

        function shipFiles(server, filePath, remoteTempPath) {
            var output = reg.launch('service.fileman.ship', {
                name: _('Groovy ship file'),
                config: {
                    server: server,
                    local_path: filePath,
                    remote_path: remoteTempPath
                }
            });
        }


        if (isJob) {
            filePath = path.join(isJob, "groovy-code.groovy");
            fs.createFile(filePath, config.code);
        } else {
            filePath = path.join(CLARIVE_TEMP, "groovy-code.groovy");
            fs.createFile(filePath, config.code);
        }

        var groovyArgs = config.groovyArgs || [];
        var groovyParams = groovyArgs.join(" ");
        var groovyCommand;
        if (groovyPath == '') {
            groovyCommand = "groovy "
        } else {
            groovyCommand = groovyPath + " ";
        }

        shipFiles(server, filePath, remoteTempPath);
        var remoteFilePath = path.join(remoteTempPath, "groovy-code.groovy");
        var groovyRemoteCommand = groovyCommand + groovyParams + " " + remoteFilePath;

        log.info(_("Executing Groovy code"));
        response = remoteCommand(config, groovyRemoteCommand, server, errors);
        reg.launch('service.scripting.remote', {
            name: _('Groovy remove file'),
            config: {
                errors: errors,
                server: server,
                path: "rm " + remoteFilePath
            }
        });
        log.info(_("Groovy code executed: "), response.output);
        fs.deleteFile(filePath);

        return response.output;
    }
});