import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default function Dashboard() {
    const { user, logout } = useAuth();
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingBook, setEditingBook] = useState(null);
    const [formData, setFormData] = useState({
        title: '',
        author: '',
        price: '',
        cover_image: '',
        published_date: null
    });

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await api.get(`/books?page=${page}&search=${search}`);
            setBooks(res.data.data);
            setTotalPages(res.data.last_page);
        } catch (err) {
            console.error('Failed to fetch books', err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, [page, search]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setPage(1); // Reset to first page
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this book?')) return;
        try {
            await api.delete(`/books/${id}`);
            fetchBooks();
        } catch (err) {
            alert('Failed to delete book');
        }
    };

    const openModal = (book = null) => {
        if (book) {
            setEditingBook(book);
            setFormData({
                title: book.title,
                author: book.author,
                price: book.price || '',
                cover_image: book.cover_image || '',
                published_date: book.published_date ? new Date(book.published_date) : null
            });
        } else {
            setEditingBook(null);
            setFormData({ title: '', author: '', price: '', cover_image: '', published_date: null });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const submissionData = { ...formData };
            if (submissionData.published_date instanceof Date) {
                // Adjust for timezone offset to avoid previous day edge-case
                const date = new Date(submissionData.published_date.getTime() - (submissionData.published_date.getTimezoneOffset() * 60000));
                submissionData.published_date = date.toISOString().split('T')[0];
            } else {
                submissionData.published_date = null;
            }

            if (editingBook) {
                await api.put(`/books/${editingBook.id}`, submissionData);
            } else {
                await api.post('/books', submissionData);
            }
            setIsModalOpen(false);
            fetchBooks();
        } catch (err) {
            alert(err.response?.data?.message || 'Error occurred while saving!');
        }
    };

    return (
        <div>
            <nav className="dashboard-nav">
                <h2 className="gradient-text" style={{ margin: 0 }}>LibraryHub</h2>
                <div className="nav-user">
                    <span>Hello, {user.name}</span>
                    <button onClick={logout} className="btn btn-outline" style={{ padding: '0.5rem 1rem' }}>Logout</button>
                </div>
            </nav>

            <main className="container">
                <div className="dashboard-header">
                    <div className="search-bar">
                        <input 
                            type="text" 
                            placeholder="Search by title or author..." 
                            value={search}
                            onChange={handleSearch}
                        />
                    </div>
                    <button className="btn btn-primary" onClick={() => openModal()}>
                        + Add New Book
                    </button>
                </div>

                {loading ? (
                    <div className="loader-container" style={{ minHeight: '50vh' }}>
                        <div className="loader"></div>
                    </div>
                ) : (
                    <>
                        {books.length === 0 ? (
                            <div style={{ textAlign: 'center', marginTop: '4rem', color: 'var(--text-muted)' }}>
                                <h3>No books found.</h3>
                                <p>Try adjusting your search or add a new book!</p>
                            </div>
                        ) : (
                            <div className="books-grid">
                                {books.map(book => (
                                    <div key={book.id} className="book-card">
                                        <div className="book-image">
                                            {book.cover_image ? (
                                                <img src={book.cover_image} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => e.target.style.display='none'} />
                                            ) : (
                                                <div style={{ color: 'var(--panel-border)', fontSize: '4rem' }}>📖</div>
                                            )}
                                        </div>
                                        <div className="book-content">
                                            <h3 className="book-title">{book.title}</h3>
                                            <div className="book-author">By {book.author}</div>
                                            <div className="book-price">${book.price}</div>
                                            <div className="book-actions">
                                                <button className="btn btn-outline" onClick={() => openModal(book)}>Edit</button>
                                                <button className="btn btn-danger" onClick={() => handleDelete(book.id)}>Delete</button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {totalPages > 1 && (
                            <div className="pagination">
                                <button 
                                    className="page-btn" 
                                    disabled={page === 1} 
                                    onClick={() => setPage(p => p - 1)}
                                >
                                    Previous
                                </button>
                                <span style={{ display: 'flex', alignItems: 'center', margin: '0 1rem' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button 
                                    className="page-btn" 
                                    disabled={page === totalPages} 
                                    onClick={() => setPage(p => p + 1)}
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>

            {/* Modal */}
            {isModalOpen && (
                <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
                    <div className="modal-content glass-panel" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2 style={{ margin: 0 }}>{editingBook ? 'Edit Book' : 'Add New Book'}</h2>
                            <button className="close-btn" onClick={() => setIsModalOpen(false)}>&times;</button>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="input-group">
                                <label>Title *</label>
                                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} required />
                            </div>
                            <div className="input-group">
                                <label>Author *</label>
                                <input type="text" value={formData.author} onChange={e => setFormData({...formData, author: e.target.value})} required />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Price</label>
                                    <input type="number" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} />
                                </div>
                                <div className="input-group">
                                    <label>Published Date</label>
                                    <DatePicker 
                                        selected={formData.published_date} 
                                        onChange={(date) => setFormData({...formData, published_date: date})} 
                                        dateFormat="yyyy-MM-dd"
                                        placeholderText="Select a date"
                                        isClearable
                                    />
                                </div>
                            </div>
                            <div className="input-group">
                                <label>Cover Image URL</label>
                                <input type="url" value={formData.cover_image} onChange={e => setFormData({...formData, cover_image: e.target.value})} placeholder="https://..." />
                            </div>
                            <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{editingBook ? 'Save Changes' : 'Create Book'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
