import React from 'react';
import '../Css/AIOptimizeToggle.css';

const AIOptimizeToggle = ({ checked, onChange, label = "AI refine" }) => {
    return (
        <label className="ai-optimize-toggle-component">
            <span className="toggle-label">{label}</span>
            <div className="toggle-switch">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={onChange}
                />
                <span className="toggle-slider"></span>
            </div>
        </label>
    );
};

export default AIOptimizeToggle;
