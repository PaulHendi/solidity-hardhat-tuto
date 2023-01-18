fallback is a function that is called when a function to call does not exist.

For example, call doesNotExist(), this will trigger the fallback function.

Receive Ether
fallback function declared as external payable is commonly used to enable the contract to receive Ether.

There is a slight variation of the fallback called receive.

receive() external payable is called if msg.data is empty.

Which is called, fallback or receive?
Here is a graph summarizing which function is called

/*
Which function is called, fallback() or receive()?

    Ether is sent to contract
               |
        is msg.data empty?
              / \\
            yes  no
            /     \\
receive() exists?  fallback()
         /   \\
        yes   no
        /      \\
    receive()   fallback()
*/