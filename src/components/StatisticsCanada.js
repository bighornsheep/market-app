import React from 'react';
import { useState, useEffect } from 'react';
import { ThreeDot } from 'react-loading-indicators';
import { userDownloadAWSUpload } from "../utils"
import statscan from '../assets/images/statscan.svg';


const months = [
	"January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"
];

const monthNumbers = {
  'January': '01',
  'February': '02',
  'March': '03',
  'April': '04',
  'May': '05',
  'June': '06',
  'July': '07',
  'August': '08',
  'September': '09',
  'October': '10',
  'November': '11',
  'December': '12',
}

const years = [];
const currentYear = new Date().getFullYear();
for (let i = 2018; i <= currentYear; i++) {
  years.push(i);
}

export default function StatisticsCanada() {

	const [status, setStatus] = useState(''); // state to manage status message
	const [loading, setLoading] = useState(false); // state to manage loading indicator
	const [selectedOption, setSelectedOption] = useState('export'); // state to store the selected option
	const [selectedStartMonth, setSelectedStartMonth] = useState('');
	const [selectedStartYear, setSelectedStartYear] = useState('');
	const [selectedEndMonth, setSelectedEndMonth] = useState('');
	const [selectedEndYear, setSelectedEndYear] = useState('');

	useEffect(() => {
    const currentDate = new Date();
    let monthIndex = currentDate.getMonth() - 2; // Two months before the current month
    let year = currentDate.getFullYear();

    if (monthIndex < 0) {
      monthIndex += 12; // Adjust for negative index
      year -= 1; // Adjust year if necessary
    }

    setSelectedStartMonth(months[monthIndex]);
    setSelectedStartYear(year);

    setSelectedEndMonth(months[monthIndex]);
    setSelectedEndYear(year);

  }, []);

	const handleStartMonthChange = (e) => {
    setSelectedStartMonth(e.target.value);
  };

  const handleStartYearChange = (e) => {
    setSelectedStartYear(e.target.value);
  };

  const handleEndMonthChange = (e) => {
    setSelectedEndMonth(e.target.value);
  };

  const handleEndYearChange = (e) => {
    setSelectedEndYear(e.target.value);
  };
	
	// function to handle option selection
  const handleOptionChange = (option) => {
    setSelectedOption(option);
  };

  const handleCanadaClick = async () => {
		setLoading(true);
		setStatus('Fetching');

		// prepare AWS Lambda function URL
		const startPeriod = String(selectedStartYear) + "-" + (monthNumbers[selectedStartMonth]).slice(-2) + "-01";
		const endPeriod = String(selectedEndYear) + "-" + (monthNumbers[selectedEndMonth]).slice(-2) + "-01";
		
		const url = `https://2yresgtk2mvb4i2vg7bf6sfd5q0xqzuf.lambda-url.us-east-2.on.aws/?trade=${selectedOption}&startPeriod=${startPeriod}&endPeriod=${endPeriod}`
		const fileName = `Canada ${selectedOption} data from ${selectedStartMonth}-${selectedStartYear} to ${selectedEndMonth}-${selectedEndYear}`
		
		// call AWS Lambda function
		fetch(url)
		.then( response => response.json() )
		.then( data => {
			setStatus('Success! Preparing Download...');
			userDownloadAWSUpload(data, fileName);
			setLoading(false); // reset loading indicator
		})
		.catch( (error) => {
			console.error('Error fetching data:', error);
			setStatus('Error! Check inputs or contact support.');
			setLoading(false); // reset loading indicator
		});
	};

	return (
		<div className='Canadian-half'>
			<img src={statscan} className="Statscan-logo" alt="logo" />

			<div className="segmented-buttons">
				<button
				className={selectedOption === 'export' ? 'active' : ''}
				onClick={() => handleOptionChange('export')}
				>
					{selectedOption === 'export' && <span className="checkmark">&#10003;&nbsp;</span>}
					Export
        		</button>

				<button
				className={selectedOption === 'import' ? 'active' : ''}
				onClick={() => handleOptionChange('import')}
				>
					{selectedOption === 'import' && <span className="checkmark">&#10003;&nbsp;</span>}
					Import
				</button>
      		</div>

      		<p></p>

			<div className="canada-month-selection">
				Start:&nbsp;
				<label htmlFor="month"></label>
				<select id="month" value={selectedStartMonth} onChange={handleStartMonthChange}>
					{months.map((month, index) => (
					<option key={index} value={month} style={{backgroundColor: "#4D4C4C", color: "snow"}}>{month}</option>
					))}
				</select>

				<label htmlFor="year">&nbsp;&nbsp;</label>
				<select id="year" value={selectedStartYear} onChange={handleStartYearChange}>
					{years.map((year, index) => (
						<option key={index} value={year} style={{backgroundColor: "#4D4C4C", color: "snow"}}>{year}</option>
					))}
				</select>
			
				<p></p>

				&nbsp;&nbsp;End:&nbsp;
				<label htmlFor="month"></label>
				<select id="month" value={selectedEndMonth} onChange={handleEndMonthChange}>
					{months.map((month, index) => (
					<option key={index} value={month} style={{backgroundColor: "#4D4C4C", color: "snow"}}>{month}</option>
					))}
				</select>

				<label htmlFor="year">&nbsp;&nbsp;</label>
				<select id="year" value={selectedEndYear} onChange={handleEndYearChange}>
					{years.map((year, index) => (
						<option key={index} value={year} style={{backgroundColor: "#4D4C4C", color: "snow"}}>{year}</option>
					))}
				</select>
			</div>

			<div>
				<button className="get-data-button" onClick={handleCanadaClick} disabled={loading}>
					Get Data
				</button>
				<div>
					{status}
					{loading && 
						<span>&nbsp;
							<ThreeDot variant="pulsate" color="#FFFAFA" size="medium" style={{ fontSize: "8px" }}/>
						</span>
					}
				</div>
			</div>
		</div>
	)
}