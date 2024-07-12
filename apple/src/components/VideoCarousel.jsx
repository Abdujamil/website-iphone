import { useState, useRef, useEffect } from "react";
import { hightlightsSlides } from "../constants";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { pauseImg, playImg, replayImg } from "../utils";
import { useGSAP } from "@gsap/react";

export default function VideoCarousel() {
  const videoRef = useRef([]);
  const videoSpanRef = useRef([]);
  const videoDivRef = useRef([]);

  const [videoDuration, setVideoDuration] = useState({
    isEnd: false,
    startPlay: false,
    videoId: 0,
    isLastVideo: false,
    isPlaying: false,
  });

  const { isEnd, startPlay, videoId, isLastVideo, isPlaying } = videoDuration;

  
  useGSAP(() => {
    gsap.registerPlugin(ScrollTrigger);
    gsap.to("#video", {
      scrollTrigger: {
        trigger: "#video",
        toggleActions: "restart none none none",
      },
      onComplete: () => {
        setVideoDuration((prev) => ({
          ...prev,
          startPlay: true,
          isPlaying: true,
        }));
      },
    });
  }, [isEnd, videoId]);

  const [loadedData, setLoadedData] = useState([]);

  useEffect(() => {
    if (loadedData.length > 3) {
      if (!isPlaying) {
        videoRef.current[videoId].pause();
      } else {
        startPlay && videoRef.current[videoId].play();
      }
    }
  }, [startPlay, videoId, isPlaying, loadedData]);

  const handleLoadedMetadata = (id, e) => {
    setLoadedData((prev) => [...prev, e]);
  };

  useEffect(() => {
    let currentProgress = 0;
    let span = videoSpanRef.current;

    if (span[videoId]) {
      let anim = gsap.to(span[videoId], {
        onUpdate: () => {
          const progress = Math.ceil(anim.progress() * 100);
          if (progress >= currentProgress) {
            currentProgress = progress;

            gsap.to(videoDivRef.current[videoId], {
              width:
                window.innerWidth < 760 ? `10vw` : window.innerWidth < 1200 ? "10vw" : "4vw",
            });

            gsap.to(span[videoId], {
              width: `${currentProgress}%`,
              backgroundColor: "white",
            });
          }
        },
        onComplete: () => {
          if (isPlaying) {
            gsap.to(videoDivRef.current[videoId], {
              width: "12px",
            });
            gsap.to(span[videoId], {
              backgroundColor: "#afafaf",
            });
          }
        },
      });

      if (videoId === 0) {
        anim.restart();
      }

      const animUpdate = () => {
        anim.progress(
          videoRef.current[videoId].currentTime / hightlightsSlides[videoId].videoDuration
        );
      };

      if (isPlaying) {
        gsap.ticker.add(animUpdate);
      } else {
        gsap.ticker.remove(animUpdate);
      }
    }
  }, [videoId, startPlay]);

  const handlProgress = (type, i) => {
    switch (type) {
      case "video-end":
        setVideoDuration((prevVideo) => ({
          ...prevVideo,
          isEnd: true,
          videoId: i + 1,
          startPlay: false,
          isLastVideo: true,
          isPlaying: false,
        }));
        break;

      case "video-last":
        setVideoDuration((prev) => ({
          ...prev,
          isLastVideo: true,
        }));
        break;

      case "video-reset":
        setVideoDuration((prev) => ({
          ...prev,
          isLastVideo: false,
          videoId: 0,
        }));
        break;

      case "play":
        setVideoDuration((prev) => ({
          ...prev,
          isPlaying: !prev,
        }));
        break;

      default:
        return videoDuration;
    }
  };

  return (
    <>
      <div className="flex items-center">
        {hightlightsSlides.map((slide, id) => (
          <div key={id} id="slider" className="sm:pr-20 pr-10">
            <div className="video-carousel_container">
              <div className="w-full h-full flex-center rounded-3xl overflow-hidden bg-black">
                <video
                  id="video"
                  playsInline={true}
                  preload="auto"
                  muted
                  ref={(el) => (videoRef.current[id] = el)}
                  onPlay={() =>
                    setVideoDuration((prevVideo) => ({
                      ...prevVideo,
                      isPlaying: true,
                    }))
                  }
                  onLoadedMetadata={(e) => handleLoadedMetadata(id, e)}
                >
                  <source src={slide.video} type="video/mp4" />
                </video>
              </div>
              <div className="absolute top-12 left-[5%] z-10">
                {slide.textLists.map((text) => (
                  <p key={text} className="md:text-2xl text-xl font-medium">
                    {text}
                  </p>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="relative flex-center  mt-10">
        <div className="flex-center py-5 px-7 bg-gray-300 backdrop-blur rounded-full">
          {videoRef.current.map((_, id) => (
            <span
              key={id}
              ref={(el) => (videoDivRef.current[id] = el)}
              className="mx-2 w-3 h-3 bg-gray-200 rounded-full cursor-pointer relative"
            >
              <span
                className="absolute w-full h-full rounded-full"
                ref={(el) => (videoSpanRef.current[id] = el)}
              />
            </span>
          ))}
        </div>

        <button className="control-btn">
          <img
            src={isLastVideo ? replayImg : !isPlaying ? playImg : pauseImg}
            alt={isLastVideo ? "Replay" : !isPlaying ? "Play" : "Pause"}
            onClick={
              isLastVideo
                ? () => handlProgress("video-reset")
                : !isPlaying
                ? () => handlProgress("play")
                : () => handlProgress("pause")
            }
          />
        </button>
      </div>
    </>
  );
}
