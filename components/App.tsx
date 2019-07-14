import React from 'react';

type Props = {
  children: any;
};

export const App = ({ children }: Props) => (
  <main>
    {children}
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
)
