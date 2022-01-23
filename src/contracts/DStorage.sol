pragma solidity >=0.4.21 <0.6.0;


contract DStorage {
  string public name = 'DStorage';
  uint public fileCount = 0;
  uint public keyCount = 0;
  mapping(uint => File) public files;
  mapping(uint => PublicKey) public p_keys;

  struct File {
    uint fileId;
    string fileHash;
    uint fileSize;
    string fileType;
    string fileName;
    string fileDescription;
    uint uploadTime;
    address payable uploader;
  }

  struct PublicKey{
    uint key_id;
    string u_id;
    string p_key;
  } 

  event FileUploaded(
    uint fileId,
    string fileHash,
    uint fileSize,
    string fileType,
    string fileName, 
    string fileDescription,
    uint uploadTime,
    address payable uploader
  );

  event PublicKeyUpload(
    uint key_id,
    string u_id,
    string p_key
  );

  constructor() public {
  }

  function uploadFile(string memory _fileHash, uint _fileSize, string memory _fileType, string memory _fileName, string memory _fileDescription) public {
    // Make sure the file hash exists
    require(bytes(_fileHash).length > 0);
    // Make sure file type exists
    require(bytes(_fileType).length > 0);
    // Make sure file description exists
    require(bytes(_fileDescription).length > 0);
    // Make sure file fileName exists
    require(bytes(_fileName).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));
    // Make sure file size is more than 0
    require(_fileSize>0);

    // Increment file id
    fileCount ++;

    // Add File to the contract
    files[fileCount] = File(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
    // Trigger an event
    emit FileUploaded(fileCount, _fileHash, _fileSize, _fileType, _fileName, _fileDescription, now, msg.sender);
  }

  function publickeyupload(string memory u_id, string memory p_key) public{

    keyCount++;
    p_keys[keyCount] = PublicKey(keyCount, u_id, p_key);

    emit PublicKeyUpload(keyCount, u_id, p_key);

  }

}