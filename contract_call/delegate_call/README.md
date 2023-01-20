delegatecall is like call, except the code of callee is executed inside the caller.

For example contract A calls delegatecall on contract B. Code inside B is executed using A's context such as storage, msg.sender and msg.value.


