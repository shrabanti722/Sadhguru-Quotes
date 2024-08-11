import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import axios from "axios";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import IosShareIcon from "@mui/icons-material/IosShare";
import SadhguruQuotes from "./SadhguruQuotes";
import DailySadhanaVideo from "./DailySadhanaVideo";
import DailySadhana from "./DailySadhana";
import DownloadApp from "./DownloadApp";

const muteIconStyle = { color: "white", marginTop: 3, fontSize: 27 };

const StoryCard = ({ dailyQuoteObj }) => {
  const [currPage, setCurrPage] = useState(0);
  const [sadhanaConfirmed, setSadhanaConfirmed] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [dailySadhanaObj, setDailySadhanaObj] = useState(null);
  const [clickedShareBtn, setClickedShareBtn] = useState(false);
  const [videoLoader, setVideoLoader] = useState(true);
  const [isQuoteProgressing, setIsQuoteProgressing] = useState(true);

  const divRef = useRef(null);

  const _handleClick = (e) => {
    if (dailyQuoteObj?.isDesktop) return;
    const divWidth = divRef.current.getBoundingClientRect().width;
    const halfDivWidth = divWidth / 2;
    const mouseXPos = e.clientX;
    const mouseYPos = e.clientY;

    console.log(mouseXPos, mouseYPos);

    if (mouseYPos < 77) return;
    if (mouseXPos <= halfDivWidth) {
      // console.log("Mouse on left side");
      if (currPage !== 1) handleLeftArrow();
      else if (mouseXPos < 38) handleLeftArrow();
    } else {
      console.log("Mouse on right side");
      if (currPage !== 1) handleRightArrow();
      else if (mouseXPos > 350) handleRightArrow();
    }
  };

  const dateString = useMemo(
    () => window.location.pathname.split("/").at(-1),
    [],
  );
  const progressBar = document.getElementById(`slider${dailyQuoteObj.date}`);

  const componentsArr = useMemo(
    () => [
      <SadhguruQuotes dailyQuoteObj={dailyQuoteObj} />,
      <DailySadhanaVideo
        setCurrPage={setCurrPage}
        currPage={currPage}
        isMuted={isMuted}
        dailySadhanaObj={dailySadhanaObj}
        setDailySadhanaObj={setDailySadhanaObj}
        date={dailyQuoteObj?.date}
        key={dailyQuoteObj?.date}
        dailyQuoteObj={dailyQuoteObj}
        videoLoader={videoLoader}
        setVideoLoader={setVideoLoader}
      />,
      <DailySadhana
        sadhanaConfirmed={sadhanaConfirmed}
        setSadhanaConfirmed={setSadhanaConfirmed}
        dailySadhanaObj={dailySadhanaObj}
      />,
      <DownloadApp />,
    ],
    [
      sadhanaConfirmed,
      currPage,
      isMuted,
      dailyQuoteObj,
      dailyQuoteObj?.date,
      dailySadhanaObj,
      dateString,
      dailyQuoteObj?.transition,
      videoLoader,
    ],
  );

  const handleProgress = () => {
    const video = document.getElementById(`video${dailyQuoteObj?.date}`);
    if (!video) return;
    const percent = (video.currentTime / video.duration) * 100;
    if (percent === 100) {
      if (currPage === 1) setCurrPage(2);
      // progressBar.style.flexBasis = '0%';
      return;
    }
    if (progressBar)
    progressBar.style.flexBasis = `${percent}%`;
  };

  const handleVideoProgress = (curr) => {
    const video = document.getElementById(`video${dailyQuoteObj?.date}`);
    if (!video) return;
    if (curr !== 1) video.removeEventListener("timeupdate", handleProgress);
  };

  const handleRightArrow = () => {
    handleVideoProgress(currPage + 1);
    setCurrPage(Math.min(currPage + 1, 3));
    if (currPage === 1) progressBar.style.flexBasis = "100%";
  };

  const handleLeftArrow = () => {
    handleVideoProgress(Math.max(currPage - 1, 0));
    if (currPage > 0) setCurrPage(currPage - 1);
    else setCurrPage(0);
    if (currPage === 1) progressBar.style.flexBasis = "0%";
  };

  const getPage = useMemo(
    () => componentsArr[currPage],
    [
      sadhanaConfirmed,
      currPage,
      isMuted,
      dailyQuoteObj,
      dailyQuoteObj?.date,
      dailySadhanaObj,
      dateString,
      dailyQuoteObj?.transition,
      videoLoader,
    ],
  );

  const getProgressClassName = useCallback(
    (className, page) => {
      return dailyQuoteObj.date === dailyQuoteObj.currDate && page === currPage
        ? `${className} filled`
        : className;
    },
    [currPage, dailyQuoteObj],
  );

  const getFilledProgressClassName = useCallback(
    (className, page) =>
      dailyQuoteObj.date === dailyQuoteObj.currDate && page <= currPage
        ? `${className} filled`
        : className,
    [currPage, dailyQuoteObj],
  );

  // const fetchDailySadhanaHandler = async () => {
  //   try {
  //     const resp = await axios.get(
  //       `http://localhost:8010/proxy/app/app-stories-data/${dailyQuoteObj?.date}`, // lcp --proxyUrl https://sgexclusive.sadhguru.org
  //     );
  //     if (resp.status === 200) {
  //       setDailySadhanaObj(resp.data.data[1]);
  //     } else {
  //       console.log(resp);
  //     }
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  const reset = () => {
    setCurrPage(0);
    setSadhanaConfirmed(false);
    // await fetchDailySadhanaHandler();
    if (progressBar) progressBar.style.flexBasis = "0%";
    const video = document.getElementById(`video${dailyQuoteObj?.date}`);
    if (!video) return;
    video.removeEventListener("timeupdate", handleProgress);
    video.removeAttribute("src"); // empty source
    video.load();
  };

  useEffect(() => {
    reset();
  }, [dailyQuoteObj?.date]);

  //   const fetchQuoteHandler = async () => {
  //     try {
  //       if (quoteLoading) return;
  //       setQuoteLoading(true);
  //       const response = await axios.get(
  //         `https://quotes.isha.in/dmq/index.php/Webservice/fetchDailyQuote?date=${dateString}`,
  //       );
  //       if (response.status === 200) {
  //         setDailyQuoteObj(response.data.response.data?.[0]);
  //       } else {
  //         console.log(response);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     } finally {
  //       setQuoteLoading(false);
  //     }
  //   };

  //   useEffect(() => {
  //     fetchQuoteHandler();
  //   }, []);

  const handleShareBtnClick = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setClickedShareBtn(true);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    if (!clickedShareBtn) return;
    const shareMessageElem = document.getElementsByClassName("shareBtn")[0];
    if (!shareMessageElem) return;
    setTimeout(() => {
      shareMessageElem.classList.add("hidden");
    }, 200);
    setTimeout(() => {
      setClickedShareBtn(false);
    }, 2200);
  }, [clickedShareBtn]);

  var xDown = null;
  var yDown = null;

  function getTouches(evt) {
    return (
      evt.touches || // browser API
      evt.originalEvent.touches
    ); // jQuery
  }

  function handleTouchStart(evt) {
    const firstTouch = getTouches(evt)[0];
    xDown = firstTouch.clientX;
    yDown = firstTouch.clientY;
  }

  function handleTouchMove(evt) {
    if (!xDown || !yDown) {
      return;
    }

    var xUp = evt.touches[0].clientX;
    var yUp = evt.touches[0].clientY;

    var xDiff = xDown - xUp;
    var yDiff = yDown - yUp;

    if (Math.abs(xDiff) > Math.abs(yDiff)) {
      /*most significant*/
      if (xDiff > 0) {
        /* right swipe */
        handleRightArrow();
      } else {
        /* left swipe */
        handleLeftArrow();
      }
    } else {
      if (yDiff > 0) {
        /* down swipe */
      } else {
        /* up swipe */
      }
    }
    /* reset values */
    xDown = null;
    yDown = null;
  }

  useEffect(() => {
    if (!dailyQuoteObj?.isDesktop) {
      document.addEventListener("touchstart", handleTouchStart, false);
      document.addEventListener("touchmove", handleTouchMove, false);
    }
  }, []);

  useEffect(() => {
    if (currPage === 0) {
      setIsQuoteProgressing(true)
      setTimeout(() => {
        setIsQuoteProgressing(false);
        setCurrPage(1);
      }, 20000);  
    } else {
      setIsQuoteProgressing(false);
    }
  }, [currPage]);

  return (
    <>
      <div className="isDesktop" style={{ flexDirection: "column" }}>
        <div style={{ marginTop: "-350px" }}></div>
      </div>
      <div className="innerContainer" ref={divRef} onClick={_handleClick}>
        {!dailyQuoteObj?.isDesktop ? (
          <div className="headerContainer">
            <div
              className="iconContainer"
              onClick={() => setIsMuted((prev) => !prev)}
            >
              <img
                src={
                  isMuted
                    ? "https://webapp.sadhguru.org/assets/muteOnImage-d15ddfd1.svg"
                    : "https://webapp.sadhguru.org/assets/muteOffImage-e4c2ccdd.svg"
                }
                alt=""
              />
            </div>
            <div style={{ minWidth: "10px" }}></div>
            <div className="iconContainer" onClick={handleShareBtnClick}>
              <img
                src="https://webapp.sadhguru.org/assets/shareImage-a839b7a1.svg"
                alt=""
              />
            </div>
            {clickedShareBtn ? (
              <div className="shareBtn">
                <div style={{ fontFamily: "OpenSans", fontSize: "14px" }}>
                  Link copied
                </div>
              </div>
            ) : null}
            <div style={{ minWidth: "10px" }}></div>
          </div>
        ) : null}
        <div>
          <div style={{ minHeight: "10px" }}></div>
       {dailyQuoteObj?.currDate === dailyQuoteObj?.date ?  
        <div className="progressContainer">
            <div className={getProgressClassName("progress-bar", 0)}>
              <div
                className={`filled-progress ${isQuoteProgressing ? 'quoteFilled': 'filled'}`}
                // className={getFilledProgressClassName("filled-progress", 0)}
              />
            </div>
            <div className={getProgressClassName("progress-bar", 1)}>
              <div
                className="filled-progress slider"
                id={`slider${dailyQuoteObj?.date}`}
              />
            </div>
            <div className={getProgressClassName("progress-bar", 2)}>
              <div
                className={getFilledProgressClassName("filled-progress", 2)}
              />
            </div>
            <div className={getProgressClassName("progress-bar", 3)}>
              <div
                className={getFilledProgressClassName("filled-progress", 3)}
              />
            </div>
          </div> : null}
          <div style={{ minHeight: "10px" }}></div>
        </div>
        <div className="contentContainer">
          {dailyQuoteObj?.isDesktop ? (
            <div className="iconHeader">
              <div
                className="iconContainer"
                onClick={() => setIsMuted((prev) => !prev)}
              >
                {/* <img
              src={
                isMuted
                  ? "https://webapp.sadhguru.org/assets/muteOnImage-d15ddfd1.svg"
                  : "https://webapp.sadhguru.org/assets/muteOffImage-e4c2ccdd.svg"
              }
              alt=""
            /> */}
                {isMuted ? (
                  <VolumeOffIcon style={muteIconStyle} />
                ) : (
                  <VolumeUpIcon style={muteIconStyle} />
                )}
              </div>
              <div style={{ minWidth: "10px" }}></div>
              <div className="iconContainer" onClick={handleShareBtnClick}>
                {/* <img
              src="https://webapp.sadhguru.org/assets/shareImage-a839b7a1.svg"
              alt=""
            /> */}
                <IosShareIcon style={{ color: "white", marginTop: 3 }} />
              </div>
            </div>
          ) : null}
          {clickedShareBtn ? (
            <div className="shareBtn">
              <div style={{ fontFamily: "OpenSans", fontSize: "14px" }}>
                Link copied
              </div>
            </div>
          ) : null}
          {(currPage !== 1 || !videoLoader) &&
          dailyQuoteObj?.isDesktop &&
          dailyQuoteObj?.date === dailyQuoteObj?.currDate ? (
            <div
              id="leftArrow"
              className="arrowIcon"
              style={
                currPage > 0
                  ? { cursor: "pointer", filter: "invert(0.7)", left: 10 }
                  : { filter: "invert(0.7)", left: 10 }
              }
              onClick={handleLeftArrow}
            >
              {currPage > 0 ? (
                <img
                  src="https://webapp.sadhguru.org/assets/btnLeftArrowInCircle-2d1c0182.svg"
                  alt=""
                />
              ) : (
                <div style={{ minHeight: "45px", minWidth: "45px" }} />
              )}
            </div>
          ) : null}
          {getPage}
          {(currPage !== 1 || !videoLoader) &&
          dailyQuoteObj?.isDesktop &&
          dailyQuoteObj?.date === dailyQuoteObj?.currDate ? (
            <div
              id="rightArrow"
              className="arrowIcon"
              style={
                currPage < 3
                  ? { cursor: "pointer", filter: "invert(0.7)" }
                  : { filter: "invert(0.7)" }
              }
              onClick={handleRightArrow}
            >
              {currPage < 3 ? (
                <img
                  src="https://webapp.sadhguru.org/assets/btnRightArrowInCircle-a7599d0e.svg"
                  alt=""
                />
              ) : (
                <div style={{ minHeight: "45px", minWidth: "45px" }} />
              )}
            </div>
          ) : null}
        </div>
        <div className="isMobile" style={{ flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "-700px",
            }}
          >
            <div style={{ minWidth: "45px", minHeight: "45px" }}></div>
            <div
              style={{
                width: "100px",
                height: "650px",
                marginLeft: "-10px",
                marginRight: "-10px",
                zIndex: 1,
              }}
            ></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StoryCard;
