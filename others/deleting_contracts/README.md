Contracts can be deleted forever from the blockchain with the function selfdestruct.

selfdestruct takes in a single argument, a payable address to forcefully send all of Ether store in the contract.

For example

selfdestruct(payable(msg.sender))
Casts msg.sender to a payable address
Sends all of Ether held by the contract to msg.sender
Deletes the contract from the blockchain.
