import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { useHistory } from 'react-router-dom';
import axios from 'axios';

export function ArticlePreference() {
    const [allCategories, setAllCategories] = useState([]);
    const history = useHistory();

    const authDataString = localStorage.getItem('auth-token');
    const authData = JSON.parse(authDataString);

    const user_token = authData ? authData.token : history.push('/login');
    const userId = authData.userId;
    const headers = {
        'Content-Type': "multipart/form-data",
        Authorization: `Bearer ${user_token}`,
    };

    const handlePreference = async (categoryId) => {
        try {
            const data = {
                category_id: categoryId,
            };
            console.log('sss',data.category_id);
            const response = await axios.put(`http://127.0.0.1:8000/api/user/addremovepreference/${userId}/`, data, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            console.log(response.data);
            setAllCategories((prevCategories) => {
                return prevCategories.map((category) => {
                    if (response.data.article.category_preference.includes(category.id)) {
                        return {...category, status:true};
                    } else {
                        return {...category, status:false};
                    }
                });
            });
            console.log("User category preference: success");
        } catch (error) {
            console.error("User category preference: failed", error);
            if (error.response) {
                console.error("An error occurred while updating user data. Server responded with:", error.response.status);
                console.error("Error Data:", error.response.data);
            }
        }
    }
    
    async function fetchData() {
        try {
            const response = await axios.get('http://127.0.0.1:8000/article/allcategories');
            console.log(response.data);

            const categoriesArray = response.data.map((category) => ({
                id: category.id,
                name: category.name,
                status: false,
            }));
            setAllCategories(categoriesArray);

            console.log("Fetch all categories: success");
        } catch (error) {
            console.error("An error occurred while fetching categories", error);
        }
    }
    useEffect(() => {
        console.log('www', allCategories);
        fetchData();
    }, []);

    return (
        <>
        <div className="row">
            {allCategories.map((category) => (
                <div className="col">
                    {category.status 
                        ? <Button onClick={() => handlePreference(category.id)} style={{margin: '4px', backgroundColor: 'navy'}} key={category.id}>{category.name}</Button> 
                        : <Button onClick={() => handlePreference(category.id)} style={{margin: '4px'}} key={category.id}>{category.name}</Button> 
                    }
                </div>
            ))}
        </div>
        <div className='mt-3 d-flex justify-content-center'>            
            <Button size='sm' className='bg-dark border-dark' onClick={() => history.push('/')}>Done</Button>
        </div>
        </>
    );
}

export default ArticlePreference;