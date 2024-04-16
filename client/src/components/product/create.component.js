import React, { useEffect, useState } from "react";
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom'

export default function CreateProduct() {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        image: null,
        category_id: "",
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/categories`);
            setCategories(response.data.categories);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const [validationError, setValidationError] = useState({});

    const changeHandler = (event) => {
        setFormData({ ...formData, image: event.target.files[0] });
    };

    const createProduct = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post(`http://127.0.0.1:8000/api/products/create`, formData);
            Swal.fire({
                icon: "success",
                text: response.data.message
            })
            navigate("/");
        } catch (error) {
            if (error.response && error.response.status === 422) {
                setValidationError(error.response.data.errors);
            } else {
                Swal.fire({
                    text: error.response.data.message,
                    icon: "error"
                })
            }
        }
    }

    return (
    <div className="container">
        <div className="row justify-content-center">
            <div className="col-12 col-sm-12 col-md-6">
                <div className="card">
                    <div className="card-body">
                        <h4 className="card-title">Create Product</h4>
                        <hr />
                        <div className="form-wrapper">
                            {
                            Object.keys(validationError).length > 0 && (
                            <div className="row">
                                <div className="col-12">
                                    <div className="alert alert-danger">
                                        <ul className="mb-0">
                                            {
                                            Object.entries(validationError).map(([key, value]) => (
                                            <li key={key}>{value}</li>
                                            ))
                                            }
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            )
                            }
                            <Form onSubmit={createProduct}>
                                <Row>
                                    <Col>
                                    <Form.Group controlId="Name">
                                        <Form.Label>Title</Form.Label>
                                        <Form.Control type="text" value={formData.title} onChange={(event)=> {
                                            setFormData({ ...formData, title: event.target.value })
                                            }} />
                                    </Form.Group>
                                    </Col>
                                </Row>
                                <Row className="my-3">
                                    <Col>
                                    <Form.Group controlId="Description">
                                        <Form.Label>Description</Form.Label>
                                        <Form.Control as="textarea" rows={3} value={formData.description}
                                            onChange={(event)=> {
                                            setFormData({ ...formData, description: event.target.value })
                                            }} />
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
                                        value={formData.category_id}
                                        onChange={(event)=> {
                                            setFormData({ ...formData, category_id: event.target.value })
                                        }}
                                    >
                                        <option value="">Select category</option>
                                        {categories.map((category) => (
                                            <option key={category.id} value={category.id}>{category.name}</option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                                <Button variant="primary" className="mt-2" size="lg" block="block" type="submit">
                                    Save
                                </Button>
                            </Form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    )
}
