import React, { Component } from 'react'
//import { loadModules } from 'esri-loader'
// import MapSearch from '../MapSearch/MapSearch'
// import SidePanel from '../../organisms/SidePanel'
// import InfoPanel from '../InfoPanel/InfoPanel'
// import UserButton from '../UserButton/UserButton'
import './MapOverlayPanel.css'
import Grid from '@material-ui/core/Grid'
class MapOverlayPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
      hideSidePanel: true
    }
  } 
  setProjectCallback = (value) =>{
    //this.setState({project:value})
    this.props.projectCallback(value)
  }
  setPhaseCallback = (value) =>{
    //this.setState({phase:value})
    this.props.phaseCallback(value)
  }
  componentDidUpdate = () => {
  }
  render() {
    return (
      <div className="mapOverlayPanel">
        <Grid
          container
          spacing={0}
          alignItems="center"
          direction="row"
          justify="center"
        >
          {/* <MapSearch 
            // selectParcelCallback={this.props.selectParcelCallback}
            view={this.props.view} 
            resultPinDragable={true}
          /> */}
          {/* <SidePanel ref="sidePanel" 
            //hideSidePanel={false} 
            hideSidePanel={this.props.hideSidePanel} 
            addSelectedProperties = {this.props.addSelectedProperties}
            deleteSelectedProperties = {this.props.deleteSelectedProperties}
            projectCallback = {this.setProjectCallback}
            phaseCallback = {this.setPhaseCallback}
          /> */}
          {/* <Chatter></Chatter> */}
          {/* <UserButton 
            logUserOut={this.props.logUserOut}
          /> */}
          {/* <InfoPanel
            // infoData={this.props.infoData}
            infoData={this.props.infoData}
            adoptCallback={this.props.adoptCallback}
            panelUse = {this.props.panelUse}
            panelUseChangeCallback = {this.props.panelUseChangeCallback}
            nodeAppRoot={this.props.nodeAppRoot}
            sandboxRoot = {this.props.sandboxRoot}
          ></InfoPanel> */}

        </Grid>
      </div>
    )
  }
}

export default MapOverlayPanel