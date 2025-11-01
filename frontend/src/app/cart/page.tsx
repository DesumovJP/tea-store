"use client";

import { useState, useMemo, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Alert from "@mui/material/Alert";
import CardMedia from "@mui/material/CardMedia";
import CartItemCard from "@/components/CartItemCard";
import CartIcon from "@/components/icons/CartIcon";
// Custom SVG icons for modern look
const PersonIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const EmailIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const PhoneIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const CommentIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const LocalShippingIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <rect x="1" y="3" width="15" height="13" rx="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 8h4l3 3v5h-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="5.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="18.5" cy="18.5" r="2.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const LocationOnIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const HomeIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <polyline points="9,22 9,12 15,12 15,22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const BusinessIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M3 21h18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M5 21V7l8-4v18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 21V11l-6-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const CreditCardIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="1" y1="10" x2="23" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const CalendarTodayIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="16" y1="2" x2="16" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="8" y1="2" x2="8" y2="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="3" y1="10" x2="21" y2="10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const SecurityIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

// unified cart icon is used globally via CartIcon component

const ReceiptIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <path d="M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1-2-1z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M14 8H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M16 12H8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

const DeleteIcon = ({ sx }: { sx?: any }) => (
    <Box component="svg" width={20} height={20} viewBox="0 0 24 24" fill="none" sx={sx}>
        <polyline points="3,6 5,6 21,6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="10" y1="11" x2="10" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <line x1="14" y1="11" x2="14" y2="17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </Box>
);

export default function CartPage() {
    const { items, removeItem, clearCart, updateQuantity } = useCartStore();

	const [fullName, setFullName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");

	const [deliveryMethod, setDeliveryMethod] = useState<"courier" | "nova_poshta">("nova_poshta");
	const [city, setCity] = useState("");
	const [street, setStreet] = useState("");
	const [house, setHouse] = useState("");
	const [apartment, setApartment] = useState("");
	const [npBranch, setNpBranch] = useState("");

	const [paymentMethod] = useState<"card_online" | "card_on_delivery">("card_online");
	const [cardNumber, setCardNumber] = useState("");
	const [cardExpiry, setCardExpiry] = useState("");
	const [cardCvc, setCardCvc] = useState("");

	const [submitting, setSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [success, setSuccess] = useState(false);
	const [orderNumber, setOrderNumber] = useState<string | null>(null);

	const total = useMemo(() => items.reduce((sum, i) => sum + i.price * i.quantity, 0), [items]);

	// Shipping cost (mirror drawer free-shipping logic)
	const freeShippingThreshold = 100;
	const baseShipping = 10;
	const shippingCost = total >= freeShippingThreshold || items.length === 0 ? 0 : baseShipping;
	const grandTotal = total + shippingCost;

	const isOnlinePayment = paymentMethod === "card_online";
	const isCourier = deliveryMethod === "courier";

	const validate = () => {
		if (items.length === 0) return "Your cart is empty";
		if (!fullName.trim()) return "Please enter your full name";
		if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) return "Invalid email";
		if (!phone.match(/^\+?\d[\d\s\-()]{7,}$/)) return "Invalid phone number";

		if (isCourier) {
			if (!city.trim() || !street.trim() || !house.trim()) return "Please fill in the delivery address";
		} else {
			if (!city.trim() || !npBranch.trim()) return "Please specify the city and Nova Poshta branch";
		}

		if (isOnlinePayment) {
			if (!cardNumber.replace(/\s+/g, "").match(/^\d{16}$/)) return "Invalid card number";
			if (!cardExpiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)) return "Invalid expiry date (MM/YY)";
			if (!cardCvc.match(/^\d{3}$/)) return "Invalid CVC";
		}

		return null;
	};

	const handleSubmit = async () => {
		setError(null);
		setSuccess(false);
		const validationError = validate();
		if (validationError) {
			setError(validationError);
			return;
		}
		setSubmitting(true);
		try {
			const res = await fetch("/api/order", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: fullName,
					email,
					phone,
					notes,
					items,
					total,
					delivery: {
						method: deliveryMethod,
						city,
						street: isCourier ? street : undefined,
						house: isCourier ? house : undefined,
						apartment: isCourier ? apartment : undefined,
						npBranch: !isCourier ? npBranch : undefined,
					},
					payment: {
						method: paymentMethod,
						cardNumber: isOnlinePayment ? cardNumber : undefined,
						cardExpiry: isOnlinePayment ? cardExpiry : undefined,
						cardCvc: isOnlinePayment ? cardCvc : undefined,
					},
				}),
			});

            const json: { success?: boolean; error?: string; orderNumber?: string } = await res.json();
                if (!res.ok || !json.success) {
					throw new Error(json.error || "Order processing failed");
				}
			setSuccess(true);
			setOrderNumber(json.orderNumber || null);
			clearCart();
		} catch (e) {
			const message = e instanceof Error ? e.message : "An error occurred";
			setError(message);
		} finally {
			setSubmitting(false);
		}
	};

    return (
        <Box sx={{ 
            minHeight: '100vh', 
            bgcolor: '#ffffff',
            py: 4,
            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif'
        }}>
            <Box sx={{ 
                px: { xs: '1rem', md: '10%', lg: '15%' }, 
                py: { xs: 2, md: 4 }, 
                maxWidth: '100%', 
                mx: "auto"
            }}>
                {/* Removed checkout header block for cleaner cart page */}

				{error && (
					<Box sx={{ mb: 2 }}>
						<Alert severity="error">{error}</Alert>
					</Box>
				)}
				{success && (
					<Box sx={{ mb: 2 }}>
						<Alert severity="success">
							<Box>
								<Typography variant="h6" sx={{ mb: 1 }}>
									✅ Order sent successfully!
								</Typography>
								{orderNumber && (
									<Typography variant="body2" sx={{ mb: 1 }}>
										<strong>Order number:</strong> {orderNumber}
									</Typography>
								)}
									<Typography variant="body2">
										We have sent a confirmation to your email. Our manager will contact you shortly to confirm shipping details.
									</Typography>
							</Box>
						</Alert>
					</Box>
				)}

                <Grid container spacing={3} sx={{ alignItems: { md: 'flex-start' } }}>
                    <Grid size={{ xs: 12, md: 7 }} sx={{ display: { md: 'flex' }, order: { xs: 1, md: 1 }, flexDirection: 'column' }}>
                        <Paper variant="outlined" sx={{ 
                            p: 3, 
                            mb: { xs: 3, md: 0 }, 
                            width: '100%', 
                            height: { xs: 'auto', md: 'auto' }, 
                            display: 'flex', 
                            flexDirection: 'column', 
                            bgcolor: '#ffffff', 
                            borderRadius: '0.5rem', 
                            border: '1px solid #e0e0e0', 
                            boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)'
                        }}>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                    <CartIcon sx={{ color: '#2c2c2c', mr: 1 }} />
                                    <Typography 
                                        variant="h4" 
                                        className="hipster-heading"
                                        sx={{ 
                                            fontWeight: 300, 
                                            color: '#1a1a1a',
                                            fontSize: '1.5rem',
                                            fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                            letterSpacing: '-0.02em',
                                            textTransform: 'lowercase'
                                        }}
                                    >
                                        items in cart
                                    </Typography>
                                </Box>
							{items.length === 0 ? (
									<Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: { xs: 240, md: '60vh' } }}>
										<Box sx={{ textAlign: 'center' }}>
											<Box sx={{ display: 'inline-flex', mb: 1.5, color: 'text.secondary' }}>
												<svg width="56" height="56" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
													<path d="M3 3h1.5l2.4 10.02c.11.47.53.8 1.01.8H17a1 1 0 0 0 .98-.8L19 7H6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
													<circle cx="9" cy="20" r="1" stroke="currentColor" stroke-width="1.5"/>
													<circle cx="16" cy="20" r="1" stroke="currentColor" stroke-width="1.5"/>
												</svg>
											</Box>
											<Typography variant="h6" sx={{ mb: 0.5, color: 'text.secondary' }}>Your cart is empty</Typography>
											<Typography variant="body2" color="text.secondary">Add some items to get started</Typography>
										</Box>
									</Box>
                            ) : (
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                    <Box sx={{ 
                                        maxHeight: items.length > 3 ? 'calc(3 * 10rem + 3.2rem)' : 'none',
                                        overflowY: items.length > 3 ? 'auto' : 'visible', 
                                        pr: 1,
                                        height: 'fit-content'
                                    }} className="custom-scrollbar">
                                        {items.map((item) => (
                                            <CartItemCard key={item.id} item={item} onRemove={removeItem} onUpdateQty={updateQuantity} />
                                        ))}

                                    {/* Summary under items (left column) */}
                                    </Box>
                                    <Paper variant="outlined" className="cart-summary-card" sx={{ 
                                        p: 3, 
                                        flexShrink: 0,
                                        border: '1px solid #e0e0e0', 
                                        bgcolor: '#ffffff', 
                                        borderRadius: '0.5rem', 
                                        boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)' 
                                    }}>
                                        <Box className="cart-summary-heading" sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                            <ReceiptIcon sx={{ color: '#2c2c2c', mr: 1 }} />
                                            <Typography 
                                                variant="h5" 
                                                className="hipster-heading"
                                                sx={{ 
                                                    fontWeight: 300, 
                                                    color: '#1a1a1a',
                                                    fontSize: '1.25rem',
                                                    fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                    letterSpacing: '-0.02em',
                                                    textTransform: 'lowercase'
                                                }}
                                            >
                                                summary
                                            </Typography>
                                        </Box>
                                        <Box className="cart-summary-row" sx={{ display: "flex", justifyContent: "space-between", py: 1.5, alignItems: "center" }}>
                                            <Typography sx={{ 
                                                color: '#1a1a1a', 
                                                fontSize: '1rem',
                                                fontWeight: 300,
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase'
                                            }}>
                                                items subtotal
                                            </Typography>
                                            <Typography sx={{ 
                                                color: '#1a1a1a', 
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em'
                                            }}>
                                                ${total.toFixed(2)}
                                            </Typography>
                                        </Box>
                                        <Box className="cart-summary-row" sx={{ display: "flex", justifyContent: "space-between", py: 1.5, alignItems: "center" }}>
                                            <Typography sx={{ 
                                                color: '#1a1a1a', 
                                                fontSize: '1rem',
                                                fontWeight: 300,
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase'
                                            }}>
                                                shipping
                                            </Typography>
                                            <Typography sx={{ 
                                                color: shippingCost === 0 ? '#66bb6a' : '#1a1a1a', 
                                                fontSize: '1rem',
                                                fontWeight: 500,
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase'
                                            }}>
                                                {shippingCost === 0 ? "free" : `$${shippingCost.toFixed(2)}`}
                                            </Typography>
                                        </Box>
                                        {items.length > 0 && (
                                            <Typography variant="body2" className="cart-summary-note" sx={{ 
                                                pb: 1.5,
                                                color: total >= freeShippingThreshold ? '#66bb6a' : '#4a4a4a',
                                                fontSize: '0.875rem',
                                                fontWeight: 300,
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase',
                                                fontStyle: total >= freeShippingThreshold ? 'italic' : 'normal'
                                            }}>
                                                {total >= freeShippingThreshold ? "✓ you have free shipping! 🤩" : `add $${(freeShippingThreshold - total).toFixed(2)} for free shipping 🤔`}
                                            </Typography>
                                        )}
                                        <Divider sx={{ my: 1 }} />
                                        <Box className="cart-summary-row" sx={{ display: "flex", justifyContent: "space-between", py: 1.5, alignItems: "center" }}>
                                            <Typography sx={{ 
                                                fontWeight: 500, 
                                                fontSize: '1.1rem',
                                                color: '#1a1a1a',
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em',
                                                textTransform: 'lowercase'
                                            }}>
                                                total
                                            </Typography>
                                            <Typography sx={{ 
                                                fontWeight: 600, 
                                                fontSize: '1.1rem',
                                                color: '#1a1a1a',
                                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                                letterSpacing: '-0.02em'
                                            }}>
                                                ${grandTotal.toFixed(2)}
                                            </Typography>
                                        </Box>
                                    </Paper>

                                </Box>
							)}
						</Paper>

						
						

						
					</Grid>

                    <Grid size={{ xs: 12, md: 5 }} sx={{ display: 'flex', flexDirection: 'column', order: { xs: 2, md: 2 } }}>
                        <Paper variant="outlined" sx={{ 
                            p: 3, 
                            mb: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)'
                        }}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<PersonIcon sx={{ color: '#2c2c2c', mr: 1 }} />
								<Typography 
									variant="h5" 
									className="hipster-heading"
									sx={{ 
										fontWeight: 300, 
										color: '#1a1a1a',
										fontSize: '1.25rem',
										fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
										letterSpacing: '-0.02em',
										textTransform: 'lowercase'
									}}
								>
									contact details
								</Typography>
							</Box>
							<Grid container spacing={2}>
								<Grid size={{ xs: 12, md: 6 }}>
									<TextField 
										size="small" 
										margin="dense" 
										label="full name" 
										fullWidth 
										value={fullName} 
										onChange={(e) => setFullName(e.target.value)}
										InputProps={{
											startAdornment: <PersonIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<TextField 
										size="small" 
										margin="dense" 
										label="email" 
										type="email" 
										fullWidth 
										value={email} 
										onChange={(e) => setEmail(e.target.value)}
										InputProps={{
											startAdornment: <EmailIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
								</Grid>
								<Grid size={{ xs: 12, md: 6 }}>
									<TextField 
										size="small" 
										margin="dense" 
										label="phone" 
										placeholder="+380XXXXXXXXX" 
										fullWidth 
										value={phone} 
										onChange={(e) => setPhone(e.target.value)}
										InputProps={{
											startAdornment: <PhoneIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
								</Grid>
								<Grid size={{ xs: 12 }}>
									<Box sx={{ position: 'relative' }}>
										<TextField 
											size="small" 
											margin="dense" 
											label="order comment (optional)" 
											multiline 
											minRows={2} 
											maxRows={4}
											fullWidth 
											value={notes} 
											onChange={(e) => setNotes(e.target.value)}
											InputProps={{
												startAdornment: <CommentIcon sx={{ color: '#6b7c6b', mr: 1, fontSize: '1.1rem', alignSelf: 'flex-start', mt: 1 }} />
											}}
											inputProps={{
												maxLength: 500
											}}
											className="cart-hipster-input"
										/>
										<Box sx={{
											position: 'absolute',
											top: '0.75rem',
											right: '1rem',
											color: '#6b7c6b',
											fontSize: '0.75rem',
											pointerEvents: 'none',
											zIndex: 1,
											padding: '0.25rem 0.5rem',
											backgroundColor: 'rgba(255, 255, 255, 0.9)',
											borderRadius: '0.25rem'
										}}>
											{notes.length}/500
										</Box>
									</Box>
								</Grid>
							</Grid>
						</Paper>

                        <Paper variant="outlined" sx={{ 
                            p: 3, 
                            mb: 3,
                            border: '1px solid #e0e0e0',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)'
                        }}>
							<Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
								<LocalShippingIcon sx={{ color: '#2c2c2c', mr: 1 }} />
								<Typography 
									variant="h5" 
									className="hipster-heading"
									sx={{ 
										fontWeight: 300, 
										color: '#1a1a1a',
										fontSize: '1.25rem',
										fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
										letterSpacing: '-0.02em',
										textTransform: 'lowercase'
									}}
								>
									delivery
								</Typography>
							</Box>
                            <FormControl>
								<FormLabel id="delivery-type-label" sx={{ 
									fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
									letterSpacing: '-0.02em',
									textTransform: 'lowercase',
									fontWeight: 300,
									color: '#1a1a1a'
								}}>delivery method</FormLabel>
                                <RadioGroup
                                    row
                                    aria-labelledby="delivery-type-label"
                                    name="delivery-type"
                                    value={deliveryMethod}
                                    onChange={(e) => setDeliveryMethod(e.target.value as "courier" | "nova_poshta")}
                                >
										<FormControlLabel value="nova_poshta" control={<Radio />} label="post office (branch)" />
										<FormControlLabel value="courier" control={<Radio />} label="courier" />
                                </RadioGroup>
                            </FormControl>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
									<TextField 
										size="small" 
										margin="dense" 
										label="city" 
										fullWidth 
										value={city} 
										onChange={(e) => setCity(e.target.value)}
										InputProps={{
											startAdornment: <LocationOnIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
                                </Grid>
                                {deliveryMethod === 'courier' ? (
                                    <>
                                        <Grid size={{ xs: 12, sm: 12, md: 6 }}>
												<TextField 
													size="small" 
													margin="dense" 
													label="street" 
													fullWidth 
													value={street} 
													onChange={(e) => setStreet(e.target.value)}
													InputProps={{
														startAdornment: <HomeIcon sx={{ color: '#2c2c2c', mr: 1 }} />
													}}
													className="cart-hipster-input"
												/>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
												<TextField 
													size="small" 
													margin="dense" 
													label="house" 
													fullWidth 
													value={house} 
													onChange={(e) => setHouse(e.target.value)}
													InputProps={{
														startAdornment: <HomeIcon sx={{ color: '#2c2c2c', mr: 1 }} />
													}}
													className="cart-hipster-input"
												/>
                                        </Grid>
                                        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
												<TextField 
													size="small" 
													margin="dense" 
													label="apt/office" 
													fullWidth 
													value={apartment} 
													onChange={(e) => setApartment(e.target.value)}
													InputProps={{
														startAdornment: <BusinessIcon sx={{ color: '#2c2c2c', mr: 1 }} />
													}}
													className="cart-hipster-input"
												/>
                                        </Grid>
                                    </>
                                ) : (
                                    <Grid size={{ xs: 12, sm: 12, md: 6 }}>
										<TextField 
											size="small" 
											margin="dense" 
											label="post office branch" 
											placeholder="Branch number" 
											fullWidth 
											value={npBranch} 
											onChange={(e) => setNpBranch(e.target.value)}
											InputProps={{
												startAdornment: <BusinessIcon sx={{ color: '#2c2c2c', mr: 1 }} />
											}}
											className="cart-hipster-input"
										/>
                                    </Grid>
                                )}
                            </Grid>
                        </Paper>
                        <Paper variant="outlined" sx={{ 
                            p: 3, 
                            border: '1px solid #e0e0e0',
                            borderRadius: '0.5rem',
                            boxShadow: '0 0.125rem 0.5rem rgba(0,0,0,0.08)'
                        }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <CreditCardIcon sx={{ color: '#2c2c2c', mr: 1 }} />
                                <Typography 
                                    variant="h5" 
                                    className="hipster-heading"
                                    sx={{ 
                                        fontWeight: 300, 
                                        color: '#1a1a1a',
                                        fontSize: '1.25rem',
                                        fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                        letterSpacing: '-0.02em',
                                        textTransform: 'lowercase'
                                    }}
                                >
                                    payment
                                </Typography>
                            </Box>
                            <Typography variant="body2" sx={{ 
                                mb: 1, 
                                color: '#4a4a4a',
                                fontFamily: 'var(--font-space-grotesk), "Space Grotesk", "Inter", "Helvetica Neue", sans-serif',
                                letterSpacing: '-0.02em',
                                textTransform: 'lowercase',
                                fontWeight: 300
                            }}>
                                payment method: online card
                            </Typography>
                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid size={{ xs: 12, sm: 12, md: 6 }}>
                                    <TextField 
										size="small" 
										margin="dense" 
										label="card number" 
										placeholder="1111 2222 3333 4444" 
										fullWidth 
										value={cardNumber} 
										onChange={(e) => setCardNumber(e.target.value)}
										InputProps={{
											startAdornment: <CreditCardIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                    <TextField 
										size="small" 
										margin="dense" 
										label="mm/yy" 
										placeholder="MM/YY" 
										fullWidth 
										value={cardExpiry} 
										onChange={(e) => setCardExpiry(e.target.value)}
										InputProps={{
											startAdornment: <CalendarTodayIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
                                </Grid>
                                <Grid size={{ xs: 12, sm: 6, md: 6 }}>
                                    <TextField 
										size="small" 
										margin="dense" 
										label="cvc" 
										placeholder="123" 
										fullWidth 
										value={cardCvc} 
										onChange={(e) => setCardCvc(e.target.value)}
										InputProps={{
											startAdornment: <SecurityIcon sx={{ color: '#2c2c2c', mr: 1 }} />
										}}
										className="cart-hipster-input"
									/>
                                </Grid>
                            </Grid>
                            
                            {/* Proceed to payment button inside Payment section */}
                            <Button
                                startIcon={<CreditCardIcon />}
                                className="btn btn--dark btn--block cart-checkout-button"
                                disabled={items.length === 0 || submitting}
                                onClick={handleSubmit}
                            >
                                {submitting ? "processing..." : "proceed to payment"}
                            </Button>
                        </Paper>
                    </Grid>
				</Grid>
			</Box>
		</Box>
	);
}
