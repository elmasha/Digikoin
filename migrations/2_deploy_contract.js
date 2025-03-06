const DigiKoin = artifacts.require("./DigiKoin");

module.exports = function (deployer) {
    deployer.deploy(DigiKoin);
};