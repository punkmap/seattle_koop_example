import React, { Component } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import IconButton from 'material-ui/IconButton';
// import FloatingActionButton from 'material-ui/FloatingActionButton';
// import NavigationClose from 'material-ui/svg-icons/navigation/close';

import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MenuIcon from '@material-ui/icons/Menu';
import DeleteIcon from '@material-ui/icons/DeleteForever';
import NavigationIcon from '@material-ui/icons/DoneAll';
import green from '@material-ui/core/colors/green';
import red from '@material-ui/core/colors/red';
import Fab from '@material-ui/core/Fab';
import AppBar from 'material-ui/AppBar';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField'
import './SidePanel.css';


function getPointerEvents(){
    return true
}
const styles = theme => ({
    appBar: {
      position: 'relative',
    }
    , textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    }
    , pointerEventsAuto: {
        pointerEvents: 'auto'
    }
    , paper: {
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
    }
    , type: {
        width: '100%',
        maxWidth: 500,
        paddingLeft: 15
    }
    , typeTitle: {
        paddingTop: 5
    }
    , addButton: {
        color: theme.palette.getContrastText(green[500]),
        backgroundColor: green[500],
        '&:hover': {
            backgroundColor: green[700],
        },
    }
    , deleteButton: {
        color: theme.palette.getContrastText(red[500]),
        backgroundColor: red[500],
        '&:hover': {
            backgroundColor: red[700],
        },
    }
    , extendedIcon: {
        marginRight: theme.spacing.unit*2,
    }

  });

class SidePanel extends Component {
    constructor(props){
        super(props);
        
        const { classes } = this.props;
        this.state = {
            project: ''
            , phase: ''
            , project_delete: ''
            , phase_delete: ''
            , disableAddButton: true
            , showDeleteButton: true
            , anchorEl: null
            , editAction: 'add'
            , titleBarTitle: 'Add Project'
            , pointerEvents: 'auto'
            // , sidePanelClasses: ['sidePanel', 'pointerEventsInactive']
            // , textFieldClasses: [classes.textField, classes.pointerEventsInactive]
            //, editAction: 'delete'
        };
        this.menuClick = this.menuClick.bind(this);
        this.handleClose = this.handleClose.bind(this);

        this.sideNav = React.createRef();
    }
    update = (e) => {
        this.props.onUpdate(e.target.value);
        this.setState({fieldVal: e.target.value});
    };
    handleChange = name => event => {
        name === 'project' || name==='project_delete' ? this.props.projectCallback(event.target.value) : this.props.phaseCallback(event.target.value)
        
        this.setState({
            [name]: event.target.value,
        }, () => {
            console.log('this.state.project_delete: ' + this.state.project_delete);
            console.log('this.state.phase_delete: ' + this.state.phase_delete);
            if(this.state.project && this.state.phase){
                this.setState({disableAddButton: false})
            }
            else{
                this.setState({disableAddButton: true})
            }
            if(this.state.project_delete && this.state.phase_delete){
                this.setState({disableDeleteButton: false})
            }
            else{
                this.setState({disableDeleteButton: true})
            }
        });
    };
    menuClick = (e) =>{
        this.setState({anchorEl : e.currentTarget})
    }
    
    handleClose = key => e => {
        key === 'add'? this.setState({titleBarTitle: 'Add Project'}) : this.setState({titleBarTitle: 'Remove Project'})
        this.setState({editAction:key})
        this.setState({anchorEl : null})
    }
    getPointerEvents = () => {
        return true
    }
    componentDidMount = () => {
        this.sideNav = React.createRef();
    }
    componentDidUpdate() {
        // const { classes } = this.props;
        // if(!this.props.hideSidePanel && this.state.sidePanelClasses !== ['sidePanel', 'pointerEventsActive']){
        //     this.state.sidePanelClasses.splice(-1, 1)
        //     this.state.sidePanelClasses.push('pointerEventsActive')
        // } 
        // else if (this.props.hideSidePanel && this.state.sidePanelClasses !== ['sidePanel', 'pointerEventsInactive']) {
        //     //this.setState({sidePanelClasses : ['sidePanel', 'sidePanelActive']})
        //     this.state.sidePanelClasses.splice(-1, 1)
        //     this.state.sidePanelClasses.push('pointerEventsInactive')
        // }
    }
    addProject = () =>{
        this.setState({project:''})
        this.setState({phase:''})
        this.setState({disableAddButton: true})
        this.props.addSelectedProperties()
    }
    removeProject = () =>{
        this.setState({project_delete:''})
        this.setState({phase_delete:''})
        this.setState({disableDeleteButton: true})
        this.props.deleteSelectedProperties()
    }
    render() {
        const { classes } = this.props;
        return (
        <MuiThemeProvider muiTheme={getMuiTheme(darkBaseTheme)}>
            <div >
                <Fade in={!this.props.hideSidePanel} timeout={1000}>
                    <Paper 
                        className={classNames('sidePanel', {[classes.pointerEventsAuto]:this.props.hideSidePanel===false})}
                        //className={this.state.sidePanelClasses.join(' ')}
                    >   
                        <AppBar className={classes.appBar} title={this.state.titleBarTitle} iconElementLeft={(
                            <IconButton color="inherit" aria-label="Menu" 
                                aria-owns={this.state.anchorEl ? 'simple-menu' : undefined}
                                aria-haspopup="true" 
                                onClick={this.menuClick}>
                                <MenuIcon />
                            </IconButton>)} 
                        >
                        <Menu id="simple-menu" anchorEl={this.state.anchorEl} open={Boolean(this.state.anchorEl)} onChange={this.handleClose}>
                            <MenuItem onClick={this.handleClose('add')}>Add</MenuItem>
                            <MenuItem onClick={this.handleClose('remove')}>Remove</MenuItem>
                        </Menu>
                        </AppBar>
                        {this.state.editAction==='add' ? (
                            <FormControl margin='normal'>
                                <TextField
                                    id="tf_project"
                                    label="Project Number"
                                    className={classes.TextField}
                                    value={this.state.project}
                                    onChange={this.handleChange('project')}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    id="tf_phase"
                                    label="Phase"
                                    className={classes.TextField}
                                    value={this.state.phase}
                                    onChange={this.handleChange('phase')}
                                    margin="normal"
                                    variant="outlined"
                                />
                                    <Fab variant="extended" 
                                        disabled={this.state.disableAddButton}
                                        color="primary" 
                                        aria-label="Add" 
                                        className={classes.addButton}
                                        onClick={this.addProject}>
                                    
                                        <NavigationIcon className={classes.extendedIcon} />
                                        <b>Add Selection</b>
                                    </Fab>
                            </FormControl>
                        ) : (
                            <FormControl margin='normal'>
                                <TextField
                                    id="tf_project_delete"
                                    label="Project Number"
                                    className={classes.textField}
                                    value={this.state.project_delete}
                                    onChange={this.handleChange('project_delete')}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <TextField
                                    id="tf_phase_delete"
                                    label="Phase"
                                    className={classes.textField}
                                    value={this.state.phase_delete}
                                    onChange={this.handleChange('phase_delete')}
                                    margin="normal"
                                    variant="outlined"
                                />
                                <Fab variant="extended" 
                                    disabled={this.state.disableDeleteButton}
                                    color="primary" 
                                    aria-label="Delete" 
                                    className={classes.deleteButton}
                                    onClick={this.removeProject}
                                >
                                    <DeleteIcon className={classes.extendedIcon} />
                                    <b>Delete Project</b>
                                </Fab>
                            </FormControl>
                        )}                
                    </Paper>
                </Fade>
            </div>
        </MuiThemeProvider>
        );
    }
}
SidePanel.propTypes = {
    classes: PropTypes.object.isRequired,
  };
export default withStyles(styles)(SidePanel);