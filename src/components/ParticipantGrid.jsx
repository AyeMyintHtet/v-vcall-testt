import React from "react";
import { useMeetingAppContext } from "../MeetingAppContextDef";
import { ParticipantView } from "./ParticipantView";
import { useMeeting } from "@videosdk.live/react-sdk";
const MemoizedParticipant = React.memo(
  ParticipantView,
  (prevProps, nextProps) => {
    return prevProps.participantId === nextProps.participantId;
  }
);

function ParticipantGrid({ participantIds, isPresenting }) {
  const { sideBarMode } = useMeetingAppContext();
  const { localParticipant,participants } = useMeeting();
  console.log(Array.from(participants.keys()),'asdfl;kajsdlfkajsf'); 
  console.log(participants, 'participantIds');
  const isMobile = window.matchMedia(
    "only screen and (max-width: 768px)"
  ).matches;
  // Remove duplicates and filter out local participant if present
  const filteredIds = [...new Set(participantIds)].filter(
    (id) => id !== localParticipant?.id
  );

  const perRow =
    isMobile || isPresenting
      ? filteredIds.length < 4
        ? 1
        : filteredIds.length < 9
        ? 2
        : 3
      : filteredIds.length < 5
      ? 2
      : filteredIds.length < 7
      ? 3
      : filteredIds.length < 9
      ? 4
      : filteredIds.length < 10
      ? 3
      : filteredIds.length < 11
      ? 4
      : 4;
  // Precompute rows of filtered participant IDs
  const rows = Array.from({ length: Math.ceil(filteredIds.length / perRow) }, (_, i) =>
    filteredIds.slice(i * perRow, (i + 1) * perRow)
  );

  return (
    <div
      className={`flex flex-col md:flex-row flex-grow m-3 items-center justify-center ${
        participantIds.length < 2 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-2"
          : filteredIds.length < 3 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-8"
          : filteredIds.length < 4 && !sideBarMode && !isPresenting
          ? "md:px-16 md:py-4"
          : filteredIds.length > 4 && !sideBarMode && !isPresenting
          ? "md:px-14"
          : "md:px-0"
      }`}
    >
      <div className="flex flex-col w-full h-full">
        {rows.map((row, i) => {
            console.log(participantIds, perRow, Math.ceil(participantIds.length / perRow),'adsflksd')
            return (
              <div
              key={`participant-row-${i}`}
              className={`flex flex-1 ${
                isPresenting
                  ? filteredIds.length === 1
                    ? "justify-start items-start"
                    : "items-center justify-center"
                  : "items-center justify-center"
              }`}
            >
                {row.map((participantId) => {
                    return (
                      <div
                      key={`participant_${participantId}`}
                        className={`flex flex-1 ${
                          isPresenting
                          ? filteredIds.length === 1
                          ? "md:h-48 md:w-44 xl:w-52 xl:h-48 "
                          : filteredIds.length === 2
                          ? "md:w-44 xl:w-56"
                          : "md:w-44 xl:w-48"
                        : "w-full"
                    } items-center justify-center h-full ${
                      filteredIds.length === 1
                        ? "md:max-w-7xl 2xl:max-w-[1480px] "
                        : "md:max-w-lg 2xl:max-w-2xl"
                    } overflow-clip overflow-hidden  p-1`}
                      >
                        <MemoizedParticipant participantId={participantId} />
                      </div>
                    );
                  })}
              </div>
            );
          }
        )}
      </div>
    </div>
  );
}

export const MemoizedParticipantGrid = React.memo(
  ParticipantGrid,
  (prevProps, nextProps) => {
    return (
      JSON.stringify(prevProps.participantIds) ===
        JSON.stringify(nextProps.participantIds) &&
      prevProps.isPresenting === nextProps.isPresenting
    );
  }
);
