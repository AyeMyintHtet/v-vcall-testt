import {
  useContext,
  createContext,
  useState,
  useEffect,
  useRef,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";

interface RaisedHandParticipant {
  participantId: string;
  raisedHandOn: number;
}

interface MeetingAppContextType {
  raisedHandsParticipants: RaisedHandParticipant[];
  sideBarMode: string | null;
  pipMode: boolean;
  setRaisedHandsParticipants: Dispatch<SetStateAction<RaisedHandParticipant[]>>;
  setSideBarMode: Dispatch<SetStateAction<string | null>>;
  setPipMode: Dispatch<SetStateAction<boolean>>;
  useRaisedHandParticipants: () => {
    participantRaisedHand: (participantId: string) => void;
  };
  selectedMic: { id: string | null };
  selectedWebcam: { id: string | null };
  initialMicOn: boolean;
  initialWebcamOn: boolean;
}

export const MeetingAppContext = createContext<MeetingAppContextType | null>(
  null
);

export const useMeetingAppContext = (): MeetingAppContextType => {
  const context = useContext(MeetingAppContext);
  if (!context) {
    throw new Error(
      "useMeetingAppContext must be used within a MeetingAppProvider"
    );
  }
  return context;
};

interface MeetingAppProviderProps {
  children: ReactNode;
  selectedMic: { id: string | null };
  selectedWebcam: { id: string | null };
  initialMicOn: boolean;
  initialWebcamOn: boolean;
}

export const MeetingAppProvider = ({
  children,
  selectedMic,
  selectedWebcam,
  initialMicOn,
  initialWebcamOn,
}: MeetingAppProviderProps) => {
  const [raisedHandsParticipants, setRaisedHandsParticipants] = useState<
    RaisedHandParticipant[]
  >([]);
  const [sideBarMode, setSideBarMode] = useState<string | null>(null);
  const [pipMode, setPipMode] = useState(false);

  const useRaisedHandParticipants = () => {
    const raisedHandsParticipantsRef = useRef<RaisedHandParticipant[]>([]);

    const participantRaisedHand = (participantId: string) => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const newItem = { participantId, raisedHandOn: new Date().getTime() };

      const participantFound = raisedHandsParticipants.findIndex(
        ({ participantId: pID }) => pID === participantId
      );

      if (participantFound === -1) {
        raisedHandsParticipants.push(newItem);
      } else {
        raisedHandsParticipants[participantFound] = newItem;
      }

      setRaisedHandsParticipants(raisedHandsParticipants);
    };

    useEffect(() => {
      raisedHandsParticipantsRef.current = raisedHandsParticipants;
    }, [raisedHandsParticipants]);

    const _handleRemoveOld = () => {
      const raisedHandsParticipants = [...raisedHandsParticipantsRef.current];

      const now = new Date().getTime();

      const persisted = raisedHandsParticipants.filter(({ raisedHandOn }) => {
        return raisedHandOn + 15000 > now;
      });

      if (raisedHandsParticipants.length !== persisted.length) {
        setRaisedHandsParticipants(persisted);
      }
    };

    useEffect(() => {
      const interval = setInterval(_handleRemoveOld, 1000);

      return () => {
        clearInterval(interval);
      };
    }, []);

    return { participantRaisedHand };
  };

  return (
    <MeetingAppContext.Provider
      value={{
        // states
        raisedHandsParticipants,
        sideBarMode,
        pipMode,
        selectedMic,
        selectedWebcam,
        initialMicOn,
        initialWebcamOn,

        // setters
        setRaisedHandsParticipants,
        setSideBarMode,
        setPipMode,
        useRaisedHandParticipants,
      }}
    >
      {children}
    </MeetingAppContext.Provider>
  );
};
