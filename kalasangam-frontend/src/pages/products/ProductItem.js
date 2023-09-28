import React, { useState, useContext } from 'react';

import Card from './ProductDisplayCard';
import Button from '../../reusable/FormElements/Button';
import Modal from '../../reusable/UIElements/Modal';
// import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../reusable/UIElements/ErrorModal';
import LoadingSpinner from '../../reusable/UIElements/LoadingSpinner';
import { AuthContext } from '../../reusable/context/auth-context';
import { useHttpClient } from '../../reusable/hooks/http-hook';
import './ProductItem.css';

const ProductItem = props => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const auth = useContext(AuthContext);
//   const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

//   const openMapHandler = () => setShowMap(true);

//   const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
  };

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/products/${props.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDelete(props.id);
    } catch (err) {}
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {/* <Modal
        // show={showMap}
        // onCancel={closeMapHandler}
        // header={props.address}
        contentClass="product-item__modal-content"
        footerClass="product-item__modal-actions"
        // footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal> */}
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="product-item__modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={confirmDeleteHandler}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Do you want to proceed and delete this product? Please note that it
          can't be undone thereafter.
        </p>
      </Modal>
      <li className="product-item">
        <Card className="product-item__content">
          {isLoading && <LoadingSpinner asOverlay />}
          <div className="product-item__image">
            <img
              src={`http://localhost:5000/${props.image}`}
              alt={props.title}
            />
          </div>
          <div className="product-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="product-item__actions">
            {/* <Button inverse onClick={openMapHandler}>
              VIEW ON MAP
            </Button> */}
            {auth.userId === props.creatorId && (
              <Button to={`/products/${props.id}`}>EDIT</Button>
            )}

            {auth.userId === props.creatorId && (
              <Button danger onClick={showDeleteWarningHandler}>
                DELETE
              </Button>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default ProductItem;
