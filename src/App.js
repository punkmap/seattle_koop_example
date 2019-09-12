import React, { Component } from 'react'
import axios from 'axios'
import './App.css'
//import config from './config'
import ReactMap from './components/organisms/ReactMap'

//const nodeAppRoot = 'https://woesoflightning.com/esri_salesforce_api/'
const nodeAppRoot = 'http://localhost:3002/'
const sandboxRoot = 'https://na136.lightning.force.com/'
const callbackRoot = "https://localhost:3000/"
// const callbackRoot = "https://woesoflightning.com"

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
      sessionTokenObj: null,
      sessionParameters: null,
    }
  }
  componentWillMount(){
    console.log('inthere2')
    const self = this
    var urlParams = new URLSearchParams(window.location.search);
    var code = urlParams.get('code');
    if(code === null){
      const url = nodeAppRoot+"getclientid/"
      console.log(url)
      axios({
        method: 'post'
        , url:  url
      })
      .then(function (response) {
        console.log(response);
        let location = sandboxRoot + "services/oauth2/authorize?response_type=code&client_id="+response.data+"&redirect_uri="+callbackRoot+"&state="+urlParams.get('state');
        window.location = location;  
      })
    }  
    else{
      self.setState({sessionParameters:urlParams.get('state')})
      console.log(nodeAppRoot+'settoken/');
      console.log(code)
      axios({
        method: 'post'
        , url:  nodeAppRoot+"settoken/"
        , data: {
          code:code
        }
      })
      .then(function(response){
        console.log('setToken response: ', response)
        self.setState({sessionTokenObj:response.data.data})
      })
      .catch(function (error) {
        console.log('API '+nodeAppRoot+'settoken/ ERROR: ' + error);
      });
    }  
  }
  render() {
    return (
      <div className="App">
        <ReactMap 
          nodeAppRoot={nodeAppRoot}
          sessionParameters={this.state.sessionParameters}
          sandboxRoot = {sandboxRoot}
        />
      </div>
    );
  }
}

export default App;