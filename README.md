# Groovy Plugin

Groovy plugin will allow you to execute a Groovy code in Clarive and see its result.

## Requirements

To be able to use the plugin correctly, you must have Groovy installed in your Clarive instance.

## Installing

To install the plugin, place the cla-groovy-plugin folder inside `CLARIVE_BASE/plugins`
directory in the Clarive instance.

## How to Use

Once the plugin is placed in its folder, you can start using it by going to your Clarive
instance.

After restarting your Clarive's instance, you will have a new palette service called 'Run Groovy code'.

### Run Groovy code

The service will execute the code you write in it on the server you specify.
The service will create a temporal file with the code which will be shipped to the specified server.

The parameters available for this service are:

- **Server** - The GenericServer Resource where you wish to execute the code.
- **Groovy path** - Full path for Groovy launching script, including the file. If you leave it empty, the plugin will
launch *Groovy* as a system environment variable.
- **Groovy parameters** - Additional flags for the Groovy command.
- **Remote temporary path** - Temporary path to which the file with the code will be shipped.
- **Groovy code editor** - Write here the code you wish to execute.
- **Errors and output** - These two fields are deal with managing control errors. The options are:
   - **Fail and output error** - Search for configured error pattern in script output. If found, an error message is
   displayed in the monitor showing the match.
   - **Warning and output warning** - Search for configured warning pattern in script output. If found, an error message
   is displayed in the monitor showing the match.
   - **Custom** - If combo box errors is set to custom, a new form is displayed to define the behavior with these
   fields:
   - **OK** - Range of return code values for the script to have succeeded. No message will be displayed in the monitor.
   - **Warning** - Range of return code values to warn the user. A warning will be displayed in monitor.
   - **Error** - Range of return code values for the script to have failed. An error message will be displayed in
   the monitor.

The plugin will return all the console output you set in the Groovy code.

Configuration example:

      Server: groovy_server
      Groovy path: /sytem/groovy.sh
      Groovy parameters: -d
      Remote temporal path: /tmp
      Groovy code editor: println "Hello World"
				def x = 42
				println x.getClass()
				x = "Hello World"
				println x.getClass()
