define( [ 'DREAM_ENGINE', 'datas' ],
function( DE, datas )
{
  var __marginTop = datas.screenH - datas.fieldSize;
  
  function Objective( x, y )
  {
    DE.GameObject.call( this, {
      'x': datas.circleSize / 2 + datas.circleSize * x >> 0
      ,'y': datas.circleSize / 2 + __marginTop + datas.circleSize * y >> 0
      ,'zindex': 30
      ,'tag': "objective"
      ,'renderer': new DE.SpriteRenderer( {
        'spriteName': 'circles'
        ,'startFrame': 0, 'startLine': 1
        ,'alpha': 0
      } )
      ,'collider': new DE.CircleCollider( datas.circleSize / 3 >> 0 )
    } );
    
    this.x = x;
    this.y = y;
    this.colorId = 0;
    
    this.resize = function( gridSize )
    {
      this.enable = true;
      var size = datas.screenW / gridSize >> 0;
      this.renderers[ 0 ].sizes.setSizes( size );
      this.renderers[ 0 ].alpha = 1;
      this.collider.radius = size / 3 >> 0;
      if ( DE.CONFIG.DEBUG_LEVEL > 1 )
        this.collider.createDebugRenderer();
      this.position.setPosition( {
        'x': size / 2 + size * x >> 0
        ,'y': size / 2 + __marginTop + size * y >> 0
      } )
    };
    
    this.link = function()
    {
      this.isLinked = true;
      this.renderers[ 0 ].currentLine += 2;
    };
    
    this.reset = function( colorId )
    {
      if ( colorId )
        this.colorId = colorId;
      this.isLinked = false;
      this.renderers[ 0 ].currentLine = this.colorId / 4 >> 0;
      this.renderers[ 0 ].currentFrame = this.colorId % 4;
    };
  }
  
  Objective.prototype = new DE.GameObject();
  Objective.prototype.constructor = Objective;
  Objective.prototype.supr        = DE.GameObject.prototype;
  
  Objective.prototype.onMouseDown = function( mouse )
  {
    DE.Event.trigger( "objective-down", this, mouse );
  };
  
  return Objective;
} );