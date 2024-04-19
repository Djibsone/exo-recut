import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import axios from 'axios';
import Swal from 'sweetalert2';

export default function List() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await axios.get(`http://127.0.0.1:8000/api/products`);
            setProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };    

    const deleteProduct = async (id) => {
        const isConfirmed = await Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => result.isConfirmed);

        if (!isConfirmed) return;

        try {
            const response = await axios.delete(`http://localhost:8000/api/products/${id}`);
            Swal.fire({
                icon: 'success',
                text: response.data.message
                // text: 'Product has been deleted successfully.'
            });
            fetchProducts();
        } catch (error) {
            console.error('Error deleting product:', error);
            Swal.fire({
                icon: 'error',
                text: 'Failed to delete product.'
            });
        }
    };

    return (
        <div className="container">
            <div className="row">
                <div className='col-12'>
                    <Link className='btn btn-primary mb-2 float-end' to="/product/create">
                        Create Product
                    </Link>
                </div>
                <div className="col-12">
                    <div className="card card-body">
                        <div className="table-responsive">
                            <table className="table table-bordered mb-0 text-center">
                                <thead>
                                    <tr>
                                        <th>Title</th>
                                        <th>Description</th>
                                        <th>Catégorie</th>
                                        <th>Image</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {products.map((row) => (
                                        <tr key={row.id}>
                                            <td>{row.title}</td>
                                            <td>{row.description}</td>
                                            <td>{row.category ? row.category.name : 'Aucune catégorie'}</td>
                                            <td>
                                                <img src={`http://localhost:8000/storage/product/image/${row.image}`} alt={row.title} style={{ width: '50px' }} />
                                            </td>
                                            <td>
                                                <Link to={`/products/${row.id}`} className='btn btn-success me-2'>
                                                    Edit
                                                </Link>
                                                <Button variant="danger" onClick={() => deleteProduct(row.id)}>
                                                    Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
