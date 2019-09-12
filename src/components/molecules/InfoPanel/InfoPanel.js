import React, { Component } from 'react'
import axios from 'axios'
import classNames from 'classnames'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

import Grid from '@material-ui/core/Grid'
import Fade from '@material-ui/core/Fade'
import IconButton from '@material-ui/core/IconButton'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import ForwardIcon from '@material-ui/icons/KeyboardArrowRight'
import green from '@material-ui/core/colors/green';
import blue from '@material-ui/core/colors/blue';
import purple from '@material-ui/core/colors/purple';
import Fab from '@material-ui/core/Fab';
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Link from '@material-ui/core/Link'


import Paper from '@material-ui/core/Paper';
import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import AddComment from '@material-ui/icons/AddComment'
import ArrowLeft from '@material-ui/icons/ArrowLeft'
import TextField from '@material-ui/core/TextField';
import Divider from '@material-ui/core/Divider';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

import './InfoPanel.css'

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
    pointerEvents: 'auto',
  },
  list: {
      width: '100%',
      height : '100%',
      position: 'relative',
      margin: 0,
      paddingTop:theme.spacing.unit*5,
  },
  listSection: {
      height : '100%',
      backgroundColor: 'inherit',
      listStyleType: 'none',
      width: '100%',
  },
  link: {
    margin: theme.spacing.unit,
  },
  ul: {
      backgroundColor: 'inherit',
      padding: 0,
      margin:0,
  },
  subHeader: {
      fontSize:'2rem',
      backgroundColor:'#E8E8E8'
  },
  pointerEventsAuto: {
      pointerEvents: 'auto'
  },
  orphanedButton: {
    color: theme.palette.getContrastText(green[500]),
    backgroundColor: green[500],
    maxWidth: theme.spacing.unit * 25,
    margin:theme.spacing.unit*0.5,
    '&:hover': {
        backgroundColor: green[700],
    },
  },
  adoptedButton: {
    color: theme.palette.getContrastText(blue[500]),
    backgroundColor: blue[500],
    maxWidth: theme.spacing.unit * 25,
    margin:theme.spacing.unit*0.5,
    '&:hover': {
        backgroundColor: blue[700],
    },
  },
  chatterButton: {
    color: theme.palette.getContrastText(purple[500]),
    backgroundColor: purple[500],
    maxWidth: theme.spacing.unit * 25,
    margin:theme.spacing.unit*0.5,
    '&:hover': {
        backgroundColor: purple[700],
    },
  },
  
  chatterHeader: {
    height: theme.spacing.unit*15,
  },
  chatterList: {
    width: '100%',
    height : '100%',
    position: 'relative',
    margin: 0,
      paddingTop:theme.spacing.unit,
  },
  // noPaddingGrid: {
  //   padding: 0,
  //   margin: 0,
  //   maxHeight: theme.spacing.unit*4,
  // },
  chatterPostGrid: {
    paddingTop:  theme.spacing.unit,
    paddingBottom: 0,
    paddingRight:  theme.spacing.unit*3,
    marginTop: 0,
    marginBottom: 0,
    marginRight:  theme.spacing.unit*3,
  },
  avatar: {
    margin: 10,
  },
  paper: {
    width:'100%',
    padding:theme.spacing.unit,
  },
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
  heading: {
    fontSize: theme.typography.pxToRem(18),
    fontWeight: theme.typography.fontWeightRegular,
  },
  commentList: {
    width: '100%',
    height : '100%',
    position: 'relative',
    margin: 0,
    paddingTop:0,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: '100%',
  },
  commentGrid:{
    paddingRight: theme.spacing.unit*3,
    
  }
});

class InfoPanel extends Component {
  constructor(props){
    super(props)
    this.state = {
        pageIndex: 0
        , pageCount:null
        , popupData:null
        , hasError: false
        , adoptData: {value:{adopted:null, label:null}}
        , chatterInfo:null
        , postText:""
        , commentValues:[]
        , panelUse: null
        , chatterFeedInterval: null
    }
  }
  componentDidUpdate() {
    const self = this
    if(self.props.infoData){
      if(this.state.adoptData !== this.props.infoData){self.setState({adoptData:self.props.infoData})}
    }
    if(this.props.panelUse !== this.state.panelUse){
      this.setState({panelUse:this.props.panelUse})
      if (this.props.panelUse==="chatter"){
        this.setState({chatterFeedInterval: setInterval(function(){
          self.getChatterFeed();
        },30000)})
      }
      else{
        clearInterval(this.state.chatterFeedInterval)
      }
    }
  }
  
  toggleAdopt = () => {
    const self = this
    const assetKeyInfo = self.getAdoptStatusByIndex(self.state.pageIndex) 
    const info = {'sfid':assetKeyInfo.value["Salesforce Id"], 'Adopted':!assetKeyInfo.value.Adopted}
    
    axios({
      method: 'post'
      , url: this.props.nodeAppRoot+"toggleadopt/"
      , data: {
        info:info
      }
    })
    .then(function(response){
      let data = JSON.parse(JSON.stringify(self.state.adoptData))
      self.getAdoptStatusByIndex(self.state.pageIndex).value.Adopted = !self.getAdoptStatusByIndex(self.state.pageIndex).value.Adopted
      self.setState({adoptData:data})
      
      self.props.adoptCallback(self.getAdoptStatusByIndex(self.state.pageIndex))
    })
    .catch(function (error) {
      console.log("login ELSE error: " + error);
    });
  }
  getChatterFeed = () => {
    const self = this
    const salesforceId = self.getAdoptStatusByIndex(self.state.pageIndex).value["Salesforce Id"]
    
    axios({
      method: 'post'
      , url: this.props.nodeAppRoot+"getchatterfeed/"
      , data: {
        sfId:salesforceId
      }
    })
    .then(function(response){
      if(self.state.chatterInfo!==response.data){
        self.setState({chatterInfo:response.data})
        self.props.panelUseChangeCallback('chatter')
      }
      
    })
    .catch(function (error) {
      console.log("login ELSE error: " + error);
    });  
  }
  constructChatterDiv = (segments) => {
    let tag
    segments.forEach(function(seg){
      if(seg.hasOwnProperty("htmlTag")){
        if(seg.type==="MarkupBegin"){
            tag += '<'+seg.htmlTag+'>'
        }
        else{
            tag += '</'+seg.htmlTag+'>'
        }
      }
      else if(seg.hasOwnProperty("text")){
          tag += seg.text
      }
    })
  }
  addPost = (subjectId) => {
    const self = this;
    const msgBody = { 
      "body" : {
          "messageSegments" : [
            {
                "type" : "Text",
                "text" : this.state.postText
            }]
          },
      "feedElementType" : "FeedItem",
      "subjectId" : subjectId
    } 
    axios({
      method: 'post'
      , url: this.props.nodeAppRoot+"addchatterpost/"
      , data: {
        msgBody:msgBody
      }
    })
    .then(function(response){
      let chatterInfo = self.state.chatterInfo
      chatterInfo.unshift(response.data)
      self.setState({chatterInfo:chatterInfo})
      self.setState({postText: ""})
    })
    .catch(function (error) {
      console.log("login ELSE error: " + error);
    });
    
  }
  postOnChange = event => {
    this.setState({postText: event.target.value})
  }
  addComment =(messageId) => {
    const self = this
    let msgBody = {"messageId":messageId, "comment" : this.state.commentValues[messageId]}
    axios({
      method: 'post'
      , url: this.props.nodeAppRoot+"addchattercomment/"
      , data: {
        msgBody:msgBody
      }
    })
    .then(function(response){
      let chatterInfo = self.state.chatterInfo
      for(let i=0; i<chatterInfo.length; i++){
        let chat = chatterInfo[i]
        if (chat.message.id === messageId){
          chatterInfo[i].message.comments.page.items.push(response.data)
          self.setState({chatterInfo:chatterInfo})
          self.setState({commentValues:{...self.state.commentValues, [messageId]: ""}})
          break
        }
      }
    })
    .catch(function (error) {
      console.log("login ELSE error: " + error);
    });
    
  }
  commentOnChange(i, e) {
    this.setState({
      commentValues: { ...this.state.commentValues, [i]: e.target.value }
    });
  }
  nextRecord = () => {
    this.setState({pageIndex: this.state.pageIndex+1}) 
  }
  lastRecord = () => {
    this.setState({pageIndex: this.state.pageIndex-1}) 
  }
  getAdoptStatusByIndex = (idx) => {
    var key = Object.keys(this.state.adoptData)[idx];
    //console.log("{ key: key, value: this.state.adoptData[key] }: " + JSON.stringify({ key: key, value: this.state.adoptData[key] }))
    return { key: key, value: this.state.adoptData[key] };
  }
  isSalesforceLink=(item)=>{
    console.log(item)
    let returnBool
    item==="Salesforce Id"?returnBool = true:returnBool = false
    return returnBool
  }
  render() {
    const { classes } = this.props
    const self = this
    return (
      <Fade in={this.props.infoData!=null} timeout={1}>
        <div className={classNames('infoPanel', {[classes.pointerEventsAuto]:this.props.infoData!=null})}>
          { this.props.panelUse==='info' &&
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
                    <Grid item xs>
                      <IconButton 
                        //disabled={this.state.pageIndex === 0}
                        disabled = {true}
                        className={classes.button} 
                        onClick={this.lastRecord}
                      >  
                        <BackIcon />
                      </IconButton>
                    </Grid>
                    <Grid item xs={6}>
                    { self.props.infoData
                      ? <h4>Facility Id: {JSON.stringify(self.getAdoptStatusByIndex(self.state.pageIndex).value["Facility ID"])}</h4>
                      : null
                    }
                    </Grid>
                    <Grid item xs>
                      <IconButton 
                        // disabled = {this.state.pageIndex===this.props.realEstateDataLength}
                        disabled = {true}
                        className={classes.button} 
                        onClick={this.nextRecord}
                      >
                        <ForwardIcon />
                      </IconButton>
                    </Grid>
                  </Grid>
                </div>
                <div className='body'>
                
                <Grid
                  container
                  direction="column"
                  justify="center"
                  alignItems="center"
                >
                  { self.props.infoData
                      ? <div>
                          <List className={classes.list} subheader={<li />}>
                            <li key={`section-${self.props.infoData["Facility ID"]}`} className={classes.listSection}>
                                {JSON.stringify(self.props.infoData) != '{}' &&
                                    <ul className={classes.ul}>
                                        {Object.keys(self.getAdoptStatusByIndex(self.state.pageIndex).value).map(item => {
                                        if(item==="Salesforce Id"){
                                          return(<ListItem key={`item-${self.getAdoptStatusByIndex(self.state.pageIndex)}-${item}`}>
                                              <Link href={self.props.sandboxRoot+`${self.getAdoptStatusByIndex(self.state.pageIndex).value[item]}`} target="_blank">
                                                Asset Link
                                              </Link>
                                          </ListItem>)
                                        } 
                                        else{
                                          return(<ListItem key={`item-${self.getAdoptStatusByIndex(self.state.pageIndex)}-${item}`}>
                                              <ListItemText primary={`${item} : ${self.getAdoptStatusByIndex(self.state.pageIndex).value[item]}`} />
                                          </ListItem>)
                                        } 
                                      })}
                                    </ul>
                                }
                            </li>
                          </List>
                          <Grid
                            container
                            direction="column"
                          >
                            <Fab variant="extended" 
                              //disabled={this.state.disableDeleteButton}
                              //color="primary" 
                              aria-label="Delete" 
                              className={self.getAdoptStatusByIndex(self.state.pageIndex).value["Adopted"]===false?classes.orphanedButton:classes.adoptedButton}
                              onClick={this.toggleAdopt.bind(this)}
                            >
                                <b>{self.getAdoptStatusByIndex(self.state.pageIndex).value["Adopted"]===false?"Adopt":"Orphan"}</b>
                            </Fab>      
                            <Fab variant="extended" 
                              //disabled={this.state.disableDeleteButton}
                              //color="primary" 
                              className={classes.chatterButton}
                              onClick={this.getChatterFeed.bind(this)}
                            >
                                <b>Chatter</b>
                            </Fab>
                          </Grid> 
                        </div>
                      : null
                  }
                  
                </Grid>
              </div>
            </div>     
          </Fade>
          }
          { this.props.panelUse==='chatter' &&
          
          <Fade in={this.props.panelUse==='chatter'} timeout={1}>
            <div>
              <div className={classes.chatterHeader}>
              <Grid item xs
                  className={classes.chatterPostGrid}>
                    {/* <IconButton 
                      // disabled = {this.state.pageIndex===this.props.realEstateDataLength}
                      className={classes.button} 
                      onClick={this.nextRecord}
                    >
                      <ForwardIcon />
                    </IconButton> */}
                  <Grid
                    container
                    spacing={16}
                    alignItems="center"
                    direction="row"
                  >
                    {/* <Grid item xs={2}>
                      <Fab size="small" color="primary">
                        <ArrowLeft 
                          className={classes.button} 
                          onClick={() => self.props.panelUseChangeCallback("info")}
                        >  
                          
                        </ArrowLeft>
                      </Fab>
                    </Grid>  */}
                    <Grid item xs={2}
                    >
                      <IconButton 
                        className={classes.button} 
                        onClick={() => self.addPost(self.state.chatterInfo[0].message.parentId)}
                        //disabled = {self.state.postText.length!=0}
                      >  
                        <AddComment color="primary" />
                      </IconButton>
                    </Grid>  
                    <Grid item xs={10}
                    >
                      <TextField
                          id="chatPostTextField"
                          label={'Post to: ' + JSON.stringify(self.getAdoptStatusByIndex(self.state.pageIndex).value["Facility ID"])}
                          multiline
                          rowsMax="4"
                          value={this.state.postText}
                          onChange={self.postOnChange}
                          className={classes.textField}
                          margin="normal"
                      />
                    </Grid>
                  </Grid> 
              </Grid>  
              </div>
              <div className='body'>
              
              <Grid
                container
                direction="column"
                justify="center"
                alignItems="center"
              >
                { self.state.chatterInfo
                    ? <Grid
                      container
                      direction="column"
                      justify="center"
                      alignItems="center">
                        <List className={classes.chatterList} >
                          <li key={`section-${self.props.infoData["Facility ID"]}`} >
                              {JSON.stringify(self.props.infoData) != '{}' &&
                                  <ul className={classes.ul}>
                                      {self.state.chatterInfo.map((item, index) => {
                                        
                                        return(
                                          <ListItem key={`item-${index}`}>
                                            <Paper className={classes.paper} elevation={1}>
                                              <Grid
                                                container
                                                spacing={16}
                                                alignItems="center"
                                                direction="row"
                                              >
                                                <Avatar src={item.actor.photo} className={classes.avatar} />
                                                <ListItemText>
                                                  <Link href={this.props.sandboxRoot+`${item.actor.id}`+"/view"} target="_blank">
                                                    {item.actor.displayName}
                                                  </Link>
                                                </ListItemText>
                                              
                                              </Grid>
                                                  
                                                    <p >
                                                        {item.message.text}
                                                  
                                                  
                                                    </p>
                                              <Grid
                                                container
                                                spacing={16}
                                                alignItems="center"
                                                direction="row"
                                                className={classes.commentGrid}
                                              > 
                                                <Grid item xs={2}>
                                                  <IconButton 
                                                    className={classes.button} 
                                                    onClick={() => self.addComment(item.message.id)}
                                                  >  
                                                    <AddComment color="primary" />
                                                  </IconButton>
                                                </Grid>  
                                                <Grid item xs={10}>
                                                  <TextField
                                                      id="standard-multiline-flexible"
                                                      label="Comment Text:"
                                                      multiline
                                                      rowsMax="4"
                                                      
                                                      value={this.state.commentValues[item.message.id]} 
                                                      name={this.state.commentValues[item.message.id]} 
                                                      onChange={this.commentOnChange.bind(this, item.message.id)}
                                                      className={classes.textField}
                                                      margin="normal"
                                                  />
                                                </Grid>
                                              </Grid>    
                                                  {item.message.comments.page.items.length>0 &&
                                                    <div>
                                                      <ExpansionPanel>
                                                        <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
                                                          <Typography className={classes.heading}>Comments</Typography>
                                                        </ExpansionPanelSummary>
                                                        <ExpansionPanelDetails>
                                                        <List className={classes.commentList} >
                                                        <li key={`section-${self.props.infoData["Facility ID"]}`} >
                                                            {JSON.stringify(self.props.infoData) != '{}' &&
                                                                // response.data[1].message.comments.page.items[0].user
                                                                <ul className={classes.ul}>
                                                                    {item.message.comments.page.items.map((item, index) => {
                                                                      
                                                                      return(
                                                                        <ListItem key={`item-${index}`}>
                                                                          <Paper className={classes.paper} elevation={1}>
                                                                            <Grid
                                                                              container
                                                                              spacing={16}
                                                                              alignItems="center"
                                                                              direction="row"
                                                                            >
                                                                              <Avatar src={item.user.photo.smallPhotoUrl} className={classes.avatar} />
                                                                              <ListItemText>
                                                                                <Link href={"https://carync--odin.lightning.force.com/lightning/r/User/"+`${item.user.id}`+"/view"} target="_blank">
                                                                                  {item.user.displayName}
                                                                                </Link>
                                                                              </ListItemText>
                                                                            </Grid>
                                                                            <p >
                                                                                {item.body.text}
                                                                            </p>
                                                                            </Paper>
                                                                          </ListItem>)
                                                                        })}
                                                                    </ul>
                                                                }
                                                            </li>
                                                          </List>
                                                        </ExpansionPanelDetails>
                                                      </ExpansionPanel>
                                                      
                                                      
                                                    </div>
                                                  }
                                            </Paper>
                                        </ListItem>)
                                      })}
                                  </ul>
                              }
                          </li>
                        </List>
                        
                      </Grid>
                    : null
                }
                
              </Grid>
              </div>    
              </div>
              </Fade>}      
        </div>
      </Fade>
    )
  }
}
InfoPanel.propTypes = {
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(InfoPanel);