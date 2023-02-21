const {ethers} = require("hardhat");
const axios = require('axios'); 

// Note : this is only workin on Fantom Opera Chain (not on Fantom Mainnet)
// The only workaround is using covalent 
// 
async function main() {


    response = await axios.get('https://api.covalenthq.com/v1/4002/address/0x29Fd00FA40c90aec39AC604D875907874f237baA/balances_v2/?quote-currency=USD&format=JSON&nft=true&no-nft-fetch=false&key='+process.env.COVALENT_API_KEY)
    items = response.data.data.items;
    for (i = 0;i<items.length;i++){
        if (items[i].type == "nft"){
            console.log(items[i].nft_data);
        }
    }


}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
    });