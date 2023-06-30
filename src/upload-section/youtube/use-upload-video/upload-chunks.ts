import { ReturnSignedUrl as SignedUrl } from "./get-presigned-urls";

type UploadChunks = {
  signedUrls: SignedUrl[];
  chunkSize: number;
  video: File;
};

const uploadChunk = ({ url, partNumber, chunk }: any) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener("progress", (e) => {
      const progress = (e.loaded / e.total) * 100;
      console.log(`Progress for Part ${partNumber}: ${Math.round(progress)}`);
    });

    xhr.addEventListener("load", () => {
      if (xhr.status < 300) {
        resolve(xhr.response);
      } else {
        reject(xhr.statusText);
      }
    });

    xhr.open("PUT", url);
    xhr.send(chunk);
  });
};

const uploadChunks = async ({ video, signedUrls, chunkSize }: UploadChunks) => {
  const promises: any[] = [];

  const uploadedPartSizes: number[] = []
  signedUrls.forEach(async({signedUrl, PartNumber}) =>{
    const chunk = video.slice((PartNumber - 1) * chunkSize, PartNumber * chunkSize);
    const formData = new FormData();
    formData.append("file", chunk);

    const response = await fetch(signedUrl, {
      method: "PUT",
      body: formData,
    });

    const uploadedPartSize = response.headers.get("Content-Length");
    uploadedPartSizes.push(Number(uploadedPartSize));

    const totalUploadedSize = uploadedPartSizes.reduce((a, b) => a + b, 0);
    const progress = (totalUploadedSize / video.size) * 100;

    // console.log(`Progress for Part ${PartNumber}: ${Math.round(progress)}`);
    console.log(`${PartNumber} done`);
  })

  // for (let i = 0; i < signedUrls.length; i++) {
  //   const url = signedUrls[i].signedUrl;

  //   const start = i * chunkSize;
  //   const end = Math.min(video.size, start + chunkSize);
  //   const videoChunk = video.slice(start, end);

  //   const chunkPromise = uploadChunk({
  //     url,
  //     partNumber: signedUrls[i].PartNumber,
  //     chunk: videoChunk,
  //   });

  //   promises.push(chunkPromise);
  // }

  let responses: any[] = [];
  try {
    responses = await Promise.all(promises);
    console.log(responses);
  } catch (e) {
    console.error(e);
  }

  return responses;
};

export default uploadChunks;
