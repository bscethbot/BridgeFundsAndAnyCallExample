module.exports = async function formatExplorerLink(txhash,chainid){
    const chainidToExplorer={
        '80001':'https://mumbai.polygonscan.com/tx/',
        '97':'https://testnet.bscscan.com/tx/'
    }

    const url=`${chainidToExplorer[chainid]}${txhash}`
    console.log(url)
    return url
}