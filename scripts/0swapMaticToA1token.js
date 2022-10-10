
const hre = require("hardhat");
const ethers=hre.ethers

const chainidtonetwork =require ("../config/chainidToNetwork")
const contractaddresses =require ("../config/contractaddresses")
const formatExplorerLink=require('../utils/explorerformat')
var abi = require('../abis/SushirouterAbi')
// module.exports = 
async function swapMaticToA1token() {
  const {testnetdeployer}=await hre.getNamedAccounts()
  const chainid=network.config.chainId
  if (chainid!=80001){
    console.log('Incorrect Network. This script is designed to swap some test matic to some test a1 token on Mumbai')
    return 0
  }
  
  // console.log(chainid)
  const sushiRouter='0x1b02dA8Cb0d097eB8D57A175b88c7D8b47997506'



    // console.log("the routerV7 address is "+routerv7address)
    
    const sushiRouterContract = await ethers.getContractAt(abi, sushiRouter)
    // console.log(sushiRouterContract.interface)
    const matictoA1path=[ "0x5b67676a984807a212b1c59ebfc9b3568a474f0a","0x8CD309e14575203535EF120b5b0Ab4DDeD0C2073" ]
    
    //Get 5 test tokens, its decimal 6
    const neededMatic=await sushiRouterContract.getAmountsIn('5000000',matictoA1path)
    // console.log(neededMatic)
    const swaptx=await sushiRouterContract.swapExactETHForTokens('0',matictoA1path,testnetdeployer,'166311560900000', { value: neededMatic[0]})
    console.log('swap tx transaction sent')
    console.log(swaptx.hash)
    await swaptx.wait(2)
    const sourcetx=swaptx.hash
    formatExplorerLink(sourcetx,chainid)
    
    // console.log(swapoutID)
    // console.log(success)


    
}

swapMaticToA1token().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});


