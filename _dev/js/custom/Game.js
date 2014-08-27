/**
* @ContributorsList
* @Inateno / http://inateno.com / http://dreamirl.com
*
***
simple Game class declaration example
**/

define( [ 'DREAM_ENGINE', 'datas', 'DE.Button', 'Objective', 'Linker' ],
function( DE, datas, Button, Objective, Linker )
{
  var Game = {};
  
  var _d = (Date.now()).toString(), _s;
  // init
  Game.init = function()
  {
    DE.Inputs.keyLocked = true;
    // console.log( "game init" );
    DE.CONFIG.DEBUG = false;
    DE.CONFIG.DEBUG_LEVEL = 0;
    
    // render
    Game.render = new DE.Render( "render", { fullScreen: "ratioStretch" } );
    Game.render.init();
    
    if ( DE.CONFIG.DEBUG )
    {
      window.Game = Game;
      window.DE = DE;
    }
    
    DE.start();
  }
  
  Game.start = function()
  {
    var marginTop = ( datas.screenH - datas.fieldSize ) / 2;
    
    Game.menuScene = new DE.Scene( "Menu" );
    Game.gameScene = new DE.Scene( "Game" );
    
    // make game
      var sc = Game.gameScene;
      var menu = Game.menuScene;
      Game.camera = new DE.Camera( datas.screenW, datas.screenH, 0, 0
        , { 'name': "Main camera", 'backgroundColor': "rgb(0,255,0)", 'gui': new DE.Gui() } );
      Game.camera.scene = Game.menuScene;
      Game.render.add( Game.camera );
      
      Game.menuObj = [];
      Game.gameObj = [];
      // visual stuff
        var bg = new DE.GameObject( {
          'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
          ,'zindex': 21
          ,'renderer': new DE.SpriteRenderer( { spriteName: "bg-game", 'alpha': 0.9 } )
        } );
        sc.add( bg );
      
      // linkers
        Game.currentLink = 0;
        Game.links = [];
        for ( var li = 0; li < datas.maxLinks; ++ li )
        {
          Game.links.push( new Linker( li ) );
          sc.add( Game.links[ li ].getObjects() );
        }
        Game.camera.onMouseMove = function( mouse )
        {
          if ( this.isDown )
            Game.links[ Game.currentLink ].updateMouse( mouse );
        };
        Game.camera.onLastMouseUp = function()
        {
          if ( Game.currentLink >= Game.links.length || Game.patternSuccessFeedback )
            return;
          this.isDown = false;
          Game.resetLinkers();
          // if ( !Game.links[ Game.currentLink ].colliderLink.stated )
          //   Game.links[ Game.currentLink ].disable();
        };
        DE.Event.on( "objective-down", Game.checkMouseDown, Game );
        DE.Event.on( "linker-collide", Game.linkerCollision, Game );
      
      // grid objects
        Game.gridObjects = [];
        var lineObjects = [];
        for ( var y = 0; y < datas.maxGridSize; ++y )
        {
          lineObjects = [];
          for ( var x = 0; x < datas.maxGridSize; ++x )
          {
            lineObjects.push( new Objective( x, y ) );
          }
          sc.add( lineObjects );
          Game.gridObjects.push( lineObjects );
        }
      
      // Gui / pattern
        Game.currentPattern = [];
        Game.patternPosition = 0;
        Game.guiPattern = [];
        for ( var n = 0; n < datas.maxLinks; ++n )
        {
          Game.guiPattern.push( new DE.GameObject( {
            'x': datas.guiPatternSize / 2 + datas.guiPatternSize * n + 10
            , 'y': datas.guiPatternSize + 40
            , 'zindex': 25
            ,'renderer': new DE.SpriteRenderer( {
              'spriteName': 'circles', 'scale': datas.guiPatternSize / datas.circleSize
            } )
          } ) );
          Game.guiPattern[ n ].enable = false;
        }
        Game.guiScore = new DE.GameObject( {
          'x': datas.screenW - 30, 'y': 90
          ,'renderer': new DE.TextRenderer( {
            'fillColor': "black", 'fontSize': 40, 'font': 'Helvetica Neue'
            ,'textAlign': 'left'
          }, 100, 50, "0" )
        } );
        var timer = new DE.GameObject( {
          'x': 0, 'y': 30, "zindex": 10
          ,'renderer': new DE.SpriteRenderer( { spriteName: 'jauge', offsetX: 255 } )
          // new DE.TextRenderer( {
          //   'fillColor': "black", 'fontSize': 40, 'font': 'Helvetica Neue'
          // }, 200, 100, "0" )
        } );
        timer.time = 5000;
        timer.add( new DE.GameObject( {
          'x': 0, 'y': 0, 'renderer': new DE.SpriteRenderer( { spriteName: "jaugeFeedbacks", offsetX: 9 } )
        } ) );
        timer.fb = timer.childrens[ 0 ];
        timer.owidth = timer.renderers[ 0 ].frameSizes.width;
        timer.tick = function()
        {
          if ( !this.running )
            return;
          this.time -= DE.Time.timeSinceLastFrameScaled;
          if ( this.time <= 0 )
          {
            this.running = false;
            _gameOver();
          }
          else
          {
            var s = this.time / 1000;
            // var ss = s >> 0;
            if ( s + 1 < this.lastSecond )
            {
              DE.AudioManager.fx.play( 'second' );
              this.lastSecond = s;
            }
            var ns = s * datas.secondWidth >> 0;
            this.renderers[ 0 ].frameSizes.width = ns <= 0 ? 1 : ns;
            this.renderers[ 0 ].sizes.width = this.renderers[ 0 ].frameSizes.width;
            if ( this.time + 1000 < this.changedAt )
              this.fb.enable = false;
          }
        };
        timer.addTime = function( time )
        {
          if ( this.time + time > datas.maxTime )
          {
            time = datas.maxTime - this.time;
            this.time = datas.maxTime;
          }
          else
            this.time += time;
          
          var s = Math.abs( time ) / 1000;
          var ns = s * datas.secondWidth >> 0;
          this.fb.renderers[ 0 ].currentFrame = 0;
          if ( time < 0 )
            this.fb.renderers[ 0 ].currentFrame = 1;
          this.fb.renderers[ 0 ].sizes.width = ns <= 0 ? 1 : ns;
          if ( time > 0 )
            this.fb.position.x = this.renderers[ 0 ].sizes.width + 1;
          this.fb.enable = true;
          
          ns = this.time / 1000 * datas.secondWidth >> 0;
          this.renderers[ 0 ].frameSizes.width = ns <= 0 ? 1 : ns;
          this.renderers[ 0 ].sizes.width = this.renderers[ 0 ].frameSizes.width;
          if ( time < 0 )
            this.fb.position.x = this.renderers[ 0 ].sizes.width + 1;
          
          this.lastSecond = this.time / 1000 >> 0;
          this.changedAt = this.time;
        }
        timer.reset = function( time )
        {
          this.time = time;
          this.renderers[ 0 ].frameSizes.width = this.time / 1000 * datas.secondWidth >> 0;
          this.renderers[ 0 ].sizes.width = this.renderers[ 0 ].frameSizes.width;
          this.running = true;
          this.lastSecond = this.time;
          this.tick();
        };
        timer.addAutomatism( "ticktick", "tick" );
        Game.guiTimer = timer;
        Game.camera.gui.add( Game.guiPattern, Game.guiScore, Game.guiTimer, new Button( {
            'x': 555, 'y': 30
            ,'zindex': 21
          }, {
            spriteRenderer: { 'spriteName': 'btn-close' }
            ,collider: { width: 90, height: 60 }
            ,sound: "click"
          }, {
            onMouseClick: function( mouse, propagation )
            {
              Game.showMenu();
            }
          } ) );
    
    // make menu
      Game.menuScene.add( new Button( {
          'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
          ,'zindex': 21
        }, {
          spriteRenderer: { 'spriteName': 'btn-large' }
          ,textRenderer: {
            'fillColor': "white", 'fontSize': 42, 'font': "Helvetica"
            , 'textWidth': 380, 'textHeight': 70, 'text': "Play"
          }
          ,collider: { width: 400, height: 100 }
          ,sound: "click"
        }, {
          onMouseClick: function( mouse, propagation )
          {
            Game.resetGame();
          }
        } ), new Button( {
          'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 + 140 >> 0
          ,'zindex': 21
        }, {
          spriteRenderer: { 'spriteName': 'btn-large' }
          ,textRenderer: {
            'fillColor': "white", 'fontSize': 42, 'font': "Helvetica"
            , 'textWidth': 380, 'textHeight': 70, 'text': "Scores"
          }
          ,collider: { width: 400, height: 100 }
          ,sound: "click"
        }, {
          onMouseClick: function( mouse, propagation )
          {
            _showScores();
          }
        } ), new Button( {
          'x': 50, 'y': datas.screenH - 50
          ,'zindex': 21
        }, {
          spriteRenderer: { 'spriteName': 'btn-help' }
          ,collider: { radius: 40 }
          ,sound: "click"
        }, {
          onMouseClick: function( mouse, propagation )
          {
            Game.panels.about.style.display = "block";
          }
        } ), new Button( {
          'x': datas.screenW - 50, 'y': datas.screenH - 50
          ,'zindex': 21
        }, {
          spriteRenderer: { 'spriteName': 'btn-sound' }
          ,collider: { radius: 40 }
          ,sound: "click"
        }, {
          onMouseClick: function( mouse, propagation )
          {
            // toggle sound
            DE.AudioManager.toggle();
            this.renderers[ 0 ].currentLine = DE.AudioManager.muted;
          }
        } ), new DE.GameObject( {
          'x': datas.screenW / 2 >> 0, 'y': 130
          ,'zindex': 21
          ,'renderer': new DE.TextRenderer( {
            'fillColor': "rgb(40,40,40)", 'strokeColor': "black"
            , 'fontSize': 62, 'font': "Helvetica"
          }, datas.screenW, 100, "Constellations" )
        } ), new DE.GameObject( {
          'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
          ,'zindex': 20
          ,'renderer': new DE.SpriteRenderer( { spriteName: "bg", 'alpha': 0.7 } )
        } ) );
    
    // panels
      var panels = document.getElementsByClassName( "custom-panel" );
      Game.panels = {};
      for ( var p = 0, back; p < panels.length; ++p )
      {
        back = panels[ p ].getElementsByClassName( "back" )[ 0 ];
        back.addEventListener( 'pointerup', function()
        {
          this.parentElement.style.display = "none";
          Game.showMenu();
        }, true );
        Game.panels[ panels[ p ].id ] = panels[ p ];
      }
      // make end panel
        Game.panels.gameOver.getElementsByClassName( "go-saveBtn" )[ 0 ].addEventListener( 'pointerup', function()
        {
          var nick = Game.panels.gameOver.getElementsByClassName( "go-nick" )[ 0 ].value.trim();
          
          if ( nick == "Nickname" || nick == "" || !nick.match( /^[A-Za-z0-9-_]*$/ ) )
          {
            alert( "Set a simple nickname (letters, numbers, and - _)" );
            return;
          }
          Game.sendScore( _s, nick );
        }, true );
        Game.panels.gameOver.getElementsByClassName( "replay" )[ 0 ].addEventListener( 'pointerdown', function()
        {
          console.log( this );
          this.isDown = true;
        }, true );
        Game.panels.gameOver.getElementsByClassName( "replay" )[ 0 ].addEventListener( 'pointerup', function()
        {
          if ( !this.isDown )
            return;
          Game.panels.gameOver.style.display = "none";
          Game.resetGame();
          this.isDown = false;
        }, true );
    
    // animated background
      Game.camera.backgroundColor = "#F2AF79";
      // Game.camera.useTransparency = false;
      // Game.camera.bufferAlpha = 0.8;
      var star = new DE.GameObject( {
        'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
        ,'zindex': 0
        ,'renderer': new DE.SpriteRenderer( { spriteName: "bg-star3" } )
      } );
      star.scaled = 1;
      star.dir = 1;
      star.rotdir = 1;
      star.anim = function()
      {
        this.rotate( this.rotdir * Math.PI * 0.009 );
        this.scaled += this.dir * 0.05;
        if ( this.scaled > 2.5 || this.scaled < 0.9 )
          this.dir = -this.dir;
        this.renderers[ 0 ].sizes.setScale( this.scaled )
        if ( Math.random() * 1000 < 4 )
          this.rotdir = -this.rotdir;
      };
      star.addAutomatism( "anim", "anim" );
      var star1 = new DE.GameObject( {
        'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
        ,'zindex': 1
        ,'renderer': new DE.SpriteRenderer( { spriteName: "bg-star" } )
      } );
      star1.scaled = 1;
      star1.dir = 1;
      star1.anim = function()
      {
        this.rotate( Math.PI * 0.01 );
        this.scaled += this.dir * 0.05;
        if ( this.scaled > 2 || this.scaled < 0.5 )
          this.dir = -this.dir;
        this.renderers[ 0 ].sizes.setScale( this.scaled )
      };
      star1.addAutomatism( "anim", "anim" );
      
      var star2 = new DE.GameObject( {
        'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
        ,'zindex': 2
        ,'renderer': new DE.SpriteRenderer( { spriteName: "bg-star2" } )
      } );
      star2.scaled = 1;
      star2.dir = 1;
      star2.anim = function()
      {
        this.rotate( -Math.PI * 0.007 );
        this.scaled += this.dir * 0.03;
        if ( this.scaled > 2 || this.scaled < 0.5 )
          this.dir = -this.dir;
        this.renderers[ 0 ].sizes.setScale( this.scaled )
      };
      star2.addAutomatism( "anim", "anim" );
      
      var star0 = new DE.GameObject( {
        'x': datas.screenW / 2 >> 0, 'y': datas.screenH / 2 >> 0
        ,'zindex': 0
        ,'renderer': new DE.SpriteRenderer( { spriteName: "bg-star4" } )
      } );
      star0.scaled = 1;
      star0.dir = 1;
      star0.anim = function()
      {
        this.rotate( -Math.PI * 0.005 );
        this.scaled += this.dir * 0.03;
        if ( this.scaled > 2.3 || this.scaled < 0.7 )
          this.dir = -this.dir;
        this.renderers[ 0 ].sizes.setScale( this.scaled )
      };
      star0.addAutomatism( "anim", "anim" );
      
      var frontstar = new DE.GameObject( {
        'x': 30, 'y': 30
        ,'zindex': 2
        ,'renderer': new DE.SpriteRenderer( { spriteName: "front-star2" } )
      } );
      frontstar.addAutomatism( "rotate", "rotate", { value1: Math.PI * 0.008 } );
      
      var frontstar2 = new DE.GameObject( {
        'x': datas.screenW - 40, 'y': datas.screenH - 40
        ,'zindex': 2
        ,'renderer': new DE.SpriteRenderer( { spriteName: "front-star" } )
      } );
      frontstar2.addAutomatism( "rotate", "rotate", { value1: Math.PI * 0.006 } );
      var frontstar3 = new DE.GameObject( {
        'x': datas.screenW - 40, 'y': 20
        ,'zindex': 2
        ,'renderer': new DE.SpriteRenderer( { spriteName: "front-star3" } )
      } );
      frontstar3.addAutomatism( "rotate", "rotate", { value1: Math.PI * 0.002 } );
      var frontstar4 = new DE.GameObject( {
        'x': 20, 'y': 600
        ,'zindex': 2
        ,'renderer': new DE.SpriteRenderer( { spriteName: "front-star4" } )
      } );
      frontstar4.addAutomatism( "rotate", "rotate", { value1: -Math.PI * 0.0055 } );
      
      Game.menuScene.add( star0, star, star1, star2, frontstar, frontstar2, frontstar3, frontstar4 );
      Game.gameScene.add( star0, star, star1, star2, frontstar, frontstar2, frontstar3, frontstar4 );
    
    Game.showMenu();
    DE.AudioManager.setVolume( 40 );
    DE.AudioManager.fx.setVolume( 60 );
    DE.AudioManager.music.play( "game_music" );
    setTimeout( function()
    {
      DE.States.down( "isLoading" );
      DE.trigger( "askToRate" );
    }, 500 );
  };
  
  function getColor( line )
  {
    var color = undefined, cNum = 0, success = false;
    
    while( !success )
    {
      color = Math.random() * datas.colors.length >> 0;
      cNum = 0;
      for ( var i = 0; i < line.length; ++i )
      {
        if ( line[ i ] == color )
          ++cNum;
      }
      if ( line.length <= 2 || cNum < line.length - 1 )
        success = true;
    }
    
    return color;
  };
  
  Game.showMenu = function()
  {
    Game.camera.gui.enable = false;
    Game.gameScene.sleep = true;
    Game.menuScene.sleep = false;
    Game.camera.scene = Game.menuScene;
  };
  
  Game.resetGame = function()
  {
    Game.camera.gui.enable = true;
    Game.gameScene.sleep = false;
    Game.menuScene.sleep = true;
    Game.camera.scene = Game.gameScene;
    
    Game.score = 0;
    Game.currentLink = 0;
    Game.difficultyLevel = -1;
    Game.grid = [];
    Game.currentGridSize = 0;
    Game.guiScore.renderers[ 0 ].setText( "0" );
    
    for ( var i = 0, g; g = Game.guiPattern[ i ]; ++i )
      g.enable = false;
    
    for ( var y = 0; y < datas.maxGridSize; ++y )
      for ( var x = 0; x < datas.maxGridSize; ++x )
        Game.gridObjects[ y ][ x ].enable = false;
    
    Game.nextDifficulty();
    Game.guiTimer.reset( datas.initialTime );
  };
  
  Game.nextDifficulty = function()
  {
    ++Game.difficultyLevel;
    Game.levelData = datas.difficulties[ Game.difficultyLevel ]
    var oldGridSize = Game.currentGridSize;
    Game.guiTimer.addTime( Game.levelData.gainTime || 0 );
    Game.currentGridSize = Game.levelData.gridSize;
    var gridSize = Game.currentGridSize;
    var line = [];
    var grid = Game.gridObjects;
    for ( var y = 0, color; y < gridSize; ++y )
    {
      line = [];
      for ( var x = 0; x < gridSize; ++x )
      {
        grid[ y ][ x ].resize( gridSize );
        if ( y < oldGridSize && x < oldGridSize )
          continue;
        color = getColor( line );
        line.push( color );
        grid[ y ][ x ].reset( color );
      }
      Game.grid.push( line );
    }
    Game.createPattern();
  };
  
  Game.createPattern = function()
  {
    Game.currentPattern = [];
    var gridSize = Game.currentGridSize;
    var grid = Game.gridObjects;
    var startX = Math.random() * gridSize >> 0;
    var startY = Math.random() * gridSize >> 0;
    Game.currentPattern.push( grid[ startY ][ startX ].colorId );
    var ignoreCase = [ startY + "-" + startX ];
    var curx = startX, cury = startY, tx, ty, dirx, diry, direction, forbiddenDir, retry = false;
    while ( Game.currentPattern.length < Game.levelData.compoSize )
    {
      dirx = 0;
      diry = 0;
      direction = Math.random() * 8 >> 0;
      if ( direction == forbiddenDir )
        continue;
      switch( direction )
      {
        case datas.directions.down:
          diry = 1;
          break;
        case datas.directions.downleft:
          diry = 1;
          dirx = -1;
          break;
        case datas.directions.left:
          dirx = -1;
          break;
        case datas.directions.upleft:
          dirx = -1;
          diry = -1;
          break;
        case datas.directions.up:
          diry = -1;
          break;
        case datas.directions.upright:
          diry = -1;
          dirx = 1;
          break;
        case datas.directions.right:
          dirx = 1;
          break;
        case datas.directions.downright:
          dirx = 1;
          diry = 1;
          break;
      }
      tx = curx + dirx;
      ty = cury + diry;
      
      if ( tx < 0 || ty < 0
        || tx >= gridSize
        || ty >= gridSize )
        continue;
      // if we are in a corner and stuck --> retry
      if (
          // top left corner
          ( tx == 0 && ty == 0 && ignoreCase.indexOf( "1-0" ) != -1 && ignoreCase.indexOf( "0-1" ) != -1 )
          ||
          // bottom left corner
          ( tx == 0 && ty == gridSize - 1
           && ignoreCase.indexOf( ( gridSize - 2 ) + "-0" ) != -1
           && ignoreCase.indexOf( ( gridSize - 1 ) + "-1" ) != -1 )
          ||
          // top right corner
          ( tx == gridSize - 1 && ty == 0
           && ignoreCase.indexOf( "0-" + ( gridSize - 2 ) ) != -1
           && ignoreCase.indexOf( "1-" + ( gridSize - 1 ) ) != -1 )
          ||
          // bottom right corner
          ( tx == gridSize - 1 && ty == gridSize - 1
           && ignoreCase.indexOf( ( gridSize - 2 ) + "-" + ( gridSize - 1 ) ) != -1
           && ignoreCase.indexOf( ( gridSize - 1 ) + "-" + ( gridSize - 2 ) ) != -1 )
        )
      {
        retry = true;
        break;
      }
      if ( ignoreCase.indexOf( ty + "-" + tx ) != -1 )
        continue;
      
      // valid this position and save direction used as opposite
      curx = tx;
      cury = ty;
      ignoreCase.push( cury + "-" + curx );
      forbiddenDir = ( direction + 4 ) % 8;
      Game.currentPattern.push( grid[ cury ][ curx ].colorId );
    }
    
    if ( retry )
    {
      Game.createPattern();
      return;
    }
    
    // asign the good colors on GUI and enable components
      for ( var i = 0, g, c; i < Game.currentPattern.length; ++i )
      {
        g = Game.guiPattern[ i ];
        g.enable = true;
        c = datas.colorsPos[ Game.currentPattern[ i ] ];
        g.renderers[ 0 ].currentFrame = c[ 0 ];
        g.renderers[ 0 ].currentLine = c[ 1 ];
      }
      for ( i = Game.currentPattern.length; g = Game.guiPattern[ i ]; ++i )
        g.enable = false;
    // reset stuff
    Game.patternPosition = 0;
    Game.resetLinkers();
  };
  
  Game.patternSuccess = function()
  {
    DE.AudioManager.fx.play( 'success' );
    Game.camera.isDown = false; // stop move the linker
    Game.guiScore.renderers[ 0 ].setText( ++Game.score );
    Game.patternSuccessFeedback = true; // prevent camera kill linkers
    Game.guiTimer.addTime( Game.levelData.gainByOk );
    setTimeout( function()
    {
      Game.patternSuccessFeedback = false;
      if ( Game.score >= Game.levelData.maxScore )
      {
        Game.nextDifficulty();
        return;
      }
      Game.createPattern();
    }, 500 );
  };
  Game.patternFail = function()
  {
    Game.patternSuccessFeedback = false;
    DE.AudioManager.fx.play( 'fail' );
    Game.camera.shake( 15, 15, 100 );
    Game.guiTimer.addTime( -Game.levelData.looseByMiss );
    Game.resetLinkers(); // remove links only
  };
  
  Game.checkMouseDown = function( objective, mouse )
  {
    if ( Game.currentLink >= Game.links.length
      || ( Game.currentLink > 0 && Game.lastObjectiveLinked.id != objective.id ) )
      return;
    if ( Game.currentLink == 0 && objective.colorId != Game.currentPattern[ Game.patternPosition ] )
    {
      Game.patternFail();
      return;
    }
    
    Game.camera.isDown = true;
    Game.links[ Game.currentLink ].enable( objective );
    objective.reset();
    Game.firstObjective = objective;
    Game.firstObjective.link();
  };
  Game.linkerCollision = function( objective )
  {
    // first time need two increment
    if ( Game.currentLink == 0
      && Game.firstObjective.colorId == Game.currentPattern[ Game.patternPosition ] )
      ++Game.patternPosition;
    
    if ( objective.colorId != Game.currentPattern[ Game.patternPosition ] )
    {
      Game.patternFail();
      return;
    }
    
    Game.lastObjectiveLinked = objective;
    Game.links[ Game.currentLink ].connectSuccess();
    
    if ( Game.currentLink >= Game.links.length -1 )
    {
      Game.currentLink++;
      Game.camera.isDown = false;
      return;
    }
    
    if ( Game.patternPosition + 1 == Game.currentPattern.length )
    {
      Game.patternSuccess();
      return;
    }
    
    ++Game.patternPosition;
    Game.links[ ++Game.currentLink ].enable( objective );
  };
  
  Game.resetLinkers = function()
  {
    Game.patternPosition = 0;
    Game.currentLink = 0;
    if ( Game.firstObjective )
      Game.firstObjective.reset();
    Game.firstObjective = undefined;
    for ( var i = 0, li; li = Game.links[ i ]; ++i )
      li.disable();
  };
  
  function _showScores()
  {
    var pan = Game.panels.scores;
    pan.style.display = "block";
    pan.getElementsByClassName( "go-localScore" )[ 0 ].innerHTML = DE.SaveSystem.get( "localHighScore" );
    Game.getScores();
  };
  
  function _gameOver()
  {
    if ( Game.score == 0 )
    {
      Game.resetGame();
      return;
    }
    var score = Game.score;
    _s = score.toString() + score.toString().length;
    var pan = Game.panels.gameOver;
    
    DE.AudioManager.fx.play( 'gameover' );
    Game.links[ Game.currentLink ].disable();
    pan.style.display = "block";
    pan.getElementsByClassName( "go-score" )[ 0 ].innerHTML = score;
    
    var bestscore = DE.SaveSystem.get( "localHighScore" ) || 0;
    if ( score > bestscore )
    {
      pan.getElementsByClassName( "go-newBestScore" )[ 0 ].style.display = "block";
      pan.getElementsByClassName( "go-yourBestScore" )[ 0 ].style.display = "none";
      DE.SaveSystem.save( "localHighScore", score );
    }
    else
    {
      pan.getElementsByClassName( "go-yourBestScore" )[ 0 ].style.display = "block";
      pan.getElementsByClassName( "go-yourBestScore" )[ 0 ].innerHTML = DE.SaveSystem.get( "localHighScore" );
    }
  };
  
  Game.getScores = function()
  {
    var pan = Game.panels.scores;
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = 'http://inateno.com/games/constellations/scores.php?gs=1';
    document.body.appendChild( script );
    script.onload = function()
    {
      document.body.removeChild( script );
      if ( window.ajaxlistscores && window.ajaxlistnicks )
      {
        var container = pan.getElementsByClassName( "highscores" )[ 0 ];
        container.innerHTML = "";
        for ( var i = 0, el; i < ajaxlistnicks.length; ++i )
        {
          el = document.createElement( "div" );
          el.innerHTML = ajaxlistnicks[ i ] + ": " + ajaxlistscores[ i ];
          container.appendChild( el );
        }
      }
    };
  };
  
  Game.sendScore = function( score, nickname )
  {
    var script = document.createElement( "script" );
    script.type = "text/javascript";
    script.src = 'http://inateno.com/games/constellations/scores.php?rs=' + score + '&d=' + _d + _s
      + '&n=' + nickname;
    document.body.appendChild( script );
    script.onload = function()
    {
      if ( window.ajaxsuccess !== undefined )
      {
        if ( window.ajaxsuccess )
        {
          alert( "Your score is saved online yay" );
          Game.panels.gameOver.getElementsByClassName( "go-newBestScore" )[ 0 ].style.display = "none";
        }
        else
          alert( "An error occurred from client" );
      }
      else
      {
        alert( "An error occurred on server" );
      }
      document.body.removeChild( script );
      // remove input and save button
    };
  }
  
  Game.shareTwitter = function( score )
  {
    var btn = document.getElementById( "twBtn" );
    var url = "https://twitter.com/intent/tweet?button_hashtag=LD30&text=Try the Ludum Dare game Constellations, my score is " + score;
    btn.setAttribute( "href", url );
    btn.click();
  };
  
  return Game;
} );