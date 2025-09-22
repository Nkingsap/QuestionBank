import { useNavigate } from "react-router-dom";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleBCAClick = () => {
    console.log("BCA button clicked! Navigating to /qs...");
    navigate("/qs");
  };

  return (
    <div className="homepage-container" id="home">
      <div className="homepage-wrapper">
        {/* Header Section */}
        <div className="header-section">
          <h1>Don Bosco College</h1>
          <p className="header-subtitle">Question Bank Portal</p>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Brief Introduction */}
          <div className="intro-section">
            <h2 className="intro-title">Autonomous Question Repository</h2>
            <p className="intro-description">
              Access comprehensive question papers and study materials for effective exam preparation.
            </p>
          </div>

          {/* Department Selection */}
          <div className="department-section">
            <h3 className="department-title">Select Department</h3>

            <div className="department-buttons">
              <button
                onClick={handleBCAClick}
                className="department-button-active"
              >
                <div className="button-content">
                  <div className="button-text">
                    <div className="department-name">Computer Application</div>
                    <div className="department-subtitle">
                      BCA • Question Papers
                    </div>
                  </div>
                  <div className="button-arrow">→</div>
                </div>
              </button>

              {/* Placeholder for future departments */}
              <div className="department-button-disabled">
                <div className="button-content">
                  <div className="button-text">
                    <div className="department-name">More Departments</div>
                    <div className="department-subtitle">Coming Soon</div>
                  </div>
                  <div className="button-arrow">→</div>
                </div>
              </div>
            </div>
          </div>

      
        </div>

        {/* Footer */}
        <div className="footer">Don Bosco College Question Bank</div>
      </div>
    </div>
  );
};
