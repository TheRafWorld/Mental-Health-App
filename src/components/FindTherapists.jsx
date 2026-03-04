import React, { useState, useMemo, useEffect } from "react";
// Import the new summary file
import facilitiesSummary from "../data/facilities_summary.json";
import "../styles/find-therapists.css";

const FindTherapists = () => {
  const [zip, setZip] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [selectedServices, setSelectedServices] = useState([]);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);

  // 1. Get unique categories
  const categories = useMemo(() => {
    const catSet = new Set();
    facilitiesSummary.forEach(f => {
      // Check f.services, not f.categories
      f.services?.forEach(s => {
        if (s.category) catSet.add(s.category);
      });
    });
    return ["All Categories", ...Array.from(catSet).sort()];
  }, []);

  // 2. THIS IS THE KEY: Get specific services for the sidebar
  const filteredServiceOptions = useMemo(() => {
    const serviceSet = new Set();
    facilitiesSummary.forEach(f => {
      f.services?.forEach(s => {
        // Check if this specific service belongs to the selected category
        if (selectedCategory === "All Categories" || s.category === selectedCategory) {
          serviceSet.add(s.name);
        }
      });
    });
    return Array.from(serviceSet).sort();
  }, [selectedCategory]); // Now it will re-run when the category changes!

  // 3. The Search Function
  const handleSearch = () => {
    setHasSearched(true);
    const filtered = facilitiesSummary.filter(f => {
      const matchesZip = zip ? f.zip?.startsWith(zip) : true;

      const matchesServices = selectedServices.length > 0
        ? selectedServices.every(sel =>
          f.services?.some(s => s.name === sel)
        )
        : true;

      return matchesZip && matchesServices;
    });
    setResults(filtered);
  };

  const handleClearFilters = () => {
    setZip("");
    setSelectedCategory("All Categories");
    setSelectedServices([]);
    setResults([]);
    setHasSearched(false);
  };

  return (
    <section className="find-therapists container-fluid">
      <div className="row">
        {/* SIDEBAR - Exactly as you had it */}
        <aside className="col-md-3 filter-sidebar">
          <div className="sticky-filter-wrapper">
            <h5 className="fw-bold mb-3">Filter by Category</h5>
            <select
              className="form-select mb-4"
              data-bs-display="static"
              value={selectedCategory}
              onChange={(e) => { setSelectedCategory(e.target.value); setSelectedServices([]); }}
            >
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <h6 className="fw-bold">Specific Services</h6>
            <div className="service-filter-list">
              {filteredServiceOptions.map(service => (
                <div key={service} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    id={service}
                    checked={selectedServices.includes(service)}
                    onChange={() => setSelectedServices(prev =>
                      prev.includes(service) ? prev.filter(s => s !== service) : [...prev, service]
                    )}
                  />
                  <label className="form-check-label small" htmlFor={service}>{service}</label>
                </div>
              ))}
            </div>

            <button className="clear-filters-btn" onClick={handleClearFilters}>
              Clear All Filters
            </button>
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="col-md-9 px-5">
          <div className="search-section text-center">
            <h2 className="mb-4 fw-light">Find Mental Health Services</h2>
            <div className="d-flex search-input-group gap-2 justify-content-center">
              <input
                type="text"
                className="form-control form-control-lg"
                placeholder="Enter ZIP code..."
                value={zip}
                onChange={(e) => setZip(e.target.value)}
              />
              <button className="btn btn-primary btn-lg px-5" onClick={handleSearch}>Search</button>
            </div>
          </div>

          <div className="results-scroll-container">
            {results.length > 0 ? (
              results.map((f) => (
                <FacilityCard key={f.id} facility={f} />
              ))
            ) : (
              <div className="text-center mt-5 no-results-box">
                {hasSearched ? (
                  <>
                    <h4 className="text-dark fw-bold">No facilities found</h4>
                    <p className="text-muted">Try adjusting your filters or checking your ZIP code.</p>
                  </>
                ) : (
                  <p className="text-muted">Enter a ZIP code or select filters to find services near you.</p>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </section>
  );
};

// Helper component to handle "Lazy Loading" the phone/full address
const FacilityCard = ({ facility }) => {
  const [fullData, setFullData] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const resp = await fetch(`facility_details/${facility.id}.json`);
        const data = await resp.json();
        setFullData(data);
      } catch (e) {
        console.error("Failed to load details for", facility.id);
      }
    };
    fetchDetails();
  }, [facility.id]);

  const copyToClipboard = () => {
    const fullAddress = `${fullData?.street1 || ""}, ${facility.city}, ${facility.state} ${facility.zip}`;
    navigator.clipboard.writeText(fullAddress);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset "Copied!" text after 2 seconds
  };

  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
    `${facility.name1} ${facility.city} ${facility.state}`
  )}`;

  return (
    <div className="facility-card">
      <h2 className="facility-name">
        <a 
          href={`https://www.google.com/search?q=${encodeURIComponent(facility.name1 + " " + facility.city)}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="facility-link"
        >
          {facility.name1}
        </a>
      </h2>
      
      {fullData?.name2 && <p className="text-muted mb-1">{fullData.name2}</p>}

      <address className="facility-address">
        {fullData ? (
          <>
            {fullData.street1}{fullData.street2 ? `, ${fullData.street2}` : ""}<br />
          </>
        ) : (
          <div className="placeholder-text">Loading address...</div>
        )}
        {facility.city}, {facility.state} {facility.zip}
      </address>

      {/* ACTION BUTTONS */}
      <div className="card-actions d-flex justify-content-center gap-3 mt-2">
        <button className="btn btn-sm btn-outline-secondary" onClick={copyToClipboard}>
          {copied ? "✅ Copied!" : "📋 Copy Address"}
        </button>
        <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="btn btn-sm btn-outline-primary">
          📍 Get Directions
        </a>
      </div>

      {fullData?.phone ? (
        <div className="phone-wrapper">
          <span className="phone-icon">📞</span>
          <span>{fullData.phone}</span>
        </div>
      ) : fullData ? (
        <p className="text-muted small mt-2">Contact info not available</p>
      ) : null}
    </div>
  );
};

export default FindTherapists;