import React from 'react';
import _ from 'lodash';

import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import {useDispatch, useSelector} from "react-redux";
import {closeModal} from "../store/actions/BehaviourActions";

const ConfirmationModal = () => {
  const dispatch = useDispatch();
  const isModalActive = useSelector(state => {
    return state.behaviourReducer.confirmationModalVisible;
  });

  const modalParams = useSelector(state => {
    return state.behaviourReducer.confirmationModalParams;
  });

  const onCancel = () => {
    dispatch(closeModal())
  };

  const onConfirm = () => {
    modalParams.onConfirmAction();
    dispatch(closeModal())
  };

  return (
    <Modal
      onHide={onCancel}
      size="lg"
      show={isModalActive}
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {
          modalParams.message
            ? modalParams.message
            : "Czy na pewnie chcesz wykonać operacje?"
        }
      </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={onConfirm} >Tak</Button>
          <Button variant="success" onClick={onCancel}>Nie - anuluj</Button>
        </Modal.Footer>
    </Modal>
  )
};

export {ConfirmationModal};