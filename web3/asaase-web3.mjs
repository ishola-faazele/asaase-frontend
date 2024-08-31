import Web3 from 'web3';
import detectEthereumProvider from '@metamask/detect-provider';
import { ABI } from './ABI.mjs';

const zoningEnum = {
  RESIDENTIAL: 0,
  COMMERCIAL: 1,
  INDUSTRIAL: 2,
  AGRICULTURAL: 3,
  MIXED_USE: 4
};

const regionEnum = {
  ASHANTI: 0,
  BRONG_AHAFO: 1,
  CENTRAL: 2,
  EASTERN: 3,
  GREATER_ACCRA: 4,
  NORTHERN: 5,
  UPPER_EAST: 6,
  UPPER_WEST: 7,
  VOLTA: 8,
  WESTERN: 9,
  SAVANNAH: 10,
  BONO_EAST: 11,
  OTI: 12,
  AHAFO: 13,
  WESTERN_NORTH: 14,
  NORTH_EAST: 15
};

const cityEnum = {
  KUMASI: 0,
  SUNYANI: 1,
  CAPE_COAST: 2,
  KOFORIDUA: 3,
  ACCRA: 4,
  TAMALE: 5,
  BOLGATANGA: 6,
  WA: 7,
  HO: 8,
  SEKONDI_TAKORADI: 9,
  DAMONGO: 10,
  TECHIMAN: 11,
  DAMBAI: 12,
  GOASO: 13,
  SEFWI_WIAWSO: 14,
  NALERIGU: 15
};

export default class AsaaseWeb3 {
  constructor() {
    this.web3 = null;
    this.contract = null;
    this.account = null;
    this.contractAddress = '0xfb36c13360122ac1985d476a60d991905525d24a';
  }

  async connectAccount() {
    try {
      const provider = await detectEthereumProvider();

      if (provider) {
        this.web3 = new Web3(provider);
        await provider.request({ method: 'eth_requestAccounts' });
        const accounts = await this.web3.eth.getAccounts();
        this.account = accounts[0];
        this.contract = new this.web3.eth.Contract(ABI, this.contractAddress);
        console.log('Connected account:', this.account);
        return this.account;
      } else {
        console.error('MetaMask is not installed.');
        return null;
      }
    } catch (error) {
      console.error('Failed to connect account:', error);
      return null;
    }
  }

  async getBalanceOf(address) {
    if (!this.contract) {
      throw new Error('Not connected. Please call connectAccount first.');
    }
    const balance = await this.contract.methods.balanceOf(address).call();
    return balance;
  }

  
  
  async mintToken(account, boundaryPoints, size, zoning, landName, region, city, value, imageUrl) {
    if (!this.contract) {
      throw new Error('Not connected. Please call connectAccount first.');
    }
    try {
      // Convert zoning, region, and city to uint8 values
      const zoningValue = zoningEnum[zoning];
      const regionValue = regionEnum[region];
      const cityValue = cityEnum[city];
  
      const gasEstimate = await this.contract.methods.safeMint(
        boundaryPoints, account, size, zoningValue, landName, regionValue, cityValue, value, imageUrl
      ).estimateGas({ from: account });
  
      const receipt = await this.contract.methods.safeMint(
        boundaryPoints, account, size, zoningValue, landName, regionValue, cityValue, value, imageUrl
      ).send({ from: account, gas: gasEstimate });
  
      console.log('Transaction successful:', receipt);
      return receipt;
    } catch (error) {
      console.error('Transaction failed:', error);
      throw new Error('Minting transaction failed: ' + error.message);
    }
  }
  

  async transferToken(fromAddress, toAddress, tokenId) {
    if (!this.contract) {
      throw new Error('Not connected. Please call connectAccount first.');
    }
    const gasEstimate = await this.contract.methods.safeTransferFrom(fromAddress, toAddress, tokenId).estimateGas({ from: fromAddress });
    const receipt = await this.contract.methods.safeTransferFrom(fromAddress, toAddress, tokenId)
      .send({ from: fromAddress, gas: gasEstimate });
    return receipt;
  }

  // Other methods remain the same
}