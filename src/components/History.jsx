import React, { useEffect, useState } from 'react';
import { ListGroup, ListGroupItem, Form } from 'react-bootstrap';
import { database, ref, onValue } from '../firebase'; // Import Firebase setup

const History = () => {
  const [historyData, setHistoryData] = useState([]);
  const [filterAction, setFilterAction] = useState('all'); // Default action filter
  const [filterDate, setFilterDate] = useState(''); // Default date filter

  // Function to fetch data from Firebase
  useEffect(() => {
    const historyRef = ref(database, 'rem_actions'); // Reference to the 'rem_actions' node in Firebase

    const unsubscribe = onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      const actions = [];
      if (data) {
        // Convert the data from Firebase into a usable array
        for (const key in data) {
          if (data.hasOwnProperty(key)) {
            // Convert date format from mm/dd/yyyy to dd/mm/yyyy
            const timestamp = new Date(data[key].timestamp);
            const formattedDate = `${String(timestamp.getDate()).padStart(2, '0')}/${String(timestamp.getMonth() + 1).padStart(2, '0')}/${timestamp.getFullYear()} ${String(timestamp.getHours()).padStart(2, '0')}:${String(timestamp.getMinutes()).padStart(2, '0')}`; // Format: dd/mm/yyyy hh:mm
            actions.push({
              action: data[key].action,
              timestamp: formattedDate, // Use the new formatted date
              originalDate: data[key].timestamp // Store the original timestamp for filtering
            });
          }
        }
        setHistoryData(actions.reverse()); // Reverse the array for most recent actions first
      }
    });

    return () => {
      unsubscribe(); // Cleanup the listener on unmount
    };
  }, []);

  // Filter history data based on selected filters
  const filteredData = historyData.filter(item => {
    // Filter by action
    const actionMatch = filterAction === 'all' || (filterAction === 'open' ? item.action.includes('Mở') : item.action.includes('Đóng'));
    
    // Convert filter date from yyyy-mm-dd to dd/mm/yyyy for comparison
    const dateFilterFormatted = filterDate ? 
      `${String(new Date(filterDate).getDate()).padStart(2, '0')}/${String(new Date(filterDate).getMonth() + 1).padStart(2, '0')}/${new Date(filterDate).getFullYear()}` 
      : '';

    // Filter by date
    const dateMatch = dateFilterFormatted ? item.timestamp.startsWith(dateFilterFormatted) : true;

    return actionMatch && dateMatch; // Return true if both filters match
  });

  return (
    <div className="p-4 bg-white shadow-sm mt-4">
      <h4>Lịch sử</h4>
      <Form className="mb-3">
        <Form.Group controlId="filterSelect">
          <Form.Label>Lọc theo hành động:</Form.Label>
          <Form.Select
            value={filterAction}
            onChange={(e) => setFilterAction(e.target.value)} // Update action filter based on selection
          >
            <option value="all">Tất cả</option>
            <option value="open">Mở cửa</option>
            <option value="close">Đóng cửa</option>
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="filterDate">
          <Form.Label>Lọc theo ngày:</Form.Label>
          <Form.Control
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)} // Update date filter based on selection
          />
        </Form.Group>
      </Form>
      <div style={{ maxHeight: '400px', overflowY: 'auto' }}> {/* Set height and enable scroll */}
        <ListGroup>
          {filteredData.map((item, index) => (
            <ListGroupItem key={index}>
              <span className={item.action.includes('Đóng') ? "text-danger" : "text-success"}>●</span>
              {item.action} - {item.timestamp}
            </ListGroupItem>
          ))}
        </ListGroup>
      </div>
    </div>
  );
};

export default History;
