import React from 'react';
import CodeEditor from './CodeEditor/CodeEditor';
import Lobby from './Lobby/Lobby';


const Workspace: React.FC = () => {

    return (
        <div className='flex gap-2 justify-between items-center w-full bg-red-400 '>
            <CodeEditor />
            <Lobby />
        </div>
    )
}
export default Workspace;