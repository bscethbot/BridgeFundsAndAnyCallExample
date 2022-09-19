
const hre = require("hardhat");
const ethers=hre.ethers

const chainidtonetwork =require ("../config/chainidToNetwork")
const contractaddresses =require ("../config/contractaddresses")
const formatExplorerLink=require('../utils/explorerformat')

var abi = require('../abis/routerV7abi')

module.exports = async function (chainid, sourecehash) {


  
  console.log(chainid)

  const networkname=chainidtonetwork[chainid]
  const rpc=hre.config['networks'][networkname]['url']
  const provider = new ethers.providers.StaticJsonRpcProvider(
    rpc)

    const routerv7address=contractaddresses['routerv7'][chainid]


    // console.log("the routerV7 address is "+routerv7address)
    let executed=0
    const routerV7contract = new ethers.Contract(routerv7address, abi, provider);
    routerV7contract.on("LogAnySwapInAndExec", (swapID,swapoutID,token,receiver,amount,fromChainID,success,result,event) => {
    if (swapID.includes(sourecehash)){
      console.log('Your destination tx is executed')

      formatExplorerLink(event.transactionHash,chainid)
      executed=1
    }
    // console.log(swapoutID)
    // console.log(success)


    
}); 

  function sleep(millis) {
  return new Promise((resolve) => setTimeout(resolve, millis))
}
    while (executed==0){
      console.log('polling for destination chain swap tx...')
      await sleep(2000)
    }
    
      return
    
    

  
}

