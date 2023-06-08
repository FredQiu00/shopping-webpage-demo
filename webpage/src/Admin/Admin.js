import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';

const Admin = () => {
  const navigate = useNavigate();

  return (
    <div>
      This is a placeholder for the admin page
      <Button className="back-button" onClick={() => navigate('/')}>
          Log off
      </Button>
    </div>
  )
};

export default Admin;