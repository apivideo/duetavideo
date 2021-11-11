RTMP_url = 'rtmp://broadcast.api.video/s/30087931-229e-42cf-b5f9-e91bcc1f7332';
live_url = 'https://embed.api.video/live/li400mYKSgQ6xs7taUeSaEKr';
delegated_token = 'tompBU8ZJcUCEsKGxxoBydh';

//page defaults
//vod by default, but we can make the page default to live.
live = false; 
//by default, screensahring
cameraOnly = false;
//adding a comment to change the doc for github
var videoUrl;

//delay on mic and camera for syncing purposes
var micDelay = 0.25;


window.onload  = function(){ 
        //this turns on the camera for a second - just to get permissions to populate the form with mics and cameras
        //navigator.getUserMedia = (navigator.mediaDevices.getUserMedia);
        
        if('getUserMedia' in navigator){
            //chrome
            navigator.getUserMedia({audio:true,video:true}, function(stream) {
                stream.getTracks().forEach(x=>x.stop());
                getCamAndMics();
                console.log("constraints", navigator.mediaDevices.getSupportedConstraints());
            }, err=>console.log(err));
            

        }else if('getUserMedia' in navigator.mediaDevices){
            //firefox
            console.log("FIREFOX");
            navigator.mediaDevices.getUserMedia({audio:true,video:true}, function(stream) {
                stream.getTracks().forEach(x=>x.stop());
                getCamAndMics();
                console.log("constraints",  navigator.mediaDevices.getSupportedConstraints());
            }, err=>console.log(err));


        }
          if( 'permissions' in navigator){
              //not supported by safari...
            navigator.permissions.query({name:'camera'}).then(function(permissionStatus) {
                permissionStatus.onchange = function() {
                console.log('geolocation permission state has changed to ', this.state);
                getCamAndMics();
                };
            });
        }
        
    //get the video URL from the form
    videoUrl = document.getElementById("video-url").value;
    console.log('videourl',videoUrl);
    //update the video URL when the value is changed
    videoUrlform = document.getElementById("video-url");
    videoUrlform.addEventListener('change', (event) =>{
        //camera is oplaying start the video
        videoUrl = videoUrlform.value;
        console.log("URL updated", videoUrl);
    });
    videoDelayForm = document.getElementById("delay");
    videoDelayForm.addEventListener('change', (event)=>{
        micDelay = videoDelayForm.value;
        console.log("delay time changed to " +micDelay);

    });
    //console.log("loaded");
    // is this a mobile device - no screen share - and 2 cameras?
    //see if screen capture is supported
    if("getDisplayMedia" in navigator.mediaDevices){
        console.log("screen capture supported");
    }else{
        console.log("screen capture NOT supported");
        cameraOnly = true;
    }

    //but we can change based on URL params
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const liveURLParam = urlParams.get('live');
    const cameraOnlyParam = urlParams.get('cameraOnly');
    if(liveURLParam === "true"){
        live= true;
        console.log("live set from url", live);
    }
    if(cameraOnlyParam === "true"){
        cameraOnly = true;
        console.log("cameraOnly set from url", cameraOnly);
        document.getElementById("screenpicker-select").options[0].disabled = true;
        document.getElementById("screenpicker-select").options[1].disabled = true;
        document.getElementById("screenpicker-select").options[2].disabled = true;
    }


    //set all the variables for the canvas and all the elements
     videoElem = document.getElementById("display");
     cameraElem = document.getElementById("camera");
     startElem = document.getElementById("start");
     stopElem = document.getElementById("stop");

    

 

      //camera
      cameraW = 1280;
      cameraH = 720;
      cameraFR= 30;
        //set up the recording canvas
         canvas = document.getElementById("videoCanvas");

         ctx = canvas.getContext("2d");

  
        ctx.canvas.width = 1280;
        ctx.canvas.height= 720;
        


    
        //size of the video view where the screen is stored
         screenWidth = ctx.canvas.width;
         screenHeight = ctx.canvas.height;
      
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    
            
    
      

    //get cameras and mics
    //this is called at onload now - so not needed here.  For chromium.
    //if This is commented out, the device list does not populate for Safari & FF
    getCamAndMics();


    //initialize captioning
  //  captioning();
    
    createStream();




};



function getCamAndMics(){
     // List cameras and microphones. in the menu
       
     navigator.mediaDevices.enumerateDevices()
     .then(function(devices) {
         devices.forEach(function(device) {
           //  console.log("device", device);
             deviceName = device.label;
             if(deviceName == "" ){
                 deviceName = device.deviceId;
             }
           //  console.log(device.kind + ": named: " + deviceName +" id = " + device.deviceId);
             var audioSelect = document.getElementById("audioPicker-select");
             var cameraSelect = document.getElementById("cameraPicker-select");
             if(device.kind=="audioinput"){
                 //add a select to the audio dropdown list
                 var option = document.createElement("option");
                 option.value = device.deviceId;
                 option.text = deviceName;
                 audioSelect.appendChild(option);
             }else if(device.kind =="videoinput"){
                 //add a select to the camera dropdown list
                 var option = document.createElement("option");
                 option.value = device.deviceId;
                 option.text = deviceName;
                 cameraSelect.appendChild(option);

             }
         });
     })
     .catch(function(err) {
         console.log(err.name + ": " + err.message);
     });


}



function createStream(){
    //now lets capture the stream:
    var mediaSource = new MediaSource();
   
    var mediaRecorder;
    var recordedBlobs;
    var sourceBuffer;
    //capture stream at 25 fps
   stream = canvas.captureStream(35);
   console.log("stream tracks", stream.getTracks());
   console.log("video tracks", stream.getVideoTracks());
   console.log("audio tracks", stream.getAudioTracks());
   // console.log("stream", stream);

    console.log("stream", stream);
    console.log('Got stream from canvas');
   // var options = {mimeType: 'video/webm;codecs=vp9', bitsPerSecond: 100000};
       
    //once the cameras and viewas are picked this will draw them on th canvas
    //the timeout is for 20ms, so ~50 FPS updates on the canvas
    function drawCanvas(screenIn, cameraIn,canvas){
        var textLength = 60;
        canvas.fillStyle = 'rgba(0,0,0,0.5)';
        canvas.fillRect(0,0,window.innerWidth,window.innerHeight);
        canvas.drawImage(screenIn, screenX0,screenY0, screenX1, screenY1);
        canvas.drawImage(cameraIn, cameraX0, cameraY0, cameraX1, cameraY1);
      
        //speed this up - we cannot have delay in lip syncing
        
        setTimeout(drawCanvas, 5,screenIn, cameraIn,canvas);

    }
  
    //start camera - and when that starts - start videom and the recording

    cameraElem.addEventListener('play', (event) =>{
        //camera is oplaying start the video
        videoElem.src = videoUrl; 
        console.log("videoElem",videoElem);

        


    });

    //when video starts playing
    videoElem.addEventListener('play', function(){
       console.log('video playing');
            //draw the 2 streams to the canvas

            //camera
            var cameraOffset_w = cameraElem.offsetWidth;
            var cameraOffset_h = cameraElem.offsetHeight;
            cameraAspect = cameraOffset_w/cameraOffset_h;
            console.log ("camera w + h" + cameraOffset_w+ " " +cameraOffset_h + " " + cameraAspect);
            if(cameraAspect<1){
                console.log("camera portrait");
                //portrait as desired
                cameraX0 = ctx.canvas.width*1/12;
                cameraY0 = 0;
        
                //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
                cameraX1 = ctx.canvas.width*4/12;
                cameraY1= ctx.canvas.height;  
            }
            else{
                //landscape - thge browser does not support the aspectRatio constraints
                console.log("camera landscape");             
                cameraX0 = 0;
                cameraY0 = 7/32*ctx.canvas.height;
        
                //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
                cameraX1 = ctx.canvas.width*6/12;
                cameraY1= ctx.canvas.width*6/12*9/16;
                             
                            
            }
            //here we change latout based on the aspect ratio of the video
    
            var videoOffset_w = videoElem.offsetWidth;
            var videoOffset_h = videoElem.offsetHeight;
    
            var video_w = videoElem.videoWidth;
            var video_h = videoElem.videoHeight;
    
            var videoAspect = videoOffset_w/videoOffset_h;
            console.log ("videoOffset_w", videoOffset_w, "videoOffset_h", videoOffset_h);
            console.log ("video_w", video_w, "video_h", video_h);
            if(videoAspect<1){
                //portrait
                screenX0 = (ctx.canvas.width*7/12 );
                screenY0 = 0;
    
                //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
                screenX1 = (ctx.canvas.width*4/12 );
                screenY1= ctx.canvas.height;
            } else{
                //landscape
                screenX0 = (ctx.canvas.width*6/12 );
                screenY0 = 7/32*ctx.canvas.height;
    
                //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
                screenX1 = (ctx.canvas.width*6/12 );
                screenY1= ctx.canvas.width*6/12*9/16;
            }



            drawCanvas(videoElem, cameraElem,ctx);



            //grab the tracks from audiostream
            //this works.. but I must combine the 2 audio tracks
            /*
            for (const track of audioStream.getTracks()) {
                console.log("adding audio track");
            stream.addTrack(track);
                console.log("stream added audio", stream);
            }
            
            console.log("stream tracks 2", stream.getTracks());
            console.log("stream tracks 2 video", stream.getVideoTracks());
            console.log("stream tracks 2 audio", stream.getAudioTracks());        
            */
            //this works.. but i cant have 2 audios
            
            /*
            //grab the video elem audio
            videostream = videoElem.captureStream();
            console.log("videostream",videostream);
            console.log("stream tracks vs", videostream.getTracks());
            console.log("stream tracks vs video", videostream.getVideoTracks());
            console.log("stream tracks vs audio", videostream.getAudioTracks()); 
            const audioTracks = videostream.getAudioTracks();       
            //stream.addTrack(audioTracks[0]);
            console.log("stream tracks 3", stream.getTracks());
            console.log("stream tracks  3 video", stream.getVideoTracks());
            console.log("stream tracks 3 audio", stream.getAudioTracks()); 
            */

            //i need to create an audio context - combine the 2 audio inputs into that context.. and then add the context to the mediarecorder
            //https://stackoverflow.com/questions/55165335/how-do-you-combine-many-audio-tracks-into-one-for-mediarecorder-api

            
            //the audioContext will combine the 2 audios
            const audioContext = new AudioContext();

            //audio track from mic "audioStream"
            micAudioIn = audioContext.createMediaStreamSource(audioStream);

            //audio track from video
            if(videoElem.captureStream){
                videostream = videoElem.captureStream();
             }else{
                videostream = videoElem.mozCaptureStream();
             }
            videoAudioIn = audioContext.createMediaStreamSource(videostream);
            videoAudioin2 = audioContext.createMediaStreamSource(videostream);
            //i want to send videoAudio2 to te speakers
            videoAudioin2.connect(audioContext.destination);

            //change the volume of the video in
            var gainNode = audioContext.createGain();
            var volume = document.getElementById("volume").value/100;
            console.log("vol", volume);
            videoElem.volume = volume;
            gainNode.gain.value = volume;
            videoAudioIn.connect(gainNode);

            //delay the video in a bit
            var delay = audioContext.createDelay();
            
            delay.delayTime.value = micDelay;
            delay.connect(gainNode);

            //heres the destination for the combined audios
            audiocontextDest = audioContext.createMediaStreamDestination();

            //add the audio to the destination
            micAudioIn.connect(audiocontextDest);
            gainNode.connect(audiocontextDest);
            
            //ok so now the audio is in the audiocontextDest stream
            //grab the stream
             var audiocontextDestStream = audiocontextDest.stream;


             //grab the audio track from the stream
             var audiocontextDestStreamAudioTracks =  audiocontextDestStream.getAudioTracks();
            //add the audio track to the canvas output stream (the video)
            stream.addTrack(audiocontextDestStreamAudioTracks[0]);
            console.log("audio stream added!");

            //now the output stream has 
            //ONE video
            //one audio (combined from the mic and the video)

            // START RECORDING
            startRecording();

    },false);

    // Set event listeners for the start and stop buttons
    startElem.addEventListener("click", function(evt) {
    startCapture();
    }, false);

    stopElem.addEventListener("click", function(evt) {
    stopCapture();

    }, false);
}
async function startCapture() {
    try {
        //change buttons
        
            stopElem.style.display = "inline";
            startElem.className = "modifyScreens";
            startElem.innerHTML = "Change layout";
        



        //add text for the 2 screens
        document.getElementById("videoInputText").innerHTML = "Screen and camera inputs";

 /*
        // console.log("camera nad video w&h",camera_W, camera_H,  video_W,video_H)
        
        cameraX0 = ctx.canvas.width*1/12;
        cameraY0 = 0;

        //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
        cameraX1 = ctx.canvas.width*4/12;
        cameraY1= ctx.canvas.height;  

        //here we change latout based on the aspect ratio of the video

        var videoOffset_w = videoElem.offsetWidth;
        var videoOffset_h = videoElem.offsetHeight;

        var video_w = videoElem.videoWidth;
        var video_h = videoElem.videoHeight;

        var videoAspect = videoOffset_w/videoOffset_h;
        console.log ("videoOffset_w", videoOffset_w, "videoOffset_h", videoOffset_h);
        console.log ("video_w", video_w, "video_h", video_h);
        if(videoAspect<1){
            //portrait
            screenX0 = (ctx.canvas.width*7/12 );
            screenY0 = 0;

            //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
            screenX1 = (ctx.canvas.width*4/12 );
            screenY1= ctx.canvas.height;
        } else{
            //landscape
            screenX0 = (ctx.canvas.width*7/12 );
            screenY0 = 0.34*ctx.canvas.height;

            //x1 and y1 are how BIG the image should be not x,y coordinates on the cavas
            screenX1 = (ctx.canvas.width*4/12 );
            screenY1= videoOffset_h+ screenY0;
        }

*/

            //console.log(cameraX0, cameraY0, cameraX1, cameraY1);
            //console.log(screenX0, screenY0, screenX1, screenY1);
            //console.log(ctx.canvas.width, ctx.canvas.height);

       

    
        //rebuild the screen options
        //only thing is muting the audio
        //this prevents awful feedback..
        displayMediaOptions = {
        video: {
            frameRate: {ideal: cameraFR}
        },
        audio: false
        };
        console.log(JSON.stringify(displayMediaOptions));

      

        //select the camera and the micrphone: 
        var cameras = document.getElementById("cameraPicker-select");
        var cameraId = cameras.options[cameras.selectedIndex].value;
        var mics = document.getElementById("audioPicker-select");
        var micId = mics.options[mics.selectedIndex].value;
     
        //camera
        console.log("frameRate", cameraFR);
        navigator.getUserMedia = (navigator.mediaDevices.getUserMedia ||
                        navigator.mediaDevices.mozGetUserMedia ||
                        navigator.mediaDevices.msGetUserMedia ||
                        navigator.mediaDevices.webkitGetUserMedia);
        var videoOptions = {
            deviceId: cameraId,
            aspectRatio: {ideal: 9/16},
            
            frameRate: {ideal: cameraFR}
        };
       
        cameraMediaOptions = {
            audio: false,
            video: videoOptions
        };
        rearCameraMediaOptions = {
            audio: false,
            video:{
                facingMode: "environment",
                aspectRatio: {ideal: 0.5625},
                width: { min: 100, ideal: cameraW, max: 1920 },
                height: { min: 100, ideal: cameraH, max: 1080 }
            }
        };
        console.log(JSON.stringify(cameraMediaOptions));
        
        navigator.mediaDevices.getUserMedia(cameraMediaOptions)
        .then(function(camstream) {
            console.log("got stream from camera");
            cameraStream = camstream;
            console.log ("camerastream", cameraStream);
            cameraElem.srcObject =cameraStream;
            //now camer has started - start the video
           
            
            screenShared = true;
          })
          .catch(function(err) {
            /* handle the error */
            console.log("sream from camera error");
          });

        audioStreamOptions= {
           // mimeType: "video/webm;codecs=vp8,opus",
           // mimeType: "video/mp4",
            audio: { 
                deviceId: micId}
        };


        
        
        //grab the audio and add it to the stream coming from the canvas
      //  audioStream = await navigator.mediaDevices.getUserMedia(audioStreamOptions);
        navigator.mediaDevices.getUserMedia(audioStreamOptions)
        .then(function(astream) {
            console.log("got audio stream");
            audioStream = astream;
            console.log ("audioStream", audioStream);
            
          })
          .catch(function(err) {
            /* handle the error */
            console.log("sream from audio error");
          });



    } catch(err) {
        console.error("Error: " + err);
    }
}
function stopCapture(evt) {
    //pause tyhe VOD
    videoElem.pause();
    
    //FIX BUTTONS
    
           //change buttons
           if(live){
           
            startElem.className = "start";
            startElem.innerHTML = "Reload to stream again";
            startElem.disabled = true;
            socket.close();videoElem.srcObject
        }else{
            startElem.className = "start";
            startElem.innerHTML = "Start";
            
        }
        startElem.style.display = "inline";
       stopElem.style.display = "none";
       document.getElementById("videoInputText").innerHTML="";
    //screen stop
    stopRecording();
   videoElem.pause();
   cameraElem.pause();
  //  audioStream.pause();
 
  
        //stop blob recording
        // uploadTheVideo();
       // download();


}

function startRecording() {
    console.log("startRecording");
    //if I omit the MIMEtype, MediaRecorder works in Safari 14.0.3.  If I add a Mime.... it fails.
    //i had a mimetype in the options and it would not record properly.
    var options = { audioBitsPerSecond: 100000, videoBitsPerSecond: 4000000};
    //var options = {};
   // var options = 'video/webm';
    recordedBlobs = [];
    try {
     
            //instatiate the apivideo meida recorder upload function
            console.log("create apivideo media recorder!");
            mediaRecorder = new ApiVideoMediaRecorder(stream, {
                uploadToken: delegated_token
            });
        
        console.log("options", options);
        console.log("mediaRecorder mime", mediaRecorder.mimeType);
    }  catch (e2) {
            alert('MediaRecorder is not supported by this browser.');
            console.error('Exception while creating MediaRecorder:', e2);
            return;
    }
    console.log('Created video MediaRecorder', mediaRecorder, 'with options', options);
    console.log(",ediacrecorder stream info", mediaRecorder.stream);
   // console.log(",ediacrecorder stream trackinfo", mediaRecorder.stream.getTracks());
    mediaRecorder.onstop = handleStop;
    

    mediaRecorder.start(micDelay*1000); // use mic delay time to all for syncing the audio delay with teh video (in ms)
    console.log('MediaRecorder started', mediaRecorder);
}

function handleStop(event) {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
    }

function stopRecording() {
    document.getElementById("video-information").innerHTML = "Uploading the last bit of the video.  Please wait a second."
    mediaRecorder.stop()//;
        .then(function(video) {
            
            console.log(video);
              //the video is fully uploaded. there will now be a url in the response
              playerUrl = video.assets.player;
              console.log("all uploaded! Watch here: ",playerUrl ) ;
              document.getElementById("video-information").innerHTML = "all uploaded! Watch the video <a href=\'" + playerUrl +"\' target=\'_blank\'>here</a>" ;
        
        });
}

function play() {
    var type = (recordedBlobs[0] || {}).type;
    var superBuffer = new Blob(recordedBlobs, {type});
    recordedVideo.src = window.URL.createObjectURL(superBuffer);
    }

function download() {
    var blob = new Blob(recordedBlobs, {type: 'video/webm'});
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'test.webm';
    document.body.appendChild(a);
    a.click();
    setTimeout(function() {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 100);
}


function connect_server(){
    
    if(!stream){fail('No getUserMedia() available.');}
    if(!MediaRecorder){fail('No MediaRecorder available.');}


    var socketOptions = {secure: true, reconnection: true, reconnectionDelay: 1000, timeout:10000, pingTimeout: 10000, pingInterval: 2000};
    
    //start socket connection
    socket = io.connect("/", socketOptions);
    // console.log("ping interval =", socket.pingInterval, " ping TimeOut" = socket.pingTimeout);
     //output_message.innerHTML=socket;
    
    socket.on('connect_timeout', (timeout) => {
           console.log("state on connection timeout= " +timeout);
       // output_message.innerHTML="Connection timed out";
       // recordingCircle.style.fill='gray';
        
    });
    socket.on('error', (error) => {
           console.log("state on connection error= " +error);
     //   output_message.innerHTML="Connection error";
    //    recordingCircle.style.fill='gray';
    });
    
    socket.on('connect_error', function(){ 
           console.log("state on connection error= " +state);
     //   output_message.innerHTML="Connection Failed";
     //   recordingCircle.style.fill='gray';
    });

    socket.on('message',function(m){
        console.log("state on message= " +state);
        console.log('recv server message',m);
      //  show_output('SERVER:'+m);
        
    });

    socket.on('fatal',function(m){

       // show_output('Fatal ERROR: unexpected:'+m);
        //alert('Error:'+m);
        console.log("fatal socket error!!", m);
        console.log("state on fatal error= " +state);
        //already stopped and inactive
        console.log('media recorder restarted');
       // recordingCircle.style.fill='gray';
        


    });
    
    socket.on('ffmpeg_stderr',function(m){
        //this is the ffmpeg output for each frame
        console.log('FFMPEG:'+m);	
       

    });

    socket.on('disconnect', function (reason) {
        console.log("state disconec= " +state);
       // show_output('ERROR: server disconnected!');
        console.log('ERROR: server disconnected!' +reason);
      //  recordingCircle.style.fill='gray';
        //reconnect the server
       // connect_server();
        
     
      
    });

    state="ready";
    console.log("state = " +state);
    console.log('config_rtmpDestination',RTMP_url);
    socket.emit('config_rtmpDestination',RTMP_url);
    socket.emit('start','start');
   
}
