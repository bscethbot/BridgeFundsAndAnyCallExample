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
  const args=['Anyerc','Anyerc','18','0x0000000000000000000000000000000000000000',testnetdeployer]
  
  const anyerc20=await deploy("AnyswapV6ERC20",{
    from:testnetdeployer,
    args:args,
    log:true,
    waitConfirmations:network.config.blockConfirmations||1,

  })
  log("deployed anyerc")
  if (chainid!=31337){
    await verify(anyerc20.address,args)
  }

}


