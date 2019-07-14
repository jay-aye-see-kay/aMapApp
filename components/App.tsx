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
    `}</style>
  </main>
)
