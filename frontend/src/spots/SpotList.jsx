import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import './SpotList.css';

function SpotList() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spots")
      .then(res => res.json())
      .then(data => {
        setSpots(Array.isArray(data.Spots) ? data.Spots : []);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <ul className="centered-list">
      {spots.map(spot => (
        <li key={spot.id}>
          <Link to={`/spots/${spot.id}`}>
            <strong>{spot.name}</strong>
          </Link>
          {" — "}
          {spot.city}, {spot.state}
        </li>
      ))}
    </ul>
  );
}

export default SpotList;