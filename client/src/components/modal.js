import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

class CustomModal extends React.PureComponent {

  state = {
    submitChildForm: () => {}
  };

  setSubmitCallback = (callback) => {
    this.setState({
      submitChildForm: callback
    })
  };

  onSubmit = () => {
    this.state.submitChildForm();
    this.props.onHide();
  };

  render() {
    return (
      <Modal
        {...this.props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            {this.props.title}
          </Modal.Title>
        </Modal.Header>
        {React.cloneElement(this.props.children,
          {
            locationId: this.props.locationId,
            onMount: (a) => this.setSubmitCallback(a)
          })}

        <Modal.Footer>
          <Button variant="success" onClick={this.onSubmit}>Dodaj</Button>
          <Button onClick={this.props.onHide}>Close</Button>
        </Modal.Footer>
      </Modal>
    )
  }
};


export {CustomModal};