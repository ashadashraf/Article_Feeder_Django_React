import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { AiOutlineLike, AiOutlineDislike, AiFillLike, AiFillDislike } from 'react-icons/ai';
import {useHistory} from 'react-router-dom';

const ExploreArticles = () => {
    const [allArticles, setAllArticles] = useState([]);
    const [likeState, setLikeState] = useState([]);
    const [dislikeState, setDislikeState] = useState([]);
    const history = useHistory();

    const authDataString = localStorage.getItem('auth-token');
    const authData = JSON.parse(authDataString)
    const token = authData.token;
    const headers = {
        'Content-Type': "multipart/form-data",
        Authorization: `Bearer ${token}`,
    };

    const displayArticles = async function () {
        try {
            const authDataString = localStorage.getItem('auth-token');
            const authData = JSON.parse(authDataString)
            const response = await axios.get('http://localhost:8000/article/allarticles/', {
                headers: headers,
            });
            console.log("Show all article success", response);
            setAllArticles(response.data);

            const initialLikeState = new Array(response.data.length).fill(false);
            const initialDislikeState = new Array(response.data.length).fill(false);
            setLikeState(initialLikeState);
            setDislikeState(initialDislikeState);
        } catch (error) {
            if (error.response) {
                console.error("An error occurred while retrieving all articles. Server responded with:", error.response.status);
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

    const handleBlockUnblockArticle = async (articleId, index) => {
        try {
            const data = {
                author: false,
            }
            const response = await axios.put(`http://localhost:8000/article/user/blockarticle/${articleId}/`, data,{
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
            });
            const updatedArticles = [...allArticles];
            if (response.data.detail === "Article blocked successfully.") {
                console.log("Article Blocked Successfully", response);
                updatedArticles[index].user_has_blocked_article = true;
            } else if (response.data.detail === "Article unblocked successfully.") {
                console.log("Article Unblocked Successfully", response);
                updatedArticles[index].user_has_blocked_article = false;
            } else {
                console.log("Error in Updating article block", response);
            }
            setAllArticles(updatedArticles);
            displayArticles();
        } catch (error) {
            console.error("An error occurred while disliking the article. Server responded with:", error.response.status);
            if (error.response) {
                return console.error("Error Data:", error.response.data);
            } else if (error.request) {
                return console.error("An error occurred. No response received.");
            } else {
                return console.error("An error occurred:", error.message);
            }
        }
    }

    const handleLikeDislike = async (articleId, index, type) => {
        try {
            const response = await axios.put(`http://localhost:8000/article/likedislike/${articleId}/${type}/`, null,{ headers });
            if (type === 'like') {
                if (response.data.detail === "Article like removed successfully.") {
                    console.log("Article like removed successfully", response);
                } else if (response.data.detail === "Article like added successfully.") {
                    console.log("Article like added successfully", response);
                }
            } else if (type === 'dislike') {
                if (response.data.detail === "Article dislike removed successfully.") {
                    console.log("Article dislike removed successfully", response);
                } else if (response.data.detail === "Article dislike added successfully.") {
                    console.log("Article dislike added successfully", response);
                }
            }
            const newLikeState = [...likeState];
            newLikeState[index] = {
                userLikesArticle: response.data.article.user_likes_article,
                likeCount: response.data.article.like_count
            };
            setLikeState(newLikeState);
            console.log(likeState);
            
            const newDislikeState = [...dislikeState];
            newDislikeState[index] = {
                userDislikesArticle: response.data.article.user_dislikes_article,
                dislikeCount: response.data.article.dislike_count
            };
            setDislikeState(newDislikeState);
            console.log(dislikeState);
        } catch (error) {
            console.log(likeState);
            console.log(dislikeState);
            if (error.response) {
                if (type === 'like') {
                    console.error("An error occurred while liking the article. Server responded with:", error.response.status);
                } else if (type === 'dislike') {
                    console.error("An error occurred while disliking the article. Server responded with:", error.response.status);
                }
                console.error("Error Data:", error.response.data);
            } else if (error.request) {
                console.error("An error occurred. No response received.");
            } else {
                console.error("An error occurred:", error.message);
            }
        }
    }

    useEffect(() => {
        displayArticles();
    }, []);
    
    return (
        <div>
        {Array.isArray(allArticles) &&
            allArticles.map((article, index) => (
                <Card className="text-center mt-3" style={{maxWidth: "500px"}} key={article.id}>
                    <Card.Header><img className='w-100' src={article.image} /></Card.Header>
                    <Card.Body>
                        <Card.Title>{article.name}</Card.Title>
                        <Card.Text>{article.description}</Card.Text>
                        {/* <Button variant="primary">Go somewhere</Button> */}
                    </Card.Body>
                    <Card.Subtitle className='p-3' style={{'color': 'grey'}}>Author: {article.author_first_name}</Card.Subtitle>
                    <Card.Footer className="text-muted">
                        <div className="row d-flex justify-content-around">
                            <div className="col-3" style={{'cursor': 'pointer'}} onClick={() => handleLikeDislike(article.id, index, 'like')}>{likeState[index].userLikesArticle ? <AiFillLike /> : <AiOutlineLike />}{likeState[index].likeCount}</div>
                            <div className="col-3" style={{'cursor': 'pointer'}} onClick={() => handleLikeDislike(article.id, index, 'dislike')}>{dislikeState[index].userDislikesArticle ? <AiFillDislike /> : <AiOutlineDislike />}{dislikeState[index].dislikeCount}</div>
                            <div className="col-3">#{article.tags}</div>
                            <div className="col-3"><Button onClick={() => handleBlockUnblockArticle(article.id, index)} className='d-flex justify-content-end align-items-center' style={{backgroundColor: 'red', borderColor: 'red', height: '25px'}}>{article.user_has_blocked_article ? 'unblock' : 'block'}</Button></div>
                        </div>
                    </Card.Footer>
                </Card>
            ))
        }
        </div>
    )
}

export default ExploreArticles