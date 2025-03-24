// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract FileStorage {
    struct File {
        string fileHash;
        uint256 timestamp;
        string userId;
    }

    File[] public files;

    event FileAdded(uint256 indexed fileId, string fileHash, uint256 timestamp, string userId);

    function addFile(string memory _fileHash, string memory _userId) public {
        uint256 timestamp = block.timestamp;
        files.push(File(_fileHash, timestamp, _userId));
        emit FileAdded(files.length - 1, _fileHash, timestamp, _userId);
    }

    function getFile(uint256 _fileId) public view returns (string memory, uint256, string memory) {
        require(_fileId < files.length, "File does not exist.");
        File memory file = files[_fileId];
        return (file.fileHash, file.timestamp, file.userId);
    }

    function getFileCount() public view returns (uint256) {
        return files.length;
    }
}