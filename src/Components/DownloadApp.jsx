import React from "react";

const DownloadApp = () => {
  return (
    <>
      <div style={{ minHeight: "20px" }}></div>
      <div className="content">
        <div style={{ width: "345px", maxWidth: "345px" }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <div style={{ minHeight: "10px" }}></div>
            <div
              style={{
                fontFamily: "OpenSans",
                fontWeight: "700",
                fontSize: "30px",
              }}
            >
              Sadhguru app
            </div>
            <div style={{ minHeight: "28px" }}></div>
            <div>
              <img
                src="https://webapp.sadhguru.org/assets/sadhguruApp-3d6f706f.svg"
                alt=""
                width="150px"
              />
            </div>
            <div style={{ minHeight: "50px" }}></div>
            <div
              style={{
                padding: "0px 30px",
                textAlign: "center",
                fontFamily: "FSerStdA-Book",
                fontSize: "20px",
                fontWeight: "500",
                lineHeight: "140%",
              }}
            >
              Looking for Health, Wellness & Spiritual Wisdom?
            </div>
            <div style={{ minHeight: "14px" }}></div>
            <div
              style={{
                padding: "0px 30px",
                textAlign: "center",
                fontFamily: "OpenSans",
                fontSize: "16px",
                fontWeight: "500",
                lineHeight: "150%",
              }}
            >
              Start your day with Sadhguru on Sadhguru App. Get daily updates
              and content curated especially for you.
            </div>
            <div style={{ minHeight: "50px" }}></div>
            <div
              className="downloadNowBtn"
              onClick={() =>
                window.location.assign(
                  "https://isha.sadhguru.org/in/en/sadhguru-app?_branch_match_id=1347133057715452290&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXL05MyUgvLSrVSywo0MvJzMvWL65MKS%2FWLU9NAgBdw8CkIwAAAA%3D%3D",
                )
              }
            >
              Download now
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DownloadApp;
