import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListSubheader from '@material-ui/core/ListSubheader';

const styles = theme => ({
    parentDiv: {
        width: '100%',
        height : '100%'
    },
    list: {
        width: '100%',
        height : '100%',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
    },
    subHeader: {
        fontSize:'2rem',
        backgroundColor:'#E8E8E8'
    },
});

class PopUp extends React.Component {
    componentDidUpdate = () => {
        console.log('componentDidUpdate')
    }
    generate = (element)=> {
        return [0, 1, 2, 3, 4, 5, 6].map(value =>
            React.cloneElement(element, {
            key: value,
            }),
        );
    }
    render(props) {
      const { classes } = this.props;
      const self = this
      console.log('popupRender');
      const popupData = {}
      popupData.parcelData = {'label': 'Parcel Data:', 'data':self.props.parcelData}
      popupData.realEstate = {'label': 'Real Estate Data:', 'data':self.props.realEstateData}
      console.log('popupData: ' + JSON.stringify(popupData))
      console.log('classes.subHeader: ' + JSON.stringify(classes.subHeader))
      //   Object.keys(popupData).map(type => {
    //     console.log('label: ' + popupData[type].label)
    //     console.log('data: ' + JSON.stringify(popupData[type].data))
    //     // if (self.props.popupData[type].data){
    //     //   Object.keys(self.props.popupData[type].data).map(item => {
    //     //       console.log('item: ' + item);
    //     //       console.log('self.props.popupData[type].data: ' + self.props.popupData[type].data[item])
    //     //   })
    //     // }  
    //   })
      return (
        <div className={classes.parentDiv}>
            <List className={classes.list} subheader={<li />}>
                {Object.keys(popupData).map(type => (
                    //console.log('popupData[type].label: ' + popupData[type].label)
                    <li key={`section-${popupData[type].label}`} className={classes.listSection}>
                        {JSON.stringify(popupData[type].data) != '{}' &&
                            <ul className={classes.ul}>
                                <ListSubheader disableGutters disableSticky className={classes.subHeader}>{`${popupData[type].label}`}</ListSubheader>
                                {Object.keys(popupData[type].data).map(item => (
                                <ListItem key={`item-${popupData[type].label}-${item}`}>
                                    <ListItemText primary={`${item} : ${popupData[type].data[item]}`} />
                                </ListItem>
                                ))}
                            </ul>
                        }
                    </li>
                ))}
                {/* {headerLabels.map(sectionId => (
                    <li key={`section-${sectionId}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <ListSubheader>{`${sectionId}`}</ListSubheader>
                            {[0, 1, 2].map(item => (
                            <ListItem key={`item-${sectionId}-${item}`}>
                                <ListItemText primary={`Item ${item}`} />
                            </ListItem>
                            ))}
                        </ul>
                    </li>
                ))}
                {Object.keys(self.props.popupData).map(type => (
                    <li key={`section-${type.label}`} className={classes.listSection}>
                        <ul className={classes.ul}>
                            <ListSubheader>{`${type.label}`}</ListSubheader>
                            {Object.keys(type.data).map.map(item => (
                            <ListItem key={`item-${type.label}-${item.key}`}>
                                <ListItemText primary={`${item.key} ${item.value}`} />
                            </ListItem>
                            ))}
                        </ul>
                    </li>
                ))} */}
            </List>
        </div>
      );
    }
  }
  PopUp.propTypes = {
    classes: PropTypes.object.isRequired,
  };  
export default withStyles(styles)(PopUp)