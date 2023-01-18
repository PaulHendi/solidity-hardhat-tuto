Ether can be sent from a contract to another address in 3 ways, transfer, send and call.

How are transfer, send and call different?
transfer (forwards 2300 gas, throws error on failure)
send (forwards 2300 gas, returns bool)
call (forwards specified gas or defaults to all, returns bool and outputs in bytes)
Which function should you use?
call is the recommended method to use for security reasons.