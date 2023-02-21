const {ethers} = require("hardhat");
const Moralis = require('moralis').default;

// Note : this is only workin on Fantom Opera Chain (not on Fantom Mainnet)
// The only workaround is using covalent 
async function main() {


    try {
        const address = '0x29Fd00FA40c90aec39AC604D875907874f237baA';

        const chain = 0xfa;

        
        await Moralis.start({
            apiKey: process.env.MORALIS_API_KEY,
            // ...and any other configuration
        });

        const response = await Moralis.EvmApi.nft.getWalletNFTs({
            address,
            chain,
        });

        for (i = 0;i<response?.result.length;i++){
            console.log(response?.result[i]._data.metadata.image);
        }

    } catch (e) {
        console.error(e);
    }

}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
    });