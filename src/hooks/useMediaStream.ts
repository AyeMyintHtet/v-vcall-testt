import { createCameraVideoTrack } from "@videosdk.live/react-sdk";
import { useMeetingAppContext } from "../MeetingAppContextDef";

const useMediaStream = () => {
  const { selectedWebcam } = useMeetingAppContext();

  const getVideoTrack = async ({
    webcamId,
    encoderConfig,
  }: {
    webcamId?: string;
    encoderConfig?: any;
  }) => {
    try {
      const track = await createCameraVideoTrack({
        cameraId: (webcamId ? webcamId : selectedWebcam.id) || undefined,
        encoderConfig: encoderConfig ? encoderConfig : "h540p_w960p",
        optimizationMode: "motion",
        multiStream: false,
      });

      return track;
    } catch (error) {
      return null;
    }
  };

  return { getVideoTrack };
};

export default useMediaStream;
