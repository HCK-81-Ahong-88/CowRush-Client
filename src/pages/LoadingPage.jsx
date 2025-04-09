import React, { useState, useEffect } from "react";

function LoadingPage() {
  const images = ["/Cow1.png", "/Cow2.png"];
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setActiveIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [images.length]);

  return (
    <>
      <style>{`
        .cow-img {
          width: 150px;
          transition: opacity 0.5s;
        }
      `}</style>
      <div className="container text-center d-flex flex-column justify-content-center align-items-center vh-100">
        <div className="row align-items-center">
          <div className="col">
            <img src={images[activeIndex]} alt="Cow Left" className="cow-img" />
          </div>
          <div className="col my-auto">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
          <div className="col">
            <img
              src={images[(activeIndex + 1) % images.length]}
              alt="Cow Right"
              className="cow-img"
            />
          </div>
        </div>
      </div>
    </>
  );
}

export default LoadingPage;
