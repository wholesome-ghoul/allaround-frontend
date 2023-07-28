function canvasToBlobAsync(canvas: HTMLCanvasElement) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(blob);
      } else {
        reject(new Error('Failed to convert canvas to blob.'));
      }
    });
  });
}
const getFirstFrameOfVideo = async (video: HTMLVideoElement)=> {
  const canvas = document.createElement('canvas');
const maxWidth = 1280;
    const originalWidth = video.videoWidth;
    const originalHeight = video.videoHeight;

    // Calculate the width and height with 16:9 aspect ratio and maximum width
    let width, height;
    if (originalWidth / originalHeight >= 16 / 9) {
      width = Math.min(originalWidth, maxWidth);
      height = (width * 9) / 16;
    } else {
      height = Math.min(originalHeight, (maxWidth * 9) / 16);
      width = (height * 16) / 9;
    }

  canvas.width = width
  canvas.height = height
  
  canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);
  return await canvasToBlobAsync(canvas);
}

export default getFirstFrameOfVideo;
