var reg = require("cla/reg");

reg.register('service.groovy.run', {
    name: _('Run Groovy Code'),
    icon: '/plugin/cla-groovy-plugin/icon/groovy.svg',
    form: '/plugin/cla-groovy-plugin/form/groovy-form.js',
    rulebook: {
        moniker: 'groovy_script',
        description: _('Executes Groovy script'),
        required: ['server', 'remote_temp_path', 'code'],
        allow: ['server', 'remote_temp_path', 'code', 'groovy_path', 'groovy_args', 'user', 'errors'],
        mapper: {
            'remote_temp_path': 'remoteTempPath',
            'groovy_path': 'groovyPath',
            'groovy_args': 'groovyArgs'
        },
        examples: [{
            groovy_script: {
                server: 'groovy_script',
                user: 'clarive_user',
                remote_temp_path: "/tmp/scripts/",
                groovy_path: "",
                groovy_args: ["-d"],
                code: `println "Hello World"`,
                errors: "fail"
            }
        }]
    },
    handler: function(ctx, config) {

        var log = require("cla/log");
        var fs = require("cla/fs");
        var path = require('cla/path');
        var reg = require('cla/reg');
        var ci = require('cla/ci');
        var proc = require("cla/process");
        var CLARIVE_TEMP = proc.env('TMPDIR');
        var filePath;
        var errors = config.errors || "fail";
        var server = config.server;
        var response;
        var remoteTempPath = config.remoteTempPath || "";
        var isJob = ctx.stash("job_dir");
        var groovyPath = config.groovyPath || "";
        var fileName = "clarive-groovy-code-" + Date.now() + ".groovy";
        var user = config.user || "";

        if (server == "") {
            log.fatal(_("No server selected"));
        }
        var serverCheck = ci.findOne({
            mid: server + ''
        });
        if (!serverCheck){
            log.fatal(_("Server Resource doesn't exist"));
        }

        function remoteCommand(params, command, server, errors, user) {
            var output = reg.launch('service.scripting.remote', {
                name: _('Groovy execute'),
                config: {
                    errors: errors,
                    server: server,
                    user: user,
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

        function shipFiles(server, filePath, remoteTempPath, user) {
            var output = reg.launch('service.fileman.ship', {
                name: _('Groovy ship file'),
                config: {
                    server: server,
                    user: user,
                    local_path: filePath,
                    remote_path: remoteTempPath
                }
            });
        }


        if (isJob) {
            filePath = path.join(isJob, fileName);
            fs.createFile(filePath, config.code);
        } else {
            filePath = path.join(CLARIVE_TEMP, fileName);
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

        shipFiles(server, filePath, remoteTempPath, user);
        var remoteFilePath = path.join(remoteTempPath, fileName);
        var groovyRemoteCommand = groovyCommand + groovyParams + " " + remoteFilePath;

        log.info(_("Executing Groovy code"));
        response = remoteCommand(config, groovyRemoteCommand, server, errors, user);
        reg.launch('service.scripting.remote', {
            name: _('Groovy remove file'),
            config: {
                errors: errors,
                server: server,
                user: user,
                path: "rm " + remoteFilePath
            }
        });
        log.info(_("Groovy code executed: "), response.output);
        fs.deleteFile(filePath);

        return response.output;
    }
});