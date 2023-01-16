Solidity has 3 ways to throw an error, require, revert and assert.

require is used to validate inputs and check conditions before and after execution.
revert is like require but more handy when the condition to check is nested in several if statements.
assert is used to check invariants, code that should never be false. Failing assertion probably means that there is a bug.
An error will undo all changes made during a transaction.