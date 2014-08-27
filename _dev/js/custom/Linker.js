define( [ 'DREAM_ENGINE', 'datas' ],
function( DE, datas )
{
  function Linker( id )
  {
    var _self = this;
    
    this.visualLink = new DE.GameObject( {
      'zindex': 41 + id
      ,'tag': 'link'
      ,'renderers': [
        new DE.CircleRenderer( { fillColor: "white" }, 30 )
        ,new DE.BoxRenderer( { fillColor: "white", 'offsetY': -115 }, 30, 1 )
        ,new DE.CircleRenderer( { fillColor: "green", 'offsetY': -260 }, 30 )
      ]
    } );
    this.colliderLink = new DE.GameObject( {
      'zindex': 42 + id
      ,'collider': new DE.CircleCollider( 10 )
    } );
    this.stars = new DE.GameObject( {
      'zindex': 45 + id
      ,'renderer': new DE.SpriteRenderer( { spriteName: "stars-success" } )
    } );
    this.stars.enable = false;
    this.stars.renderers[ 0 ].onAnimEnd = function()
    {
      _self.stars.enable = false;
    };
    
    this.colliderLink.checkCollision = function()
    {
      if ( this.stated )
        return;
      for ( var i = 0, g; g = this.scene.gameObjects[ i ]; ++i )
      {
        if ( !g.enable || g.id == this.snappedId || g.tag != "objective" )
          continue;
        if ( !g.isLinked && DE.CollisionSystem.circleCollision( this.collider, g.collider ) )
        {
          _self.updateMouse( g.position );
          _self.visualLink.renderers[ 2 ].fillColor = "white";
          _self.visualLink.renderers[ 2 ].redraw();
          g.link();
          this.linkedTo = g;
          this.stated = true;
          DE.Event.trigger( "linker-collide", g );
        }
      }
    };
    this.colliderLink.addAutomatism( "checkCollision", "checkCollision", { "interval": 50 } );
    
    // if connection was the good one, play feedback
    this.connectSuccess = function()
    {
      this.stars.renderers[ 0 ].restartAnim();
      this.stars.enable = true;
      this.stars.position.setPosition( this.colliderLink.position );
    };
    
    this.enable = function( objective )
    {
      this.visualLink.enable = true;
      this.colliderLink.enable = true;
      this.visualLink.position.setPosition( objective.position );
      var rds = this.visualLink.renderers;
      rds[ 1 ].sizes.height = 1;
      rds[ 1 ].localPosition.y = 0;
      rds[ 2 ].localPosition.y = 0;
      rds[ 2 ].fillColor = "green";
      rds[ 2 ].redraw();
      this.colliderLink.position.setPosition( objective.position );
      this.colliderLink.snappedId = objective.id;
    };
    
    this.updateMouse = function( mouse )
    {
      this.visualLink.lookAt( mouse );
      var rds = this.visualLink.renderers;
      var dist = this.visualLink.position.getDistance( mouse );
      if ( dist > 285 )
      {
        this.colliderLink.position.setPosition( this.visualLink.position );
        this.colliderLink.lookAt( mouse );
        this.colliderLink.position.translate( { x:0, y: rds[ 2 ].localPosition.y + 20 }, false, true );
        return;
      }
      rds[ 1 ].sizes.height = dist;
      rds[ 1 ].localPosition.y = -dist;
      rds[ 2 ].localPosition.y = -( dist + 30 );
      this.colliderLink.position.setPosition( mouse );
    };
    
    this.disable = function()
    {
      this.visualLink.enable = false;
      this.colliderLink.enable = false;
      if ( this.colliderLink.linkedTo )
        this.colliderLink.linkedTo.reset();
      this.colliderLink.linkedTo = undefined;
      this.colliderLink.stated = false;
    }
    
    this.getObjects = function()
    {
      return [ this.visualLink, this.colliderLink, this.stars ];
    };
    
    this.disable();
  };
  
  return Linker;
} );