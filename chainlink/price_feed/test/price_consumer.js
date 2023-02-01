const {ethers} = require("hardhat");

    const price_feed_pairs = {"ftm_usd" : "0xe04676B9A9A2973BCb0D1478b5E1E9098BBB7f3D",
                                "btc_usd" : "0x65E8d79f3e8e36fE48eC31A2ae935e92F5bBF529",
                                "eth_usd" : "0xB8C458C957a6e6ca7Cc53eD95bEA548c52AFaA24",
                                "link_usd" : "0x6d5689Ad4C1806D1BA0c70Ab95ebe0Da6B204fC5"};
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

describe("PriceConsumer", function () {
    it("Should return the latest price", async function () {
        const PriceConsumer = await ethers.getContractFactory("PriceConsumerV3");
        const priceConsumer = await PriceConsumer.deploy();
    
        for (const [key, value] of Object.entries(price_feed_pairs)) {

            await priceConsumer.setPriceFeed(value);
            await priceConsumer.priceFeed();
            // wait for the price feed to be set (even though the tx went through)
            sleep(5000);
            
            const price = await priceConsumer.getLatestPrice();
            const decimals = await priceConsumer.getDecimals();
            console.log(key + ": ",ethers.utils.formatUnits(price,decimals));

        }


    });
});