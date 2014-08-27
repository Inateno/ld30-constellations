/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* audioList
this is the audioList will be available in the project.
Please declare in the same way than this example.
To load audio as default just set "load" to true.
Otherwhise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function

- [ name, url, extension, 
parameters: load:Bool, totalFrame:Int, totalLine:Int, eachAnim:Int (ms), isAnimated:Bool, isReversed:Bool
] -

All parameters are optionnal but at least an empty object need to be set
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
	var audioList = [
		// [ "example", "img/example", "png", { "load": true, "totalFrame": 4, "totalLine": 2, "eachAnim": 50, "isAnimated":true, "isReversed": false } ]
		// Nebula / Engine
		[ "achievement-unlocked", "audio/achievement-unlocked", [ 'ogg', 'mp3' ], { "preload": true, "loop": false } ]
		,[ "click", "audio/click", [ 'ogg', 'mp3' ], { "preload": true, "loop": false } ]
		,[ "fail", "audio/fail", [ 'ogg', 'mp3' ], { "preload": true, "loop": false } ]
		,[ "success", "audio/success", [ 'ogg', 'mp3' ], { "preload": true, "loop": false } ]
		,[ "second", "audio/second", [ 'ogg', 'mp3' ], { "preload": true, "loop": false } ]
		,[ "gameover", "audio/gameover", [ 'ogg', 'mp3' ], { "preload": true, "loop": false } ]
		
		// MUSICS
		,[ "game_music", "audio/BGM_Game", [ 'ogg', 'mp3' ], { "preload": true, "loop": true, "isMusic": true } ]
		// ,[ "menu_music", "audio/BGM_Menu", [ 'ogg', 'mp3' ], { "preload": true, "loop": true, "isMusic": true } ]
	];
	
	if ( CONFIG.DEBUG && CONFIG.DEBUG_LEVEL >= 3 )
	{
		console.log( "audioList loaded" );
	}
	return audioList;
} );