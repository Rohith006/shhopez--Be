/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React,{ useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { getUserCart, emptyCart, userAddress, applyCoupon } from '../function/user'
import { toast } from "react-toastify"
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

const Checkout = ({ history }) => {

    const [ total, setTotal] = useState(0)
    const [ products, setProducts] = useState([])
    const [address, setAddress] = useState("");
    const [addressSaved, setAddressSaved] = useState(false);
    const [coupon, setCoupon] = useState("");
    const [totalAfterDiscount, setTotalAfterDiscount] = useState("");
    const [discountError, setDiscountError] = useState(""); 


    const { user } = useSelector((state) => ({ ...state}))
    const dispatch = useDispatch()

    useEffect(() => {
        getUserCart(user.token)
        .then((res) =>{
            // console.log("cart ", JSON.stringify(res.data, null, 4))
            setProducts(res.data.products)
            setTotal(res.data.cartTotal)

        })
    }, [])


    const saveAddressToDb = () => {
        userAddress(user.token, address).then((res) => {
            if (res.data.ok) {
                setAddressSaved(true);
                toast.success("Address saved");
            }
        });
    };

    const handleEmptyCart = () =>{
        if ( typeof window !== 'undefined'){
            localStorage.removeItem("cart")
        }

        dispatch({
            type: "ADD_TO_CART",
            payload: []
        })
        emptyCart(user.token).then((res) =>{
            setProducts([])
            setTotal(0)
            setTotalAfterDiscount(0);
            setCoupon("");
            toast.success("Cart is emapty. Contniue shopping.");
        })
    }

    const applyDiscountCoupon = () => {
        console.log("send coupon to backend", coupon);
        applyCoupon(user.token, coupon).then((res) => {
            console.log("RES ON COUPON APPLIED", res.data);
            if (res.data) {
                setTotalAfterDiscount(res.data);
                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: true,
                });
            }
          // error
            if (res.data.err) {
                setDiscountError(res.data.err);
                // update redux coupon applied true/false
                dispatch({
                    type: "COUPON_APPLIED",
                    payload: false,
                });
            }
        });
    };;

    return (
        <div className="row">
            <div className="col-md-6">
                <h4>Delivery Address</h4>
                <br />
                <br />
                <ReactQuill theme="snow" value={address} onChange={setAddress} />
                <button className="btn btn-primary mt-2" onClick={saveAddressToDb}>
                    Save
                </button>
                <hr />
                <h4>Enter your CouponId</h4>
                <>
                    <input
                        onChange={(e) => {
                            setCoupon(e.target.value)           
                            setDiscountError("");
                        }}
                        value={coupon}
                        type="text"
                        className="form-control"
                    />
                    <button onClick={applyDiscountCoupon} className="btn btn-primary mt-2">
                        Apply
                    </button>
                    </>
                <br />
                <br />
                {discountError && <p className="bg-danger p-2">{discountError}</p>}
            </div>

            <div className="col-md-6">
                <h4>Your Order Summary</h4>
                <hr />
                <p>Products {products.length}</p>
                <hr />
                {products.map((p, i) => (
                    <div key={i}>
                        <p>
                        {p.product.title} ({p.color}) x {p.count} ={" "}
                        {p.product.price * p.count}
                        </p>
                    </div>
                ))}
                <hr />
                <p> <b>Your Cart Total: {total}</b></p>
                {totalAfterDiscount > 0 && (
                    <p className="bg-success p-2">
                        Discount Applied: Total Payable: ${totalAfterDiscount}
                    </p>
                )}

                <div className="row">
                    <div className="col-md-6">
                        <button className="btn btn-primary" onClick={()=> history.push('/placeorder')}>
                            Place Order
                        </button>
                    </div>

                    <div className="col-md-6">
                        <button 
                            className="btn btn-primary"
                            onClick={handleEmptyCart}
                            disabled={!products.length}
                        >Empty/Clear Cart</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
