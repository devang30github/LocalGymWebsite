import React, { useState, useEffect } from 'react';
import './ContactMessages.css';

const ContactMessages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  // Fetch messages from the backend
  useEffect(() => {
    const fetchMessages = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`http://localhost:3001/admin/contact-messages?page=${page}&limit=10`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('AdminToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }

        const data = await response.json();
        setMessages(data.messages || []);
        setTotalPages(data.totalPages || 0);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [page]);

  // Pagination handlers
  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  if (loading) return <p>Loading messages...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>User Feedback & Queries</h2>
      {messages.length > 0 ? (
        <>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Message</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg) => (
                <tr key={msg._id}>
                  <td>{msg.name}</td>
                  <td>{msg.email}</td>
                  <td>{msg.subject}</td>
                  <td>{msg.message}</td>
                  <td>{new Date(msg.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={prevPage} disabled={page === 1}>
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button onClick={nextPage} disabled={page === totalPages}>
              Next
            </button>
          </div>
        </>
      ) : (
        <p>No messages to display.</p>
      )}
    </div>
  );
};

export default ContactMessages;
