import React from "react";

const SadhguruQuotes = ({ dailyQuoteObj }) => {
  return (
    <>
      <div className="content">
        <div>
          <div
            style={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              // src="https://quotes.isha.in/resources/jul-30-20170304_sun_0015-e.jpg"
              src={dailyQuoteObj?.image_name}
              alt={dailyQuoteObj?.alt_tag}
              width="100%"
              style={{ borderRadius: "10px 10px 0 0" }}
            />
            <div style={{ marginBottom: "-20px" }}></div>
            <div style={{ minHeight: "20px" }}>
              <img
                src="https://webapp.sadhguru.org/assets/dmq_image_bottom-42c7d2b0.svg"
                alt=""
                width="100%"
              />
            </div>
            <div style={{ marginBottom: "-20px" }}></div>
          </div>
          <div
            className="quoteContainer"
          >
            <div style={{ minHeight: "20px" }}></div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
              }}
            >
              <img
                src="https://webapp.sadhguru.org/assets/dmq_quote_start_image-e9903d1b.svg"
                alt=""
                width="34px"
              />
            </div>
            <div style={{ minHeight: "18px" }}></div>
            <div className="textContainer">
              <div className="quoteText">
                {/* The best thing that you can do for your Guru is what is ultimately
              best for yourself. */}
                {dailyQuoteObj?.lang_text}
              </div>
              <div style={{ minHeight: "5px" }}></div>
              <div className="announcement">{dailyQuoteObj?.announcement}</div>
              <div style={{ minHeight: "18px" }}></div>
              {dailyQuoteObj?.show_signature === "1" ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <img
                    src="https://webapp.sadhguru.org/assets/sadhguruSignature-a7619f0d.svg"
                    alt=""
                    width="94px"
                  />
                </div>
              ) : null}
              <div style={{ minHeight: "20px" }}></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SadhguruQuotes;
