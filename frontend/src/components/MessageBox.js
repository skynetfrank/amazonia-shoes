import React from 'react';

function MessageBox(props) {
  return (
    <div className={`alert alert-${props.variant || 'info'}`}>
      <i className="fas fa-exclamation-triangle "></i> {props.children}
    </div>
  );
}

export default MessageBox;
