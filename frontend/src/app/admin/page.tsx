"use client";

import { useEffect, useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import CardMedia from "@mui/material/CardMedia";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
// import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
// import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Chip from "@mui/material/Chip";
import StarIcon from "@mui/icons-material/Star";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import { styled } from "@mui/material/styles";
import MultiImageUpload from "@/components/MultiImageUpload";

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

type Category = { documentId: string; name: string };
type Product = {
    documentId: string;
    title: string;
    slug: string;
    price: number;
    description?: string;
    shortDescription?: string;
    images?: { url: string; alternativeText?: string }[];
    category?: { name: string } | null;
};

type Review = {
    documentId: string;
    rating: number;
    comment?: string;
    authorName: string;
    authorEmail: string;
    isApproved: boolean;
    createdAt: string;
    product?: {
        documentId: string;
        title: string;
    };
};

export default function AdminPage() {
    const AdminOrdersCounter = () => {
        const [orders, setOrders] = useState<number>(0);
        useEffect(() => {
            let mounted = true;
            const load = async () => {
                try {
                    const res = await fetch('/api/admin/analytics', { cache: 'no-store' });
                    const json = await res.json();
                    if (mounted) setOrders(json?.stats?.orders ?? 0);
                } catch {}
            };
            load();
            const timer = setInterval(load, 5000);
            return () => { clearInterval(timer); mounted = false; };
        }, []);
        return <Typography variant="body2">Orders total: <strong>{orders}</strong></Typography>;
    };
    const [categories, setCategories] = useState<Category[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const [messageType, setMessageType] = useState<'success' | 'error' | null>(null);
    const [editOpen, setEditOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [editSelectedFiles, setEditSelectedFiles] = useState<File[]>([]);
    const [activeTab, setActiveTab] = useState<'products' | 'reviews' | 'analytics'>('products');

    useEffect(() => {
        const load = async () => {
            try {
                const [catRes, prodRes, revRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ query: `query { categories { documentId name } }` }),
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            query: `query { 
                                products(pagination: { page: 1, pageSize: 200 }, sort: "createdAt:desc") { 
                                    documentId title slug price description shortDescription
                                    images { url alternativeText }
                                    category { name }
                                } 
                            }` 
                        }),
                    }),
                    fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                            query: `query { 
                                reviews(sort: "createdAt:desc") { 
                                    documentId rating comment authorName authorEmail isApproved createdAt
                                    product { documentId title }
                                } 
                            }` 
                        }),
                    }),
                ]);
                const [catJson, prodJson, revJson] = await Promise.all([catRes.json(), prodRes.json(), revRes.json()]);
                setCategories(catJson.data?.categories || []);
                setProducts(prodJson.data?.products || []);
                setReviews(revJson.data?.reviews || []);
            } catch (e) {
                // eslint-disable-next-line no-console
                console.error(e);
            }
        };
        load();
    }, []);

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        const form = e.currentTarget;
        const fd = new FormData(form);
        
        // Add multiple images to FormData
        selectedFiles.forEach((file, index) => {
            fd.append(`images`, file);
        });
        
        try {
            const res = await fetch("/api/admin/product", { method: "POST", body: fd });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed");
            setMessage("Продукт створено успішно");
            setTimeout(() => setMessage(null), 5000);
            setMessageType('success');
            form.reset();
            setSelectedFiles([]); // Reset selected files
            // Reload products
            const prodRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                    query: `query { 
                        products(pagination: { page: 1, pageSize: 200 }, sort: "createdAt:desc") { 
                                    documentId title slug price description shortDescription
                            images { url alternativeText }
                            category { name }
                        } 
                    }` 
                }),
            });
            const prodJson = await prodRes.json();
            setProducts(prodJson.data?.products || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Помилка створення продукту";
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setEditOpen(true);
        setEditSelectedFiles([]); // Reset selected files when opening edit
    };

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingProduct) return;
        
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        const form = e.currentTarget;
        const fd = new FormData(form);
        
        // Add multiple images to FormData if any are selected
        editSelectedFiles.forEach((file, index) => {
            fd.append(`images`, file);
        });
        
        try {
            const res = await fetch(`/api/admin/product/${editingProduct.documentId}`, { 
                method: "PUT", 
                body: fd 
            });
            const json = await res.json();
            
            if (!res.ok) throw new Error(json?.error || "Failed");
            
            setMessage("Продукт оновлено успішно");
            setTimeout(() => setMessage(null), 5000);
            setMessageType('success');
            setEditOpen(false);
            setEditingProduct(null);
            setEditSelectedFiles([]); // Reset selected files
            
            // Reload products
            const prodRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ 
                    query: `query { 
                        products(pagination: { page: 1, pageSize: 200 }, sort: "createdAt:desc") { 
                                    documentId title slug price description shortDescription
                            images { url alternativeText }
                            category { name }
                        } 
                    }` 
                }),
            });
            const prodJson = await prodRes.json();
            setProducts(prodJson.data?.products || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Помилка оновлення продукту";
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (productId: string) => {
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        
        try {
            const res = await fetch(`/api/admin/product/${productId}`, { 
                method: "DELETE" 
            });
            const json = await res.json();
            if (!res.ok) throw new Error(json?.error || "Failed");
            
            setMessage("Продукт видалено успішно");
            setTimeout(() => setMessage(null), 5000);
            setMessageType('success');
            setDeleteConfirm(null);
            
            // Reload products
            const prodRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query: `query { 
                        products(pagination: { page: 1, pageSize: 200 }, sort: "createdAt:desc") { 
                            documentId title slug price description 
                            images { url alternativeText }
                            category { name }
                        } 
                    }` 
                }),
            });
            const prodJson = await prodRes.json();
            setProducts(prodJson.data?.products || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Помилка видалення продукту";
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles = [...selectedFiles, ...files].slice(0, 4); // Max 4 files
        setSelectedFiles(newFiles);
    };

    const handleEditFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        const newFiles = [...editSelectedFiles, ...files].slice(0, 4); // Max 4 files
        setEditSelectedFiles(newFiles);
    };

    const removeFile = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const removeEditFile = (index: number) => {
        setEditSelectedFiles(prev => prev.filter((_, i) => i !== index));
    };

    const moveFile = (fromIndex: number, toIndex: number) => {
        setSelectedFiles(prev => {
            const newFiles = [...prev];
            const [movedFile] = newFiles.splice(fromIndex, 1);
            newFiles.splice(toIndex, 0, movedFile);
            return newFiles;
        });
    };

    const moveEditFile = (fromIndex: number, toIndex: number) => {
        setEditSelectedFiles(prev => {
            const newFiles = [...prev];
            const [movedFile] = newFiles.splice(fromIndex, 1);
            newFiles.splice(toIndex, 0, movedFile);
            return newFiles;
        });
    };


    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleApproveReview = async (reviewId: string) => {
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        
        try {
            if (process.env.NODE_ENV !== 'production') console.log('Approving review:', reviewId);
            
            const res = await fetch(`/api/admin/review?id=${reviewId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    isApproved: true
                }),
            });
            
            if (process.env.NODE_ENV !== 'production') console.log('Response status:', res.status);
            
            if (!res.ok) {
                const errorData = await res.json();
                if (process.env.NODE_ENV !== 'production') console.error('Error response:', errorData);
                throw new Error(`Failed to approve review: ${errorData.error || res.statusText}`);
            }
            
            const result = await res.json();
            if (process.env.NODE_ENV !== 'production') console.log('Review approved successfully:', result);
            
            setMessage('Review approved successfully');
            setTimeout(() => setMessage(null), 5000);
            setMessageType('success');
            
            // Reload reviews
            const revRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query: `query { 
                        reviews(sort: "createdAt:desc") { 
                            documentId rating comment authorName authorEmail isApproved createdAt
                            product { documentId title }
                        } 
                    }` 
                }),
            });
            const revJson = await revRes.json();
            setReviews(revJson.data?.reviews || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error approving review";
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    const handleRejectReview = async (reviewId: string) => {
        setLoading(true);
        setMessage(null);
        setMessageType(null);
        
        try {
            if (process.env.NODE_ENV !== 'production') console.log('Deleting review:', reviewId);
            
            const res = await fetch(`/api/admin/review?id=${reviewId}`, {
                method: 'DELETE',
            });
            
            if (process.env.NODE_ENV !== 'production') console.log('Delete response status:', res.status);
            
            if (!res.ok) {
                const errorData = await res.json();
                if (process.env.NODE_ENV !== 'production') console.error('Delete error response:', errorData);
                throw new Error(`Failed to delete review: ${errorData.error || res.statusText}`);
            }
            
            const result = await res.json();
            if (process.env.NODE_ENV !== 'production') console.log('Review deleted successfully:', result);
            
            setMessage('Review rejected and deleted');
            setTimeout(() => setMessage(null), 5000);
            setMessageType('success');
            
            // Reload reviews
            const revRes = await fetch(`${process.env.NEXT_PUBLIC_CMS_URL}/graphql`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ 
                    query: `query { 
                        reviews(sort: "createdAt:desc") { 
                            documentId rating comment authorName authorEmail isApproved createdAt
                            product { documentId title }
                        } 
                    }` 
                }),
            });
            const revJson = await revRes.json();
            setReviews(revJson.data?.reviews || []);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Error rejecting review";
            setMessage(msg);
            setTimeout(() => setMessage(null), 5000);
            setMessageType('error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box component="section" sx={{ maxWidth: 1200, mx: "auto", my: 4, p: 2 }}>
            <Typography variant="h4" gutterBottom>Admin Panel</Typography>
            
            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
                    <Tab label={`Products (${products.length})`} value="products" />
                    <Tab label={`Reviews (${reviews.length})`} value="reviews" />
                    <Tab label="Analytics" value="analytics" />
                </Tabs>
            </Box>

            {message && (
                <Box sx={{ 
                    mb: 3, 
                    p: 2.5, 
                    bgcolor: messageType === 'error' 
                        ? '#ffebee' 
                        : '#e8f5e8', 
                    color: messageType === 'error'
                        ? '#c62828'
                        : '#2e7d32', 
                    borderRadius: 2,
                    border: messageType === 'error'
                        ? '1px solid #ffcdd2'
                        : '1px solid #c8e6c9',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                }}>
                    {messageType === 'error' ? (
                        <DeleteIcon sx={{ fontSize: 20 }} />
                    ) : (
                        <CheckIcon sx={{ fontSize: 20 }} />
                    )}
                    <Typography sx={{ fontWeight: 500 }}>{message}</Typography>
                </Box>
            )}

            {activeTab === 'products' && (
                <>
                    {/* Create Product Form */}
            <Card sx={{ mb: 4, border: '1px solid transparent', bgcolor: '#f8f8f8', boxShadow: '0 0.25rem 1rem rgba(0,0,0,0)' }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Create New Product</Typography>
                    <Box component="form" onSubmit={onSubmit} encType="multipart/form-data" sx={{ display: "grid", gap: 2 }}>
                        <TextField name="title" label="Title" required fullWidth />
                        <TextField name="slug" label="Slug" required fullWidth />
                        <TextField name="price" label="Price" type="number" required fullWidth />
                        <TextField name="description" label="Description" multiline rows={4} fullWidth />
                        <TextField name="shortDescription" label="Short Description (for catalog card)" fullWidth />
                        <TextField 
                            name="categoryId" 
                            select 
                            label="Category" 
                            fullWidth
                            defaultValue=""
                            required
                        >
                            <MenuItem value="">Select a category</MenuItem>
                            {categories.map((c) => (
                                <MenuItem key={c.documentId} value={c.documentId}>{c.name}</MenuItem>
                            ))}
                        </TextField>
                        <MultiImageUpload
                            files={selectedFiles}
                            onFilesChange={setSelectedFiles}
                            maxFiles={4}
                            disabled={loading}
                        />
                        <Box sx={{ display: "flex", gap: 2 }}>
                            <Button type="submit" disabled={loading} className="btn-shared btn-shared-primary" variant="contained">Create</Button>
                        </Box>
                        {message && <Typography color="text.secondary">{message}</Typography>}
                    </Box>
                </CardContent>
            </Card>

            <Divider sx={{ my: 3 }} />

            {/* Products List */}
            <Typography variant="h6" gutterBottom>Existing Products ({products.length})</Typography>
            <Grid container spacing={2}>
                {products.map((product) => (
                    <Grid key={product.documentId} size={{ xs: 12, sm: 6, md: 4 }}>
                        <Card sx={{ border: '1px solid transparent', bgcolor: '#f8f8f8', boxShadow: '0 0.25rem 1rem rgba(0,0,0,0)' }}>
                            {product.images?.[0]?.url && (
                                <Box sx={{ mt: 2, width: '100%', height: { xs: 140, sm: 160 }, bgcolor: '#f8f8f8', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                                    <CardMedia
                                        component="img"
                                        image={`${process.env.NEXT_PUBLIC_CMS_URL}${product.images[0].url}`}
                                        alt={product.images[0].alternativeText || product.title}
                                        sx={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}
                                    />
                                </Box>
                            )}
                            <CardContent>
                                <Typography variant="h6" gutterBottom>{product.title}</Typography>
                                <Typography color="text.secondary" gutterBottom>${product.price}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Category: {product.category?.name || "None"}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Slug: {product.slug}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button size="small" className="btn-shared" onClick={() => handleEdit(product)}>Edit</Button>
                                <Button size="small" className="btn-shared" color="error" onClick={() => setDeleteConfirm(product.documentId)}>Delete</Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>
                </>
            )}

            {activeTab === 'reviews' && (
                <>
                    {/* Reviews Moderation */}
                    <Box sx={{ mb: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600,
                                color: '#2c2c2c',
                                mb: 1
                            }}
                        >
                            Reviews Moderation
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Chip 
                                label={`${reviews.filter(r => !r.isApproved).length} Pending`}
                                sx={{
                                    bgcolor: '#fff3e0',
                                    color: '#e65100',
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                }}
                            />
                            <Chip 
                                label={`${reviews.filter(r => r.isApproved).length} Approved`}
                                sx={{
                                    bgcolor: '#e8f5e8',
                                    color: '#2e7d32',
                                    fontWeight: 500,
                                    fontSize: '0.875rem'
                                }}
                            />
                        </Box>
                    </Box>
                    
                    <Grid container spacing={3}>
                        {reviews.map((review) => (
                            <Grid key={review.documentId} size={{ xs: 12, md: 6 }}>
                                <Card className="admin-review-card" sx={{ 
                                    border: 'none',
                                    boxShadow: '0 4px 16px rgba(0,0,0,0)', /* reserve space */
                                    borderRadius: 2,
                                    overflow: 'hidden',
                                    bgcolor: review.isApproved ? 'rgba(76, 175, 80, 0.05)' : 'rgba(255, 152, 0, 0.05)',
                                    transition: 'box-shadow 0.2s ease',
                                    '&:hover': {
                                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)'
                                    }
                                }}>
                                    {/* Status Bar */}
                                    <Box sx={{ 
                                        height: 4,
                                        bgcolor: review.isApproved ? '#4caf50' : '#ff9800',
                                        width: '100%'
                                    }} />
                                    
                                    <CardContent sx={{ p: 3 }}>
                                        {/* Header */}
                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 3 }}>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography 
                                                    variant="h6" 
                                                    sx={{ 
                                                        fontWeight: 600,
                                                        fontSize: '1.1rem',
                                                        color: '#2c2c2c',
                                                        mb: 0.5
                                                    }}
                                                >
                                                    {review.product?.title || 'Unknown Product'}
                                                </Typography>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: '#666',
                                                        fontSize: '0.875rem'
                                                    }}
                                                >
                                                    {review.authorName} • {review.authorEmail}
                                                </Typography>
                                            </Box>
                                            <Chip 
                                                label={review.isApproved ? 'Approved' : 'Pending'} 
                                                sx={{
                                                    bgcolor: review.isApproved ? '#e8f5e8' : '#fff3e0',
                                                    color: review.isApproved ? '#2e7d32' : '#e65100',
                                                    fontWeight: 500,
                                                    fontSize: '0.75rem',
                                                    height: 24,
                                                    '& .MuiChip-label': {
                                                        px: 1.5
                                                    }
                                                }}
                                                size="small"
                                            />
                                        </Box>
                                        
                                        {/* Rating */}
                                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2.5 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <StarIcon 
                                                        key={star}
                                                        sx={{ 
                                                            color: star <= review.rating ? '#ffd700' : '#e0e0e0',
                                                            fontSize: 18,
                                                            mr: 0.25
                                                        }} 
                                                    />
                                                ))}
                                            </Box>
                                            <Typography 
                                                variant="body2" 
                                                sx={{ 
                                                    color: '#666',
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem'
                                                }}
                                            >
                                                {review.rating}/5
                                            </Typography>
                                        </Box>
                                        
                                        {/* Comment */}
                                        {review.comment && (
                                            <Box sx={{ 
                                                bgcolor: '#f8f9fa',
                                                p: 2,
                                                borderRadius: 1,
                                                mb: 2.5,
                                                borderLeft: '3px solid #e0e0e0'
                                            }}>
                                                <Typography 
                                                    variant="body2" 
                                                    sx={{ 
                                                        color: '#444',
                                                        fontSize: '0.875rem',
                                                        lineHeight: 1.5,
                                                        fontStyle: 'italic'
                                                    }}
                                                >
                                                    &quot;{review.comment}&quot;
                                                </Typography>
                                            </Box>
                                        )}
                                        
                                        {/* Date */}
                                        <Typography 
                                            variant="caption" 
                                            sx={{ 
                                                color: '#999',
                                                fontSize: '0.75rem',
                                                textTransform: 'uppercase',
                                                letterSpacing: '0.5px'
                                            }}
                                        >
                                            {new Date(review.createdAt).toLocaleDateString('uk-UA', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </Typography>
                                    </CardContent>
                                    
                                    {/* Actions */}
                                    <CardActions sx={{ p: 3, pt: 0, gap: 1 }}>
                                        {!review.isApproved && (
                                            <Button 
                                                size="small" 
                                                startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
                                                onClick={() => handleApproveReview(review.documentId)}
                                                disabled={loading}
                                                sx={{
                                                    bgcolor: '#4caf50',
                                                    color: 'white',
                                                    fontWeight: 500,
                                                    fontSize: '0.875rem',
                                                    px: 2,
                                                    py: 1,
                                                    borderRadius: 1,
                                                    textTransform: 'none',
                                                    '&:hover': { bgcolor: '#45a049' },
                                                    '&:disabled': { bgcolor: '#e0e0e0', color: '#999' }
                                                }}
                                            >
                                                Approve
                                            </Button>
                                        )}
                                        <Button 
                                            size="small" 
                                            startIcon={<DeleteIcon sx={{ fontSize: 16 }} />}
                                            onClick={() => handleRejectReview(review.documentId)}
                                            disabled={loading}
                                            sx={{
                                                borderColor: '#f44336',
                                                color: '#f44336',
                                                fontWeight: 500,
                                                fontSize: '0.875rem',
                                                px: 2,
                                                py: 1,
                                                borderRadius: 1,
                                                textTransform: 'none',
                                                '&:hover': { borderColor: '#d32f2f', bgcolor: '#ffebee' },
                                                '&:disabled': { borderColor: '#e0e0e0', color: '#999' }
                                            }}
                                            variant="outlined"
                                        >
                                            Delete
                                        </Button>
                                    </CardActions>
                                </Card>
                            </Grid>
                        ))}
                    </Grid>
                    
                    {reviews.length === 0 && (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body1" color="text.secondary">
                                No reviews found
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {activeTab === 'analytics' && (
                <>
                    <Box sx={{ mb: 3 }}>
                        <Typography 
                            variant="h5" 
                            sx={{ 
                                fontWeight: 600,
                                color: '#2c2c2c',
                                mb: 1
                            }}
                        >
                            Site Analytics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Google Analytics status and basic app metrics.
                        </Typography>
                    </Box>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>Google Analytics</Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                        Measurement ID: {process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ? (
                                            <strong>{process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}</strong>
                                        ) : (
                                            <span style={{ color: '#d32f2f' }}>Not configured</span>
                                        )}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1.5 }}>
                                        <Button 
                                            variant="contained" 
                                            className="btn-shared btn-shared-primary"
                                            disabled={!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}
                                            onClick={() => {
                                                if (typeof window !== 'undefined' && typeof (window as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
                                                    (window as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'admin_analytics_opened', { source: 'admin_tab' });
                                                }
                                            }}
                                        >
                                            Send test event
                                        </Button>
                                        <Button 
                                            variant="outlined"
                                            className="btn-shared"
                                            onClick={() => {
                                                if (typeof window !== 'undefined' && typeof (window as { gtag?: (...args: unknown[]) => void }).gtag === 'function') {
                                                    const path = '/admin/analytics';
                                                    (window as { gtag?: (...args: unknown[]) => void }).gtag?.('event', 'page_view', { page_path: path });
                                                }
                                            }}
                                        >
                                            Record page_view
                                        </Button>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid size={{ xs: 12, md: 6 }}>
                            <Card sx={{ border: 'none', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
                                <CardContent>
                                    <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>App metrics</Typography>
                                    <Box sx={{ display: 'grid', gap: 1 }}>
                                        <Typography variant="body2">Products: <strong>{products.length}</strong></Typography>
                                        <Typography variant="body2">Categories: <strong>{categories.length}</strong></Typography>
                                        <Typography variant="body2">Reviews total: <strong>{reviews.length}</strong></Typography>
                                        <Typography variant="body2">Reviews approved: <strong>{reviews.filter(r => r.isApproved).length}</strong></Typography>
                                        <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            Reviews pending: <strong>{reviews.filter(r => !r.isApproved).length}</strong>
                                        </Typography>
                                        <AdminOrdersCounter />
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {!process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID && (
                        <Box sx={{ mt: 3, p: 2, borderRadius: 1, bgcolor: '#fff3e0', color: '#e65100', border: '1px solid #ffe0b2' }}>
                            <Typography variant="body2">
                                Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your environment to enable GA4 tracking.
                            </Typography>
                        </Box>
                    )}
                </>
            )}

            {/* Edit Dialog */}
            <Dialog open={editOpen} onClose={() => {
                setEditOpen(false);
                setEditSelectedFiles([]);
            }} maxWidth="md" fullWidth>
                <DialogTitle>
                    Edit Product
                    <IconButton
                        aria-label="close"
                        onClick={() => {
                            setEditOpen(false);
                            setEditSelectedFiles([]);
                        }}
                        sx={{ position: 'absolute', right: 8, top: 8 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    {editingProduct && (
                        <Box component="form" id="edit-form" onSubmit={handleEditSubmit} encType="multipart/form-data" sx={{ display: "grid", gap: 2, mt: 1 }}>
                            <TextField 
                                name="title" 
                                label="Title" 
                                required 
                                fullWidth 
                                defaultValue={editingProduct.title || ''}
                            />
                            <TextField 
                                name="slug" 
                                label="Slug" 
                                required 
                                fullWidth 
                                defaultValue={editingProduct.slug || ''}
                            />
                            <TextField 
                                name="price" 
                                label="Price" 
                                type="number" 
                                required 
                                fullWidth 
                                defaultValue={editingProduct.price || ''}
                            />
                            <TextField 
                                name="description" 
                                label="Description" 
                                multiline 
                                rows={4} 
                                fullWidth 
                                defaultValue={editingProduct.description || ''}
                            />
                            <TextField 
                                name="shortDescription" 
                                label="Short Description (for catalog card)" 
                                fullWidth 
                                defaultValue={editingProduct.shortDescription || ''}
                            />
                            <TextField 
                                name="categoryId" 
                                select 
                                label="Category" 
                                fullWidth
                                defaultValue={editingProduct.category?.name ? categories.find(c => c.name === editingProduct.category?.name)?.documentId || '' : ''}
                            >
                                <MenuItem value="">Select a category</MenuItem>
                                {categories.map((c) => (
                                    <MenuItem key={c.documentId} value={c.documentId}>{c.name}</MenuItem>
                                ))}
                            </TextField>
                            <MultiImageUpload
                                files={editSelectedFiles}
                                onFilesChange={setEditSelectedFiles}
                                maxFiles={4}
                                disabled={loading}
                            />
                            <Typography variant="body2" color="text.secondary">
                                Leave empty to keep current images
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setEditOpen(false);
                        setEditSelectedFiles([]);
                    }} className="btn-shared">Cancel</Button>
                    <Button 
                        type="submit"
                        form="edit-form"
                        disabled={loading} 
                        className="btn-shared btn-shared-primary" 
                        variant="contained"
                    >
                        Update
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteConfirm} onClose={() => setDeleteConfirm(null)}>
                <DialogTitle>Confirm Delete</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete this product? This action cannot be undone.</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteConfirm(null)} className="btn-shared">Cancel</Button>
                    <Button 
                        onClick={() => deleteConfirm && handleDelete(deleteConfirm)} 
                        disabled={loading} 
                        className="btn-shared" 
                        color="error"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}


