import React, {Component} from 'react';
import './App.css';
import {DropzoneArea} from "material-ui-dropzone";

class App extends Component {
  handleChange(files) {
    this.setState({
      files: files
    });
  }

  render() {
    return (
      <div className="App">
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"/>
        <DropzoneArea
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}

export default App;
