const {ethers} = require("hardhat");
const {expect} = require("chai");


describe("Signature replay attack", async () =>  {

    let signature_replay, signature_replay_attack;
    let signature_replay_deployed, signature_replay_attack_deployed;

    it("Should deploy the contract", async () => {
        signature_replay = await ethers.getContractFactory("SignatureReplay");
        signature_replay_deployed = await signature_replay.deploy();

        signature_replay_attack = await ethers.getContractFactory("SignatureReplayExploit");
        signature_replay_attack_deployed = await signature_replay_attack.deploy(signature_replay_deployed.address);

        const [owner] = await ethers.getSigners();
        const message = await owner.signTransaction({value: ethers.utils.parseEther("1"),
                                                     to: signature_replay_deployed.address});
        
        await signature_replay_attack_deployed.pwn(message);
        // Throw an error "signing transactions is unsupported"

    })

})