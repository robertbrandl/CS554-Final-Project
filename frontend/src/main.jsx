import React from "react";
import { BrowserRouter} from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./components/App/App";
import "./index.css";
import firebaseConfig from '../src/firebase/Firebase';
import {initializeApp} from 'firebase/app';


const app = initializeApp(firebaseConfig);
ReactDOM.createRoot(document.getElementById("root")).render(
    <BrowserRouter><App /></BrowserRouter>);
