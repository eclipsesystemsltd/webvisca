// declare global {
interface Window { stream: MediaStream; }
// }

var video = document.querySelector('video')!;
var photo: HTMLCanvasElement = document.getElementById('photo')! as HTMLCanvasElement;
var photoContext = photo.getContext('2d')!;
var snapBtn = document.getElementById('snap')!;
var photoContextW: number;
var photoContextH: number;

// attach event handlers
snapBtn.addEventListener('click', snapPhoto);

function grabWebCamVideo() {
    console.log('Getting user media (video) ...');
    navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true
    })
    .then(gotStream)
    .catch(function(e) {
        alert('getUserMedia() error: ' + e.name);
    });

    console.log('here1')

    navigator.usb.getDevices()
    .then(devices => {
      console.log("Total devices: " + devices.length);
      devices.forEach(device => {
        console.log("Product name1: " + device.productName + ", serial number " + device.serialNumber);
      });
    });

    console.log('here2')

    const filters = [
      {vendorId: 0x3242, productId: 0x1000}
    ];
}

function gotStream(stream: MediaStream) {
    console.log('getUserMedia video stream URL:', stream);
    window.stream = stream; // stream available to console
    video.srcObject = stream;
    video.onloadedmetadata = function() {
        photo.width = photoContextW = video.videoWidth;
        photo.height = photoContextH = video.videoHeight;
        console.log('gotStream with width and height:', photoContextW, photoContextH);
    };
}

function snapPhoto() {
    photoContext.drawImage(video, 0, 0, photo.width, photo.height);
}

navigator.usb.getDevices()
.then(devices => {
  console.log("Total devices: " + devices.length);
  devices.forEach(device => {
    console.log("Product name2: " + device.productName + ", serial number " + device.serialNumber);
  });
});

let devbutton = document.getElementById('devbutton')!;
devbutton.addEventListener('click', async () => {
  try {
    navigator.usb.getDevices()
    .then(devices => {
      console.log("Total devices: " + devices.length);
      devices.forEach(device => {
        console.log("Product name3: " + device.productName + ", serial number " + device.serialNumber);
      });
    });
  } catch (err) {
    // No device was selected.
    console.log('No device selected')
  }
});

let requestbutton = document.getElementById('requestbutton')!;
requestbutton.addEventListener('click', async () => {
  try {
    // note this call causes a dialog to be displayed requesting permission to access USB
    navigator.usb.requestDevice({filters: [{vendorId: 0x3242, productId: 0x1000}]})
    .then(usbDevice => {
    console.log("Device Product name: " + usbDevice.productName);
    })
    .catch(e => {
    console.log("There is no device. " + e);
    });
  } catch (err) {
    // No device was selected.
    console.log('No device selected')
  }
});

let button = document.getElementById('clickme')!;
button.addEventListener('click', async () => {
  let device;
  try {
    device = await navigator.usb.requestDevice({ filters: [{
        vendorId: 0x3242,
        productId: 0x1000,
    }]});

    // await device.open();
    // if (device.configuration === null)
    //   await device.selectConfiguration(1);
    // await device.claimInterface(1);

    // await device.controlTransferOut({
    //     requestType: 'vendor',
    //     recipient: 'interface',
    //     request: 0x01,  // vendor-specific request: enable channels
    //     value: 0x0013,  // 0b00010011 (channels 1, 2 and 5)
    //     index: 0x0001   // Interface 1 is the recipient
    // });

    // while (true) {
    //   let result = await device.transferIn(1, 6);
    
    //   if (result.data && result.data.byteLength === 6) {
    //     console.log('Channel 1: ' + result.data.getUint16(0));
    //     console.log('Channel 2: ' + result.data.getUint16(2));
    //     console.log('Channel 5: ' + result.data.getUint16(4));
    //   }
    
    //   if (result.status === 'stall') {
    //     console.warn('Endpoint stalled. Clearing.');
    //     await device.clearHalt(1);
    //   }
    // }

  } catch (err) {
    // No device was selected.
    console.log('No device selected')
  }

  if (device !== undefined) {
    // Add |device| to the UI.
  }
});
