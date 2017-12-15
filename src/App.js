import React, { Component } from 'react'
import BillboardContract from '../build/contracts/Billboard.json'
import getWeb3 from './utils/getWeb3'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  
	contract = require('truffle-contract')
	billboard = this.contract(BillboardContract)
	
	constructor(props) {
    super(props)
    
	  this.state = {
      chars : []
		}
    this.setCurrent = this.setCurrent.bind(this)	
	
	  this.handleCellChChange = this.handleCellChChange.bind(this)
	  this.handleCellColorChange = this.handleCellColorChange.bind(this)
          this.handleBuyChange = this.handleBuyChange.bind(this)
this.handleSetChange = this.handleSetChange.bind(this)
	}

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.billboard.setProvider(this.state.web3.currentProvider)
			this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    // Declaring this for later so we can chain functions on Billbaord.
    var billboardInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      this.billboard.deployed().then((instance) => {
        billboardInstance = instance
        return billboardInstance.getCells.call()
			}).then((result) => {
			  return this.setState({ chars: result })
			})
		})
	}

  changeCell(index, newSetting) {
    var billboardInstance
    this.state.web3.eth.getAccounts((error, accounts) => {
		  this.billboard.deployed().then((instance) => {
	      billboardInstance = instance;
			  return billboardInstance.change(index, newSetting, {from: accounts[0]})
		  }).then((result) => { alert(result);
		       var newchars = this.state.chars;
				   newchars[index] = newSetting;
			     this.setState({chars : newchars});
			   })
		})
	}

setPrice(index, newSetting) {
    var billboardInstance
    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
        this.billboard.deployed().then((instance) => {
            billboardInstance = instance;
            console.log(billboardInstance);
            return billboardInstance.setPrice(index, newSetting, {from: accounts[0]})
        }).then((result) => {alert(result)})
    })
}


withdraw(){
    var billboardInstance
    this.state.web3.eth.getAccounts((error,accounts) => {
        this.billboard.deployed().then((instance) => {
            billboardInstance = instance;
            return billboardInstance.withdraw( {"from" : accounts[0]})
        }).then((result) => {alert(result) })
    })
}


showCell(index) {
    var billboardInstance
    this.state.web3.eth.getAccounts((error, accounts) => {
        this.billboard.deployed().then((instance) => {
            billboardInstance = instance;
            return billboardInstance.cells.call(index)
        }).then(result => {alert(result);
            this.setState({selectedprice: result[0].toString(), selectedowner: result[1]})
        })
    })
}

purchase(index, amount) {
    var billboardInstance
    // get accounts
    this.state.web3.eth.getAccounts((error, accounts) => {
        this. billboard.deployed().then((instance) => {
            billboardInstance = instance;
            return billboardInstance.purchase.sendTransaction(index,
                {"from":accounts[0],
                 "value": amount })
        })
    })
}






  boardIndices(){
	  var a = [...Array(3200).keys()];
		var b = [];
		for (var i = 0; i < 3200; i +=80) {
		  b.push(a.slice(i, i+80))
		}
		return b
	}

  pad6(s) {
    while (s.length < 6) {
			s = '0' + s
		}
		return s
	}


  setCurrent(index) {
	  this.setState({current : index})
		var c = this.state.chars[index]
		console.log(c.toString(16))
		console.log((c >>> 24).toString(16))
		this.setState({cellch : (c >>> 24)})
		this.setState({cellcolor : this.pad6((c & 0xFFFFFF).toString(16))})
	}
	
  handleCellChChange(e) {
    this.setState({cellch : e.target.value})
		console.log((this.state.cellch <<24).toString(16));
	}
  handleCellColorChange(e) {
    this.setState({cellcolor : e.target.value})
	}

handleBuyChange(e) {
  this.setState({buyamt: e.target.value})
}

handleSetChange(e) {
  this.setState({setamt: e.target.value})
}

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">Billboard</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
						   <div className="topBar">Current Cell = {this.state.current}</div>
               <div className="action-bar">
                 <div className="action">
                   <form id="change">
                     Character:
										 <input type="text" name="chr" 
										   value={this.state.cellch}
											 onChange={this.handleCellChChange}/>
										 <input type="range" name="chrs" value={this.state.cellch}
										   onChange={this.handleCellChChange} min="0" max="255"/>
                     Color: 
										 <input type="text" name="clr" value={this.state.cellcolor}
										   onChange={this.handleCellColorChange}/>
									 </form>
									 <div style = {{color : '#' + this.state.cellcolor}}> 
									   {String.fromCharCode(this.state.cellch)}
									 </div>
							     <button onClick={() =>
										 this.changeCell(
                       this.state.current,
											 ((this.state.cellch << 24)>>>0) + parseInt(this.state.cellcolor, 16))}
									   > Change Cell </button>
								 </div>
           <div className="action">
            <form id="buy">
              Amount in Wei:
              <input type="text" name="val"
               value={this.state.buyamt} onChange={this.handleBuyChange}/>
            </form>

            <button onClick={() => this.purchase(this.state.current,
                                                this.state.buyamt)}>
              buy cell
            </button>
            </div>

            <div className="action">
            <form id="setPrice">
              Amount in Wei:
              <input type="text" name="val" value={this.state.setamt}
               onChange={this.handleSetChange}/>
            </form>
            <button onClick={() => this.setPrice(this.state.current,
                                                 this.state.setamt)}>
              set cell price
            </button>
            </div>
            <div className="action">
            <button onClick={() => this.showCell(this.state.current)}>
              Query!
            </button>
            <p> Price in Wei : {this.state.selectedprice}</p>
            <p> Owner : {this.state.selectedowner}</p>
            </div>
            <div className="action">
            <button onClick={() => this.withdraw()}>
              Withdraw!
            </button>
            </div>							 


</div>

							 
							 <div className="board">
								 <Board chars={this.state.chars}
													     indices = {this.boardIndices()}
															 f = {this.setCurrent}/>
							   </div>
						</div>
          </div>
        </main>
      </div>
    );
  }
}

class Tile extends Component {

    render() {
      var style = {
        color: '#' + this.props.color,
      };
      return(
          <button className="tile" style={style}
                  onClick={() => this.props.func(this.props.i)}>
            {this.props.value}
          </button>
        );
    }
}

class Board extends Component {
  padColor(s) {
    var str = '' + s;
    while (str.length < 6) str = '0' + str;
    return str;
  }

  renderTile(i) {
    var c = this.props.chars[i]
    var ch = String.fromCharCode(c >>> 24);
    var co = (c & 0x00AAAAAA).toString(16);
    return (<td><Tile color={this.padColor(co)} value={ch} i={i} func={this.props.f} /></td>);
  }

  renderRow(r) {
    return (<tr>{r.map( i => this.renderTile(i) )}</tr>);
  }

  renderTable() {
    console.log(this.props.f)
    return (<table>{this.props.indices.map( r => this.renderRow(r))}</table>);

  }

  render() {
    return (
        <div>{this.renderTable()}</div>
      );
  }

}

export default App
