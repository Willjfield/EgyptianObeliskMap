
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
                  semiMinorAxis : 300.0,
                  semiMajorAxis : 300.0,
                  height: 1.0,
                  material : color
              }
            });
          }
        }    
      }
    };

    function createModels(data, obid, view){
      for (var i in data.features){
        if (data.features[i].properties.id == obid){
          for(var j in data.features[i].geometry.coordinates){
             var icoords = [];
             //console.log(j);
             for(var c in data.features[i].geometry.coordinates[j]){
              //console.log(c);
              icoords.push(data.features[i].geometry.coordinates[j][c]);
              //console.log(data.features[i].geometry.coordinates[j][c]);
              console.log(icoords.length);
              if(icoords.length>1){
              createModel(view, obid, icoords[0],icoords[1],0,295,.05);
              }
            }
          }
        }
      }
    };    

    
    function createModel(view,obid,long,lat,height,heading, scale) {
          //view.entities.removeAll();
          url = 'data/models/obelisks/'+obid+'/Ob'+obid+'.gltf';
          scale = typeof scale !== 'undefined' ? scale :1;

          heading = typeof heading !== 'undefined' ? heading :0;
          heading = Cesium.Math.toRadians(heading);

          var position = Cesium.Cartesian3.fromDegrees(long,lat,height);

          var pitch = 0;
          var roll = 0;
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
    
