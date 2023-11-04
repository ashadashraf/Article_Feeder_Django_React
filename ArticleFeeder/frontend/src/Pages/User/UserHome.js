import React, { useEffect } from 'react'
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import ExploreArticles from "../../Components/ExploreArticles"
import AddArticle from '../../Components/AddArticle';
import {useHistory} from 'react-router-dom';
import jwt from 'jsonwebtoken';
import Settings from '../../Components/Settings';

const UserHome = () => {
    const history = useHistory();
    
    const handleLogout  = () => {
        localStorage.removeItem('auth-token');
        history.push('/login');
    }

    useEffect(() => {
        const authDataString = localStorage.getItem('auth-token');
        const authData = JSON.parse(authDataString);
        if (!authData) {
            history.push('/login');
            return;
        }
        const decodedToken = jwt.decode(authData.token, {complete:true});
        if (!decodedToken) {
            history.push('/login');
        } else {
            const currentTimestamp = Math.floor(Date.now() / 1000);
            if (decodedToken.payload.exp && decodedToken.payload.exp < currentTimestamp) {
                history.push('/login');
            }
        }
    }, [history]);

    return (
        <div className='d-flex justify-content-center w-100'>
            <div>
            <Tabs
                defaultActiveKey="home"
                id="uncontrolled-tab-example"
                className="mb-3 d-flex justify-content-center bg-dark"
                >
                <Tab eventKey="home" title="Home">
                    <ExploreArticles />
                </Tab>
                <Tab eventKey="add" title="Add">
                    <AddArticle />
                </Tab>
                <Tab eventKey="settings" title="Settings">
                    <Settings />
                </Tab>
            </Tabs>
            <div className='mt-5 d-flex justify-content-center'>
                <button onClick={() => handleLogout()} className='bg-danger'>Logout</button>
            </div>
            </div>
        </div>
    )
}

export default UserHome