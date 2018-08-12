
// ganache : build in-memeory blockchain
// https://truffleframework.com/ganache

const fs = require("fs");
const solc = require('solc')
let Web3 = require('web3');
let web3;

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
// set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

const source = fs.readFileSync('./voting.sol').toString()
const output = solc.compile(source.toString(), 1)

var bytecode;
var abi;

for (var contractName in output.contracts) {
  // code and ABI that are needed by web3
  bytecode = output.contracts[contractName].bytecode
  abi = JSON.parse(output.contracts[contractName].interface)
}
const contract = new web3.eth.Contract(abi)
contract.deploy({
  data: bytecode,
  arguments: [[web3.utils.fromAscii('Jogn')]]
  // arguments: ['john', '']
}).send({
  from: '0x7c5ade6c45571531d04663cca5d9d245c23c81e3',
  gas: 4712388,
  gasPrice: '10000000000000'
}).then((instance) => {
  // console.log(instance)
  instance.methods.voteForCandidate(web3.utils.fromAscii('Jogn')).send({
    from: '0x7c5ade6c45571531d04663cca5d9d245c23c81e3'
  }).then((res) => {
    console.log(res)

    instance.methods.totalVotesFor(web3.utils.fromAscii('Jogn')).call()
      .then(res => console.log(res))
  })
}).catch(e => {
  console.error(e)
})
