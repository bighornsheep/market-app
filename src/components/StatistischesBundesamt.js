import React from 'react';
import { useState, useEffect } from 'react';
import { ThreeDot } from 'react-loading-indicators';
import { userDownloadAWSUpload } from "../utils"
import bundesamt from '../assets/images/destatis-react.svg';

const years = [];
const currentYear = new Date().getFullYear();
for (let i = 2018; i <= currentYear; i++) {
	years.push(i);
}

export default function StatistischesBundesamt() {

	const [status, setStatus] = useState(''); // state to manage status message
	const [loading, setLoading] = useState(false); // state to manage loading indicator
	const [selectedStartYear, setSelectedStartYear] = useState('');
	const [selectedEndYear, setSelectedEndYear] = useState('');

	useEffect(() => {
		const currentDate = new Date();
		let year = currentDate.getFullYear();
		setSelectedStartYear(year);
		setSelectedEndYear(year);
	}, []);

	const handleStartYearChange = (e) => {
		setSelectedStartYear(e.target.value);
	};

	const handleEndYearChange = (e) => {
		setSelectedEndYear(e.target.value);
	};

	const downloadData = () => {
		setLoading(true);
		setStatus('Fetching');

		const username = process.env.REACT_APP_BUNDESAMT_USERNAME;
		const password = process.env.REACT_APP_BUNDESAMT_PASSWORD;
		const tablename = "51000-0012";
		const measures = "GEWA,WERTAS"; // GEWA - Export Weight, WERTAS - Export Value (US Dollar)
		// compress - Disables/Enables the suppression of blank lines and blank columns.
		const startyear = selectedStartYear;
		const endyear = selectedEndYear;
		const timeslices = "";
		const format = "xlsx";
		const countryselectioncode = "STLAH";
		const codetype = "WAM6";
		const code = "WA310420";
		
		// STLAH - country filter
		// WAM6 - product code type - 6 digit
		// WA310420 - product code for Potassium Chloride KCL
		const url = (
			"https://www-genesis.destatis.de/genesisWS/rest/2020/data/tablefile?" + 
			`&username=${username}` +
			`&password=${password}` +
			`&name=${tablename}` +
			`&area=all` +
			`&contents=${measures}` +
			`&compress=false` +
			`&transpose=false` +
			`&startyear=${startyear}` +
			`&endyear=${endyear}` +
			`&timeslices=${timeslices}` +
			`&regionalvariable=` +
			`&regionalkey=` +
			`&classifyingvariable1=${countryselectioncode}` +
			`&classifyingkey1=*` +
			`&classifyingvariable2=${codetype}` +
			`&classifyingkey2=${code}` +
			`&classifyingvariable3=` +
			`&classifyingkey3=` +
			`&format=${format}` +
			`&job=false` +
			`&stand=01.01.1970` +
			`&language=en`
		)
		
		const fileName = `Germany export data from ${startyear} to ${endyear}`
		fetch(url)
		.then((response) => response.blob())
		.then((blob) => {
			setStatus('Success! Downloading...');
			userDownloadAWSUpload(blob, fileName);
			setLoading(false); // reset loading indicator
		})
		.catch((error) => {
			console.error('Error fetching data:', error);
			setStatus('Error! Check inputs or contact support.');
			setLoading(false); // reset loading indicator
		});
	};

	return (
		<div className='German-half'>
			<img src={bundesamt} className="Bundesamt-logo" alt="logo" />

			<div className="segmented-buttons">
				<button
				className='active'
				onClick={() => {}}
				>
					{true && <span className="checkmark">&#10003;&nbsp;</span>}
					Export
				</button>
				<button
				className=''
				onClick={() => {}}
				style={{color: "#CCCCCC"}}
				>
					{false && <span className="checkmark">&#10003;&nbsp;</span>}
					Import
				</button>
			</div>

			<p></p>

			<div className="german-month-selection">
				Start Year:&nbsp;
				<label htmlFor="year">&nbsp;&nbsp;</label>
				<select id="year" value={selectedStartYear} onChange={handleStartYearChange}>
					{years.map((year, index) => (
						<option key={index} value={year} style={{backgroundColor: "#4D4C4C", color: "snow"}}>{year}</option>
					))}
				</select>

				<p></p>
				
				&nbsp;&nbsp;End Year:&nbsp;
				<label htmlFor="year">&nbsp;&nbsp;</label>
				<select id="year" value={selectedEndYear} onChange={handleEndYearChange}>
					{years.map((year, index) => (
						<option key={index} value={year} style={{backgroundColor: "#4D4C4C", color: "snow"}}>{year}</option>
					))}
				</select>
			</div>

			<div>
				<button className="get-data-button" onClick={downloadData} disabled={loading}>
					Get Data
				</button>
				<div>
					{status}
					{loading && 
						<span>
							&nbsp;
							<ThreeDot variant="pulsate" color="#FFFAFA" size="medium" style={{ fontSize: "8px" }}/>
						</span>
					}
				</div>
			</div>
		</div>
	)
}