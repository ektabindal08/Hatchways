import React, { useState, useEffect } from "react";
import Title from "../Title";
import axios from "axios";

import Loader from "react-loader";
import ReactModal from "react-modal";
import "./index.scss";

ReactModal.setAppElement("body");
function Modal(props) {
  const { closeModalCallBack, showModal, url } = props;
  const [isLoaded, setLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState({});

  const renderUserDetails = () => {
    const tempArr = [];
    Object.keys(userDetails).forEach((key) => {
      tempArr.push(
        <div className="row-data">
          <span className="key">{key}</span> :
          <span className="value b"> {userDetails[key]}</span>
        </div>
      );
    });
    return (<div className="user-details"><Title title={`${userDetails.name}`} />{tempArr}</div>);
  };
  useEffect(() => {
    axios.get(url).then((resp) => {
      setUserDetails(resp.data);
      setLoaded(true);
    });
  }, []);
  return (
    <ReactModal
      isOpen={showModal}
      contentLabel="onRequestClose Example"
      onRequestClose={closeModalCallBack}
      className="Modal modal-container"
      overlayClassName="Overlay"
    >
      <Loader loaded={isLoaded}>
        {isLoaded && (
            renderUserDetails()
        )}
        <button className="cancel-button" onClick={closeModalCallBack}>Close Modal</button>
      </Loader>
    </ReactModal>
  );
}
export default Modal;
