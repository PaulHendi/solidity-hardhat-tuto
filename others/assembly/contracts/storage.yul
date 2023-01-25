object "StorageFullAssembly" {
    code {  // Executed once, at deployed time
        let runtime_size := datasize("runtime")
        let runtime_offset := dataoffset("runtime")
        datacopy(0, runtime_offset, runtime_size)
        return(0, runtime_size)
    }

    object "runtime" {
        code {

            switch selector()

            // retrieve function match (Used remix for that)
            case 0x2e64cec1 {
                let memloc := retrieve()
                return(memloc, 32)
            }

            // store function match (again with Remix)
            case 0x6057361d {
                store(calldataload(4))
            }

            // Revert if no match
            default{
                revert(0,0)
            }

            function retrieve() -> memloc {
                let val:= sload(0)
                memloc := 0x80
                mstore(memloc, val)
            }

            function store(val) {
                sstore(0, val)
                mstore(0x80, val)
                log1(0x80, 0x20, 0x8d556f7fd25e040bfe6111f5ae22037d01373103d9c1c3d505b7e3ce83460b09)
            }

            // Selector will dispatch function call to the good function depending on the selector
            function selector() -> s {
                // Just keep the first four bytes by dividing by 28 bytes 100.. 
                s := div(calldataload(0), 0x100000000000000000000000000000000000000000000000000000000)
            }
        }
    }
}