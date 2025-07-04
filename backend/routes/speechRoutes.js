// backend/routes/speechRoutes.js

// const express = require('express');
// const path = require('path');
// const fs = require('fs');
// const vosk = require('vosk');

// const router = express.Router();

// // Correct relative path to the 'model' directory
// const modelPath = path.join(__dirname, '../../voice/model');

// // Check if model path exists
// console.log('Loading Vosk model from:', modelPath);

// if (!fs.existsSync(modelPath)) {
//     console.error('Vosk model directory does not exist:', modelPath);
//     process.exit(1); // Exit if the model path is not found
// }

// // Load the Vosk model
// const model = new vosk.Model(modelPath);

// // Setup the route for speech-to-text
// router.post('/speech-to-text', (req, res) => {
//     const audioStream = req.files.audio.data; // Assuming you are sending audio via multipart/form-data

//     try {
//         const rec = new vosk.Recognizer({ model: model, sampleRate: 16000 });

//         // Process the audio data
//         rec.acceptWaveform(audioStream);
//         const result = rec.finalResult();

//         res.status(200).json({
//             success: true,
//             transcription: result.text
//         });
//     } catch (error) {
//         console.error('Error transcribing audio:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error transcribing audio',
//             error: error.message
//         });
//     }
// });

// module.exports = router;
