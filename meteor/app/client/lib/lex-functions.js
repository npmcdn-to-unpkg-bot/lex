// get the latest block
web3.eth.filter('latest').watch(function(e, blockHash) {
    if(!e) {
        web3.eth.getBlock(blockHash, function(e, block){
            Session.set('latestBlock', block);
        });
    }
});



// Check if money arrived
// Note checking from block 0 is very unperformant!
AlexContentInstance.Deposit({},{fromBlock: 0, toBlock: 'latest'}).watch(function(e, log) {
    if(!e) {
        console.log('Money arrived! From:'+ log.args.from, log.args.value.toString(10));

        // add the transaction to our collection
        Deposits.upsert('tx_'+ log.transactionHash ,{
            from: log.args.from,
            value: log.args.value.toString(10),
            blockNumber: log.blockNumber
        });
    }
});



// Check if somebody set a number
AlexContentInstance.Publish({}).watch(function(e, log) {
    if(!e) {
        console.log('New content was published at block #'+ log.blockNumber);
        alert('New content was published at block #'+ log.blockNumber + ' Deposit to view!');
        console.log('Money arrived! From:'+ log.args.from, log.args.value.toString(10));

        // add the transaction to our collection
        Publications.upsert('tx_'+ log.transactionHash ,{
            creator: log.args.creator,
            name: log.args.name,
            value: log.args.value.toString(10),
            blockNumber: log.blockNumber
        });
    }
});
