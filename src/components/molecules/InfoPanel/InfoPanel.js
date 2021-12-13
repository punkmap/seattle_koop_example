import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'
import IconButton from '@material-ui/core/IconButton'
import EditIcon from '@material-ui/icons/Edit';
import DoneIcon from '@material-ui/icons/Done';
import TextField from '@material-ui/core/TextField';

import './InfoPanel.css'

const styles = theme => ({
  pointerEventsAuto: {
      pointerEvents: 'auto'
  },
  attributeGrid: {
    paddingLeft: '2em'
  },
});

class InfoPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
        pageIndex: 0
        , pageCount:null
        , popupData:null
        , hasError: false
        // , adoptData: {value:{adopted:null, label:null}}
        // , chatterInfo:null
        // , postText:""
        // , commentValues:[]
        , panelUse: null
        , nameEditing: false
        , chatterFeedInterval: null
    }
  }
  componentDidUpdate() {
    
    
  }
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.infoData) { 
      if (nextProps.infoData.name !== this.state.nameFieldValue) {
        this.setState({ nameFieldValue: nextProps.infoData.name });
      }
      if (nextProps.infoData.desc !== this.state.descFieldValue) {
        this.setState({ descFieldValue: nextProps.infoData.desc });
      }
    }
  }
  
  
  
  
  
  
  
  
  
  
  
  editField = (field) => {
    if (field === 'name'){
      this.setState({nameEditing:true, nameFieldValue: this.props.infoData.name})
    }
    else if (field === 'desc'){
      this.setState({descEditing:true, descFieldValue: this.props.infoData.desc})
    }
  }
  handleFieldChange = (e) => {
    if (e.target.id === 'nameTextField'){
      this.setState({
        nameFieldValue: e.target.value
      });
    }
    else if (e.target.id === 'descTextField'){
      this.setState({
        descFieldValue: e.target.value
      })
    }
  }
  saveField = (field) => {
    const self = this;
    let info;
    if (field === 'name'){
      this.setState({nameEditing:false})
      info = {
        Id:this.props.infoData.id, 
        Name: this.state.nameFieldValue
      }
    }
    else if (field === 'desc'){
      this.setState({descEditing:false})
      info = {
        Id:this.props.infoData.id, 
        Description: this.state.descFieldValue
      }
    }  
      axios({
        method: 'post'
        , url: this.props.nodeAppRoot+"saveasset/"
        , data: {
          info: info
        }
      })
      .then(function(response){
        self.props.refreshAssetsLayer();
      })
      .catch(function (error) {
      });
  }
  render() {
    const { classes } = this.props
    const self = this
    return (
      <Fade in={this.props.infoData!=null} timeout={1}>
        <div className={classNames('infoPanel', {[classes.pointerEventsAuto]:this.props.infoData!=null})}>
          <Fade in={this.props.panelUse==='info'} timeout={1}>
            <div>
                <div className='header'>
                  <Grid
                    container
                    spacing={16}
                    alignItems="center"
                    direction="row"
                    justify="center"
                  >
                    
                    <Grid item xs={12}>
                    { self.props.infoData
                      ? <h4>Asset Id: {self.props.infoData.id}</h4>
                      : null
                    }
                    </Grid>
                    
                  </Grid>
                </div>
                <div className='body'>
                
                
                  { self.props.infoData
                      ? <Grid
                          container
                          direction="column"
                          className={classes.attributeGrid}
                        > 
                          
                            {self.state.nameEditing!==true ? 
                            <Grid item xs={12}
                            alignItems="flex-start"
                            container
                            direction="row"
                            >
                              <h5>Name: {self.state.nameFieldValue}</h5>
                              <IconButton aria-label="edit" size="small" onClick={() => {
                                this.editField('name')
                              }}>
                                <EditIcon fontSize="inherit"/>
                              </IconButton>  
                            </Grid> :
                            <Grid item xs={12}
                            alignItems="flex-start"
                            container
                            direction="row"
                            >
                              <TextField id="nameTextField" label={self.state.nameFieldValue} variant="outlined" onChange={this.handleFieldChange}/>
                              <IconButton aria-label="save" size="small" color="success" onClick={() => {
                                this.saveField('name')
                              }}>
                                <DoneIcon fontSize="inherit"/>
                              </IconButton>  
                              </Grid>
                          }
                          {self.state.descEditing!==true ? 
                          <Grid item xs={12}
                          alignItems="flex-start"
                          container
                          direction="row"
                          >
                            <h5>Description: {self.state.descFieldValue}</h5>
                            <IconButton aria-label="delete" size="large" onClick={() => {
                              this.editField('desc')
                            }}>
                              <EditIcon fontSize="inherit"/>
                            </IconButton> 
                          </Grid> :
                          <Grid item xs={12}
                          alignItems="flex-start"
                          container
                          direction="row"
                          >
                            <TextField id="descTextField" label={self.state.descFieldValue} variant="outlined" onChange={this.handleFieldChange}/>
                            <IconButton aria-label="save" size="small" color="success" onClick={() => {
                              this.saveField('desc')
                            }}>
                              <DoneIcon fontSize="inherit"/>
                            </IconButton>  
                            </Grid>
                          }
                        </Grid>
                      : null
                  }
                  
              </div>
            </div>     
          </Fade>
        </div>
      </Fade>
    )
  }
}
InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InfoPanel);