import axios from 'axios';
import { useEffect, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { AiFillLike, AiFillDislike } from 'react-icons/ai';
import { useHistory } from 'react-router-dom';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import AddArticle from './AddArticle';
import UpdateArticle from './UpdateArticle';

export function CenteredModal(props) {
  const history = useHistory();

  const authDataString = localStorage.getItem('auth-token');
  const authData = JSON.parse(authDataString);
  const userToken = authData ? authData.token : null;
  const userId = authData ? authData.userId : null;
  const [articleBlockStatus, setArticleBlockStatus] = useState(false);

  useEffect(() => {
    if (userToken === null) {
      history.push('/login');
    }
    setArticleBlockStatus(props.article.block);
  }, [userToken, history]);

  const handleBlockUnblock = async (articleId) => {
    try {
      const data = {
        author: true,
      }
      const response = await axios.put(`http://localhost:8000/article/user/blockarticle/${articleId}/`, data,{
          headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${userToken}`,
          },
      });
      console.log(response.data);
      setArticleBlockStatus(response.data.article.block);
    } catch (error) {
      console.error("Article blocked by author: failed", error);
      if (error.response) {
          console.error("An error occurred while updating user data. Server responded with:", error.response.status);
          console.error("Error Data:", error.response.data);
      }
    }
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Tabs
        defaultActiveKey="detail"
        id="fill-tab-example"
        className="mb-3"
        fill
      >
        <Tab eventKey="detail" title="Detail">
          <Modal.Header closeButton>
            <Modal.Title id="contained-modal-title-vcenter">
              {props.article.name}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <img src={props.article.image} alt="Image" style={{width: '100%'}} />
            <p>{props.article.description}</p>
          </Modal.Body>
          <Modal.Footer className='row'>
            <div className="col-2">
                <h6><AiFillLike /> : {props.article.like_count}</h6>
            </div>
            <div className="col-2">
                <h6><AiFillDislike /> : {props.article.dislike.length}</h6>
            </div>
            <div className="col-3 d-flex justify-content-center">
                <h6># {props.article.tags}</h6>
            </div>
            <div className="col-3">
                <h6>Category: {props.article.category}</h6>
            </div>
            <div className='d-flex justify-content-center m-2'><Button onClick={() => handleBlockUnblock(props.article.id)} className='bg-warning text-black'>{articleBlockStatus ? 'Unblock' : 'Block'}</Button></div>
          </Modal.Footer>
        </Tab>
        <Tab eventKey="update" title="Update">
          <UpdateArticle props={props.article} />
        </Tab>
      </Tabs>
    </Modal>
  );
}