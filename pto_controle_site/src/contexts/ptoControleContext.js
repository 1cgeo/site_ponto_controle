import * as React from 'react'

import { createContext, useContext } from 'react';
import PropTypes from 'prop-types';

const PtoControleContext = createContext('');

PtoControleProvider.propTypes = {
  children: PropTypes.node.isRequired
};

export default function PtoControleProvider({ children }) {

  const [data, setData] = React.useState(null);
  
  React.useEffect(() => {
    const fetchData = () => {
      fetch(`${process.env.REACT_APP_API_ADRESS}`)
        .then((response) => response.json())
        .then((result) => setData(result))
        .catch((error) => console.log("Ocorreu um erro!"));
      };

    fetchData();

  }, []);
 
  return (
    <PtoControleContext.Provider
      value={{
        data
      }}>
      {children}
    </PtoControleContext.Provider>
  );
}

export const usePtoControle = () => useContext(PtoControleContext)