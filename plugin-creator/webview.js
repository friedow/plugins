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
    //var targetFolder = path.join( target, path.basename( source ) );
    var targetFolder = path.join( target );
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

copyFolderRecursiveSync( process.env.APPDATA + '\\Franz\\Plugins\\custom-plugin-creator', process.env.APPDATA + '\\Franz\\Plugins\\first-custom-plugin' );


module.exports = (Franz, options) => {
  let updates = 0;
  const modal = document.createElement('div');

  function showModal (text) {
    show(modal);
    modal.querySelector('p').innerHTML = text;
    updates += 1;
  }

  function hideModal () {
    hide(modal);
    modal.querySelector('p').innerHTML = '';
    updates -= 1;
  }

  // Replace window.alert to hide alerts in Franz
  const oldAlert = window.alert;
  window.alert = function () {
    // when Google Calendar displays an alert notify the user
    showModal.apply(oldAlert, arguments);
  };

  function show (element) {
    element.style.display = 'inherit';
  }

  function hide (element) {
    element.style.display = 'none';
  }

  const getMessages = () => {
    // get unread messages
    //const updates = document.getElementById('franz').getAttribute('data-unread');

    // get conversations in 'My Inbox'
    //const inbox = document.getElementById('franz').getAttribute('data-inbox');

    // set Franz badge
    // updates => passive unread count
    // inbox => active unread count
    Franz.setBadge(0, updates);
  };

  modal.id = 'franz-modal';
  modal.innerHTML = '<div class="modal-content"><span class="close">&times;</span><p></p></div>';
  modal.querySelector('.close').addEventListener('click', hideModal);
  document.body.appendChild(modal);

  const form = document.createElement('form');
  form.innerHTML = 'Name:<br><input type="text" name="plugin-name"><br>URL:<br><input type="text" name="plugin-url"><br><input type="submit" name="submit">';
  document.body.appendChild(form);

  document.addEventListener('keydown', function(e) { if (e.keyCode === 27) { hideModal(); } });

  // inject franz.css stylesheet
  Franz.injectCSS(path.join(__dirname, 'css', 'modal.css'));

  // check for new messages every second and update Franz badge
  Franz.loop(getMessages);
};
