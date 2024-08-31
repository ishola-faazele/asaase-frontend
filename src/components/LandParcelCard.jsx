// src/components/LandParcelCard.js
const LandParcelCard = ({ land }) => {
  return (
    <div className="border p-4 rounded-lg shadow-md">
      <h3 className="text-lg font-bold mb-2">{land.landName}</h3>
      <p><strong>Location:</strong> {land.region}, {land.city}</p>
      <p><strong>Size:</strong> {land.size} sq meters</p>
      <p><strong>Value:</strong> {land.value} wei</p>
      <p><strong>Zoning:</strong> {land.zoning}</p>
    </div>
  );
};

export default LandParcelCard;
