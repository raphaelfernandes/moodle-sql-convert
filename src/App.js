import React from 'react';
import './App.css';
import AceEditor from 'react-ace';
import brace from 'brace';
import Switch from "react-switch";

import 'brace/mode/mysql';
import 'brace/theme/xcode';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prefix: 'mdl_',
      convertSqlPrefix: true,
      editorLeft: `SELECT 
  *
FROM
  mdl_user`,
      editorRight: '',
      labelSwitch: ''
    };

    this.handlePrefixChange = this.handlePrefixChange.bind(this);
    this.handleSwitchChange = this.handleSwitchChange.bind(this);
    this.editorLeftChange   = this.editorLeftChange.bind(this);
    this.editorRightChange  = this.editorRightChange.bind(this);
    this.convertSql         = this.convertSql.bind(this);
  }

  componentDidMount(){
    this.convertSql();
  }

  handlePrefixChange(event) {
    this.setState({prefix: event.target.value},()=>{
      this.convertSql();
    });
  }

  handleSwitchChange(convertSqlPrefix) {
    this.setState({ 
      convertSqlPrefix
    },()=>{
      this.convertSql();
    });
  }
  
  editorLeftChange(editorLeft) {
    this.setState({ editorLeft },()=>{
      this.convertSql();
    });
  }
  
  editorRightChange(editorRight) {
    this.setState({ editorRight });
  }

  convertSql(){
    var regex = null,
    subst = null,
    result = null;
    if(!this.state.convertSqlPrefix){
       regex = /{(.\S{1,}[a-zA-Z]*\S)}/gm;
      subst = this.state.prefix+`$1`;
      result = this.state.editorLeft.replace(regex, subst);
      this.setState({editorRight:result});
    }else{  
      regex = new RegExp(this.state.prefix+'(.*?\\w+)','gm');
      subst = `{$1}`;
      result = this.state.editorLeft.replace(regex, subst);
      this.setState({editorRight:result});
    }

    if(this.state.convertSqlPrefix){
      this.setState({labelSwitch:'Normalizar Consulta'});
    }else{
      this.setState({labelSwitch:'Adicionar Prefix'});
    }
  }

  render() {
    return (
      <div className="App">
        <header>
          <h1>Moodle SQL Convert</h1>
        </header>
        <div className='content buttons-convert'>
            <div className='col-item'>
              <label>Prefix
                <input 
                  type='text' 
                    value={this.state.prefix} 
                    className='inp-prefix'
                    onChange={this.handlePrefixChange}/>
              </label>
            </div>
            <div className='col-item'>
              <Switch onChange={this.handleSwitchChange} checked={this.state.convertSqlPrefix} />
              <span className='label-switch'>{this.state.labelSwitch}</span>
            </div>
        </div>
        <div className='content'>
          <div className='col-item editor-left'>
            <AceEditor
                mode="mysql"
                theme="xcode"
                fontSize={16}
                name="editor-left"
                onChange={this.editorLeftChange}
                value={this.state.editorLeft}
                editorProps={{ $blockScrolling: true }}
                height='400px'
              />
          </div>
          <div className='col-item editor-right'>
            <AceEditor
                mode="mysql"
                theme="xcode"
                fontSize={16}
                name="editor-right"
                value={this.state.editorRight}
                editorProps={{ $blockScrolling: true }}
                height='400px'
              />
          </div>
        </div>
        <footer>
          <div className='content'>
            <div className='col-item'>
              <a href='https://github.com/raphaelfernandes/moodle-sql-convert' target='_blank' className='g-msc'>GitHub Moodle SQL Convert</a>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default App;
