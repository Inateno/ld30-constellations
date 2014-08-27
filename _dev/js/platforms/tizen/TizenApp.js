define( [ 'DREAM_ENGINE', 'customizeTizen' ],
function( DE, customizeTizen )
{
  var TizenApp = new function()
  {
    var _self = null;
    this.init = function( params )
    {
      _self = this;
      console.log( "hé coucou system" );
      customizeTizen( this );
    }
  };
  
  return TizenApp;
} );