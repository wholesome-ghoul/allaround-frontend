import { ReturnSignedUrl as SignedUrl } from "./get-presigned-urls";

type UploadChunks = {
  signedUrls: SignedUrl[];
  chunkCount: number;
  chunkSize: number;
  video: File;
  setCurrentProgress: (progress: number) => void;
};

const uploadWithRetry = async (
  partNumber: number,
  signedUrl: string,
  chunk: Blob,
  signal: AbortSignal | null = null,
  retryCount = 0
): Promise<string> => {
  try {
    const response = await fetch(signedUrl, {
      method: "PUT",
      body: chunk,
      signal,
    });

    const etag = response.headers.get("ETag");

    return etag ?? "";
  } catch (error) {
    if (retryCount > 5) {
      throw new Error(`Failed to upload part ${partNumber}`);
    }

    console.log(`Retrying part ${partNumber}`);
    return uploadWithRetry(
      partNumber,
      signedUrl,
      chunk,
      signal,
      retryCount + 1
    );
  }
};

const updateProgress = (
  percentComplete: number,
  chunkCount: number,
  setCurrentProgress: (progress: number) => void
) => {
  percentComplete += 100 / chunkCount;
  percentComplete = parseFloat(percentComplete.toFixed(2));

  if (percentComplete > 99) {
    percentComplete = 99;
  }

  setCurrentProgress(percentComplete);

  return percentComplete;
};

const uploadChunks = async ({
  video,
  signedUrls,
  chunkCount,
  chunkSize,
  setCurrentProgress,
}: UploadChunks): Promise<string[]> => {
  let percentComplete = 0;
  const concurrencyLimit = 8;

  const getEtag = async (promise: Promise<string>) => {
    const etag = await promise;

    percentComplete = updateProgress(
      percentComplete,
      chunkCount,
      setCurrentProgress
    );

    return etag;
  };

  let abortControllers: AbortController[] = [];
  async function* promises() {
    let runningTasks = [];

    try {
      for (const signedUrlO of signedUrls) {
        const { signedUrl, PartNumber } = signedUrlO;
        const chunk = video.slice(
          (PartNumber - 1) * chunkSize,
          PartNumber * chunkSize
        );

        const abortController = new AbortController();
        const signal = abortController.signal;
        const promise = uploadWithRetry(PartNumber, signedUrl, chunk, signal);
        runningTasks.push(promise);
        abortControllers.push(abortController);

        if (runningTasks.length >= concurrencyLimit) {
          const etags = runningTasks.map(getEtag);

          runningTasks = [];

          yield await Promise.all(etags);
        }
      }

      const etags = runningTasks.map(getEtag);
      yield await Promise.all(etags);
    } catch (e) {
      abortControllers.forEach((abortController) => {
        abortController.abort();
      });
      throw new Error(e as any);
    }
  }

  const promisedEtags = [];
  for await (const promise of promises()) {
    promisedEtags.push(promise);
  }

  return promisedEtags.flat();
};

export default uploadChunks;
