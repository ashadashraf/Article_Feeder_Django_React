import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import ListGroup from 'react-bootstrap/ListGroup';
import Row from 'react-bootstrap/Row';
import Tab from 'react-bootstrap/Tab';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/esm/Button';
import Card from 'react-bootstrap/Card';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { CenteredModal } from './CenteredModal';
import ArticlePreference from './ArticlePreference';


function Settings() {
    const [userData, setUserData] = useState(null);
    const [myArticles, setMyArticles] = useState(null);
    const [modalShow, setModalShow] = useState(false);
    const authDataString = localStorage.getItem('auth-token');
    const authData = JSON.parse(authDataString)
    const token = authData.token;
    const userId = authData.userId;
    const history = useHistory();
    
    const handleChangeUserDetails = async () => {
        if (userData.password !== userData.confirmPassword) {
            return alert("password must match.");
        }
        try {
            const data = {
                email: userData.email,
                password: userData.password,
                confirm_password: userData.confirmPassword,
            };

            const response = await axios.put(`http://127.0.0.1:8000/api/user/updatedata/${userId}/`, data, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("User data updated successfully", response.data);
        } catch (error) {
            console.error("An error occurred while updating user data:", error);
            if (error.response) {
                console.error("An error occurred while updating user data. Server responded with:", error.response.status);
                console.error("Error Data:", error.response.data);
                alert(error)
            }
        }
    }

    const displayArticles = async function () {
        try {
            const response = await axios.get(`http://localhost:8000/article/myarticles/${userId}/`, null, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("Show all my articles success", response);
            setMyArticles(response.data);
        } catch (error) {
            if (error.response) {
                console.error("An error occurred while retrieving all my articles. Server responded with:", error.response.status);
                console.error("Error Data:", error.response.data);
                if (error.response.data.detail === "User not found") {
                    history.push('/login');
                }
            } else if (error.request) {
                console.error("An error occurred. No response received.");
            } else {
                console.error("An error occurred:", error.message);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`http://127.0.0.1:8000/api/user/data/${userId}/`, {
                    headers: {
                        'Content-Type': "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                });
                console.log('userData', response.data);
                setUserData(response.data);
            } catch (error) {
                if (error.response) {
                    console.error("An error occurred while updating user data. Server responded with:", error.response.status);
                    console.error("Error Data:", error.response.data);
                }
            }
        }
        fetchData();
        displayArticles();
    }, [userId, token]);
    console.log('arttt', myArticles)
    return (
        <React.Fragment>
            <Tab.Container id="list-group-tabs-example" defaultActiveKey="#my-articles">
            <div className="row" style={{width: "500px"}}>
                <div className="col-4">
                    <ListGroup>
                        <ListGroup.Item action href="#user-details">
                        Change user details
                        </ListGroup.Item>
                        <ListGroup.Item action href="#my-articles">
                        My Articles
                        </ListGroup.Item>
                        <ListGroup.Item action href="#edit-article">
                        Article preferences
                        </ListGroup.Item>
                    </ListGroup>
                </div>
                <div className="col-8">
                    <Tab.Content>
                        <Tab.Pane eventKey="#user-details">
                        <Form onSubmit={() => handleChangeUserDetails()}>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label>Email address</Form.Label>
                                <Form.Control type="email" value={userData ? userData.email : ''} onChange={(e) => setUserData({...userData, email: e.target.value})} placeholder="name@example.com" />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Password</Form.Label>
                                <Form.Control type='password' value={userData ? userData.password : ''} onChange={(e) => setUserData({...userData, password: e.target.value})} required rows={3} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Confirm Password</Form.Label>
                                <Form.Control type='password' value={userData ? userData.confirmPassword : ''} onChange={(e) => setUserData({...userData, confirmPassword: e.target.value})} required rows={3} />
                            </Form.Group>
                            <Button type='submit'>Update</Button>
                        </Form>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#my-articles">
                        <div className="row">
                            {myArticles && myArticles.map((article) => (
                                <div className="col-5 p-0 m-0" key={article.id}>
                                    <Card style={{ width: '100%', height: 'auto', backgroundImage: `url(${article.image})`, backgroundSize: 'cover', cursor: 'pointer' }}
                                            onClick={() => setModalShow(true)}>
                                        <Card.Body>
                                            <h6>{article.name.length > 25 
                                                    ? `${article.name.substring(0, 25)}...`
                                                    : article.name}
                                            </h6>
                                            <small>
                                                {article.description.length > 25 
                                                    ? `${article.description.substring(0, 25)}...`
                                                    : article.description}
                                            </small>
                                        </Card.Body>
                                    </Card>
                                    <CenteredModal
                                        show={modalShow}
                                        onHide={() => setModalShow(false)}
                                        article={article}
                                    />
                                </div>
                            ))}
                        </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="#edit-article"><ArticlePreference /></Tab.Pane>
                    </Tab.Content>
                </div>
            </div>
            </Tab.Container>
        </React.Fragment>
    );
}

export default Settings