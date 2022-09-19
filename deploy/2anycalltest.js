// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const {network} =require("hardhat")
const {verify}=require("../utils/verify")


module.exports = async ({getNamedAccounts,deployments})=>{
  const {deploy,log}=deployments
  const {testnetdeployer}=await getNamedAccounts()
  const chainid=network.config.chainId
  log(`youre workign with network ${chainid}`)
  // (string memory _name, string memory _symbol, uint8 _decimals, address _underlying, address _vault) {
  const anycalladdressobj={
    4:'0x273a4fFcEb31B8473D51051Ad2a2EdbB7Ac8Ce02',
    4002:'0xD7c295E399CA928A3a14b01D760E794f1AdF8990'
  }
  let anycalladdress
  if (!anycalladdressobj[chainid]){
    anycalladdress='0xD7c295E399CA928A3a14b01D760E794f1AdF8990'
  }
  else{
    anycalladdress=anycalladdressobj[chainid]
  }
  
  const args=[anycalladdress]
  const anycalltest=await deploy("Anycalltestboth",{
    from:testnetdeployer,
    args:args,
    log:true,
    waitConfirmations:network.config.blockConfirmations||1,

  })
  log("deployed anycalltest")
  if (chainid!=31337){
    await verify(anycalltest.address,args)
  }

}


