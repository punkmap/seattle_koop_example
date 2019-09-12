import React from 'react'
import axios from 'axios'
import EsriLoaderReact from 'esri-loader-react'
import { loadModules } from 'esri-loader'
//import MapOverlayPanel from '../../molecules/MapOverlayPanel/MapOverlayPanel'
import './ReactMap.css'

//production
const layers = [
  // {
  //   "id" : "stormInlets"
  //   , "label" : "Storm Inlets"
  //   , "url" : "https://maps.townofcary.org/arcgis/rest/services/OneCary/StormwaterCollectionSystem/MapServer/"
  //   , "serviceIndex" : 2
  //   , "outFields" : ['"FACILITYID"', '"INLETTYPE"','"ACCESSDIAM"','"ADOPTED"']
  //   , "fields" : [
  //       {"name":"OBJECTID", "alias":"Object ID", "type":"oid"},
  //       {"name":"FACILITYID", "alias":"Facility ID", "type":"string"},
  //       //{"name":"INSTALLDATE", "alias":"Install Date", "type":"date"}, 
  //       {"name":"INLETTYPE", "alias":"Inlet Type", "type":"string"},
  //       {"name":"ACCESSDIAM", "alias":"Access Diameter", "type":"double"},
  //       //{"name":"ADOPTED", "alias":"Adopted", "type":"integer"},
  //       {"name":"ADOPTED", "alias":"Adopted", "type":"string"},
  //       {"name":"SFID", "alias":"Salesforce Id", "type":"string"}
  //   ]
  //   , "fieldAliases" : ["Facility ID", "Inlet Type","Access Diameter", "Adopted"]
  //   , "popupTemplate" : null//{
  //   //     "title": "{title}",
  //   //     "content": [
  //   //       {
  //   //         "type": "fields",
  //   //         "fieldInfos": [
  //   //           {
  //   //             "fieldName": "objectId",
  //   //             "label": "Object Id",
  //   //             "visible": true
  //   //           },
  //   //           {
  //   //             "fieldName": "title",
  //   //             "label": "Title",
  //   //             "visible": true
  //   //           },
  //   //           {
  //   //             "fieldName": "type",
  //   //             "label": "type",
  //   //             "visible": true
  //   //           }
  //   //         ]
  //   //       }
  //   //     ]
  //   //   }
  //   , "definitionExpression" : "INLETTYPE='Pipe'"
  //   , "minScale" : 2257
  //   , "renderer" : {
  //       "type": "simple"  // autocasts as new SimpleRenderer()
  //       , "symbol": {
  //           "type": "simple-marker"  // autocasts as new SimpleMarkerSymbol()
  //           , "size": 12
  //           , "color": "red"
  //           , "outline": {  // autocasts as new SimpleLineSymbol()
  //               "width": 0.5
  //               , "color": "white"
  //         }
  //       }
  //     }
  //     , "classrenderer" : {
  //       "type": "unique-value"  // autocasts as new SimpleRenderer()
  //       ,"field": "test"
  //       , "uniqueValueInfos":[
  //         {
  //           "value":true
  //           , "symbol":{
  //               "type": "simple-marker"  // autocasts as new SimpleMarkerSymbol()
  //               , "size": 12
  //               , "color": "red"
  //               , "outline": {  // autocasts as new SimpleLineSymbol()
  //                   "width": 0.5
  //                   , "color": "white"
  //             }
  //           }
  //         }
  //         , {
  //           "value":true
  //           , "symbol":{
  //               "type": "simple-marker"  // autocasts as new SimpleMarkerSymbol()
  //               , "size": 12
  //               , "color": "blue"
  //               , "outline": {  // autocasts as new SimpleLineSymbol()
  //                   "width": 0.5
  //                   , "color": "white"
  //             }
  //           }
  //         }
  //       ]
  //     }
  // }
]

class ReactMap extends React.PureComponent {
  constructor(props){
    super(props)
    this.state = {
      ctrlKey: false
      , parametersLoaded : false
      , mapView: null
      , layers:[]
      , layerViews:[]
      , infoData: null
      , panelUse: "info"
    }
    this.mapClick = this.mapClick.bind(this);
    this.loadMap = this.loadMap.bind(this);
  }
  componentDidMount(){
    // document.addEventListener('keydown', keyDown);
    // document.addEventListener('keyup', keyUp);
    // const self = this
    // function keyDown(e) {
    //   if (e.ctrlKey&&!self.state.ctrlKey){
    //     self.setState({ctrlKey: true})
    //   }
    // }
    // function keyUp(e) {
    //   if (self.state.ctrlKey){self.setState({ctrlKey: false})}
    // }
  }
  loadMap = ({loadedModules: [Map, MapView, GraphicsLayer, watchUtils, webMercadorUtils], containerNode}) => {
    const self = this;
    const selectedParcelGL = new GraphicsLayer({
      visible:true
      , id: 'selectedParcelGL'
    })
    self.setState({selectedParcelGL:selectedParcelGL})

    const map = new Map({basemap: 'satellite', id:"daMap"})
    const mapView = new MapView({
      container: containerNode
      , center: [-122.329, 47.62]
      , zoom: 13
      , map: map
    })

    mapView.on('click', (e) => {
      console.log(e)
      let wm = webMercadorUtils.webMercatorToGeographic(e.mapPoint);
      console.log('start ', wm);
      console.log('x: ' + wm.x + ' y: ' + wm.y);
      axios({
        method: 'post'
        , url:  self.props.nodeAppRoot+"get_all_assets/"
        
      })
      .then(function(response){
        console.log('setToken response: ', response)
      })
      .catch(function (error) {
        console.log('API '+self.props.nodeAppRoot+'settoken/ ERROR: ' + error);
      });
    })
    mapView.when((function(mapView){
        mapView.id = "myMapView"
        self.setState({mapView:mapView})
        mapView.on('click', self.mapClick)
        mapView.popup.highlightEnabled = false;
        mapView.popup.actions = {}
        
        self.addFeatureLayers(mapView, function(){
          self.loadFeaturesByExtent(function(){
            if(self.props.sessionParameters!=="null"){self.handleSessionParameters(self.props.sessionParameters)}
          })
          watchUtils.watch(mapView, "extent", self.debounce(function(){
            self.loadFeaturesByExtent()
          }, 150))
            
        })
    }));  
  }
  debounce=(func, wait, immediate)=>{
    var timeout;
    return function() {
      var context = this, args = arguments;
      var later = function() {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  };
  addFeatureLayers = (mapView, callback) =>{
    const self = this
    loadModules(['esri/layers/FeatureLayer'])
    .then(([FeatureLayer]) => 
    {
      var apartmentsLayer = new FeatureLayer({
          url: "http://67.207.80.67:8080/craigslist/seattle/apartments/FeatureServer/",
          popupEnabled: true
        });
      apartmentsLayer.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 6,
          color: "blue",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white"
          }
        }
      }
      var assetsLayer = new FeatureLayer({
          url: "http://localhost:8080/salesforce_assets/rest/services/FeatureServer/"
      });
      assetsLayer.renderer = {
        type: "simple",  // autocasts as new SimpleRenderer()
        symbol: {
          type: "simple-marker",  // autocasts as new SimpleMarkerSymbol()
          size: 6,
          color: "red",
          outline: {  // autocasts as new SimpleLineSymbol()
            width: 0.5,
            color: "white"
          }
        }
      }
      mapView.map.addMany([apartmentsLayer, assetsLayer]);

    //   layers.forEach(function(layer){
    //     let fl = new FeatureLayer({
    //       popupTemplate: layer.popupTemplate,
    //       fields:layer.fields,
    //       objectIdField:"OBJECTID",
    //       id:layer.id,
    //       geometryType: "point",
    //       source:[],
    //       popupEnabled:false
    //     })
    //     fl.when(function(featureLayer){
    //       featureLayer.id = layer.id;
    //       let layersConcat = self.state.layers.concat({'featureLayerId' : featureLayer.id, 'identifyable' : true})
    //       self.setState({layers: layersConcat})
    //     });
    //     fl.minScale = layer.minScale;
    //     const arcade = ` IIf($feature.ADOPTED=="true", true, false)`
    //     const renderer = {
    //       type: "unique-value", // autocasts as new UniqueValueRenderer()
    //       valueExpression: arcade,
    //       valueExpressionTitle: "Adoption Status",
    //       uniqueValueInfos: [
    //         {
    //           value: true,
    //           symbol: self.createMarkerSymbol("#00ff00", 12),
    //           label: "adopted"
    //         }, 
    //         {
    //           value: false,
    //           symbol: self.createMarkerSymbol("#ff002e", 12),
    //           label: "unadopted"
    //         }
    //       ]
    //     };
    //     fl.renderer=renderer;
    //     mapView.map.add(fl)
    //     mapView.whenLayerView(fl).then(function(layerView) {
    //       let layersConcat = self.state.layerViews.concat({'featureLayerId' : layer.id, 'layerView' : layerView})
    //       self.setState({layerViews: layersConcat})
    //     })  
    //   })
      callback()
    })
  }
  createMarkerSymbol = (color, size) =>{

    return {"type":"simple-marker","color":color,"angle":0,"xoffset":0,"yoffset":0,"size":size,"style":"circle","outline":{"color":[0,0,0,51],"width":0.5}}
      
  }
  loadFeaturesByExtent = (callback = null) =>{
    
    const self = this
      layers.forEach(function(layer){
        let fl = self.state.mapView.map.findLayerById(layer.id)
        const mapExtent = self.state.mapView.extent
        const url = 'https://maps.townofcary.org/arcgis/rest/services/OneCary/StormwaterCollectionSystem/MapServer/2/query?where='+layer.definitionExpression+'&outFields=*&geometry='+JSON.stringify(mapExtent)+'&outSR=4326&geometryType=esriGeometryEnvelope&spatialRel=esriSpatialRelIntersects&outFields=&f=pjson'
        axios.get(url)
        .then(function (response) {
          //    console.log('response: '+ JSON.stringify(response.data.features))
          let facIds = []
          let features = JSON.parse(JSON.stringify(response.data.features))
          features.forEach(function(feature){
            //console.log(JSON.stringify(feature.attributes))
            facIds.push(feature.attributes.FACILITYID)
            feature.geometry.type = "point"
          })
          let addFacIds = facIds.slice()
          let deleteFacIds = facIds.slice()
          //*****TODO link to map from asset open map with url parameter*/
          const qObject = {
            "where" : "FACILITYID IN ('" +addFacIds.join("','")+"')",
            "returnGeometry" : false,
            "outFields" : [ "FACILITYID" ],
          }
          self.queryFeatureLayer(fl, qObject).then(existingFacIds => {
            existingFacIds.forEach(function(exFacId){
              if(facIds.indexOf(exFacId.attributes.FACILITYID)>-1){
                addFacIds.splice(addFacIds.indexOf(exFacId.attributes.FACILITYID),1)
              }              
            })
            if (addFacIds.length>0){
              axios({
                method: 'post'
                , url: self.props.nodeAppRoot+"getassets/"
                , data: {
                  "assetids":addFacIds
                }
              })
              .then(function(response){
          //      console.log(JSON.stringify(response.data))
                const sfRecords = JSON.parse(JSON.stringify(response.data))
                let combinedDataset = []
                features.forEach(function(feature){
                  feature.attributes.ADOPTED = "false";
                  for(var sfri = 0; sfri<sfRecords.length; sfri++){
                    const record = sfRecords[sfri]
                    if(feature.attributes.FACILITYID===record.SerialNumber){
                      feature.attributes.ADOPTED = record.Adopted__c === true?"true":"false"
                      //feature.attributes.ADOPTED = record.Adopted__c
                      feature.attributes.SFID = record.Id
                      combinedDataset.push(feature)
                      break
                    }  
                  }

                  
                  })
                fl.applyEdits({addFeatures:combinedDataset}).then(function(){
                  //*****TODO add counter here for multiple featureLayers */
                  
                  fl.queryFeatures().then(function(results){
                    const qObject = {
                      "where" : "NOT FACILITYID IN ('" +deleteFacIds.join("','")+"')",
                      "returnGeometry" : true,
                      "outFields" : [ "*" ],
                    }
                    self.queryFeatureLayer(fl, qObject).then(removeFacIds => {
                      let remove = []
                      removeFacIds.forEach(function(feature){
                        feature.geometry.type = "point"
                        remove.push(feature)
                      })
                      if(remove.length>0){
                        fl.applyEdits({deleteFeatures:remove}).then(function(){
                          fl.queryFeatureCount().then(function(numFeatures){
                          });
                        })
                        .catch(function (error) {
                          console.log('error: ' + error);
                        });
                      }
                      
                      callback?callback():console.log('noCallback')
                    })
                    //console.log(JSON.stringify(results.features));  // prints the array of features to the console
                  });
                })
              })  
            }
          })
        })
        .catch(function (error) {
          console.log('error: ' + error);
        });
      })
  }
  handleSessionParameters = (seschParams) => {
    const params = JSON.parse(seschParams)
    const self = this
    
    if (params.type==="query"){
      let fl = self.state.mapView.map.findLayerById(params.layerId)
      const qObject = {
        "where" : params.where,
        "returnGeometry" : true,
        "outFields" : [ "*" ],
      }
      self.queryFeatureLayer(fl, qObject).then(results => {
        let info = {}
        results.forEach(function(fSetFeature){
          const feature = JSON.parse(JSON.stringify(fSetFeature))
          info[feature.attributes.OBJECTID+"_"+params.layerId] = {}
          
          let layerConfig = self.getLayerConfig(params.layerId) 
          layerConfig.fields.forEach(function(field){
            if(field.name!=='OBJECTID'){
              if(field.name==='ADOPTED'){
                info[feature.attributes.OBJECTID+"_"+params.layerId][field.alias] = feature.attributes[field.name]==="true"?true:false   
              }
              else{
                info[feature.attributes.OBJECTID+"_"+params.layerId][field.alias] = feature.attributes[field.name]
              }
            }
          })
        })
        let graphic = results[0]
        var markerSymbol = {
          type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
          color: [226, 119, 40, 0],
          size: 15,
          style:"square",
          outline: {
            // autocasts as new SimpleLineSymbol()
            color: [0, 255, 255],
            width: 2
          }
        };
        graphic.symbol = markerSymbol
        self.state.mapView.goTo(graphic.geometry,{animate:true, duration:1000})
        self.updateFeatureSelectionGraphic(graphic)
        self.setState({infoData:info})
      })
      .catch(function (error) {
        console.log('error: ' + error);
      });
    }
  }
  queryFeatureLayer = (featureLayer, queryObject) => {
    return loadModules(['esri/tasks/support/Query'])
    .then(([Query]) => 
    {
      const query = new Query(queryObject)
      return featureLayer.queryFeatures(query).then(function(results){
        return results.features;
      })
      .catch(err => {
        // handle any errors
        console.error("queryFeatureLayers: " + err);
      });
    })
  }
  mapClick = (e) => {
      this.panelUseChange("info")
      this.spatiallyQueryLayers(e.mapPoint)
  }
  spatiallyQueryLayers = (mapPoint) => {
    const self = this
    loadModules(['esri/tasks/QueryTask','esri/tasks/support/Query'])
    .then(([QueryTask,Query]) => 
    {
      const stateLayers = self.state.layers
      //may want to restructure the config into services and indexes rather than indiviual layers. 
      //in this manner we could loop over the services and 
      stateLayers.forEach(function(layer){
        if (layer.identifyable){
          const featureLayerId = layer.featureLayerId
          const mv = self.state.mapView
          const map = mv.map
          let fl = map.findLayerById(featureLayerId)
          var query = fl.createQuery();
          query.geometry = mapPoint;  // the point location of the pointer
          //!!!!!TODO: may want to make the distance some multiplier based on the % progressoin of zoom level scales. 
          query.distance = 10
          query.unit = "feet"
          query.spatialRelationship = "intersects";  // this is the default
          //query.returnGeometry = false;
          query.outFields = [ "OBJECTID","FACILITYID","INLETTYPE","ACCESSDIAM","ADOPTED", "SFID" ];
          var markerSymbol = {
            type: "simple-marker", // autocasts as new SimpleMarkerSymbol()
            color: [226, 119, 40, 0],
            size: 15,
            style:"square",
            outline: {
              // autocasts as new SimpleLineSymbol()
              color: [0, 255, 255],
              width: 2
            }
          };
          const layerView = self.getLayerViewByLayerId(layer.featureLayerId)
          let info = {}
          layerView.queryFeatures(query)
            .then(function(featureSet){
              if (featureSet.hasOwnProperty("features")){
                if(featureSet.features.length >0){
                  featureSet.features.forEach(function(fSetFeature){
                    const feature = JSON.parse(JSON.stringify(fSetFeature))
                    info[feature.attributes.OBJECTID+"_"+featureLayerId] = {}
                    
                    let layerConfig = self.getLayerConfig(featureLayerId) 
                    layerConfig.fields.forEach(function(field){
                      if(field.name!=='OBJECTID'){
                        if(field.name==='ADOPTED'){
                          info[feature.attributes.OBJECTID+"_"+featureLayerId][field.alias] = feature.attributes[field.name]==="true"?true:false   
                        }
                        else{
                          info[feature.attributes.OBJECTID+"_"+featureLayerId][field.alias] = feature.attributes[field.name]
                        }
                      }
                    })
                  })
                  let graphic = featureSet.features[0]
                  graphic.symbol = markerSymbol
                  self.updateFeatureSelectionGraphic(graphic)
                  self.setState({infoData:info})
                }
                else{
                  self.setState({infoData: null})
                  self.state.mapView.graphics.removeAll()
                }  
              }
            })
            .catch(err => {
              // handle any errors
              console.error(err);
            });
        }  
      })
    })
    .catch(err => {
      // handle any errors
      console.error(err);
    });  
  }
  updateFeatureSelectionGraphic=(feature)=>{
    //console.log("feature: " + JSON.stringify(feature))
    this.state.mapView.graphics.removeAll()
    this.state.mapView.graphics.add(feature)
  }
  getLayerViewByLayerId = (layerId) => {
    const layerViews = this.state.layerViews
    let layerView = null
    for(let i = 0; i < layerViews.length; i++){
      //'featureLayerId' : layer.id, 'layerView' : layerView
      if(layerViews[i].featureLayerId === layerId){
        layerView = layerViews[i].layerView
        break
      }
    }
    return layerView    
  }
 
  getLayerConfig = (featureLayerId) => {
    let layerConfig
    for(var i=0; i < layers.length; i++){
      const layer = layers[i]
      if(layer.id === featureLayerId){
        layerConfig = layer
        break
      }
    }
    return layerConfig
  }
  getFacilityIds = (results) => {
    let ids = []
    JSON.parse(JSON.stringify(results)).forEach(function(result){
     ids.push(result.attributes["Facility ID"])
    })
    return ids
  }


  deleteObjectKeys = (object,keys) => {
    keys.forEach(function(key){
      delete object[key]
    })
    return
  }
  adoptCallback = (record) => {
    const self = this
    loadModules(['esri/tasks/QueryTask','esri/tasks/support/Query'])
    .then(([QueryTask,Query]) => 
    {
      const mv = self.state.mapView
      const map = mv.map
      const key = record[Object.keys(record)[0]]
      const featureLayerId = key.split("_")[1]
      const facilityId = record.value["Facility ID"]
      let fl = map.findLayerById(featureLayerId)
      var query = fl.createQuery();
      query.where = "FACILITYID = '"+facilityId+"'"
      //!!!!!TODO: may want to make the distance some multiplier based on the % progressoin of zoom level scales. 
      query.returnGeometry = false;
      query.outFields = [ "OBJECTID","FACILITYID","INLETTYPE","ACCESSDIAM","ADOPTED", "SFID" ];
      const layerView = self.getLayerViewByLayerId(featureLayerId)
      //let info = {}
      layerView.queryFeatures(query)
      .then(function(featureSet){
        let feature = JSON.parse(JSON.stringify(featureSet.features[0]))
        feature.attributes.ADOPTED = record.value.Adopted===true?"true":"false"
        fl.applyEdits({updateFeatures:[feature]})
        .then(function(editResult) {
          fl.queryFeatures().then(function(results){
          })
        }) 
      })
      .catch(err => {
        // handle any errors
        console.error(err);
      });
    })
  }
  panelUseChange = (useState) => {
    this.setState({panelUse:useState})
  }
  render() {
    const options = {
      url: 'https://js.arcgis.com/4.10/'
    };
    return (
      <div className="ReactMap">
        <EsriLoaderReact 
          options={options}
          modulesToLoad={['esri/Map', 'esri/views/MapView', 'esri/layers/GraphicsLayer', 'esri/core/watchUtils', 'esri/geometry/support/webMercatorUtils']}    
          onReady={this.loadMap}
        />
        {/* <MapOverlayPanel 
          adoptCallback = {this.adoptCallback}
          infoData = {this.state.infoData}
          panelUse = {this.state.panelUse}
          panelUseChangeCallback = {this.panelUseChange}
          nodeAppRoot={this.props.nodeAppRoot}
          sandboxRoot = {this.props.sandboxRoot}
        /> */}
        
      </div>
    );
  }
}

export default ReactMap;