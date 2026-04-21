import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import api from '../lib/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)

function normalizeCart(cart) {
  if (!cart?.items) {
    return []
  }

  return cart.items
    .filter((item) => item.product)
    .map((item) => ({
      cartItemId: item._id,
      id: item.product._id,
      name: item.product.name,
      category: item.product.category,
      description: item.product.description,
      image: item.product.images?.[0] || '',
      price: item.product.price,
      selectedVariant: item.selectedSize,
      quantity: item.quantity,
      sizes: item.product.sizes || [],
    }))
}

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth()
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    if (!isAuthenticated) {
      setCartItems([])
      return
    }

    try {
      const { data } = await api.get('/cart')
      setCartItems(normalizeCart(data))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to fetch cart')
    }
  }

  useEffect(() => {
    fetchCart()
  }, [isAuthenticated])

  const addToCart = async (product, selectedVariant) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart')
      return
    }

    const productId = typeof product === 'string' ? product : product._id || product.id
    const chosenVariant = selectedVariant ?? product.sizes?.[0] ?? 'Standard'

    try {
      setLoading(true)
      const { data } = await api.post('/cart', {
        productId,
        quantity: 1,
        selectedSize: chosenVariant,
      })
      setCartItems(normalizeCart(data))
      toast.success('Added to cart')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to add item')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (cartItemId, quantity) => {
    try {
      const { data } = await api.put(`/cart/${cartItemId}`, { quantity })
      setCartItems(normalizeCart(data))
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to update quantity')
    }
  }

  const removeItem = async (cartItemId) => {
    try {
      const { data } = await api.delete(`/cart/${cartItemId}`)
      setCartItems(normalizeCart(data))
      toast.success('Item removed')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to remove item')
    }
  }

  const clearCart = async () => {
    await Promise.all(cartItems.map((item) => removeItem(item.cartItemId)))
  }

  const value = useMemo(() => {
    const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const shipping = itemCount > 0 ? 18 : 0
    const total = subtotal + shipping

    return {
      cartItems,
      itemCount,
      subtotal,
      shipping,
      total,
      loading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeItem,
      clearCart,
    }
  }, [cartItems, loading])

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const context = useContext(CartContext)

  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }

  return context
}
