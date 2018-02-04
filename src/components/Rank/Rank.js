import React from 'react';

const Rank = ({ name, entries}) => {
    return (
        <div>
            <div className = 'f3 white'>
                <p>
                    <span className = 'f2'>{name}</span>
                    , you have detected 
                    <span className = 'f2'> {entries} </span> images!
                </p>
            </div>
        </div>
    );
}

export default Rank;