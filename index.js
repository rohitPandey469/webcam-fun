let video;
let canvas;
let context;
let strip;
let snap;
window.onload = function () {
  video = document.querySelector(".player");
  canvas = document.querySelector(".photo");
  context = canvas.getContext("2d");
  strip = document.querySelector(".strip");
  snap = document.querySelector(".snap");
  video.addEventListener("canplay", paintToCanvas);
  // getVideo();
};
function getVideo() {
  navigator.mediaDevices
    .getUserMedia({ video: true, audio: false })
    .then((localMediaStream) => {
      console.log(localMediaStream);
      // video.src = URL.createObjectURL(localMediaStream);
      // converting object into URL and then assigning to video
      video.srcObject = localMediaStream;
      video.play();
    })
    .catch((err) => {
      console.error("OH NO!", err);
      alert(
        "Hey! why you denied the access to your camera, it won't work now..."
      );
    });
}
function paintToCanvas() {
  const width = video.videoWidth;
  const height = video.videoHeight;
  canvas.width = width;
  canvas.height = height;

  return setInterval(() => {
    context.drawImage(video, 0, 0, width, height);
    // take the pixels out
    let pixels = context.getImageData(0, 0, width, height);

    // mess with them
    // pixels = redEffect(pixels);
    // pixels = rgbSplit(pixels);
    // context.globalAlpha=0.1;
    pixels=greeScreen(pixels);
    // set it again
    context.putImageData(pixels, 0, 0);
  }, 19);
}

function takePhoto() {
  snap.currentTime = 0;
  snap.play();

  const data = canvas.toDataURL("image/jpeg");
  const link = document.createElement("a");
  link.href = data;
  link.setAttribute("download", "YourImg");
  // link.textContent = "Download Image";
  link.innerHTML = `<img src="${data}" alt="your image"/>`;
  strip.insertBefore(link, strip.firstChild);
  console.log(data);
}
getVideo();
function redEffect(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i] = pixels.data[i + 0] + 200; //RED
    pixels.data[i + 1] = pixels.data[i + 1] - 50; //GREEN
    pixels.data[i + 2] = pixels.data[i + 2] * 0.5; //BLUE
  }
  return pixels;
}

function rgbSplit(pixels) {
  for (let i = 0; i < pixels.data.length; i += 4) {
    pixels.data[i-150] = pixels.data[i + 0];
    pixels.data[i + 500] = pixels.data[i + 1];
    pixels.data[i -550] = pixels.data[i + 2];
  }
  return pixels;
}
function greeScreen(pixels){
  const levels = {};

  document.querySelectorAll('.rgb input').forEach((input) => {
    levels[input.name] = input.value;
  });

  for (i = 0; i < pixels.data.length; i = i + 4) {
    red = pixels.data[i + 0];
    green = pixels.data[i + 1];
    blue = pixels.data[i + 2];
    alpha = pixels.data[i + 3];

    if (red >= levels.rmin
      && green >= levels.gmin
      && blue >= levels.bmin
      && red <= levels.rmax
      && green <= levels.gmax
      && blue <= levels.bmax) {
      // take it out!
      pixels.data[i + 3] = 0;
    }
  }

  return pixels;
}
