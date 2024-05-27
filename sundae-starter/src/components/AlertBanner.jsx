import { Alert } from 'react-bootstrap';

const AlertBanner = ({ msg }) => {
	return (
		<Alert key='danger' variant='danger'>
			{msg}
		</Alert>
	);
};
export default AlertBanner;
