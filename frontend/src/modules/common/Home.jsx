import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaHome, FaShieldAlt, FaKey, FaHandshake } from 'react-icons/fa';
import PropertyCard from '../../components/PropertyCard';
import Loader from '../../components/Loader';
import axios from 'axios';

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState({ location: '', propertyType: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/user/properties');
        if (data.success) {
          setFeatured(data.data.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to fetch properties', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const handleSearchChange = (e) => {
    setSearch({ ...search, [e.target.name]: e.target.value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = new URLSearchParams(search).toString();
    navigate(`/renter/properties?${query}`);
  };

  return (
    <div style={{ backgroundColor: '#F5F7FA' }}>
      <section
        className="text-white py-5 d-flex align-items-center"
        style={{
          background: 'linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.5)), url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1600") no-repeat center center/cover',
          minHeight: '500px',
        }}
      >
        <div className="container py-4 text-center">
          <h1 className="display-4 fw-bold mb-3 animate-fade-in">Find Your Perfect Rental Home</h1>
          <p className="lead mb-4 opacity-90 animate-fade-in" style={{ animationDelay: '100ms' }}>
            Browse verified listings, book instantly, and manage agreements online.
          </p>

          <form
            onSubmit={handleSearchSubmit}
            className="row g-2 justify-content-center bg-white p-3 rounded shadow-sm mx-auto animate-fade-in"
            style={{ maxWidth: '750px', animationDelay: '200ms' }}
          >
            <div className="col-md-5">
              <div className="input-group">
                <span className="input-group-text bg-white border-end-0 text-secondary">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control border-start-0 text-dark"
                  name="location"
                  placeholder="Enter city or location..."
                  value={search.location}
                  onChange={handleSearchChange}
                />
              </div>
            </div>
            <div className="col-md-4">
              <select
                className="form-select text-dark"
                name="propertyType"
                value={search.propertyType}
                onChange={handleSearchChange}
              >
                <option value="">Property Type (All)</option>
                <option value="Apartment">Apartment</option>
                <option value="Independent House">Independent House</option>
                <option value="Villa">Villa</option>
                <option value="PG">PG</option>
                <option value="Commercial Shop">Commercial Shop</option>
                <option value="Office Space">Office Space</option>
                <option value="Hostel">Hostel</option>
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn w-100 fw-bold text-white" style={{ backgroundColor: '#4DA8FF' }}>
                Search
              </button>
            </div>
          </form>
        </div>
      </section>

      <section className="py-5 bg-white">
        <div className="container py-3">
          <div className="text-center mb-5">
            <h2 className="fw-bold">Why Choose RentEase?</h2>
            <p className="text-secondary">Making property management and renting a breeze for everyone</p>
          </div>
          <div className="row g-4 text-center">
            {[
              { icon: FaShieldAlt, title: 'Verified Owners', desc: 'Admin approvals ensure secure transactions without scams.' },
              { icon: FaKey, title: 'Seamless Booking', desc: 'Tenants apply and book properties with just a few clicks.' },
              { icon: FaHandshake, title: 'Owner Dashboard', desc: 'Add listings, review bookings, and monitor availability status.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="col-md-4">
                <div className="p-4 rounded-3 border-0 bg-light shadow-sm h-100">
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3"
                    style={{ width: '64px', height: '64px', backgroundColor: 'rgba(77, 168, 255, 0.1)', color: '#4DA8FF' }}
                  >
                    <Icon className="fs-3" />
                  </div>
                  <h4 className="fw-bold mb-2">{title}</h4>
                  <p className="text-secondary small mb-0">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-5">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="fw-bold mb-1">Featured Listings</h2>
              <p className="text-secondary mb-0">Discover some of our recently added top-rated properties</p>
            </div>
            <button onClick={() => navigate('/renter/properties')} className="btn btn-outline-primary fw-semibold">
              Browse All
            </button>
          </div>

          {loading ? (
            <Loader message="Fetching featured rentals..." />
          ) : featured.length === 0 ? (
            <div className="text-center py-5 bg-white rounded shadow-sm">
              <FaHome className="fs-1 text-muted mb-3" />
              <h5>No listings available</h5>
              <p className="text-secondary">Please check back later or start listing as an Owner.</p>
            </div>
          ) : (
            <div className="row g-4">
              {featured.map((property) => (
                <div key={property._id} className="col-md-6 col-lg-4">
                  <PropertyCard property={property} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
