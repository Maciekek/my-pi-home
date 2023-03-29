import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

class CustomModal extends React.PureComponent {
  state = {
    submitChildForm: () => {},
  };

  setSubmitCallback = (callback) => {
    this.setState({
      submitChildForm: callback,
    });
  };

  render() {
    return (
      <Modal {...this.props} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">{this.props.title}</Modal.Title>
        </Modal.Header>
        {React.cloneElement(this.props.children, {
          locationId: this.props.locationId,
          onMount: (a) => this.setSubmitCallback(a),
          hideModal: this.props.onHide,
        })}
      </Modal>
    );
  }
}

export { CustomModal };
