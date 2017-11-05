# Groovy Plugin

<img src="https://cdn.rawgit.com/clarive/cla-groovy-plugin/master/public/icon/groovy.svg?sanitize=true" alt="Groovy Plugin" title="Groovy Plugin" width="120" height="120">

Groovy plugin will allow you to execute a Groovy code in Clarive and see its result.

## What is Groovy

Groovy is a powerful, optionally typed and dynamic language, with static-typing and static compilation capabilities, for the Java platform aimed at improving developer productivity thanks to a concise, familiar and easy to learn syntax.

## Requirements

To be able to use the plugin correctly, you must have Groovy installed in your Clarive instance.

## Installing

To install the plugin, place the cla-groovy-plugin folder inside `$CLARIVE_BASE/plugins`
directory in the Clarive instance.

### Run Groovy code

The various parameters are:

- **Server (variable name: server)** - The GenericServer Resource where you wish to execute the code.
- **User (user)** - User which will be used to connect to the server.
- **Groovy path (groovy_path)** - Full path for Groovy launching script, including the file. If you leave it empty, the plugin will
launch *Groovy* as a system environment variable.
- **Groovy parameters (groovy_args)** - Additional flags for the Groovy command.
- **Remote temporary path (remote_temp_path)** - Temporary path to which the file with the code will be shipped.
- **Groovy code editor (code)** - Write here the code you wish to execute.

**Only Clarive EE**

- **Errors and Output** - These two fields deal with managing control errors. The options are:
   - **Fail and Output Error** - Search for the configured error pattern in the script output. If found, an error
     message is displayed in the monitor showing the match.
   - **Warning and Output warning** - Search for the configured warning pattern in the script output. If found, an error
     message is displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed to define the behavior with these
     fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
   - **Warn** - Range of return code values to warn the user. A warning will be displayed in the monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in the
     monitor.

## How to use

### In Clarive EE

Once the plugin is placed in its folder, you can find this service in the palette in the section of generic service and can be used like any other palette op.

Op Name: **Run Groovy code**

Example:

```yaml
      Server: groovy_server
      Groovy path: /sytem/groovy.sh
      Groovy parameters: -d
      Remote temporal path: /tmp
      Groovy code editor: println "Hello World"
            def x = 42
            println x.getClass()
            x = "Hello World"
            println x.getClass()
``` 

### In Clarive SE

#### Rulebook

If you want to use the plugin through the Rulebook, in any `do` block, use this ops as examples to configure the different parameters:

```yaml
rule: Groovy demo
do:
   - groovy_script:
       server: groovy_server        # Required. Use the mid set to the resource you created
       user: clarive_user    
       remote_temp_path: "/tmp"     # Required
       ruby_args: ["-d"]         
       code: |                      # Required
          println "Hello World"
```

##### Outputs

###### Success

The plugin will return all the console output you set in the Groovy code.

```yaml
do:
    - myvar = groovy_script:
       server: groovy_server        # Required. Use the mid set to the resource you created
       user: clarive_user    
       remote_temp_path: "/tmp"     # Required
       ruby_args: ["-d"]         
       code: |                      # Required
          println "Hello World"
    - echo: ${myvar}
```

For this command the output will be similar to this one:

```yaml
Hello World
```

###### Possible configuration failures

**Code failed**

```yaml
Error running remote script
```

Make sure that the option is available and you code is correct to be executed in Groovy.

**Variable required**

```yaml
Error in rulebook (compile): Required argument(s) missing for op "groovy_script": "server"
```

Make sure you have all required variables defined.

**Not allowed variable**

```yaml
Error in rulebook (compile): Argument `Code` not available for op "groovy_script"
```

Make sure you are using the correct paramaters (make sure you are writing the variable names correctly).

## More questions?

Feel free to join **[Clarive Community](https://community.clarive.com/)** to resolve any of your doubts.