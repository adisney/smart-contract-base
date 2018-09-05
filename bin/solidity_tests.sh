#!/usr/bin/env bash
export abspath="$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")"
export bin_dir=`dirname $abspath`
export root_dir=`dirname $bin_dir`

# Executes cleanup function at script exit.
trap cleanup EXIT

cleanup() {
  # Kill the ganache instance that we started (if we started one and if it's still running).
    if ps aux | grep ganache-cli > /dev/null; then
        pkill -f ganache-cli
    fi
}
runTests() {
    cleanup
    ganache-cli --mnemonic "aisle firm gadget observe humble nut sentence next jealous blanket feel print" 2>&1 > ganache.log &

    truffle test
}
runTestsOnce() {
    echo ""
    echo "Running solium linter"
    solium -d contracts
    runTests
}
runTestsContinuous() {
    find ./ -type d -name node_modules -prune -o \( -name *.sol -o -name *.js -o -name *.*.js \) | entr -cdr bash -c "echo \"Running tests...\"; runTests"
}
export -f cleanup
export -f runTests
export -f runTestsOnce
export -f runTestsContinuous

if [ -n "$1" ]; then
    continuous="true"
fi

if [ -n "$continuous" ]; then
    if ! which entr > /dev/null; then
        echo ""
        echo "WARNING: entr not found. Running the tests once then terminating..."
        runTestsOnce
    else
        runTestsContinuous
    fi
else
    runTestsOnce
fi

## Using the mnemonic specified above, the accounts and private keys created are the following
#
#Ganache CLI v6.1.0 (ganache-core: 2.1.0)
#
#Available Accounts
#==================
#(0) 0x032570b27cefcd54da5ea0a019ac2e1e3f9dd2f7
#(1) 0x29ab65a5a049540def1b03441fe2160fbce531dc
#(2) 0x0ea5dc96ea23a1b76ca54d9b5a6545c0691d6c9e
#(3) 0x308382a6a2b14e5353baa5833e21306da3829a81
#(4) 0xa68a1a1d57cdb83cd068c4325ce4807b25980a24
#(5) 0x77b73009e3b669ef4ae161a44ed15e83b2cca661
#(6) 0x33f6e830ed7fa3ce7e1465daa5e05f3d81a5df84
#(7) 0x56fa6e08fe9b22c041cffa0537c0911eb8dc91e5
#(8) 0xf3bdc8fb62a5ea5c3a023b0684b8c1e3f2a0f814
#(9) 0x9ad89bdc5b1b8715ee2311a0f396a09200a9d916
#
#Private Keys
#==================
#(0) b6d89773f6d22c91404f3c8030a459c1bd416249d7c5155593ed1d897565acd0
#(1) dcb7ac9d47a432136ce31ca98501f95d42c4e84039be53ccd8df6eee6ceb31e1
#(2) bd5d36f09d67180e51dc906ac29d2b0aad4d291175022dc74fa1084fbf08e8b6
#(3) 1321d2e73343dce84d864110f7fd0926ee8511a8a8fe04f0a6d775c101be68dc
#(4) 743bfcb9730dedb11d9fe2e0b7943d63bd07b8b1bb8ddbcd996abac4f948b3be
#(5) e8823db686e846a78b9a8dfab6352485875fdc69685d36033ab02e0e8a5d4bf5
#(6) ae013f1814cae31ec178e428cefb000dac80d435ff90f8de395f552d338b770c
#(7) 8b2f2e79a10eff346129226913035e2f46fd43f59dd8370f417c7df3cf6b3a9e
#(8) 3a76e9da058623e33d830ff91ba866b1f6b06b6edf31fe4eb1781eb511b8fea8
#(9) 8c4d7a7920b1b6bd81cd2e947546be808852702ff835de41986f6e0a82ae14a9
#
#HD Wallet
#==================
#Mnemonic:      aisle firm gadget observe humble nut sentence next jealous blanket feel print
#Base HD Path:  m/44'/60'/0'/0/{account_index}
