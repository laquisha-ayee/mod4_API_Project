import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function SpotDetails() {
  const { spotId } = useParams();
  const [spot, setSpot] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/spots/${spotId}`)
      .then(res => res.json())
      .then(data => {
        setSpot(data);
        setLoading(false);
      });
  }, [spotId]);

  if (loading) return <div>Loading...</div>;
  if (!spot) return <div>Spot not found.</div>;

  // Find the preview image
  const previewImage = spot.SpotImages
    ? spot.SpotImages.find(img => img.preview)
    : null;

  return (
    <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight:"100vh" }} >

        <h1>{spot.name}</h1>
        <img
          src={previewImage ? previewImage.url : "https://via.placeholder.com/600x400?text=No+Image"}
          alt={spot.name}
          width={600}
          style={{ marginBottom: "20px" }}
        />
        <p><strong>Location:</strong> {spot.city}, {spot.state}, {spot.country}</p>
        <p><strong>Address:</strong> {spot.address}</p>
        <p><strong>Description:</strong> {spot.description}</p>
        <p><strong>Price:</strong> ${spot.price} per night</p>
        <p><strong>Average Rating:</strong> {spot.avgRating}</p>
        <p><strong>Number of Reviews:</strong> {spot.numReviews}</p>
    </div>
  );
}

export default SpotDetails;
