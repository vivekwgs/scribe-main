let microphone;
let recorder;
let isRecording = false;
let audio = document.querySelector('audio');
const patinet_input_box_element = document.getElementById('patient_input_box');
const patient_name_input_element = document.getElementById('patient_name_input');
const patient_button_element = document.getElementById('patient_button');
const cunsulting_container_element = document.getElementById('content_container_consulting');
const button_start_recording = document.getElementById('btn-start-recording');
const socket_status_element = document.getElementById('real_time_socket_status');
const button_stop_recording = document.getElementById('btn-stop-recording');
const button_download_recording = document.getElementById('btn-download-recording');
const real_time_title_element = document.getElementById('real-time-title');
const messageEl = document.getElementById('message_input');
const convo_text_container_el = document.getElementById('conv_text_container');
const button_stop_recording_element = document.getElementById('btn-stop-recording');
const button_download_recording_element = document.getElementById('btn-download-recording');
let checkedCheckboxIDs = [];
const reset_button_element = document.getElementById("reloadButton");
const dropdownButton = document.getElementById('dropdownMenuButton');
var mini = true;

reset_button_element.addEventListener("click", function () {
	location.reload();
});

// patient details enter section 
patient_name_input_element.addEventListener('input', function (e) {
	patient_name_input_element.value = e.target.value;
});

patient_button_element.addEventListener('click', function () {
	if (patient_name_input_element?.value) {
		patinet_input_box_element.style.display = 'none';
		cunsulting_container_element.style.display = 'block';
	}
});


function captureMicrophone(callback) {
	if (microphone) {
		callback(microphone);
		return;
	}

	if (typeof navigator.mediaDevices === 'undefined' || !navigator.mediaDevices.getUserMedia) {
		alert('This browser does not supports WebRTC getUserMedia API.');

		if (!!navigator.getUserMedia) {
			alert('This browser seems supporting deprecated getUserMedia API.');
		}
	}

	navigator.mediaDevices.getUserMedia({
		audio: isEdge ? true : {
			echoCancellation: false
		}
	}).then(function (mic) {
		const currentDate = new Date();
		const formattedDate = `${currentDate.getFullYear()}-${currentDate.getMonth() + 1}-${currentDate.getDate()} ${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
		const titleElement = document.querySelector('.DateandTime');
		if (titleElement) {
			titleElement.innerText = `Microphone Access Granted at ${formattedDate}`;
		}

		callback(mic);
	}).catch(function (error) {
		alert('Unable to capture your microphone. Please check console logs.');
		console.error(error);
        window.reload(true);
	});
}

function click(el) {
	el.disabled = false;
	const evt = document.createEvent('Event');
	evt.initEvent('click', true, true);
	el.dispatchEvent(evt);
}

function replaceAudio(src) {
	const newAudio = document.createElement('audio');
	newAudio.controls = true;
	newAudio.autoplay = true;

	if (src) {
		newAudio.src = src;
	}

	const parentNode = audio.parentNode;
	parentNode.innerHTML = '';
	parentNode.appendChild(newAudio);

	audio = newAudio;
}


function toast(sentence, duration) {
	const message = document.querySelector(".toast");
	message.classList.add("toast--show");
	message.innerText = sentence;
	setTimeout(() => {
		message.classList.remove("toast--show");
	}, duration);
}


button_start_recording.onclick = async function () {
	if (checkedCheckboxIDs.length <= 0) {
		toast("Please select template before start recording", 5000);
	} else {
		this.disabled = true;
		this.style.border = '';
		this.style.fontSize = '';
		socket_status_element.style.display = 'block';
		dropdownButton.style.display = 'none';
		socket_status_element.innerText = "Initializing system...."
		if (!microphone) {
			captureMicrophone(function (mic) {
				microphone = mic;

				if (isSafari) {
					replaceAudio();

					audio.muted = true;
					audio.srcObject = microphone;

					button_start_recording.disabled = false;
					button_start_recording.style.border = '1px solid red';
					button_start_recording.style.fontSize = '150%';

					alert('Please click startRecording button again. First time we tried to access your microphone. Now we will record it.');
					return;
				}

				click(button_start_recording);
			});
			return;
		}

		replaceAudio();

		audio.muted = true;
		audio.srcObject = microphone;

		const options = {
			type: 'audio',
			numberOfAudioChannels: isEdge ? 1 : 2,
			checkForInactiveTracks: true,
			bufferSize: 16384,
		};

		if (isSafari || isEdge) {
			options.recorderType = StereoAudioRecorder;
		}

		if (navigator.platform && navigator.platform.toString().toLowerCase().indexOf('win') === -1) {
			options.sampleRate = 48000;
		}

		if (isSafari) {
			options.sampleRate = 44100;
			options.bufferSize = 4096;
			options.numberOfAudioChannels = 2;
		}

		if (recorder) {
			recorder.destroy();
			recorder = null;
		}

		recorder = RecordRTC(microphone, options);
		socket_status_element.innerText = "Connecting to Websockets...."
		const response = await fetch("https://aiscribe-s3ne.onrender.com/scribe/transcript");
		const data = await response.json();

		if (data.error) {
			alert(data.error);
		}


		const {token} = data;
		socket = await new WebSocket(
			`wss://api.assemblyai.com/v2/realtime/ws?sample_rate=16000&token=${token}`,
		);

		const texts = {};
		socket.onmessage = (message) => {
			let msg = "";
			const res = JSON.parse(message.data);
			texts[res.audio_start] = res.text;
			const keys = Object.keys(texts);
			keys.sort((a, b) => a - b);
			for (const key of keys) {
				if (texts[key]) {
					msg += ` ${texts[key]}`;
				}
			}
			messageEl.value = msg;
			messageEl.style.height = (messageEl.scrollHeight) + "px";
		};

		socket.onerror = (event) => {
			console.error(event);
			socket.close();
		};

		socket.onclose = (event) => {
			console.log(event);
			socket = null;
		};
		socket.onopen = () => {

			convo_text_container_el.style.display = "block"
			messageEl.style.display = "";
			recorder = new RecordRTC(microphone, {
				type: "audio",
				mimeType: "audio/webm;codecs=pcm",
				recorderType: StereoAudioRecorder,
				timeSlice: 250,
				desiredSampRate: 16000,
				numberOfAudioChannels: 1,
				bufferSize: 16384,
				audioBitsPerSecond: 128000,
				ondataavailable: (blob) => {
					const reader = new FileReader();
					reader.onload = () => {
						const base64data = reader.result;
						if (socket) {
							socket.send(
								JSON.stringify({
									audio_data: base64data.split("base64,")[1],
								}),
							);
						}
					};
					reader.readAsDataURL(blob);
				},
			});
			recorder.startRecording();

		};
		button_stop_recording.disabled = false;
		button_stop_recording.style.display = "block";
		document.getElementById('stop_btn_txt').style.display='flex';
		button_download_recording.disabled = true;
		isRecording = !isRecording;
		real_time_title_element.innerText = isRecording
			? "Click stop to end recording!"
			: "Click start to begin recording!";
		socket_status_element.innerText = isRecording
			? "Web Sockets connection established." : "Connecting to Websockets...."
	}


};


function copyMessageElText() {
	const textarea = document.getElementById('message_input');
	textarea.select();
	textarea.setSelectionRange(0, 99999);
	document.execCommand("copy");
	textarea.setSelectionRange(0, 0);
}

async function stopRecordingCallback() {

	socket.send(JSON.stringify({terminate_session: true}));
	socket.close();
	socket = null;
	const audioBlob = recorder.getBlob();
	replaceAudio(URL.createObjectURL(audioBlob));

	button_start_recording.disabled = false;
document.getElementById('counsulting_section').style.display='none';
	audio.pause();
	button_download_recording_element.disabled = false;

	if (isSafari) {
		click(btnReleaseMicrophone);
	}
	const loader_contianer_class_element = document.getElementById('loader_contianer_class');
	const container = document.createElement('div');
	container.classList.add('loader_contianer_class');
	loader_contianer_class_element.style.display = 'flex';
	// Create the SVG element
	const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svg.setAttribute('id', 'animated');
	svg.classList.add('loader_class_style');
	svg.setAttribute('viewBox', '0 0 100 100');

	// Create the circle element
	const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
	circle.setAttribute('cx', '50');
	circle.setAttribute('cy', '50');
	circle.setAttribute('r', '45');
	circle.setAttribute('fill', '#FDB900');

	// Create the path element (progress bar)
	const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
	path.setAttribute('id', 'progress');
	path.setAttribute('stroke-linecap', 'round');
	path.setAttribute('stroke-width', '5');
	path.setAttribute('stroke', '#fff');
	path.setAttribute('fill', 'none');
	path.setAttribute('d', 'M50 10 a 40 40 0 0 1 0 80 a 40 40 0 0 1 0 -80');

	// Create the text elements
	const countText = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	countText.setAttribute('id', 'count');
	countText.setAttribute('x', '50');
	countText.setAttribute('y', '50');
	countText.setAttribute('text-anchor', 'middle');
	countText.setAttribute('dy', '7');
	countText.setAttribute('font-size', '20');
	countText.textContent = '0%';

	const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
	text.setAttribute('id', 'text');
	text.setAttribute('x', '50');
	text.setAttribute('y', '60');
	text.setAttribute('text-anchor', 'middle');
	text.setAttribute('dy', '7');
	text.setAttribute('font-size', '7');
	text.textContent = 'Audio Processing';

	// Append elements to the container and the container to the document
	svg.appendChild(circle);
	svg.appendChild(path);
	svg.appendChild(countText);
	svg.appendChild(text);
	container.appendChild(svg);
	document.body.appendChild(container);

	// Create the counting animation
	const countElement = document.getElementById('count');
	let counter = 0;
	const duration = 70000;

	function updateCount() {
		counter++;
		if (counter <= 98) {
			countElement.textContent = counter + '%';
			setTimeout(updateCount, (duration / 98));
		}
	}

	setTimeout(updateCount, (duration / 98));

	// Create the progress animation
	const progressElement = document.getElementById('progress');
	const totalLength = progressElement.getTotalLength();

	progressElement.setAttribute('stroke-dasharray', `${totalLength}, ${totalLength}`);
	progressElement.setAttribute('stroke-dashoffset', totalLength);

	progressElement.style.transition = `stroke-dashoffset ${duration}ms linear`;

	setTimeout(() => {
		progressElement.setAttribute('stroke-dashoffset', '0');
	}, 0);

	const formData = new FormData(); 
	formData.append('wavfile', audioBlob, "recording.wav");
	try {
		//const config = {
		//	method: 'POST',
		//	body: formData,
		//	headers: {'content-type': 'multipart/form-data'}
		//}
		const config = {
			method: 'POST',
			body: formData,
		};
		fetch('https://aiscribe-s3ne.onrender.com/scribe/upload', config)
			.then(response => response.json())
			.then(data => {
				console.log(data)
				const FILE_URL = data?.Location;
				// Use FILE_URL as needed
				//const data = {
				//	audio_url: FILE_URL,
				//	templates: checkedCheckboxIDs
				//}
				//const config = {
				//	headers: {'content-type': 'application/json'}
				//}
				console.log(FILE_URL);
				if (FILE_URL) {
					try {
						const data = {
							audio_url: FILE_URL,
							templates: checkedCheckboxIDs
						};
						const headers = new Headers({
							'Content-Type': 'application/json'
						});
						const config = {
							method: 'POST',
							headers,
							body: JSON.stringify(data)
						};

						fetch('https://aiscribe-s3ne.onrender.com/scribe/lemurAi', config)
							.then(response => response.json())
							.then(lemurResponseData => {
								lemurResponseData.transcript_audio = FILE_URL;
								lemurResponseData.user_id = 3;
								lemurResponseData.patient_name = patient_name_input_element.value;
								lemurResponseData.transcription_text = messageEl.value;
								const stringified_lemur_data = JSON.stringify(lemurResponseData);
								localStorage.setItem('emr_report_data', stringified_lemur_data);
								loader_contianer_class_element.style.display = 'none';

								const apiUrl = 'https://aiscribe-s3ne.onrender.com/scribe/add_appointments';
								const requestData = lemurResponseData;

								async function createAppointment() {
									try {
										const response = await fetch(apiUrl, {
											method: 'POST',
											headers,
											body: JSON.stringify(requestData)
										});
										const responseData = await response.json();
										//console.log('Appointment created successfully:', responseData, responseData.appointmentId);
										lemurResponseData.appointment_id = responseData.appointmentId;
										lemurResponseData.patient_id = responseData.patient_id;
										const stringified_response_data = JSON.stringify(responseData);
										localStorage.setItem('emr_patient_db_data', stringified_response_data);
										//window.location.href = './patient_emr/index.html';
										window.location.href = './appointments/index.html';
									} catch (error) {
										console.error('Error creating appointment:', error);
									}
								}

								// Call the async function to make the API call
								createAppointment();
							})
							.catch(error => {
								console.error('Error sending POST request:', error);
								// Handle errors here
							});
					} catch (error) {
						console.error('Error sending POST request:', error);
						// Handle errors here
					}
				}

			})
			.catch(error => {
				console.error('Error:', error);
			});

		//if (FILE_URL) {
		//	try {
		//		const data = {
		//			audio_url: FILE_URL,
		//			templates: checkedCheckboxIDs
		//		}
		//		const config = {
		//			headers: {'content-type': 'application/json'}
		//		}

		//		const lemurResponse = await axios.post('https://aiscribe-s3ne.onrender.com/scribe/lemurAi', data, config);

		//		const lemurResponseData = lemurResponse?.data;
		//		lemurResponseData.transcript_audio = FILE_URL;
		//		lemurResponseData.user_id = 3;
		//		lemurResponseData.patient_name = patient_name_input_element.value;
		//		lemurResponseData.transcription_text = messageEl.value;
		//		const stringified_lemur_data = JSON.stringify(lemurResponse);
		//		localStorage.setItem('emr_report_data', stringified_lemur_data);
		//		loader_contianer_class_element.style.display = 'none';

		//		const apiUrl = 'https://aiscribe-s3ne.onrender.com/scribe/add_appointments';
		//		const requestData = lemurResponse?.data;
		//		async function createAppointment() {
		//			try {
		//				const response = await axios.post(apiUrl, requestData);
		//				// Handle the successful response here
		//				console.log('Appointment created successfully:', response.data, response.data.appointmentId);
		//				lemurResponseData.appointment_id = response?.data?.appointmentId;
		//				lemurResponseData.patient_id = response?.data?.patient_id;
		//				const stringified_response_data = JSON.stringify(response.data);
		//				localStorage.setItem('emr_patient_db_data', stringified_response_data);
		//				window.location.href = './patient_emr/index.html'
		//			} catch (error) {
		//				// Handle any errors that occur during the request
		//				console.error('Error creating appointment:', error);
		//			}
		//		}

		//		// Call the async function to make the API call
		//		createAppointment();

		//	} catch (error) {
		//		console.error("Error sending POST request:", error);
		//		// Handle errors here
		//	}

		//}

	} catch (error) {
		console.error("Error sending POST request:", error);
	}
	
}

button_stop_recording_element.onclick = function () {
	if (messageEl.value.length > 100) {
		this.disabled = true;
		this.style.display = "none";
		document.getElementById('stop_btn_txt').style.display='none';
		recorder.stopRecording(stopRecordingCallback);
	} else {
		toast("Audio content is too short to process please try speaking more", 5000);
	}
};

async function fetchTemplates() {
	const user_id = 3; // Replace with the actual user ID you want to fetch appointments for
	const backendURL = `https://aiscribe-s3ne.onrender.com/scribe/get_templates/?user_id=${user_id}`; // Replace with your actual backend URL

	try {
		const response = await fetch(backendURL);

		if (response.ok) {
			const data = await response.json();
			console.log(data);
			return data;
		} else {
			console.error('Error fetching templates:', response.statusText);
			return [];
		}
	} catch (error) {
		console.error('Error fetching templates:', error);
		return [];
	}
}

async function createButtons() {
	const templatesContainer = document.querySelector('.templates-container');
	const templateData = await fetchTemplates();
	templatesContainer.innerHTML = '';
	templateData.forEach((template) => {
		console.log(template);
		const button = document.createElement('button');
		button.textContent = template.template_name || 'Unnamed Template';
		button.classList.add('btn', 'btn-primary', 'template_button');
		button.addEventListener('click', () => selectTemplate(template));
		templatesContainer.appendChild(button);
	});
}

function selectTemplate(template) {
	console.log('Selected Template:', template?.templates);
	checkedCheckboxIDs = template?.templates;
}


let templateNameVariable = ''; 

function saveTemplateName(inputElement) {
	templateNameVariable = inputElement.value; 
	console.log('Template Name: ', templateNameVariable); 
}



async function fetchDataAndPopulateDropdown() {
	const user_id = 3; 
	const backendURL = `https://aiscribe-s3ne.onrender.com/scribe/get_templates/?user_id=${user_id}`;
	try {
		const response = await fetch(backendURL);
		if (!response.ok) {
			throw new Error('Network response was not ok');
		}

		const data = await response.json();
		const dropdownMenu = document.getElementById('templateDropdown');
		data.forEach(option => {
			if (option.template_name) {
				const menuItem = document.createElement('a');
				menuItem.classList.add('dropdown-item');
				menuItem.addEventListener('click', function (event) {
					event.preventDefault();
					console.log(event.target, option?.templates);
					const selectedText = event.target.textContent;
					checkedCheckboxIDs = option?.templates;

					dropdownButton.textContent = selectedText;
				});
				menuItem.textContent = option.template_name;
				dropdownMenu.appendChild(menuItem);
			}

		});
	} catch (error) {
		console.error('Error fetching data:', error);
	}
}

fetchDataAndPopulateDropdown()

//  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
 //   recognition.continuous = true;  // Set to continuous recognition

 //   recognition.onstart = () => {
 //       console.log('Speech recognition started');
 //   };

  //  recognition.onresult = (event) => {
   //     let interimTranscript = '';
   //     let finalTranscript = '';

   //     for (let i = event.resultIndex; i < event.results.length; i++) {
    //        const transcript = event.results[i][0].transcript.toLowerCase();
            
    //        if (event.results[i].isFinal) {
      //          finalTranscript += transcript;
     //       } else {
     //           interimTranscript += transcript;
     //       }
    //    }

    //    console.log('Interim Transcript:', interimTranscript);
     //   console.log('Final Transcript:', finalTranscript);

        // Check if the voice command matches the desired command
    //    if (finalTranscript.includes('start')) {
            // Trigger button click event
	//		button_start_recording.click();
  //      }
   // };

  //  recognition.onend = () => {
  //      console.log('Speech recognition ended');
        // Restart recognition to make it continuous
  //      recognition.start();
  //  };

    // Start speech recognition when the page loads
  //  recognition.start();
//} else {
  //  console.error('Web Speech API is not supported in this browser');
//}

//document.addEventListener('contextmenu', (e) => {
//	e.preventDefault();
//	closeChat();
//});

// Check if the browser supports SpeechRecognition or webkitSpeechRecognition
/*
if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    // Create a new SpeechRecognition object, using the appropriate API based on the browser
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

    // Set the recognition to continuous mode, allowing continuous speech recognition
    recognition.continuous = true;

    // Event handler: Triggered when speech recognition starts
    recognition.onstart = () => {
        console.log('Speech recognition started');
    };

    // Event handler: Triggered when there are speech recognition results
    recognition.onresult = (event) => {
        // Initialize variables to store interim and final transcripts
        let interimTranscript = '';
        let finalTranscript = '';

        // Loop through the results and process each transcript
        for (let i = event.resultIndex; i < event.results.length; i++) {
            // Extract the transcript and convert it to lowercase
            const transcript = event.results[i][0].transcript.toLowerCase();

            // Check if the transcript is final or interim and update the corresponding variable
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Log the interim and final transcripts to the console
        console.log('Interim Transcript:', interimTranscript);
        console.log('Final Transcript:', finalTranscript);
		if (finalTranscript.includes('start')) {
            // Trigger button click event
			button_start_recording.click();
        }
		
        // Check if the final transcript includes the voice command 'stop'
        if (finalTranscript.includes('stop')) {
            // Trigger the click event of the 'button_stop_recording_element' button
            button_stop_recording_element.click();
        }
    };

    // Event handler: Triggered when speech recognition ends
    recognition.onend = () => {
        console.log('Speech recognition ended');
        // Restart speech recognition to make it continuous
        recognition.start();
    };

    // Start speech recognition when the page loads
    recognition.start();
} else {
    console.error('Web Speech API is not supported in this browser');
}
*/

// Check if the browser supports SpeechRecognition
if ('SpeechRecognition' in window) {
    // Create a new SpeechRecognition object
    const recognition = new window.SpeechRecognition();

    // Set the recognition to continuous mode, allowing continuous speech recognition
    recognition.continuous = true;

    // Set interimResults to false to get more accurate final results
    recognition.interimResults = false;

    // Event handler: Triggered when speech recognition starts
    recognition.onstart = () => {
        console.log('Speech recognition started');
    };

    // Event handler: Triggered when there are speech recognition results
    recognition.onresult = (event) => {
        // Initialize variables to store interim and final transcripts
        let interimTranscript = '';
        let finalTranscript = '';

        // Loop through the results and process each transcript
        for (let i = event.resultIndex; i < event.results.length; i++) {
            // Extract the transcript and convert it to lowercase
            const transcript = event.results[i][0].transcript.toLowerCase();

            // Check if the transcript is final or interim and update the corresponding variable
            if (event.results[i].isFinal) {
                finalTranscript += transcript;
            } else {
                interimTranscript += transcript;
            }
        }

        // Log the interim and final transcripts to the console
        console.log('Interim Transcript:', interimTranscript);
        console.log('Final Transcript:', finalTranscript);
        
        if (finalTranscript.includes('buddy start')) {
            console.log('Recognized command: buddy start');
            // Trigger button click event
            button_start_recording.click();
        }

        // Check if the final transcript includes the voice command 'stop'
        if (finalTranscript.includes('buddy stop')) {
            console.log('Recognized command: buddy stop');
            // Trigger the click event of the 'button_stop_recording_element' button
            button_stop_recording_element.click();
        }
    };

    // Event handler: Triggered when speech recognition ends
    recognition.onend = () => {
        console.log('Speech recognition ended');
        // Restart speech recognition to make it continuous
        recognition.start();
    };

    // Start speech recognition when the page loads
    recognition.start();
} else {
    console.error('SpeechRecognition API is not supported in this browser');
}

function toggleSidebar() {
	const sidebar = document.getElementById("mySidebar");
	const main = document.getElementById("main");
	const width = mini ? "250px" : "85px";
	const marginLeft = mini ? "175px" : "0px";

	sidebar.style.width = width;
	main.style.marginLeft = marginLeft;
	mini = !mini;
}


function onClickPatientSidebar() {

	localStorage.removeItem('emr_report_data')
	localStorage.removeItem('emr_patient_db_data')
	window.location.href = './appointments/index.html';
	console.log('appointments_sidebar clicked')
}


function expandHeader() {
	var header_element = document.getElementById('header_container');
	var currentHeight = parseInt(header_element.style.height, 10);
	let sidebar_header_mobileElement = document.getElementById('sidebar_header_mobile_id')

	if (isNaN(currentHeight) || currentHeight === 85) {
		// If the height is not set or is currently 85px, expand to 300px
		header_element.style.height = '300px';
		sidebar_header_mobileElement.style.display = 'block'
		sidebar_header_mobileElement.style.marginRight = '20px'
	} else {
		// If the height is currently 300px, collapse to 85px
		header_element.style.height = '85px';
		sidebar_header_mobileElement.style.display = 'none'
	}
	header_element.classList.add('smooth-transition');

	// After the transition is complete, remove the class
	setTimeout(function () {
		header_element.classList.remove('smooth-transition');
	}, 500);
}