/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
*
* @singleton
* imagesList
this is the imagesList will be available in the project.
Please declare in the same way than this example.
To load image as default just set "load" to true.
Otherwhise you can load/add images when you want, load images by calling the DREAM_ENGINE.ImageManager.pushImage function

- [ name, url, extension, 
parameters: load:Bool, totalFrame:Int, totalLine:Int, eachAnim:Int (ms), isAnimated:Bool, isReversed:Bool
] -

All parameters are optionnal but at least an empty object need to be set
**/

define( [ 'DE.CONFIG' ],
function( CONFIG )
{
  var datas = {
    // avalaible images sizes (engine will load optimisest images depends on user resolution)
    screenSizes: [
      { "w": 600, "h": 720, "path": "md/" }
      // , { "w": 1920, "h": 1080, "path": "hd/" }
      // , { "w": 640, "h": 360, "path": "sd/" }
    ]
    
    // index of the used screen size during game conception
    , conceptionSizeIndex: 0
    
    // images folder name 
    , folderName: "img"
	  
    , imagesList: [
      [ "bg", "bg", "png", { "load": true, "isAnimated": false } ]
      ,[ "bg-game", "bg-game", "png", { "load": true, "isAnimated": false } ]
      ,[ "jauge", "jauge", "png", { "load": true, "isAnimated": false } ]
      ,[ "jaugeFeedbacks", "jaugeFeedbacks", "png", { "load": true, "isAnimated": false, "totalFrame": 2 } ]
      ,[ "stars-success", "stars-success", "png", { "load": true, "isAnimated": true, "totalFrame": 8
          , "totalLine": 1, "eachAnim": 70, "isLoop": false } ]
      
      ,[ "circles", "circles", "png", { "load": true, "isAnimated": false, "totalFrame": 4, "totalLine": 4 } ]
      
      ,[ "btn-large", "btn-large", "png", { "load": true, "isAnimated": false, "totalFrame": 3, "totalLine": 1 } ]
      ,[ "btn-help", "btn-help", "png", { "load": true, "isAnimated": false, "totalFrame": 3, "totalLine": 1 } ]
      ,[ "btn-sound", "btn-sound", "png", { "load": true, "isAnimated": false, "totalFrame": 3, "totalLine": 2 } ]
      ,[ "btn-close", "btn-close", "png", { "load": true, "isAnimated": false, "totalFrame": 3, "totalLine": 1 } ]
      
      ,[ "bg-star", "bg-star", "png", { "load": true, "isAnimated": false } ]
      ,[ "bg-star2", "bg-star2", "png", { "load": true, "isAnimated": false } ]
      ,[ "bg-star3", "bg-star3", "png", { "load": true, "isAnimated": false } ]
      ,[ "bg-star4", "bg-star4", "png", { "load": true, "isAnimated": false } ]
      ,[ "front-star", "front-star", "png", { "load": true, "isAnimated": false } ]
      ,[ "front-star2", "front-star2", "png", { "load": true, "isAnimated": false } ]
      ,[ "front-star3", "front-star3", "png", { "load": true, "isAnimated": false } ]
      ,[ "front-star4", "front-star4", "png", { "load": true, "isAnimated": false } ]
    ]
  };
	return datas;
} );