import React from 'react'
import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { ProductContext } from '../context/ProductContext'
import { CartContext } from '../context/CartContext'
//import { ShopContext } from '../context/ShopContext'
import { useSearchParams } from 'react-router-dom'
import { useEffect } from 'react'
import {toast} from 'react-toastify'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Verify = () => {

    const { backendUrl } = useContext(ProductContext)
    const { setCartItems } = useContext(CartContext)
    //const { navigate, token, setCartItems, backendUrl } = useContext(ShopContext)

    const { token } = useContext(AuthContext)
    const [searchParams, setSearchParams] = useSearchParams()

    
    const navigate = useNavigate()
    
    const success = searchParams.get('success')
    const orderId = searchParams.get('orderId')



    const verifyPayment = async () => {
        try {

            if (!token) {
                return null
            }

            const response = await axios.post(backendUrl + '/api/order/verifyStripe', { success, orderId }, { headers: { token } })
          
            if (response.data.success) {
                setCartItems({})
                navigate('/orders')
            } else {
                navigate('/cart')
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    useEffect(() => {
        verifyPayment()
    }, [token])

    return (
        <div>

        </div>
    )
}

export default Verify