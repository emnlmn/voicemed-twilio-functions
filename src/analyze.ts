import got from "got";
import {
  Context,
  ServerlessCallback,
  ServerlessFunctionSignature,
} from "@twilio-labs/serverless-runtime-types/types";

type RequestParameters = {
  callSid: string,
  isInfected: string,
  isSmoker: string,
  hasFever: string,
  hasHeadache: string,
  clearThroatRecordingUrl: string,
  coughRecordingUrl: string,
  deepBreathRecordingUrl: string,
  clearThroatRecordingDuration: string,
  coughRecordingDuration: string,
  deepBreathRecordingDuration: string,
};

type AnalyzeRequestBody = {
  audioFiles: string[],
}

const isDataValid = (event: any): boolean => {
  return event.clearThroatRecordingUrl && event.coughRecordingUrl && event.deepBreathRecordingUrl;
}

const buildRequest = (event: RequestParameters): AnalyzeRequestBody => {
  return {
    audioFiles: [
      event.clearThroatRecordingUrl,
      event.clearThroatRecordingUrl,
      event.deepBreathRecordingUrl
    ]
  };
}

const adaptResponseToIVRText = (body: any) => "low chance of having symptoms of COVID-19";

export const handler: ServerlessFunctionSignature<{}, RequestParameters> = async (
  context: Context,
  event: RequestParameters,
  callback: ServerlessCallback
) => {
  if (!isDataValid(event)) {
    console.error("Some data is missing. Please check the invocation parameters.");
    return callback("Data is not valid, please provide all the fields");
  }

  console.debug("Event data", JSON.stringify(event));

  try {
    console.debug(`Ready to start a POST request to ${process.env.VOICEMED_API}/analyze`);
    console.debug(`Request body`, JSON.stringify(buildRequest(event)));

    // const response = await got.post(`${process.env.VOICEMED_API}/analyze`, {
    //   json: true,
    //   body: buildRequest(event),
    //   headers: {
    //     accept: "application/json"
    //   },
    // });

    const diagnosis = adaptResponseToIVRText({});

    console.debug("Response text", diagnosis);

    callback(null, { diagnosis });
  } catch (e) {
    console.error("VoiceMed analyze api error", e);
    return callback("VoiceMed api returned an error");
  }

};