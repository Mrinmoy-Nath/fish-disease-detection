const navMenu = document.getElementById('nav-menu'),
      navToggle = document.getElementById('nav-toggle'),
      navClose = document.getElementById('nav-close')

/* Menu show */
if(navToggle){
   navToggle.addEventListener('click', () =>{
      navMenu.classList.add('show-menu')
   })
}

const imageUpload = document.getElementById('imageUpload');
        const submitButton = document.getElementById('submitButton');

        submitButton.addEventListener('click', () => {
            const file = imageUpload.files[0];
            if (!file) {
                alert('Please upload an image first.');
                return;
            }

            // Create a FileReader to read the image
            const reader = new FileReader();
            reader.onload = (event) => {
                // Save the image data to localStorage
                localStorage.setItem('uploadedImage', event.target.result);

                // Redirect to the new page
                window.location.href = 'display.html';
            };

            reader.readAsDataURL(file);
        });

/* Menu hidden */
if(navClose){
   navClose.addEventListener('click', () =>{
      navMenu.classList.remove('show-menu')
   })
}
        const uploadForm = document.getElementById('uploadForm');
        const takePhotoButton = document.getElementById('takePhoto');
        const cameraWrapper = document.getElementById('cameraWrapper');
        const video = document.getElementById('video');
        const capturePhotoButton = document.getElementById('capturePhoto');
        const photoCanvas = document.getElementById('photoCanvas');
        const canvasContext = photoCanvas.getContext('2d');
        
        const apiKey = 'YOUR_GOOGLE_TRANSLATE_API_KEY';  // Get your API key from Google Cloud
        const translateText = async (text, targetLanguage) => {
            const url = `https://translation.googleapis.com/language/translate/v2?key=${apiKey}`;
            
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    q: text,
                    target: targetLanguage
                })
            });
            
            const data = await response.json();
            return data.data.translations[0].translatedText;
        };

        const handleLanguageChange = async () => {
            const selectedLanguage = document.getElementById('language').value;
            
            const textsToTranslate = [
                { id: 'headerTitle', text: 'Fish Disease Detection' },
                { id: 'realTimeStatsTitle', text: 'Real-Time Statistics' },
                { id: 'latestNotificationsTitle', text: 'Latest Notifications' },
                { id: 'uploadTitle', text: 'Upload Fish Image' },
                { id: 'uploadDescription', text: 'Upload an image of the fish to detect any diseases and get actionable insights.' },
                { id: 'submitButton', text: 'Submit' }
            ];

            for (let textObj of textsToTranslate) {
                const translatedText = await translateText(textObj.text, selectedLanguage);
                document.getElementById(textObj.id).textContent = translatedText;
            }
        };

        document.getElementById('language').addEventListener('change', handleLanguageChange);

        uploadForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const fileInput = document.getElementById('imageUpload');
            const language = document.getElementById('language').value;
            const emailNotification = document.getElementById('emailNotification').checked;
            const smsNotification = document.getElementById('smsNotification').checked;
            const pushNotification = document.getElementById('pushNotification').checked;

            if (fileInput.files.length === 0 && photoCanvas.classList.contains('hidden')) {
                alert('Please upload an image file or take a photo.');
            } else {
                alert(`Image submitted successfully!\nLanguage: ${language}\nEmail: ${emailNotification}\nSMS: ${smsNotification}\nPush: ${pushNotification}`);
                // Add logic here to send the image and preferences to the backend for analysis
            }
        });

        takePhotoButton.addEventListener('click', async () => {
            try {
                // Access the user's camera
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;

                // Show the camera feed
                cameraWrapper.classList.remove('hidden');
                photoCanvas.classList.add('hidden');
            } catch (err) {
                alert('Error accessing camera: ' + err.message);
            }
        });

        capturePhotoButton.addEventListener('click', () => {
            // Set canvas dimensions to match video feed
            photoCanvas.width = video.videoWidth;
            photoCanvas.height = video.videoHeight;

            // Draw the current video frame onto the canvas
            canvasContext.drawImage(video, 0, 0, photoCanvas.width, photoCanvas.height);

            // Hide the video feed and show the captured photo
            cameraWrapper.classList.add('hidden');
            photoCanvas.classList.remove('hidden');

            // Stop the camera feed
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach((track) => track.stop());
        });