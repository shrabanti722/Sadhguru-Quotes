import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./index.scss";
import StoryCard from "./Components/StoryCard";
import dayjs from "dayjs";
import useWindowDimensions from "./common";

const App = () => {
  const dateString = useMemo(
    () => window.location.pathname.split("/").at(-1),
    [],
  );
  const [isVisible, setIsVisible] = useState(true);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [dailyQuoteObjArr, setDailyQuoteObjArr] = useState(null);
  const [currDate, setCurrDate] = useState(dateString);
  const [loading, setLoading] = useState(false);
  const [quoteArr, setQuoteArr] = useState(null);
  const { height, width } = useWindowDimensions();

  const isDesktop = useMemo(() => width >= 800, [width]);
  const isDesktopMedium = useMemo(() => width <= 1160 && width > 800, []);

  const formatDate = useCallback((date) => {
    return date.format("YYYY-MM-DD");
  }, []);

  const getPrevDay = useCallback((date, n = 1) => {
    return formatDate(moment(date).subtract(n, "d"));
  }, []);

  const getNextDay = useCallback((date, n = 1) => {
    return formatDate(moment(date).add(n, "d"));
  }, []);

  const fetchQuoteHandler = async (date) => {
    try {
      const response = await axios.get(
        `https://quotes.isha.in/dmq/index.php/Webservice/fetchDailyQuote?date=${date}`,
      );
      if (response.status === 200) {
        // setDailyQuoteObj(response.data.response.data?.[0]);
        return response.data.response.data?.[0];
      } else {
        console.log(response);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const getComponentObj = useCallback(
    (obj, date, curr = currDate) => {
      return { ...obj, date, currDate: curr, isDesktop };
    },
    [currDate, isDesktop],
  );

  const getQuotesByDates = async (calcDatesArr, date) => {
    try {
      setQuoteLoading(true);
      const fetchedCurrStory = await fetchQuoteHandler(calcDatesArr[1]);
      if (calcDatesArr.length === 3) {
        const [prevDayStory, nextDayStory] = await Promise.all([
          fetchQuoteHandler(calcDatesArr[0]),
          fetchQuoteHandler(calcDatesArr[2]),
        ]);
        setQuoteArr([
          {
            id: "previous",
            date: calcDatesArr[0],
            story: prevDayStory,
          },
          {
            id: "current",
            date: calcDatesArr[1],
            story: fetchedCurrStory,
          },
          {
            id: "next",
            date: calcDatesArr[2],
            story: nextDayStory,
          },
        ]);
        // setDailyQuoteObjArr([
        //   {
        //     id: "previous",
        //     date: calcDatesArr[0],
        //     story: prevDayStory,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(
        //           prevDayStory,
        //           calcDatesArr[0],
        //           date,
        //         )}
        //       />
        //     ),
        //   },
        //   {
        //     id: "current",
        //     date: calcDatesArr[1],
        //     story: fetchedCurrStory,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(
        //           fetchedCurrStory,
        //           calcDatesArr[1],
        //           date,
        //         )}
        //       />
        //     ),
        //   },
        //   {
        //     id: "next",
        //     date: calcDatesArr[2],
        //     story: nextDayStory,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(
        //           nextDayStory,
        //           calcDatesArr[2],
        //           date,
        //         )}
        //       />
        //     ),
        //   },
        // ]);
      } else {
        const prevDayStory = await fetchQuoteHandler(calcDatesArr[0]);
        setQuoteArr([
          {
            id: "previous",
            date: calcDatesArr[0],
            story: prevDayStory,
          },
          {
            id: "current",
            date: calcDatesArr[1],
            story: fetchedCurrStory,
          },
        ]);
        // setDailyQuoteObjArr([
        //   {
        //     id: "previous",
        //     date: calcDatesArr[0],
        //     story: prevDayStory,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(
        //           prevDayStory,
        //           calcDatesArr[0],
        //           date,
        //         )}
        //       />
        //     ),
        //   },
        //   {
        //     id: "current",
        //     date: calcDatesArr[1],
        //     story: fetchedCurrStory,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(
        //           fetchedCurrStory,
        //           calcDatesArr[1],
        //           date,
        //         )}
        //       />
        //     ),
        //   },
        // ]);
      }
    } catch (err) {
      console.log(err);
    } finally {
      setQuoteLoading(false);
    }
  };

  const getDatesForQuotes = (date = dateString) => {
    const currDate = moment(date, "YYYY-MM-DD");
    setCurrDate(date);
    const prevDay = moment(currDate).subtract(1, "d");
    const calcDatesArr = [formatDate(prevDay), formatDate(currDate)];
    if (currDate.isBefore(formatDate(moment()))) {
      const nextDay = moment(currDate).add(1, "d");
      calcDatesArr.push(formatDate(nextDay));
    }
    getQuotesByDates(calcDatesArr, date);
  };

  const fetchCurrStoryHandler = async (date = currDate) => {
    try {
      setQuoteLoading(true);
      const fetchedCurrStory = await fetchQuoteHandler(date);
      setQuoteArr([
        {
          id: "current",
          date: currDate,
          story: fetchedCurrStory,
        },
      ]);
      // setDailyQuoteObjArr([
      //   {
      //     id: "current",
      //     date: currDate,
      //     story: fetchedCurrStory,
      //     component: (
      //       <StoryCard
      //         dailyQuoteObj={getComponentObj(
      //           fetchedCurrStory,
      //           currDate,
      //           currDate,
      //         )}
      //       />
      //     ),
      //   },
      // ]);
    } catch (err) {
      console.log(err);
    } finally {
      setQuoteLoading(false);
    }
  };

  useEffect(() => {
    if (isDesktop) getDatesForQuotes();
    else fetchCurrStoryHandler();
  }, []);

  const handleDatePickerChange = (date) => {
    if (date === currDate) return;
    if (isDesktop) getDatesForQuotes(date);
    else fetchCurrStoryHandler(date);
  };

  const transitionHandler = async (id) => {
    if (id === "nextInput") {
      setLoading(true);
      // const curr = dailyQuoteObjArr[1];
      // const next = dailyQuoteObjArr[2];
      const curr = quoteArr[1];
      const next = quoteArr[2];
      const nextDay = getNextDay(next.date);
      const calcArr = [
        {
          ...curr,
          id: "previous",
          date: curr.date,
          // component: curr.component,
          // component: (
          //   <StoryCard
          //     dailyQuoteObj={getComponentObj(curr.story, curr.date, next.date)}
          //   />
          // ),
        },
        {
          ...next,
          id: "current",
          date: next.date,
          // component: (
          //   <StoryCard
          //     dailyQuoteObj={getComponentObj(next.story, next.date, next.date)}
          //   />
          // ),
        },
      ];

      if (moment(nextDay).isAfter(moment())) {
        setLoading(false);
        setQuoteArr([
          {
            ...curr,
            id: "previous",
            date: curr.date,
            // component: curr.component,
            // component: (
            //   <StoryCard
            //     dailyQuoteObj={getComponentObj(curr.story, curr.date, next.date)}
            //   />
            // ),
          },
          {
            ...next,
            id: "current",
            date: next.date,
            // component: (
            //   <StoryCard
            //     dailyQuoteObj={getComponentObj(next.story, next.date, next.date)}
            //   />
            // ),
          },
        ]);
        setCurrDate(next.date);
        // setDailyQuoteObjArr(calcArr);
      } else {
        // const nextStoryObj = await fetchQuoteHandler(nextDay);

        // setDailyQuoteObjArr([...calcArr, {id: 'next', date: nextDay, component: <StoryCard dailyQuoteObj={nextStoryObj}/> }]);
        // const nextContainer = document.getElementById("next");
        // const currentContainer = document.getElementById("current");
        // const prevContainer = document.getElementById("previous");

        // nextContainer.classList.remove('next');
        // nextContainer.classList.add('current');
        // nextContainer.id = 'current';
        // currentContainer.classList.remove('current');
        // currentContainer.classList.add('previous');
        // currentContainer.id='previous';
        // prevContainer.classList.remove('previous');
        // prevContainer.classList.add('next');
        // prevContainer.id='next';

        // setDailyQuoteObjArr([...calcArr, {id: 'next', date: nextDay, component: <StoryCard dailyQuoteObj={nextStoryObj}/> }]);

        // currentContainer.classList.add("slideCurrentToLeftAnimation");
        // nextContainer.classList.add("slideNextToCurrentAnimation");
        // prevContainer.classList.add("slidePrevToNextAnimation");

        // setTimeout(async () => {
        setCurrDate(next.date);
        setQuoteArr([
          ...calcArr,
          {
            id: "next",
            date: nextDay,
            story: null,
          },
        ]);
        // setDailyQuoteObjArr([
        //   ...calcArr,
        //   {
        //     id: "next",
        //     date: nextDay,
        //     story: null,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(null, nextDay, next.date)}
        //       />
        //     ),
        //   },
        //   // {
        //   //   id: "next",
        //   //   date: nextDay,
        //   //   story: nextStoryObj,
        //   //   component: (
        //   //     <StoryCard
        //   //       dailyQuoteObj={getComponentObj(nextStoryObj, nextDay, next.date)}
        //   //     />
        //   //   ),
        //   // },
        // ]);
        const nextStoryObj = await fetchQuoteHandler(nextDay);

        setQuoteArr((prev) => [
          prev[0],
          prev[1],
          {
            id: "next",
            date: nextDay,
            story: nextStoryObj,
          },
        ]);
        // setDailyQuoteObjArr((prev) => [
        //   prev[0],
        //   prev[1],
        //   {
        //     id: "next",
        //     date: nextDay,
        //     story: nextStoryObj,
        //     component: (
        //       <StoryCard
        //         dailyQuoteObj={getComponentObj(
        //           nextStoryObj,
        //           nextDay,
        //           next.date,
        //         )}
        //       />
        //     ),
        //   },
        // ]);
        setLoading(false);
        // }, 300);

        // setTimeout(() => {
        //   currentContainer.classList.remove("slideCurrentToLeftAnimation");
        //   nextContainer.classList.remove("slideNextToCurrentAnimation");
        //   prevContainer.classList.remove("slidePrevToNextAnimation");
        // }, 500);
      }
    } else if (id === "previousInput") {
      setLoading(true);
      // const curr = dailyQuoteObjArr[1];
      // const prev = dailyQuoteObjArr[0];
      const curr = quoteArr[1];
      const prev = quoteArr[0];
      const prevDay = getPrevDay(prev.date);

      // const previousStoryObj = await fetchQuoteHandler(prevDay);

      // const nextContainer = document.getElementById("next");
      // const currentContainer = document.getElementById("current");
      // const prevContainer = document.getElementById("previous");

      // currentContainer.classList.add("slideCurrentToNextAnimation");
      // if (nextContainer)
      //   nextContainer.classList.add("slideNextToPrevAnimation");
      // prevContainer.classList.add("slidePrevToCurrentAnimation");

      // setTimeout(async () => {

      setCurrDate(prev.date);

      setQuoteArr([
        {
          id: "previous",
          date: prevDay,
          story: null,
        },
        {
          ...prev,
          id: "current",
          date: prev.date,
        },
        {
          ...curr,
          id: "next",
          date: curr.date,
        },
      ]);
      // setDailyQuoteObjArr([
      //   {
      //     id: "previous",
      //     date: prevDay,
      //     story: null,
      //     component: (
      //       <StoryCard
      //         dailyQuoteObj={getComponentObj(null, prevDay, prev.date)}
      //       />
      //     ),
      //   },
      //   {
      //     ...prev,
      //     id: "current",
      //     date: prev.date,
      //     component: (
      //       <StoryCard
      //         dailyQuoteObj={getComponentObj(prev.story, prev.date, prev.date)}
      //       />
      //     ),
      //   },
      //   {
      //     ...curr,
      //     id: "next",
      //     date: curr.date,
      //     component: (
      //       <StoryCard
      //         dailyQuoteObj={getComponentObj(curr.story, curr.date, prev.date)}
      //       />
      //     ),
      //   },
      // ]);

      const previousStoryObj = await fetchQuoteHandler(prevDay);

      setQuoteArr((prev) => [
        {
          id: "previous",
          date: prevDay,
          story: previousStoryObj,
        },
        prev[1],
        prev[2],
      ]);
      // setDailyQuoteObjArr((prev) => [
      //   {
      //     id: "previous",
      //     date: prevDay,
      //     story: previousStoryObj,
      //     component: (
      //       <StoryCard
      //         dailyQuoteObj={getComponentObj(
      //           previousStoryObj,
      //           prevDay,
      //           prev.date,
      //         )}
      //       />
      //     ),
      //   },
      //   prev[1],
      //   prev[2],
      // ]);
      setLoading(false);
      // }, 300);

      // setTimeout(() => {
      //   currentContainer.classList.remove("slideCurrentToNextAnimation");
      //   if (nextContainer)
      //     nextContainer.classList.remove("slideNextToPrevAnimation");
      //   prevContainer.classList.remove("slidePrevToCurrentAnimation");
      // }, 500);
    }
  };

  const getDateHeader = () => {
    if (currDate === moment().format("YYYY-MM-DD")) return "Today";
    return currDate;
  };

  return (
    <div className="mainContainer">
      <div className="outerContainer">
        <div className="isDesktop downloadNowContainer">
          <div className="header">Sadhguru App</div>
          <div style={{ minWidth: "30px" }}></div>
          <div
            className="downloadBtn"
            onClick={() =>
              window.location.assign(
                "https://isha.sadhguru.org/in/en/sadhguru-app?_branch_match_id=1347133057715452290&_branch_referrer=H4sIAAAAAAAAA8soKSkottLXL05MyUgvLSrVSywo0MvJzMvWL65MKS%2FWLU9NAgBdw8CkIwAAAA%3D%3D",
              )
            }
          >
            Download Now
          </div>
        </div>
        <div style={{ minHeight: "8px" }}></div>

        {isDesktop ? (
          <div
            className="datePicker"
            style={
              !isDesktop ? { position: "absolute", right: "auto", top: 20 } : {}
            }
          >
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Date Picker"
                value={dayjs(currDate)}
                onChange={(val) =>
                  handleDatePickerChange(dayjs(val).format("YYYY-MM-DD"))
                }
                maxDate={dayjs()}
              />
            </LocalizationProvider>
          </div>
        ) : null}

        {quoteLoading || !quoteArr ? (
          <div className="loader" style={!isDesktop ? { marginTop: 70 } : {}} />
        ) : (
          <div className="carousal">
            <div className="container">
              <input
                type="radio"
                name="slider"
                id="currentInput"
                checked
                onClick={(e) => transitionHandler(e.target.id)}
              />
              <input
                type="radio"
                name="slider"
                id="previousInput"
                onClick={(e) =>  
                  !loading
                    ? transitionHandler(e.target.id)
                    : {}
                }
              />
              <input
                type="radio"
                name="slider"
                id="nextInput"
                onClick={(e) =>  
                  !loading
                    ? transitionHandler(e.target.id)
                    : {}
                }
              />

              <div class="cards">
                {/* {dailyQuoteObjArr?.map((elem) => (
                  <>
                    <input
                      type="radio"
                      name="slider"
                      id={`${elem.id}Input`}
                      checked={elem.id === "current"}
                      onClick={() =>
                        !loading || elem.id === "current"
                          ? transitionHandler(elem.id)
                          : {}
                      }
                    />
                    <label
                      class={`card ${elem.id}`}
                      id={elem.id}
                      for={`${elem.id}Input`}
                      // onClick={() =>
                      //   !loading || elem.id === "current"
                      //     ? transitionHandler(elem.id)
                      //     : {}
                      // }
                      style={
                        elem.id !== "current"
                          ? loading
                            ? { marginTop: 90, cursor: "not-allowed" }
                            : { marginTop: "12vh" }
                          : {
                              filter:
                                "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.5))",
                            }
                      }
                    >
                      {elem.component}
                    </label>
                  </>
                ))} */}

                <label
                  class={`card ${quoteArr[1]?.id}`}
                  id={quoteArr[1]?.id}
                  for={`${quoteArr[1]?.id}Input`}
                  // onClick={() =>
                  //   !loading || elem.id === "current"
                  //     ? transitionHandler(elem.id)
                  //     : {}
                  // }
                  style={{
                    filter: "drop-shadow(5px 5px 15px rgba(0, 0, 0, 0.5))",
                  }}
                >
                  <StoryCard
                    dailyQuoteObj={getComponentObj(
                      quoteArr[1]?.story,
                      quoteArr[1]?.date,
                      currDate,
                    )}
                  />
                </label>
                <label
                  class={`card ${quoteArr[0]?.id}`}
                  id={quoteArr[0]?.id}
                  for={`${quoteArr[0]?.id}Input`}
                  style={
                    loading
                      ? { marginTop: "12vh", cursor: "not-allowed" }
                      : { marginTop: "12vh" }
                  }
                >
                  <StoryCard
                    dailyQuoteObj={getComponentObj(
                      quoteArr[0].story,
                      quoteArr[0].date,
                      currDate,
                    )}
                  />
                </label>
                {quoteArr?.length > 2 ? <label
                  class={`card ${quoteArr[2]?.id}`}
                  id={quoteArr[2]?.id}
                  for={`${quoteArr[2]?.id}Input`}
                  style={
                    loading
                      ? { marginTop: "12vh", cursor: "not-allowed" }
                      : { marginTop: "12vh" }
                  }
                >
                  <StoryCard
                    dailyQuoteObj={getComponentObj(
                      quoteArr[2]?.story,
                      quoteArr[2]?.date,
                      currDate,
                    )}
                  />
                </label>: null}
              </div>
            </div>
          </div>
        )}
        {/* {isVisible ? ( */}
        {/* <div className="isMobile mobileContainer">
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 999,
              }}
            >
              <div
                style={{
                  width: "90%",
                  display: "flex",
                  justifyContent: "space-between",
                  padding: "2px 0px 0px",
                }}
              >
                <div
                  style={{
                    color: "rgb(0, 0, 0)",
                    fontFamily: "OpenSans",
                    fontSize: "16px",
                    fontWeight: "500",
                    padding: "6px 0px 0px",
                  }}
                >
                  Best Experienced on Sadhguru App
                </div>
                <div style={{ minWidth: "10px" }}></div>
                <div
                  onClick={() => setIsVisible(false)}
                  style={{ cursor: "pointer" }}
                >
                  <img
                    src="https://webapp.sadhguru.org/assets/iconCrossClose-0832ef4c.svg"
                    width="32"
                  />
                </div>
              </div>
              <div style={{ minHeight: "2px" }}></div>
              <div className="footerBtn">Download Now</div>
              <div style={{ minHeight: "2px" }}></div>
            </div>
          </div> */}
        {/* ) : null} */}
      </div>
      <div className="isMobile mobileContainer">
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              width: "90%",
              display: "flex",
              justifyContent: "space-between",
              padding: "2px 0px 0px",
            }}
          >
            <div
              style={{
                color: "rgb(0, 0, 0)",
                fontFamily: "OpenSans",
                fontSize: "16px",
                fontWeight: "500",
                padding: "6px 0px 0px",
              }}
            >
              Best Experienced on Sadhguru App
            </div>
            <div style={{ minWidth: "10px" }}></div>
            <div
              onClick={() => setIsVisible(false)}
              style={{ cursor: "pointer" }}
            >
              <img
                src="https://webapp.sadhguru.org/assets/iconCrossClose-0832ef4c.svg"
                width="32"
              />
            </div>
          </div>
          <div style={{ minHeight: "2px" }}></div>
          <div className="footerBtn">Download Now</div>
          <div style={{ minHeight: "2px" }}></div>
        </div>
      </div>
    </div>
  );
};

export default App;
