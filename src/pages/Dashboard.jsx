import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
// import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import GraphQLClient from '../graphql/graphql.mjs';

const client = new GraphQLClient();

const Dashboard = () => {
  const [lands, setLands] = useState([]);
  // const [totalSupply, setTotalSupply] = useState(0);
  const [mostTokensAccount, setMostTokensAccount] = useState(null);
  const [topExpensiveTokens, setTopExpensiveTokens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [landsData, accountData, tokensData] = await Promise.all([
          client.fetchAllLands(),
          client.fetchTotalSupply(),
          // client.fetchMostTokensAccount(),
          client.fetchTopMostExpensiveTokens(5)
        ]);

        setLands(landsData.lands);
        // setTotalSupply(supplyData.totalSupply.value);
        setMostTokensAccount(accountData.accounts[0]);
        setTopExpensiveTokens(tokensData.lands);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Asaase Land Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {/* <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Total Supply</h2>
          <p className="text-3xl font-bold">{totalSupply}</p>
        </div> */}
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Most Tokens Account</h2>
          <p className="text-sm truncate">{mostTokensAccount?.id}</p>
          <p className="text-2xl font-bold">{mostTokensAccount?.tokenBalance}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Total Lands</h2>
          <p className="text-3xl font-bold">{lands.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Land Distribution by Region</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={lands.reduce((acc, land) => {
                  const region = acc.find(r => r.name === land.region);
                  if (region) {
                    region.value++;
                  } else {
                    acc.push({ name: land.region, value: 1 });
                  }
                  return acc;
                }, [])}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {lands.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold mb-4">Top 5 Most Expensive Lands</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topExpensiveTokens}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="id" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* <div className="bg-white rounded-lg shadow p-4 mb-8">
        <h2 className="text-xl font-semibold mb-4">Land Map</h2>
        <div style={{ height: '400px' }}>
          <MapContainer center={[0, 0]} zoom={2} style={{ height: '100%', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            {lands.map(land => (
              <Marker 
                key={land.id} 
                position={[land.boundaryPoints[0].latitude, land.boundaryPoints[0].longitude]}
              >
                <Popup>
                  <div>
                    <h3 className="font-semibold">{land.landName}</h3>
                    <p>Size: {land.size}</p>
                    <p>Value: {land.value}</p>
                    <p>Owner: {land.owner}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div> */}

      <div className="bg-white rounded-lg shadow p-4">
        <h2 className="text-xl font-semibold mb-4">Land List</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Owner</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {lands.map(land => (
                <tr key={land.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{land.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.landName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.region}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.size}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.value}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{land.owner}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;