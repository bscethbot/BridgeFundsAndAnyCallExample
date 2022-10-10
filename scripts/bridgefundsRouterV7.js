const hre = require("hardhat");
const ethers=hre.ethers
const {network} =require("hardhat")
const contractaddresses =require ("../config/contractaddresses")

const chainidtonetwork =require ("../config/chainidToNetwork")
const pollAnyexec=require('./pollAnyexecEthers')
const formatExplorerLink=require('../utils/explorerformat')
// var a1Tokenabi = require('../abis/erc20abi');

async function main() {

    
    const chainid=network.config.chainId
    console.log(chainid)


    let allchainids=Object.keys(chainidtonetwork)

    //select the opposite chain
    const otherchainids = allchainids.filter(item => item !== chainid.toString())
    console.log(otherchainids)
    

    //select polygon mumbai
    const tochainid=otherchainids[0]

    
    const {testnetdeployer}=await hre.getNamedAccounts()
    const networknow= chainidtonetwork[chainid]

    const routerv7address=contractaddresses['routerv7'][chainid]
    const a1TokenAddress=contractaddresses['a1token'][chainid]
    const a1TokenAddressDest=contractaddresses['a1token'][tochainid]

    const destinationExecContract=contractaddresses['execcontract'][tochainid]
    const destinationRouter=contractaddresses['routerv7'][tochainid]
    const a2TokenAddressDest=contractaddresses['a2token'][tochainid]
    // console.log("the routerV7 address is "+routerv7address)



    const routerV7Factory = await ethers.getContractFactory("MultichainV7Router");
    const routerV7contract = await routerV7Factory.attach(
      routerv7address// The deployed contract address
);
    const uintFarAway='16628028124120';
    const swapPathA1toA2onMumbai=[a1TokenAddressDest,a2TokenAddressDest]
    // const oneetherinwei=ethers.utils.parseEther('1')
    const onedecimal6=1000000
//     const data = abiCoder.encode(["tuple(uint256,uint256,uint256,address[],address,uint256,bool)"],
//     [[0, 0, amount, [tokenA, tokenB], receiver, eth.constant.MaxUint256, toNative]]);
// console.log(`encode data:${data}`)

    const dataPassedToDest=ethers.utils.defaultAbiCoder.encode(["tuple(uint256,uint256,uint256,address[],address,uint256,bool)"],
     [[ 0,0,0,swapPathA1toA2onMumbai,
     testnetdeployer,uintFarAway,false]])

    //  console.log(`dataPassedToDest is ${dataPassedToDest}`)

     const callargs=[a1TokenAddress,
      destinationExecContract,

      onedecimal6,
      tochainid,
      destinationExecContract,dataPassedToDest]

      // console.log(callargs)
    const bridgeoutlog=await routerV7contract.anySwapOutAndCall(...callargs)

    console.log('\n \n')
    console.log('source chain transaction sent')
    console.log(bridgeoutlog.hash)
    const sourcetx=bridgeoutlog.hash


    formatExplorerLink(sourcetx,chainid)
    await bridgeoutlog.wait(2)
    console.log('Waiting for destination chain tx to execute...')
    await pollAnyexec(tochainid,bridgeoutlog.hash)
    return


    

  
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });