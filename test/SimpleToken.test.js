import assertRevert from './helpers/assertRevert';
import decodeLogs from 'openzeppelin-solidity/test/helpers/decodeLogs';

const SimpleToken = artifacts.require('SimpleToken');
let token;
let creator;
let INITIAL_SUPPLY;

contract('SimpleToken', (accounts) => {
    beforeEach(async () => {
        creator = accounts[0];
        token = await SimpleToken.new({ from: creator });
        INITIAL_SUPPLY = (await token.INITIAL_SUPPLY.call());
    });

    describe("creation", async () => {
        it('sets an initial balance of token.INITIAL_SUPPLY for the creator', async () => {
            const balance = await token.balanceOf.call(creator);
            assert.strictEqual(balance.toString(), INITIAL_SUPPLY.toString());
        });

        it('sets name', async () => {
            const name = await token.name.call();
            assert.strictEqual(name, 'SimpleToken');
        });

        it('sets decimals', async () => {
            const decimals = await token.decimals.call();
            assert.strictEqual(parseInt(decimals), 18);
        });

        it('sets symbol', async () => {
            const symbol = await token.symbol.call();
            assert.strictEqual(symbol, 'SIM');
        });
    });

    describe("transfers", async () => {
        // normal transfers without approvals
        it('ether transfer should be reversed', async () => {
            await assertRevert(new Promise((resolve, reject) => {
                web3.eth.sendTransaction({ from: creator, to: token.address, value: web3.utils.toWei('10', 'Ether') }, (err, res) => {
                    if (err) { reject(err); }
                    resolve(res);
                });
            }));

            const balanceAfter = await token.balanceOf.call(creator);
            assert.strictEqual(balanceAfter.toString(), INITIAL_SUPPLY.toString());
        });

        it('should transfer 10000 to accounts[1] with creator having 10000', async () => {
            await token.transfer(accounts[1], 10000, { from: creator });
            const balance = await token.balanceOf.call(accounts[1]);
            assert.strictEqual(parseInt(balance), 10000);
        });

        it('should fail when trying to transfer send more tokens than available', async () => {
            let txn_amount = web3.utils.toBN("100000000000000000000000");
            await assertRevert(token.transfer.call(accounts[1], txn_amount, { from: creator }));
        });

        it('should handle zero-transfers normally', async () => {
            assert(await token.transfer.call(accounts[1], 0, { from: creator }), 'zero-transfer has failed');
        });
    });

    describe("approvals", async () => {
        it('can approve allowance', async () => {
            await token.approve(accounts[1], 100, { from: creator });
            const allowance = await token.allowance.call(creator, accounts[1]);
            assert.strictEqual(parseInt(allowance), 100);
        });

        it('can withdraw approved amount', async () => {
            await token.approve(accounts[1], 100, { from: creator }); // 100
            const balance2 = await token.balanceOf.call(accounts[2]);
            assert.strictEqual(parseInt(balance2), 0, 'balance2 not correct');

            await token.transferFrom.call(creator, accounts[2], 20, { from: accounts[1] });
            await token.allowance.call(creator, accounts[1]);
            await token.transferFrom(creator, accounts[2], 20, { from: accounts[1] }); // -20
            const allowance01 = await token.allowance.call(creator, accounts[1]);
            assert.strictEqual(parseInt(allowance01), 80); // =80

            const balance22 = await token.balanceOf.call(accounts[2]);
            assert.strictEqual(parseInt(balance22), 20);

            const balance02 = await token.balanceOf.call(creator);
            assert.strictEqual(parseInt(balance02), INITIAL_SUPPLY - 20);
        });

        // should approve 100 of msg.sender & withdraw 50 & 60 (should fail).
        it('cannot withdraw more than allowance', async () => {
            await token.approve(accounts[1], 100, { from: creator });
            await token.transferFrom(creator, accounts[2], 50, { from: accounts[1] });
            await assertRevert(token.transferFrom.call(creator, accounts[2], 60, { from: accounts[1] }));
        });

        it('cannot withdraw if no allowance', async () => {
            await assertRevert(token.transferFrom.call(creator, accounts[2], 60, { from: accounts[1] }));
        });

        it('allow accounts[1] 100 to withdraw from creator', async () => {
            await token.approve(accounts[1], 100, { from: creator });
            await token.transferFrom(creator, accounts[2], 60, { from: accounts[1] });
        });

        it('updates allowance after withdrawal', async () => {
            await token.approve(accounts[1], 100, { from: creator });
            await token.transferFrom(creator, accounts[2], 60, { from: accounts[1] });
            await token.approve(accounts[1], 0, { from: creator });
            await assertRevert(token.transferFrom.call(creator, accounts[2], 10, { from: accounts[1] }));
        });

        it('approve max (2^256 - 1)', async () => {
            // Dealing with multiple, incompatible implementations of BigNumber here.
            // Looks a bit funny.
            const maxMinusOneString = '115792089237316195423570985008687907853269984665640564039457584007913129639935'
            await token.approve(accounts[1], '115792089237316195423570985008687907853269984665640564039457584007913129639935', { from: creator });
            const allowance = await token.allowance(creator, accounts[1]);
            const allowanceString = web3.utils.toBN(allowance).toString();
            assert.strictEqual(allowanceString, web3.utils.toBN(maxMinusOneString).toString())
        });
    });

    describe("events", async () => {
        it('should fire Transfer event for initial creation', async () => {
            const receipt = web3.eth.getTransactionReceipt(token.transactionHash);
            const logs = decodeLogs(receipt.logs, SimpleToken, token.address);
            assert.equal(logs[0].event, 'Transfer');
            assert.equal(logs[0].args.from.valueOf(), 0x0);
            assert.equal(logs[0].args.to.valueOf(), accounts[0]);
            assert(logs[0].args.value.eq(INITIAL_SUPPLY));
        });

        it('should fire Transfer event properly', async () => {
            const res = await token.transfer(accounts[1], '2666', { from: creator });
            const receipt = web3.eth.getTransactionReceipt(res.receipt.transactionHash);
            const logs = decodeLogs(receipt.logs, SimpleToken, token.address);
            const log = logs[0];
            assert.equal(log.event, 'Transfer');
            assert.equal(log.args.from.valueOf(), creator);
            assert.equal(log.args.to.valueOf(), accounts[1]);
            assert(log.args.value.eq(2666));
        });

        it('should fire Approval event properly', async () => {
            const res = await token.approve(accounts[1], '2666', { from: creator });
            const receipt = web3.eth.getTransactionReceipt(res.receipt.transactionHash);
            const logs = decodeLogs(receipt.logs, SimpleToken, token.address);
            const log = logs[0];
            assert.equal(log.event, 'Approval');
            assert.strictEqual(log.args.owner.valueOf(), creator);
            assert.strictEqual(log.args.spender.valueOf(), accounts[1]);
            assert.strictEqual(log.args.value.valueOf().toString(), '2666');
        });
    });
});
