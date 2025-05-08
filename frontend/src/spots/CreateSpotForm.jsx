import { useState } from "react";

function CreateSpotForm() {

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [country, setCountry] = useState("");    
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [errors, setErrors] = useState("");

const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);

const spotData = {
    address, 
    city, 
    state, 
    country, 
    lat, 
    lng, 
    name, 
    description, 
    price
};

try {
    const res = await fetch("/api/spots", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(spotData),
    });

    if (!res.ok) {
      const data = await res.json();
      setErrors(data.errors || ["Something went wrong"]);
    } else {
      alert("Spot created!");
    }
  } catch (err) {
    setErrors(["Network error"]);
  }
};

return (
    <form onSubmit={handleSubmit}>
      <h2>Create a New Spot</h2>
      {errors.length > 0 && (
        <ul>
          {errors.map((err, i) => <li key={i} style={{color: "red"}}>{err}</li>)}
        </ul>
      )}
      <input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" required />
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="City" required />
      <input value={state} onChange={e => setState(e.target.value)} placeholder="State" required />
      <input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" required />
      <input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" type="number" step="any" required />
      <input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude" type="number" step="any" required />
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" maxLength={50} required />
      <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required />
      <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Price" type="number" step="0.01" required />
      <button type="submit">Create Spot</button>
    </form>
  );
}

export default CreateSpotForm;
