export const initializePaystackPayment = (email, amount, onSuccess, onClose) => {
  const handler = window.PaystackPop.setup({
    key: import.meta.env.VITE_PAYSTACK_PUBLIC_KEY,
    email: email,
    amount: amount * 100, // Convert to kobo
    currency: "NGN",
    ref: "BAO-" + Math.floor(Math.random() * 1000000000 + 1),
    onClose: () => {
      if (onClose) onClose()
    },
    callback: (response) => {
      if (onSuccess) onSuccess(response)
    },
  })
  handler.openIframe()
}

export const verifyPayment = async (reference) => {
  try {
    const response = await fetch(`/api/verify-payment?reference=${reference}`)
    const data = await response.json()
    return data
  } catch (error) {
    console.error("Payment verification error:", error)
    throw error
  }
}
