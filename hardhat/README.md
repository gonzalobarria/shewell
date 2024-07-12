# Sample Hardhat Project With Deploy and Verification
Setup inicial para crear un nuevo proyecto con lo básico para trabajar

```shell
mkdir PROJECT-NAME
cd PROJECT-NAME
npm install -D hardhat
npm i @nomicfoundation/hardhat-toolbox dotenv
npx hardhat init (Typescript)
```
## Deploy and Verification
### Arbitrum

```shell
npx hardhat ignition deploy ./ignition/modules/Blog.ts --network arbitrum
```

### Morph

```shell
npx hardhat ignition deploy ./ignition/modules/Blog.ts --network morphHolesky
npx hardhat verify --network morphHolesky 0x8965bafd644598a80d7D895ca9a0Be1b90843461
```

### Scroll

```shell
npx hardhat ignition deploy ./ignition/modules/Blog.ts --network scrollSepolia
npx hardhat verify --network scrollSepolia 0x7062A3006d2C20948590fB3f207de7EB97604511
```

### Sepolia

```shell
npx hardhat ignition deploy ./ignition/modules/Blog.ts --network sepolia
npx hardhat verify --network sepolia 0x8965bafd644598a80d7D895ca9a0Be1b90843461
```

### Zircuit

```shell
npx hardhat ignition deploy ./ignition/modules/Blog.ts --network zircuit
npx hardhat verify --network zircuit 0x8965bafd644598a80d7D895ca9a0Be1b90843461
```
