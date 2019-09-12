import React, { Component, Fragment } from 'react'
import { loadModules } from 'esri-loader'
import './MapSearch.css'

import pinImg from '../../../assets/PushPin.png'

import Grid from '@material-ui/core/Grid'
class MapSearch extends Component {
  constructor(props){
    super(props)
    this.state = {
        searchWidget: null
    }
  }
 componentDidUpdate() {
    const self = this
    loadModules(['esri/widgets/Search', 'esri/layers/GraphicsLayer', 'esri/Graphic', 'esri/symbols/PictureMarkerSymbol', 'esri/geometry/support/webMercatorUtils', 'esri/tasks/Locator']).then(([Search, GraphicsLayer, Graphic, PictureMarkerSymbol, webMercatorUtils, Locator]) => {
      
        if (self.state.searchWidget==null&&self.props.view!=null&&self.props.view.map!=null){
        const view = self.props.view;
        let searchWidget = new Search({
          view: view
          , container: 'searchWidget'
          , locationEnabled: false
          , resultGraphicEnabled: false
          //, popupEnabled: false
        })
        let sources = searchWidget.get('sources');
        let propertySource = {
          featureLayer: {
            url: "https://maps.townofcary.org/arcgis1/rest/services/Property/Property/MapServer/0",
          },
          searchFields: ["PIN10"],
          displayField: "PIN10",
          exactMatch: false,
          outFields: ["PIN10"],
          name: "Property PIN10",
          placeholder: "PIN10: 0764523393",
    }
        sources.push(propertySource,
        {
            //Pass in the custom locator to the sources
            locator: new Locator("https://maps.townofcary.org/arcgis1/rest/services/Locators/Cary_Com_Locator/GeocodeServer"),
            singleLineFieldName: "SingleLine",
            outFields: ["*"],
            name: "ToC Locator",
            autoNavigate: true,
            maxSuggestions: 3,
            placeholder: "Address: 120 Wilkinson Ave"
        })
        searchWidget.set('sources', sources)
        searchWidget.activeSourceIndex = 1;
        self.setState({searchWidget:searchWidget})  
        let searchResultGL = new GraphicsLayer()
        self.props.view.map.add(searchResultGL, 5)
        let resultIcn = new PictureMarkerSymbol({url:pinImg, height: '48px', width: '48px'})
        
        searchWidget.on('search-complete', function(event) {
          let mapPoint = webMercatorUtils.webMercatorToGeographic(event.results[0].results[0].feature.geometry)
          let resultG = new Graphic({
              geometry: mapPoint, 
              symbol: resultIcn
            });
            console.log('event.activeSourceIndex: ' + event.activeSourceIndex)
            // if(event.activeSourceIndex === 1||event.activeSourceIndex === 2){
            //   self.props.selectParcelCallback(mapPoint.centroid)
            // }
          searchResultGL.graphics.add(resultG)
        })

        if(self.props.resultPinDragable == true){
            let draggingGraphic;
            let tempGraphic;
            view.on("drag", function(evt) {       
              // if this is the starting of the drag, do a hitTest
              if (evt.action === 'start'){
                view.hitTest(evt).then(resp => {
                  if (resp.results[0].graphic && resp.results[0].graphic.geometry.type === 'point'){
                    evt.stopPropagation();
                    // if the hitTest returns a point graphic, set dragginGraphic
                    draggingGraphic = resp.results[0].graphic;
                  }
                });
              } else if (evt.action === 'update'){
                // on drag update events, only continue if a draggingGraphic is set
                if (draggingGraphic){
                  evt.stopPropagation();
                  // if there is a tempGraphic, remove it
                  if (tempGraphic) {
                    searchResultGL.remove(tempGraphic);
                  } else {
                    // if there is no tempGraphic, this is the first update event, so remove original graphic
                    searchResultGL.remove(draggingGraphic);
                  }
                  // create new temp graphic and add it
                  tempGraphic = draggingGraphic.clone();
                  tempGraphic.geometry = view.toMap(evt);
                  searchResultGL.add(tempGraphic);
                }
              } else if (evt.action === 'end'){
                // on drag end, continue only if there is a draggingGraphic
                if (draggingGraphic){
                  evt.stopPropagation();
                  // rm temp
                  if (tempGraphic) searchResultGL.remove(tempGraphic);
                  // create new graphic based on original dragging graphic
                  let newGraphic = draggingGraphic.clone();
                  newGraphic.geometry = tempGraphic.geometry.clone();
                  
                  // add replacement graphic
                  searchResultGL.add(newGraphic);
                  
                  // reset vars
                  draggingGraphic = null;
                  tempGraphic = null; 
                }
              }    
            });
          }
      }
    })
  }
  render() {
    return (
      <div className="mapSearch">
        <Grid
          container
          spacing={16}
          alignItems="center"
          direction="row"
          justify="center"
        >
          <div id="searchWidget" />
        </Grid>
      </div>
    )
  }
}

export default MapSearch