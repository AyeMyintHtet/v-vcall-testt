import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import React, { useState } from "react";

interface MeetingDetailsScreenProps {
  onClickJoin: (meetingId: string) => void;
  _handleOnCreateMeeting: () => Promise<string>;
  participantName: string;
  setParticipantName: (name: string) => void;
  videoTrack: MediaStreamTrack | null;
  setVideoTrack: (track: MediaStreamTrack | null) => void;
  onClickStartMeeting: () => void;
}

export function MeetingDetailsScreen({
  onClickJoin,
  _handleOnCreateMeeting,
  participantName,
  setParticipantName,
  videoTrack,
  setVideoTrack,
  onClickStartMeeting,
}: MeetingDetailsScreenProps) {
  const [meetingId, setMeetingId] = useState("");
  const [meetingIdError, setMeetingIdError] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [iscreateMeetingClicked, setIscreateMeetingClicked] = useState(false);
  const [isJoinMeetingClicked, setIsJoinMeetingClicked] = useState(false);

  return (
    <div
      className={`flex flex-1 flex-col justify-center w-full md:p-[6px] sm:p-1 p-1.5`}
    >
      {iscreateMeetingClicked ? (
        <div className="glass-light rounded-xl px-4 py-3 flex items-center justify-center border-brand-500/30">
          <p className="text-white text-base font-medium">
            {`Meeting code : ${meetingId}`}
          </p>
          <button
            className="ml-2 hover:scale-110 transition-transform"
            onClick={() => {
              navigator.clipboard.writeText(meetingId);
              setIsCopied(true);
              setTimeout(() => {
                setIsCopied(false);
              }, 3000);
            }}
          >
            {isCopied ? (
              <CheckIcon className="h-5 w-5 text-green-400" />
            ) : (
              <ClipboardIcon className="h-5 w-5 text-white" />
            )}
          </button>
        </div>
      ) : isJoinMeetingClicked ? (
        <>
          <input
            defaultValue={meetingId}
            onChange={(e) => {
              setMeetingId(e.target.value);
            }}
            placeholder={"Enter meeting Id"}
            className="px-4 py-3 glass-light rounded-xl text-white w-full text-center placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />
          {meetingIdError && (
            <p className="text-xs text-red-600 mt-2">{`Please enter valid meetingId`}</p>
          )}
        </>
      ) : null}

      {(iscreateMeetingClicked || isJoinMeetingClicked) && (
        <>
          <input
            value={participantName}
            onChange={(e) => setParticipantName(e.target.value)}
            placeholder="Enter your name"
            className="px-4 py-3 mt-5 glass-light rounded-xl text-white w-full text-center placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all"
          />

          <button
            disabled={participantName.length < 3}
            className={`w-full ${participantName.length < 3
                ? "bg-gray-600 cursor-not-allowed opacity-50"
                : "bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 shadow-lg shadow-brand-500/30"
              }  text-white px-2 py-3 rounded-xl mt-5 font-bold tracking-wide transition-all duration-300 transform hover:-translate-y-0.5`}
            onClick={(e) => {
              if (iscreateMeetingClicked) {
                if (videoTrack) {
                  videoTrack.stop();
                  setVideoTrack(null);
                }
                onClickStartMeeting();
              } else {
                if (meetingId.match("\\w{4}\\-\\w{4}\\-\\w{4}")) {
                  onClickJoin(meetingId);
                } else setMeetingIdError(true);
              }
            }}
          >
            {iscreateMeetingClicked ? "Start a meeting" : "Join a meeting"}
          </button>
        </>
      )}

      {!iscreateMeetingClicked && !isJoinMeetingClicked && (
        <div className="w-full md:mt-0 mt-4 flex flex-col gap-4">
          <div className="flex items-center justify-center flex-col w-full gap-4">
            <button
              className="w-full bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-400 hover:to-brand-500 text-white px-2 py-4 rounded-xl font-bold shadow-lg shadow-brand-500/20 transition-all duration-300 transform hover:-translate-y-1"
              onClick={async (e) => {
                const meetingId = await _handleOnCreateMeeting();
                setMeetingId(meetingId);
                setIscreateMeetingClicked(true);
              }}
            >
              Create a meeting
            </button>
            <button
              className="w-full glass-light hover:bg-white/10 text-white px-2 py-4 rounded-xl font-semibold transition-all duration-300"
              onClick={(e) => {
                setIsJoinMeetingClicked(true);
              }}
            >
              Join a meeting
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
