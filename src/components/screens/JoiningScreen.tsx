import React, { useEffect, useMemo, useRef, useState } from "react";
import { MeetingDetailsScreen } from "../MeetingDetailsScreen";
import { createMeeting, getToken, validateMeeting } from "../../api";
import SettingDialogueBox from "../SettingDialogueBox";
import ConfirmBox from "../ConfirmBox";
import { Constants } from "@videosdk.live/react-sdk";
import useIsMobile from "../../hooks/useIsMobile";
import { createPopper } from "@popperjs/core";
import WebcamOffIcon from "../../icons/WebcamOffIcon";
import WebcamOnIcon from "../../icons/Bottombar/WebcamOnIcon";
import MicOffIcon from "../../icons/MicOffIcon";
import MicOnIcon from "../../icons/Bottombar/MicOnIcon";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { Background } from "../ui/Background";
import { GlassCard } from "../ui/GlassCard";
import { Logo } from "../Logo";

interface JoiningScreenProps {
  participantName: string;
  setParticipantName: (name: string) => void;
  setMeetingId: (id: string) => void;
  setToken: (token: string) => void;
  setSelectedMic: React.Dispatch<React.SetStateAction<{ id: string | null }>>;
  setSelectedWebcam: React.Dispatch<React.SetStateAction<{ id: string | null }>>;
  onClickStartMeeting: () => void;
  micEnabled: boolean;
  webcamEnabled: boolean;
  setWebcamOn: (on: boolean) => void;
  setMicOn: (on: boolean) => void;
  setMeetingMode: (mode: "CONFERENCE" | "VIEWER") => void;
  meetingMode: "CONFERENCE" | "VIEWER";
}

export function JoiningScreen({
  participantName,
  setParticipantName,
  setMeetingId,
  setToken,
  setSelectedMic,
  setSelectedWebcam,
  onClickStartMeeting,
  micEnabled,
  webcamEnabled,
  setWebcamOn,
  setMicOn,
  setMeetingMode,
  meetingMode,
}: JoiningScreenProps) {
  const [setting, setSetting] = useState("video");
  const [{ webcams, mics }, setDevices] = useState<{
    devices: MediaDeviceInfo[];
    webcams: MediaDeviceInfo[];
    mics: MediaDeviceInfo[];
  }>({
    devices: [],
    webcams: [],
    mics: [],
  });

  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);

  const [dlgMuted, setDlgMuted] = useState(false);
  const [dlgDevices, setDlgDevices] = useState(false);

  const videoPlayerRef = useRef<HTMLVideoElement>(null);
  const popupVideoPlayerRef = useRef<HTMLVideoElement>(null);

  const videoTrackRef = useRef<MediaStreamTrack | null>(null);
  const audioTrackRef = useRef<MediaStreamTrack | null>(null);
  const audioAnalyserIntervalRef = useRef<NodeJS.Timeout | undefined>();

  const [settingDialogueOpen, setSettingDialogueOpen] = useState(false);

  const [audioTrack, setAudioTrack] = useState<MediaStreamTrack | null>(null);

  const handleClickOpen = () => {
    setSettingDialogueOpen(true);
  };

  const handleClose = () => {
    setSettingDialogueOpen(false);
  };

  const isMobile = useIsMobile();

  const webcamOn = useMemo(() => !!videoTrack, [videoTrack]);
  const micOn = useMemo(() => !!audioTrack, [audioTrack]);

  const _handleTurnOffWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) {
      videoTrack.stop();
      setVideoTrack(null);
      setWebcamOn(false);
    }
  };
  const _handleTurnOnWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (!videoTrack) {
      getDefaultMediaTracks({ mic: false, webcam: true });
      setWebcamOn(true);
    }
  };

  const _toggleWebcam = () => {
    const videoTrack = videoTrackRef.current;

    if (videoTrack) {
      _handleTurnOffWebcam();
    } else {
      _handleTurnOnWebcam();
    }
  };
  const _handleTurnOffMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      audioTrack.stop();

      setAudioTrack(null);
      setMicOn(false);
    }
  };
  const _handleTurnOnMic = () => {
    const audioTrack = audioTrackRef.current;

    if (!audioTrack) {
      getDefaultMediaTracks({ mic: true, webcam: false });
      setMicOn(true);
    }
  };
  const _handleToggleMic = () => {
    const audioTrack = audioTrackRef.current;

    if (audioTrack) {
      _handleTurnOffMic();
    } else {
      _handleTurnOnMic();
    }
  };

  const changeWebcam = async (deviceId: string) => {
    const currentvideoTrack = videoTrackRef.current;

    if (currentvideoTrack) {
      currentvideoTrack.stop();
    }

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { deviceId },
    });
    const videoTracks = stream.getVideoTracks();

    const videoTrack = videoTracks.length ? videoTracks[0] : null;

    setVideoTrack(videoTrack);
  };
  const changeMic = async (deviceId: string) => {
    const currentAudioTrack = audioTrackRef.current;
    currentAudioTrack && currentAudioTrack.stop();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { deviceId },
    });
    const audioTracks = stream.getAudioTracks();

    const audioTrack = audioTracks.length ? audioTracks[0] : null;
    clearInterval(audioAnalyserIntervalRef.current);

    setAudioTrack(audioTrack);
  };

  const getDefaultMediaTracks = async ({ mic, webcam, firstTime }: { mic: boolean; webcam: boolean; firstTime?: boolean }) => {
    if (mic) {
      const audioConstraints = {
        audio: true,
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        audioConstraints
      );
      const audioTracks = stream.getAudioTracks();

      const audioTrack = audioTracks.length ? audioTracks[0] : null;

      setAudioTrack(audioTrack);
      if (firstTime) {
        setSelectedMic({
          id: audioTrack?.getSettings()?.deviceId || "",
        });
      }
    }

    if (webcam) {
      const videoConstraints = {
        video: {
          width: 1280,
          height: 720,
        },
      };

      const stream = await navigator.mediaDevices.getUserMedia(
        videoConstraints
      );
      const videoTracks = stream.getVideoTracks();

      const videoTrack = videoTracks.length ? videoTracks[0] : null;
      setVideoTrack(videoTrack);
      if (firstTime) {
        setSelectedWebcam({
          id: videoTrack?.getSettings()?.deviceId || "",
        });
      }
    }
  };

  async function startMuteListener() {
    const currentAudioTrack = audioTrackRef.current;

    if (currentAudioTrack) {
      if (currentAudioTrack.muted) {
        setDlgMuted(true);
      }

      currentAudioTrack.addEventListener("mute", (ev) => {
        setDlgMuted(true);
      });
    }
  }

  const getDevices = async ({ micEnabled, webcamEnabled }: { micEnabled: boolean; webcamEnabled: boolean }) => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();

      const webcams = devices.filter((d) => d.kind === "videoinput");
      const mics = devices.filter((d) => d.kind === "audioinput");

      const hasMic = mics.length > 0;
      const hasWebcam = webcams.length > 0;

      setDevices({ webcams, mics, devices });

      if (hasMic) {
        startMuteListener();
      }

      getDefaultMediaTracks({
        mic: hasMic && micEnabled,
        webcam: hasWebcam && webcamEnabled,
        firstTime: true,
      });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    audioTrackRef.current = audioTrack;

    startMuteListener();

    return () => {
      const currentAudioTrack = audioTrackRef.current;
      currentAudioTrack && currentAudioTrack.stop();
      audioTrackRef.current = null;
    };
  }, [audioTrack]);

  useEffect(() => {
    if (meetingMode === Constants.modes.VIEWER) {
      _handleTurnOffMic();
      _handleTurnOffWebcam();
    }
  }, [meetingMode]);

  useEffect(() => {
    videoTrackRef.current = videoTrack;

    if (videoTrack) {
      const videoSrcObject = new MediaStream([videoTrack]);

      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = videoSrcObject;
        videoPlayerRef.current.play();
      }

      setTimeout(() => {
        if (popupVideoPlayerRef.current) {
          popupVideoPlayerRef.current.srcObject = videoSrcObject;
          popupVideoPlayerRef.current.play();
        }
      }, 1000);
    } else {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.srcObject = null;
      }
      if (popupVideoPlayerRef.current) {
        popupVideoPlayerRef.current.srcObject = null;
      }
    }
  }, [videoTrack, setting, settingDialogueOpen]);

  useEffect(() => {
    getDevices({ micEnabled, webcamEnabled });
  }, []);

  const ButtonWithTooltip = ({ onClick, onState, OnIcon, OffIcon, mic }: { onClick: () => void; onState: boolean; OnIcon: any; OffIcon: any; mic: boolean }) => {
    const [tooltipShow, setTooltipShow] = useState(false);
    const btnRef = useRef<HTMLButtonElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const openTooltip = () => {
      if (btnRef.current && tooltipRef.current) {
        createPopper(btnRef.current, tooltipRef.current, {
          placement: "top",
        });
        setTooltipShow(true);
      }
    };
    const closeTooltip = () => {
      setTooltipShow(false);
    };

    return (
      <>
        <div>
          <button
            ref={btnRef}
            onMouseEnter={openTooltip}
            onMouseLeave={closeTooltip}
            onClick={onClick}
            className={`rounded-full min-w-auto w-11 h-11 flex items-center justify-center ${onState ? "bg-white" : "bg-red-650 text-white"
              }`}
            disabled={meetingMode === Constants.modes.VIEWER}
          >
            {onState ? (
              <OnIcon fillcolor={onState ? "#050A0E" : "#fff"} />
            ) : (
              <OffIcon fillcolor={onState ? "#050A0E" : "#fff"} />
            )}
          </button>
        </div>
        <div
          style={{ zIndex: 999 }}
          className={`${tooltipShow ? "" : "hidden"
            } overflow-hidden flex flex-col items-center justify-center pb-1.5`}
          ref={tooltipRef}
        >
          <div className={"rounded-md p-1.5 bg-black "}>
            <p className="text-base text-white ">
              {onState
                ? `Turn off ${mic ? "mic" : "webcam"}`
                : `Turn on ${mic ? "mic" : "webcam"}`}
            </p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden">
      <Background />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center p-4 gap-8 md:gap-16">

        {/* Left Section: Branding & Controls */}
        <div className="flex flex-col items-center md:items-start w-full max-w-md gap-8 z-10 animate-fade-in">
          <div className="flex flex-col items-center md:items-start gap-4">
            <Logo variant="full" className="scale-125 origin-left" />
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                Premium <span className="text-brand-500">Video</span>
              </h1>
              <p className="text-gray-400 mt-2 text-lg">
                Connect with crystal clear audio and video.
              </p>
            </div>
          </div>

          <GlassCard className="w-full">
            <MeetingDetailsScreen
              participantName={participantName}
              setParticipantName={setParticipantName}
              videoTrack={videoTrack}
              setVideoTrack={setVideoTrack}
              onClickStartMeeting={onClickStartMeeting}
              onClickJoin={async (id) => {
                const token = await getToken();
                const valid = await validateMeeting({
                  roomId: id,
                  token: token || "",
                });

                if (valid) {
                  setToken(token || "");
                  setMeetingId(id);
                  if (videoTrack) {
                    videoTrack.stop();
                    setVideoTrack(null);
                  }
                  onClickStartMeeting();
                  setParticipantName("");
                } else alert("Invalid Meeting Id");
              }}
              _handleOnCreateMeeting={async () => {
                const token = await getToken();
                const _meetingId = await createMeeting({ token: token || "" });
                setToken(token || "");
                setMeetingId(_meetingId || "");
                setParticipantName("");
                return _meetingId || "";
              }}
            />
          </GlassCard>
        </div>

        {/* Right Section: Video Preview */}
        <div className="w-full max-w-lg z-10 animate-slide-up">
          <GlassCard className="p-0 overflow-hidden relative aspect-video bg-black/40 ring-1 ring-white/10 shadow-2xl">
            <div className="w-full h-full relative group">
              <video
                autoPlay
                playsInline
                muted
                ref={videoPlayerRef}
                controls={false}
                className="w-full h-full object-cover flip"
                style={{ backgroundColor: "#1c1c1c", transform: "scaleX(-1)" }}
              />

              {!isMobile && !webcamOn && (
                <div className="absolute inset-0 flex items-center justify-center bg-dark-800/80 backdrop-blur-sm">
                  <p className="text-gray-400 font-medium">Camera is off</p>
                </div>
              )}

              {/* Settings Button */}
              {meetingMode === Constants.modes.CONFERENCE && (
                <button
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 text-white backdrop-blur-md transition-all"
                  onClick={handleClickOpen}
                >
                  <CheckCircleIcon className="h-6 w-6" />
                </button>
              )}

              {/* Bottom Controls */}
              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-4">
                <div className="flex gap-4 p-3 rounded-2xl bg-black/50 backdrop-blur-md border border-white/10">
                  <ButtonWithTooltip
                    onClick={_handleToggleMic}
                    onState={micOn}
                    mic={true}
                    OnIcon={MicOnIcon}
                    OffIcon={MicOffIcon}
                  />
                  <ButtonWithTooltip
                    onClick={_toggleWebcam}
                    onState={webcamOn}
                    mic={false}
                    OnIcon={WebcamOnIcon}
                    OffIcon={WebcamOffIcon}
                  />
                </div>
              </div>

              {/* Settings Dialog Modal */}
              {settingDialogueOpen && (
                <SettingDialogueBox
                  open={settingDialogueOpen}
                  onClose={handleClose}
                  popupVideoPlayerRef={popupVideoPlayerRef}
                  changeWebcam={changeWebcam}
                  changeMic={changeMic}
                  setting={setting}
                  setSetting={setSetting}
                  webcams={webcams}
                  mics={mics}
                  setSelectedMic={setSelectedMic}
                  setSelectedWebcam={setSelectedWebcam}
                  videoTrack={videoTrack}
                  audioTrack={audioTrack}
                />
              )}
            </div>
          </GlassCard>

          <div className="mt-4 text-center">
            <p className="text-sm text-gray-500">
              {isMobile ? "Tap buttons to toggle" : "Check your settings before joining"}
            </p>
          </div>
        </div>
      </div>
      <ConfirmBox
        open={dlgMuted}
        successText="OKAY"
        onSuccess={() => {
          setDlgMuted(false);
        }}
        title="System mic is muted"
        subTitle="You're default microphone is muted, please unmute it or increase audio
            input volume from system settings."
      />

      <ConfirmBox
        open={dlgDevices}
        successText="DISMISS"
        onSuccess={() => {
          setDlgDevices(false);
        }}
        title="Mic or webcam not available"
        subTitle="Please connect a mic and webcam to speak and share your video in the meeting. You can also join without them."
      />
    </div>
  );
}
