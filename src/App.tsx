import React, { useState } from 'react';
import './App.css'
import Main from './components/Main';


const App: any = () => {
    const [isOpen, setOpen] = useState(true)
    return (
        <div>
            <Main isOpen={isOpen}></Main>


        </div>
    );
};

export default App;