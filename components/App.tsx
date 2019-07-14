import React from 'react';

import { AddBussinessModal } from './AddBussinessModal';
import { Header } from './Header';

const HEADER_HEIGHT = 56;

type Props = {
  children: any;
};

export const App = ({ children }: Props) => {
  const [modalVisible, setModalVisible] = React.useState<boolean>(false);
  const hideModal = () => setModalVisible(false);
  const showModal = () => setModalVisible(true);

  return (
    <main>
      <AddBussinessModal show={modalVisible} onHide={hideModal} />
      <div style={{ height: HEADER_HEIGHT }}>
        <Header addBussiness={showModal} />
      </div>
      <div style={{ height: `calc(100vh - ${HEADER_HEIGHT}px)`, position: 'relative' }}>
        {children}
      </div>
      <style jsx global>{`
        html, body {
          margin: 0;
          padding: 0;
        }
        .marker {
          background-color: black;
          background-size: cover;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          cursor: pointer;
        }
        .mapboxgl-popup {
          max-width: 200px;
        }
        .mapboxgl-popup-content {
          text-align: center;
          font-family: 'Open Sans', sans-serif;
        }
      `}</style>
    </main>
  );
};

