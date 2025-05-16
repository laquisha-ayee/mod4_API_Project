import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { csrfFetch } from '../store/csrf'; 
import './CreateSpotForm.css';


function isValidImageUrl(url) {
  return /\.(png|jpg|jpeg)$/i.test(url);
}


function EditSpotForm() {
  const { spotId } = useParams();
  const navigate = useNavigate();



  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");    
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [image5, setImage5] = useState("");
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);


  useEffect(() => {
    async function fetchSpot() {
      const res = await fetch(`/api/spots/${spotId}`);
      if (res.ok) {
        const data = await res.json();
        setAddress(data.address || "");
        setCity(data.city || "");
        setState(data.state || "");
        setCountry(data.country || "");
        setLat(data.lat || "");
        setLng(data.lng || "");
        setName(data.name || "");
        setDescription(data.description || "");
        setPrice(data.price || "");

if (data.SpotImages && data.SpotImages.length > 0) {
    const preview = data.SpotImages.find(img => img.preview);
    setPreviewImage(preview ? preview.url : data.SpotImages[0].url);

const others = data.SpotImages.filter(img => !img.preview);
    setImage2(others[0]?.url || "");
    setImage3(others[1]?.url || "");
    setImage4(others[2]?.url || "");
    setImage5(others[3]?.url || "");
  }
  setLoading(false);
} else {
  setErrors(["Failed to load spot data."]);
  setLoading(false);
  }
}
fetchSpot();
  }, [spotId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors([]);
    const newErrors = {};

    if (!country) newErrors.country = "Country is required";
    if (!address) newErrors.address = "Address is required";
    if (!city) newErrors.city = "City is required";
    if (!state) newErrors.state = "State is required";
    if (description.length < 30) newErrors.description = "Description needs a minimum of 30 characters";
    if (!name) newErrors.name = "Name is required";
    if (!price) newErrors.price = "Price is required";
    if (!previewImage) newErrors.previewImage = "Preview image is required";
    if (previewImage && !isValidImageUrl(previewImage)) newErrors.previewImage = "Image URL must end in .png, .jpg, or .jpeg";

[image2, image3, image4, image5].forEach((img, idx) => {
  if (img && !isValidImageUrl(img)) {
newErrors[`image${idx+2}`] = "Image URL must end in .png, .jpg, or .jpeg";
}
    });

if (Object.keys(newErrors).length) {
  setErrors(Object.values(newErrors));
return;
}

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
  const res = await csrfFetch(`/api/spots/${spotId}`, {
method: "PUT",
body: JSON.stringify(spotData),
});

if (!res.ok) {
  const data = await res.json();
setErrors(data.errors ? Object.values(data.errors) : [data.message || "Something went wrong"]);

return;
}

  navigate(`/spots/${spotId}`);
} catch (err) {
  if (err.json) {
const data = await err.json();
 setErrors(data.errors ? Object.values(data.errors) : [data.message || "Something went wrong"]);
} else {
setErrors(["Network error"]);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

return (
<form onSubmit={handleSubmit} className="create-spot-form">
<h1>Edit Spot</h1>
  {errors.length > 0 && (
<ul>
 {errors.map((err, i) => <li key={i} style={{color: "red"}}>{err}</li>)}
  </ul>
  )}

<section>
 <h2>Wheres your place located?</h2>
 <p>Guests will only get your exact address once they booked a reservation.</p>
 <label>
 Country
<input value={country} onChange={e => setCountry(e.target.value)} placeholder="Country" required />
</label>
 <label>
Street Address
<input value={address} onChange={e => setAddress(e.target.value)} placeholder="Address" required />
  </label>
<div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
<label style={{flex: 1}}>
  City
<input value={city} onChange={e => setCity(e.target.value)} placeholder="City" required />
</label>
<label style={{flex: 1}}>
  State
<input value={state} onChange={e => setState(e.target.value)} placeholder="State" required />
</label>
   </div>
<div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
<label style={{flex: 1}}>
  Latitude
<input value={lat} onChange={e => setLat(e.target.value)} placeholder="Latitude" type="number" step="any" />
  </label>
<label style={{flex: 1}}>
  Longitude
<input value={lng} onChange={e => setLng(e.target.value)} placeholder="Longitude" type="number" step="any" />
</label>
 </div>
  </section>

 <section>
   <h2>Describe your place to guests</h2>
<p>Mention the best features of your space, any special amenities like fast wifi or parking, and what you love about the neighborhood.</p>
    <textarea
value={description}
onChange={e => setDescription(e.target.value)}
placeholder="Please write at least 30 characters"
 minLength={30}
required
/>
</section>

 <section>
<h2>Create a title for your spot</h2>
 <p>Catch guests attention with a spot title that highlights what makes your place special.</p>
  <input
value={name}
onChange={e => setName(e.target.value)}
placeholder="Name of your spot"
maxLength={50}
 required
/>
</section>

<section>
  <h2>Set a base price for your spot</h2>
  <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>
  <input
value={price}
onChange={e => setPrice(e.target.value)}
placeholder="Price per night (USD)"
type="number"
step="0.01"
required
 />
</section>

<section>
<h2>Liven up your spot with photos</h2>
<p>Submit a link to at least one photo to publish your spot.</p>
  <input
value={previewImage}
onChange={e => setPreviewImage(e.target.value)}
placeholder="Preview Image URL"
required
/>
<input value={image2} onChange={e => setImage2(e.target.value)} placeholder="Image URL" />
<input value={image3} onChange={e => setImage3(e.target.value)} placeholder="Image URL" />
<input value={image4} onChange={e => setImage4(e.target.value)} placeholder="Image URL" />
<input value={image5} onChange={e => setImage5(e.target.value)} placeholder="Image URL" />
</section>

<button type="submit" className="create-spot-btn">Update Spot</button>
</form>
  );
}

export default EditSpotForm;