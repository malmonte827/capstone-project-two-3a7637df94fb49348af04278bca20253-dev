import React from "react";

/** 
 * Alert component provides alert feedback messages to other components
 */

function Alert({ type = "danger", messages = [] }) {
    return (
        <div className={`alert alert-${type}`} role="alert">
            {messages.map((error) => (
                <p className="mb-0 small" key={error}>
                    {error}
                </p>
            ))}
        </div>
    );
}

export default Alert;
