// src/components/Dashboard.js
import { useState, useEffect } from 'react';
import LandParcelCard from './LandParcelCard';
import AsaaseWeb3 from '../web3/asaase-web3.mjs';

const Dashboard = ({ account }) => {
  const [landParcels, setLandParcels] = useState([]);

  useEffect(() => {
     const fetchLandParcels = async () => {
      const asaaseWeb3 = new AsaaseWeb3();
      const totalSupply = await asaaseWeb3.getTotalSupply();
      const parcels = [];
 
      for (let i = 0; i < totalSupply; i++) {
        const owner = await asaaseWeb3.getOwnerOf(i);
        if (owner.toLowerCase() === account.toLowerCase()) {
          const landDetails = await asaaseWeb3.getLandDetails(i);
          parcels.push({ ...landDetails, tokenId: i });
        }
      }
      setLandParcels(parcels);
    };

    fetchLandParcels();
  }, [account]);

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Land Parcels</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {landParcels.map((land) => (
          <LandParcelCard key={land.tokenId} land={land} />
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
