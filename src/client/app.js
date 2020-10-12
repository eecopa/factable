import React, { useState, useEffect, useRef } from "react";
import styled from "styled-components";
import Style from "./style";
import classNames from "classnames";
import storeFactory from "../server/store";

const namespace = `ui-app`;
const nsClassName = (name) => `${namespace}__${name}`;

const parseJson = (str) => {
  try {
    return JSON.parse(str);
  } catch (ex) {
    return null;
  }
};

const AppPrestyled = ({ className }) => {
  const [stateInited, setInited] = useState(false);
  const [dataStore, setDataStore] = useState({});
  const ws = useRef(null);
  const reconect_timeout = useRef(null);

  const onStateChange = (newState) => {
    setDataStore(newState);
  };

  const onStateGet = () => dataStore;

  const store = storeFactory({ onStateChange, onStateGet });

  const onSocketMessage = (e) => {
    const data = parseJson(e.data);
    if (
      data &&
      data.type &&
      data.type === "registerFunctionCall" &&
      data.payload &&
      data.payload.hash
    ) {
      store.onMessage(data.payload);
    }

    if (
      data &&
      data.type &&
      data.type === "init" &&
      data.payload &&
      !stateInited
    ) {
      setInited(true);
      store.initState(data.payload);
    }
  };

  const connect = () => {
    ws.current = new WebSocket("ws://localhost:8888");
    ws.current.onopen = () => {
      if (reconect_timeout.current) {
        clearTimeout(reconect_timeout.current);
      }
    };
    ws.current.oncerror = () => {
      reconect_timeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };
    ws.current.onclose = () => {
      reconect_timeout.current = setTimeout(() => {
        connect();
      }, 3000);
    };
  };

  useEffect(() => {
    connect();
    return () => {
      ws.current.close();
    };
  }, []);

  useEffect(() => {
    if (!ws.current) return;
    ws.current.onmessage = onSocketMessage;
  }, [dataStore]);

  return (
    <Style>
      <div className={classNames(namespace, className)}>
        <ul className={nsClassName(`list`)}>
          {Object.keys(dataStore).map((key, i) => {
            return <li key={`${key}`}>{key}</li>;
          })}
        </ul>
      </div>
    </Style>
  );
};

export const App = styled(AppPrestyled)`
  width: 100%;
  margin: 0;
  padding: 0;
  /* background-color: orange; */

  .${nsClassName(`list`)} {
    color: #1890ff;
    font-size: 12px;
    margin: 30px;
    padding: 0;
    font-weight: bold;

    list-style: none;

    li {
      /* background-color: pink; */
      border: solid grey 1px;
      padding: 5px;

      &:not(:last-child) {
        border-bottom: none;
      }
    }
  }
`;

export default App;
