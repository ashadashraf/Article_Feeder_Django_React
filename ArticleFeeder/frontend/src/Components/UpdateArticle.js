import axios from 'axios';
import { useState, useEffect } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import {useHistory} from 'react-router-dom';

function UpdateArticle(props) {
    console.log(props)
    const [displayCategories, setDisplayCategories] = useState({});
    const [isCategorySelected, setIsCategorySelected] = useState(false);
    const history = useHistory();

    const initialFormData = {
        user: (props.article && props.article.author) || '',
        name: (props.article && props.article.name) || '',
        description: (props.article && props.article.description) || '',
        image: (props.article && props.article.image) || null,
        tags: (props.article && props.article.tags) || '',
        category: (props.article && props.article.category) || null,
    };
    const [formData, setFormData] = useState(initialFormData);
    const [token, setToken] = useState(null);

    useEffect(() => {
        async function fetchData() {
            try {
                const authDataString = localStorage.getItem('auth-token');
                const authData = JSON.parse(authDataString);

                const user_id = authData ? authData.userId : history.push('/login');
                setToken(authData.token);

                console.log(user_id);
                if (user_id) {
                    formData.user = user_id;
                }
                const response = await axios.get('http://127.0.0.1:8000/article/allcategories');
                console.log(response.data);

                const categoriesObject = {};

                response.data.forEach((category) => {
                    categoriesObject[category.id] = category.name;
                });

                setDisplayCategories(categoriesObject);

                console.log("Fetch all categories: success");
            } catch (error) {
                console.error("An error occurred while fetching categories", error);
            }
        }

        console.log(displayCategories);
        fetchData();
    }, []);

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!isCategorySelected) {
            alert("Please select at least one category");
            console.error('Please select at least one category.');
            return;
        }

        console.log(token)
        const formDataToSend = new FormData();
        formDataToSend.append('author', formData.user);
        formDataToSend.append('name', formData.name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('image', formData.image);
        formDataToSend.append('tags', formData.tags);
        formDataToSend.append('category', formData.category);
        console.log(formData);
        console.log(formDataToSend.user);
        try {
            const response = await axios.post('http://127.0.0.1:8000/article/update/article/', formDataToSend, {
                headers: {
                    "Content-Type": "multipart/form-data",
                    "Authorization": `Bearer ${token}`,
                },
            });
            console.log("Article updated successfully", response);
        } catch (error) {
            if (error.response) {
                console.error("An error occurred while updating the article. Server responded with:", error.response.status);
                console.error("Error Data:", error.response.data);
            } else if (error.request) {
                console.error("An error occurred. No response received.");
            } else {
                console.error("An error occurred:", error.message);
            }
        }
        
    };

    const handleFileChange = (e) => {
        setFormData({
            ...formData,
            image: e.target.files[0],
        });
    };

    return (
        <div className="bg-primary p-4" style={{maxWidth: "600px"}} >
            <Form onSubmit={handleFormSubmit}>
                <Form.Group as={Row} className="mb-3 d-flex justify-content-between" controlId="formName">
                    <Form.Label column sm="2">
                        Name
                    </Form.Label>
                    <Col sm="8">
                        <Form.Control
                            type='text'
                            placeholder='Name'
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 d-flex justify-content-between" controlId="formDescription">
                    <Form.Label column sm="2">
                        Description
                    </Form.Label>
                    <Col sm="8">
                        <Form.Control
                            as='textarea'
                            placeholder='Description'
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 d-flex justify-content-between" controlId="formImage">
                    <Form.Label column sm="2">
                        Image
                    </Form.Label>
                    <Col sm="8">
                        <Form.Control type="file" name='image' accept='image/*' onChange={handleFileChange} />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 d-flex justify-content-between" controlId="formTags">
                    <Form.Label column sm="2">
                        Tags
                    </Form.Label>
                    <Col sm="8">
                        <Form.Control
                            type='text'
                            placeholder='Tags'
                            value={formData.tags}
                            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        />
                    </Col>
                </Form.Group>

                <Form.Group as={Row} className="mb-3 d-flex justify-content-between" controlId="formCategory">
                    <Form.Label column sm="2">
                        Category
                    </Form.Label>
                    <Col sm="8">
                        {Object.keys(displayCategories).map((categoryId) => (
                            <Form.Check
                                key={categoryId}
                                type="radio"
                                label={displayCategories[categoryId]}
                                value={categoryId}
                                name="category"
                                checked={formData.category === Number(categoryId)}
                                onChange={(e) => {
                                    setFormData({ ...formData, category: Number(e.target.value) });
                                    setIsCategorySelected(true);
                                }}
                            />
                        ))}
                    </Col>
                </Form.Group>

                <div className="text-center">
                    <button type='submit' className="btn btn-danger">Update</button>
                </div>
            </Form>
        </div>
    );
}

export default UpdateArticle;
