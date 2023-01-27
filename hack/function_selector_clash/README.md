Drain all ETH from FunctionSelectorClash contract below.

Based on the fact that the require in execute prevent from calling transfer. But we can send a similar function selector, just to pass this require, and actually call the transfer function, sending all the tokens to the sender.