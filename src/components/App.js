// App.js

import DStorage from '../abis/DStorage.json'
import React, { Component } from 'react';
import Navbar from './Navbar'
import Main from './Main'
import Web3 from 'web3';
import './App.css';
import Particles from "react-tsparticles";
import particlesOptions from "./particles.json";

//Declare IPFS
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: 5001, protocol: 'https' }) // leaving out the arguments will default to these values
const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});
var fs = require('fs').promises;;
var crypto = require('crypto');

const pub_key = "-----BEGIN PUBLIC KEY-----\n"+
"MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHYsRzYeMkt2gv9T92ffu3VVEBDJ\n"+
"NSEOXSKJ3NqJNVaKlaox5Amhpv8RcPYuJlTex8v3eGS/F5lxg1TeW5j+0qD2iq2v\n"+
"jEqAQumZqLGPG4jWjCeYWrNzFdilcjqn+jvO8Pbl+RbxTG5M3HG64CLTZi5Ip0Eh\n"+
"GbOifuMF2sTgtXNvAgMBAAE=\n"+
"-----END PUBLIC KEY-----";

const priv_key = "-----BEGIN RSA PRIVATE KEY-----\n"+
"MIICXAIBAAKBgHYsRzYeMkt2gv9T92ffu3VVEBDJNSEOXSKJ3NqJNVaKlaox5Amh\n"+
"pv8RcPYuJlTex8v3eGS/F5lxg1TeW5j+0qD2iq2vjEqAQumZqLGPG4jWjCeYWrNz\n"+
"Fdilcjqn+jvO8Pbl+RbxTG5M3HG64CLTZi5Ip0EhGbOifuMF2sTgtXNvAgMBAAEC\n"+
"gYARfgpoe13Mh9VqQB6eNKMGAjpnkbEYnIyywR99BdRsZAU1dT8hIdmbZhSHjFtG\n"+
"Mtf2XEJo/1RZ9VCQbn22jvnUf0o6Ki1Q8TKSJj8V4Q92E0GxjmhoxnIpIAm8yUdQ\n"+
"cE3dYEgPUuYZL5nPnCDTE84TXzZSuW1RaOn7bpNGD13+sQJBANPk5OEpNV7JNdVc\n"+
"sGBMV1OcAS7SnO/ATT9fu+NPBHLi7vll0qHzV4GsVD6yQ+VpdQMc2sVJzJOLiHjL\n"+
"iP/GGhcCQQCOxU6qxoonDmvwzxod283EtKXQ2HbPd9yQ7oFT2mGDUE1gTllelvgV\n"+
"te2rdPUbMATyomOe6xZrq9tQlWfF6UBpAkEAq1FGSFGkB/XQo6gkJkey1zOrtSqt\n"+
"nh4xloqVg4vwgd6+7j+IFE6Fsp8dIe/Je2NPKuwaaSZo0+YdueR96KZHkwJAZGtD\n"+
"ObsL0QzDv0zsAbRotsKZHpwidSrJaOdY77HahJIm2mZBVda6CAs+cCqDe+v6ju7J\n"+
"Qy33RyRJzhRIOVwmgQJBAMV8Jv+gAeiWnLwt8w79WTdMK3Umq8WZKrQGjm9XyKVI\n"+
"zYsMIUNbkQpC4HfoFqLcGhoypFzcxr3yycpU/OQKTF4=\n"+
"-----END RSA PRIVATE KEY-----";


class App extends Component {

  async componentWillMount() {
    
    
    await this.loadWeb3()
    await this.loadBlockchainData()
    console.log("init");
    //this.governmentCheck();
  }

  async loadWeb3() {                      // Web3 to interact with Blockchain and IPFS
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {             // Load the data from blockchain
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    // Network ID
    const networkId = await web3.eth.net.getId()
    const networkData = DStorage.networks[networkId]
    
    if(networkData) {
      // Assign contract
      const dstorage = new web3.eth.Contract(DStorage.abi, networkData.address)
      this.setState({ dstorage })
      // Get files amount
      const filesCount = await dstorage.methods.fileCount().call()
      this.setState({ filesCount })

      const publickeys = await dstorage.methods.p_keys(1).call();

      var _pub = Object.values(publickeys)

      console.log("gunns"+_pub[2]);

      this.setState({publickeys: _pub});

      // Load files&sort by the newest
      for (var i = filesCount; i >= 1; i--) {
        const file = await dstorage.methods.files(i).call()
        this.setState({
          files: [...this.state.files, file]
        })
      }
    } else {
      window.alert('DStorage contract not deployed to detected network.')
    }
  }

  // Get file from user
  captureFile = event => {
    event.preventDefault()

    const file = event.target.files[0]

      // });


    const reader = new window.FileReader()

    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name
      })
      console.log('buffer', this.state.buffer)
      
    }
  }

  parseHexString =(str)  =>{ 
    var result = [];
    while (str.length >= 8) { 
        result.push(parseInt(str.substring(0, 8), 16));

        str = str.substring(8, str.length);
    }

    return result;
}


  //Upload File

  melita =(buff) =>{
    console.log(buff);

  }

  governmentCheck = () =>{
    console.log("Welcome"+" "+this.state.account);
    //Government Body
    if(this.state.account == "0x0EAd5CFDBa597FD86cF14AD90526b32A92e99bc3"){  //govt acc
      console.log("Welcome Modi");

      var public_key = key.exportKey('public');
      var private_key = key.exportKey('private');
      console.log(public_key);
      console.log(private_key);

      this.state.dstorage.methods.publickeyupload(this.state.account, pub_key).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error Modi')
        this.setState({loading: false})
      })



    }
  }



  uploadFile = description => {
    console.log("Submitting file to IPFS...")

    // Add file to the IPFS
    ipfs.add(this.state.buffer, (error, result) => {
      console.log('IPFS result', result)
      if(error) {
        console.error(error)
        return
      }

      this.setState({ loading: true })


      console.log("uploaded"+this.state.publickeys[2]);

      let key_public = new NodeRSA(this.state.publickeys[2]);

      var encrypts = key_public.encrypt(result[0].hash , 'base64');

      console.log("encrypted"+encrypts);

      // let key_private = new NodeRSA(priv_key);

      //     var decrypts = key_private.decrypt(encrypts , 'utf8');
    
      //     console.log("decrypted"+decrypts);

      // Assign value for the file without extension
      if(this.state.type === ''){
        this.setState({type: 'none'})
      }


      this.state.dstorage.methods.uploadFile(encrypts, result[0].size, this.state.type, this.state.name, description).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({
         loading: false,
         type: null,
         name: null
       })
       //window.location.reload()
      }).on('error', (e) =>{
        window.alert('Error')
        this.setState({loading: false})
      })
    })
  }

  //Set states
  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dstorage: null,
      files: [],
      loading: false,
      type: null,
      name: null,
      publickeys:null
    }
    this.uploadFile = this.uploadFile.bind(this)
    this.captureFile = this.captureFile.bind(this)

  }

  render() {
    return (
      <div>
        <Particles options={particlesOptions}/>
        <Navbar account={this.state.account} />
        { this.state.loading
          ? <div id="loader" className="text-center mt-5"><p>Loading...</p></div>
          : <Main
              files={this.state.files}
              captureFile={this.captureFile}
              uploadFile={this.uploadFile}
              account = {this.state.account}
            />
        }
      </div>
    );
  }
}

export default App;