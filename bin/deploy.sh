#! /usr/bin/env bash

abspath="$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")"
bin_dir=`dirname $abspath`
root_dir=`dirname $bin_dir`

error() {
    echo ""
    echo "Error during deployment: $1"
    echo "Not deploying."
    echo ""
    exit 1
}

deploy() {
    echo "truffle migrate --network $NETWORK" > ./contract_deployment.log
    truffle migrate $RESET --network $NETWORK | tee -a ./contract_deployment.log
}

RESET=""
if [[ -z $1 && $1 == "--reset" ]]; then
    RESET="--reset"
fi

if [ -z "$WALLET_MNEMONIC" ]; then
    error "Must set \$WALLET_MNEMONIC to mnemonic phrase containing Ether to be used in deployment"
fi

if [ -z "$INFURA_TOKEN" ]; then
    error "Must set \$INFURA_TOKEN with your infura access token."
fi

echo ""
echo "Preparing to deploy smart contracts..."
echo ""

PS3='What network would you like to deploy to: '
options=("Ropsten" "Rinkeby" "Kovan" "Mainnet")
NETWORK=""
select opt in "${options[@]}"
do
    case $opt in
        "Ropsten")
            echo "You chose Ropsten."
            NETWORK=ropsten
            break
            ;;
        "Rinkeby")
            echo "You chose Rinkeby."
            NETWORK=rinkeby
            break
            ;;
        "Kovan")
            echo "You chose Kovan."
            NETWORK=kovan
            break
            ;;
        "Mainnet")
            echo "You chose Mainnet."
            NETWORK=mainnet
            break
            ;;
        *) echo "invalid option $REPLY";;
    esac
done

echo "Writing truffle output to contract_deployment.log"
deploy
echo -e "\nContract deployment complete.\n\n"\
        "Deployment addresses\n"\
        "====================\n" | tee -a ./contract_deployment.log

wrap_up=""
for contract in `grep "[a-z] '.*'" contract_deployment.log | grep -v 'Migrations' | grep -o "'.*'"`; do
    address_string=`grep -A 4 "$contract" contract_deployment.log | grep 'contract address' | cut -d ' ' -f 5-`
    wrap_up="$wrap_up\n> Deployed $contract to $address_string"
done
echo -e $wrap_up | tee -a ./contract_deployment.log
