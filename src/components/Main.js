//Main.js

import React, { Component } from 'react';
import { convertBytes } from './helpers';
import moment from 'moment'
import './Main.css';


const priv_key = "-----BEGIN RSA PRIVATE KEY-----"+
"MIICXAIBAAKBgHYsRzYeMkt2gv9T92ffu3VVEBDJNSEOXSKJ3NqJNVaKlaox5Amh"+
"pv8RcPYuJlTex8v3eGS/F5lxg1TeW5j+0qD2iq2vjEqAQumZqLGPG4jWjCeYWrNz"+
"Fdilcjqn+jvO8Pbl+RbxTG5M3HG64CLTZi5Ip0EhGbOifuMF2sTgtXNvAgMBAAEC"+
"gYARfgpoe13Mh9VqQB6eNKMGAjpnkbEYnIyywR99BdRsZAU1dT8hIdmbZhSHjFtG"+
"Mtf2XEJo/1RZ9VCQbn22jvnUf0o6Ki1Q8TKSJj8V4Q92E0GxjmhoxnIpIAm8yUdQ"+
"cE3dYEgPUuYZL5nPnCDTE84TXzZSuW1RaOn7bpNGD13+sQJBANPk5OEpNV7JNdVc"+
"sGBMV1OcAS7SnO/ATT9fu+NPBHLi7vll0qHzV4GsVD6yQ+VpdQMc2sVJzJOLiHjL"+
"iP/GGhcCQQCOxU6qxoonDmvwzxod283EtKXQ2HbPd9yQ7oFT2mGDUE1gTllelvgV"+
"te2rdPUbMATyomOe6xZrq9tQlWfF6UBpAkEAq1FGSFGkB/XQo6gkJkey1zOrtSqt"+
"nh4xloqVg4vwgd6+7j+IFE6Fsp8dIe/Je2NPKuwaaSZo0+YdueR96KZHkwJAZGtD"+
"ObsL0QzDv0zsAbRotsKZHpwidSrJaOdY77HahJIm2mZBVda6CAs+cCqDe+v6ju7J"+
"Qy33RyRJzhRIOVwmgQJBAMV8Jv+gAeiWnLwt8w79WTdMK3Umq8WZKrQGjm9XyKVI"+
"zYsMIUNbkQpC4HfoFqLcGhoypFzcxr3yycpU/OQKTF4="+
"-----END RSA PRIVATE KEY-----";

const NodeRSA = require('node-rsa');
const key = new NodeRSA({b: 1024});

class Main extends Component {

  
  
  render() {
    var files = [];
  var count = 0;
  this.props.files.map((file, key) => {
      if(this.props.account == "0x0EAd5CFDBa597FD86cF14AD90526b32A92e99bc3"){  //govt acc
        //console.log(this.props.account);

        try{
          let key_private = new NodeRSA(priv_key);

          var decrypts = key_private.decrypt(file.fileHash , 'utf8');
    
          console.log(decrypts);
    
            files[count] = {fileId: count+1, fileName: file.fileName, fileDescription: file.fileDescription, fileType : file.fileType, fileSize: file.fileSize, uploadTime: file.uploadTime, uploader: file.uploader, fileHash : decrypts};
            count++;
        }
        catch(err){
          console.log(file.fileHash+" "+err);
        }
      } 
      else if(this.props.account == file.uploader){
        files[count] = {fileId: count+1, fileName: file.fileName, fileDescription: file.fileDescription, fileType : file.fileType, fileSize: file.fileSize, uploadTime: file.uploadTime, uploader: file.uploader, fileHash : file.fileHash};
        count++;
      } 
       
  })
  return (                                                 // form to accept the pdf file
    <div className="container-fluid mt-5 text-center" >
      <div className="row">
        <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '1024px'}}>
          <div className="content" >
            <p>&nbsp;</p>
            <div className="card mb-3 mx-auto bg-transparent " style={{ maxWidth: '512px'}}>
              <h2 className="text-white text-monospace bg-dark" ><b><ins>Share File</ins></b></h2>
                <form onSubmit={(event) => {
                  event.preventDefault()
                  const description = this.fileDescription.value
                  this.props.uploadFile(description)
                }} >
                    <div className="form-group">
                      <br></br>
                        <input
                          id="fileDescription"
                          type="text"
                          ref={(input) => { this.fileDescription = input }}
                          className="form-control text-monospace"
                          placeholder="description..."
                          required />
                    </div>
                  <div>
                  <input type="file" onChange={this.props.captureFile} className="input"/>
                  </div>  
                  <button type="submit" className="upload_btn"><b>Upload!</b></button>
                </form>
            </div>
            <p>&nbsp;</p>
            <table className="table-sm table-bordered text-monospace" style={{ width: '1000px', maxHeight: '450px'}}>
              <thead style={{ 'fontSize': '15px' }}>
                <tr className="bg-dark text-white">
                  <th scope="col" style={{ width: '10px'}}>id</th>
                  <th scope="col" style={{ width: '200px'}}>name</th>
                  <th scope="col" style={{ width: '230px'}}>description</th>
                  <th scope="col" style={{ width: '120px'}}>type</th>
                  <th scope="col" style={{ width: '90px'}}>size</th>
                  <th scope="col" style={{ width: '90px'}}>date</th>
                  <th scope="col" style={{ width: '120px'}}>uploader/view</th>
                  <th scope="col" style={{ width: '120px'}}>hash/view/get</th>
                </tr>
              </thead>
              { files.map((file, key) => {
                return(
                  <thead style={{ 'fontSize': '12px', 'color':'#FFFFFF' }} key={key}>
                    <tr>
                      <td>{file.fileId}</td>
                      <td>{file.fileName}</td>
                      <td>{file.fileDescription}</td>
                      <td>{file.fileType}</td>
                      <td>{convertBytes(file.fileSize)}</td>
                      <td>{moment.unix(file.uploadTime).format('h:mm:ss A M/D/Y')}</td>
                      <td>
                        <a
                          href={"https://etherscan.io/address/" + file.uploader}
                          rel="noopener noreferrer"
                          target="_blank">
                          {file.uploader.substring(0,10)}...
                        </a>
                       </td>
                      <td>
                        <a
                          href={"https://ipfs.infura.io/ipfs/" + file.fileHash}
                          rel="noopener noreferrer"
                          target="_blank">
                          {file.fileHash.substring(0,10)}...
                        </a>
                      </td>
                    </tr>
                  </thead>
                )
              })}
            </table>
          </div>
        </main>
      </div>
    </div>
  );
  }
}

export default Main;