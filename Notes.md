
#Work in Progress


###Add Apis for  Processing payment

`export async function sendDir(value) {
    console.log(value)
  try {
    const response = await fetch("/api/organize", {  // <-- matches backend
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dirPath: value })  // proper JSON
    });
  }
}
`

##Known Issue

- The order API is not sending the payment method detail to the payment api





  


