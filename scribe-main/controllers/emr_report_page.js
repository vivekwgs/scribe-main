const report_data = (data) => {

	return `
    <!DOCTYPE html>
    <html lang="">
    <head>
        <meta charset="UTF-8">
        <title>EMR Report</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                margin: 20px;
            }
            h1 {
                text-align: center;
                margin-bottom: 20px;
            }
            h2 {
                background-color: #333;
                color: #fff;
                padding: 10px;
                margin-top: 20px;
                margin-bottom: 10px;
            }
            table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }
            th, td {
                border: 1px solid #ccc;
                padding: 10px;
                text-align: left;
            }
            th {
                background-color: #f2f2f2;
            }
            p {
                margin: 10px 0;
            }
            .section {
                margin-bottom: 30px;
            }
        </style>
    </head>
    <body>
        <h1>Electronic Medical Record</h1>
        <hr>
    
        <div class="section">
            <h2>Patient Information</h2>
            <table>
                <tr>
                    <th>Patient ID</th>
                    <th>Patient Name</th>
                    <th>Patient Age</th>
                    <th>Patient Gender</th>
                </tr>
                <tr>
                    <td>${data.patient_id || 'N/A'}</td>
                    <td>${data.patient_name || 'N/A'}</td>
                    <td>${data.patient_age || 'N/A'}</td>
                    <td>${data.patient_gender || 'N/A'}</td>
                </tr>
            </table>
        </div>
    
        <div class="section">
            <h2>Vital Signs</h2>
            <table>
                <tr>
                    <th>Temperature</th>
                    <th>Pulse Oximetry</th>
                    <th>Height</th>
                    <th>Weight</th>
                    <th>Blood Pressure</th>
                </tr>
                <tr>
                    <td>${data.patient_temperature || 'N/A'}</td>
                    <td>${data.patient_pulse_oxymentry || 'N/A'}</td>
                    <td>${data.patient_height || 'N/A'}</td>
                    <td>${data.patient_weight || 'N/A'}</td>
                    <td>${data.patient_blood_pressure || 'N/A'}</td>
                </tr>
            </table>
        </div>
    
        <div class="section">
            <h2>Chief Complaints</h2>
            <p>${data.patient_cheif_complaints || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Medical History</h2>
            <p>${data.history_of_illness || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Medication History</h2>
            <p>${data.past_medication || 'N/A'}</p>
        </div>
        <div class="section">
            <h2>Patient Assessment</h2>
            <p>${data.patient_assessment || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Treatment Plans</h2>
            <p>${data.plans || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Prescription</h2>
            <p>${data.new_prescription || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Allergies</h2>
            <p>${data.relevant_allergies || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Current Medications</h2>
            <p>${data.relevant_medications || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Procedure</h2>
            <p>${data.procedure || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Surgical History</h2>
            <p>${data.surgical_history || 'N/A'}</p>
        </div>
    
        <div class="section">
            <h2>Transcription</h2>
            <p>${data.transcription_text || 'N/A'}</p>
        </div>
    
        <!-- Add more sections as needed -->
    
        <div class="section">
            <h2>Report Information</h2>
            <table>
                <tr>
                    <th>Created At</th>
                    <th>Signature</th>
                </tr>
                <tr>
                    <td>${data.created_at || 'N/A'}</td>
                    <td></td>
                </tr>
            </table>
        </div>
    </body>
    </html>
    

`};
module.exports = {report_data};