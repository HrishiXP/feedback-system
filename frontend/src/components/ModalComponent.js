import React from 'react';

function ModalComponent({ showModal, closeModal, modalMessage }) {
    if (!showModal) return null;

    return (
        <div className="modal show" style={{ display: 'block' }}>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">Message</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={closeModal}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <p>{modalMessage}</p>
                    </div>
                    <div className="modal-footer">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={closeModal}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalComponent;
