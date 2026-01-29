import React, { useEffect, useRef, useState } from "react";
import animationData from "../../../src/static/animations/join_meeting.json";
import Lottie from "lottie-react";
import useIsTab from "../../hooks/useIsTab";
import useIsMobile from "../../hooks/useIsMobile";
import { Background } from "../ui/Background";

const WaitingToJoinScreen = () => {
  const waitingMessages = [
    { index: 0, text: "Creating a room for you..." },
    { index: 1, text: "Almost there..." },
  ];
  const [message, setMessage] = useState(waitingMessages[0]);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setMessage((s) =>
        s.index === waitingMessages.length - 1
          ? s
          : waitingMessages[s.index + 1]
      );
    }, 3000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const isTab = useIsTab();
  const isMobile = useIsMobile();

  const animationDefaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center overflow-hidden">
      <Background />
      <div className="flex flex-col items-center gap-6 z-10 glass-panel p-12 rounded-2xl animate-pulse-slow">
        <div
          style={{
            height: isTab ? 200 : isMobile ? 200 : 250,
            width: isTab ? 200 : isMobile ? 200 : 250,
          }}
        >
          <Lottie
            loop={animationDefaultOptions.loop}
            autoplay={animationDefaultOptions.autoplay}
            animationData={animationDefaultOptions.animationData}
            rendererSettings={{
              preserveAspectRatio:
                animationDefaultOptions.rendererSettings.preserveAspectRatio,
            }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
        <h1 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
          {message.text}
        </h1>
      </div>
    </div>
  );
};

export default WaitingToJoinScreen;
