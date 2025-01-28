import React from "react";

/** Alert component provides alert feedback messages to other components
 *
 * { SignupForm , LoginForm  }
 */

function Alert({ type = "danger", messages = [] }) {
    return (
        <div class={`alert alert-${type}`} role="alert">
            {messages.map((error) => (
                <p className="mb-0 small" key={error}>
                    {error}
                </p>
            ))}
        </div>
    );
}

export default Alert;
