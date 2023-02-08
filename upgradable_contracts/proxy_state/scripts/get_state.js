const {ethers} = require("hardhat");


async function main() {

    
    const pancakeswap_lottery_proxy_address = "0x3C3f2049cc17C136a604bE23cF7E42745edf3b91";
    const pancakeswap_lottery_address = "0x1698E1C459c64bcf8f44D9116260080d15d79E09";
    const provider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org/");
    

    console.log("Storage of the proxy contract: ");
    for (let i = 0; i < 15; i++) {
        const storage_at_i = await provider.getStorageAt(pancakeswap_lottery_proxy_address, i);
        console.log("storage_at_" + i + ": ", storage_at_i);
    }

    console.log("Storage of the implementation contract: ");
    for (let i = 0; i < 15; i++) {
        const storage_at_i = await provider.getStorageAt(pancakeswap_lottery_address, i);
        console.log("storage_at_" + i + ": ", storage_at_i);
    }


}

main().then(() => process.exit(0)).catch(error => {
  console.error(error);
  process.exit(1);
});