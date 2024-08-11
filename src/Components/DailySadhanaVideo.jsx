import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import ShakaPlayer from "shaka-player-react";
import "shaka-player-react/dist/controls.css";

const DailySadhanaVideo = ({
  isMuted,
  dailyQuoteObj,
  dailySadhanaObj,
  currPage,
  setCurrPage,
  date,
  setDailySadhanaObj,
  videoLoader,
  setVideoLoader,
}) => {
  const getVideoUrl = (url) => {
    // lcp --proxyUrl https://sgapp-vod.sadhguru.org --port 8012
    // lcp --proxyUrl https://images-sgex-prod.sadhguru.org --port 8011
    if (!url) return;
    const newUrl = new URL(url);
    return newUrl.origin === "https://sgapp-vod.sadhguru.org"
      ? `http://localhost:8012/proxy${newUrl.pathname}`
      : `http://localhost:8011/proxy${newUrl.pathname}`;
  };

  const fetchDailySadhanaHandler = async () => {
    try {
      setVideoLoader(true);
      const resp = await axios.get(
        `http://localhost:8010/proxy/app/app-stories-data/${dailyQuoteObj?.date}`, // lcp --proxyUrl https://sgexclusive.sadhguru.org
      );
      if (resp.status === 200) {
        setDailySadhanaObj(resp.data.data[1]);
      } else {
        console.log(resp);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setVideoLoader(false);
    }
  };

  useEffect(() => {
    fetchDailySadhanaHandler();
  }, []);

  const handleProgress = () => {
    const video = document.getElementById(`video${date}`);
    if (!video) return;
    const progressBar = document.getElementById(`slider${date}`);
    const percent = (video.currentTime / video.duration) * 100;
    if (percent === 100) {
      if (currPage === 1) setCurrPage(2);
      progressBar.style.flexBasis = "0%";
      return;
    }
    if (progressBar)
    progressBar.style.flexBasis = `${percent}%`;
  };

  window.onblur = () => {
    const video = document.getElementById(`video${date}`);
    if (!video) return;
    video.pause();
  };

  const [isPlaying, setIsPlaying] = useState(true);

  const togglePlay = () => {
    const video = document.getElementById(`video${date}`);
    if (video.paused || video.ended) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  useEffect(() => {
    const video = document.getElementById(`video${date}`);
    if (!video) return;
    video.addEventListener("timeupdate", handleProgress);

    const ui = video["ui"];
    const config = {
      addSeekBar: false,
      addBigPlayButton: false,
      controlPanelElements: [],
    };
    ui.configure(config);
  }, []);

  return (
    <>
      <div style={{ minHeight: "20px" }}></div>
      <div className="content">
        {videoLoader ? <div className="videoLoader" /> : null }
        <div
            style={{
              marginLeft: "-20px",
              marginTop: "-20px",
              width: "100%",
            }}
          >
            <ShakaPlayer
              id={`video${date}`}
              autoPlay
              // src="https://images-sgex-prod.sadhguru.org/static-exclusive/sadhguru_app/stories/28383/master.m3u8"
              src={getVideoUrl(dailySadhanaObj?.media_url)}
              className="videoPlayer"
              muted={isMuted}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            />

            <div className="playPauseBtn" onClick={togglePlay}>
              <div style={{ cursor: "pointer" }}>
                <div style={{ minHeight: "80px" }}>
                  <img
                    src={
                      isPlaying
                        ? "https://webapp.sadhguru.org/assets/pauseImage-cac442d6.svg"
                        : "https://webapp.sadhguru.org/assets/playImage-32be498e.svg"
                    }
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div>
      </div>
    </>
  );
};

export default DailySadhanaVideo;
