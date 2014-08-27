/**
* THIS IS: a sample to show you how to work with require for your project and include DreamEngine (for require ofc)
*
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
* @constructor
* main.js
write here the function launching the engine
**/

define( [ 'gameLoop', 'Game', 'DE.imagesDatas', 'DE.audiosList', 'DE.inputsList'
      , 'DE.achievements', 'DE.dictionary' ],
function( gameLoop, Game, images, audios, inputs
      , achievements, dictionary )
{
  // make a function, will be called by engine
  function launch( DreamE )
  {
    DreamE.CONFIG.notifications.gamepadEnable = false;
    DreamE.CONFIG.notifications.gamepadChange = false;
    DreamE.init(
    {
      'customLoop': gameLoop, 'onReady': Game.init
      , 'onStart': Game.start, 'loader': { "scale": 2 }
      , 'images': images, 'audios': audios
      , 'inputs': inputs, 'dictionary': dictionary
      , 'about': { 'gameName': 'Constellations', 'gameVersion': '0.0.1', 'namespace': 'constellations' }
      , 'saveModel': {
        'settings': { 'volume': 40, 'muted': false, 'quality': 0, 'reverse': 'no' }
        ,'playedOnce': false, 'rated': false, 'platformRated': false
        ,'localHighScore': 0, 'onlineHighScore': 0
      }
      , 'achievements': achievements
      // grunt regex plug system
      , 'ignoreNebula': true // usefull while we wait for the platform launch
    } );
  }
  
  return launch;
} );