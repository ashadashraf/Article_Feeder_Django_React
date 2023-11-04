import axios from 'axios'
import React, { useEffect, useState } from 'react'
import Badge from 'react-bootstrap/Badge';
import Stack from 'react-bootstrap/Stack';

const AdminDashboard = () => {

    const [newCategory, setNewCategory] = useState('');
    
    const handleCreateCategory = async () => {
        try {
            const response = await axios.post('http://127.0.0.1:8000/article/create/category/', {
                name: newCategory
            });
            console.log("Category added", response);
            setNewCategory("");
        } catch (error) {
            console.error("An error occured", error);
            console.error("An error occured", error.response.data);
        }
    }
    const [displayCategories, setDisplayCategories] = useState([]);
    const getRandomColor = () => {
        const colors = ['primary', 'secondary', 'success', 'danger', 'warning', 'info', 'dark'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return randomColor;
    };

    useEffect(() => {
        const fetchAllCategories = async () => {
            try {
                const response = await axios.get('http://127.0.0.1:8000/article/allcategories/');
                console.log(response.data);
    
                const uniqueCategories = new Set();
    
                for (let i = 0; i < response.data.length; i++) {
                    uniqueCategories.add(response.data[i].name);
                }
    
                const categoriesArray = Array.from(uniqueCategories);
    
                setDisplayCategories(categoriesArray);
    
                console.log("Fetch all category: success");
            } catch (error) {
                console.log("An error occurred while fetching categories", error);
                console.log("An error occurred while fetching categories", error.response);
            }
        };
    
        fetchAllCategories();
    }, [setNewCategory]);

    return (
        <React.Fragment>
            <div className='mt-4 d-flex justify-content-center'>
                <div className="card w-50 bg-success">
                    <h3 className='d-flex justify-content-center mt-3'>Add Category</h3>
                    <input type="text" className='m-4' name="form-control category" id="category" value={newCategory} onChange={(e) => setNewCategory(e.target.value)} />
                    <button type='submit' className='m-3 btn btn-warning' onClick={handleCreateCategory}>Add category</button>
                </div>
            </div>
            <div className='w-100 mt-4 d-flex justify-content-center'>
                <Stack direction="horizontal" gap={2}>
                    {displayCategories.map((category, index) => (
                        <Badge key={index} bg={getRandomColor()}>{category}</Badge>
                    ))}
                </Stack>
            </div>
        </React.Fragment>
    )
}

export default AdminDashboard