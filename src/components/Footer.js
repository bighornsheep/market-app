import './Footer.scss';
import amongus from '../assets/images/among-us.svg';

export default function Footer() {
	return (
		<div className="footer">
			Commercial &bull; Data, Analytics & Optimization
			<img src={amongus} className="amongus-icon" alt="amongus" />
		</div>
	)
}