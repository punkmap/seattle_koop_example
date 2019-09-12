import React from 'react';
import { withStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';

import Fab from '@material-ui/core/Fab';
import Add from '@material-ui/icons/Add';
import Icon from '@material-ui/core/Icon';

const styles = theme => ({
    fab: {
        margin: theme.spacing.unit,
        pointerEvents: 'auto',
    }
});

class UserButton extends React.Component {
    // componentDidUpdate = () => {
    //     console.log('componentDidUpdate')
    // }
    // generate = (element)=> {
    //     return [0, 1, 2, 3, 4, 5, 6].map(value =>
    //         React.cloneElement(element, {
    //         key: value,
    //         }),
    //     );
    // }
    onClick=()=>{
        this.props.logUserOut()
    }
    render(props) {
      const { classes } = this.props;
      
      return (
        <div className={classes.parentDiv}>
            
        <Fab color="primary" aria-label="Add" className={classes.fab} onClick={this.onClick}>
            <Add />
        </Fab>
        </div>
      );
    }
  }
  UserButton.propTypes = {
    classes: PropTypes.object.isRequired,
  };  
export default withStyles(styles)(UserButton)