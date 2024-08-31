import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import GraphQLClient from '../graphql/graphql.mjs';
import AsaaseWeb3 from '../../web3/asaase-web3.mjs';

const client = new GraphQLClient();
const asaaseWeb3 = new AsaaseWeb3();

const LandDAppHomePage = () => {
  const [account, setAccount] = useState('');
  const [lands, setLands] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [totalLandValue, setTotalLandValue] = useState(0);
  const [landTokenBalance, setLandTokenBalance] = useState(0);
  const [buyLandId, setBuyLandId] = useState('');
  const [transferLandId, setTransferLandId] = useState('');
  const [transferTo, setTransferTo] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const connectWallet = async () => {
      try {
        const connectedAccount = await asaaseWeb3.connectAccount();
        if (connectedAccount) {
          setAccount(connectedAccount);
          fetchUserData(connectedAccount);
        } else {
          setError('Failed to connect wallet. Please try again.');
        }
      } catch (err) {
        setError('Failed to connect wallet. Please try again.', err);
      }
    };

    connectWallet();
  }, []);

  const fetchUserData = async (address) => {
    try {
      const [landsData, transactionsData, balanceData] = await Promise.all([
        client.fetchLandsByOwner(address),
        client.fetchTransactionsByUser(address),
        asaaseWeb3.getBalanceOf(address)
      ]);

      setLands(landsData.lands);
      setTransactions(transactionsData.transactions.slice(0, 5)); // Get latest 5 transactions
      calculateTotalLandValue(landsData.lands);
      setLandTokenBalance(balanceData);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch user data. Please try again.', err);
      setLoading(false);
    }
  };

  const calculateTotalLandValue = (lands) => {
    const total = lands.reduce((sum, land) => sum + parseFloat(land.value), 0);
    setTotalLandValue(total);
  };

  const handleBuyLand = async () => {
    try {
      // In a real dApp, you would interact with a smart contract here.
      // For now, we'll just simulate a purchase by minting a new token
      const receipt = await asaaseWeb3.mintToken(
        account,
        [{ latitude: "0", longitude: "0" }], // placeholder boundary points
        "100", // size
        "1", // zoning
        "New Land", // landName
        "1", // region
        "New City", // city
        "1000000000000000000", // value (1 ETH in wei)
        "https://example.com/image.jpg" // imageUrl
      );
      setSuccess(`Successfully bought land with transaction hash: ${receipt.transactionHash}`);
      setBuyLandId('');
      fetchUserData(account);
    } catch (err) {
      setError(`Failed to buy land: ${err.message}`);
    }
  };

  const handleTransferLand = async () => {
    try {
      const receipt = await asaaseWeb3.transferToken(account, transferTo, transferLandId);
      setSuccess(`Successfully transferred land with ID: ${transferLandId} to ${transferTo}`);
      setTransferLandId('');
      setTransferTo('');
      fetchUserData(account);
    } catch (err) {
      setError(`Failed to transfer land: ${err.message}`);
    }
  };

  const handleSellAllLandTokens = async () => {
    try {
      // This is a placeholder. In a real dApp, you would interact with a smart contract here.
      // For now, we'll just transfer all tokens to a burn address
      const burnAddress = '0x000000000000000000000000000000000000dEaD';
      for (const land of lands) {
        await asaaseWeb3.transferToken(account, burnAddress, land.id);
      }
      setSuccess('Successfully sold all land tokens');
      fetchUserData(account);
    } catch (err) {
      setError(`Failed to sell all land tokens: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Your Land Home</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline"> {error}</span>
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline"> {success}</span>
        </div>
      )}

      {/* Rest of the component remains the same */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Total Land Value</h2>
          <p className="text-2xl font-bold">{totalLandValue.toFixed(2)} ETH</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Land Token Balance</h2>
          <p className="text-2xl font-bold">{landTokenBalance}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-2">Account</h2>
          <p className="text-sm truncate">{account}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Buy Land</h2>
          <input
            type="text"
            placeholder="Enter Land ID"
            value={buyLandId}
            onChange={(e) => setBuyLandId(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button 
            onClick={handleBuyLand}
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Buy Land
          </button>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Transfer Land</h2>
          <input
            type="text"
            placeholder="Enter Land ID"
            value={transferLandId}
            onChange={(e) => setTransferLandId(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <input
            type="text"
            placeholder="Enter Recipient Address"
            value={transferTo}
            onChange={(e) => setTransferTo(e.target.value)}
            className="w-full p-2 mb-2 border rounded"
          />
          <button 
            onClick={handleTransferLand}
            className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Transfer Land
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Your Lands</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lands.map((land) => (
                <tr key={land.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{land.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{land.landName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{land.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{land.value} ETH</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Latest Transactions</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">From</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">To</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {transactions.map((tx) => (
                <tr key={tx.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.from}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.to}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{tx.value} ETH</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(parseInt(tx.timestamp) * 1000).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Land Value Over Time</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lands}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="landName" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <button 
        onClick={handleSellAllLandTokens}
        className="w-full bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
      >
        Sell All Land Tokens
      </button>
    </div>
  );
};

export default LandDAppHomePage;