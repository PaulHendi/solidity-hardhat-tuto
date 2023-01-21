// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract E {
    // This event will be used to trace function calls.
    event Log(string message);

    function foo() public virtual returns(string memory){
        emit Log("E.foo");
        return "E.foo";
    }

    function bar() public virtual returns(string memory){
        emit Log("E.bar");
        return "E.bar";
    }
}

contract F is E {
    function foo() public virtual override returns(string memory){
        emit Log("F.foo");
        return E.foo();
    }

    function bar() public virtual override returns(string memory){
        emit Log("F.bar");
        return super.bar();
    }
}

contract G is E {
    function foo() public virtual override returns(string memory){
        emit Log("G.foo");
        return E.foo();
    }

    function bar() public virtual override returns(string memory){
        emit Log("G.bar");
        return super.bar();
    }
}

contract H is F, G {
    function foo() public override(F, G) returns(string memory){
        // Calls G.foo() and then E.foo()
        // Inside F and G, E.foo() is called. Solidity is smart enough
        // to not call E.foo() twice. Hence E.foo() is only called by G.foo().
        return super.foo();
    }

    function bar() public override(F, G) returns(string memory){
        // Write your code here
        return super.bar();
    }
}
