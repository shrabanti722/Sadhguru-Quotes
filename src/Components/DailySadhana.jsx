import React from "react";

const DailySadhana = ({
  sadhanaConfirmed,
  setSadhanaConfirmed,
  dailySadhanaObj,
}) => {
  return (
    <>
      <div style={{ minHeight: "20px" }}></div>
      <div className="content">
        <div style={{ display: "flex", flexDirection: "column", justifyContent: 'center' }}>
          <div
            style={{
              // minHeight: "600px",
              // maxHeight: "740px",
              overflow: "hidden",
              borderRadius: "10px",
              textAlign: 'center'
            }}
          >
            <img
              // src="https://images-sgex-prod.sadhguru.org/static-exclusive/story/images/daily_sadhana/SSBD-Wait_Two_Minutes_Before_You_Eat-9_Nov.jpg"
              src={dailySadhanaObj?.images?.ssbd_story}
              alt=""
              srcSet=""
              height="280vh"
              style={{
                borderRadius: "10px",
                margin: 'auto'
              }}
            />
            <div className="sadhanaTitle">{dailySadhanaObj?.media_title}</div>
            <div className="sadhanaDesc">{dailySadhanaObj?.desc}</div>
          </div>
          <div
            style={{
              margin: "4vh 2vw 0",
              zIndex: 2,
            }}
            onClick={() =>
              !sadhanaConfirmed && setSadhanaConfirmed((prev) => !prev)
            }
          >
            <div
              className="sadhanaConfirmedContainer"
              style={sadhanaConfirmed ? { cursor: "default" } : {}}
            >
              <div style={{ margin: "4px 12px 0px 0px" }}>
                <img
                  src={
                    sadhanaConfirmed
                      ? "https://webapp.sadhguru.org/assets/iconThumbsUp-e23c0c7a.svg"
                      : "https://webapp.sadhguru.org/assets/iconHand-b6160976.svg"
                  }
                  alt=""
                />
              </div>
              <div
                style={{
                  fontFamily: "OpenSans",
                  fontSize: "16px",
                  fontWeight: "600",
                }}
              >
                {sadhanaConfirmed ? "Great" : "I am in"}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DailySadhana;
