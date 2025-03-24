const FileStorage = artifacts.require("FileStorage");

module.exports = function (deployer) {
    deployer.deploy(FileStorage);
};


// const Test = artifacts.require("Test");

// module.exports = function (deployer) {
//     deployer.deploy(Test);
// }; 