const path = require('path');
var fs = require('fs');

function copyFileSync( source, target ) {

    var targetFile = target;

    //if target is a directory a new file with the same name will be created
    if ( fs.existsSync( target ) ) {
        if ( fs.lstatSync( target ).isDirectory() ) {
            targetFile = path.join( target, path.basename( source ) );
        }
    }

    fs.writeFileSync(targetFile, fs.readFileSync(source));
}

function copyFolderRecursiveSync( source, target ) {
    var files = [];

    //check if folder needs to be created or integrated

    var targetFolder = path.join( target, path.basename( source ) );
    //var targetFolder = path.join( target );
    if ( !fs.existsSync( targetFolder ) ) {
        fs.mkdirSync( targetFolder );
    }

    //copy
    if ( fs.lstatSync( source ).isDirectory() ) {
        files = fs.readdirSync( source );
        files.forEach( function ( file ) {
            var curSource = path.join( source, file );
            if ( fs.lstatSync( curSource ).isDirectory() ) {
                copyFolderRecursiveSync( curSource, targetFolder );
            } else {
                copyFileSync( curSource, targetFolder );
            }
        } );
    }
}

function createCustomPlugin() {
    console.log('called');
    plugin_directory = process.env.APPDATA + '\\Franz\\Plugins\\';
    plugin_name = 'test'
//    plugin_name = document.getElementById("plugin-name").value;
//    console.log(plugin_name);
//    plugin_url = document.getElementById("plugin-url").value;
//    console.log(plugin_url);
    copyFolderRecursiveSync( plugin_directory + 'plugin-creator\\.', plugin_directory + plugin_name );
}

createCustomPlugin();
