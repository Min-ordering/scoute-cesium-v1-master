import React from 'react';
import { useHistory } from 'react-router-dom';

export default function ErrorBoundary(props) {
    const loggedInEmail = localStorage.getItem("zedex2020/email", null);
    const history = useHistory();
    const { children } = props;

    if (!loggedInEmail) history.push("/");

    return (
        <>{children}</>
    );
}