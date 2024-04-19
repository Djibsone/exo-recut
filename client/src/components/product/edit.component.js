import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [category_id, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [validationError,setValidationError] = useState({});

  useEffect(()=>{
    fetchProduct();
    fetchCategories();
  },[]);

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:8000/api/categories`);
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchProduct = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/api/products/${id}`);
      const { title, description, category_id } = response.data.product;
      setTitle(title);
      setDescription(description);
      setCategoryId(category_id);
    } catch (error) {
      Swal.fire({
        text: error.response.data.message,
        icon: "error"
      });
    }
  };

  const changeHandler = (event) => {
    setImage(event.target.files[0]);
  };

  const updateProduct = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append('_method', 'PUT');
    formData.append('title', title);
    formData.append('description', description);
    formData.append('category_id', category_id);
  
    if (image !== null) {
      formData.append('image', image);
    }
  
    try {
      const response = await axios.post(`http://localhost:8000/api/products/${id}`, formData);
      Swal.fire({
        icon: "success",
        text: response.data.message
      });
      navigate("/");
    } catch (error) {
      if (error.response && error.response.status === 422) {
        setValidationError(error.response.data.errors);
      } else {
        Swal.fire({
          text: error.response.data.message,
          icon: "error"
        });
      }
    }
  };  

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-12 col-sm-12 col-md-6">
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Update Product</h4>
              <hr />
              <div className="form-wrapper">
                {
                  Object.keys(validationError).length > 0 && (
                    <div className="row">
                      <div className="col-12">
                        <div className="alert alert-danger">
                          <ul className="mb-0">
                            {
                              Object.entries(validationError).map(([key, value])=>(
                                <li key={key}>{value}</li>   
                              ))
                            }
                          </ul>
                        </div>
                      </div>
                    </div>
                  )
                }
                <Form onSubmit={updateProduct} encType="multipart/form-data">
                  <Row> 
                      <Col>
                        <Form.Group controlId="Name">
                            <Form.Label>Title</Form.Label>
                            <Form.Control type="text" value={title} onChange={(event)=>{
                              setTitle(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>  
                  </Row>
                  <Row className="my-3">
                      <Col>
                        <Form.Group controlId="Description">
                            <Form.Label>Description</Form.Label>
                            <Form.Control as="textarea" rows={3} value={description} onChange={(event)=>{
                              setDescription(event.target.value)
                            }}/>
                        </Form.Group>
                      </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Form.Group controlId="Image" className="mb-3">
                        <Form.Label>Image</Form.Label>
                        <Form.Control type="file" onChange={changeHandler} />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group controlId="Category">
                      <Form.Label>Category</Form.Label>
                      <Form.Control 
                          as="select" 
                          name="category_id" 
                          value={category_id}
                          onChange={(event)=> {
                              setCategoryId(event.target.value )
                          }}
                      >
                          <option value="">Select category</option>
                          {categories.map((category) => (
                              <option key={category.id} value={category.id}>{category.name}</option>
                          ))}
                      </Form.Control>
                  </Form.Group>
                  <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                    Update
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
