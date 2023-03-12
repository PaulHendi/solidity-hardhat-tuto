const {ethers} = require("hardhat");
const axios = require('axios'); 

// Note : this is only workin on Fantom Opera Chain (not on Fantom Mainnet)
// The only workaround is using covalent 
// 
async function main() {

    url = 'https://api.covalenthq.com/v1/4002/address/0x29Fd00FA40c90aec39AC604D875907874f237baA/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key='+process.env.COVALENT_API_KEY;
    response = await axios.get(url)
    items = response.data.data.items;
    for (i = 0;i<items.length;i++){
        if (items[i].type == "nft"){

            for (j=0; j<items[i].nft_data.length;j++) {

                if (items[i].nft_data[0].supports_erc[1] == "erc721") 
                    console.log(items[i].nft_data[0]);
            }
        }
    }


}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
    });