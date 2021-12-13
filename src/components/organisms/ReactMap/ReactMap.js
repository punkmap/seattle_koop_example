import React from 'react'
import EsriLoaderReact from 'esri-loader-react'
import { loadModules } from 'esri-loader'
import MapOverlayPanel from '../../molecules/MapOverlayPanel/MapOverlayPanel'
import './ReactMap.css'

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
    this.loadMap = this.loadMap.bind(this);
  }
  loadMap = ({loadedModules: [Map, MapView, GraphicsLayer, watchUtils, webMercadorUtils], containerNode}) => {
    const self = this;

    const map = new Map({basemap: 'satellite', id:"daMap"})
    const mapView = new MapView({
      container: containerNode
      , center: [-122.329, 47.62]
      , zoom: 13
      , map: map
    })

    mapView.on('click', (e) => {
      console.log(e)
      mapView.hitTest(e.screenPoint)
        .then(function(response){
          // Retrieve the first symbol
          var graphic = response.results[0].graphic;
          if (graphic) {
            // set infoData state to graphic attributes
            self.setState({infoData:{id: graphic.attributes.id, name: graphic.attributes.name, desc: graphic.attributes.desc}})
          }
      });
    })
    mapView.when((function(mapView){
        mapView.id = "myMapView"
        self.setState({mapView:mapView})
        mapView.on('click', self.mapClick)
        
        self.addFeatureLayers(mapView)
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
  addFeatureLayers = (mapView) =>{
    const self = this
    loadModules(['esri/layers/FeatureLayer'])
    .then(([FeatureLayer]) => 
    {
      self.assetsLayer = new FeatureLayer({
        id: 'assetsLayer',   
        url: "http://localhost:8080/salesforce_assets/rest/services/FeatureServer/",
          outFields: ["*"],
      });
      self.assetsLayer.renderer = {
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
      mapView.map.add(self.assetsLayer);
    })
  }
  refreshAssetsLayer = () => {
    const self = this;
    self.assetsLayer.refresh()
  }
  
  mapClick = (e) => {
      this.panelUseChange("info")
  }
  
  updateFeatureSelectionGraphic=(feature)=>{
    this.state.mapView.graphics.removeAll()
    this.state.mapView.graphics.add(feature)
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
        <MapOverlayPanel 
          infoData = {this.state.infoData}
          panelUse = {this.state.panelUse}
          panelUseChangeCallback = {this.panelUseChange}
          nodeAppRoot={this.props.nodeAppRoot}
          sandboxRoot = {this.props.sandboxRoot}
          refreshAssetsLayer = {this.refreshAssetsLayer}
        />
        
      </div>
    );
  }
}

export default ReactMap;