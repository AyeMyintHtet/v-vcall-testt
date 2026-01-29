import React, { useMemo } from "react";
import { useMeeting } from "@videosdk.live/react-sdk";
import { MemoizedParticipantGrid } from "../../components/ParticipantGrid";

interface ParticipantsViewerProps {
  isPresenting: boolean;
}

function ParticipantsViewer({ isPresenting }: ParticipantsViewerProps) {
  const {
    participants,
    pinnedParticipants,
    activeSpeakerId,
    localParticipant,
    localScreenShareOn,
    presenterId,
  } = useMeeting();

  const participantIds = useMemo(() => {
    const pinnedParticipantId = [...pinnedParticipants.keys()].filter(
      (participantId) => {
        return participantId != localParticipant?.id;
      }
    );
    const regularParticipantIds = [...participants.keys()].filter(
      (participantId) => {
        return (
          ![...pinnedParticipants.keys()].includes(participantId) &&
          localParticipant?.id != participantId &&
          !participants.get(participantId)?.local
        );
      }
    );

    const ids = Array.from(
      new Set([
        localParticipant?.id,
        ...pinnedParticipantId,
        ...regularParticipantIds,
      ])
    )
      .filter((id) => id)
      .slice(0, isPresenting ? 6 : 16);

    if (activeSpeakerId) {
      if (!ids.includes(activeSpeakerId)) {
        ids[ids.length - 1] = activeSpeakerId;
      }
    }

    // console.log("Participant Debug:", { 
    //   localId: localParticipant?.id, 
    //   participants: [...participants.keys()],
    //   regularParticipantIds,
    //   finalIds: ids 
    // });

    return ids;
  }, [
    participants,
    activeSpeakerId,
    pinnedParticipants,
    presenterId,
    localScreenShareOn,
    localParticipant,
  ]);

  return (
    <MemoizedParticipantGrid
      participantIds={participantIds}
      isPresenting={isPresenting}
    />
  );
}

const MemorizedParticipantView = React.memo(
  ParticipantsViewer,
  (prevProps, nextProps) => {
    return prevProps.isPresenting === nextProps.isPresenting;
  }
);

export default MemorizedParticipantView;
