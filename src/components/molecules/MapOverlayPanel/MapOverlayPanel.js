import React, { Component } from 'react'
import InfoPanel from '../InfoPanel/InfoPanel'
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
    this.props.projectCallback(value)
  }
  setPhaseCallback = (value) =>{
    this.props.phaseCallback(value)
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
          <InfoPanel
            infoData={this.props.infoData}
            // adoptCallback={this.props.adoptCallback}
            panelUse = {this.props.panelUse}
            panelUseChangeCallback = {this.props.panelUseChangeCallback}
            nodeAppRoot={this.props.nodeAppRoot}
            sandboxRoot = {this.props.sandboxRoot}
            refreshAssetsLayer = {this.props.refreshAssetsLayer}
          ></InfoPanel>

        </Grid>
      </div>
    )
  }
}

export default MapOverlayPanel