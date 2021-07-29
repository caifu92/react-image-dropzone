import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

import Header from './components/Header';
import Dropzone from './components/Dropzone';

const App = (): JSX.Element => {
    const [url, setUrl] = useState<string>('');

    const onChange = (newUrl: string): void => {
        setUrl(newUrl);
    }

    return (
        <div className="App">
            <Header />
            <Dropzone value={url} onChange={onChange} />
        </div>
    );
}

export default App;
