import React from 'react';

const Alert = ({ message, onClose }) => {
  return (
    <div style={styles.alertContainer}>
      <div style={styles.alertBox}>
        <span>{message}</span>
        <button onClick={onClose} style={styles.closeButton}>X</button>
      </div>
    </div>
  );
};

const styles = {
  alertContainer: {
    position: 'fixed',
    top: 100,
    left: 0,
    width: '100%',
    height: '30%',
    display: 'flex',
    justifyContent: 'center',
    zIndex: 1000,
  },
  alertBox: {
    background: '#f8d7da',
    color: '#721c24',
    padding: '10px 20px',
    borderRadius: '5px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '50%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  closeButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Alert;
