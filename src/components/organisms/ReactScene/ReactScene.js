import React from 'react';
import EsriLoaderReact from 'esri-loader-react';
import SidePanel from './SidePanel'
import './ReactScene.css';

class ReactScene extends React.PureComponent {
  constructor(props){
      super(props)
      this.state = {
        mapData: null
      }
      console.log('this.state: ' + JSON.stringify(this.state));
      this.mapClick = this.mapClick.bind(this);
  }
  loadMap = ({loadedModules: [WebScene, SceneView], containerNode}) => {

    //aef9f3b236e9492a97f0505376879fbb
    console.log('esriMapLoader');
    new SceneView({
      container: containerNode
      , map: new WebScene({
        portalItem: { // autocasts as new PortalItem()
          id: "fd0de9c0c67f4c4fb7be4f364c3396a5"
        }
      })
      , camera: {
          position: {
            x: -78.78004,
            y: 35.78961,
            z: 400,
            spatialReference: {
              wkid: 4326
            }
          },
          heading: 280,
          tilt: 85.5
      }
    }).on('click', this.mapClick)
    // }).on('click', function(e){
    //   //TODO: 1. get elevation reference and lat lon coordinate
    //   //TODO: 2. create web3.js token at click coordinates and elevation 
    //   this.setState({mapData: JSON.stringify(e.mapPoint)});
    //   console.log('quit clicking me mapPoint: ' + JSON.stringify(this.state.mapData));
    // }) 
  }
  mapClick = (e) => {
    console.log(e);
    console.log('mapClick');
    console.log(JSON.stringify(e.mapPoint));
    console.log('quit clicking me mapPoint: ' + JSON.stringify(this.state.mapData));
    this.setState({mapData: JSON.stringify(e.mapPoint)});
  }
  
  render() {
    
    const options = {
      url: 'https://js.arcgis.com/4.6/'
    };
    return (
      <div className="ReactScene">
        <EsriLoaderReact 
          options={options}
          modulesToLoad={['esri/WebScene', 'esri/views/SceneView']}  
           onReady={this.loadMap} 
        />
        <SidePanel ref="sidePanel" dataFromMap={this.state.mapData}/>
      </div>
    );
  }
}

export default ReactScene;