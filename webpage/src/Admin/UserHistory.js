import { useLocation, useParams } from 'react-router-dom';

function UserHistory() {
  const location = useLocation();
  const params = useParams();

  // Get the user id from route params
  const userId = params.id;

  // Get the history data from state
  const historyData = location.state?.history;

  // Handle case where history data or id was not passed correctly
  if (!userId || !historyData) {
    return (
      <div>
        <h1>Error</h1>
        <p>Invalid user ID or history data.</p>
      </div>
    );
  }

  // Display the history data
  return (
    <div>
      <h1>User ID: {userId}</h1>
      <h2>Purchase History:</h2>
      <pre>{JSON.stringify(historyData, null, 2)}</pre>
    </div>
  );
}

export default UserHistory;

