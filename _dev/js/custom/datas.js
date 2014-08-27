define( [],
function()
{
  var datas = {
    screenW: 600, screenH: 720
    ,'fieldSize': 600
    ,'colors': [ 0, 1, 2, 3, 4, 5, 6, 7 ]
    ,'colorsPos': [ [ 0, 0 ], [ 1, 0 ], [ 2, 0 ], [ 3, 0 ], [ 0, 1 ], [ 1, 1 ], [ 2, 1 ], [ 3, 1 ] ]
    ,'maxGridSize': 6
    ,'maxLinks': 15
    ,'circleSize': 200
    ,'guiPatternSize': 50
    ,'initialTime': 60000
    ,'maxTime': 60000
    ,'secondWidth': 8.5
    // la demi seconde en plus permet de laisser le temps d'afficher le pattern complété sans impacter le LD
    ,'difficulties': [
      { gridSize: 3, compoSize: 2, gainByOk: 1000, looseByMiss: 500, maxScore: 10 }
      ,{ gridSize: 3, compoSize: 3, gainTime: 4000, gainByOk: 1500, looseByMiss: 1000, maxScore: 15 }
      ,{ gridSize: 3, compoSize: 4, gainTime: 5000, gainByOk: 3500, looseByMiss: 2000, maxScore: 35 }
      ,{ gridSize: 4, compoSize: 5, gainTime: 7000, gainByOk: 3500, looseByMiss: 2000, maxScore: 60 }
      ,{ gridSize: 5, compoSize: 6, gainTime: 10000, gainByOk: 4500, looseByMiss: 3000, maxScore: 85 }
      ,{ gridSize: 6, compoSize: 7, gainTime: 10000, gainByOk: 6500, looseByMiss: 5000, maxScore: 110 }
      ,{ gridSize: 6, compoSize: 8, gainTime: 10000, gainByOk: 7500, looseByMiss: 7000, maxScore: 150 }
      ,{ gridSize: 6, compoSize: 9, gainTime: 10000, gainByOk: 10500, looseByMiss: 9000, maxScore: 200 }
      
      ,{ gridSize: 6, compoSize: 10, gainTime: 10000, gainByOk: 20500, looseByMiss: 10000 }
    ]
    ,'directions': {
      'down': 0
      ,'downleft': 1
      ,'left': 2
      ,'upleft': 3
      ,'up': 4
      ,'upright': 5
      ,'right': 6
      ,'downright': 7
    }
  };
  
  return datas;
} );