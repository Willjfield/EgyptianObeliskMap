// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

var thisYear = new Date().getFullYear();

var notExactMarker = Cesium.Color.fromCssColorString('rgba(255,0,0,.2)');

function obPath(data, obid, view, color){
var icoords = [];
for (var i in data.features){ 
  if (data.features[i].properties.id == obid){
    for(var j in data.features[i].geometry.coordinates){
       icoords.push(data.features[i].geometry.coordinates[j][0]);
       icoords.push(data.features[i].geometry.coordinates[j][1]);
    }
  }
    view.entities.add({
    polyline : {
    positions : Cesium.Cartesian3.fromDegreesArray(icoords),
    width : 1,
    material : color
      }
    });   
  }
};

function obPoint(data, obid, view, color){
for (var i in data.features){
  if (data.features[i].properties.id == obid){
    for(var j in data.features[i].geometry.coordinates){
       var icoords = [];
       icoords.push(data.features[i].geometry.coordinates[j][0]);
       icoords.push(data.features[i].geometry.coordinates[j][1]);
       view.entities.add({
        position: Cesium.Cartesian3.fromDegrees(icoords[0], icoords[1], 150000.0),
        name : 'Green circle at height',
        ellipse : {
            semiMinorAxis : 100.0,
            semiMajorAxis : 100.0,
            height: 1.0,
            material : color
          }
        });
      }
    }    
  }
};

function createModels(data, obid, view,height,heading,scale,pitch,roll){
  scale = typeof scale !== 'undefined' ? scale :1;
  heading = typeof heading !== 'undefined' ? heading :0;
  heading = Cesium.Math.toRadians(heading);
  height = typeof height !== 'undefined' ? height :0;
  roll = typeof roll !== 'undefined' ? roll :0;
  roll = Math.radians(roll);
  pitch = typeof pitch !== 'undefined' ? pitch :0;
  pitch = Math.radians(pitch);

  for (var i in data.features){
    if (data.features[i].properties.id == obid){
      for(var ex=0; ex<data.features[i].properties.exact.length;ex++){  
        if(data.features[i].properties.exact[ex]==false){
          var icoords = [];
          for(var c in data.features[i].geometry.coordinates[ex]){
          icoords.push(data.features[i].geometry.coordinates[ex][c]);
            if(icoords.length>1){
              view.entities.add({
              position: Cesium.Cartesian3.fromDegrees(icoords[0], icoords[1], 150000.0),
              name : 'Green circle at height',
              ellipse : {
                  semiMinorAxis : 100.0,
                  semiMajorAxis : 100.0,
                  height: 1.0,
                  material : notExactMarker
              }
            });
          }
        }
      }
    }
      for(var j in data.features[i].geometry.coordinates){
         var icoords = [];
         for(var c in data.features[i].geometry.coordinates[j]){
          icoords.push(data.features[i].geometry.coordinates[j][c]);
            if(icoords.length>1){
            createModel(view, obid, icoords[0],icoords[1],height,heading,scale, pitch,
            roll);
          }
        }
      }
    }
  }
};    

function createModel(view,obid,long,lat,height,heading,scale,pitch,
    roll) {
    url = 'data/models/obelisks/'+obid+'/Ob'+obid+'.gltf';
    scale = typeof scale !== 'undefined' ? scale :1;

    heading = typeof heading !== 'undefined' ? heading :1;

    roll = typeof roll !== 'undefined' ? roll :0;

    pitch = typeof pitch !== 'undefined' ? pitch :0;

    var position = Cesium.Cartesian3.fromDegrees(long,lat,height);

    var orientation = Cesium.Transforms.headingPitchRollQuaternion(position, heading, pitch, roll);

    var entity = view.entities.add({
        name : url,
        position : position,
        orientation : orientation,

        model : {
          scale : scale,
            uri : url,          
        }
    });
    view.trackedEntity = entity;
};

function yearAquired(data, obid, city){
  for (var i in data.features){
    if(data.features[i].properties.id==obid){
      for(var cit in data.features[i].properties.city){
        if(data.features[i].properties.city[cit]==city){
            console.log(data.features[i].properties.city[cit]);
            return data.features[i].properties.year_aquired[cit]; 
        }
      }
    }
  }
};

function timeOnLocation(data, obid, city){
  for (var i in data.features){
    if(data.features[i].properties.id==obid){
      for(var cit=0;cit<data.features[i].properties.city.length;cit++){
        if(data.features[i].properties.city[cit]==city){
            if(cit<data.features[i].properties.year_aquired.length-1){
            return (data.features[i].properties.year_aquired[cit+1]-data.features[i].properties.year_aquired[cit]);
            }else{
            return thisYear-data.features[i].properties.year_aquired[cit];
            }
        }
      }
    }
  }
};


function obCol(data, obid, view){
for (var i in data.features){
  if (data.features[i].properties.id == obid){
    for(var j in data.features[i].geometry.coordinates){
      var cityName = data.features[i].properties.city[j];
        var cityHeight = timeOnLocation(data,obid,cityName);
        
        if(cityHeight >0 ){
          console.log(cityHeight);
           var icoords = [];
           icoords.push(data.features[i].geometry.coordinates[j][0]);
           icoords.push(data.features[i].geometry.coordinates[j][1]);
               view.entities.add({
              position : Cesium.Cartesian3.fromDegrees(icoords[0], icoords[1], .5*(cityHeight*1000)),
              cylinder : {
                length : cityHeight*1000,
                topRadius : 15000.0,
                bottomRadius : 15000.0,
                outline : false,
                outlineColor : Cesium.Color.WHITE,
                outlineWidth : 4,
                material : Cesium.Color.fromRandom({alpha : 1.0})
                }
          });
        }
      }
    }    
  }
};